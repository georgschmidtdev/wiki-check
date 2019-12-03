chrome.runtime.onInstalled.addListener(function() {
        chrome.contextMenus.create({
            "id": "contextMenu",
            "title": "Wiki-Check",
            "contexts": ["all"]
        });
});