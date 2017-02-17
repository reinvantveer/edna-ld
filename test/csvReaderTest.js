/**
 * Created by vagrant on 12/5/16.
 */
const csvReader = require('../lib/csvReader');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

/* eslint-env mocha */
describe('The csv reader', () => {
  it('reads the test csv', () => csvReader('test/mockups/test.csv')
      .then(result => {
        result.data.should.deep.equal([
            { column1: 'data1', column2: '1' },
            { column1: 'data3', column2: '2' }
        ]);
        result.fileStats.hash.should.equal('a3af1daab3450c2d9c6dd3a2d81cc477');
        /* eslint no-underscore-dangle: 0 */
        // The underscore is standard for Mongodb
        result.fileStats._id.should.equal('test/mockups/test.csv');
        result.fileStats.filePath.should.equal('test/mockups/test.csv');
        return result.fileStats.size.should.equal(31);
      })
  );

  it('catches parse errors', () => csvReader('test/mockups/faultyWKTtest/noWKT.wkt')
      .should.be.rejectedWith(Error, 'Number of columns on line 2 does not match header'));
});
