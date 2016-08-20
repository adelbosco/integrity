var _visit = new function(){
  var today = new Date().getTime();
  var base = document.location.protocol + '//visitors.shopify.com/';
  var cookies = (document.cookie ? document.cookie : '').split(';');

  var uniqueId = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }).toUpperCase();
  };

  var readCookie = function(permanent, key) {
    for(var i=0;i<cookies.length;i++) {
      var c = cookies[i].trim();
      var start=c.indexOf(key+'=');
      if (start==0) {
        return unescape(c.substring(start+key.length+1,c.length));
      }
    }
    return null;
  }

  var storageAvailableTest = function (storageType) {
    try {
      window[storageType].setItem('test', 'test');
      window[storageType].removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  };

  var readStorage = function(permanent, key) {
    var storage = permanent ? 'localStorage' : 'sessionStorage';

    if (storageAvailableTest(storage)) {
      return window[storage].getItem(key);
    } else {
      return false;
    }
  }

  var setCookieWithExpiration = function(key, value, expire) {
    var match = document.location.hostname.match(/shopify\..*/)
    var domain
    if(match){
      domain = '.' + match[0]
    }
    else {
      domain = '.shopify.com'
    }
    document.cookie = key + "=" + escape(value) + ";path=/" +";expires=" + expire.toUTCString() + ';domain=' + domain;
  };

  var setCookie = function(permanent, key, value) {
    var increment = (permanent) ? 1000*60*60*24*360*20 : 1000*60*30;
    var expire = new Date(today + increment);
    setCookieWithExpiration(key, value, expire)
  }

  var setStorage = function(permanent, key, value) {
    var storage = permanent ? 'localStorage' : 'sessionStorage';

    if (storageAvailableTest(storage)) {
      return window[storage].setItem(key, value);
    } else {
      return false;
    }
  };

  var fetch = function(permanent, key, func) {
    var cookie = readCookie(permanent, key);
    var local  = readStorage(permanent, key);
    var value  = cookie || local || func.call();

    if (!cookie || !permanent) { setCookie(permanent, key, value); }
    if (!local)  { setStorage(permanent, key, value); }

    return value;
  };

  var referrer = document.referrer;
  var landing_page = window.location.toString();

  var shop_id = null;
  var uniq = "64e32322-c53c-4b6e-b3a0-49da16301b4e";
  var visit = fetch(false, '_s', function(){ return uniqueId(); });
  fetch(true, '_y', function(){ return uniq; });

  var generateURL = function(endpoint, parameters) {
    return base + endpoint + '?' + generateQueryString(parameters);
  }

  var generateQueryString = function (object) {
    var parameters = [];
    for (var key in object) {
      var value = object[key] !== '' ? object[key] : null;
      parameters.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
    return parameters.join("&");
  }

  setTimeout(function() {
    new Image().src = generateURL('record.gif', { y: uniq, s: visit, r: referrer, l: landing_page, shop: shop_id  }) + '&' + today;
  }, 1);

  this.multitrackToken = function() { return uniq; };
  this.sessionToken = function() { return visit; };
  this.tag = function(name) {
    new Image().src = generateURL('record-tag.gif', { y: uniq, s: visit, n: name, shop: shop_id });
  };
  this.keyValue = function(key, value) {
    new Image().src = generateURL('record-kv.gif', { y: uniq, s: visit, k: key, v: value, shop: shop_id  });
  };

  var getURLParameter = function(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
    }

  var brandedKeyword = function(ref) {
     var match1 = new RegExp("((google|yahoo|bing)(.*)&?q=([^&]*)shopify)", "gi").test(ref);
     return (match1);
  }
  var ref = getURLParameter('ref');
  var ssid = getURLParameter('ssid');
  if (ref && !brandedKeyword(document.referrer)) {
    var days = 30;
    var expire = new Date(today + days*1000*60*60*24);
    setCookieWithExpiration('source', ref.substring(0, 100), expire);
    if (ssid) {
      setCookieWithExpiration('ssid', ssid.substring(0, 100), expire);
    }
  }
};
