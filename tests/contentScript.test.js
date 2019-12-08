const expect = require('chai').expect;
const nock = require('nock');

const fetchResults = require('../contentScript').fetchResults;

describe('Fetch Wikipedia Data', () => {
    beforeEach(() => {
        nock('https://de.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=6&srsearch=hallo')
        .reply(200, response);
    });

    it('List results by keyword', () => {
        return fetchResults('hallo')
        .then(response => {
            expect(typeof response).to.equal('object');

            expect(response.query.search.length).to.equal(6)
        });
    });
});