import inspect
import unittest

import collections
import os
import sys

sys.path.insert(0, '..')

from lib import SchemaGenerator
from lib import CSVparser

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))


def deep_sort(obj):
    """
    Recursively sort list or dict nested lists
    """

    if isinstance(obj, dict):
        _sorted = {}
        for key in sorted(obj):
            _sorted[key] = deep_sort(obj[key])

    elif isinstance(obj, list):
        new_list = []
        for val in obj:
            new_list.append(deep_sort(val))
        _sorted = sorted(new_list)

    else:
        _sorted = obj

    return _sorted


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

    def test_special_char_escaping(self):
        data = CSVparser.to_dict(current_dir + '/mockups/schema/specialCharacterTest/test.csv')
        schema = SchemaGenerator.generate_schema(data)
        self.assertDictEqual(deep_sort(schema), deep_sort({
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'Data\uff0eColumn1': {'type': 'string'},
                    'Data$Column2': {'type': 'string'}
                },
                'required': ['Data\uff0eColumn1', 'Data$Column2']
            }
        }))
