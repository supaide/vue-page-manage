/*!
 * vue-page-manage v1.0.11 (https://github.com/supaide/vue-page-manage/README.md)
 * Copyright 2018, cyij2006@gmail.com
 * MIT license
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["spd-page-manage"] = factory();
	else
		root["spd-page-manage"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router_view__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_h5_webutil__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_h5_webutil___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_h5_webutil__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fast_deep_equal__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fast_deep_equal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_fast_deep_equal__);
//
//
//
//
//
//
//
//
//
//
//

 



let checkSSR = function () {
  if (typeof window === 'undefined') {
    return false
  }
  let query = __WEBPACK_IMPORTED_MODULE_1_h5_webutil__["url"].decodeQuery(window.location.href)
  return query[1] && typeof query[1].__SSR !== 'undefined'
}

let excludeCloneKeys = [
  '__ob__',
  '__historyId',
  '__pageStatus',
  '__validators',
  '__error',
  '__validateKey'
]

/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    RouterView: __WEBPACK_IMPORTED_MODULE_0__router_view__["a" /* default */]
  },
  props: {
    className: {
      type: String,
      default: 'page-wrap'
    }
  },
  data () {
    return {
      change: 0,
      transitionName: null,
      transitionMode: null,
    }
  },
  created () {
    this.transitionName = this.$router.transitionName
    this.transitionMode = this.$router.transitionMode
    this.prePages = []
    this.currentPages = []
    this.$router.__pageViews.push(this)
    let currentHistoryId = -1
    if (this.$router.history.length > 0) {
      currentHistoryId = this.$router.history.slice(-1)[0][0]
    }
    this.historyId = currentHistoryId
  },
  destroyed () {
    let pageViews = []
    for (let i=0; i<this.$router.__pageViews.length; i++) {
      if (this.$router.__pageViews[i]._uid != this._uid) {
        pageViews.push(this.$router.__pageViews[i])
      }
    }
    this.$router.__pageViews = pageViews
  },
  methods: {
    beforeEnter () {
      if (checkSSR()) {
        return
      }
      this.currentPages = []
      this.prePages = []
      let thisPageViewExist = false
      for (let i=0; i<this.$router.__pageViews.length; i++) {
        if (this.$router.__pageViews[i]._uid == this._uid) {
          thisPageViewExist = true
        }
        if (thisPageViewExist) {
          let pageView = this.$router.__pageViews[i]
          for (let j=0; j<pageView.$children.length; j++) {
            if (pageView.$children[j].$data.__pageStatus) {
              this.prePages.push([pageView.$children[j], pageView])
            } else {
              this.currentPages.push([pageView.$children[j], pageView])
            }
          }
        }
      }
      let lifecycle = 'onCreate'
      for (let i=0; i<this.currentPages.length; i++) {
        let node = this.currentPages[i]
        let pageView = node[1]
        node = node[0]
        if (node.$data.__pageStatus === lifecycle) {
          continue
        }
        let originData = __WEBPACK_IMPORTED_MODULE_1_h5_webutil__["util"].clone(node.$data, excludeCloneKeys)
        node.$set(node.$data, '__pageStatus', lifecycle)

        if (this.historyId) {
          let bundleId = this.historyId + '_' + node.__path
          let currentEndRoute = this.$router.currentRoute.slice(-1)[0]
          if (currentEndRoute && currentEndRoute[1].meta && currentEndRoute[1].meta.reuse) {
            let currentData = this.$router.bundle(bundleId)
            if (currentData) {
              Object.keys(currentData).forEach((key) => {
                node.$set(node.$data, key, currentData[key])
              })
            }
          }
          this.$router.bundle(bundleId, originData)
          node.$set(node.$data, '__historyId', this.historyId)
        }

        if (node.$options[lifecycle]) {
          try {
            node.$options[lifecycle].call(node, this.$router.params || {})
          } catch (e) {
            console.log(e)
          }
        }
      }
    },
    afterEnter () {
      if (checkSSR()) {
        return
      }
      let lifecycle = 'onResume'
      for (let i=0; i<this.currentPages.length; i++) {
        let node = this.currentPages[i]
        let pageView = node[1]
        node = node[0]
        if (node.$data.__pageStatus === lifecycle) {
          continue
        }
        if (node.$options.title && typeof document !== 'undefined') {
          document.title = node.$options.title
        }
        node.$set(node.$data, '__pageStatus', lifecycle)
        if (node.$options[lifecycle]) {
          try {
            node.$options[lifecycle].call(node, this.$router.params || {})
          } catch (e) {
            console.log(e)
          }
        }
      }
      lifecycle = 'onStop'
      for (let i=0; i<this.prePages.length; i++) {
        let node = this.prePages[i]
        let pageView = node[1]
        node = node[0]
        if (node.$data.__pageStatus === lifecycle) {
          continue
        }

        if (this.historyId) {
          let bundleId = node.$data.__historyId + '_' + node.__path
          let originData = this.$router.bundle(bundleId)
          if (typeof originData !== "undefined") {
            let currentData = __WEBPACK_IMPORTED_MODULE_1_h5_webutil__["util"].clone(node.$data, excludeCloneKeys)
            let data = {}
            if (currentData) {
              Object.keys(originData).forEach(function (key) {
                if (!__WEBPACK_IMPORTED_MODULE_2_fast_deep_equal___default()(originData[key], currentData[key])) {
                  data[key] = currentData[key]
                }
              })
            }
            this.$router.bundle(bundleId, data)
          }
        } 

        if (node.$options[lifecycle]) {
          try {
            node.$options[lifecycle].call(node, this.$router.params || {})
          } catch (e) {
            console.log(e)
          }
        }
        node.$set(node.$data, '__pageStatus', lifecycle)
      }
      this.$router._pageViewLoadFinished()
    },
    doPageChange (historyId, direction) {
      this.historyId = historyId
      if (!this.$router.__started_pageview) {
        this.$router.__started_pageview = true
        this.transitionName = null
      } else {
        if (direction) {
          this.transitionName = this.$router.transitionName + '-' + direction
        } else {
          this.transitionName = this.$router.transitionName
        }
      }
      this.change = +new Date
    }
  },
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * h5-webutil v1.0.5 (https://github.com/supaide/h5-webutil/README.md)
 * Copyright 2018, cyij
 * MIT license
 */
!function(t,n){ true?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports["h5-webutil"]=n():t["h5-webutil"]=n()}("undefined"!=typeof self?self:this,function(){return function(t){function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var e={};return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=1)}([function(t,n,e){"use strict";var r=function(t){if(!t)return"";var n=[];for(var e in t)n.push(e+"="+encodeURIComponent(t[e]));return n.join("&")},o=function(t){var n={},e=[];if(!t)return[e,n];var r=t.indexOf("#");r>-1&&(t=t.substr(0,r));var o=t.indexOf("?");e=t,o>-1?(e=t.substr(0,o),t=t.substr(o+1)):t="",e=e.split("/").filter(function(t){return t.length>0});for(var i=t.split("&"),u=0;u<i.length;u++){var f=i[u].split("=");2==f.length&&(n[f[0]]=decodeURIComponent(f[1]))}return[e,n]};n.a={encodeQuery:r,decodeQuery:o}},function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=(e(2),e(3)),o=e(4),i=e(0),u=e(5),f=e(6);e.d(n,"event",function(){return r.a}),e.d(n,"http",function(){return o.a}),e.d(n,"url",function(){return i.a}),e.d(n,"util",function(){return u.a}),e.d(n,"Validate",function(){return f.a})},function(t,n,e){"use strict";String.prototype.truncate=function(t,n){var e=this;if(n||(n="..."),t<n.length)return"";t-=n.length;for(var r=void 0,o=1,i=0,u=-1,f=0,c=0;c<e.length;c++)r=e[c].charCodeAt(),o=r<=127?1:2,i+=o,i>t?f+=o:u=c;return u<0?"":f<=n.length?e:e.substr(0,u+1)+n};String},function(t,n,e){"use strict";var r={},o=function(t,n){if(r[t])for(var e=0;e<r[t].length;e++)r[t][e].apply({},n)};n.a={on:function(t,n,e){r[t]||(r[t]=[]),e?r[t].push(function(){for(var t=arguments.length,r=Array(t),o=0;o<t;o++)r[o]=arguments[o];n.apply(e,r)}):r[t].push(n)},off:function(t,n){if(r[t])if(n){for(var e=0;e<r[t].length;e++)if(r[t][e]===n)return void r[t].splice(e,1)}else delete r[t]},emit:function(t){for(var n=arguments.length,e=Array(n>1?n-1:0),r=1;r<n;r++)e[r-1]=arguments[r];o(t,e)},asyncEmit:function(t){for(var n=arguments.length,e=Array(n>1?n-1:0),r=1;r<n;r++)e[r-1]=arguments[r];setTimeout(function(){o(t,e)},0)}}},function(t,n,e){"use strict";var r=(e(0),"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t}),o={},i={},u=function(t){if(t.status>=200&&t.status<300)return t;var n=new Error(t.statusText);throw n.response=t,n},f=function(t,n,e,r,o){e.blob().then(function(o){var i=window.URL.createObjectURL(o);if("download"===t){var u=document.createElement("a");n=n||e.headers.get("Content-Disposition"),u.href=i,u.download=n,u.click()}r&&r(i),window.URL.revokeObjectURL(i)}).catch(function(t){o&&o(-1,t)})},c=function(t,n,e,c,a){"function"==typeof n&&(a=c,c=e,e=n,n=null),"object"===(void 0===e?"undefined":r(e))&&(a=e,e=null,c=null),"object"===(void 0===c?"undefined":r(c))&&(a=c,c=null),a=a||{},o.urlPrefix&&0!==t.indexOf("http")&&(t=o.urlPrefix+t);var l=t;if(!a.ignoreBlock){if(i[l])return;i[l]=1}var s=a.method?a.method.toUpperCase():"POST",d=a.credentials?a.credentials:"include",p=a.dataType?a.dataType:"json",y=void 0!==a.preProcess?a.preProcess:o.preProcess,h=!!a.blob&&a.blob,v=a.filename?a.filename:null,b=a.jsonParam?a.jsonParam:"POST"!=s,m="POST"==s||"PUT"==s||"PATCH"==s;if(n=n||{},!a.ignoreDefaultParams&&o.defaultParams){var g=o.defaultParams()||{};for(var j in g)n[j]=g[j]}var P=null,x=[];m&&(P=new FormData);for(var S in n)if(Array.isArray(n[S]))for(var A=n[S],O=0;O<A.length;O++)P&&P.append(S,A[O]),x.push(S+"[]="+encodeURIComponent(A[O]));else P&&P.append(S,n[S]),x.push(S+"="+encodeURIComponent(n[S]));var w={method:s};m?(b?(w.body=JSON.stringify(n),w.headers={"Content-Type":"application/json"}):w.body=P,w.credentials=d):t.indexOf("?")>-1?t+="&"+x.join("&"):t+="?"+x.join("&");var C=fetch(t,w).then(u);h?C=C.then(function(t){delete i[l],f(h,v,t,e,c)}):("text"===p?C=C.then(function(t){return t.text()}):"json"===p&&(C=C.then(function(t){return t.json()})),C=C.then(function(t){if(delete i[l],"function"==typeof y){var n=y(t,p,e,c);if(null===n)return;t=n}e&&e.apply({},[].concat(t))})),C.catch(function(t){delete i[l],c&&c(-1,t)})};c.config=function(t){o.preProcess=t.preProcess?t.preProcess:null,o.defaultParams=t.defaultParams?t.defaultParams:null,o.urlPrefix=t.urlPrefix?t.urlPrefix:null};var a=function(t,n){var e=[];if(t.length>0)for(var o=0;o<t.length;o++)e.push(t[o]);var i=e.slice(-1)[0];return"object"===(void 0===i?"undefined":r(i))?i.method=n:e.push({method:n}),e};c.get=function(){c.apply(this,a(arguments,"get"))},c.post=function(){c.apply(this,a(arguments,"post"))},c.put=function(){c.apply(this,a(arguments,"put"))},c.patch=function(){c.apply(this,a(arguments,"patch"))},c.delete=function(){c.apply(this,a(arguments,"delete"))},c.head=function(){c.apply(this,a(arguments,"head"))},c.options=function(){c.apply(this,a(arguments,"options"))},n.a=c},function(t,n,e){"use strict";var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o=function t(n,e,o){var i=!1;Array.isArray(n)&&(i=!0);for(var u in e)if(e.hasOwnProperty(u)){if(Array.isArray(o)&&o.indexOf(u)>=0||"string"==typeof o&&0===u.indexOf(o))continue;"object"!==r(e[u])||null===e[u]||void 0===e[u]?i?n.push(e[u]):n[u]=e[u]:(Array.isArray(e[u])?i?n.push([]):n[u]=[]:i?n.push({}):n[u]={},i?t(n[n.length-1],e[u]):t(n[u],e[u]))}},i=function(t,n){if("object"!==(void 0===t?"undefined":r(t))||null===t||void 0===t)return t;var e=void 0;return e=Array.isArray(t)?[]:{},o(e,t,n),e},u=function(t,n){var e={};return Object.keys(t).forEach(function(r){var o=t[r];null!==o&&void 0!==o&&(n||String(o).length>0)&&(e[r]=o)}),e};n.a={filterEmpty:u,clone:i}},function(t,n,e){"use strict";var r=e(7),o={email:r.b,mobile:r.h,idCard:r.d,length:r.e,equal:r.c,min:r.g,max:r.f,between:r.a,required:r.j,passwd:r.i},i=function(t,n,e,r){return"function"==typeof o[t]&&(r?null===n||void 0===n||("string"==typeof n&&n.length<1||Object.keys(n).length>0):o[t].apply({},[n,e]))};i.register=function(t,n){o[t]=n},n.a=i},function(t,n,e){"use strict";e.d(n,"b",function(){return i}),e.d(n,"h",function(){return u}),e.d(n,"d",function(){return f}),e.d(n,"e",function(){return c}),e.d(n,"c",function(){return a}),e.d(n,"g",function(){return l}),e.d(n,"f",function(){return s}),e.d(n,"a",function(){return d}),e.d(n,"j",function(){return p}),e.d(n,"i",function(){return y});var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o=function(t,n,e){return null!==t&&void 0!==t&&(void 0===n&&(n=0),void 0===e?t>=n:t>=n&&t<=e)},i=function(t,n){return!!t&&/^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/.test(t)},u=function(t,n){return!!t&&/^1[3|4|5|7|8][0-9]\d{8}$/.test(t)},f=function(t,n){return!!t&&/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(t)},c=function(t,n){var e=void 0,r=void 0;return n&&n.length>0&&(e=n[0]),n&&n.length>1&&(r=n[1]),o(t,e,r)},a=function(t,n){return!(!n||n.length<1)&&o(t,n[0],n[0])},l=function(t,n){return!(!n||n.length<1)&&o(t,n[0])},s=function(t,n){return!(!n||n.length<1)&&o(t,void 0,n[0])},d=function(t,n){return!(!n||2!=n.length)&&o(t,n[0],n[1])},p=function(t,n){return null!==t&&void 0!==t&&("object"!==(void 0===t?"undefined":r(t))?o((""+t).length,1):Object.keys(t).length>0)},y=function(t,n){t=(t+"").trim();var e=8,r=20;n&&(n.length>0&&(e=n[0]-0),n.length>1&&(r=n[1]-0)),e<1&&(e=1);var o=t.length;return!(o<e||o>r)&&(t.toLowerCase()!=t&&!!t.match(/\d/))}}])});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;

module.exports = function equal(a, b) {
  if (a === b) return true;

  var arrA = isArray(a)
    , arrB = isArray(b)
    , i
    , length
    , key;

  if (arrA && arrB) {
    length = a.length;
    if (length != b.length) return false;
    for (i = 0; i < length; i++)
      if (!equal(a[i], b[i])) return false;
    return true;
  }

  if (arrA != arrB) return false;

  var dateA = a instanceof Date
    , dateB = b instanceof Date;
  if (dateA != dateB) return false;
  if (dateA && dateB) return a.getTime() == b.getTime();

  var regexpA = a instanceof RegExp
    , regexpB = b instanceof RegExp;
  if (regexpA != regexpB) return false;
  if (regexpA && regexpB) return a.toString() == b.toString();

  if (a instanceof Object && b instanceof Object) {
    var keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length)
      return false;

    for (i = 0; i < length; i++)
      if (!hasProp.call(b, keys[i])) return false;

    for (i = 0; i < length; i++) {
      key = keys[i];
      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  return false;
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__install__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_h5_webutil__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_h5_webutil___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_h5_webutil__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fast_deep_equal__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fast_deep_equal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_fast_deep_equal__);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };





var DEFAULT_OPTIONS = {
  transition: true,
  transitionName: 'page-view',
  transitionMode: null,
  paramsInjector: null,
  beforeEach: null,
  beforeEnter: null,
  exitHandler: null,
  errorHandler: null,
  maxHistorySize: 100,
  launcherMode: 'singleTop',
  compareParam: true,
  singleIndex: true,
  routeMode: 'html5' };

var VueRoute = function VueRoute(routers, options) {
  this.routers = routers || [];
  this.setOptions(DEFAULT_OPTIONS);
  this.setOptions(options);
  this.pathToRouterIndex = {};
  this.rid = 0;
  this.startUrl = null;
  initWithLocalStorage.call(this, true);
};

VueRoute.prototype.setOptions = function (options) {
  if (!options) return;
  for (var k in options) {
    if (DEFAULT_OPTIONS[k] !== undefined) {
      this[k] = options[k];
    }
  }
};

var initWithLocalStorage = function initWithLocalStorage(reset) {
  if (reset) {
    this.history = [];
    this.bundles = {};
    this.finishedHistoryIds = [];
    this.onPageChange = false;
    this.__pageViews = [];
    this.__browserHistoryLen = 0;
    this.__finished = false;
    this.__started = false;
    this.preRoute = null;
    this.currentRoute = null;
  }
  if (typeof localStorage === 'undefined') {
    return;
  }
  try {
    var h_t = localStorage.getItem('_h_t');
    var ts = +new Date();
    if (!reset && h_t && ts - h_t < 5000) {
      var h_h = localStorage.getItem('_h_h');
      var h_b = localStorage.getItem('_h_b');
      var h_f = localStorage.getItem('_h_f');
      if (h_h) {
        this.history = JSON.parse(h_h);
      }
      if (h_b) {
        this.bundles = JSON.parse(h_b);
      }
      if (h_f) {
        this.finishedHistoryIds = JSON.parse(h_f);
      }
    }
  } catch (e) {
    console.log(e);
  }
  localStorage.removeItem('_h_t');
  localStorage.removeItem('_h_h');
  localStorage.removeItem('_h_b');
  localStorage.removeItem('_h_f');
};

VueRoute.prototype.restart = function (startUrl) {
  initWithLocalStorage.call(this, true);
  this.setStartUrl(startUrl);
};

VueRoute.prototype.init = function (app) {
  var _this = this;

  if (this.app) {
    return;
  }

  initWithLocalStorage.call(this);

  this.app = app;
  var that = this;
  var path = null;
  var params = null;
  if (this.history.length > 0) {
    this.startUrl = this.history[this.history.length - 1][1];
    params = this.history[this.history.length - 1][2];
    path = this.startUrl;
    this.rid = this.history[this.history.length - 1][0].split('_')[0] - 0;
  }

  this.__browserHistoryLen = window.history.length;
  window.addEventListener("popstate", function (e) {
    var currentBrowserHistoryLen = window.history.length;
    if (!that.__finished && currentBrowserHistoryLen - that.__browserHistoryLen < 3) {
      console.log('push state ' + that.__finished);
      window.history.pushState({ _t: +new Date() }, '');
    }
    __WEBPACK_IMPORTED_MODULE_1_h5_webutil__["event"].emit('navbarback_sys');
  });
  window.history.pushState({ _t: +new Date() }, '');
  if (!this.startUrl) {
    if (this.routeMode == 'html5') {
      this.startUrl = window.location.pathname + window.location.search;
    } else {
      this.startUrl = window.location.hash.slice(1);
      if (!this.startUrl) {
        this.startUrl = '/';
      }
    }
  }
  var queryInfo = __WEBPACK_IMPORTED_MODULE_1_h5_webutil__["url"].decodeQuery(this.startUrl);
  path = queryInfo[0].join('/');
  params = queryInfo[1];
  window.onunload = window.onbeforeunload = function () {
    backupHistory.call(_this);
  };
  var onBack = function onBack(type) {
    that.finish(type);
  };
  __WEBPACK_IMPORTED_MODULE_1_h5_webutil__["event"].on('navbarback_sys', function () {
    onBack(1);
  });
  __WEBPACK_IMPORTED_MODULE_1_h5_webutil__["event"].on('navbarback', function () {
    onBack(2);
  });

  if (this.startUrl) {
    this.goto(path || '/', params);
  }
};

var backupHistory = function backupHistory() {
  if (this.history.length < 1) {
    return;
  }
  var ts = +new Date();
  localStorage.setItem('_h_t', ts);
  localStorage.setItem('_h_b', JSON.stringify(this.bundles));
  localStorage.setItem('_h_h', JSON.stringify(this.history));
  localStorage.setItem('_h_f', JSON.stringify(this.finishedHistoryIds));
};

VueRoute.prototype.bundle = function (id, data) {
  if (data === undefined) {
    return this.bundles[id];
  } else {
    if (data && Object.keys(data).length > 0) {
      this.bundles[id] = data;
    } else {
      delete this.bundles[id];
    }
  }
};

VueRoute.prototype.match = function (location) {
  var queryInfo = __WEBPACK_IMPORTED_MODULE_1_h5_webutil__["url"].decodeQuery(location);
  var path = queryInfo[0].join('/');
  var matched = getMatchedRouters.call(this, path, true);
  if (matched) {
    return { matched: matched, fullPath: location };
  } else {
    return { matched: [] };
  }
};

VueRoute.prototype.replace = function (location) {
  var queryInfo = __WEBPACK_IMPORTED_MODULE_1_h5_webutil__["url"].decodeQuery(location);

  this.goto(queryInfo[0].join('/'), queryInfo[1]);
};

VueRoute.prototype.push = function (location) {
  var queryInfo = __WEBPACK_IMPORTED_MODULE_1_h5_webutil__["url"].decodeQuery(location);
  this.goto(queryInfo[0].join('/'), queryInfo[1]);
};

VueRoute.prototype.goto = function (path, params, backward) {
  var _this2 = this;

  this.__finished = false;
  if (this.onPageChange || this.routers.length < 1) {
    return;
  }
  path = path || '/';
  if (!backward && this.history.length > 0 && this.__started) {
    var lastHistory = this.history[this.history.length - 1];
    if (path == lastHistory[1] && (!params && !lastHistory[2] || __WEBPACK_IMPORTED_MODULE_2_fast_deep_equal___default()(params, lastHistory[2]))) {
      processFinishedHistory.call(this);
      return;
    }
  }
  this.onPageChange = true;
  var matched = getMatchedRouters.call(this, path, true);
  if (!matched || matched.length < 1) {
    this.onPageChange = false;
    if (this.history.length < 1) {
      this.goto(this.routers[0].path);
      return;
    }
    if (this.errorHandler) {
      this.errorHandler(404, { path: path });
    }
    processFinishedHistory.call(this);
    return;
  }
  if (this.beforeEach) {
    this.beforeEach(matched, this.currentRoute, routeChangeAt(matched, this.currentRoute), !backward, function (status, p) {
      var type = typeof status === 'undefined' ? 'undefined' : _typeof(status);
      if (type === 'undefined' || type === 'boolean' && status) {
        beforeEachCallback.call(_this2, path, params, matched, !backward, _this2.__started);
        _this2.__started = true;
      } else {
        _this2.onPageChange = false;
        if (type === 'string') {
          _this2.goto(status, p);
          return;
        } else if (type !== 'boolean' && _this2.errorHandler) {
          _this2.errorHandler(status, p);
        }
        processFinishedHistory.call(_this2);
      }
    });
  } else {
    beforeEachCallback.call(this, path, params, matched, !backward, this.__started);
    this.__started = true;
  }
};

var processFinishedHistory = function processFinishedHistory() {
  if (this.finishedHistoryIds.length < 1) {
    return;
  }
  var lastHistory = this.history.slice(-1)[0];
  var newHistory = [];
  var newBundles = {};
  for (var i = 0; i < this.history.length; i++) {
    var remove = false;
    for (var j = 0; j < this.finishedHistoryIds.length; j++) {
      var path = '/' + this.history[i][1] + '/';
      if (this.history[i][0] == this.finishedHistoryIds[j] || path.indexOf('/' + this.finishedHistoryIds[j] + '/') >= 0) {
        remove = true;
        break;
      }
    }
    if (!remove) {
      newHistory.push(this.history[i]);
      var bundleId = this.history[i][0] + '_' + this.history[i][1];
      if (typeof this.bundles[bundleId] !== 'undefined') {
        newBundles[bundleId] = this.bundles[bundleId];
      }
    }
  }

  this.history = newHistory;
  this.bundles = newBundles;
  this.finishedHistoryIds = [];
  if (newHistory.length > 0) {
    var newLastHistory = newHistory.slice(-1)[0];
    if (lastHistory[0] != newLastHistory[0]) {
      this.goto(newLastHistory[1], newLastHistory[2], true);
    }
  }
};

var getMatchedRouters = function getMatchedRouters(path, withRouter) {
  var path0 = path,
      path1 = null;
  var matchedIndexs = [];
  if (this.pathToRouterIndex[path] !== undefined) {
    matchedIndexs = this.pathToRouterIndex[path];
  } else {
    var routers = this.routers;
    while (true) {
      var matchedIndex = -1;
      for (var i = 0; i < routers.length; i++) {
        var _path = path + '/';
        if (0 !== _path.indexOf(routers[i].path + '/') || routers[i].path + '/' != _path && routers[i].redirect) {
          continue;
        }
        matchedIndex = i;
        if (routers[i].redirect && !path1) {
          path = routers[i].redirect;
          path1 = routers[i].redirect;
          matchedIndexs = [];
        } else {
          path = path.substr(routers[i].path.length + 1);
        }
        break;
      }
      if (matchedIndex < 0) {
        break;
      }
      if (path == path1) {
        continue;
      }
      matchedIndexs.push(matchedIndex);
      routers = routers[matchedIndex].children;
      if (!routers) {
        break;
      } else {
        if (path.length < 1) {
          var defaultPathIndex = 0;
          for (var _i = 0; _i < routers.length; _i++) {
            if (routers[_i].default) {
              defaultPathIndex = _i;
              break;
            }
          }
          path = routers[defaultPathIndex].path;
          path1 = path1 ? path1 + path : path0 + path;
        }
      }
    }
    if (path0) {
      this.pathToRouterIndex[path0] = matchedIndexs;
    }
    if (path1) {
      this.pathToRouterIndex[path1] = matchedIndexs;
    }
  }
  if (withRouter) {
    var matchedRouters = [];
    var _routers = this.routers;
    for (var _i2 = 0; _i2 < matchedIndexs.length; _i2++) {
      matchedRouters.push([matchedIndexs[_i2], _routers[matchedIndexs[_i2]]]);
      _routers = _routers[matchedIndexs[_i2]].children;
    }
    return matchedRouters;
  } else {
    return matchedIndexs;
  }
};

var confirmToExist = function confirmToExist() {
  if (this.history.length > 1 || this.onPageChange) {
    return false;
  }
  var currentPath = this.history.slice(-1)[0][1];
  var matchedRouters = getMatchedRouters.call(this, currentPath, true);
  if (matchedRouters.length < 1) {
    return false;
  }
  if (currentPath != this.routers[0].path && currentPath != this.routers[0].alias) {
    this.finishedHistoryIds.push('_');
    this.history = [];
    this.goto(this.routers[0].path);
  } else {
    this.__finished = true;
    if (this.exitHandler) {
      this.exitHandler.call(this);
    } else {
      defaultExit.call(this);
    }
  }
  return true;
};

VueRoute.prototype.onReady = function (cb) {
  if (this.isReady) {
    cb();
  }
  this.readyCbs = cb;
};

VueRoute.prototype.finish = function (type, historyId) {
  if (this.__finished) {
    return;
  }
  if (!this.onPageChange && confirmToExist.call(this)) {
    replaceState.call(this);
    return;
  }
  if (historyId) {
    historyId = historyId.replace(/^\/*|\/*$/g, '');
    this.finishedHistoryIds.push(historyId);
  } else {
    var lastHistory = this.history.slice(-1)[0];
    this.finishedHistoryIds.push(lastHistory[0]);
    var indexs0 = getMatchedRouters.call(this, lastHistory[1]).slice(0, -1);
    if (type == 2 && indexs0.length > 0) {
      for (var i = this.history.length - 1; i >= 0; i--) {
        var indexs = getMatchedRouters.call(this, this.history[i][1]).slice(0, -1);
        if (indexs0.join(',') != indexs.join(',')) {
          break;
        }
        this.finishedHistoryIds.push(this.history[i][0]);
      }
    }
  }
  if (!this.onPageChange) {
    processFinishedHistory.call(this);
  }
};

var defaultExit = function defaultExit() {
  var currentBrowserHistoryLen = window.history.length;
  for (var i = 0; i <= currentBrowserHistoryLen - this.__browserHistoryLen + 1; i++) {
    window.history.back();
  }
};

VueRoute.prototype.exit = function (force) {
  this.__finished = true;
  if (this.exitHandler) {
    this.exitHandler.call(this, force);
  } else {
    defaultExit.call(this);
  }
};

VueRoute.prototype.setStartUrl = function (startUrl) {
  this.startUrl = startUrl;
};

var routeChangeAt = function routeChangeAt(currentRoute, preRoute) {
  var startPos = 0;
  if (!preRoute) {
    return startPos;
  }
  for (var i = 0; i < currentRoute.length; i++) {
    if (i >= preRoute.length) {
      break;
    }
    if (currentRoute[i][0] != preRoute[i][0]) {
      startPos = i;
      break;
    }
  }
  return startPos;
};

var setPageCtor = function setPageCtor(matched, level, routers) {
  return function (ctor) {
    var r = routers;
    for (var i = 0; i < matched.length; i++) {
      if (i == level) {
        if (ctor.__esModule && ctor.default) {
          ctor = ctor.default;
        }
        r[matched[i][0]].ctor = ctor;
        break;
      }
      r = r[matched[i][0]].children;
      if (!r) {
        break;
      }
    }
  };
};

var resetHistory = function resetHistory(path, params) {
  var existInHistory = -1;
  if (this.launcherMode != 'normal' && this.history.length > 0) {
    for (var i = this.history.length - 1; i >= 0; i--) {
      if (path == this.history[i][1] && (!this.compareParam || this.compareParam && (!params && !this.history[i][2] || __WEBPACK_IMPORTED_MODULE_2_fast_deep_equal___default()(params, this.history[i][2])))) {
        existInHistory = i;
        break;
      }
      if (this.launcherMode === 'singleTop') {
        break;
      }
    }
  }
  if (existInHistory < 0) {
    this.rid++;
    var historyId = this.rid + '_' + +new Date();
    this.history.push([historyId, path, params && Object.keys(params).length > 0 ? params : null]);
  } else {
    this.finishedHistoryIds.push('_');
    this.history = this.history.slice(0, existInHistory + 1);
    var currentEndRoute = this.currentRoute.slice(-1)[0];
    this.history.slice(-1)[0].push({ reuse: currentEndRoute && currentEndRoute[1].meta && currentEndRoute[1].meta.reuse });
  }
  if (this.history.length > this.maxHistorySize) {
    this.finishedHistoryIds.push('_');
    this.history = this.history.slice(0 - this.maxHistorySize);
  }
};

var getChangeDirection = function getChangeDirection(changedPageViewIndex) {
  if (!this.preRoute || this.preRoute.length < 1) {
    return null;
  }
  var prePath = this.preRoute[changedPageViewIndex][1].path;
  var currentPath = this.currentRoute[changedPageViewIndex][1].path;
  var preIndex = 0,
      currentIndex = 0;
  var parents = void 0;
  if (changedPageViewIndex < 1) {
    parents = this.routers;
  } else {
    parents = this.preRoute[changedPageViewIndex - 1][1].children;
  }
  parents.map(function (r, i) {
    if (r.path == prePath) {
      preIndex = i;
    }
    if (r.path == currentPath) {
      currentIndex = i;
    }
  });
  if (preIndex > currentIndex) {
    return 'right';
  }
  return null;
};

var replaceState = function replaceState(path, params) {
  if (!path && this.history.length > 0) {
    var lastHistory = this.history.slice(-1)[0];
    path = lastHistory[1];
    params = lastHistory[2];
  }
  var query = __WEBPACK_IMPORTED_MODULE_1_h5_webutil__["url"].encodeQuery(params);
  if (query) {
    path += '?' + query;
  }
  if (path) {
    var startChar = this.routeMode == 'html5' ? '/' : '#';
    if (path.indexOf(startChar) !== 0) {
      path = startChar + path;
    }
    window.history.replaceState(null, null, path);
  }
};

VueRoute.prototype._pageViewLoadFinished = function () {
  doReady.call(this);
};

var doReady = function doReady() {
  var _this3 = this;

  if (this.isReady) {
    return;
  }
  this.isReady = true;
  setTimeout(function () {
    _this3.readyCbs && _this3.readyCbs();
  }, 0);
};

var doPageChange = function doPageChange(path, params, forward) {
  if (this.beforeEnter) {
    this.beforeEnter(this.currentRoute, this.params, forward);
  }
  replaceState.call(this, path, params);
  var changedPageViewIndex = routeChangeAt(this.currentRoute, this.preRoute);
  if (this.__pageViews.length > changedPageViewIndex) {
    this.changedPageViewIndex = changedPageViewIndex;
    this.__pageViews[changedPageViewIndex].doPageChange(this.history[this.history.length - 1][0], getChangeDirection.call(this, changedPageViewIndex));
  }
  doReady.call(this);
  this.onPageChange = false;
  processFinishedHistory.call(this);
};

var beforeEachCallback = function beforeEachCallback(path, params, matched, forward, started) {
  var _this4 = this;

  this.preRoute = this.currentRoute;
  this.currentRoute = [];
  var promises = [];
  var asyncComponentIndexs = [];
  for (var i = 0; i < matched.length; i++) {
    if (!matched[i][1].ctor) {
      var ctype = _typeof(matched[i][1].component);
      if (ctype === 'function') {
        var p = new matched[i][1].component();
        promises.push(p);
        asyncComponentIndexs.push(i);
      } else if (ctype === 'object') {
        matched[i][1].ctor = matched[i][1].component;
      }
    }
    this.currentRoute.push(matched[i]);
  }
  if (this.paramsInjector) {
    params = this.paramsInjector(params, forward);
  }
  if (forward && started || this.history.length < 1) {
    resetHistory.call(this, path, params);
  }
  params = this.history.slice(-1)[0][2];
  this.params = params;
  if (promises.length < 1) {
    doPageChange.call(this, path, params, forward);
  } else {
    Promise.all(promises).then(function (ctors) {
      ctors = [].concat(ctors);
      for (var _i3 = 0; _i3 < ctors.length; _i3++) {
        if (ctors[_i3].__esModule && ctors[_i3].default) {
          matched[asyncComponentIndexs[_i3]][1].ctor = ctors[_i3].default;
        } else {
          matched[asyncComponentIndexs[_i3]][1].ctor = ctors[_i3];
        }
      }
      doPageChange.call(_this4, path, params, forward);
    }, function () {
      _this4.onPageChange = false;
      processFinishedHistory.call(_this4);
    });
  }
};

/* harmony default export */ __webpack_exports__["default"] = (VueRoute);
VueRoute.install = __WEBPACK_IMPORTED_MODULE_0__install__["a" /* default */];

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = install;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_view_vue__ = __webpack_require__(5);


function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  if (Vue.component('page-view')) {
    return;
  }

  Vue.config.errorHandler = function (err, vm, info) {
    console.log(err);
    console.log(info);
  };

  Vue.component('page-view', __WEBPACK_IMPORTED_MODULE_0__page_view_vue__["a" /* default */]);

  Vue.mixin({
    beforeCreate: function beforeCreate() {
      if (this.$options.router) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this.$options.router.init(this);
      } else {
        this._routerRoot = this.$parent && this.$parent._routerRoot || this;
      }
    },

    props: {
      __path: null
    },
    data: function data() {
      return {
        __historyId: 0,
        __pageStatus: null
      };
    },
    destroyed: function destroyed() {
      if (this.$options.onDestroy) {
        this.$options.onDestroy.call(this);
      }
    },

    methods: {
      finish: function finish(pattern) {
        var _this = this;

        setTimeout(function () {
          var historyId = _this.$data.__historyId;
          if (pattern) {
            historyId = pattern;
          }
          _this.$router.finish(3, historyId);
        }, 0);
      }
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get() {
      return this._routerRoot._router;
    }
  });
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_view_vue_vue_type_template_id_29c3661a___ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_view_vue_vue_type_template_id_29c3661a____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__page_view_vue_vue_type_template_id_29c3661a___);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__page_view_vue_vue_type_script_lang_js___ = __webpack_require__(0);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__page_view_vue_vue_type_style_index_0_lang_less___ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__page_view_vue_vue_type_style_index_0_lang_less____default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__page_view_vue_vue_type_style_index_0_lang_less___);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__ = __webpack_require__(9);






/* normalize component */

var component = Object(__WEBPACK_IMPORTED_MODULE_3__node_modules_vue_loader_lib_runtime_componentNormalizer_js__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_1__page_view_vue_vue_type_script_lang_js___["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_0__page_view_vue_vue_type_template_id_29c3661a___["render"],
  __WEBPACK_IMPORTED_MODULE_0__page_view_vue_vue_type_template_id_29c3661a___["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) {
  var api = require("/Users/yijunchen/dev/cyij/vue-page-manage/node_modules/vue-hot-reload-api/dist/index.js")
  api.install(require('vue'))
  if (api.compatible) {
    module.hot.accept()
    if (!module.hot.data) {
      api.createRecord('29c3661a', component.options)
    } else {
      api.reload('29c3661a', component.options)
    }
    module.hot.accept("./page-view.vue?vue&type=template&id=29c3661a&", function () {
      api.rerender('29c3661a', {
        render: render,
        staticRenderFns: staticRenderFns
      })
    })
  }
}
component.options.__file = "src/page-view.vue"
/* harmony default export */ __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 6 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (2:0)\nYou may need an appropriate loader to handle this file type.\n| \n| <div :class=\"className\">\n|   <!-- https://cn.vuejs.org/v2/guide/transitions.html#过渡的类名 -->\n|   <transition :name=\"transitionName\" :mode=\"transitionMode\"");

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  functional: true,
  props: {
    change: 0
  },
  render: function render(h, _ref) {
    var props = _ref.props,
        children = _ref.children,
        parent = _ref.parent,
        data = _ref.data;

    var router = parent.$router;
    if (!router || !router.currentRoute) {
      return h();
    }
    var pageView = parent;

    if (!router.changedPageViewIndex) {
      router.changedPageViewIndex = 0;
    }
    var matched = null;
    if (router.changedPageViewIndex < router.currentRoute.length) {
      matched = router.currentRoute[router.changedPageViewIndex][1];
    }
    var fullPath = [];
    for (var i = 0; i < router.currentRoute.length; i++) {
      if (i > router.changedPageViewIndex) {
        break;
      }
      fullPath.push(router.currentRoute[i][1].path);
    }
    router.changedPageViewIndex++;

    parent._routerViewCache || (parent._routerViewCache = {});

    if (matched && parent._routerViewCache[matched.path]) {
      return parent._routerViewCache[matched.path];
    }
    if (!matched || !matched.ctor) {
      if (matched && matched.path) {
        delete parent._routerViewCache[matched.path];
      }
      return h();
    }
    data.props = {
      __path: fullPath.join('/')
    };

    var node = h(matched.ctor, data, children);
    parent._routerViewCache = {};
    parent._routerViewCache[matched.path] = node;
    return node;
  }
});

/***/ }),
/* 8 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (209:0)\nYou may need an appropriate loader to handle this file type.\n| \n| \n| .page-wrap {\n|   position: relative;\n|   height: 100%;");

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = normalizeComponent;
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ })
/******/ ]);
});