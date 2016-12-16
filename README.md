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

# Roadmap
- Enhanced GIS files preprocessing (whitespace, error reporting, custom folder output, validation)
- Document store ingestion setup of file schemas (a schema metadata collection)
- Document store ingestion setup of file metadata (a file metadata collection)
- Document store ingestion setup of JSON-LD documents (one or more content collections)
- GUI wireframes
- Templated GUI setup
- GUI for bulk file schema analysis and reporting
- GUI for splitting identical file schemas (on partial filenames)
- GUI for raw editing and saving transformation schemas
- GUI for bulk transformation and loading of documents
- Search interface mockup
- Dockerize application