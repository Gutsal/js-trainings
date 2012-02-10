/*   XMLHTTPRequest Constructor    */
function XMLHTTP_Request (keyPhrase) {
    this.phrase = keyPhrase;
    XMLHTTP_Request.http = null;

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
            searchUrl = 'http://javascript-training.gametrailers.minsk.epam.com/jstraning/countries.phsp?q='+this.phrase;
            XMLHTTP_Request.http.onreadystatechange =  function(){ SearchCountry.searchReply(); }
            XMLHTTP_Request.http.open('get', searchUrl, true);
            XMLHTTP_Request.http.send(null);
        }else{
            alert("Браузер не поддерживает AJAX");
        }
    }
}

/* Event listener Constructor */
function EventListener (el, type, fn) {
    EventListener.el = el;
    EventListener.type = type;
    EventListener.fn = fn;

    EventListener.prototype.Create_EventListener = function(){
        if (typeof EventListener.el.addEventListener === 'function') {
            EventListener.el.addEventListener(EventListener.type, EventListener.fn, false);
        } else if (typeof EventListener.el.attachEvent === 'function') {
            EventListener.el.attachEvent('on' + EventListener.type, EventListener.fn);
        } else {
            EventListener.el['on' + EventListener.type] = EventListener.fn;
            //alert(EventListener.el['on' + EventListener.type]);
        }
    }

    EventListener.prototype.Remove_EventListener = function(){
        if (typeof EventListener.el.removeEventListener === 'function') {
            EventListener.el.removeEventListener(EventListener.type, EventListener.fn, false);
        } else if (typeof EventListener.el.detachEvent === 'function') {
            EventListener.el.detachEvent('on' + EventListener.type, EventListener.fn);
        } else {
            //EventListener.el['on' + EventListener.type] = EventListener.fn;
        }
    }
}

/* Key Code Constructor */
function GetKeyCode(e){
    e = e || window.event;
    e.key = e.key || e.keyCode;
    return e.key;
}

/* Search Request Constructor */
function SearchCountry(word) {

    SearchCountry.LEFT = 37;
    SearchCountry.UP = 38;
    SearchCountry.RIGHT = 39;
    SearchCountry.DOWN = 40;
    SearchCountry.ENTER = 13;

    this.keyword = word;

    /* Get element INPUT for handling */
    SearchCountry.prototype.getElementInput = function(){
        var searchInputCollection = document.getElementsByName(this.keyword);       // Collection of objects INPUT
        var searchInputArray = Array.prototype.slice.call(searchInputCollection);   // Conversion to Array
        var searchInput = searchInputArray.shift();                                 // Extraction the first element of the array
        searchInput.id = this.keyword;
        var searchId = document.getElementById(this.keyword);
        return searchId;
    };

    /* Create Element to output the results */
    SearchCountry.prototype.creatElement = function(tagElement, idElement){
        this.tagElement = tagElement;
        this.idElement = idElement;
        var results = document.createElement(this.tagElement);
        results.id = 'search-result-'+this.idElement;
        results.className = 'select-result';
        results.multiple = 'multiple';

        searchParent = searchId.parentNode;
        searchParent.id = 'div-'+this.keyword; // add ID to parent element DOM
        searchParent.appendChild(results);     // open results list
        return results;
    };

    var searchId = this.getElementInput();                      // Element INPUT initialization
    var results = this.creatElement('select',this.keyword);     // Result Element initialization

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
                //var req = new XMLHTTP_Request(searchId.value);   // Constructor call XMLHTTPRequest
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
        if(XMLHTTP_Request.http.readyState == 4){
            if(XMLHTTP_Request.http.status == 200){
                var response = eval('('+XMLHTTP_Request.http.responseText+')');
                //var response = {"countries":[{"id":20,"iso2":"BY","iso3":"BLR","short_name":"Belarus","long_name":"Republic of Belarus"},{"id":21,"iso2":"BE","iso3":"BEL","short_name":"Belgium","long_name":"Kingdom of Belgium"},{"id":22,"iso2":"BZ","iso3":"BLZ","short_name":"Belize","long_name":"Belize"}]}
                var listHTML = '';
                for (var i=0; i<response.countries.length; i++){
                    listHTML += '<option value="'+response.countries[i].id+'">'+response.countries[i].short_name+'</option>';
                }
                results.innerHTML = listHTML;
                results.style.display = "block";
            }
            else {
                console.log("Unable to get data. XMLHTTP_Request.http.status:",XMLHTTP_Request.http.status);
            }
        }
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