/**
 * Created by reinvantveer on 1/20/17.
 */

/* global d3, graphData */
const nodes = graphData.map(schema => {
  schema.id = schema.hash;
  return schema;
});

const edges = graphData.map(schema => {
  const edge = {
    id: `edge-${schema.hash}`,
    strength: 1 / schema.closestRelatives[0].patch.length,
    source: schema.hash,
    target: schema.closestRelatives[0].schemaHash
  };
  return edge;
});

const svg = d3.select('svg');

function ticked(link, node) {
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

  node
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);
}

const simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody(nodes).distanceMin(d => d.strength * 10))
  .force('link', d3.forceLink(edges).id(d => d.id))
  .force('center', d3.forceCenter(svg.width / 2, svg.height / 2))
  .force('x', d3.forceX())
  .force('y', d3.forceY())
  .on('tick', ticked);

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

const color = d3.scaleOrdinal(d3.schemeCategory20);

const link = svg.append('g')
  .attr('class', 'links')
  .selectAll('line')
  .data(edges)
  .enter()
  .append('line')
  .attr('stroke-width', 5);

link.append('title')
  .text(d => d.id);

const node = svg.append('g')
  .attr('class', 'nodes')
  .selectAll('circle')
  .data(nodes)
  .enter()
  .append('circle')
  .attr('r', 5)
  .attr('fill', d => color(d.occurrences))
  .call(d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended));

node.append('title')
  .text(d => d.id);
