chrome.runtime.onInstalled.addListener(function() {
        chrome.contextMenus.create({
            "id": "contextMenu",
            "title": "Wiki-Check",
            "contexts": ["selection"]
        });
});


chrome.contextMenus.onClicked.addListener(function(){

    console.log("clicked context menu");

    let tabId;
    let tab = chrome.tabs.query({active: true, currentWindow: true}, function(tab){

        if(tab){
            console.log("written tab");
            tabId = tab[0].id;

            sendMessage(tabId);
        }
        console.log(tabId);    
    })    
});

function sendMessage(tabId){
    
    chrome.tabs.sendMessage(tabId, {message: "contextSearch"}, function(response){
        console.log(response.farewell);
    });
}
