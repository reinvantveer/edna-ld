# edna-ld
A framework for analysing and transforming multi-schema (hundreds of them) CSV to Linked Data

# Installation
clone and run `./install.sh` in the root dir

# Approach
## Development environment
- [X] create Vagrantfile with all requirements
- [ ] Fix the Docker setup
- [ ] Create port forwarding rules

## Bash scripting ogr2ogr geospatial preprocessing
- [X] A script for transforming MapInfo Interchange Format (.mif) files to GeoCSV
- [ ] Fix whitespace escaping in pre-processing script

## Schema analysis
- [X] Extract schemas (naively) from all csvs
- [ ] Extract schemas from geospatial CSVT schemas