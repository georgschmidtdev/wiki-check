// Insert popup menu
chrome.runtime.onInstalled.addListener(function() {

    // Create empty array and set to storage.sync
    let savedArticlesList = [];
    chrome.storage.sync.set({watchList: savedArticlesList}, function(){
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher()
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });

// Create entry in context menu for chrome
chrome.runtime.onInstalled.addListener(function() {

    let newContextEntry = {
        id: "contextMenu",
        title: "Search '%s' on Wikipedia",
        contexts: ["selection"]
    };

        createContextMenu(newContextEntry);
});

chrome.webNavigation.onCompleted.addListener(function(){

    let tabId;
    tab = chrome.tabs.query({active: true, currentWindow: true}, function(tab){

        // Run function if variable "tab" is NOT null
        if(tab){
            tabId = tab[0].id;

            sendMessage(tabId, "insertWrapper");
        };
    });
});

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
        };
    }); 
});

// Create context menu functionality
function createContextMenu(newContextEntry) {
    chrome.contextMenus.create({
        "id": newContextEntry.id,
        "title": newContextEntry.title,
        "contexts": newContextEntry.contexts
    });
};

// Send message to content script
function sendMessage(tabId, type){
    
    chrome.tabs.sendMessage(tabId, {message: type});
};

module.exports = {

    createContextMenu: createContextMenu,
    sendMessage: sendMessage
};
