import chardet
import pandas as pd
import csv
from io import StringIO
from bs4 import UnicodeDammit


class CSVparser:

    @staticmethod
    def to_dict(file_path):
        with open(file_path, 'rb') as detect_file_encoding:
            detection = chardet.detect(detect_file_encoding.read())

        if detection['encoding'] == 'ascii':
            with open(file_path, encoding='ascii') as file:
                data = file.read()
        elif detection['encoding'] == 'ISO-8859-9':
            # Some files with "ë" in them are parsed erroneously as iso-8859-9 or latin-5 or Turkish
            with open(file_path, encoding='utf-8') as file:
                data = file.read()
        else:
            try:
                with open(file_path, encoding=detection['encoding']) as non_unicode_file:
                    data = non_unicode_file.read()
            except Exception as e:
                raise ValueError('Can\'t return dictionary from empty or invalid csv file %s due to %s' % (file_path, e))

        if not data:
            raise ValueError('Can\'t return dictionary from empty or invalid csv file %s' % file_path)

        dammit = UnicodeDammit(data)
        dialect = csv.Sniffer().sniff(data)

        frame = pd.read_csv(
            filepath_or_buffer=StringIO(dammit.unicode_markup),
            quotechar=dialect.quotechar,
            delimiter=dialect.delimiter,
        )
        dictionary = frame.to_dict(orient='record')

        if not dictionary:
            raise ValueError('Can\'t return dictionary from invalid csv file %s' % file_path)

        return dictionary
