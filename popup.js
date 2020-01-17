// Listen for changes to storage.sync
chrome.storage.onChanged.addListener(function(){

    displayWatchList();
});

window.onload = displayWatchList();

function displayWatchList(){

    // Assign HTML wrapper of watchlist to variable
    let watchListWrapper = document.getElementById('watchListWrapper');

    // Get content from storage.sync
    chrome.storage.sync.get('watchList', function(result){

        let articleWatchlist = result.watchList;

        // Clear current list of saved articles then write new list entries
        watchListWrapper.innerHTML = '';

        articleWatchlist.forEach(function(article){

        console.log(articleWatchlist);
        
        watchListWrapper.insertAdjacentHTML('afterbegin', `
            <li class="watchListItems">
                <a href="${article.url}" target="_blank" rel="noopener">${article.title}</a>
            </li>
        `);
        });
    });
}