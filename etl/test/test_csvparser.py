import inspect
import unittest

import os

import etl.lib.CSVparser as CSVparser

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))


class TestCsvToJson(unittest.TestCase):
    def test_simple(self):
        data = CSVparser.to_dict(filepath=current_dir + '/mockups/csv/test_simple.csv')
        self.assertEqual(data, [{"column1": "data1", "column2": "data2"}, {"column1": "data3", "column2": "data4"}])

    def test_semicolons(self):
        data = CSVparser.to_dict(filepath=current_dir + '/mockups/csv/test_semicolons.csv')
        self.assertEqual(data, [{"column1": "data1", "column2": "data2"}, {"column1": "data3", "column2": "data4"}])

    def test_numerical(self):
        data = CSVparser.to_dict(filepath=current_dir + '/mockups/csv/test_numbers.csv')
        self.assertEqual(data, [{"column1": "data1", "num": 1}, {"column1": "data3", "num": 2}])

    def test_double_quotes(self):
        data = CSVparser.to_dict(filepath=current_dir + '/mockups/csv/test_double_quotes.csv')
        self.assertEqual(data, [{"column1": "data1", "num": 1}, {"column1": "data3", "num": 2}])

    def test_single_quotes(self):
        data = CSVparser.to_dict(filepath=current_dir + '/mockups/csv/test_single_quotes.csv')
        self.assertEqual(data, [{"column1": "data1", "num": 1}, {"column1": "data3", "num": 2}])

    def test_no_csv(self):
        with self.assertRaisesRegex(ValueError, 'invalid csv'):
            CSVparser.to_dict(filepath=current_dir + '/mockups/csv/test_no_csv.txt')

    def test_empty_csv(self):
        with self.assertRaisesRegex(ValueError, 'empty or invalid'):
            CSVparser.to_dict(filepath=current_dir + '/mockups/csv/empty.csv')


def main():
    unittest.main()


if __name__ == '__main__':
    main()
