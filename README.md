# edna-ld
A framework for analysing and transforming multi-schema (hundreds of them) CSV to Linked Data

# Installation
clone and run `./install.sh` in the root dir

# Usage
First, convert all your favorite source files to CSV. There's a script in the `script` folder that allows converting from [MapInfo Interchange Format](https://en.wikipedia.org/wiki/MapInfo_Interchange_Format) (MIF) to [GeoCSV](http://giswiki.hsr.ch/GeoCSV), for example.

Then, run `script/server.sh` to start the environment. You can open your browser and point it to http://localhost:3000. Here you can stage and convert the data interactively.

# Approach
## Research
- [ ] Investigate whether schema graph can be let loose on existing mapping tool
- [ ] Ontology alignment and evaluation initiative
- [ ] ontology alignment tools
- [ ] Cerdeira survey paper on matching tools
- [ ] Shi F, Li J et al 2009: Actively learning ontology matching via user interaction
- [ ] Hierarchy based on pure parents
- [ ] Internal evaluation of different sorting/scoring algorithms
- [ ] Research data management plan

## Development environment & deployment
- [X] create Vagrantfile with all requirements
- [ ] Docker setup
- [X] Create port forwarding rules

## Preprocessing files
- [X] A basic script for transforming MapInfo Interchange Format (.mif) files to GeoCSV
- [ ] Add 12 projects for major organisations
- [ ] A validated output script for preprocessing GIS files to GeoCSV
- [ ] Fix whitespace escaping in pre-processing script

## Schema analysis
- [X] Extract schemas (naively) from all CSVs
- [X] Load source data into staging area
- [X] Load file metadata in files collection
- [X] Create file metadata API endpoint
- [X] Create source data API endpoint
- [X] Upsert file metadata rather than insert (overwrite data)
- [X] Upsert schema data in schemas collection
- [X] Create schema API endpoint
- [X] Add file content hash to csv file metadata
- [X] Create 10 nearest neighbour links for optional manual selection
- [X] Kick off analysis through UI
- [X] Analysis reports to UI
- [X] Analysis progress bar
- [X] Sort source fields before analysis
- [X] Lowercase source records before analysis
- [X] Sort schemas on # of shared field names first
- [ ] Weighted edges for sorting
- [ ] Bugfix: how is PROJECT schema derived from R_AWDS8?
- [ ] (Optionally) disallow two schemas to be their own/only closest relatives
- [ ] Make schema comparison optionally case insensitive
- [ ] Parameterize schema diff sorting
- [ ] Optionally store data in mongodb (default false)
- [ ] Bulk upsert source data

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
- [X] Schema page queries schema API (instead of schema file)
- [X] Visualize schema diff for each outgoing linked schema
- [X] Visualize schema diff for each incoming linked schema
- [ ] Create arrows indicating graph directionality
- [ ] Set source data table height to partial window height
- [ ] Color schema circles by number of attributes
- [ ] Allow graph [zooming and panning](http://codepen.io/techslides/pen/zowLd)
- [ ] Limit unscrolled file list to 10 files
- [ ] Allow manual closest schema relative [remapping](http://bl.ocks.org/rkirsling/5001347)
- [ ] Allow schema map splitting depending on file metadata
- [ ] see whether the file has been preprocessed
- [ ] see whether the file has been converted
- [ ] Percolate files with errors to the top
- [ ] Create a mapped data browsing/searching layout
