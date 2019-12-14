// Insert popup menu
chrome.runtime.onInstalled.addListener(function() {
    let watchlist = ["hello", "hi", "servus"];
    chrome.storage.sync.set({watchlist:watchlist}, function(){
        console.log('Article watchlist created');
    })

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'developer.chrome.com'},
            })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });

// Create entry in context menu for chrome
chrome.runtime.onInstalled.addListener(function() {

        createContextMenu("Search on Wikipedia");
});

chrome.webNavigation.onCompleted.addListener(function(){

    let tabId;
    tab = chrome.tabs.query({active: true, currentWindow: true}, function(tab){

        // Run function if variable "tab" is NOT null
        if(tab){
            tabId = tab[0].id;

            sendMessage(tabId, "insertWrapper");
        }
    })
})

// Listen for click of context menu
chrome.contextMenus.onClicked.addListener(function(){

    // Assign currently active tab and its ID to variable
    let tabId;
    let tab;
    tab = chrome.tabs.query({active: true, currentWindow: true}, function(tab){

        // Run function if variable "tab" is NOT null
        if(tab){
            tabId = tab[0].id;

            sendMessage(tabId, "contextSearch");
        }
    })    
});

// Create context menu functionality
function createContextMenu(title) {
    chrome.contextMenus.create({
        "id": "contextMenu",
        "title": title,
        "contexts": ["selection"]
    });
}

// Send message to content script
function sendMessage(tabId, type){
    
    chrome.tabs.sendMessage(tabId, {message: type}, function(response){
    });
}