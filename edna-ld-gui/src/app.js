'use strict';

const d3 = require('d3');
const $ = require('jquery');

let selected = '';
const nodes = graphData.map(schema => {
  schema.id = schema.hash;
  return schema;
});

const edges = graphData.map(schema => {
  return {
    id: `edge-${schema.hash}`,
    strength: 1 / schema.closestRelatives[0].patch.length,
    source: schema.hash,
    target: schema.closestRelatives[0].schemaHash
  };
});

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

/*
 function zoomed() {
 canvas.attr("transform", d3.event.transform);
 }

 canvas.call(d3.zoom()
 .scaleExtent([1 / 2, 4])
 .on('zoom', zoomed));
 */

function drawLink(d) {
  context.beginPath();
  context.moveTo(d.source.x, d.source.y);
  context.lineTo(d.target.x, d.target.y);
  context.strokeStyle = '#aaa';
  context.stroke();
}

function drawNode(d) {
  if (d.hash === selected) {
    context.fillStyle = '#75070a';
  } else {
    context.fillStyle = '#75AF96';
  }

  context.beginPath();
  context.moveTo(d.x + 3, d.y);
  context.arc(d.x, d.y, d.files.length + 2, 0, 2 * Math.PI);
  context.fill();
  context.strokeStyle = '#003B22';
  context.stroke();
}

function ticked() {
  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(width / 2, height / 2);
  edges.forEach(drawLink);
  nodes.forEach(drawNode);
  context.restore();
}

const simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody(nodes).distanceMin(d => (d.strength * 20)))
  .force('link', d3.forceLink(edges).id(d => d.id))
  .force('x', d3.forceX())
  .force('y', d3.forceY())
  .on('tick', ticked);

function setInfoBox(subject) {
  $('#hashText').text(subject.hash);

  $('#occurrences').text(`${subject.occurrences} files (Click to expand/collapse)`);
  let fileList = '';
  subject.files.forEach(file => fileList += `<li>${file}</li>`);
  $('#files')
    .empty()
    .append('<ul>')
    .append(fileList)
    .append('</ul>');

  const relatedHash = subject.closestRelatives[0].schemaHash;
  $('#nearestNeighbour')
    .empty()
    .append(`<a id="${relatedHash}" href="#">${relatedHash}</a>`);

  $('#diff')
    .empty();
  subject.closestRelatives.forEach(relative => {
    relative.patch.forEach(patchOperation => {
      $('#diff')
        .append(`<span class="glyphicon
            ${patchOperation.op === 'add' ? ' glyphicon-plus' : ' glyphicon-minus'}
            ">${patchOperation.path}</span><br/>`);
    });
  });

  $(`#${relatedHash}`)
    .on('click', () => {
      nodes.filter(node => node.hash === relatedHash)
        .forEach(node => {
          selected = node.hash;
          setInfoBox(node);
        });
    });

  $('#schemaCode').text(JSON.stringify(subject.schema, null, 2));

  ticked();
}

function dragstarted() {
  const subject = d3.event.subject;
  selected = subject.hash;
  setInfoBox(subject);

  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  subject.fx = subject.x;
  subject.fy = subject.y;
}

function dragged() {
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function dragended() {
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}

d3.select(canvas)
  .call(d3.drag()
    .container(canvas)
    .subject(() => simulation.find(d3.event.x - (width / 2), d3.event.y - (height / 2)))
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended));
