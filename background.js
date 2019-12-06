chrome.runtime.onInstalled.addListener(function() {
        chrome.contextMenus.create({
            "id": "contextMenu",
            "title": "Wiki-Check",
            "contexts": ["selection"]
        });
});

chrome.contextMenus.onClicked.addListener(function(tab){
    chrome.tabs.sendMessage(tabs[0].id, {message: "contextSearch", function(response){
        console.log(response.farewell);
    }})
        console.log("click")
});