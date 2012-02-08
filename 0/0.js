
function SearchCountry(keyword) {
    //alert(document.searchForm.q.className);
    LEFT = 37;
    UP = 38;
    RIGHT = 39;
    DOWN = 40;
    ENTER = 13;

    var searchInput = document.getElementsByName(keyword);
    for (i=0;i<searchInput.length;i++){ // Добавление ID всем найденому по имени полю
        searchInput[i].id = keyword;
    }
    var searchId = document.getElementById(keyword);
    searchParent = searchId.parentNode;
    searchParent.id = 'div-'+keyword; // Добавление ID родительскому элементу DOM

    /*   XMLHTTPRequest Method    */
    SearchCountry.searchNameq = function (keyPhrase) {
        //alert(keyPhrase)
        searchUrl = 'http://javascript-training.gametrailers.minsk.epam.com/jstraning/countries.php?q='+keyPhrase;
        http = new XMLHttpRequest();
        http.onreadystatechange =  function(){ SearchCountry.searchReply(); }
        http.open('get', searchUrl, true);
        http.send(null);
        //alert(searchUrl);
    }

    /*   Конструктор создания элемента вывода результатов    */
    function CreatElement(tagElement, idElement){
        this.tagElement = tagElement;
        this.idElement = idElement;
        this.elementCreat = function(){
            var newElement = document.createElement(this.tagElement);
            newElement.id = 'search-result-'+this.idElement;
            newElement.className = 'select-result';
            newElement.multiple = 'multiple';
            return newElement;
        }
    }

    var newSelectElement = new CreatElement('select',keyword);  // создание экземпляра класса
    var results = newSelectElement.elementCreat();              // вызов метода экземпляра для создания элемента вывода
    searchParent.appendChild(results);                          // открытие в DOM

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
            else{
                alert('Error: Status = '+http.status)
            }
        }
        else{
            //alert('Error:'+http.readyState);
        }
    }


    /* Event listener Method */
    SearchCountry.eventListener = function (el, type, fn) {
        if (typeof el.addEventListener === 'function') {
            eventListener = function (el, type, fn) {
                //alert(el)
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

    SearchCountry.getKeyCode = function(e){
        e = e || window.event;
        e.key = e.key || e.keyCode;
        return e.key;
    }

    /* input handler */
	var inputHandler = function (e) {

        var keyCodeValue = SearchCountry.getKeyCode(e);
        results.selectedIndex = -1;

        if (searchId.value.length > 2 && e.key != ENTER) {
            if (keyCodeValue == DOWN) {
                results.focus();
                results.getElementsByTagName('option')[0].selected = 'selected';
                eventListener(results, 'keydown', listHandler);
                return;
            }
            if (keyCodeValue != LEFT && keyCodeValue != UP && keyCodeValue != RIGHT) {
                SearchCountry.searchNameq(searchId.value);   // вызов метода запроса
            }
        }else if (searchId.value.length < 3){ // если пустое или короткое поле - скрыть результат
            results.style.display = 'none';
        }
    };


    /* list handler */
    function listHandler(e) {
        var keyCodeValue = SearchCountry.getKeyCode(e);

        if(keyCodeValue) {
			// if "Enter" key
			if (keyCodeValue == ENTER){
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
            if (keyCodeValue == UP){
                if (this.selectedIndex == 0) {
                    searchId.focus();
                }
            }
            if (keyCodeValue == DOWN){ // перебор, если конец списка
                if (this.selectedIndex == this.length-1) {
                    this.selectedIndex = -1;
                }
            }
        }
    }

    /* Mouse click handler */
    SearchCountry.clickHandler = function(){
        searchId.value = this[this.selectedIndex].text;
        this.selectedIndex = -1;
        this.style.display = 'none';
        searchId.focus();
    }

    SearchCountry.eventListener(searchId, 'keyup', inputHandler);    // обработчик для поля ввода
    SearchCountry.eventListener(results, 'click', listHandler);         // перебор списка результатов
    SearchCountry.eventListener(results, 'click', SearchCountry.clickHandler);        // Клик мышью

}