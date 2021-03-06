import inspect
import unittest
import os
import sys

sys.path.insert(0, '..')

from lib import MIFparser

currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))


class TestMifToDict(unittest.TestCase):
    def test_simple(self):
        data = MIFparser.to_dict(currentdir + '/mockups/mif/test.mif')
        self.assertEqual(data, [{
            'WKT': 'POLYGON ((-805746.744932638 -5717724.87367326,-836150.816258327 '
                   '-5650307.1502989,-744938.602281261 '
                   '-5576940.80427387,-635880.520352161 '
                   '-5627173.61776849,-703298.243726514 '
                   '-5732926.9093361,-805746.744932638 -5717724.87367326))',
            "id": 1,
            "test_text": "this is a test"
        }])

    # TODO: unit test for handling segmentation faults
    '''
    # The code below will generate the segfault but I have no way of handling it
    def test_segfault_mif(self):
         with self.assertRaisesRegex(ValueError, 'opuerw'):
             MIFparser.to_dict(file_path=currentdir + '/mockups/mif/segfault.mif')
    '''

    def test_no_mif(self):
        with self.assertRaisesRegex(ValueError, 'Unable to read'):
            MIFparser.to_dict('non-existent.mif')

    def test_catch_NaN_error(self):
        with self.assertRaisesRegex(ValueError, 'Unable to extract'):
            MIFparser.to_dict(currentdir + '/mockups/mif/NaN.mif')

    def test_catch_other_error(self):
        with self.assertRaises(ValueError):
            # Platform-dependent implementations do not allow specifying a specific error message!
            # The main point is that the parser should catch the error, and not crash the program
            MIFparser.to_dict(currentdir + '/mockups/mif/error.mif')


def main():
    unittest.main()


if __name__ == '__main__':
    main()
