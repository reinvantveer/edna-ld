/**
 * Created by vagrant on 1/29/17.
 */

'use strict';

const $ = require('jquery');

const appPath = window.location.href;

if (appPath.split('#')[1]) {
  const filePath = appPath.split('#')[1];

  $.get(`/api/v1/files?filepath=${filePath}`, (data, status) => {
    if (status !== 'success') return console.error(status);
    $('#fileMetadata')
      .empty();

    return Object.keys(data)
      .forEach(key => {
        $('#fileMetadata')
          .append(`${key}: ${data[key]}<br>`);
      });
  });

  $.get(`/api/v1/sourcedata?filepath=${filePath}`, (data, status) => {
    if (!status === 'success') return console.error(status);

    $('#sourceDataTable').append('<thead><tr id="tableHeaderRow">');

    Object.keys(data[0])
      .forEach(key => $('#tableHeaderRow').append(`<th>${key}</th>`));

    $('#sourceDataTable')
      .append('</tr></thead>')
      .append('<tbody id="tableBody">');

    data.forEach((rowData, index) => {
      $('#tableBody')
        .append(`<tr id="tableHeaderRow${index}">`);

      Object.keys(rowData)
        .forEach(key => $(`#tableHeaderRow${index}`).append(`<td>${rowData[key]}</td>`));

      $('#tableBody').append('</tr>');
    });

    // TODO: this isn't working yet...
    const height = 'innerHeight' in window
      ? window.innerHeight
      : document.documentElement.offsetHeight;
    console.log(height);
    $('#sourcedata').css(`max-height: ${height}`);

    $('#sourceDataTable').append('</tbody>');

    // $('#sourceDataTable').DataTable();
  });

  console.log(`requested file: ${appPath.split('#')[1]}`);
}
