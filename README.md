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
- [ ] Docker setup
- [X] Create port forwarding rules

## Preprocessing GIS files to GeoCSV
- [X] A basic script for transforming MapInfo Interchange Format (.mif) files to GeoCSV
- [ ] A validated output script for preprocessing GIS files to GeoCSV
- [ ] Fix whitespace escaping in pre-processing script

## Schema analysis
- [X] Extract schemas (naively) from all CSVs
- [X] Load source data into staging area
- [X] Load file metadata in files collection
- [ ] Create source data API
- [ ] Optionally store data in mongodb (default false)
- [ ] Load schema data in schemas collection
- [ ] Optionally disallow two schemas to be their own/only closest relatives
- [ ] Parameterize schema diff sorting
- [ ] Make schema comparison optionally case insensitive
- [ ] Add sha1 hash to csv file metadata

## Visualization
- [X] Create graph layout in express app
- [X] Visualize schema diff
- [X] Group collapsed files under file heading
- [X] Create home layout
- [X] Create a schema mapping dummy layout
- [X] Create a source data dummy layout
- [X] Create a target data dummy layout
- [ ] AJAX load graph data (instead of jade inject)
- [ ] Visualize schema diff per linked schema
- [ ] Allow graph zooming
- [ ] Allow graph panning
- [ ] Create arrows indicating graph directionality
- [ ] Let schema view query API instead of source file
- [ ] Limit unscrolled file list to 10 files
- [ ] Allow manual schema closest relative remapping
- [ ] Allow schema map splitting depending on file metadata
- [ ] Create file layout in express, 
- [ ] see whether the file has been preprocessed
- [ ] see whether the file has been converted
- [ ] Percolate files with errors to the top
- [ ] Create a mapped data browsing/searching layout
