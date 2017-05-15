from osgeo import ogr
import json

"""
This module has a heavy dependency on the python GDAL package, which can be
 a total pain in the ass to install, depending on your platform. 
 
 Support for Windows is easiest through the OSGeo4W installer, which comes

"""

class MIFparser:
    """
    This class is responsible for reading MapInfo Interchange Format files.
    They are recognizable by the .mif (upper or lowercase) file extension.
    """
    @staticmethod
    def to_dict(file_path):
        wkt_features = []  # Initialize empty array of target features
        data_source = ogr.Open(file_path, 0)
        if not data_source:
            raise ValueError('Unable to read data from file %s' % file_path)
        layer = data_source.GetLayer()

        for feature in layer:
            # shortcut to dumping non-geometry attributes from feature to our dictionary
            geojson = feature.ExportToJson()
            geojson_as_dict = json.loads(geojson)
            wkt_feature = geojson_as_dict['properties']

            # tack on the geometry as well-known text
            geom = feature.GetGeometryRef()
            wkt_feature['WKT'] = geom.ExportToWkt()
            wkt_features.append(wkt_feature)

        return wkt_features
