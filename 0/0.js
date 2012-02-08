if (window.addEventListener) /* !IE */
    window.addEventListener("load", SearchCountry, true);
else
if (window.attachEvent) /* IE */
    window.attachEvent("onload", SearchCountry);
else
    window.onload = SearchCountry;

function SearchCountry() {
    //alert(document.searchForm.q.className);
    var keyword = document.getElementById('keyword');
    var results = document.getElementById('search-result');
    alert(keyword)
    /* Event listener */
    var eventListener = function (el, type, fn) {
        if (typeof el.addEventListener === 'function') {
            eventListener = function (el, type, fn) {
                el.addEventListener(type, fn, false);
            };
        } else if (typeof el.attachEvent === 'function') {
            eventListener = function (el, type, fn) {
                el.attachEvent('on' + type, fn);
            };
        } else {
            eventListener = function (el, type, fn) {
                el['on' + type] = fn;
            };
        }
        return eventListener(el, type, fn);
    };

    /* input handler */
	var inputHandler = function (e) {
        e = e || window.event;
        e.key = e.key || e.keyCode;

        results.selectedIndex = -1;

        if (keyword.value.length > 2 && e.key != 13) {

            if (e.key == 40) {
                results.focus();
                results.getElementsByTagName('option')[0].selected = 'selected';
                eventListener(results, 'keydown', listHandler);
                return;
            }

            if (e.key == 37 || e.key == 38 || e.key == 39) {

            } else {
                //alert(keyword.value.length);
                searchNameq();
            }
        }
    };


    /* list handler */
    function listHandler(e) {
        e = e || window.event;
        e.key = e.key || e.keyCode;

        this[this.selectedIndex].onclick = clickHandler;

        if(e.key) {
			// if "Enter" key
			if (e.key == 13){
				keyword.value = this[this.selectedIndex].text;
				this.selectedIndex = -1;
				this.style.display = 'none';
				keyword.focus();
				// prevent default action
				if(e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
				return;
			}
			// if "Up Arrow" key
			if (e.key == 38){
				if (this.selectedIndex == 0) {
					keyword.focus();
				}
			}
        }
    }

    /* Mouse click handler */
    function clickHandler(e){
        e = e || window.event;
        e.key = e.key || e.keyCode;
        keyword.value = this[this.selectedIndex].text;
        this.selectedIndex = -1;
        this.style.display = 'none';
        keyword.focus();
    }


    eventListener(keyword, 'keyup', inputHandler);
    eventListener(results, 'click', listHandler);
    eventListener(results, 'click', clickHandler);


	/*   XMLHTTPRequest    */
    function searchNameq() {
        //alert(this)
        http = new XMLHttpRequest();
        http.onreadystatechange =  function() {searchReply()};
        var keyword = document.getElementById('keyword');
        http.open('get', 'http://javascript-training.gametrailers.minsk.epam.com/jstraning/countries.php?q='+keyword.value, true);
        http.send(null);
    }


    //  Building a list
    function searchReply() {
            if(http.readyState == 4){
                if(http.status == 200){
                    var response = eval('('+http.responseText+')');
                    //var response = {"countries":[{"id":20,"iso2":"BY","iso3":"BLR","short_name":"Belarus","long_name":"Republic of Belarus"},{"id":21,"iso2":"BE","iso3":"BEL","short_name":"Belgium","long_name":"Kingdom of Belgium"},{"id":22,"iso2":"BZ","iso3":"BLZ","short_name":"Belize","long_name":"Belize"}]}
                    var listHTML = '';
                    //alert(response.countries.length);
                    for (var i=0; i<response.countries.length; i++){
                        listHTML += '<option value="'+response.countries[i].id+'">'+response.countries[i].short_name+'</option>';
                    }
                    document.getElementById('search-result').innerHTML = listHTML;
                    document.getElementById("search-result").style.display = "block";
                }
                else{
                    alert('Error: Status = '+http.status)
                }
            }
            else{
                //alert('Error:'+http.readyState);
            }
    }
}