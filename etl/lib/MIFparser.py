from osgeo import gdal
import signal

from osgeo import ogr
import json

gdal.UseExceptions()

"""
This module has a heavy dependency on the python GDAL package, which can be
 a total pain in the ass to install, depending on your platform. But it is needed 
 for parsing the Mapinfo Interchange Format (MIF) files...
 
 Support for Windows is easiest through the OSGeo4W installer
"""


class MIFparser:
    """
    This class is responsible for reading MapInfo Interchange Format files.
    They are recognizable by the .mif (upper or lowercase) file extension.
    """

    # Catch segmentation faults
    @staticmethod
    def _sig_handler(signum, frame):
        raise ValueError("segfault")

    @staticmethod
    def to_dict(file_path):
        # TODO: write code to actually handle the error!
        # signal.signal(signal.SIGSEGV, MIFparser._sig_handler)

        wkt_features = []  # Initialize empty array of target features
        try:
            data_source = ogr.Open(file_path, 0)
        except Exception as e:
            raise ValueError(e)

        data_source = gdal.ogr.Open(file_path, 0)

        err = gdal.GetLastErrorMsg()
        if err:
            raise ValueError(err + ' on ' + file_path)

        if not data_source:
            raise ValueError('Unable to read data from file %s' % file_path)

        layer = data_source.GetLayer()
        err = gdal.GetLastErrorMsg()
        if err:
            raise ValueError(err + ' on ' + file_path)

        for feature in layer:
            # shortcut to dumping non-geometry attributes from feature to our dictionary
            try:
                geojson = feature.ExportToJson()
            except Exception as e:
                raise ValueError('Unable to extract features from file %s due to %s' % (file_path, e))

            geojson_as_dict = json.loads(geojson)
            wkt_feature = geojson_as_dict['properties']

            # tack on the geometry as well-known text
            geom = feature.GetGeometryRef()

            err = gdal.GetLastErrorMsg()
            if err:
                raise ValueError(err + ' on ' + file_path)

            if not geom:
                raise ValueError('Unable to extract geometries from %s' % file_path)

            wkt_feature['WKT'] = geom.ExportToWkt()
            wkt_features.append(wkt_feature)

        if not wkt_features:
            raise ValueError('Unable to extract features from %s' % file_path)

        return wkt_features
