let body = document.getElementsByTagName('body');
body.insertAdjacentHtml('afterbegin', `
    <ul id="watchList"></ul>
`);
chrome.storage.onChanged.addListener(function(){
    let watchList = document.getElementById('watchList');
    chrome.storage.sync.get('watchlist', function(watchlist){
        let articleWatchlist;
        articleWatchlist = watchlist.watchlist;
        articleWatchlist.forEach(function(article){
            watchList.insertAdjacentHtml('afterbegin', `
                <li>
                    <a href="${article}">${article}</a>
                </li>
            `);
        });
    });
})