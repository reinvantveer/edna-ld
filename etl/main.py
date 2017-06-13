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
    return mongodb, file_collection, schema_collection, source_data_collection


def run(file_path):
    # Init logging and database
    init_logging()
    client, file_col, schema_col, source_data_col = init_mongodb(config)

    # Set up counters and file index
    successfully_ingested_files = 0
    file_counter = 0
    file_list = DirLister.get_file_list_recursive(file_path)

    logging.info('Processing %d files from %s' % (len(file_list), file_path))

    for file in file_list:
        file_counter += 1
        ProgressBar.update_progress(file_counter / len(file_list), ('Processing file %s' % file))

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
                logging.error('CSV parsing error on file %s: %s' % (file, e))
                # if the data loading doesn't work out, just log the error and skip the file
                continue

        # Generate the schema and try to ingest it
        try:
            schema_data = SchemaGenerator.generate_schema(data)
        except Exception as e:
            logging.error('Schema error on file %s: %s' % (file, e))
            continue

        schema_hash = FileStatter.sha1(schema_data)
        schema = {
            '_id': schema_hash,
            'schema': schema_data,
        }

        try:
            schema_col.insert_one(schema)
        except DuplicateKeyError:
            logging.debug('Schema %s was previously processed' % schema_hash)
        except Exception as e:
            logging.error('Ingest schema error on file %s: %s' % (file, e))
            # if the schema loading doesn't work out, just log the error and skip the file
            continue

        # Store the source data
        source_data_doc_sha1 = FileStatter.sha1(data)
        source_data_doc = {
            '_id': source_data_doc_sha1,
            'data': data
        }

        try:
            source_data_col.insert_one(document=source_data_doc)
        except DuplicateKeyError:
            logging.debug('Sourcedata with sha1 %s was previously processed' % source_data_doc_sha1)
        except Exception as e:
            logging.error('Ingest source data error on file %s: %s' % (file, e))
            continue

        # Finalize the file document with the data reference and the schema reference
        document['data'] = source_data_doc_sha1
        document['schema'] = schema['_id']

        try:
            file_col.insert_one(document=document)
        except DuplicateKeyError:
            logging.warning('File %s was previously processed, skipping' % file)
            # Skip to next file
            continue
        except Exception as e:
            logging.error('Ingest file metadata error on file %s: %s' % (file, e))
            continue

        logging.debug('File %s was successfully ingested' % file)
        successfully_ingested_files += 1

    logging.info('Finished!')
    logging.info('Successfully ingested %d files of %d' % (successfully_ingested_files, len(file_list)))
    client.close()

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Please supply the file path to process, exiting')
    else:
        file_path = sys.argv[1]
        run(file_path)
