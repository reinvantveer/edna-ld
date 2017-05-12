from setuptools import setup

setup(name='csv2mongodb',
    version='0.1',
    description='Python mongodb ETL for CSV with enhanced data parsing',
    url='http://github.com/reinvantveer/edna-ld',
    author='Rein van t Veer',
    author_email='r.h.vant.veer@vu.nl',
    license='MIT',
    packages=['lib'],
    install_requires=[
        'pandas',
        'pymongo',
        'GDAL',
        'PyYAML',
    ],
    test_suite='nose.collector',
    tests_require=['nose'],
    zip_safe=False)
