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
- [X] Create file metadata API endpoint
- [X] Create source data API endpoint
- [ ] Upsert file metadata rather than insert (overwrite data)
- [X] Upsert schema data in schemas collection
- [X] Create schema API endpoint
- [ ] Add file content hash to csv file metadata
- [ ] Bulk upsert source data
- [ ] Create multiple nearest neighbour links for manual selection
- [ ] Sort schemas on # of shared lowercase field names first
- [ ] Bugfix: how is PROJECT schema derived from R_AWDS8?
- [ ] (Optionally) disallow two schemas to be their own/only closest relatives
- [ ] Make schema comparison optionally case insensitive
- [ ] Parameterize schema diff sorting
- [ ] Optionally store data in mongodb (default false)

## Visualization
- [X] Create graph layout in express app
- [X] Visualize schema diff
- [X] Group collapsed files under file heading
- [X] Create home layout
- [X] Create a schema mapping dummy layout
- [X] Create a source data dummy layout
- [X] Create a target data dummy layout
- [X] Create file layout in express
- [X] Load graph data from API (instead of jade inject)
- [ ] Create arrows indicating graph directionality
- [ ] Set source data table height to partial window height
- [ ] Color schema circles by number of attributes
- [ ] Visualize schema diff per linked schema
- [ ] Allow graph [zooming and panning](http://codepen.io/techslides/pen/zowLd)
- [ ] Let schema view query schema API (instead of schema file)
- [ ] Limit unscrolled file list to 10 files
- [ ] Allow manual closest schema relative [remapping](http://bl.ocks.org/rkirsling/5001347)
- [ ] Allow schema map splitting depending on file metadata
- [ ] see whether the file has been preprocessed
- [ ] see whether the file has been converted
- [ ] Percolate files with errors to the top
- [ ] Create a mapped data browsing/searching layout
