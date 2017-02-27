/**
 * Created by reinvantveer on 12/5/16.
 */

const analyzer = require('../lib/schemaAnalyzer');
const chai = require('chai');

chai.should();

// MongoDb collections API stub
const storageFunctions = {
  insertOne: dummy => {
    if (dummy === 'error') {
      Promise.reject('Test error');
    } else {
      Promise.resolve('OK');
    }
  },
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

  it('creates identical schemas for two files, one file missing one row value', () =>
    analyzer.analyzeFolderRecursive('test/mockups/sameSchemaTest', '.csv', mongodb, socket)
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
          duplication: {
            '6007c050b1170e62f2a3901dc1994fa5': 1,
            '97a599f0364f75d31aa9e0deb8a0d510': 1
          },
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
      .catch(err => { throw err; })
  );

  it('groups files with the same information in a different order', () =>
    analyzer.analyzeFolderRecursive('test/mockups/inverseOrderTest', '.csv', mongodb, socket)
      .then(result => result.sort().should.deep.equal([
        {
          files: [
            'test/mockups/inverseOrderTest/inverseTest.csv',
            'test/mockups/inverseOrderTest/test.csv'
          ],
          _id: 'ece9e8a91157824de7c5a9527c322ea9',
          hash: 'ece9e8a91157824de7c5a9527c322ea9',
          closestRelatives: [],
          occurrences: 2,
          duplication: {
            '97a599f0364f75d31aa9e0deb8a0d510': 2,
          },
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
      .catch(err => { throw err; })
  );

  it('identifies duplicate files', () =>
    analyzer.analyzeFolderRecursive('test/mockups/duplicateFilesTest', '.csv', mongodb, socket)
      .then(result => result.sort().should.deep.equal([
        {
          files: [
            'test/mockups/duplicateFilesTest/duplicate1.csv',
            'test/mockups/duplicateFilesTest/duplicate2.csv'
          ],
          _id: 'ece9e8a91157824de7c5a9527c322ea9',
          hash: 'ece9e8a91157824de7c5a9527c322ea9',
          closestRelatives: [],
          occurrences: 2,
          duplication: { '97a599f0364f75d31aa9e0deb8a0d510': 2 },
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
      .catch(err => { throw err; })
  );

  describe('schema analysis', () => {
    it('summarizes the schemas of a particular folder and its subfolders', () =>
      analyzer.analyzeFolderRecursive('test/mockups/subfoldertest/', 'csv', mongodb, socket)
        .then(summary =>
          summary.sort().should.deep.equal([
            {
              _id: 'ef4e1166fc061ac5c3ce0ee63ec4f518',
              hash: 'ef4e1166fc061ac5c3ce0ee63ec4f518',
              files: ['test/mockups/subfoldertest/rd.csv'],
              closestRelatives: [],
              occurrences: 1,
              duplication: { '2236ff79eb11d4ad7d12d1dc4a5acbaf': 1 },
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
              duplication: { '97a599f0364f75d31aa9e0deb8a0d510': 2 },
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
          ])
        )
    );
  });
});
