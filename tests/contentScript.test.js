let chrome = require('sinon-chrome/extensions');
window.chrome = chrome;

function getRndInteger(){

    let rndInt = Math.floor((Math.random() * 10) + 1);

    return rndInt;
}

beforeEach(() => {

    jest.resetModules();
});

describe('Function displayError', () => {

    const displayError = require('../contentScript').displayError;    

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

    const insertWrapper = require('../contentScript').insertWrapper;

    beforeAll(() => {

        jest.resetModules();

    });

    document = ``;

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

describe('Function clearResults', () => {

    const clearResults = require('../contentScript').clearResults;

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
    `

    it('should clear content of searchResults', () => {

        let content = document.getElementById('searchResults');

        content.innerHTML = `This is test-content`;

        clearResults();

        expect(content.innerHTML).toBe('');
    });
});

describe('Function main', () => {

    const main = require('../contentScript').main;

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
                <section id="searchResults">Placeholder content</section>
            </div>
        </div>
    `;

    form = {

        addEventListener(event, callback){

            callback(event);
        }
    }

    clearSearch = {

        addEventListener(event, callback){

            callback(event);
        }
    }

    form.addEventListener = jest.fn().mockImplementation((event, callback) => {

        callback(event);
    });

    clearSearch.addEventListener = jest.fn().mockImplementation((event, callback) => {

        callback(event);
    });

    handleSubmitMock = jest.fn().mockImplementation((event) => {

        return(event);
    });

    clearResultsMock = jest.fn().mockImplementation((event) => {

        return(event);
    });

    let submitEvent = 'submit';

    let clearEvent = 'click';


    it('should call handleSubmit function', () => {

        main();
        form.addEventListener(submitEvent, handleSubmitMock);

        expect(handleSubmitMock).toHaveBeenCalled();

    });

    it('should call clearResults function', () => {

        main();
        clearSearch.addEventListener(clearEvent, clearResultsMock);

        expect(clearResultsMock).toHaveBeenCalled();
    });
});

describe('Function receiveMesage', () => {

    const receiveMesage = require('../contentScript').receiveMessage;

    contextRequest = {

        message: 'contextSearch'
    }

    wrapperRequest = {
        
        message: 'insertWrapper'
    }

    mockFetchResults = jest.fn(selection => selection);

    mockInsertWrapper = jest.fn(fn => fn);

    sendResponse = jest.fn(message => message);

    it('should call fetchResults', () => {

        let selection = 'mocked selection'

        receiveMesage(contextRequest, mockFetchResults, mockInsertWrapper);

        expect(mockFetchResults).toHaveBeenCalled();
    });

    it('should call insertWrapper', () => {

        receiveMesage(wrapperRequest, mockFetchResults, mockInsertWrapper);

        expect(mockInsertWrapper).toHaveBeenCalled();
    });
});

describe('Function displayResults', () => {

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
            <div>
                <section id="mockList"></section>
            </div>
        </div>
    `;

    const displayResults = require('../contentScript').displayResults;

    const mockResults = require('./response').response;

    let results = mockResults.data.query.search;

    mockCallbackSaveArticle = jest.fn();
    
    mockCallbackInsertResult = jest.fn();

    it('should assign searchResults wrapper', () => {

        displayResults(results, mockCallbackInsertResult, mockCallbackSaveArticle);

        expect(searchResults).toBeDefined();
    });

    it('should fill searchResults wrapper', () => {

        displayResults(results, mockCallbackInsertResult, mockCallbackSaveArticle);

        expect(searchResults.innerHTML).not.toBe('');
    });

    it('should call insertResult 6 times for 6 articles', () => {

        let length = results.length;

        displayResults(results, mockCallbackInsertResult, mockCallbackSaveArticle);

        expect(mockCallbackInsertResult).toHaveBeenCalled();

    });

    it('should call callback', () => {

        displayResults(results, mockCallbackInsertResult, mockCallbackSaveArticle);

        expect(mockCallbackSaveArticle).toHaveBeenCalled();

    });
});

describe('Function insertResult', () => {

    const insertResult = require('../contentScript').insertResult;

    const mockResult = require('./response').response.data.query.search[0];

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

    let wrapper = document.getElementById('searchResults');

    let mockUrl = encodeURI(`https://de.wikipedia.org/wiki/${mockResult.title}`);

    it('should concatenate url with title of result', () => {

        insertResult(mockResult, wrapper);

        expect(wrapper.innerHTML).toMatch(new RegExp(mockUrl));
    })

});

describe('Function saveArticle', () => {

    const saveArticle = require('../contentScript').saveArticle;

    mockAssignSaveButtons = jest.fn().mockImplementation(() => {

        let buttons = document.querySelectorAll('.saveArticle');

        return buttons;
    });

    mockAssignSaveListeners = jest.fn();

    document.body.innerHTML = `
    
        <div id="resultWrapper">
            <section id="searchResults">
            
            </section>
        </div>
    `;

    it('should call assignSaveButtons for all buttons', () => {

        let rndInt = getRndInteger();

        let wrapper = document.getElementById('searchResults');

        wrapper.innerHTML = ``;

        for (let index = 0; index < rndInt + 1; index++) {
            
            wrapper.insertAdjacentHTML('beforeend', `

                <button class="saveArticle" name="mockName" type="click" value="mockUrl">&#128190;</button>    
            `);
        };

        saveArticle(mockAssignSaveButtons, mockAssignSaveListeners);

        expect(mockAssignSaveButtons).toHaveBeenCalled();
    });

    it('should call assignSaveListener for all buttons', () => {

        let rndInt = getRndInteger();

        let wrapper = document.getElementById('searchResults');

        wrapper.innerHTML = ``;

        for (let index = 0; index < rndInt + 1; index++) {
            
            wrapper.insertAdjacentHTML('beforeend', `

                <button class="saveArticle" name="mockName" type="click" value="mockUrl">&#128190;</button>    
            `);
        };

        saveArticle(mockAssignSaveButtons, mockAssignSaveListeners);

        expect(mockAssignSaveListeners).toHaveBeenCalledTimes(rndInt + 1);
    });
});

describe('Function asssignSaveButtons', () => {

    const asssignSaveButtons = require('../contentScript').assignSaveButtons;

    document.body.innerHTML = `
    
        <div id="resultWrapper">
            <section id="searchResults">
            
            </section>
        </div>
    `;

    it('should return with all buttons', () => {

        let rndInt = getRndInteger();

        let wrapper = document.getElementById('searchResults');

        wrapper.innerHTML = ``;

        for (let index = 0; index < rndInt + 1; index++) {
            
            wrapper.insertAdjacentHTML('beforeend', `

                <button class="saveArticle" name="mockName" type="click" value="mockUrl">&#128190;</button>    
            `);
        };

        let result = asssignSaveButtons();

        expect(result.length).toBe(rndInt + 1);
    });
});