let chrome = require('sinon-chrome/extensions');
window.chrome = chrome;

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

describe('Function assignSaveButtons', () => {

    const assignSaveButtons = require('../contentScript').assignSaveButtons;

    let rndInteger = Math.floor(Math.random() * 10) + 1;

    it('should assign all buttons to saveButton object', () => {

        document.body.innerHTML = `
        
        <section id="searchResults"></section>
        `;

        let wrapper = document.getElementById('searchResults');

        for (let index = 0; index < rndInteger + 1; index++) {
        
            wrapper.insertAdjacentHTML('beforeend', `
            
            <button class="saveArticle" name="mockTitle" type="click" value="mockUrl">&#128190;</button>    
            `);
        };

        let result = assignSaveButtons();

        expect(result.length).toBe(rndInteger +1);
    });
});

describe('Function updateWatchlist', () => {

    const updateWatchlist = require('../contentScript').updateWatchlist;

    const mockCallback = jest.fn().mockImplementation((list) => {

        return list;
    });

    let newMockTitle = 'mockTitle';

    let newMockUrl = 'www.mock.com';

    it('should call setWatchlist', () => {

        let mockList = [
            {
                title: 'First title',
                url: 'www.first.com'
            },
            {
                title: 'Second title#',
                url: 'www.second.com'
            }
        ];

        updateWatchlist(mockList, newMockTitle, newMockUrl, mockCallback);

        expect(mockCallback).toHaveBeenCalled();
    });
});

describe('Function setWatchlist', () => {

    const setWatchlist = require('../contentScript').setWatchlist;

    mockCallback = jest.fn().mockImplementation(() => {

        return true;
    });

    it('should write new watchlist', () => {

        let newWatchlist = [
            {
                title: 'First title',
                url: 'www.first.com'
            },
            {
                title: 'Second title',
                url: 'www.second.com'
            },
            {
                title: 'Third title',
                url: 'www.third.com'
            }
        ];

        setWatchlist(newWatchlist, mockCallback);

        expect(mockCallback).toHaveBeenCalledTimes(2);
    });
});

describe('Function manageStorage', () => {

    const manageStorage = require('../contentScript').manageStorage;

    testCallback = jest.fn().mockImplementation((message) => {

        return message;
    });

    chrome.storage.sync.clear = jest.fn().mockImplementation(() => {

        return true;
    });

    chrome.storage.sync.set = jest.fn().mockImplementation((list) => {

        return true;
    });

    let mockList = [
        {
            title: 'First title',
            url: 'www.first.com'
        },
        {
            title: 'Second title',
            url: 'www.second.com'
        }
    ];

    let newMockList = [
        {
            title: 'First title',
            url: 'www.first.com'
        },
        {
            title: 'Second title',
            url: 'www.second.com'
        },
        {
            title: 'Third title',
            url: 'www.third.com'
        }
    ];

    it('should clear storage list', () => {

        clearMessage = 'clear';

        manageStorage(clearMessage, newMockList, testCallback);

        expect(testCallback).toHaveBeenCalledWith(clearMessage);
    });

    it('should write new list to storage', () => {

        fillMessage = 'fill';

        manageStorage(fillMessage, newMockList, testCallback);

        expect(testCallback).toHaveBeenCalledWith(fillMessage);
    });
});