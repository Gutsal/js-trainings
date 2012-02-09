/*   XMLHTTPRequest Constructor    */
function SearchNameq (keyPhrase) {
    http = null;
    if (window.XMLHttpRequest) {
        try {
            http = new XMLHttpRequest();
        } catch (e){}
    } else if (window.ActiveXObject) {
        try {
            http = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e){
            try {
                http = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e){}
        }
    }
    if (http){
        searchUrl = 'http://javascript-training.gametrailers.minsk.epam.com/jstraning/countries.php?q='+keyPhrase;
        http.onreadystatechange =  function(){ SearchCountry.searchReply(); }
        http.open('get', searchUrl, true);
        http.send(null);
    }else{
        alert("Браузер не поддерживает AJAX");
    }
}

/* Event listener Constructor */
function EventListener (el, type, fn) {
    if (typeof el.addEventListener === 'function') {
        EventListener = function (el, type, fn) {
            //alert(el)
            el.addEventListener(type, fn, false);
        };
    } else if (typeof el.attachEvent === 'function') {
        EventListener = function (el, type, fn) {
            el.attachEvent('on' + type, fn);
        };
    } else {
        EventListener = function (el, type, fn) {
            el['on' + type] = fn;
        };
    }
    return EventListener(el, type, fn);
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
    this.getElementInput = function(){
        var searchInputCollection = document.getElementsByName(this.keyword);       // Collection of objects INPUT
        var searchInputArray = Array.prototype.slice.call(searchInputCollection);   // Conversion to Array
        var searchInput = searchInputArray.shift();                                 // Extraction the first element of the array
        searchInput.id = this.keyword;
        var searchId = document.getElementById(this.keyword);
        return searchId;
    };

    /* Create Element to output the results */
    this.creatElement = function(tagElement, idElement){
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
                EventListener(results, 'keydown', SearchCountry.listHandler);
                return;
            }
            if (keyCodeValue != SearchCountry.LEFT && keyCodeValue != SearchCountry.UP && keyCodeValue != SearchCountry.RIGHT) {
                SearchNameq(searchId.value);   // Constructor call XMLHTTPRequest
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
    SearchCountry.searchReply = function () {
        if(http.readyState == 4){
            if(http.status == 200){
                var response = eval('('+http.responseText+')');
                //var response = {"countries":[{"id":20,"iso2":"BY","iso3":"BLR","short_name":"Belarus","long_name":"Republic of Belarus"},{"id":21,"iso2":"BE","iso3":"BEL","short_name":"Belgium","long_name":"Kingdom of Belgium"},{"id":22,"iso2":"BZ","iso3":"BLZ","short_name":"Belize","long_name":"Belize"}]}
                var listHTML = '';
                for (var i=0; i<response.countries.length; i++){
                    listHTML += '<option value="'+response.countries[i].id+'">'+response.countries[i].short_name+'</option>';
                }
                results.innerHTML = listHTML;
                results.style.display = "block";
            }
            else {
                alert("Не удалось получить данные:\n" + http.statusText);
            }
        }
    };

    this.init = function(){
        EventListener(searchId, 'keyup', SearchCountry.inputHandler);    // INPUT handler call
        EventListener(results, 'click', SearchCountry.listHandler);      // Parsing of results list
        EventListener(results, 'click', SearchCountry.clickHandler);     // Mouse click event
    }

    this.init();
}