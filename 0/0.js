/*   XMLHTTPRequest Constructor    */
function XmlHttpRequest (KeyPhrase){
    XmlHttpRequest.prototype.options = {
        Phrase : KeyPhrase,
        Http : null,
        Ready : 4,
        Status : 200
    }
}

XmlHttpRequest.prototype.Create = function(){
    if (window.XMLHttpRequest){
        try {
            this.options.Http = new XMLHttpRequest();
        }
        catch (e){
            console.log("Name", e.name, "Message", e.message);
        }
    }
    else if (window.ActiveXObject){
        try {
            this.options.Http = new ActiveXObject('Msxml2.XMLHTTP');
        }
        catch (e){
            try {
                this.options.Http = new ActiveXObject('Microsoft.XMLHTTP');
            }
            catch (e){
                console.log("Name", e.name, "Message", e.message);
            }
        }
    }
    return this.options.Http;
}

XmlHttpRequest.prototype.Send = function(Results){
    if (this.options.Http){
        SearchUrl = Autocomplete.prototype.options.Url+this.options.Phrase;
        this.options.Http.onreadystatechange = function(){
            if (XmlHttpRequest.prototype.options.Http.readyState == XmlHttpRequest.prototype.options.Ready){
                if (XmlHttpRequest.prototype.options.Http.status == XmlHttpRequest.prototype.options.Status){
                    Autocomplete.SearchReply(Results);
                }
                else {
                    console.log("Unable to get data. XMLHTTP_Request.http.status:",XmlHttpRequest.prototype.options.Http.status);
                }
            }
        }
        this.options.Http.open('get', SearchUrl, true);
        this.options.Http.send(null);
    }
    else {
        console.log("Your browser does not support AJAX");
    }
}

/* Event listener Constructor */
function EventListener (El, Type, Fn){
    this.El = El;
    this.Type = Type;
    this.Fn = Fn;
}

/* ADD Event Method */
EventListener.prototype.Create = function(){
    if (typeof this.El.addEventListener === 'function'){
        this.El.addEventListener(this.Type, this.Fn, false);
    }
    else if (typeof this.El.attachEvent === 'function'){
        this.El.attachEvent('on' + this.Type, this.Fn);
    }
    else {
        this.El['on' + this.Type] = this.Fn;
    }
}

/* REMOVE Event Method */
EventListener.prototype.Remove = function(){
    if (typeof this.El.removeEventListener === 'function') {
        this.El.removeEventListener(this.Type, this.Fn, false);
    }
    else if (typeof this.El.detachEvent === 'function') {
        this.El.detachEvent('on' + this.Type, this.fn);
    }
}

/* Key Code Constructor */
function GetKeyCode(e){
    e = e || window.event;
    e.key = e.key || e.keyCode;
    return e.key;
}

/* Create Element to output the results */
Autocomplete.prototype.CreateElement = function(TagElement, IterationElement, SearchId){
    Results = document.createElement(TagElement);
    Results.className = 'select-result';
    Results.id = 'select-result-'+IterationElement;
    Results.multiple = 'multiple';
    SearchParent = SearchId.parentNode;
    SearchParent.appendChild(Results);     // open results list
    return Results;
};


