import inspect
import unittest
import os
import sys

sys.path.insert(0, '..')

from lib import FileStatter

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))

testfile = os.path.join(current_dir, 'mockups', 'csv', 'test_sha1.txt')


class TestFileHasher(unittest.TestCase):
    def test_file_hasher(self):
        sha1 = FileStatter.sha1_from_file(testfile)
        self.assertEqual(sha1, 'b1200974728d4d55e92b8be30af8d39ccd4c4a1b')

    def test_data_hasher_from_read_file(self):
        with open(testfile, mode='rb') as test_data:
            sha1 = FileStatter.sha1(test_data)
            self.assertEqual(sha1, 'b1200974728d4d55e92b8be30af8d39ccd4c4a1b')

    def test_data_hasher_from_string(self):
        sha1 = FileStatter.sha1('this is a string')
        self.assertEqual(sha1, '517592df8fec3ad146a79a9af153db2a4d784ec5')

    def test_data_hasher_from_dict(self):
        sha1 = FileStatter.sha1({
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
        self.assertEqual(sha1, 'ac261a43b896c8216a567e146f0f9fdc8951b5df')

    def test_data_hasher_from_list(self):
        sha1 = FileStatter.sha1([{'data': 'some data'}])
        self.assertEqual(sha1, '297c88ed1e2052e7fac31426fe6b85502ad4c717')

def main():
    unittest.main()


if __name__ == '__main__':
    main()
