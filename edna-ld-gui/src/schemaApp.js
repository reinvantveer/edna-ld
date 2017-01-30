'use strict';

const d3 = require('d3');
const $ = require('jquery');
const xtend = require('xtend');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let selectedNode = '';

/**
 * Draws a link (edge) between two nodes: the source and the target
 * @param link The D3 edge/link data
 */
function drawLink(link) {
  context.beginPath();
  context.moveTo(link.source.x, link.source.y);
  context.lineTo(link.target.x, link.target.y);
  context.strokeStyle = '#aaa';
  context.stroke();
}

/**
 * Draws a node on the canvas (context)
 * @param node a D3 node
 */
function drawNode(node) {
  if (node.hash === selectedNode) {
    context.fillStyle = '#75070a';
  } else {
    context.fillStyle = '#75AF96';
  }

  context.beginPath();
  context.moveTo(node.x + 3, node.y);
  context.arc(node.x, node.y, node.files.length + 2, 0, 2 * Math.PI);
  context.fill();
  context.strokeStyle = '#003B22';
  context.stroke();
}

/**
 * Function called for rendering each canvas (context) visualization frame
 * @param edges array of D3 edge objects
 * @param nodes array of D3 node objects
 */
function tick(edges, nodes) {
  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(width / 2, height / 2);
  edges.forEach(drawLink);
  nodes.forEach(drawNode);
  context.restore();
}

$.get('/api/v1/schemas', (graphData, status) => {
  if (status !== 'success') return console.error(status);

  const nodes = graphData.map(schema => xtend(schema, { id: schema.hash }));

  const edges = graphData.map(schema => {
    return {
      id: `edge-${schema.hash}`,
      strength: 1 / schema.closestRelatives[0].patch.length,
      source: schema.hash,
      target: schema.closestRelatives[0].schemaHash
    };
  });

  /*
   function zoomed() {
   canvas.attr("transform", d3.event.transform);
   }

   canvas.call(d3.zoom()
   .scaleExtent([1 / 2, 4])
   .on('zoom', zoomed));
   */

  function ticked() {
    tick(edges, nodes);
  }

  const simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody(nodes).distanceMin(d => (d.strength * 20)))
    .force('link', d3.forceLink(edges).id(d => d.id))
    .force('x', d3.forceX())
    .force('y', d3.forceY())
    .on('tick', ticked);

  /**
   * Fills the info box for a selected subject schema node
   * @param subject a selected schema node
   */
  function setInfoBox(subject) {
    // Set schema hash
    $('#hashText').text(subject.hash);

    // Build file list
    $('#occurrences').text(`${subject.occurrences} files (Click to expand/collapse)`);
    let fileList = '';
    subject.files.forEach(file => {
      fileList += `<li><a href="/sourcedata#${file}">${file}</a></li>`;
    });
    $('#files')
      .empty()
      .append(`<ul>${fileList}</ul>`);

    // Build related parent hash list
    const relatedHash = subject.closestRelatives[0].schemaHash;
    $('#nearestNeighbour')
      .empty()
      .append(`<a id="${relatedHash}" href="#">${relatedHash}</a>`);

    // Create related parent click behaviour
    $(`#${relatedHash}`)
      .on('click', () => {
        nodes.filter(node => node.hash === relatedHash)
          .forEach(node => {
            selectedNode = node.hash;
            setInfoBox(node);
          });
      });

    // Build diff visuals for closest relative
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

    $('#schemaCode').text(JSON.stringify(subject.schema, null, 2));

    ticked();
  }

  function dragstarted() {
    const subject = d3.event.subject;
    selectedNode = subject.hash;
    setInfoBox(subject);

    if (!d3.event.active) simulation.alphaTarget(1).restart();
    subject.fx = subject.x;
    subject.fy = subject.y;
  }

  function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }

  function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0.1);
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
});

