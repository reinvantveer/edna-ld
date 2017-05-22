import inspect
import unittest
import os
import sys

sys.path.insert(0, '..')

from lib import SchemaGenerator
from lib import CSVparser

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))


class TestSchemaGenerator(unittest.TestCase):
    def test_numpy_float_error(self):
        data = CSVparser.to_dict(current_dir + '/mockups/schema/numpy-float64/float64.csv')
        schema = SchemaGenerator.generate_schema(data)
        self.assertEqual(schema, {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'number'},
                    'put': {'type': 'number'}
                },
                'required': ['id', 'put']
            }
        })

    def test_schema_generator(self):
        data = CSVparser.to_dict(current_dir + '/mockups/csv/test_simple.csv')
        schema = SchemaGenerator.generate_schema(data)
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
