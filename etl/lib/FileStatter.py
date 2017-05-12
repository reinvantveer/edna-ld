import hashlib

import _io
import os
from functools import partial


class FileStatter:
    @staticmethod
    def sha1(data):
        block_size = 2 ** 14

        if type(data) is _io.BufferedReader:
            d = hashlib.sha1()
            for buf in iter(partial(data.read, block_size), b''):
                d.update(buf)
        elif type(data) is str:
            d = hashlib.sha1(data.encode())
        elif type(data) is dict:
            d = hashlib.sha1(str(data).encode())
        else:
            raise TypeError('Unable to create SHA1 from variable type %s' % type(data))

        return d.hexdigest()

    @staticmethod
    def sha1_from_file(file_path):
        with open(file_path, mode='rb') as f:
            return FileStatter.sha1(f)

    @staticmethod
    def stats(file_path):
        return os.stat(file_path)
