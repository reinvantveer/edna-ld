import chardet
import pandas as pd
import csv
from io import StringIO
from bs4 import UnicodeDammit


class CSVparser:
    @staticmethod
    def to_dict(file_path):
        with open(file_path, 'rb') as detect_file_encoding:
            # restrict encoding parsing to 2 ** 24 chars
            detection = chardet.detect(detect_file_encoding.read(2 ** 24))

        if detection['encoding'] == 'ISO-8859-9':
            # Some files with "ë" in them are erroneously parsed as iso-8859-9/latin-5/Turkish
            # Re-assign to utf-8!
            detection['encoding'] = 'utf-8'

        try:
            with open(file_path, encoding=detection['encoding']) as standard_file:
                data = standard_file.read()
        except Exception as e:
            raise ValueError('Can\'t return dictionary from empty or invalid csv file %s: %s' % (file_path, e))

        if not data:
            raise ValueError('Can\'t return dictionary from empty or invalid csv file %s' % file_path)

        dammit = UnicodeDammit(data)

        try:
            dialect = csv.Sniffer().sniff(data)
        except Exception as e:
            raise ValueError('Unable to parse file %s: %s' % (file_path, e))

        frame = pd.read_csv(
            filepath_or_buffer=StringIO(dammit.unicode_markup),
            quotechar=dialect.quotechar,
            delimiter=dialect.delimiter,
        )
        dictionary = frame.to_dict(orient='record')

        if not dictionary:
            raise ValueError('Can\'t return dictionary from invalid csv file %s' % file_path)

        for record in dictionary:
            for key in record:
                if '.' in key:
                    new_key = key.replace('.', '\uff0e')
                    record[new_key] = record.pop(key)

        return dictionary
