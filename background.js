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

    createContextMenu("Search %s on Wikipedia");
});

//Listen for website to load completely
chrome.webNavigation.onCompleted.addListener(function(){

    messageHandler("insertWrapper", sendMsg);
});

// Listen for click of context menu
chrome.contextMenus.onClicked.addListener(function(){

    messageHandler("contextSearch", sendMsg);
});

function messageHandler(type, sendMessageCallback){

    let tabId;
    tab = chrome.tabs.query({active: true, currentWindow: true}, function(tab){

        // Run function if variable "tab" is NOT null
        if(tab){
            tabId = tab[0].id;

            sendMessageCallback(tabId, type);
        };
    });
};

// Create context menu functionality
function createContextMenu(title) {
    chrome.contextMenus.create({
        "id": "contextMenu",
        "title": title,
        "contexts": ["selection"]
    });
};

// Send message to content script
function sendMsg(tabId, type){
    
    chrome.tabs.sendMessage(tabId, {message: type});
};

module.exports = {

    messageHandler: messageHandler,
    createContextMenu: createContextMenu,
    sendMsg: sendMsg
};
