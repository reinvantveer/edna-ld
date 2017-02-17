/**
 * Created by reinvantveer on 12/5/16.
 */

'use strict';

const analyzer = require('../lib/schemaAnalyzer');
const chai = require('chai');

chai.should();

// MongoDb collections API stub
const storageFunctions = {
  insertOne: dummy => dummy === 'error' ? Promise.reject('Test error') : Promise.resolve('OK'),
  insertMany: () => Promise.resolve('OK'),
  updateOne: () => Promise.resolve('OK')
};

const collections = {
  fileCollection: storageFunctions,
  files: storageFunctions,
  sourcedataCollection: storageFunctions,
  sourcedata: storageFunctions,
  schemaCollection: storageFunctions,
  schemas: storageFunctions
};

// Socket.io stub
const socket = {
  emit: () => {}
};

let mongodb;

/* eslint-env mocha */
describe('The schema analyzer', () => {
  before(() => {
    mongodb = { collection: collection => collections[collection] };
  });

  it('creates identical schemas for two files, one file missing one row value', () => {
    return analyzer.analyzeFolderRecursive('test/mockups/sameSchemaTest', '.csv', mongodb, socket)
      .then(result => result.sort().should.deep.equal([
        {
          files: [
            'test/mockups/sameSchemaTest/test.csv',
            'test/mockups/sameSchemaTest/test2.csv'
          ],
          _id: 'ece9e8a91157824de7c5a9527c322ea9',
          hash: 'ece9e8a91157824de7c5a9527c322ea9',
          closestRelatives: [],
          occurrences: 2,
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                column1: { type: 'string' },
                column2: { type: 'string' }
              }
            }
          }
        }
      ]))
      .catch(err => { throw err; });
  });

  describe('schema analysis', () => {
    it('summarizes the schemas of a particular folder and its subfolders', () => {
      return analyzer.analyzeFolderRecursive('test/mockups/subfoldertest/', 'csv', mongodb, socket)
        .then(summary => {
          return summary.sort().should.deep.equal([
            {
              _id: 'ef4e1166fc061ac5c3ce0ee63ec4f518',
              hash: 'ef4e1166fc061ac5c3ce0ee63ec4f518',
              files: ['test/mockups/subfoldertest/rd.csv'],
              closestRelatives: [],
              occurrences: 1,
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    bang: { type: 'string' }
                  }
                }
              }
            },
            {
              _id: 'ece9e8a91157824de7c5a9527c322ea9',
              hash: 'ece9e8a91157824de7c5a9527c322ea9',
              files: ['test/mockups/subfoldertest/test.csv', 'test/mockups/subfoldertest/subfolder/test2.csv'],
              closestRelatives: [],
              occurrences: 2,
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    column1: { type: 'string' },
                    column2: { type: 'string' }
                  }
                }
              }
            }
          ]);
        });
    });

    describe('schema diff sorter', () => {
      it('prefers few diffs over many diffs', () => {
        const diffA = {
          patch: [
            { op: 'remove', path: '/items/properties/bang' },
            { op: 'add', path: '/items/properties/column1', value: { type: 'string' } },
            { op: 'add', path: '/items/properties/column2', value: { type: 'string' } }
          ]
        };

        const diffB = {
          patch: [
            { op: 'remove', path: '/items/properties/bang' },
            { op: 'add', path: '/items/properties/column1', value: { type: 'string' } }
          ]
        };

        return analyzer.schemaDiffSorter(diffA, diffB)
          .should.equal(1);
      });

      it('prefers few diffs over many diffs', () => {
        const diffA = {
          patch: [
            { op: 'remove', path: '/items/properties/bang' },
            { op: 'add', path: '/items/properties/column1', value: { type: 'string' } }
          ]
        };

        const diffB = {
          patch: [
            { op: 'remove', path: '/items/properties/bang' },
            { op: 'add', path: '/items/properties/column1', value: { type: 'string' } },
            { op: 'add', path: '/items/properties/column2', value: { type: 'string' } }
          ]
        };

        return analyzer.schemaDiffSorter(diffA, diffB)
          .should.equal(-1);
      });

      it('prefers add diffs over replace diffs', () => {
        const diffA = {
          patch: [
            { op: 'add', path: '/items/properties/column1', value: { type: 'string' } },
            { op: 'add', path: '/items/properties/column2', value: { type: 'string' } }
          ]
        };

        const diffB = {
          patch: [
            { op: 'remove', path: '/items/properties/bang' },
            { op: 'add', path: '/items/properties/column1', value: { type: 'string' } }
          ]
        };

        return analyzer.schemaDiffSorter(diffA, diffB)
          .should.equal(-1);
      });

      it('prefers add diffs over replace diffs', () => {
        const diffA = {
          patch: [
            { op: 'remove', path: '/items/properties/bang' },
            { op: 'add', path: '/items/properties/column1', value: { type: 'string' } }
          ]
        };

        const diffB = {
          patch: [
            { op: 'add', path: '/items/properties/column1', value: { type: 'string' } },
            { op: 'add', path: '/items/properties/column2', value: { type: 'string' } }
          ]
        };

        return analyzer.schemaDiffSorter(diffA, diffB)
          .should.equal(1);
      });

      it('prefers an remove and add diff over just a remove diff', () => {
        const diffA = {
          patch: [
            { op: 'remove', path: '/items/properties/bang' },
          ]
        };

        const diffB = {
          patch: [
            { op: 'remove', path: '/items/properties/column1', value: { type: 'string' } },
            { op: 'add', path: '/items/properties/column2', value: { type: 'string' } }
          ]
        };

        return analyzer.schemaDiffSorter(diffA, diffB)
          .should.equal(1);
      });

      it('prefers an remove and add diff over just a remove diff', () => {
        const diffA = {
          patch: [
            { op: 'remove', path: '/items/properties/column1', value: { type: 'string' } },
            { op: 'remove', path: '/items/properties/column2', value: { type: 'string' } },
            { op: 'add', path: '/items/properties/column2', value: { type: 'string' } }
          ]
        };

        const diffB = {
          patch: [
            { op: 'remove', path: '/items/properties/bang' },
          ]
        };

        return analyzer.schemaDiffSorter(diffA, diffB)
          .should.equal(-1);
      });
    });
  });
});
