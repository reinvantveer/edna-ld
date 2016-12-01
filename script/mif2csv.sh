#!/usr/bin/env bash
for file in $(find $1 -name '*.mif')
do
    # echo $( echo "$FILE_PATH" | sed 's/ /\\ /g' )
    # echo "$(printf %q "${file}")"
    # TODO: properly escape spaces
    infile=$(printf %q ${file})
    outfile=$(printf %q $(dirname ${file})/$(basename ${file} .mif)).csv
    ogr2ogr -f CSV ${outfile} ${infile} -lco GEOMETRY=AS_WKT -lco CREATE_CSVT=YES -lco SEPARATOR=TAB
    # ogr2ogr -f csv ${file}
done
