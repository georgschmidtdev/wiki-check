/* Create entry in context menu for chrome */
chrome.runtime.onInstalled.addListener(function() {

        chrome.contextMenus.create({
            "id": "contextMenu",
            "title": "Search on Wikipedia",
            "contexts": ["selection"]
        });

});

/* Listen for click of context menu */
chrome.contextMenus.onClicked.addListener(function(){

    console.log("clicked context menu");

    /* Assign currently active tab and its ID to variable  */
    let tabId;
    let tab = chrome.tabs.query({active: true, currentWindow: true}, function(tab){

        /* Run function if variable "tab" is NOT null */
        if(tab){
            console.log("written tab");
            tabId = tab[0].id;

            sendMessage(tabId);
        }
        console.log(tabId);    
    })    
});

/* Send message to content script */
function sendMessage(tabId){
    
    chrome.tabs.sendMessage(tabId, {message: "contextSearch"}, function(response){
        console.log(response.message);
    });
}
