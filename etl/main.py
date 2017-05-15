#!/usr/bin/python3
import inspect
import json
import logging
import os
import sys
import yaml
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

import lib.DirLister as DirLister
import lib.FileStatter as FileStatter
import lib.CSVparser as CSVparser
import lib.MIFparser as MIFparser
import lib.SchemaGenerator as SchemaGenerator
import lib.ProgressBar as ProgressBar

if sys.version_info[0] < 3:
    raise RuntimeError("You're using Python 2, this script requires version 3.")

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
# Load configuration from yaml file
config = yaml.load(open(os.path.join(current_dir, '..', 'config.yml')))


def init_logging(cfg=config):
    root = logging.getLogger()
    root.setLevel(logging.DEBUG)
    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

    # init the console handler
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(formatter)
    root.addHandler(ch)

    # init the DEBUG (and up/more severe) logfile handler
    dfh = logging.FileHandler(cfg['logging']['debug'])
    dfh.setLevel(logging.DEBUG)
    dfh.setFormatter(formatter)
    root.addHandler(dfh)

    # init the ERROR logfile handler
    efh = logging.FileHandler(cfg['logging']['error'])
    efh.setLevel(logging.ERROR)
    efh.setFormatter(formatter)
    root.addHandler(efh)


def init_mongodb(cfg=config):
    mongodb = MongoClient(cfg['mongo']['host'], cfg['mongo']['port'])
    db = mongodb[cfg['mongo']['database']]
    file_collection = db[cfg['mongo']['fileCollection']]
    schema_collection = db[cfg['mongo']['schemaCollection']]
    source_data_collection = db[cfg['mongo']['sourcedataCollection']]
    return file_collection, schema_collection, source_data_collection


def run(file_path):
    init_logging()
    file_col, schema_col, source_data_col = init_mongodb(config)

    file_list = DirLister.get_file_list_recursive(file_path)
    logging.info('Processing %d files from %s' % (len(file_list), file_path))

    file_counter = 0

    for file in file_list:
        file_counter += 1
        ProgressBar.update_progress(file_counter / len(file_list))

        # get the file stats
        document = {
            'stats': FileStatter.stats(file),
            'filePath': file,
            '_id': file,
            'hash': FileStatter.sha1_from_file(file)
        }

        # Load the data or skip if unable
        if file.lower().endswith('.mif'):
            try:
                data = MIFparser.to_dict(file)
            except ValueError as e:
                logging.error(e)
                # if the data loading doesn't work out, just log the error and skip the file
                continue
        elif file.lower().endswith('.mid'):
            continue  # .mid files are processed along with its 'parented' .mif file
        else:
            try:
                data = CSVparser.to_dict(file)
            except ValueError as e:
                logging.error(e)
                # if the data loading doesn't work out, just log the error and skip the file
                continue

        # Generate the schema and try to ingest it
        try:
            schema_data = SchemaGenerator.generate_schema(data)
        except Exception as e:
            logging.error('Schema error on file %s: %s' % (file, e))
            continue

        schema_hash = FileStatter.sha1(json.dumps(schema_data))
        schema = {
            '_id': schema_hash,
            'schemadata': schema_data,
        }

        try:
            schema_col.insert_one(schema)
        except DuplicateKeyError:
            logging.debug('Schema %s was previously processed, skipping' % schema_hash)
        except Exception as e:
            logging.error(e)
            # if the schema loading doesn't work out, just log the error and skip the file
            continue

        # Finalize the file document with the loaded data and the schema reference
        document['data'] = data
        document['schema'] = schema['_id']

        try:
            file_col.insert_one(document=document)
        except DuplicateKeyError:
            logging.warning('File %s was previously processed, skipping' % file)
            # Skip to next file
            continue
        except Exception as e:
            logging.error(e)
            continue

        logging.debug('File %s was successfully ingested' % file)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Please supply the file path to process, exiting')
    else:
        file_path = sys.argv[1]
        run(file_path)
