# edna-ld
A framework for analysing and transforming multi-schema (hundreds of them) CSV to Linked Data

# Installation
clone and run `./install.sh` in the root dir

# Approach
## Development environment & deployment
- [X] create Vagrantfile with all requirements
- [ ] Fix the Docker setup
- [ ] Create port forwarding rules

## Preprocessing GIS files to GeoCSV
- [X] A basic script for transforming MapInfo Interchange Format (.mif) files to GeoCSV
- [ ] A validated output script for preprocessing GIS files to GeoCSV
- [ ] Fix whitespace escaping in pre-processing script

## Schema analysis
- [X] Extract schemas (naively) from all CSVs
- [ ] Add sha1 hash to csv file metadata
