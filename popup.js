// Listen for changes to storage.sync
chrome.storage.onChanged.addListener(function(){

    getWatchList(displayArticles);
});

window.onload = getWatchList(displayArticles);

function getWatchList(displayCallback){

    // Get content from storage.sync
    chrome.storage.sync.get('watchList', function(result){
       
        displayCallback(result, insertArticle);
    });
};

function displayArticles(result, insertCallback){

    // Assign HTML wrapper of watchlist to variable
    let watchListWrapper = document.getElementById('watchListWrapper');

    let articleWatchlist = result.watchList;

    // Clear current list of saved articles then write new list entries
    watchListWrapper.innerHTML = '';

    articleWatchlist.forEach(function(article){

            insertCallback(article);
    });
};

function insertArticle(article){

    // Assign HTML wrapper of watchlist to variable
    let watchListWrapper = document.getElementById('watchListWrapper');

    watchListWrapper.insertAdjacentHTML('afterbegin', `
            
        <li class="watchListItems">
            <a href="${article.url}" target="_blank" rel="noopener">${article.title}</a>
        </li>
    `);
};

module.exports = {

    getWatchList: getWatchList,
    displayArticles: displayArticles,
    insertArticle: insertArticle
};