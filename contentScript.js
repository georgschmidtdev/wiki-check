import { DH_CHECK_P_NOT_PRIME } from "constants";

/* Assign HTML body elements to variables*/
let body = document.getElementsByTagName('body')[0];

/* Insert searchbar on beginning of body element, followed by div to display results of search*/
body.insertAdjacentHTML('afterbegin',`
    <div id="wrapper">
        <div id="searchForm">
            <form name="searchForm">
                <input id="searchFormInput" type="search" name="search" placeholder="Search on Wikipedia">
                <button id="submitSearch" type="submit"></button>
            </form>
            <button id="selectionSearch" type="click"></button>
        </div>
        <div id="resultWrapper">
            <section id="searchResults"></section>
        </div>
    </div>
`);


/* THE PART BELOW NEEDS TO RUN -AFTER- THE SEARCHBAR IS INJECTED TO WORK*/

let selection = "";

document.addEventListener('selectionchange', () => {

    selection = document.getSelection().toString();

    console.log(selection);

})


let selectionSearch = document.getElementById("selectionSearch");

selectionSearch.addEventListener("click", () => {

fetchResults(selection);
    
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        console.log(sender.tab);

    }
)

/* Assign search field to variable*/
let form = document.getElementById('searchForm');

/* Add event listener with function to run when submitting*/
form.addEventListener('submit', handleSubmit);

/* Callback function to submit event of search button*/
function handleSubmit(event){

  /* Prevent tab from reloading as default action on submit*/
  event.preventDefault();

  /* Store input of input field in variable*/
  let searchInput = document.getElementById('searchFormInput').value;

  /* Remove white space from input*/
  let searchQuery = searchInput.trim();

  console.log(searchQuery);

  /* Call function to search Wikipedia for search input*/
  fetchResults(searchQuery);
}

/* Get JSON file from Wikipedia*/
function fetchResults(searchQuery){
    
    /* Limit number of results with "limit=<numberOfResults>&srsearch" */
    let endpoint = `https://de.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=6&srsearch=${searchQuery}`;

    console.log(endpoint);

    fetch(endpoint)
    /* Take response from Wikipedia and return as JSON file*/
    .then(response => response.json())
    .then(data => {

        /* Make sure at least one result is available*/
        if(data.query.search.length != 0){
            
            /* Assign search results wihing JSON file to variable */
        let results = data.query.search;

        /* Call function to display results with results variable as argument*/
        displayResults(results);

        }else{

            /* Display error when no results were found*/
            displayError('No results found');
        }
        
    })
    /* Show error message in console if fetch fails*/
    .catch(() => displayError('An error occurred'));

}

/* Output actual search results from JSON response*/
function displayResults(results){

    /* Log results to console*/
    console.log(results);

    /* Assign div for results to variable*/
    let searchResults = document.getElementById('searchResults');

    /* Clear content of div before displaying results*/
    searchResults.innerHTML = '';

    /* Loop over each result*/
    results.forEach(result => {

        /* Encode the title key of each result to get valid URL by turning spaces into %20 */
        let url = encodeURI(`https://de.wikipedia.org/wiki/${result.title}`);

        /* Insert HTML for each search result*/
        searchResults.insertAdjacentHTML('beforeend',`
        
            <div class="resultItem>
                <h2 class="resultTitle">
                    <a href="${url}" target="_blank" rel="noopener">${result.title}</a><br>
                </h2>
                <span class="resultSnippet">${result.snippet}</span><br>
                <a href="${url}" class="resultLink" target="_blank" rel="noopener">${url}</a>
            </div><br>

        `);
    });
}

function displayError(message){
    let errorMessage = document.getElementById('searchResults');

    errorMessage.innerHTML = '';

    errorMessage.insertAdjacentHTML('beforeend',`

        <h3 class="errorMessage">${message}</h3>

    `);
}

function contextSearch(){
    fetchResults(selection);
}