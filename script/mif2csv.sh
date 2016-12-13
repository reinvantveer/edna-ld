#!/usr/bin/env bash
set -ex
while IFS= read -r -d '' file
do
  infile=$(printf '%q\n' "${file}")
  outfile=$(printf '%q\n' /home/vagrant/surfdrive/DANS/target/csv/"$(basename ${file})").csv
  ogr2ogr -f "CSV" ${outfile} ${infile} -overwrite -lco GEOMETRY=AS_WKT -lco CREATE_CSVT=YES -lco SEPARATOR=COMMA
done < <(find "$1" -name '*.mif' -print0)