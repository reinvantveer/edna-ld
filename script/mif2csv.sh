#!/usr/bin/env bash
while IFS= read -r -d '' file
do
  infile=$(printf '%q\n' "${file}")
  outfile=$(printf '%q\n' "$(dirname ${file})"/"$(basename ${file} .mif)").csv
  ogr2ogr -f CSV ${outfile} ${infile} -lco GEOMETRY=AS_WKT -lco CREATE_CSVT=YES -lco SEPARATOR=TAB
done < <(find "$1" -name '*.mif' -print0)