// Declare variable for selected Text
let selection = "";

// Assigns currently selected Text to variable
document.addEventListener('selectionchange', () => {

    selection = document.getSelection().toString();
})

// Listen for message from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

    // Call function to handle reaction to message
    receiveMessage(request, sender, sendResponse);
})


//--------------------------------------------------------------------------------
// FUNCTIONS

//Handle functionality after receiving message from background script
function receiveMessage(request, sender, sendResponse){

    /* Search for selected Text if message contains keyword */
    if(request.message == "contextSearch"){
        
        sendResponse({message: "Context Menu search started"});

        fetchResults(selection);
    }if(request.message == "insertWrapper"){

        sendResponse({message: "Wrapper inserted"});

        insertWrapper(main);
    }
    return true;
}

// Insert searchbar on beginning of body element, followed by div to display results of search
function insertWrapper(callback) {

    // Listen for page to load, then create result wrapper
    let body = document.getElementsByTagName('body')[0];
    
    body.insertAdjacentHTML('afterbegin', `
    <div id="wikiSearchWrapper">
        <div id="searchForm">
            <form name="searchForm">
                <input id="searchFormInput" type="search" name="search" placeholder="Search on Wikipedia">
                <button id="submitSearch" type="submit"></button>
            </form>
        </div>
        <button id="clearSearch" type="click">&#10006</button>
        <div id="resultWrapper">
            <section id="searchResults"></section>
        </div>
    </div>
    `);

    callback();
}

function main(){
    // THIS PART NEEDS TO RUN -AFTER- THE SEARCHBAR IS INJECTED TO WORK

    // Assign search field to variable
    let form = document.getElementById('searchForm');

    // Add event listener with function to run when submitting
    form.addEventListener('submit', handleSubmit);


    // Callback function to submit event of search button
    function handleSubmit(event){

        // Prevent tab from reloading as default action on submit
        event.preventDefault();

        // Store input of input field in variable
        let searchInput = document.getElementById('searchFormInput').value;

        // Remove white space from input
        let searchQuery = searchInput.trim();

        // Call function to search Wikipedia for search input
        fetchResults(searchQuery);
    }

    // Assign Button to variable for use with selected Text
    let clearSearch = document.getElementById("clearSearch");

    // Listen for click of button and search for selected Text
    clearSearch.addEventListener("click", () => {

        // Assign div for results to variable
        let searchResults = document.getElementById('searchResults');

        // Clear content of div before displaying results
        searchResults.innerHTML = '';
    });
}

// Get JSON file from Wikipedia
function fetchResults(searchQuery){
    
    // Limit number of results with "limit=<numberOfResults>&srsearch"
    let endpoint = `https://de.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=6&srsearch=${searchQuery}`;

    fetch(endpoint)
    // Take response from Wikipedia and return as JSON file
    .then(response => response.json())
    .then(data => {

        // Make sure at least one result is available
        if(data.query.search.length != 0){
            
            // Assign search results wihing JSON file to variable
            let results = data.query.search;

            // Call function to display results with results variable as argument
            displayResults(results, saveArticle);
        }else{

            // Display error when no results were found
            displayError('No results found');
        }
    })
    // Show error message in console if fetch fails
    .catch(() => displayError('An error occurred'));
}

// Output search results from JSON response
function displayResults(results, callback){

    // Assign div for results to variable
    let searchResults = document.getElementById('searchResults');

    // Clear content of div before displaying results
    searchResults.innerHTML = '';

    // Loop over each result
    results.forEach(result => {

        // Encode the title key of each result to get valid URL by turning spaces into %20
        let url = encodeURI(`https://de.wikipedia.org/wiki/${result.title}`);

        // Insert HTML for each search result
        searchResults.insertAdjacentHTML('beforeend',`
        
            <div class="resultItem>
                <h2 class="resultTitle">
                <button class="saveArticle" name="${result.title}" type="click" value="${url}">&#128190;</button>    
                <a href="${url}" target="_blank" rel="noopener">${result.title}</a><br>
                </h2>
                <span class="resultSnippet">${result.snippet}</span><br>
                <a href="${url}" class="resultLink" target="_blank" rel="noopener">${url}</a>
            </div><br>
        `);
    });
    callback();
}

// Save article to watchlist
function saveArticle() {

    // Assign buttons in result wrapper to array
    let saveButton = document.querySelectorAll('.saveArticle');

    // Listen for button click
    saveButton.forEach(function(button){

        button.addEventListener("click", () => { 

            let title = button.name;
            let url = button.value;

            // Get current watchlist from storage
            chrome.storage.sync.get('watchList', function(result){

                updateWatchlist(result.watchList, title, url);                    
            });
        });
    });
}

// Save buttons value and name as new object in storage
function updateWatchlist(savedArticlesList, newEntryTitle, newEntryUrl){

    console.log(savedArticlesList);

    let newEntry = {title: newEntryTitle, url: newEntryUrl};
    savedArticlesList.push(newEntry);
    setWatchlist(savedArticlesList);
}

// Set new array of articles to storage
function setWatchlist(newWatchlist){

    // Remove old watchlist from storage.sync
    chrome.storage.sync.clear(function(){
    });

    // Set new array
    chrome.storage.sync.set({watchList: newWatchlist}, function(){
    });
}

// Display error message on console
function displayError(message){
    let searchResults = document.getElementById('searchResults');

    searchResults.innerHTML = '';

    searchResults.insertAdjacentHTML('beforeend',`

        <h3 class="errorMessage">${message}</h3> 
    `);
}

//module.exports = contentScript;