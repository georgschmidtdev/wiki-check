chrome.storage.onChanged.addListener(function(){

    let watchList = document.getElementById('watchList');
    chrome.storage.sync.get('watchlist', function(watchlist){

        let articleWatchlist;
        articleWatchlist = watchlist.watchlist;
        articleWatchlist.forEach(function(article){

            console.log(article[0]);
            debugger;
            
            watchList.insertAdjacentHTML('afterbegin', `
                <li>
                    <a href="${article[1]}">${article[0]}</a>
                </li>
            `);
        });
    });
})