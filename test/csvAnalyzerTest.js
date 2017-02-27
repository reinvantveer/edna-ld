/**
 * Created by reinvantveer on 2/16/17.
 */

const analyzer = require('../lib/csvProcessor');
const chai = require('chai');

chai.should();

/* eslint-env mocha */
describe('The csv processor', () => {
  it('generates a json schema for the csv', done => {
    analyzer('test/mockups/test.csv', (err, result) => {
      if (err) return done(err);
      result.schemaData.schema.should.deep.equal({
        $schema: 'http://json-schema.org/draft-04/schema#',
        items: {
          properties: {
            column1: { type: 'string' },
            column2: { type: 'string' }
          },
          type: 'object'
        },
        type: 'array'
      });
      return done();
    });
  });

  describe('file hashing', () => {
    it('generates data and metadata for a test csv', done => {
      analyzer('./test/mockups/test.csv', (err, result) => {
        if (err) return done(err);
        result.schemaData.hash.should.deep.equal('ece9e8a91157824de7c5a9527c322ea9');
        result.schemaData.files.should.deep.equal(['./test/mockups/test.csv']);
        result.schemaData.schema.should.deep.equal({
          $schema: 'http://json-schema.org/draft-04/schema#',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              column1: { type: 'string' },
              column2: { type: 'string' }
            }
          }
        });
        return done();
      });
    });

    it('generates a hash of an identical file', done => {
      analyzer('test/mockups/subfoldertest/subfolder/test2.csv', (err, result) => {
        if (err) return done(err);
        result.schemaData.hash.should.deep.equal('ece9e8a91157824de7c5a9527c322ea9');
        result.schemaData.files.should.deep.equal(['test/mockups/subfoldertest/subfolder/test2.csv']);
        result.schemaData.schema.should.deep.equal({
          $schema: 'http://json-schema.org/draft-04/schema#',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              column1: { type: 'string' },
              column2: { type: 'string' }
            }
          }
        });
        return done();
      });
    });

    it('rejects hashing of a non-existing file', () =>
      analyzer('nonexist', (err) =>
        err.message.should.equal('ENOENT: no such file or directory, stat \'nonexist\'')));
  });
});
