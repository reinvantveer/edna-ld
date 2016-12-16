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

# Roadmap
|Date |Title|Description|
|-----|-----|-----------|
|13-01|Enhanced GIS files preprocessing|whitespace, error reporting, custom folder output, validation|
|27-01|File schema ingestion|a schema metadata collection|
|10-02|file metadata ingestion|a file metadata collection|
|10-02|content ingestion|one or more content collections|
|24-02|Dashboard GUI wireframes||
|10-03|Templated dashboard GUI setup|Node.js Express/Jade setup|
|24-03|File schema GUI|GUI for bulk file schema analysis and reporting|
|07-04|Split identical file schemas|GUI for splitting identical file schemas on partial filenames|
|21-04|Transformation schemas editing|GUI for raw editing and saving transformation schemas|
|05-05|Bulk document transformation|GUI for bulk transformation and loading of documents|
|19-05|Transformation schemas editing|GUI for raw editing and saving transformation schemas|
|19-05|Search interface mockup|GUI searching in data|
|02-06|Search interface implementation|GUI searching in data|
|09-06|Dockerize application||