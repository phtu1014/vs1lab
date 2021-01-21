/* Dieses Skript wird ausgeführt, wenn der Browser index.html lädt. */

// Befehle werden sequenziell abgearbeitet ...

/**
 * "console.log" schreibt auf die Konsole des Browsers
 * Das Konsolenfenster muss im Browser explizit geöffnet werden.
 */
console.log("The script is going to start...");

// Es folgen einige Deklarationen, die aber noch nicht ausgeführt werden ...

// Hier wird die verwendete API für Geolocations gewählt
// Die folgende Deklaration ist ein 'Mockup', das immer funktioniert und eine fixe Position liefert.
GEOLOCATIONAPI = {
    getCurrentPosition: function(onsuccess) {
        onsuccess({
            "coords": {
                "latitude": 49.013790,
                "longitude": 8.390071,
                "altitude": null,
                "accuracy": 39,
                "altitudeAccuracy": null,
                "heading": null,
                "speed": null
            },
            "timestamp": 1540282332239
        });
    }
};

// Die echte API ist diese.
// Falls es damit Probleme gibt, kommentieren Sie die Zeile aus.
GEOLOCATIONAPI = navigator.geolocation;


function GeoTag(lat, lon, name, hashtag) {
    this.latitude = lat;
    this.longitude = lon;
    this.name = name;
    this.hashtag = hashtag;
}

var ajax = new XMLHttpRequest();


///////////////////////////////////BONUS///////////////////////////////////////vvv

let current_page = 1;
var rows = 3;
var rowURL = "rows="+rows;

var prevbutton = document.getElementById("previousButton");
var minustwobutton = document.getElementById("minustwo");
var minusonebutton = document.getElementById("minusone");

var currbutton = document.getElementById("currentButton");
currbutton.classList.add("active");

var plusonebutton = document.getElementById("plusone");
var plustwobutton = document.getElementById("plustwo");
var nextbutton = document.getElementById("nextButton");


var maxPageNum = 0;

var updatePage = function(){
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4){
            var update = JSON.parse(ajax.response);
            maxPageNum = update[0];

            console.log(" | last: " + maxPageNum);
            buttonLogic(current_page);
        }
    };

    ajax.open("GET", "/update?", true);
    ajax.send();
};

function buttonLogic(index){
    plustwobutton.disabled = false;
    plusonebutton.disabled = false;
    plustwobutton.setAttribute("value", index+2);
    plusonebutton.setAttribute("value", index+1);

    minustwobutton.disabled = false;
    minusonebutton.disabled = false;
    minustwobutton.setAttribute("value", index-2);
    minusonebutton.setAttribute("value", index-1);

    currbutton.setAttribute("value", index);

    nextbutton.disabled = false;
    prevbutton.disabled = false;

    if(index == maxPageNum){
        nextbutton.disabled = true;
        plustwobutton.disabled = true;
        plustwobutton.setAttribute("value", "");
        plusonebutton.disabled = true;
        plusonebutton.setAttribute("value", "");
        console.log("last page");
    }
    else if(index == maxPageNum-1){
        plustwobutton.disabled = true;
        plustwobutton.setAttribute("value", "");
        console.log("pre_last_page");
    }
    if(index == 1){
        prevbutton.disabled = true;
        minustwobutton.disabled = true;
        minusonebutton.disabled = true;
        minustwobutton.setAttribute("value", "");
        minusonebutton.setAttribute("value", "");
        console.log("first_page");
    }
    else if(index == 2){
        minustwobutton.disabled = true;
        minustwobutton.setAttribute("value", "");
        console.log("second_page");
    }

}

function loadPagePrevNext(){
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4){
            console.log(JSON.parse(ajax.response));
            generateList(JSON.parse(ajax.response));
            buttonLogic(current_page);
        }
    };
    var pageURL = "currentpage="+current_page;
    var url = "";
    url = "/geotags?"+pageURL; // link.de/geotags?search=karlsruhe
    console.log(url);
    ajax.open("GET", url, true);
    ajax.send();
}

