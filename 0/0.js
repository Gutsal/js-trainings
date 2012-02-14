/*   XMLHTTPRequest Constructor    */
function XMLHTTP_Request (keyPhrase) {
    this.phrase = keyPhrase;
    XMLHTTP_Request.http = null;
    XMLHTTP_Request.READY = 4;
    XMLHTTP_Request.STATUS = 200;
    XMLHTTP_Request.URL = 'http://javascript-training.gametrailers.minsk.epam.com/jstraning/countries.php?q=';
}

XMLHTTP_Request.prototype.CreateRequest = function(){
    if (window.XMLHttpRequest) {
        try {
            XMLHTTP_Request.http = new XMLHttpRequest();
        } catch (e){
            console.log("Name", e.name, "Message", e.message);
        }
    } else if (window.ActiveXObject) {
        try {
            XMLHTTP_Request.http = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e){
            try {
                XMLHTTP_Request.http = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e){
                console.log("Name", e.name, "Message", e.message);
                //console.exception(e.name, e.message);
            }
        }
    }
    return XMLHTTP_Request.http;
}

XMLHTTP_Request.prototype.SendRequest = function(){
    if (XMLHTTP_Request.http){
        searchUrl = XMLHTTP_Request.URL+this.phrase;
        XMLHTTP_Request.http.onreadystatechange =  function(){
            if(XMLHTTP_Request.http.readyState == XMLHTTP_Request.READY){
                if(XMLHTTP_Request.http.status == XMLHTTP_Request.STATUS){
                    SearchCountry.searchReply();
                }
                else {
                    console.log("Unable to get data. XMLHTTP_Request.http.status:",XMLHTTP_Request.http.status);
                }
            }
        }
        XMLHTTP_Request.http.open('get', searchUrl, true);
        XMLHTTP_Request.http.send(null);
    }else{
        console.log("Браузер не поддерживает AJAX");
    }
}

/* Event listener Constructor */
function EventListener (el, type, fn) {
    this.el = el;
    this.type = type;
    this.fn = fn;
}

/* ADD Event Method */
EventListener.prototype.Create_EventListener = function(){
    if (typeof this.el.addEventListener === 'function') {
        this.el.addEventListener(this.type, this.fn, false);
    } else if (typeof this.el.attachEvent === 'function') {
        this.el.attachEvent('on' + this.type, this.fn);
    } else {
        this.el['on' + this.type] = this.fn;
    }
}

/* REMOVE Event Method */
EventListener.prototype.Remove_EventListener = function(){
    if (typeof this.el.removeEventListener === 'function') {
        this.el.removeEventListener(this.type, this.fn, false);
    } else if (typeof this.el.detachEvent === 'function') {
        this.el.detachEvent('on' + this.type, this.fn);
    } else {
        //this.el['on' + this.type] = this.fn;
    }
}

/* Key Code Constructor */
function GetKeyCode(e){
    e = e || window.event;
    e.key = e.key || e.keyCode;
    return e.key;
}

/* Get element INPUT for handling */
SearchCountry.prototype.getElementInput = function(){
    //alert(this);
    var searchInputCollection = document.getElementsByClassName(this.keyword);   // Collection of objects for search
    var searchInputArray = Array.prototype.slice.call(searchInputCollection);   // Conversion to Array
    var searchInput = searchInputArray.shift();                                 // Extraction the first element of the array
    return searchInput;
};

/* Create Element to output the results */
SearchCountry.prototype.creatElement = function(tagElement, idElement, searchId){
    this.tagElement = tagElement;
    this.idElement = idElement;
    var results = document.createElement(this.tagElement);
    results.className = 'select-result';
    results.multiple = 'multiple';

    searchParent = searchId.parentNode;
    searchParent.appendChild(results);     // open results list
    return results;
};


