/**
 * Created by reinvantveer on 2/27/17.
 */

const sorter = require('../lib/schemaSorter');
const chai = require('chai');

chai.should();

/* eslint-env mocha */
describe('schema diff sorter', () => {
  describe('the default sorter', () => {
    it('prefers few B diffs over many A diffs', () => {
      const diffA = { patch: [
        { op: 'remove', path: '/items/properties/bang' },
        { op: 'add', path: '/items/properties/column1', value: { type: 'string' } },
        { op: 'add', path: '/items/properties/column2', value: { type: 'string' } }
      ] };

      const diffB = { patch: [
        { op: 'remove', path: '/items/properties/bang' },
        { op: 'add', path: '/items/properties/column1', value: { type: 'string' } }
      ] };

      return sorter(diffA, diffB).should.equal(1);
    });

    it('prefers few A diffs over many B diffs', () => {
      const diffA = { patch: [
        { op: 'remove', path: '/items/properties/bang' },
        { op: 'add', path: '/items/properties/column1', value: { type: 'string' } }
      ] };

      const diffB = { patch: [
        { op: 'remove', path: '/items/properties/bang' },
        { op: 'add', path: '/items/properties/column1', value: { type: 'string' } },
        { op: 'add', path: '/items/properties/column2', value: { type: 'string' } }
      ] };

      return sorter(diffA, diffB).should.equal(-1);
    });
  });

  describe('the additions preferred sorter prefers', () => {
    it('A add over replace B', () => {
      const diffA = { patch: [
        { op: 'add', path: '/items/properties/column1', value: { type: 'string' } },
        { op: 'add', path: '/items/properties/column2', value: { type: 'string' } }
      ] };

      const diffB = { patch: [
        { op: 'remove', path: '/items/properties/bang' },
        { op: 'add', path: '/items/properties/column1', value: { type: 'string' } }
      ] };

      return sorter(diffA, diffB, 'preferAdditions').should.equal(-1);
    });

    it('B add over A replace', () => {
      const diffA = { patch: [
        { op: 'remove', path: '/items/properties/bang' },
        { op: 'add', path: '/items/properties/column1', value: { type: 'string' } }
      ] };

      const diffB = { patch: [
        { op: 'add', path: '/items/properties/column1', value: { type: 'string' } },
        { op: 'add', path: '/items/properties/column2', value: { type: 'string' } }
      ] };

      return sorter(diffA, diffB, 'preferAdditions').should.equal(1);
    });

    it('B remove and add over just an A remove', () => {
      const diffA = { patch: [
        { op: 'remove', path: '/items/properties/bang' },
      ] };

      const diffB = { patch: [
        { op: 'remove', path: '/items/properties/column1', value: { type: 'string' } },
        { op: 'add', path: '/items/properties/column2', value: { type: 'string' } }
      ] };

      return sorter(diffA, diffB, 'preferAdditions').should.equal(1);
    });

    it('A remove and add over just a B remove', () => {
      const diffA = { patch: [
        { op: 'remove', path: '/items/properties/column2', value: { type: 'string' } },
        { op: 'add', path: '/items/properties/column2', value: { type: 'string' } }
      ] };

      const diffB = { patch: [
        { op: 'remove', path: '/items/properties/bang' },
      ] };

      return sorter(diffA, diffB, 'preferAdditions').should.equal(-1);
    });

    it('single A add over plural B adds', () => {
      const diffA = { patch: [
        { op: 'remove', path: '/items/properties/bang' },
        { op: 'add', path: '/items/properties/column2', value: { type: 'string' } }
      ] };

      const diffB = { patch: [
        { op: 'remove', path: '/items/properties/column1', value: { type: 'string' } },
        { op: 'add', path: '/items/properties/column2', value: { type: 'string' } },
        { op: 'add', path: '/items/properties/column3', value: { type: 'string' } }
      ] };

      return sorter(diffA, diffB, 'preferAdditions').should.equal(-1);
    });

    it('single A add over plural B adds', () => {
      const diffA = { patch: [
        { op: 'remove', path: '/items/properties/column1', value: { type: 'string' } },
        { op: 'add', path: '/items/properties/column2', value: { type: 'string' } },
        { op: 'add', path: '/items/properties/column3', value: { type: 'string' } }
      ] };

      const diffB = { patch: [
        { op: 'remove', path: '/items/properties/bang' },
        { op: 'add', path: '/items/properties/column2', value: { type: 'string' } }
      ] };

      return sorter(diffA, diffB, 'preferAdditions').should.equal(1);
    });
  });
});
