/**
 * Created by vagrant on 2/17/17.
 */

const upsertMany = require('../lib/mongoWriter').upsertMany;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

// MongoDb collections API stub
const collection = {
  updateOne: () => Promise.reject(new Error('Invoked error for test'))
};


/* eslint-env mocha */
describe('The mongodb writer', () => {
  it('rejects an empty set of documents ', () =>
    upsertMany([]).should.be.rejectedWith(Error, 'Expected an array'));

  it('rejects a string as input', () =>
    upsertMany('no array').should.be.rejectedWith(Error, 'Expected an array'));

  it('rejects an empty set of documents missing an _id', () =>
    upsertMany([{ bing: 'bong' }]).should.be.rejectedWith(Error, 'Expect to find _id key'));

  it('rejects a missing collection', () =>
    upsertMany([{ _id: 'dummy' }]).should.be.rejectedWith(Error, 'Expect to find collection'));

  it('rejects a collection missing a updateOne method', () =>
    upsertMany([{ _id: 'dummy' }], { blip: 'blap' }).should.be.rejectedWith(Error, 'Collection has no method "updateOne"'));

  it('Catches additional errors', () =>
    upsertMany([{ _id: 'dummy' }], collection).should.be.rejectedWith(Error, 'Invoked error for test'));
});
