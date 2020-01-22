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

    mockInsertArticle = jest.fn();

    document.body.innerHTML = `
    
        <div id="watchList">
            <img src="images/ameisenbaer-transparent.png" alt="Ameisenbaer Icon">
            <h1>Your saved articles</h1>
            <ul id="watchListWrapper"></ul>
        </div>
    `;

    let result = {
        watchList: [
            
        ]
    };

    it('should call insertArticle for each Article in storage', () => {

        let rndInt = getRndInteger();

        let mockEntry = {
            title: "mockTitle",
            url: "mockUrl"
        };

        for (let index = 0; index < rndInt + 1; index++) {
            
            result.watchList.push(mockEntry);
        };

        displayArticles(result, mockInsertArticle);

        expect(mockInsertArticle).toHaveBeenCalledTimes(rndInt + 1);
    });
});

describe('Function insertArticle', () => {

    const insertArticle = require('../popup').insertArticle;

    document.body.innerHTML = ``;

    document.body.innerHTML = `
    
        <div id="watchList">
            <img src="images/ameisenbaer-transparent.png" alt="Ameisenbaer Icon">
            <h1>Your saved articles</h1>
            <ul id="watchListWrapper"></ul>
        </div>
    `;

    it('should insert Article into DOM', () => {

        let mockArticle = {
            title: "mockTitle",
            url: "mockUrl"
        };

        insertArticle(mockArticle);

        let wrapper = document.getElementById('watchListWrapper');

        expect(wrapper.innerHTML).toMatch(new RegExp(mockArticle.title));

        expect(wrapper.innerHTML).toMatch(new RegExp(mockArticle.url));
    });
});