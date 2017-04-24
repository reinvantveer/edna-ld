import pandas as pd
import csv
import json


class CSVparser:

    @staticmethod
    def to_json(filepath):
        with open(filepath) as file:
            try:
                dialect = csv.Sniffer().sniff(file.read(1024))
            except:
                raise ValueError(('Can\'t return JSON from empty or invalid csv file %s' % filepath))
            frame = pd.read_csv(filepath, quotechar=dialect.quotechar, delimiter=dialect.delimiter)
            jsondata = json.dumps(frame.to_dict(orient='record'), sort_keys=True)
            if jsondata == '[]':
                raise ValueError(('Can\'t return JSON from invalid csv file %s' % filepath))
            return jsondata
