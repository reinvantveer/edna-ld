import pandas as pd
import csv


class CSVparser:

    @staticmethod
    def to_dict(file_path):
        with open(file_path, encoding='cp1252') as file:
            try:
                dialect = csv.Sniffer().sniff(file.read(1024))
            except:
                raise ValueError('Can\'t return dictionary from empty or invalid csv file %s' % file_path)
            frame = pd.read_csv(
                file_path,
                quotechar=dialect.quotechar,
                delimiter=dialect.delimiter,
                encoding='cp1252',
                parse_dates=True
            )
            dictionary = frame.to_dict(orient='record')
            if not dictionary:
                raise ValueError('Can\'t return dictionary from invalid csv file %s' % file_path)
            return dictionary
