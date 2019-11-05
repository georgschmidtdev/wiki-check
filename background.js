// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

// Create one test item for each context type.
var contexts = ["all"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "Wiki-Check";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                       "onclick": genericOnClick});
  console.log("'" + context + "' item:" + id);
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (tab) {
    /* Create the code to be injected */
    var code = [
      'var d = document.createElement("div");',
      'd.setAttribute("style", "'
      + 'border: 1px solid black; '
      + 'width: 100px; '
      + 'height: 100px; '
      + 'top: 70px; '
      + 'left: 30px; '
      + 'z-index: 9999; '
      + '");',
      'd.setAttribute("id", "wikiResult");',
      'document.body.appendChild(d);',
      'document.getElementById("wikiResult").innerHTML="Wikipedia";'
    ].join("\n");

    /* Inject the code into the current tab */
    chrome.tabs.executeScript(tab.id, { code: code });
  }
});