function loadPageSpecific(index){
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4){
            console.log(JSON.parse(ajax.response));
            generateList(JSON.parse(ajax.response));
        }
    };
    var pageURL = "currentpage="+index;
    var url = "";
    url = "/geotags?"+pageURL; // link.de/geotags?search=karlsruhe
    console.log(url);
    ajax.open("GET", url, true);
    ajax.send();
}

prevbutton.addEventListener("click", function(){
    current_page--;
    changeActiveSite(currbutton);
    loadPagePrevNext();
});

nextbutton.addEventListener("click", function() {
    current_page++;
    changeActiveSite(currbutton);
    loadPagePrevNext();
});

minustwobutton.addEventListener("click", function(){
    changeActiveSite(this);
    var newCurrentPage = current_page-2;
    loadPageSpecific(newCurrentPage);
});

minusonebutton.addEventListener("click", function(){
    changeActiveSite(this);
    var newCurrentPage = current_page-1;
    loadPageSpecific(newCurrentPage);
});

currbutton.addEventListener("click", function(){
    changeActiveSite(this);
    var newCurrentPage = current_page;
    loadPageSpecific(newCurrentPage);
});

plusonebutton.addEventListener("click", function(){
    changeActiveSite(this);
    var newCurrentPage = current_page+1;
    loadPageSpecific(newCurrentPage);
});

plustwobutton.addEventListener("click", function(){
    changeActiveSite(this);
    var newCurrentPage = current_page+2;
    loadPageSpecific(newCurrentPage);
});

function changeActiveSite(site){
    var current_btn = document.querySelector(".pagenumbers input.active");
    current_btn.classList.remove("active");
    site.classList.add("active");
}
///////////////////////////////////BONUS///////////////////////////////////////^^^

document.getElementById("tsubmit").addEventListener("click", function(){
    var lat = document.getElementById('tLatitude').value;
    var lon = document.getElementById('tLongitude').value;
    var name = document.getElementById('tName').value;
    var hashtag = document.getElementById('tHashtag').value;
    var data = JSON.stringify(new GeoTag(lat, lon, name, hashtag));
    ajax.onreadystatechange = function(){

        if(ajax.readyState == 4){
            generateList(JSON.parse(ajax.response));
            current_page = 1;
            updatePage();
        }
    };
    ajax.open("POST", "/geotags" , true);
    ajax.setRequestHeader("Content-Type", "application/json");
    console.log(data);
    ajax.send(data);
});

document.getElementById("fsubmit").addEventListener("click", function(){

    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4){
            generateList(JSON.parse(ajax.response));
            current_page = 1;
            updatePage();
        }
    };
    var latURL = "latitude="+ document.getElementById("fLatitude").value;
    var longURL = "longitude="+ document.getElementById("fLongitude").value;
    var termURL = "search="+ document.getElementById("discovery").value;

    var url = "";

    if(document.getElementById("discovery").value){
        url = "/geotags?"+termURL; // link.de/geotags?search=karlsruhe
    }
    else{
        url = "/geotags?"+latURL+"&"+longURL;  //link.de/geotags?latitude=123&longitude=567
    }
    console.log(url);
    ajax.open("GET", url, true);
    ajax.send();
});

var generateList = function(tags){
    var res = [];

    for(var i = 0; i < rows; i++) {
        var tag = tags[i];
        document.getElementById(i.toString()).innerHTML = "";
        if (tag !== null && tag !== undefined) {
            res.push(tag);
            console.log("after push:" + tags);
            document.getElementById(i.toString()).innerHTML = tag.name + " (" + tag.latitude + ", " + tag.longitude + ") " + tag.hashtag;
        }
    }
    updatePage();
    gtaLocator.updateLocation(res);

};



/**
 * GeoTagApp Locator Modul
 */
