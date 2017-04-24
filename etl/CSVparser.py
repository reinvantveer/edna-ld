import pandas as pd
import csv
import json


class CSVparser:

    def to_json(filepath):
        with open(filepath) as file:
            dialect = csv.Sniffer().sniff(file.read(1024))
            frame = pd.read_csv(filepath, quotechar=dialect.quotechar, delimiter=dialect.delimiter)
        return json.dumps(frame.to_dict(orient='record'), sort_keys=True)
