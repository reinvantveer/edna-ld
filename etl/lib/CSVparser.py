import pandas as pd
import csv


class CSVparser:

    @staticmethod
    def to_dict(filepath):
        with open(filepath) as file:
            try:
                dialect = csv.Sniffer().sniff(file.read(1024))
            except:
                raise ValueError('Can\'t return dictionary from empty or invalid csv file %s' % filepath)
            frame = pd.read_csv(filepath, quotechar=dialect.quotechar, delimiter=dialect.delimiter)
            dict = frame.to_dict(orient='record')
            if not dict:
                raise ValueError('Can\'t return dictionary from invalid csv file %s' % filepath)
            return dict
