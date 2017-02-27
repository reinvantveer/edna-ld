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
        { column1: 'data1', column2: 'data2' },
        { column1: 'data3', column2: 'data4' }
      ]);
      result.fileStats.hash.should.equal('97a599f0364f75d31aa9e0deb8a0d510');
      /* eslint no-underscore-dangle: 0 */
      // The underscore is standard for Mongodb
      result.fileStats._id.should.equal('test/mockups/test.csv');
      result.fileStats.filePath.should.equal('test/mockups/test.csv');
      return result.fileStats.size.should.equal(39);
    })
  );

  it('reads a differently ordered test csv', () => csvReader('test/mockups/inverseOrderTest/inverseTest.csv')
    .then(result => {
      result.data.should.deep.equal([
          { column1: 'data1', column2: 'data2' },
          { column1: 'data3', column2: 'data4' }
      ]);
      result.fileStats.hash.should.equal('97a599f0364f75d31aa9e0deb8a0d510');
      /* eslint no-underscore-dangle: 0 */
      // The underscore is standard for Mongodb
      result.fileStats._id.should.equal('test/mockups/inverseOrderTest/inverseTest.csv');
      result.fileStats.filePath.should.equal('test/mockups/inverseOrderTest/inverseTest.csv');
      return result.fileStats.size.should.equal(39);
    })
  );

  it('reads a differently cased test csv', () => csvReader('test/mockups/caseInsensitiveTest/test.csv')
    .then(result => {
      result.data.should.deep.equal([
          { Column1: 'data1', Column2: 'data2' },
          { Column1: 'data3', Column2: 'data4' }
      ]);
      result.fileStats.hash.should.equal('97a599f0364f75d31aa9e0deb8a0d510');
      /* eslint no-underscore-dangle: 0 */
      // The underscore is standard for Mongodb
      result.fileStats._id.should.equal('test/mockups/caseInsensitiveTest/test.csv');
      result.fileStats.filePath.should.equal('test/mockups/caseInsensitiveTest/test.csv');
      return result.fileStats.size.should.equal(39);
    })
  );

  it('catches parse errors', () => csvReader('test/mockups/faultyWKTtest/noWKT.wkt')
    .should.be.rejectedWith(Error, 'Number of columns on line 2 does not match header'));
});
