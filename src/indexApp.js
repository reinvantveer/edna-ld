/**
 * Created by vagrant on 2/3/17.
 */


const io = require('socket.io-client');
const $ = require('jquery');

const socket = io();

const processProgress = {
  total: 0,
  current: 0
};

function processButtonAction(event, text) {
  $('#process').off('click');
  $('#process').on('click', () => {
    if (!$('#process').attr('disabled')) {
      socket.emit(event, {
        inputFolder, // Passed from Jade -> HTML to global var
        extension // Passed from Jade -> HTML to global var
      });
    }

    $('#process').attr('disabled', true);
    $('#process').text(text);
  });
}

processButtonAction('inventory', 'Creating file inventory');

socket.on('statusUpdate', msg => {
  $('#messages')
    .append($('<li>')
      .text(JSON.stringify(msg))
    );
});

socket.on('inventoryResult', fileInventory => {
  processProgress.total = fileInventory.length;

  $('#process').text('Start staging and analysing files');

  $('#messages')
    .append($('<li>')
      .text(`${fileInventory.length} files for staging and analysis`));

  $('#process').attr('disabled', false);
  processButtonAction('startStaging', 'Staging files...');
});

socket.on('stagingResult', result => {
  $('#process').text('Done!');

  $('#processProgressBar').css('width', '100%')
    .text('100%');

  $('#messages')
    .append($('<li>')
      .text(`Files staged and ${result} schemas stored. You may proceed to the schema graph section.`));
});

socket.on('processedFile', () => {
  console.log(processProgress);
  processProgress.current += 1;
  const percentage = ((processProgress.current / processProgress.total) * 100).toFixed(2);
  $('#processProgressBar').css('width', `${percentage}%`)
    .text(`${percentage}%`);
});