var gtaLocator = (function GtaLocator(geoLocationApi) {

    // Private Member

    /**
     * Funktion spricht Geolocation API an.
     * Bei Erfolg Callback 'onsuccess' mit Position.
     * Bei Fehler Callback 'onerror' mit Meldung.
     * Callback Funktionen als Parameter übergeben.
     */
    var tryLocate = function(onsuccess, onerror) {
        if (geoLocationApi) {
            geoLocationApi.getCurrentPosition(onsuccess, function(error) {
                var msg;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        msg = "User denied the request for Geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        msg = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        msg = "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR:
                        msg = "An unknown error occurred.";
                        break;
                }
                onerror(msg);
            });
        } else {
            onerror("Geolocation is not supported by this browser.");
        }
    };

    // Auslesen Breitengrad aus der Position
    var getLatitude = function(position) {
        return position.coords.latitude;
    };

    // Auslesen Längengrad aus Position
    var getLongitude = function(position) {
        return position.coords.longitude;
    };

    // Hier API Key eintragen
    var apiKey = "NvejPYskc4AqUtyYGy6ZBCqGomwtq5lC";

    /**
     * Funktion erzeugt eine URL, die auf die Karte verweist.
     * Falls die Karte geladen werden soll, muss oben ein API Key angegeben
     * sein.
     *
     * lat, lon : aktuelle Koordinaten (hier zentriert die Karte)
     * tags : Array mit Geotag Objekten, das auch leer bleiben kann
     * zoom: Zoomfaktor der Karte
     */
    var getLocationMapSrc = function(lat, lon, tags, zoom) {
        zoom = typeof zoom !== 'undefined' ? zoom : 10;

        if (apiKey === "YOUR_API_KEY_HERE") {
            console.log("No API key provided.");
            return "images/mapview.jpg";
        }

        var tagList = "&pois=You," + lat + "," + lon;
        if (tags !== undefined && tags !== null)tags.forEach(function (tag) {
                tagList += "|" + tag.name + "," + tag.latitude + "," + tag.longitude;
            });
        var urlString = "https://www.mapquestapi.com/staticmap/v4/getmap?key=" +
            apiKey + "&size=600,400&zoom=" + zoom + "&center=" + lat + "," + lon + "&" + tagList;

        console.log("Generated Maps Url: " + urlString);
        return urlString;
    };

    return { // Start öffentlicher Teil des Moduls ...

        // Public Member

        readme: "Dieses Objekt enthält 'öffentliche' Teile des Moduls.",


        updateLocation: function(tags) {

          var img = document.getElementById('result-img');

          var zoom = 12;

          var onsuccess = function(position){
            var latitude = getLatitude(position);
            var longitude = getLongitude(position);

            document.getElementById('tLatitude').setAttribute("value", latitude);
            document.getElementById('tLongitude').setAttribute("value", longitude);
            document.getElementById('fLatitude').setAttribute("value", latitude);
            document.getElementById('fLongitude').setAttribute("value", longitude);

            img.src = getLocationMapSrc(latitude, longitude, tags, zoom);
          };

          var onerror = function(msg){
          alert(msg);
        };


          if(document.getElementById('tLatitude').value === "" || document.getElementById('tLongitude').value === ""){
            console.log("locating user...");
            tryLocate(onsuccess, onerror);
          }
          else{
            console.log("using existing data");
            var latitude = document.getElementById('tLatitude').value;
            var longitude = document.getElementById('tLongitude').value;

            img.src = getLocationMapSrc(latitude, longitude, tags, zoom);

          }
        }

    }; // ... Ende öffentlicher Teil
})(GEOLOCATIONAPI);

/**
 * $(function(){...}) wartet, bis die Seite komplett geladen wurde. Dann wird die
 * angegebene Funktion aufgerufen. An dieser Stelle beginnt die eigentliche Arbeit
 * des Skripts.
 */
$(function() {
  gtaLocator.updateLocation();
});
