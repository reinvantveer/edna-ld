/**
 * Created by vagrant on 2/3/17.
 */
'use strict';

const io = require('socket.io-client');
const $ = require('jquery');

const socket = io();

$('#startAnalysis').on('click', () => {
  socket.emit('startAnalysis', {
    inputFolder,
    extension
  });
});

socket.on('statusUpdate', msg => {
  $('#messages')
    .append($('<li>')
      .text(JSON.stringify(msg)));
});

socket.on('schemaResult', result => {
  $('#messages')
    .append($('<li>')
      .text(JSON.stringify(result)));
});
