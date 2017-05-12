import inspect
import unittest
import os

import etl.lib.SchemaGenerator as SchemaGenerator
from etl.lib.CSVparser import CSVparser

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))


class TestSchemaGenerator(unittest.TestCase):
    def test_schema_generator(self):
        data = CSVparser.to_dict(current_dir + '/mockups/csv/test_simple.csv')
        schema = SchemaGenerator.generate_schema(data)
        print(schema)
        self.assertEqual(schema, {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'column1': {'type': 'string'},
                    'column2': {'type': 'string'}
                },
                'required': ['column1', 'column2']
            }
        })
