import os

class DirLister:
    @staticmethod
    def get_file_list_recursive(path):
        file_paths = []

        for root, dirs, files in os.walk(path):
            for name in files:
                file_paths.append(os.path.join(root, name))
        return file_paths
