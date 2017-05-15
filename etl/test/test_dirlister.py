import inspect
import unittest
import os
import sys

sys.path.insert(0, '..')

from lib import DirLister

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))


class TestGetDirList(unittest.TestCase):
    def test_get_file_list_recursive(self):
        dir_list = DirLister.get_file_list_recursive(os.path.join(current_dir, 'mockups', 'mif'))
        self.assertEqual(sorted(dir_list), [
            os.path.join(current_dir, 'mockups', 'mif', 'test.mid'),
            os.path.join(current_dir, 'mockups', 'mif', 'test.mif')
        ])


def main():
    unittest.main()


if __name__ == '__main__':
    main()
