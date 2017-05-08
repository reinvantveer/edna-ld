import inspect
import os
import sys
import unittest
import etl.DirLister as DirLister

currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.insert(0, parentdir)


class TestGetDirList(unittest.TestCase):
    def test_get_file_list_recursive(self):
        dir_list = DirLister.get_file_list_recursive(os.path.join(currentdir, 'mockups', 'mif'))
        self.assertEqual(sorted(dir_list), [
            os.path.join(currentdir, 'mockups', 'mif', 'test.mid'),
            os.path.join(currentdir, 'mockups', 'mif', 'test.mif')
        ])


def main():
    unittest.main()


if __name__ == '__main__':
    main()
