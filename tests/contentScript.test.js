//const chrome = require('./chrome').chrome;
const chrome = require('sinon-chrome/extensions');
window.chrome = chrome;
const {
    receiveMessage,
    insertWrapper,
    main,
    handleSubmit,
    clearResults,
    fetchResults,
    displayResults,
    saveArticle,
    updateWatchlist,
    setWatchlist,
    displayError
} = require('../contentScript.js');

describe('Function displayError', () => {

    beforeAll(() => {

        jest.resetModules();

    })

    document.body.innerHTML = `
    
        <div id="wikiSearchWrapper">
            <div id="searchForm">
                <form name="searchForm">
                    <input id="searchFormInput" type="search" name="search" placeholder="Search on Wikipedia">
                    <button id="submitSearch" type="submit"></button>
                </form>
            </div>
            <button id="clearSearch" type="click">&#10006</button>
            <div id="resultWrapper">
                <section id="searchResults"></section>
            </div>
        </div>
    `;    

    it('should insert testMessage into DOM', () => {

        let testMessage = 'testMessage';

        displayError(testMessage);


        expect(searchResults.innerHTML).toMatch(new RegExp(testMessage));
    });
});

describe('Function insertWrapper', () => {

    beforeAll(() => {

        jest.resetModules();

    });

    document = `

    <head>
    </head>
    <body>
    </body>
    `;

    const callbackFunction = jest.fn().mockImplementation(() =>{

        return true;
    });

    it('should insert results Wrapper into DOM', () => {

        insertWrapper(callbackFunction);

        let wrapper = document.getElementById('resultWrapper');

        expect(wrapper).toBeDefined();
    });

    it('should call callback function', () => {

        insertWrapper(callbackFunction);

        expect(callbackFunction).toHaveBeenCalled();
    });
});
