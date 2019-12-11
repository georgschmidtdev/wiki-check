const { JSDOM, VirtualConsole } = require('jsdom')

describe('wikiCheck', () => {
    let dom
    beforeEach(async () => {
        dom = await initDom('contentScript.js')
    })

    itWill('list results by keyword', () => {
        return fetchResults('hallo')
        .then(response => {
            expect(typeof response).to.equal('object');

            expect(response.query.search.length).to.equal(6)
        });
    });
});

