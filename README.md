# edna-ld
A framework for analysing and transforming multi-schema (hundreds of them) CSV to Linked Data

# Installation
clone and run `./install.sh` in the root dir

# Usage
First, convert all your favorite source files to CSV. There's a script in the `script` folder that allows converting from MapInfo Interchange Format (MIF) to GeoCSV, for example.

Then, run `script/analyze.sh` to create a staging environment. After it has finished, you can open your browser and point it to http://localhost:3000. Here you can convert the data interactively.

# Approach
## Development environment & deployment
- [X] create Vagrantfile with all requirements
- [ ] Fix the Docker setup
- [X] Create port forwarding rules

## Preprocessing GIS files to GeoCSV
- [X] A basic script for transforming MapInfo Interchange Format (.mif) files to GeoCSV
- [ ] Do not allow two schemas to be their own/only closest relatives
- [ ] A validated output script for preprocessing GIS files to GeoCSV
- [ ] Create a schema metadata collection during analysis stage
- [ ] Create staging collection for file metadata during analysis stage
- [ ] Create staging collection for raw data to search for mapping during analysis stage
- [ ] Fix whitespace escaping in pre-processing script

## Schema analysis
- [X] Extract schemas (naively) from all CSVs
- [ ] Add sha1 hash to csv file metadata

## Visualization
- [X] Create graph layout in express app
- [ ] Create a schema mapping layout
- [ ] Create arrows indicating graph directionality
- [ ] Let schema view query API instead of source file
- [ ] Allow manual schema closest relative remapping
- [ ] Allow schema map splitting depending on file metadata
- [ ] Create file layout in express, 
- [ ] see whether the file has been preprocessed
- [ ] see whether the file has been converted
- [ ] Percolate files with errors to the top
- [ ] Create a mapped data browsing/searching layout
