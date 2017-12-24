/**
 * Checks and initiates the API Call function.
 */
(function(){
    checkAndExecute();
})()

/**
 * Checks the status of the page and pulls the data from GDAX API
 */
function checkAndExecute() {
    document.onreadystatechange = function () {
        var state = document.readyState
        if (state == 'interactive') {
            console.log('Ready to interact.')
        } else if (state == 'complete') {
            fetchAndPluginData();
        }
    }
}

/**
 * Fetches and plugin the data into the popup.
 */
function fetchAndPluginData(){
    let productIDs = getProductList();

    let productToPrice = {};
    productIDs.forEach(id => {
            productToPrice[id] = getCurrentPrice(id);
        })

    var keys = Object.keys(productToPrice);
    var newTitleRow = document.getElementById("table_head");
    var newDataRow = document.getElementById("price_data");
    for(let i=0; i < keys.length; i++) {
        //For the Header
        var newTitleHeader = document.createElement("th");
        newTitleHeader.appendChild(document.createTextNode(productIDs[i]));
        newTitleRow.appendChild(newTitleHeader);
        //For the data
        var newDataCell = document.createElement("td");
        newDataCell.appendChild(document.createTextNode(productToPrice[productIDs[i]]));
        newDataRow.appendChild(newDataCell);
    }
}

/**
 * Query the list of product IDs from GDAX
 */
function getProductList() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://api.gdax.com/products/", false );
    xmlHttp.send( null );
    var jsonData = JSON.parse(xmlHttp.responseText);
    var productIDs = collateIDs(jsonData);
    return productIDs;
}

/**
 * Collates the Product IDs into an array
 * @param data
 * @returns {Array}
 */
function collateIDs(data) {
    var length = data.length;
    var excludeArray = ['ETH-BTC', 'LTC-BTC'];
    var arrayIDs = [];
    for(let i = 1; i< length; i++) {
        if(!excludeArray.includes(data[i]['id']))
            arrayIDs.push(data[i]['id'])
    }
    return arrayIDs;
}

/**
 * Pulls the current price from GDAX exchange
 * @param productID
 * @returns {*}
 */
function getCurrentPrice(productID) {
    var xmlHttp = new XMLHttpRequest();
    let api = 'https://api.gdax.com/products/'+productID.trim()+'/ticker';

    console.log(api)

    xmlHttp.open( 'GET', api, false );
    xmlHttp.send( null );
    var jsonData = JSON.parse(xmlHttp.responseText);
    console.log(jsonData['price']);
    return jsonData['price'];
}