/* Search Request Constructor */
function SearchCountry(word) {

    SearchCountry.LEFT = 37;
    SearchCountry.UP = 38;
    SearchCountry.RIGHT = 39;
    SearchCountry.DOWN = 40;
    SearchCountry.ENTER = 13;
    SearchCountry.countries = null;

    this.keyword = word;

    /*for(var i=0; i<searchInputCollection.length; i++) {
     searchInputCollection[i].onfocus = function(e) {
     e = e || window.event;
     e.target = e.srcElement || e.target;
     //alert(e.target);
     searchId = e.target
     var results = SearchCountry.creatElement('select',searchId);
     SearchCountry.init(searchId,results);
     //return searchId;
     }
     }*/

    var searchId = this.getElementInput();                      // Element INPUT initialization
    var results = this.creatElement('select',this.keyword,searchId);     // Result Element initialization

    /* input handler */
    SearchCountry.inputHandler = function (e) {
        var keyCodeValue = GetKeyCode(e);
        results.selectedIndex = -1;
        if (searchId.value.length > 2 && keyCodeValue != SearchCountry.ENTER) {
            if (keyCodeValue == SearchCountry.DOWN) {
                results.focus();
                results.getElementsByTagName('option')[0].selected = 'selected';
                //EventListener(results, 'keydown', SearchCountry.listHandler);
                var eventInput = new EventListener(results, 'keydown', SearchCountry.listHandler);
                eventInput.Create_EventListener();
                return;
            }
            if (keyCodeValue != SearchCountry.LEFT && keyCodeValue != SearchCountry.UP && keyCodeValue != SearchCountry.RIGHT) {
                var req = new XMLHTTP_Request(searchId.value);   // Constructor call XMLHTTPRequest
                req.CreateRequest();
                req.SendRequest();
            }
        }else if (searchId.value.length < 3){ // if empty area - hide the result
            results.style.display = 'none';
        }
    };

    /* list handler */
    SearchCountry.listHandler = function(e) {
        var keyCodeValue = GetKeyCode(e);
        if(keyCodeValue) {
            // if "Enter" key
            if (keyCodeValue == SearchCountry.ENTER){
                searchId.value = this[this.selectedIndex].text;
                this.selectedIndex = -1;
                this.style.display = 'none';
                searchId.focus();
                // prevent default action
                if(e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
                return;
            }
            // if "Up Arrow" key
            if (keyCodeValue == SearchCountry.UP){
                if (this.selectedIndex == 0) {
                    searchId.focus();
                }
            }
            // if choose the last
            if (keyCodeValue == SearchCountry.DOWN){
                if (this.selectedIndex == this.length-1) {
                    this.selectedIndex = -1;
                }
            }
        }
    };

    /* Mouse click handler */
    SearchCountry.clickHandler = function(){
        searchId.value = this[this.selectedIndex].text;
        this.selectedIndex = -1;
        this.style.display = 'none';
        searchId.focus();
    };

    //  Building a list Method
    SearchCountry.searchReply = function() {
        var response = JSON.parse(XMLHTTP_Request.http.responseText);
        response = response.countries;
        //var response = {"countries":[{"id":20,"iso2":"BY","iso3":"BLR","short_name":"Belarus","long_name":"Republic of Belarus"},{"id":21,"iso2":"BE","iso3":"BEL","short_name":"Belgium","long_name":"Kingdom of Belgium"},{"id":22,"iso2":"BZ","iso3":"BLZ","short_name":"Belize","long_name":"Belize"}]}
        var listHTML = '';
        for (var i=0; i<response.length; i++){
            listHTML += '<option value="'+response[i].id+'">'+response[i].short_name+'</option>';
        }
        results.innerHTML = listHTML;
        results.style.display = "block";
    };

    this.init = function(){
        var eventInput = new EventListener(searchId, 'keyup', SearchCountry.inputHandler);      // INPUT handler call
        eventInput.Create_EventListener();
        var eventList = new EventListener(results, 'click', SearchCountry.listHandler);         // Parsing of results list
        eventList.Create_EventListener();
        var eventMauseClick = new EventListener(results, 'click', SearchCountry.clickHandler);  // Mouse click event
        eventMauseClick.Create_EventListener();
    }

    this.init();
}

var search = new SearchCountry('keyword');
//var search1 = new SearchCountry('keyword1');
