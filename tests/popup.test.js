let chrome = require('sinon-chrome/extensions');
window.chrome = chrome;

function getRndInteger(){

    let rndInt = Math.floor((Math.random() * 10) + 1);

    return rndInt;
}

beforeEach(() => {

    jest.resetModules();
});

describe('Function getWatchList', () => {

    const getWatchList = require('../popup').getWatchList;

    mockDisplayArticles = jest.fn();

    get = jest.fn();

    global.chrome = {
        storage: {
            sync: {
                get
            }
        }
    };

    it('should get results from storage', () => {

       getWatchList(mockDisplayArticles);

       expect(get).toHaveBeenCalled();
    });
});

describe('Function displayArticles', () => {

    const displayArticles = require('../popup').displayArticles;

    document.body.innerHTML = `
    
        <div id="watchList">
            <img src="images/ameisenbaer-transparent.png" alt="Ameisenbaer Icon">
            <h1>Your saved articles</h1>
            <ul id="watchListWrapper"></ul>
        </div>
    `;

    let result = {
        watchList: [
            {
                title: "mockTitle",
                url: "mockUrl"
            }
        ]
    };

    it('should ', () => {

    });
});