/* Search Request Constructor */
function Autocomplete(data){

    Autocomplete.prototype.options = {
        SearchClassName : document.getElementsByClassName(data.ClassName),
        Category : data.Category,
        Url : data.Url,
        Tab : 9,
        Left : 37,
        Up : 38,
        Right : 39,
        Down : 40,
        Enter : 13
    }

    for (i = 0; i < this.options.SearchClassName.length; i++){
        var SearchId = this.options.SearchClassName[i];                         // Element INPUT initialization
        var Results = this.CreateElement('select',i,SearchId);      // Result Element initialization
    }

    /* input handler */
    Autocomplete.InputHandler = function (e){
        //alert(this);
        var KeyCodeValue = GetKeyCode(e);
            Results = this.nextElementSibling;
            Results.selectedIndex = -1;
            if (this.value.length > 2 && KeyCodeValue != Autocomplete.prototype.options.Enter){
                if (KeyCodeValue == Autocomplete.prototype.options.Down){
                    Results.focus();
                    Results.getElementsByTagName('option')[0].selected = 'selected';
                    var EventInput = new EventListener(Results, 'keydown', Autocomplete.ListHandler);
                    EventInput.Create();
                    var EventMouseClick = new EventListener(Results, 'click', Autocomplete.ClickHandler);  // Mouse click event
                    EventMouseClick.Create();
                    return;
                }
                if (KeyCodeValue != Autocomplete.prototype.options.Left && KeyCodeValue != Autocomplete.prototype.options.Up && KeyCodeValue != Autocomplete.prototype.options.Right && KeyCodeValue != Autocomplete.prototype.options.Tab){
                    var Req = new XmlHttpRequest(this.value);   // Constructor call XmlHttpRequest
                    Req.Create();
                    Req.Send(Results);
                }
            }
            else if (this.value.length < 3){ // if empty area - hide the result
                Results.style.display = 'none';
            }
    };

    /* list handler */
    Autocomplete.ListHandler = function(e){
        var KeyCodeValue = GetKeyCode(e);
        var Current = parseInt(this.id.replace(/select-result-/,''));
        for (i = 0; i < Autocomplete.prototype.options.SearchClassName.length; i++){
            if (Current == i){
                SearchId = Autocomplete.prototype.options.SearchClassName[i];
            }
        }
        if (KeyCodeValue){
            // if "Enter" key
            if (KeyCodeValue == Autocomplete.prototype.options.Enter){
                SearchId.value = this[this.selectedIndex].text;
                this.selectedIndex = -1;
                this.style.display = 'none';
                SearchId.focus();
                // prevent default action
                if (e.preventDefault){
                    e.preventDefault();
                }
                else {
                    e.returnValue = false;
                }
                return;
            }
            // if "Up Arrow" key
            if (KeyCodeValue == Autocomplete.prototype.options.Up){
                if (this.selectedIndex == 0){
                    SearchId.focus();
                }
            }
            // if choose the last
            if (KeyCodeValue == Autocomplete.prototype.options.Down){
                if (this.selectedIndex == this.length-1) {
                    this.selectedIndex = -1;
                }
            }
        }
    };

    /* Mouse click handler */
    Autocomplete.ClickHandler = function(e){
        var Current = parseInt(this.id.replace(/select-result-/,''));
        for (i = 0; i < Autocomplete.prototype.options.SearchClassName.length; i++){
            if (Current == i){
                SearchId = Autocomplete.prototype.options.SearchClassName[i];
            }
        }
        SearchId.value = this[this.selectedIndex].text;
        this.selectedIndex = -1;
        this.style.display = 'none';
        SearchId.focus();
    };

    //  Building a list Method
    Autocomplete.SearchReply = function(Results) {
        var Response = JSON.parse(XmlHttpRequest.prototype.options.Http.responseText);
        Response = Response[Autocomplete.prototype.options.Category];
        //var response = {"countries":[{"id":20,"iso2":"BY","iso3":"BLR","short_name":"Belarus","long_name":"Republic of Belarus"},{"id":21,"iso2":"BE","iso3":"BEL","short_name":"Belgium","long_name":"Kingdom of Belgium"},{"id":22,"iso2":"BZ","iso3":"BLZ","short_name":"Belize","long_name":"Belize"}]}
        Results.innerHTML = '';
        for (var i=0; i<Response.length; i++){
            ResultList = document.createElement('option');
            ResultList.id = Response[i].id;
            ResultList.text = Response[i].short_name;
            Results.appendChild(ResultList);
        }
        if (Response.length != 0){
            Results.style.display = "block";
        }
        else {
            console.log("Result is empty. "+Autocomplete.prototype.options.Category+': '+Response.length);
        }

    };

    this.Init = function(){
        var EventInput = new EventListener(this.options.SearchClassName[i], 'keyup', Autocomplete.InputHandler);      // INPUT handler call
        EventInput.Create();
    }

    for (i = 0; i < this.options.SearchClassName.length; i++){
        this.Init(i);
    }
}

var search = new Autocomplete({
    ClassName : 'keyword',
    Category : 'countries',
    Url : 'http://javascript-training.gametrailers.minsk.epam.com/jstraning/countries.php?q='
});
