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

XMLHTTP_Request.prototype.SendRequest = function(results){
    if (XMLHTTP_Request.http){
        searchUrl = XMLHTTP_Request.URL+this.phrase;
        XMLHTTP_Request.http.onreadystatechange =  function(){
            if(XMLHTTP_Request.http.readyState == XMLHTTP_Request.READY){
                if(XMLHTTP_Request.http.status == XMLHTTP_Request.STATUS){
                    Autocomplete.searchReply(results);
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

/* Create Element to output the results */
Autocomplete.prototype.creatElement = function(tagElement, idElement, searchId){
    this.tagElement = tagElement;
    this.idElement = idElement;
    results = document.createElement(this.tagElement);
    results.className = 'select-result';
    results.id = 'select-result-'+this.keyword;
    results.multiple = 'multiple';
    searchParent = searchId.parentNode;
    searchParent.appendChild(results);     // open results list
    return results;
};


/* Search Request Constructor */
function Autocomplete(word,category) {

    Autocomplete.TAB = 9;
    Autocomplete.LEFT = 37;
    Autocomplete.UP = 38;
    Autocomplete.RIGHT = 39;
    Autocomplete.DOWN = 40;
    Autocomplete.ENTER = 13;
    Autocomplete.countries = null;

    this.keyword = word;

    var searchId = document.getElementById(this.keyword);                // Element INPUT initialization
    var results = this.creatElement('select',this.keyword,searchId);     // Result Element initialization

    /* input handler */
    Autocomplete.inputHandler = function (e) {
        var keyCodeValue = GetKeyCode(e);
        results.selectedIndex = -1;
        if (searchId.value.length > 2 && keyCodeValue != Autocomplete.ENTER) {
            if (keyCodeValue == Autocomplete.DOWN) {
                results.focus();
                results.getElementsByTagName('option')[0].selected = 'selected';
                var eventInput = new EventListener(results, 'keydown', Autocomplete.listHandler);
                eventInput.Create_EventListener();
                return;
            }
            if (keyCodeValue != Autocomplete.LEFT && keyCodeValue != Autocomplete.UP && keyCodeValue != Autocomplete.RIGHT && keyCodeValue != Autocomplete.TAB) {
                var req = new XMLHTTP_Request(searchId.value);   // Constructor call XMLHTTPRequest
                req.CreateRequest();
                req.SendRequest(results);
            }
        }else if (searchId.value.length < 3){ // if empty area - hide the result
            results.style.display = 'none';
        }
    };

    /* list handler */
    Autocomplete.listHandler = function(e) {
        var keyCodeValue = GetKeyCode(e);
        //alert(keyCodeValue);
        searchId = document.getElementById(this.id.replace(/select-result-/,''));
        //alert(searchId.id);
        if(keyCodeValue) {
            // if "Enter" key
            if (keyCodeValue == Autocomplete.ENTER){
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
            if (keyCodeValue == Autocomplete.UP){
                if (this.selectedIndex == 0) {
                    searchId.focus();
                }
            }
            // if choose the last
            if (keyCodeValue == Autocomplete.DOWN){
                if (this.selectedIndex == this.length-1) {
                    this.selectedIndex = -1;
                }
            }
        }
    };

    /* Mouse click handler */
    Autocomplete.clickHandler = function(){
        searchId.value = this[this.selectedIndex].text;
        this.selectedIndex = -1;
        this.style.display = 'none';
        searchId.focus();
    };

    //  Building a list Method
    Autocomplete.searchReply = function(results) {
        var response = JSON.parse(XMLHTTP_Request.http.responseText);
        response = response[category];
        //var response = {"countries":[{"id":20,"iso2":"BY","iso3":"BLR","short_name":"Belarus","long_name":"Republic of Belarus"},{"id":21,"iso2":"BE","iso3":"BEL","short_name":"Belgium","long_name":"Kingdom of Belgium"},{"id":22,"iso2":"BZ","iso3":"BLZ","short_name":"Belize","long_name":"Belize"}]}
        var listHTML = '';
        for (var i=0; i<response.length; i++){
            listHTML += '<option value="'+response[i].id+'">'+response[i].short_name+'</option>';
        }
        //alert(searchId.id)
        results.innerHTML = listHTML;
        results.style.display = "block";
    };

    this.init = function(){
        var eventInput = new EventListener(searchId, 'keyup', Autocomplete.inputHandler);      // INPUT handler call
        eventInput.Create_EventListener();
        var eventList = new EventListener(results, 'click', Autocomplete.listHandler);         // Parsing of results list
        eventList.Create_EventListener();
        var eventMauseClick = new EventListener(results, 'click', Autocomplete.clickHandler);  // Mouse click event
        eventMauseClick.Create_EventListener();
    }

    this.init();
}

var search = new Autocomplete('keyword','countries');
var search1 = new Autocomplete('keyword1','countries');