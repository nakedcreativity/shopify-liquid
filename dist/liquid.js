(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Liquid = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//const strftime = require('strftime').timezone(-(new Date()).getTimezoneOffset());
var strftime = require('./src/strftime.js');

module.exports = function (liquid) {
    liquid.registerFilter('abs', function (v) {
        return Math.abs(v);
    });
    liquid.registerFilter('append', function (v, arg) {
        return v + arg;
    });
    liquid.registerFilter('capitalize', function (str) {
        return stringify(str).charAt(0).toUpperCase() + str.slice(1);
    });
    liquid.registerFilter('ceil', function (v) {
        return Math.ceil(v);
    });

    //liquid.registerFilter('date', (v, arg) => strftime(arg, v));
    liquid.registerFilter('date', function (v, arg) {
        return strftime(v, arg);
    });

    liquid.registerFilter('default', function (v, arg) {
        return arg || v;
    });
    liquid.registerFilter('divided_by', function (v, arg) {
        return Math.floor(v / arg);
    });
    liquid.registerFilter('downcase', function (v) {
        return v.toLowerCase();
    });

    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&#34;',
        "'": '&#39;'
    };

    function escape(str) {
        return stringify(str).replace(/&|<|>|"|'/g, function (m) {
            return escapeMap[m];
        });
    }
    liquid.registerFilter('escape', escape);

    var unescapeMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#34;': '"',
        '&#39;': "'"
    };

    function unescape(str) {
        return stringify(str).replace(/&(amp|lt|gt|#34|#39);/g, function (m) {
            return unescapeMap[m];
        });
    }
    liquid.registerFilter('escape_once', function (str) {
        return escape(unescape(str));
    });
    liquid.registerFilter('first', function (v) {
        return v[0];
    });
    liquid.registerFilter('floor', function (v) {
        return Math.floor(v);
    });
    liquid.registerFilter('join', function (v, arg) {
        return v.join(arg);
    });
    liquid.registerFilter('last', function (v) {
        return v[v.length - 1];
    });
    liquid.registerFilter('lstrip', function (v) {
        return stringify(v).replace(/^\s+/, '');
    });
    liquid.registerFilter('map', function (arr, arg) {
        return arr.map(function (v) {
            return v[arg];
        });
    });
    liquid.registerFilter('minus', bindFixed(function (v, arg) {
        return v - arg;
    }));
    liquid.registerFilter('modulo', bindFixed(function (v, arg) {
        return v % arg;
    }));
    liquid.registerFilter('newline_to_br', function (v) {
        return v.replace(/\n/g, '<br />');
    });
    liquid.registerFilter('plus', bindFixed(function (v, arg) {
        return v + arg;
    }));
    liquid.registerFilter('prepend', function (v, arg) {
        return arg + v;
    });
    liquid.registerFilter('remove', function (v, arg) {
        return v.split(arg).join('');
    });
    liquid.registerFilter('remove_first', function (v, l) {
        return v.replace(l, '');
    });
    liquid.registerFilter('replace', function (v, pattern, replacement) {
        return stringify(v).split(pattern).join(replacement);
    });
    liquid.registerFilter('replace_first', function (v, arg1, arg2) {
        return stringify(v).replace(arg1, arg2);
    });
    liquid.registerFilter('reverse', function (v) {
        return v.reverse();
    });
    liquid.registerFilter('round', function (v, arg) {
        var amp = Math.pow(10, arg || 0);
        return Math.round(v * amp, arg) / amp;
    });
    liquid.registerFilter('rstrip', function (str) {
        return stringify(str).replace(/\s+$/, '');
    });
    liquid.registerFilter('size', function (v) {
        return v.length;
    });
    liquid.registerFilter('slice', function (v, begin, length) {
        return v.substr(begin, length === undefined ? 1 : length);
    });
    liquid.registerFilter('sort', function (v, arg) {
        return v.sort(arg);
    });
    liquid.registerFilter('split', function (v, arg) {
        return stringify(v).split(arg);
    });
    liquid.registerFilter('strip', function (v) {
        return stringify(v).trim();
    });
    liquid.registerFilter('strip_html', function (v) {
        return stringify(v).replace(/<\/?\s*\w+\s*\/?>/g, '');
    });
    liquid.registerFilter('strip_newlines', function (v) {
        return stringify(v).replace(/\n/g, '');
    });
    liquid.registerFilter('times', function (v, arg) {
        return v * arg;
    });
    liquid.registerFilter('truncate', function (v, l, o) {
        v = stringify(v);
        o = o === undefined ? '...' : o;
        l = l || 16;
        if (v.length <= l) return v;
        return v.substr(0, l - o.length) + o;
    });
    liquid.registerFilter('truncatewords', function (v, l, o) {
        if (o === undefined) o = '...';
        var arr = v.split(' ');
        var ret = arr.slice(0, l).join(' ');
        if (arr.length > l) ret += o;
        return ret;
    });
    liquid.registerFilter('uniq', function (arr) {
        var u = {};
        return (arr || []).filter(function (val) {
            if (u.hasOwnProperty(val)) {
                return false;
            }
            u[val] = true;
            return true;
        });
    });
    liquid.registerFilter('upcase', function (str) {
        return stringify(str).toUpperCase();
    });
    liquid.registerFilter('url_encode', encodeURIComponent);
};

function getFixed(v) {
    var p = (v + "").split(".");
    return p.length > 1 ? p[1].length : 0;
}

function getMaxFixed(l, r) {
    return Math.max(getFixed(l), getFixed(r));
}

function stringify(obj) {
    obj = obj || "";
    return obj + '';
}

function bindFixed(cb) {
    return function (l, r) {
        var f = getMaxFixed(l, r);
        return cb(l, r).toFixed(f);
    };
}

},{"./src/strftime.js":15}],2:[function(require,module,exports){
'use strict';

var Scope = require('./src/scope');
var tokenizer = require('./src/tokenizer.js');
var fs = require('fs');
var Render = require('./src/render.js');
var lexical = require('./src/lexical.js');
var Tag = require('./src/tag.js');
var Filter = require('./src/filter.js');
var Template = require('./src/parser');
var Expression = require('./src/expression.js');
var tags = require('./tags');
var filters = require('./filters');
var Promise = require('any-promise');

var _engine = {
    init: function init(tag, filter, options) {
        if (options.cache) {
            this.cache = {};
        }
        this.options = options;
        this.tag = tag;
        this.filter = filter;
        this.parser = Template(tag, filter);
        this.renderer = Render();

        tags(this);
        filters(this);

        return this;
    },
    parse: function parse(html) {
        var tokens = tokenizer.parse(html);
        return this.parser.parse(tokens);
    },
    render: function render(tpl, ctx, opts) {
        opts = opts || {};
        opts.strict_variables = opts.strict_variables || false;
        opts.strict_filters = opts.strict_filters || false;

        this.renderer.resetRegisters();
        var scope = Scope.factory(ctx, {
            strict: opts.strict_variables
        });
        return this.renderer.renderTemplates(tpl, scope, opts);
    },
    parseAndRender: function parseAndRender(html, ctx, opts) {
        try {
            var tpl = this.parse(html);
            return this.render(tpl, ctx, opts);
        } catch (error) {
            // A throw inside of a then or catch of a Promise automatically rejects, but since we mix a sync call
            //  with an async call, we need to do this in case the sync call throws.
            return Promise.reject(error);
        }
    },
    renderFile: function renderFile(filepath, ctx, opts) {
        var _this = this;

        return this.handleCache(filepath).then(function (templates) {
            return _this.render(templates, ctx, opts);
        }).catch(function (e) {
            e.file = filepath;
            throw e;
        });
    },
    evalOutput: function evalOutput(str, scope) {
        var tpl = this.parser.parseOutput(str.trim());
        return this.renderer.evalOutput(tpl, scope);
    },
    registerFilter: function registerFilter(name, filter) {
        return this.filter.register(name, filter);
    },
    registerTag: function registerTag(name, tag) {
        return this.tag.register(name, tag);
    },
    handleCache: function handleCache(filepath) {
        var _this2 = this;

        if (!filepath) throw new Error('filepath cannot be null');

        return this.getTemplate(filepath).then(function (html) {
            var tpl = _this2.options.cache && _this2.cache[filepath] || _this2.parse(html);
            return _this2.options.cache ? _this2.cache[filepath] = tpl : tpl;
        });
    },
    getTemplate: function getTemplate(filepath) {
        filepath = resolvePath(this.options.root, filepath);

        if (!filepath.match(/\.\w+$/)) {
            filepath += this.options.extname;
        }
        return new Promise(function (resolve, reject) {
            fs.readFile(filepath, 'utf8', function (err, html) {
                err ? reject(err) : resolve(html);
            });
        });
    },
    express: function express(renderingOptions) {
        var _this3 = this;

        return function (filePath, options, callback) {
            _this3.renderFile(filePath, options, renderingOptions).then(function (html) {
                return callback(null, html);
            }).catch(function (e) {
                return callback(e);
            });
        };
    }
};

function factory(options) {
    options = options || {};
    options.root = options.root || '';
    options.extname = options.extname || '.liquid';

    var engine = Object.create(_engine);

    engine.init(Tag(), Filter(), options);
    return engine;
}

function resolvePath(root, path) {
    if (path[0] == '/') return path;

    var arr = root.split('/').concat(path.split('/'));
    var result = [];
    arr.forEach(function (slug) {
        if (slug == '..') result.pop();else if (!slug || slug == '.') ;else result.push(slug);
    });
    return '/' + result.join('/');
}

factory.lexical = lexical;
factory.isTruthy = Expression.isTruthy;
factory.isFalsy = Expression.isFalsy;
factory.evalExp = Expression.evalExp;
factory.evalValue = Expression.evalValue;

module.exports = factory;

},{"./filters":1,"./src/expression.js":9,"./src/filter.js":10,"./src/lexical.js":11,"./src/parser":12,"./src/render.js":13,"./src/scope":14,"./src/tag.js":17,"./src/tokenizer.js":18,"./tags":29,"any-promise":3,"fs":6}],3:[function(require,module,exports){
'use strict';

module.exports = require('./register')().Promise;

},{"./register":5}],4:[function(require,module,exports){
"use strict";
// global key for user preferred registration

var REGISTRATION_KEY = '@@any-promise/REGISTRATION',

// Prior registration (preferred or detected)
registered = null;

/**
 * Registers the given implementation.  An implementation must
 * be registered prior to any call to `require("any-promise")`,
 * typically on application load.
 *
 * If called with no arguments, will return registration in
 * following priority:
 *
 * For Node.js:
 *
 * 1. Previous registration
 * 2. global.Promise if node.js version >= 0.12
 * 3. Auto detected promise based on first sucessful require of
 *    known promise libraries. Note this is a last resort, as the
 *    loaded library is non-deterministic. node.js >= 0.12 will
 *    always use global.Promise over this priority list.
 * 4. Throws error.
 *
 * For Browser:
 *
 * 1. Previous registration
 * 2. window.Promise
 * 3. Throws error.
 *
 * Options:
 *
 * Promise: Desired Promise constructor
 * global: Boolean - Should the registration be cached in a global variable to
 * allow cross dependency/bundle registration?  (default true)
 */
module.exports = function (root, loadImplementation) {
  return function register(implementation, opts) {
    implementation = implementation || null;
    opts = opts || {};
    // global registration unless explicitly  {global: false} in options (default true)
    var registerGlobal = opts.global !== false;

    // load any previous global registration
    if (registered === null && registerGlobal) {
      registered = root[REGISTRATION_KEY] || null;
    }

    if (registered !== null && implementation !== null && registered.implementation !== implementation) {
      // Throw error if attempting to redefine implementation
      throw new Error('any-promise already defined as "' + registered.implementation + '".  You can only register an implementation before the first ' + ' call to require("any-promise") and an implementation cannot be changed');
    }

    if (registered === null) {
      // use provided implementation
      if (implementation !== null && typeof opts.Promise !== 'undefined') {
        registered = {
          Promise: opts.Promise,
          implementation: implementation
        };
      } else {
        // require implementation if implementation is specified but not provided
        registered = loadImplementation(implementation);
      }

      if (registerGlobal) {
        // register preference globally in case multiple installations
        root[REGISTRATION_KEY] = registered;
      }
    }

    return registered;
  };
};

},{}],5:[function(require,module,exports){
"use strict";

module.exports = require('./loader')(window, loadImplementation);

/**
 * Browser specific loadImplementation.  Always uses `window.Promise`
 *
 * To register a custom implementation, must register with `Promise` option.
 */
function loadImplementation() {
  if (typeof window.Promise === 'undefined') {
    throw new Error("any-promise browser requires a polyfill or explicit registration" + " e.g: require('any-promise/register/bluebird')");
  }
  return {
    Promise: window.Promise,
    implementation: 'window.Promise'
  };
}

},{"./loader":4}],6:[function(require,module,exports){
"use strict";

},{}],7:[function(require,module,exports){
'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};//! moment.js
//! version : 2.15.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
;(function(global,factory){(typeof exports==='undefined'?'undefined':_typeof(exports))==='object'&&typeof module!=='undefined'?module.exports=factory():typeof define==='function'&&define.amd?define(factory):global.moment=factory();})(undefined,function(){'use strict';var hookCallback;function utils_hooks__hooks(){return hookCallback.apply(null,arguments);}// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback(callback){hookCallback=callback;}function isArray(input){return input instanceof Array||Object.prototype.toString.call(input)==='[object Array]';}function isObject(input){// IE8 will treat undefined and null as object if it wasn't for
// input != null
return input!=null&&Object.prototype.toString.call(input)==='[object Object]';}function isObjectEmpty(obj){var k;for(k in obj){// even if its not own property I'd still call it non-empty
return false;}return true;}function isDate(input){return input instanceof Date||Object.prototype.toString.call(input)==='[object Date]';}function map(arr,fn){var res=[],i;for(i=0;i<arr.length;++i){res.push(fn(arr[i],i));}return res;}function hasOwnProp(a,b){return Object.prototype.hasOwnProperty.call(a,b);}function extend(a,b){for(var i in b){if(hasOwnProp(b,i)){a[i]=b[i];}}if(hasOwnProp(b,'toString')){a.toString=b.toString;}if(hasOwnProp(b,'valueOf')){a.valueOf=b.valueOf;}return a;}function create_utc__createUTC(input,format,locale,strict){return createLocalOrUTC(input,format,locale,strict,true).utc();}function defaultParsingFlags(){// We need to deep clone this object.
return{empty:false,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:false,invalidMonth:null,invalidFormat:false,userInvalidated:false,iso:false,parsedDateParts:[],meridiem:null};}function getParsingFlags(m){if(m._pf==null){m._pf=defaultParsingFlags();}return m._pf;}var some;if(Array.prototype.some){some=Array.prototype.some;}else{some=function some(fun){var t=Object(this);var len=t.length>>>0;for(var i=0;i<len;i++){if(i in t&&fun.call(this,t[i],i,t)){return true;}}return false;};}function valid__isValid(m){if(m._isValid==null){var flags=getParsingFlags(m);var parsedParts=some.call(flags.parsedDateParts,function(i){return i!=null;});var isNowValid=!isNaN(m._d.getTime())&&flags.overflow<0&&!flags.empty&&!flags.invalidMonth&&!flags.invalidWeekday&&!flags.nullInput&&!flags.invalidFormat&&!flags.userInvalidated&&(!flags.meridiem||flags.meridiem&&parsedParts);if(m._strict){isNowValid=isNowValid&&flags.charsLeftOver===0&&flags.unusedTokens.length===0&&flags.bigHour===undefined;}if(Object.isFrozen==null||!Object.isFrozen(m)){m._isValid=isNowValid;}else{return isNowValid;}}return m._isValid;}function valid__createInvalid(flags){var m=create_utc__createUTC(NaN);if(flags!=null){extend(getParsingFlags(m),flags);}else{getParsingFlags(m).userInvalidated=true;}return m;}function isUndefined(input){return input===void 0;}// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties=utils_hooks__hooks.momentProperties=[];function copyConfig(to,from){var i,prop,val;if(!isUndefined(from._isAMomentObject)){to._isAMomentObject=from._isAMomentObject;}if(!isUndefined(from._i)){to._i=from._i;}if(!isUndefined(from._f)){to._f=from._f;}if(!isUndefined(from._l)){to._l=from._l;}if(!isUndefined(from._strict)){to._strict=from._strict;}if(!isUndefined(from._tzm)){to._tzm=from._tzm;}if(!isUndefined(from._isUTC)){to._isUTC=from._isUTC;}if(!isUndefined(from._offset)){to._offset=from._offset;}if(!isUndefined(from._pf)){to._pf=getParsingFlags(from);}if(!isUndefined(from._locale)){to._locale=from._locale;}if(momentProperties.length>0){for(i in momentProperties){prop=momentProperties[i];val=from[prop];if(!isUndefined(val)){to[prop]=val;}}}return to;}var updateInProgress=false;// Moment prototype object
function Moment(config){copyConfig(this,config);this._d=new Date(config._d!=null?config._d.getTime():NaN);// Prevent infinite loop in case updateOffset creates new moment
// objects.
if(updateInProgress===false){updateInProgress=true;utils_hooks__hooks.updateOffset(this);updateInProgress=false;}}function isMoment(obj){return obj instanceof Moment||obj!=null&&obj._isAMomentObject!=null;}function absFloor(number){if(number<0){// -0 -> 0
return Math.ceil(number)||0;}else{return Math.floor(number);}}function toInt(argumentForCoercion){var coercedNumber=+argumentForCoercion,value=0;if(coercedNumber!==0&&isFinite(coercedNumber)){value=absFloor(coercedNumber);}return value;}// compare two arrays, return the number of differences
function compareArrays(array1,array2,dontConvert){var len=Math.min(array1.length,array2.length),lengthDiff=Math.abs(array1.length-array2.length),diffs=0,i;for(i=0;i<len;i++){if(dontConvert&&array1[i]!==array2[i]||!dontConvert&&toInt(array1[i])!==toInt(array2[i])){diffs++;}}return diffs+lengthDiff;}function warn(msg){if(utils_hooks__hooks.suppressDeprecationWarnings===false&&typeof console!=='undefined'&&console.warn){console.warn('Deprecation warning: '+msg);}}function deprecate(msg,fn){var firstTime=true;return extend(function(){if(utils_hooks__hooks.deprecationHandler!=null){utils_hooks__hooks.deprecationHandler(null,msg);}if(firstTime){var args=[];var arg;for(var i=0;i<arguments.length;i++){arg='';if(_typeof(arguments[i])==='object'){arg+='\n['+i+'] ';for(var key in arguments[0]){arg+=key+': '+arguments[0][key]+', ';}arg=arg.slice(0,-2);// Remove trailing comma and space
}else{arg=arguments[i];}args.push(arg);}warn(msg+'\nArguments: '+Array.prototype.slice.call(args).join('')+'\n'+new Error().stack);firstTime=false;}return fn.apply(this,arguments);},fn);}var deprecations={};function deprecateSimple(name,msg){if(utils_hooks__hooks.deprecationHandler!=null){utils_hooks__hooks.deprecationHandler(name,msg);}if(!deprecations[name]){warn(msg);deprecations[name]=true;}}utils_hooks__hooks.suppressDeprecationWarnings=false;utils_hooks__hooks.deprecationHandler=null;function isFunction(input){return input instanceof Function||Object.prototype.toString.call(input)==='[object Function]';}function locale_set__set(config){var prop,i;for(i in config){prop=config[i];if(isFunction(prop)){this[i]=prop;}else{this['_'+i]=prop;}}this._config=config;// Lenient ordinal parsing accepts just a number in addition to
// number + (possibly) stuff coming from _ordinalParseLenient.
this._ordinalParseLenient=new RegExp(this._ordinalParse.source+'|'+/\d{1,2}/.source);}function mergeConfigs(parentConfig,childConfig){var res=extend({},parentConfig),prop;for(prop in childConfig){if(hasOwnProp(childConfig,prop)){if(isObject(parentConfig[prop])&&isObject(childConfig[prop])){res[prop]={};extend(res[prop],parentConfig[prop]);extend(res[prop],childConfig[prop]);}else if(childConfig[prop]!=null){res[prop]=childConfig[prop];}else{delete res[prop];}}}for(prop in parentConfig){if(hasOwnProp(parentConfig,prop)&&!hasOwnProp(childConfig,prop)&&isObject(parentConfig[prop])){// make sure changes to properties don't modify parent config
res[prop]=extend({},res[prop]);}}return res;}function Locale(config){if(config!=null){this.set(config);}}var keys;if(Object.keys){keys=Object.keys;}else{keys=function keys(obj){var i,res=[];for(i in obj){if(hasOwnProp(obj,i)){res.push(i);}}return res;};}var defaultCalendar={sameDay:'[Today at] LT',nextDay:'[Tomorrow at] LT',nextWeek:'dddd [at] LT',lastDay:'[Yesterday at] LT',lastWeek:'[Last] dddd [at] LT',sameElse:'L'};function locale_calendar__calendar(key,mom,now){var output=this._calendar[key]||this._calendar['sameElse'];return isFunction(output)?output.call(mom,now):output;}var defaultLongDateFormat={LTS:'h:mm:ss A',LT:'h:mm A',L:'MM/DD/YYYY',LL:'MMMM D, YYYY',LLL:'MMMM D, YYYY h:mm A',LLLL:'dddd, MMMM D, YYYY h:mm A'};function longDateFormat(key){var format=this._longDateFormat[key],formatUpper=this._longDateFormat[key.toUpperCase()];if(format||!formatUpper){return format;}this._longDateFormat[key]=formatUpper.replace(/MMMM|MM|DD|dddd/g,function(val){return val.slice(1);});return this._longDateFormat[key];}var defaultInvalidDate='Invalid date';function invalidDate(){return this._invalidDate;}var defaultOrdinal='%d';var defaultOrdinalParse=/\d{1,2}/;function ordinal(number){return this._ordinal.replace('%d',number);}var defaultRelativeTime={future:'in %s',past:'%s ago',s:'a few seconds',m:'a minute',mm:'%d minutes',h:'an hour',hh:'%d hours',d:'a day',dd:'%d days',M:'a month',MM:'%d months',y:'a year',yy:'%d years'};function relative__relativeTime(number,withoutSuffix,string,isFuture){var output=this._relativeTime[string];return isFunction(output)?output(number,withoutSuffix,string,isFuture):output.replace(/%d/i,number);}function pastFuture(diff,output){var format=this._relativeTime[diff>0?'future':'past'];return isFunction(format)?format(output):format.replace(/%s/i,output);}var aliases={};function addUnitAlias(unit,shorthand){var lowerCase=unit.toLowerCase();aliases[lowerCase]=aliases[lowerCase+'s']=aliases[shorthand]=unit;}function normalizeUnits(units){return typeof units==='string'?aliases[units]||aliases[units.toLowerCase()]:undefined;}function normalizeObjectUnits(inputObject){var normalizedInput={},normalizedProp,prop;for(prop in inputObject){if(hasOwnProp(inputObject,prop)){normalizedProp=normalizeUnits(prop);if(normalizedProp){normalizedInput[normalizedProp]=inputObject[prop];}}}return normalizedInput;}var priorities={};function addUnitPriority(unit,priority){priorities[unit]=priority;}function getPrioritizedUnits(unitsObj){var units=[];for(var u in unitsObj){units.push({unit:u,priority:priorities[u]});}units.sort(function(a,b){return a.priority-b.priority;});return units;}function makeGetSet(unit,keepTime){return function(value){if(value!=null){get_set__set(this,unit,value);utils_hooks__hooks.updateOffset(this,keepTime);return this;}else{return get_set__get(this,unit);}};}function get_set__get(mom,unit){return mom.isValid()?mom._d['get'+(mom._isUTC?'UTC':'')+unit]():NaN;}function get_set__set(mom,unit,value){if(mom.isValid()){mom._d['set'+(mom._isUTC?'UTC':'')+unit](value);}}// MOMENTS
function stringGet(units){units=normalizeUnits(units);if(isFunction(this[units])){return this[units]();}return this;}function stringSet(units,value){if((typeof units==='undefined'?'undefined':_typeof(units))==='object'){units=normalizeObjectUnits(units);var prioritized=getPrioritizedUnits(units);for(var i=0;i<prioritized.length;i++){this[prioritized[i].unit](units[prioritized[i].unit]);}}else{units=normalizeUnits(units);if(isFunction(this[units])){return this[units](value);}}return this;}function zeroFill(number,targetLength,forceSign){var absNumber=''+Math.abs(number),zerosToFill=targetLength-absNumber.length,sign=number>=0;return(sign?forceSign?'+':'':'-')+Math.pow(10,Math.max(0,zerosToFill)).toString().substr(1)+absNumber;}var formattingTokens=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;var localFormattingTokens=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;var formatFunctions={};var formatTokenFunctions={};// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken(token,padded,ordinal,callback){var func=callback;if(typeof callback==='string'){func=function func(){return this[callback]();};}if(token){formatTokenFunctions[token]=func;}if(padded){formatTokenFunctions[padded[0]]=function(){return zeroFill(func.apply(this,arguments),padded[1],padded[2]);};}if(ordinal){formatTokenFunctions[ordinal]=function(){return this.localeData().ordinal(func.apply(this,arguments),token);};}}function removeFormattingTokens(input){if(input.match(/\[[\s\S]/)){return input.replace(/^\[|\]$/g,'');}return input.replace(/\\/g,'');}function makeFormatFunction(format){var array=format.match(formattingTokens),i,length;for(i=0,length=array.length;i<length;i++){if(formatTokenFunctions[array[i]]){array[i]=formatTokenFunctions[array[i]];}else{array[i]=removeFormattingTokens(array[i]);}}return function(mom){var output='',i;for(i=0;i<length;i++){output+=array[i]instanceof Function?array[i].call(mom,format):array[i];}return output;};}// format date using native date object
function formatMoment(m,format){if(!m.isValid()){return m.localeData().invalidDate();}format=expandFormat(format,m.localeData());formatFunctions[format]=formatFunctions[format]||makeFormatFunction(format);return formatFunctions[format](m);}function expandFormat(format,locale){var i=5;function replaceLongDateFormatTokens(input){return locale.longDateFormat(input)||input;}localFormattingTokens.lastIndex=0;while(i>=0&&localFormattingTokens.test(format)){format=format.replace(localFormattingTokens,replaceLongDateFormatTokens);localFormattingTokens.lastIndex=0;i-=1;}return format;}var match1=/\d/;//       0 - 9
var match2=/\d\d/;//      00 - 99
var match3=/\d{3}/;//     000 - 999
var match4=/\d{4}/;//    0000 - 9999
var match6=/[+-]?\d{6}/;// -999999 - 999999
var match1to2=/\d\d?/;//       0 - 99
var match3to4=/\d\d\d\d?/;//     999 - 9999
var match5to6=/\d\d\d\d\d\d?/;//   99999 - 999999
var match1to3=/\d{1,3}/;//       0 - 999
var match1to4=/\d{1,4}/;//       0 - 9999
var match1to6=/[+-]?\d{1,6}/;// -999999 - 999999
var matchUnsigned=/\d+/;//       0 - inf
var matchSigned=/[+-]?\d+/;//    -inf - inf
var matchOffset=/Z|[+-]\d\d:?\d\d/gi;// +00:00 -00:00 +0000 -0000 or Z
var matchShortOffset=/Z|[+-]\d\d(?::?\d\d)?/gi;// +00 -00 +00:00 -00:00 +0000 -0000 or Z
var matchTimestamp=/[+-]?\d+(\.\d{1,3})?/;// 123456789 123456789.123
// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
var matchWord=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;var regexes={};function addRegexToken(token,regex,strictRegex){regexes[token]=isFunction(regex)?regex:function(isStrict,localeData){return isStrict&&strictRegex?strictRegex:regex;};}function getParseRegexForToken(token,config){if(!hasOwnProp(regexes,token)){return new RegExp(unescapeFormat(token));}return regexes[token](config._strict,config._locale);}// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function unescapeFormat(s){return regexEscape(s.replace('\\','').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(matched,p1,p2,p3,p4){return p1||p2||p3||p4;}));}function regexEscape(s){return s.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&');}var tokens={};function addParseToken(token,callback){var i,func=callback;if(typeof token==='string'){token=[token];}if(typeof callback==='number'){func=function func(input,array){array[callback]=toInt(input);};}for(i=0;i<token.length;i++){tokens[token[i]]=func;}}function addWeekParseToken(token,callback){addParseToken(token,function(input,array,config,token){config._w=config._w||{};callback(input,config._w,config,token);});}function addTimeToArrayFromToken(token,input,config){if(input!=null&&hasOwnProp(tokens,token)){tokens[token](input,config._a,config,token);}}var YEAR=0;var MONTH=1;var DATE=2;var HOUR=3;var MINUTE=4;var SECOND=5;var MILLISECOND=6;var WEEK=7;var WEEKDAY=8;var indexOf;if(Array.prototype.indexOf){indexOf=Array.prototype.indexOf;}else{indexOf=function indexOf(o){// I know
var i;for(i=0;i<this.length;++i){if(this[i]===o){return i;}}return-1;};}function daysInMonth(year,month){return new Date(Date.UTC(year,month+1,0)).getUTCDate();}// FORMATTING
addFormatToken('M',['MM',2],'Mo',function(){return this.month()+1;});addFormatToken('MMM',0,0,function(format){return this.localeData().monthsShort(this,format);});addFormatToken('MMMM',0,0,function(format){return this.localeData().months(this,format);});// ALIASES
addUnitAlias('month','M');// PRIORITY
addUnitPriority('month',8);// PARSING
addRegexToken('M',match1to2);addRegexToken('MM',match1to2,match2);addRegexToken('MMM',function(isStrict,locale){return locale.monthsShortRegex(isStrict);});addRegexToken('MMMM',function(isStrict,locale){return locale.monthsRegex(isStrict);});addParseToken(['M','MM'],function(input,array){array[MONTH]=toInt(input)-1;});addParseToken(['MMM','MMMM'],function(input,array,config,token){var month=config._locale.monthsParse(input,token,config._strict);// if we didn't find a month name, mark the date as invalid.
if(month!=null){array[MONTH]=month;}else{getParsingFlags(config).invalidMonth=input;}});// LOCALES
var MONTHS_IN_FORMAT=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;var defaultLocaleMonths='January_February_March_April_May_June_July_August_September_October_November_December'.split('_');function localeMonths(m,format){if(!m){return this._months;}return isArray(this._months)?this._months[m.month()]:this._months[(this._months.isFormat||MONTHS_IN_FORMAT).test(format)?'format':'standalone'][m.month()];}var defaultLocaleMonthsShort='Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');function localeMonthsShort(m,format){if(!m){return this._monthsShort;}return isArray(this._monthsShort)?this._monthsShort[m.month()]:this._monthsShort[MONTHS_IN_FORMAT.test(format)?'format':'standalone'][m.month()];}function units_month__handleStrictParse(monthName,format,strict){var i,ii,mom,llc=monthName.toLocaleLowerCase();if(!this._monthsParse){// this is not used
this._monthsParse=[];this._longMonthsParse=[];this._shortMonthsParse=[];for(i=0;i<12;++i){mom=create_utc__createUTC([2000,i]);this._shortMonthsParse[i]=this.monthsShort(mom,'').toLocaleLowerCase();this._longMonthsParse[i]=this.months(mom,'').toLocaleLowerCase();}}if(strict){if(format==='MMM'){ii=indexOf.call(this._shortMonthsParse,llc);return ii!==-1?ii:null;}else{ii=indexOf.call(this._longMonthsParse,llc);return ii!==-1?ii:null;}}else{if(format==='MMM'){ii=indexOf.call(this._shortMonthsParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._longMonthsParse,llc);return ii!==-1?ii:null;}else{ii=indexOf.call(this._longMonthsParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._shortMonthsParse,llc);return ii!==-1?ii:null;}}}function localeMonthsParse(monthName,format,strict){var i,mom,regex;if(this._monthsParseExact){return units_month__handleStrictParse.call(this,monthName,format,strict);}if(!this._monthsParse){this._monthsParse=[];this._longMonthsParse=[];this._shortMonthsParse=[];}// TODO: add sorting
// Sorting makes sure if one month (or abbr) is a prefix of another
// see sorting in computeMonthsParse
for(i=0;i<12;i++){// make the regex if we don't have it already
mom=create_utc__createUTC([2000,i]);if(strict&&!this._longMonthsParse[i]){this._longMonthsParse[i]=new RegExp('^'+this.months(mom,'').replace('.','')+'$','i');this._shortMonthsParse[i]=new RegExp('^'+this.monthsShort(mom,'').replace('.','')+'$','i');}if(!strict&&!this._monthsParse[i]){regex='^'+this.months(mom,'')+'|^'+this.monthsShort(mom,'');this._monthsParse[i]=new RegExp(regex.replace('.',''),'i');}// test the regex
if(strict&&format==='MMMM'&&this._longMonthsParse[i].test(monthName)){return i;}else if(strict&&format==='MMM'&&this._shortMonthsParse[i].test(monthName)){return i;}else if(!strict&&this._monthsParse[i].test(monthName)){return i;}}}// MOMENTS
function setMonth(mom,value){var dayOfMonth;if(!mom.isValid()){// No op
return mom;}if(typeof value==='string'){if(/^\d+$/.test(value)){value=toInt(value);}else{value=mom.localeData().monthsParse(value);// TODO: Another silent failure?
if(typeof value!=='number'){return mom;}}}dayOfMonth=Math.min(mom.date(),daysInMonth(mom.year(),value));mom._d['set'+(mom._isUTC?'UTC':'')+'Month'](value,dayOfMonth);return mom;}function getSetMonth(value){if(value!=null){setMonth(this,value);utils_hooks__hooks.updateOffset(this,true);return this;}else{return get_set__get(this,'Month');}}function getDaysInMonth(){return daysInMonth(this.year(),this.month());}var defaultMonthsShortRegex=matchWord;function monthsShortRegex(isStrict){if(this._monthsParseExact){if(!hasOwnProp(this,'_monthsRegex')){computeMonthsParse.call(this);}if(isStrict){return this._monthsShortStrictRegex;}else{return this._monthsShortRegex;}}else{if(!hasOwnProp(this,'_monthsShortRegex')){this._monthsShortRegex=defaultMonthsShortRegex;}return this._monthsShortStrictRegex&&isStrict?this._monthsShortStrictRegex:this._monthsShortRegex;}}var defaultMonthsRegex=matchWord;function monthsRegex(isStrict){if(this._monthsParseExact){if(!hasOwnProp(this,'_monthsRegex')){computeMonthsParse.call(this);}if(isStrict){return this._monthsStrictRegex;}else{return this._monthsRegex;}}else{if(!hasOwnProp(this,'_monthsRegex')){this._monthsRegex=defaultMonthsRegex;}return this._monthsStrictRegex&&isStrict?this._monthsStrictRegex:this._monthsRegex;}}function computeMonthsParse(){function cmpLenRev(a,b){return b.length-a.length;}var shortPieces=[],longPieces=[],mixedPieces=[],i,mom;for(i=0;i<12;i++){// make the regex if we don't have it already
mom=create_utc__createUTC([2000,i]);shortPieces.push(this.monthsShort(mom,''));longPieces.push(this.months(mom,''));mixedPieces.push(this.months(mom,''));mixedPieces.push(this.monthsShort(mom,''));}// Sorting makes sure if one month (or abbr) is a prefix of another it
// will match the longer piece.
shortPieces.sort(cmpLenRev);longPieces.sort(cmpLenRev);mixedPieces.sort(cmpLenRev);for(i=0;i<12;i++){shortPieces[i]=regexEscape(shortPieces[i]);longPieces[i]=regexEscape(longPieces[i]);}for(i=0;i<24;i++){mixedPieces[i]=regexEscape(mixedPieces[i]);}this._monthsRegex=new RegExp('^('+mixedPieces.join('|')+')','i');this._monthsShortRegex=this._monthsRegex;this._monthsStrictRegex=new RegExp('^('+longPieces.join('|')+')','i');this._monthsShortStrictRegex=new RegExp('^('+shortPieces.join('|')+')','i');}// FORMATTING
addFormatToken('Y',0,0,function(){var y=this.year();return y<=9999?''+y:'+'+y;});addFormatToken(0,['YY',2],0,function(){return this.year()%100;});addFormatToken(0,['YYYY',4],0,'year');addFormatToken(0,['YYYYY',5],0,'year');addFormatToken(0,['YYYYYY',6,true],0,'year');// ALIASES
addUnitAlias('year','y');// PRIORITIES
addUnitPriority('year',1);// PARSING
addRegexToken('Y',matchSigned);addRegexToken('YY',match1to2,match2);addRegexToken('YYYY',match1to4,match4);addRegexToken('YYYYY',match1to6,match6);addRegexToken('YYYYYY',match1to6,match6);addParseToken(['YYYYY','YYYYYY'],YEAR);addParseToken('YYYY',function(input,array){array[YEAR]=input.length===2?utils_hooks__hooks.parseTwoDigitYear(input):toInt(input);});addParseToken('YY',function(input,array){array[YEAR]=utils_hooks__hooks.parseTwoDigitYear(input);});addParseToken('Y',function(input,array){array[YEAR]=parseInt(input,10);});// HELPERS
function daysInYear(year){return isLeapYear(year)?366:365;}function isLeapYear(year){return year%4===0&&year%100!==0||year%400===0;}// HOOKS
utils_hooks__hooks.parseTwoDigitYear=function(input){return toInt(input)+(toInt(input)>68?1900:2000);};// MOMENTS
var getSetYear=makeGetSet('FullYear',true);function getIsLeapYear(){return isLeapYear(this.year());}function createDate(y,m,d,h,M,s,ms){//can't just apply() to create a date:
//http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
var date=new Date(y,m,d,h,M,s,ms);//the date constructor remaps years 0-99 to 1900-1999
if(y<100&&y>=0&&isFinite(date.getFullYear())){date.setFullYear(y);}return date;}function createUTCDate(y){var date=new Date(Date.UTC.apply(null,arguments));//the Date.UTC function remaps years 0-99 to 1900-1999
if(y<100&&y>=0&&isFinite(date.getUTCFullYear())){date.setUTCFullYear(y);}return date;}// start-of-first-week - start-of-year
function firstWeekOffset(year,dow,doy){var// first-week day -- which january is always in the first week (4 for iso, 1 for other)
fwd=7+dow-doy,// first-week day local weekday -- which local weekday is fwd
fwdlw=(7+createUTCDate(year,0,fwd).getUTCDay()-dow)%7;return-fwdlw+fwd-1;}//http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function dayOfYearFromWeeks(year,week,weekday,dow,doy){var localWeekday=(7+weekday-dow)%7,weekOffset=firstWeekOffset(year,dow,doy),dayOfYear=1+7*(week-1)+localWeekday+weekOffset,resYear,resDayOfYear;if(dayOfYear<=0){resYear=year-1;resDayOfYear=daysInYear(resYear)+dayOfYear;}else if(dayOfYear>daysInYear(year)){resYear=year+1;resDayOfYear=dayOfYear-daysInYear(year);}else{resYear=year;resDayOfYear=dayOfYear;}return{year:resYear,dayOfYear:resDayOfYear};}function weekOfYear(mom,dow,doy){var weekOffset=firstWeekOffset(mom.year(),dow,doy),week=Math.floor((mom.dayOfYear()-weekOffset-1)/7)+1,resWeek,resYear;if(week<1){resYear=mom.year()-1;resWeek=week+weeksInYear(resYear,dow,doy);}else if(week>weeksInYear(mom.year(),dow,doy)){resWeek=week-weeksInYear(mom.year(),dow,doy);resYear=mom.year()+1;}else{resYear=mom.year();resWeek=week;}return{week:resWeek,year:resYear};}function weeksInYear(year,dow,doy){var weekOffset=firstWeekOffset(year,dow,doy),weekOffsetNext=firstWeekOffset(year+1,dow,doy);return(daysInYear(year)-weekOffset+weekOffsetNext)/7;}// FORMATTING
addFormatToken('w',['ww',2],'wo','week');addFormatToken('W',['WW',2],'Wo','isoWeek');// ALIASES
addUnitAlias('week','w');addUnitAlias('isoWeek','W');// PRIORITIES
addUnitPriority('week',5);addUnitPriority('isoWeek',5);// PARSING
addRegexToken('w',match1to2);addRegexToken('ww',match1to2,match2);addRegexToken('W',match1to2);addRegexToken('WW',match1to2,match2);addWeekParseToken(['w','ww','W','WW'],function(input,week,config,token){week[token.substr(0,1)]=toInt(input);});// HELPERS
// LOCALES
function localeWeek(mom){return weekOfYear(mom,this._week.dow,this._week.doy).week;}var defaultLocaleWeek={dow:0,// Sunday is the first day of the week.
doy:6// The week that contains Jan 1st is the first week of the year.
};function localeFirstDayOfWeek(){return this._week.dow;}function localeFirstDayOfYear(){return this._week.doy;}// MOMENTS
function getSetWeek(input){var week=this.localeData().week(this);return input==null?week:this.add((input-week)*7,'d');}function getSetISOWeek(input){var week=weekOfYear(this,1,4).week;return input==null?week:this.add((input-week)*7,'d');}// FORMATTING
addFormatToken('d',0,'do','day');addFormatToken('dd',0,0,function(format){return this.localeData().weekdaysMin(this,format);});addFormatToken('ddd',0,0,function(format){return this.localeData().weekdaysShort(this,format);});addFormatToken('dddd',0,0,function(format){return this.localeData().weekdays(this,format);});addFormatToken('e',0,0,'weekday');addFormatToken('E',0,0,'isoWeekday');// ALIASES
addUnitAlias('day','d');addUnitAlias('weekday','e');addUnitAlias('isoWeekday','E');// PRIORITY
addUnitPriority('day',11);addUnitPriority('weekday',11);addUnitPriority('isoWeekday',11);// PARSING
addRegexToken('d',match1to2);addRegexToken('e',match1to2);addRegexToken('E',match1to2);addRegexToken('dd',function(isStrict,locale){return locale.weekdaysMinRegex(isStrict);});addRegexToken('ddd',function(isStrict,locale){return locale.weekdaysShortRegex(isStrict);});addRegexToken('dddd',function(isStrict,locale){return locale.weekdaysRegex(isStrict);});addWeekParseToken(['dd','ddd','dddd'],function(input,week,config,token){var weekday=config._locale.weekdaysParse(input,token,config._strict);// if we didn't get a weekday name, mark the date as invalid
if(weekday!=null){week.d=weekday;}else{getParsingFlags(config).invalidWeekday=input;}});addWeekParseToken(['d','e','E'],function(input,week,config,token){week[token]=toInt(input);});// HELPERS
function parseWeekday(input,locale){if(typeof input!=='string'){return input;}if(!isNaN(input)){return parseInt(input,10);}input=locale.weekdaysParse(input);if(typeof input==='number'){return input;}return null;}function parseIsoWeekday(input,locale){if(typeof input==='string'){return locale.weekdaysParse(input)%7||7;}return isNaN(input)?null:input;}// LOCALES
var defaultLocaleWeekdays='Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');function localeWeekdays(m,format){if(!m){return this._weekdays;}return isArray(this._weekdays)?this._weekdays[m.day()]:this._weekdays[this._weekdays.isFormat.test(format)?'format':'standalone'][m.day()];}var defaultLocaleWeekdaysShort='Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');function localeWeekdaysShort(m){return m?this._weekdaysShort[m.day()]:this._weekdaysShort;}var defaultLocaleWeekdaysMin='Su_Mo_Tu_We_Th_Fr_Sa'.split('_');function localeWeekdaysMin(m){return m?this._weekdaysMin[m.day()]:this._weekdaysMin;}function day_of_week__handleStrictParse(weekdayName,format,strict){var i,ii,mom,llc=weekdayName.toLocaleLowerCase();if(!this._weekdaysParse){this._weekdaysParse=[];this._shortWeekdaysParse=[];this._minWeekdaysParse=[];for(i=0;i<7;++i){mom=create_utc__createUTC([2000,1]).day(i);this._minWeekdaysParse[i]=this.weekdaysMin(mom,'').toLocaleLowerCase();this._shortWeekdaysParse[i]=this.weekdaysShort(mom,'').toLocaleLowerCase();this._weekdaysParse[i]=this.weekdays(mom,'').toLocaleLowerCase();}}if(strict){if(format==='dddd'){ii=indexOf.call(this._weekdaysParse,llc);return ii!==-1?ii:null;}else if(format==='ddd'){ii=indexOf.call(this._shortWeekdaysParse,llc);return ii!==-1?ii:null;}else{ii=indexOf.call(this._minWeekdaysParse,llc);return ii!==-1?ii:null;}}else{if(format==='dddd'){ii=indexOf.call(this._weekdaysParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._shortWeekdaysParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._minWeekdaysParse,llc);return ii!==-1?ii:null;}else if(format==='ddd'){ii=indexOf.call(this._shortWeekdaysParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._weekdaysParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._minWeekdaysParse,llc);return ii!==-1?ii:null;}else{ii=indexOf.call(this._minWeekdaysParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._weekdaysParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._shortWeekdaysParse,llc);return ii!==-1?ii:null;}}}function localeWeekdaysParse(weekdayName,format,strict){var i,mom,regex;if(this._weekdaysParseExact){return day_of_week__handleStrictParse.call(this,weekdayName,format,strict);}if(!this._weekdaysParse){this._weekdaysParse=[];this._minWeekdaysParse=[];this._shortWeekdaysParse=[];this._fullWeekdaysParse=[];}for(i=0;i<7;i++){// make the regex if we don't have it already
mom=create_utc__createUTC([2000,1]).day(i);if(strict&&!this._fullWeekdaysParse[i]){this._fullWeekdaysParse[i]=new RegExp('^'+this.weekdays(mom,'').replace('.','\.?')+'$','i');this._shortWeekdaysParse[i]=new RegExp('^'+this.weekdaysShort(mom,'').replace('.','\.?')+'$','i');this._minWeekdaysParse[i]=new RegExp('^'+this.weekdaysMin(mom,'').replace('.','\.?')+'$','i');}if(!this._weekdaysParse[i]){regex='^'+this.weekdays(mom,'')+'|^'+this.weekdaysShort(mom,'')+'|^'+this.weekdaysMin(mom,'');this._weekdaysParse[i]=new RegExp(regex.replace('.',''),'i');}// test the regex
if(strict&&format==='dddd'&&this._fullWeekdaysParse[i].test(weekdayName)){return i;}else if(strict&&format==='ddd'&&this._shortWeekdaysParse[i].test(weekdayName)){return i;}else if(strict&&format==='dd'&&this._minWeekdaysParse[i].test(weekdayName)){return i;}else if(!strict&&this._weekdaysParse[i].test(weekdayName)){return i;}}}// MOMENTS
function getSetDayOfWeek(input){if(!this.isValid()){return input!=null?this:NaN;}var day=this._isUTC?this._d.getUTCDay():this._d.getDay();if(input!=null){input=parseWeekday(input,this.localeData());return this.add(input-day,'d');}else{return day;}}function getSetLocaleDayOfWeek(input){if(!this.isValid()){return input!=null?this:NaN;}var weekday=(this.day()+7-this.localeData()._week.dow)%7;return input==null?weekday:this.add(input-weekday,'d');}function getSetISODayOfWeek(input){if(!this.isValid()){return input!=null?this:NaN;}// behaves the same as moment#day except
// as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
// as a setter, sunday should belong to the previous week.
if(input!=null){var weekday=parseIsoWeekday(input,this.localeData());return this.day(this.day()%7?weekday:weekday-7);}else{return this.day()||7;}}var defaultWeekdaysRegex=matchWord;function weekdaysRegex(isStrict){if(this._weekdaysParseExact){if(!hasOwnProp(this,'_weekdaysRegex')){computeWeekdaysParse.call(this);}if(isStrict){return this._weekdaysStrictRegex;}else{return this._weekdaysRegex;}}else{if(!hasOwnProp(this,'_weekdaysRegex')){this._weekdaysRegex=defaultWeekdaysRegex;}return this._weekdaysStrictRegex&&isStrict?this._weekdaysStrictRegex:this._weekdaysRegex;}}var defaultWeekdaysShortRegex=matchWord;function weekdaysShortRegex(isStrict){if(this._weekdaysParseExact){if(!hasOwnProp(this,'_weekdaysRegex')){computeWeekdaysParse.call(this);}if(isStrict){return this._weekdaysShortStrictRegex;}else{return this._weekdaysShortRegex;}}else{if(!hasOwnProp(this,'_weekdaysShortRegex')){this._weekdaysShortRegex=defaultWeekdaysShortRegex;}return this._weekdaysShortStrictRegex&&isStrict?this._weekdaysShortStrictRegex:this._weekdaysShortRegex;}}var defaultWeekdaysMinRegex=matchWord;function weekdaysMinRegex(isStrict){if(this._weekdaysParseExact){if(!hasOwnProp(this,'_weekdaysRegex')){computeWeekdaysParse.call(this);}if(isStrict){return this._weekdaysMinStrictRegex;}else{return this._weekdaysMinRegex;}}else{if(!hasOwnProp(this,'_weekdaysMinRegex')){this._weekdaysMinRegex=defaultWeekdaysMinRegex;}return this._weekdaysMinStrictRegex&&isStrict?this._weekdaysMinStrictRegex:this._weekdaysMinRegex;}}function computeWeekdaysParse(){function cmpLenRev(a,b){return b.length-a.length;}var minPieces=[],shortPieces=[],longPieces=[],mixedPieces=[],i,mom,minp,shortp,longp;for(i=0;i<7;i++){// make the regex if we don't have it already
mom=create_utc__createUTC([2000,1]).day(i);minp=this.weekdaysMin(mom,'');shortp=this.weekdaysShort(mom,'');longp=this.weekdays(mom,'');minPieces.push(minp);shortPieces.push(shortp);longPieces.push(longp);mixedPieces.push(minp);mixedPieces.push(shortp);mixedPieces.push(longp);}// Sorting makes sure if one weekday (or abbr) is a prefix of another it
// will match the longer piece.
minPieces.sort(cmpLenRev);shortPieces.sort(cmpLenRev);longPieces.sort(cmpLenRev);mixedPieces.sort(cmpLenRev);for(i=0;i<7;i++){shortPieces[i]=regexEscape(shortPieces[i]);longPieces[i]=regexEscape(longPieces[i]);mixedPieces[i]=regexEscape(mixedPieces[i]);}this._weekdaysRegex=new RegExp('^('+mixedPieces.join('|')+')','i');this._weekdaysShortRegex=this._weekdaysRegex;this._weekdaysMinRegex=this._weekdaysRegex;this._weekdaysStrictRegex=new RegExp('^('+longPieces.join('|')+')','i');this._weekdaysShortStrictRegex=new RegExp('^('+shortPieces.join('|')+')','i');this._weekdaysMinStrictRegex=new RegExp('^('+minPieces.join('|')+')','i');}// FORMATTING
function hFormat(){return this.hours()%12||12;}function kFormat(){return this.hours()||24;}addFormatToken('H',['HH',2],0,'hour');addFormatToken('h',['hh',2],0,hFormat);addFormatToken('k',['kk',2],0,kFormat);addFormatToken('hmm',0,0,function(){return''+hFormat.apply(this)+zeroFill(this.minutes(),2);});addFormatToken('hmmss',0,0,function(){return''+hFormat.apply(this)+zeroFill(this.minutes(),2)+zeroFill(this.seconds(),2);});addFormatToken('Hmm',0,0,function(){return''+this.hours()+zeroFill(this.minutes(),2);});addFormatToken('Hmmss',0,0,function(){return''+this.hours()+zeroFill(this.minutes(),2)+zeroFill(this.seconds(),2);});function meridiem(token,lowercase){addFormatToken(token,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),lowercase);});}meridiem('a',true);meridiem('A',false);// ALIASES
addUnitAlias('hour','h');// PRIORITY
addUnitPriority('hour',13);// PARSING
function matchMeridiem(isStrict,locale){return locale._meridiemParse;}addRegexToken('a',matchMeridiem);addRegexToken('A',matchMeridiem);addRegexToken('H',match1to2);addRegexToken('h',match1to2);addRegexToken('HH',match1to2,match2);addRegexToken('hh',match1to2,match2);addRegexToken('hmm',match3to4);addRegexToken('hmmss',match5to6);addRegexToken('Hmm',match3to4);addRegexToken('Hmmss',match5to6);addParseToken(['H','HH'],HOUR);addParseToken(['a','A'],function(input,array,config){config._isPm=config._locale.isPM(input);config._meridiem=input;});addParseToken(['h','hh'],function(input,array,config){array[HOUR]=toInt(input);getParsingFlags(config).bigHour=true;});addParseToken('hmm',function(input,array,config){var pos=input.length-2;array[HOUR]=toInt(input.substr(0,pos));array[MINUTE]=toInt(input.substr(pos));getParsingFlags(config).bigHour=true;});addParseToken('hmmss',function(input,array,config){var pos1=input.length-4;var pos2=input.length-2;array[HOUR]=toInt(input.substr(0,pos1));array[MINUTE]=toInt(input.substr(pos1,2));array[SECOND]=toInt(input.substr(pos2));getParsingFlags(config).bigHour=true;});addParseToken('Hmm',function(input,array,config){var pos=input.length-2;array[HOUR]=toInt(input.substr(0,pos));array[MINUTE]=toInt(input.substr(pos));});addParseToken('Hmmss',function(input,array,config){var pos1=input.length-4;var pos2=input.length-2;array[HOUR]=toInt(input.substr(0,pos1));array[MINUTE]=toInt(input.substr(pos1,2));array[SECOND]=toInt(input.substr(pos2));});// LOCALES
function localeIsPM(input){// IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
// Using charAt should be more compatible.
return(input+'').toLowerCase().charAt(0)==='p';}var defaultLocaleMeridiemParse=/[ap]\.?m?\.?/i;function localeMeridiem(hours,minutes,isLower){if(hours>11){return isLower?'pm':'PM';}else{return isLower?'am':'AM';}}// MOMENTS
// Setting the hour should keep the time, because the user explicitly
// specified which hour he wants. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
var getSetHour=makeGetSet('Hours',true);var baseConfig={calendar:defaultCalendar,longDateFormat:defaultLongDateFormat,invalidDate:defaultInvalidDate,ordinal:defaultOrdinal,ordinalParse:defaultOrdinalParse,relativeTime:defaultRelativeTime,months:defaultLocaleMonths,monthsShort:defaultLocaleMonthsShort,week:defaultLocaleWeek,weekdays:defaultLocaleWeekdays,weekdaysMin:defaultLocaleWeekdaysMin,weekdaysShort:defaultLocaleWeekdaysShort,meridiemParse:defaultLocaleMeridiemParse};// internal storage for locale config files
var locales={};var globalLocale;function normalizeLocale(key){return key?key.toLowerCase().replace('_','-'):key;}// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names){var i=0,j,next,locale,split;while(i<names.length){split=normalizeLocale(names[i]).split('-');j=split.length;next=normalizeLocale(names[i+1]);next=next?next.split('-'):null;while(j>0){locale=loadLocale(split.slice(0,j).join('-'));if(locale){return locale;}if(next&&next.length>=j&&compareArrays(split,next,true)>=j-1){//the next array item is better than a shallower substring of this one
break;}j--;}i++;}return null;}function loadLocale(name){var oldLocale=null;// TODO: Find a better way to register and load all the locales in Node
if(!locales[name]&&typeof module!=='undefined'&&module&&module.exports){try{oldLocale=globalLocale._abbr;require('./locale/'+name);// because defineLocale currently also sets the global locale, we
// want to undo that for lazy loaded locales
locale_locales__getSetGlobalLocale(oldLocale);}catch(e){}}return locales[name];}// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function locale_locales__getSetGlobalLocale(key,values){var data;if(key){if(isUndefined(values)){data=locale_locales__getLocale(key);}else{data=defineLocale(key,values);}if(data){// moment.duration._locale = moment._locale = data;
globalLocale=data;}}return globalLocale._abbr;}function defineLocale(name,config){if(config!==null){var parentConfig=baseConfig;config.abbr=name;if(locales[name]!=null){deprecateSimple('defineLocaleOverride','use moment.updateLocale(localeName, config) to change '+'an existing locale. moment.defineLocale(localeName, '+'config) should only be used for creating a new locale '+'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');parentConfig=locales[name]._config;}else if(config.parentLocale!=null){if(locales[config.parentLocale]!=null){parentConfig=locales[config.parentLocale]._config;}else{// treat as if there is no base config
deprecateSimple('parentLocaleUndefined','specified parentLocale is not defined yet. See http://momentjs.com/guides/#/warnings/parent-locale/');}}locales[name]=new Locale(mergeConfigs(parentConfig,config));// backwards compat for now: also set the locale
locale_locales__getSetGlobalLocale(name);return locales[name];}else{// useful for testing
delete locales[name];return null;}}function updateLocale(name,config){if(config!=null){var locale,parentConfig=baseConfig;// MERGE
if(locales[name]!=null){parentConfig=locales[name]._config;}config=mergeConfigs(parentConfig,config);locale=new Locale(config);locale.parentLocale=locales[name];locales[name]=locale;// backwards compat for now: also set the locale
locale_locales__getSetGlobalLocale(name);}else{// pass null for config to unupdate, useful for tests
if(locales[name]!=null){if(locales[name].parentLocale!=null){locales[name]=locales[name].parentLocale;}else if(locales[name]!=null){delete locales[name];}}}return locales[name];}// returns locale data
function locale_locales__getLocale(key){var locale;if(key&&key._locale&&key._locale._abbr){key=key._locale._abbr;}if(!key){return globalLocale;}if(!isArray(key)){//short-circuit everything else
locale=loadLocale(key);if(locale){return locale;}key=[key];}return chooseLocale(key);}function locale_locales__listLocales(){return keys(locales);}function checkOverflow(m){var overflow;var a=m._a;if(a&&getParsingFlags(m).overflow===-2){overflow=a[MONTH]<0||a[MONTH]>11?MONTH:a[DATE]<1||a[DATE]>daysInMonth(a[YEAR],a[MONTH])?DATE:a[HOUR]<0||a[HOUR]>24||a[HOUR]===24&&(a[MINUTE]!==0||a[SECOND]!==0||a[MILLISECOND]!==0)?HOUR:a[MINUTE]<0||a[MINUTE]>59?MINUTE:a[SECOND]<0||a[SECOND]>59?SECOND:a[MILLISECOND]<0||a[MILLISECOND]>999?MILLISECOND:-1;if(getParsingFlags(m)._overflowDayOfYear&&(overflow<YEAR||overflow>DATE)){overflow=DATE;}if(getParsingFlags(m)._overflowWeeks&&overflow===-1){overflow=WEEK;}if(getParsingFlags(m)._overflowWeekday&&overflow===-1){overflow=WEEKDAY;}getParsingFlags(m).overflow=overflow;}return m;}// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;var basicIsoRegex=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;var tzRegex=/Z|[+-]\d\d(?::?\d\d)?/;var isoDates=[['YYYYYY-MM-DD',/[+-]\d{6}-\d\d-\d\d/],['YYYY-MM-DD',/\d{4}-\d\d-\d\d/],['GGGG-[W]WW-E',/\d{4}-W\d\d-\d/],['GGGG-[W]WW',/\d{4}-W\d\d/,false],['YYYY-DDD',/\d{4}-\d{3}/],['YYYY-MM',/\d{4}-\d\d/,false],['YYYYYYMMDD',/[+-]\d{10}/],['YYYYMMDD',/\d{8}/],// YYYYMM is NOT allowed by the standard
['GGGG[W]WWE',/\d{4}W\d{3}/],['GGGG[W]WW',/\d{4}W\d{2}/,false],['YYYYDDD',/\d{7}/]];// iso time formats and regexes
var isoTimes=[['HH:mm:ss.SSSS',/\d\d:\d\d:\d\d\.\d+/],['HH:mm:ss,SSSS',/\d\d:\d\d:\d\d,\d+/],['HH:mm:ss',/\d\d:\d\d:\d\d/],['HH:mm',/\d\d:\d\d/],['HHmmss.SSSS',/\d\d\d\d\d\d\.\d+/],['HHmmss,SSSS',/\d\d\d\d\d\d,\d+/],['HHmmss',/\d\d\d\d\d\d/],['HHmm',/\d\d\d\d/],['HH',/\d\d/]];var aspNetJsonRegex=/^\/?Date\((\-?\d+)/i;// date from iso format
function configFromISO(config){var i,l,string=config._i,match=extendedIsoRegex.exec(string)||basicIsoRegex.exec(string),allowTime,dateFormat,timeFormat,tzFormat;if(match){getParsingFlags(config).iso=true;for(i=0,l=isoDates.length;i<l;i++){if(isoDates[i][1].exec(match[1])){dateFormat=isoDates[i][0];allowTime=isoDates[i][2]!==false;break;}}if(dateFormat==null){config._isValid=false;return;}if(match[3]){for(i=0,l=isoTimes.length;i<l;i++){if(isoTimes[i][1].exec(match[3])){// match[2] should be 'T' or space
timeFormat=(match[2]||' ')+isoTimes[i][0];break;}}if(timeFormat==null){config._isValid=false;return;}}if(!allowTime&&timeFormat!=null){config._isValid=false;return;}if(match[4]){if(tzRegex.exec(match[4])){tzFormat='Z';}else{config._isValid=false;return;}}config._f=dateFormat+(timeFormat||'')+(tzFormat||'');configFromStringAndFormat(config);}else{config._isValid=false;}}// date from iso format or fallback
function configFromString(config){var matched=aspNetJsonRegex.exec(config._i);if(matched!==null){config._d=new Date(+matched[1]);return;}configFromISO(config);if(config._isValid===false){delete config._isValid;utils_hooks__hooks.createFromInputFallback(config);}}utils_hooks__hooks.createFromInputFallback=deprecate('value provided is not in a recognized ISO format. moment construction falls back to js Date(), '+'which is not reliable across all browsers and versions. Non ISO date formats are '+'discouraged and will be removed in an upcoming major release. Please refer to '+'http://momentjs.com/guides/#/warnings/js-date/ for more info.',function(config){config._d=new Date(config._i+(config._useUTC?' UTC':''));});// Pick the first defined of two or three arguments.
function defaults(a,b,c){if(a!=null){return a;}if(b!=null){return b;}return c;}function currentDateArray(config){// hooks is actually the exported moment object
var nowValue=new Date(utils_hooks__hooks.now());if(config._useUTC){return[nowValue.getUTCFullYear(),nowValue.getUTCMonth(),nowValue.getUTCDate()];}return[nowValue.getFullYear(),nowValue.getMonth(),nowValue.getDate()];}// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function configFromArray(config){var i,date,input=[],currentDate,yearToUse;if(config._d){return;}currentDate=currentDateArray(config);//compute day of the year from weeks and weekdays
if(config._w&&config._a[DATE]==null&&config._a[MONTH]==null){dayOfYearFromWeekInfo(config);}//if the day of the year is set, figure out what it is
if(config._dayOfYear){yearToUse=defaults(config._a[YEAR],currentDate[YEAR]);if(config._dayOfYear>daysInYear(yearToUse)){getParsingFlags(config)._overflowDayOfYear=true;}date=createUTCDate(yearToUse,0,config._dayOfYear);config._a[MONTH]=date.getUTCMonth();config._a[DATE]=date.getUTCDate();}// Default to current date.
// * if no year, month, day of month are given, default to today
// * if day of month is given, default month and year
// * if month is given, default only year
// * if year is given, don't default anything
for(i=0;i<3&&config._a[i]==null;++i){config._a[i]=input[i]=currentDate[i];}// Zero out whatever was not defaulted, including time
for(;i<7;i++){config._a[i]=input[i]=config._a[i]==null?i===2?1:0:config._a[i];}// Check for 24:00:00.000
if(config._a[HOUR]===24&&config._a[MINUTE]===0&&config._a[SECOND]===0&&config._a[MILLISECOND]===0){config._nextDay=true;config._a[HOUR]=0;}config._d=(config._useUTC?createUTCDate:createDate).apply(null,input);// Apply timezone offset from input. The actual utcOffset can be changed
// with parseZone.
if(config._tzm!=null){config._d.setUTCMinutes(config._d.getUTCMinutes()-config._tzm);}if(config._nextDay){config._a[HOUR]=24;}}function dayOfYearFromWeekInfo(config){var w,weekYear,week,weekday,dow,doy,temp,weekdayOverflow;w=config._w;if(w.GG!=null||w.W!=null||w.E!=null){dow=1;doy=4;// TODO: We need to take the current isoWeekYear, but that depends on
// how we interpret now (local, utc, fixed offset). So create
// a now version of current config (take local/utc/offset flags, and
// create now).
weekYear=defaults(w.GG,config._a[YEAR],weekOfYear(local__createLocal(),1,4).year);week=defaults(w.W,1);weekday=defaults(w.E,1);if(weekday<1||weekday>7){weekdayOverflow=true;}}else{dow=config._locale._week.dow;doy=config._locale._week.doy;weekYear=defaults(w.gg,config._a[YEAR],weekOfYear(local__createLocal(),dow,doy).year);week=defaults(w.w,1);if(w.d!=null){// weekday -- low day numbers are considered next week
weekday=w.d;if(weekday<0||weekday>6){weekdayOverflow=true;}}else if(w.e!=null){// local weekday -- counting starts from begining of week
weekday=w.e+dow;if(w.e<0||w.e>6){weekdayOverflow=true;}}else{// default to begining of week
weekday=dow;}}if(week<1||week>weeksInYear(weekYear,dow,doy)){getParsingFlags(config)._overflowWeeks=true;}else if(weekdayOverflow!=null){getParsingFlags(config)._overflowWeekday=true;}else{temp=dayOfYearFromWeeks(weekYear,week,weekday,dow,doy);config._a[YEAR]=temp.year;config._dayOfYear=temp.dayOfYear;}}// constant that refers to the ISO standard
utils_hooks__hooks.ISO_8601=function(){};// date from string and format string
function configFromStringAndFormat(config){// TODO: Move this to another part of the creation flow to prevent circular deps
if(config._f===utils_hooks__hooks.ISO_8601){configFromISO(config);return;}config._a=[];getParsingFlags(config).empty=true;// This array is used to make a Date, either with `new Date` or `Date.UTC`
var string=''+config._i,i,parsedInput,tokens,token,skipped,stringLength=string.length,totalParsedInputLength=0;tokens=expandFormat(config._f,config._locale).match(formattingTokens)||[];for(i=0;i<tokens.length;i++){token=tokens[i];parsedInput=(string.match(getParseRegexForToken(token,config))||[])[0];// console.log('token', token, 'parsedInput', parsedInput,
//         'regex', getParseRegexForToken(token, config));
if(parsedInput){skipped=string.substr(0,string.indexOf(parsedInput));if(skipped.length>0){getParsingFlags(config).unusedInput.push(skipped);}string=string.slice(string.indexOf(parsedInput)+parsedInput.length);totalParsedInputLength+=parsedInput.length;}// don't parse if it's not a known token
if(formatTokenFunctions[token]){if(parsedInput){getParsingFlags(config).empty=false;}else{getParsingFlags(config).unusedTokens.push(token);}addTimeToArrayFromToken(token,parsedInput,config);}else if(config._strict&&!parsedInput){getParsingFlags(config).unusedTokens.push(token);}}// add remaining unparsed input length to the string
getParsingFlags(config).charsLeftOver=stringLength-totalParsedInputLength;if(string.length>0){getParsingFlags(config).unusedInput.push(string);}// clear _12h flag if hour is <= 12
if(config._a[HOUR]<=12&&getParsingFlags(config).bigHour===true&&config._a[HOUR]>0){getParsingFlags(config).bigHour=undefined;}getParsingFlags(config).parsedDateParts=config._a.slice(0);getParsingFlags(config).meridiem=config._meridiem;// handle meridiem
config._a[HOUR]=meridiemFixWrap(config._locale,config._a[HOUR],config._meridiem);configFromArray(config);checkOverflow(config);}function meridiemFixWrap(locale,hour,meridiem){var isPm;if(meridiem==null){// nothing to do
return hour;}if(locale.meridiemHour!=null){return locale.meridiemHour(hour,meridiem);}else if(locale.isPM!=null){// Fallback
isPm=locale.isPM(meridiem);if(isPm&&hour<12){hour+=12;}if(!isPm&&hour===12){hour=0;}return hour;}else{// this is not supposed to happen
return hour;}}// date from string and array of format strings
function configFromStringAndArray(config){var tempConfig,bestMoment,scoreToBeat,i,currentScore;if(config._f.length===0){getParsingFlags(config).invalidFormat=true;config._d=new Date(NaN);return;}for(i=0;i<config._f.length;i++){currentScore=0;tempConfig=copyConfig({},config);if(config._useUTC!=null){tempConfig._useUTC=config._useUTC;}tempConfig._f=config._f[i];configFromStringAndFormat(tempConfig);if(!valid__isValid(tempConfig)){continue;}// if there is any input that was not parsed add a penalty for that format
currentScore+=getParsingFlags(tempConfig).charsLeftOver;//or tokens
currentScore+=getParsingFlags(tempConfig).unusedTokens.length*10;getParsingFlags(tempConfig).score=currentScore;if(scoreToBeat==null||currentScore<scoreToBeat){scoreToBeat=currentScore;bestMoment=tempConfig;}}extend(config,bestMoment||tempConfig);}function configFromObject(config){if(config._d){return;}var i=normalizeObjectUnits(config._i);config._a=map([i.year,i.month,i.day||i.date,i.hour,i.minute,i.second,i.millisecond],function(obj){return obj&&parseInt(obj,10);});configFromArray(config);}function createFromConfig(config){var res=new Moment(checkOverflow(prepareConfig(config)));if(res._nextDay){// Adding is smart enough around DST
res.add(1,'d');res._nextDay=undefined;}return res;}function prepareConfig(config){var input=config._i,format=config._f;config._locale=config._locale||locale_locales__getLocale(config._l);if(input===null||format===undefined&&input===''){return valid__createInvalid({nullInput:true});}if(typeof input==='string'){config._i=input=config._locale.preparse(input);}if(isMoment(input)){return new Moment(checkOverflow(input));}else if(isArray(format)){configFromStringAndArray(config);}else if(isDate(input)){config._d=input;}else if(format){configFromStringAndFormat(config);}else{configFromInput(config);}if(!valid__isValid(config)){config._d=null;}return config;}function configFromInput(config){var input=config._i;if(input===undefined){config._d=new Date(utils_hooks__hooks.now());}else if(isDate(input)){config._d=new Date(input.valueOf());}else if(typeof input==='string'){configFromString(config);}else if(isArray(input)){config._a=map(input.slice(0),function(obj){return parseInt(obj,10);});configFromArray(config);}else if((typeof input==='undefined'?'undefined':_typeof(input))==='object'){configFromObject(config);}else if(typeof input==='number'){// from milliseconds
config._d=new Date(input);}else{utils_hooks__hooks.createFromInputFallback(config);}}function createLocalOrUTC(input,format,locale,strict,isUTC){var c={};if(typeof locale==='boolean'){strict=locale;locale=undefined;}if(isObject(input)&&isObjectEmpty(input)||isArray(input)&&input.length===0){input=undefined;}// object construction must be done this way.
// https://github.com/moment/moment/issues/1423
c._isAMomentObject=true;c._useUTC=c._isUTC=isUTC;c._l=locale;c._i=input;c._f=format;c._strict=strict;return createFromConfig(c);}function local__createLocal(input,format,locale,strict){return createLocalOrUTC(input,format,locale,strict,false);}var prototypeMin=deprecate('moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',function(){var other=local__createLocal.apply(null,arguments);if(this.isValid()&&other.isValid()){return other<this?this:other;}else{return valid__createInvalid();}});var prototypeMax=deprecate('moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',function(){var other=local__createLocal.apply(null,arguments);if(this.isValid()&&other.isValid()){return other>this?this:other;}else{return valid__createInvalid();}});// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function pickBy(fn,moments){var res,i;if(moments.length===1&&isArray(moments[0])){moments=moments[0];}if(!moments.length){return local__createLocal();}res=moments[0];for(i=1;i<moments.length;++i){if(!moments[i].isValid()||moments[i][fn](res)){res=moments[i];}}return res;}// TODO: Use [].sort instead?
function min(){var args=[].slice.call(arguments,0);return pickBy('isBefore',args);}function max(){var args=[].slice.call(arguments,0);return pickBy('isAfter',args);}var now=function now(){return Date.now?Date.now():+new Date();};function Duration(duration){var normalizedInput=normalizeObjectUnits(duration),years=normalizedInput.year||0,quarters=normalizedInput.quarter||0,months=normalizedInput.month||0,weeks=normalizedInput.week||0,days=normalizedInput.day||0,hours=normalizedInput.hour||0,minutes=normalizedInput.minute||0,seconds=normalizedInput.second||0,milliseconds=normalizedInput.millisecond||0;// representation for dateAddRemove
this._milliseconds=+milliseconds+seconds*1e3+// 1000
minutes*6e4+// 1000 * 60
hours*1000*60*60;//using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
// Because of dateAddRemove treats 24 hours as different from a
// day when working around DST, we need to store them separately
this._days=+days+weeks*7;// It is impossible translate months into days without knowing
// which months you are are talking about, so we have to store
// it separately.
this._months=+months+quarters*3+years*12;this._data={};this._locale=locale_locales__getLocale();this._bubble();}function isDuration(obj){return obj instanceof Duration;}function absRound(number){if(number<0){return Math.round(-1*number)*-1;}else{return Math.round(number);}}// FORMATTING
function offset(token,separator){addFormatToken(token,0,0,function(){var offset=this.utcOffset();var sign='+';if(offset<0){offset=-offset;sign='-';}return sign+zeroFill(~~(offset/60),2)+separator+zeroFill(~~offset%60,2);});}offset('Z',':');offset('ZZ','');// PARSING
addRegexToken('Z',matchShortOffset);addRegexToken('ZZ',matchShortOffset);addParseToken(['Z','ZZ'],function(input,array,config){config._useUTC=true;config._tzm=offsetFromString(matchShortOffset,input);});// HELPERS
// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var chunkOffset=/([\+\-]|\d\d)/gi;function offsetFromString(matcher,string){var matches=(string||'').match(matcher)||[];var chunk=matches[matches.length-1]||[];var parts=(chunk+'').match(chunkOffset)||['-',0,0];var minutes=+(parts[1]*60)+toInt(parts[2]);return parts[0]==='+'?minutes:-minutes;}// Return a moment from input, that is local/utc/zone equivalent to model.
function cloneWithOffset(input,model){var res,diff;if(model._isUTC){res=model.clone();diff=(isMoment(input)||isDate(input)?input.valueOf():local__createLocal(input).valueOf())-res.valueOf();// Use low-level api, because this fn is low-level api.
res._d.setTime(res._d.valueOf()+diff);utils_hooks__hooks.updateOffset(res,false);return res;}else{return local__createLocal(input).local();}}function getDateOffset(m){// On Firefox.24 Date#getTimezoneOffset returns a floating point.
// https://github.com/moment/moment/pull/1871
return-Math.round(m._d.getTimezoneOffset()/15)*15;}// HOOKS
// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
utils_hooks__hooks.updateOffset=function(){};// MOMENTS
// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function getSetOffset(input,keepLocalTime){var offset=this._offset||0,localAdjust;if(!this.isValid()){return input!=null?this:NaN;}if(input!=null){if(typeof input==='string'){input=offsetFromString(matchShortOffset,input);}else if(Math.abs(input)<16){input=input*60;}if(!this._isUTC&&keepLocalTime){localAdjust=getDateOffset(this);}this._offset=input;this._isUTC=true;if(localAdjust!=null){this.add(localAdjust,'m');}if(offset!==input){if(!keepLocalTime||this._changeInProgress){add_subtract__addSubtract(this,create__createDuration(input-offset,'m'),1,false);}else if(!this._changeInProgress){this._changeInProgress=true;utils_hooks__hooks.updateOffset(this,true);this._changeInProgress=null;}}return this;}else{return this._isUTC?offset:getDateOffset(this);}}function getSetZone(input,keepLocalTime){if(input!=null){if(typeof input!=='string'){input=-input;}this.utcOffset(input,keepLocalTime);return this;}else{return-this.utcOffset();}}function setOffsetToUTC(keepLocalTime){return this.utcOffset(0,keepLocalTime);}function setOffsetToLocal(keepLocalTime){if(this._isUTC){this.utcOffset(0,keepLocalTime);this._isUTC=false;if(keepLocalTime){this.subtract(getDateOffset(this),'m');}}return this;}function setOffsetToParsedOffset(){if(this._tzm){this.utcOffset(this._tzm);}else if(typeof this._i==='string'){var tZone=offsetFromString(matchOffset,this._i);if(tZone===0){this.utcOffset(0,true);}else{this.utcOffset(offsetFromString(matchOffset,this._i));}}return this;}function hasAlignedHourOffset(input){if(!this.isValid()){return false;}input=input?local__createLocal(input).utcOffset():0;return(this.utcOffset()-input)%60===0;}function isDaylightSavingTime(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset();}function isDaylightSavingTimeShifted(){if(!isUndefined(this._isDSTShifted)){return this._isDSTShifted;}var c={};copyConfig(c,this);c=prepareConfig(c);if(c._a){var other=c._isUTC?create_utc__createUTC(c._a):local__createLocal(c._a);this._isDSTShifted=this.isValid()&&compareArrays(c._a,other.toArray())>0;}else{this._isDSTShifted=false;}return this._isDSTShifted;}function isLocal(){return this.isValid()?!this._isUTC:false;}function isUtcOffset(){return this.isValid()?this._isUTC:false;}function isUtc(){return this.isValid()?this._isUTC&&this._offset===0:false;}// ASP.NET json date format regex
var aspNetRegex=/^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
var isoRegex=/^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;function create__createDuration(input,key){var duration=input,// matching against regexp is expensive, do it on demand
match=null,sign,ret,diffRes;if(isDuration(input)){duration={ms:input._milliseconds,d:input._days,M:input._months};}else if(typeof input==='number'){duration={};if(key){duration[key]=input;}else{duration.milliseconds=input;}}else if(!!(match=aspNetRegex.exec(input))){sign=match[1]==='-'?-1:1;duration={y:0,d:toInt(match[DATE])*sign,h:toInt(match[HOUR])*sign,m:toInt(match[MINUTE])*sign,s:toInt(match[SECOND])*sign,ms:toInt(absRound(match[MILLISECOND]*1000))*sign// the millisecond decimal point is included in the match
};}else if(!!(match=isoRegex.exec(input))){sign=match[1]==='-'?-1:1;duration={y:parseIso(match[2],sign),M:parseIso(match[3],sign),w:parseIso(match[4],sign),d:parseIso(match[5],sign),h:parseIso(match[6],sign),m:parseIso(match[7],sign),s:parseIso(match[8],sign)};}else if(duration==null){// checks for null or undefined
duration={};}else if((typeof duration==='undefined'?'undefined':_typeof(duration))==='object'&&('from'in duration||'to'in duration)){diffRes=momentsDifference(local__createLocal(duration.from),local__createLocal(duration.to));duration={};duration.ms=diffRes.milliseconds;duration.M=diffRes.months;}ret=new Duration(duration);if(isDuration(input)&&hasOwnProp(input,'_locale')){ret._locale=input._locale;}return ret;}create__createDuration.fn=Duration.prototype;function parseIso(inp,sign){// We'd normally use ~~inp for this, but unfortunately it also
// converts floats to ints.
// inp may be undefined, so careful calling replace on it.
var res=inp&&parseFloat(inp.replace(',','.'));// apply sign while we're at it
return(isNaN(res)?0:res)*sign;}function positiveMomentsDifference(base,other){var res={milliseconds:0,months:0};res.months=other.month()-base.month()+(other.year()-base.year())*12;if(base.clone().add(res.months,'M').isAfter(other)){--res.months;}res.milliseconds=+other-+base.clone().add(res.months,'M');return res;}function momentsDifference(base,other){var res;if(!(base.isValid()&&other.isValid())){return{milliseconds:0,months:0};}other=cloneWithOffset(other,base);if(base.isBefore(other)){res=positiveMomentsDifference(base,other);}else{res=positiveMomentsDifference(other,base);res.milliseconds=-res.milliseconds;res.months=-res.months;}return res;}// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction,name){return function(val,period){var dur,tmp;//invert the arguments, but complain about it
if(period!==null&&!isNaN(+period)){deprecateSimple(name,'moment().'+name+'(period, number) is deprecated. Please use moment().'+name+'(number, period). '+'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');tmp=val;val=period;period=tmp;}val=typeof val==='string'?+val:val;dur=create__createDuration(val,period);add_subtract__addSubtract(this,dur,direction);return this;};}function add_subtract__addSubtract(mom,duration,isAdding,updateOffset){var milliseconds=duration._milliseconds,days=absRound(duration._days),months=absRound(duration._months);if(!mom.isValid()){// No op
return;}updateOffset=updateOffset==null?true:updateOffset;if(milliseconds){mom._d.setTime(mom._d.valueOf()+milliseconds*isAdding);}if(days){get_set__set(mom,'Date',get_set__get(mom,'Date')+days*isAdding);}if(months){setMonth(mom,get_set__get(mom,'Month')+months*isAdding);}if(updateOffset){utils_hooks__hooks.updateOffset(mom,days||months);}}var add_subtract__add=createAdder(1,'add');var add_subtract__subtract=createAdder(-1,'subtract');function getCalendarFormat(myMoment,now){var diff=myMoment.diff(now,'days',true);return diff<-6?'sameElse':diff<-1?'lastWeek':diff<0?'lastDay':diff<1?'sameDay':diff<2?'nextDay':diff<7?'nextWeek':'sameElse';}function moment_calendar__calendar(time,formats){// We want to compare the start of today, vs this.
// Getting start-of-today depends on whether we're local/utc/offset or not.
var now=time||local__createLocal(),sod=cloneWithOffset(now,this).startOf('day'),format=utils_hooks__hooks.calendarFormat(this,sod)||'sameElse';var output=formats&&(isFunction(formats[format])?formats[format].call(this,now):formats[format]);return this.format(output||this.localeData().calendar(format,this,local__createLocal(now)));}function clone(){return new Moment(this);}function isAfter(input,units){var localInput=isMoment(input)?input:local__createLocal(input);if(!(this.isValid()&&localInput.isValid())){return false;}units=normalizeUnits(!isUndefined(units)?units:'millisecond');if(units==='millisecond'){return this.valueOf()>localInput.valueOf();}else{return localInput.valueOf()<this.clone().startOf(units).valueOf();}}function isBefore(input,units){var localInput=isMoment(input)?input:local__createLocal(input);if(!(this.isValid()&&localInput.isValid())){return false;}units=normalizeUnits(!isUndefined(units)?units:'millisecond');if(units==='millisecond'){return this.valueOf()<localInput.valueOf();}else{return this.clone().endOf(units).valueOf()<localInput.valueOf();}}function isBetween(from,to,units,inclusivity){inclusivity=inclusivity||'()';return(inclusivity[0]==='('?this.isAfter(from,units):!this.isBefore(from,units))&&(inclusivity[1]===')'?this.isBefore(to,units):!this.isAfter(to,units));}function isSame(input,units){var localInput=isMoment(input)?input:local__createLocal(input),inputMs;if(!(this.isValid()&&localInput.isValid())){return false;}units=normalizeUnits(units||'millisecond');if(units==='millisecond'){return this.valueOf()===localInput.valueOf();}else{inputMs=localInput.valueOf();return this.clone().startOf(units).valueOf()<=inputMs&&inputMs<=this.clone().endOf(units).valueOf();}}function isSameOrAfter(input,units){return this.isSame(input,units)||this.isAfter(input,units);}function isSameOrBefore(input,units){return this.isSame(input,units)||this.isBefore(input,units);}function diff(input,units,asFloat){var that,zoneDelta,delta,output;if(!this.isValid()){return NaN;}that=cloneWithOffset(input,this);if(!that.isValid()){return NaN;}zoneDelta=(that.utcOffset()-this.utcOffset())*6e4;units=normalizeUnits(units);if(units==='year'||units==='month'||units==='quarter'){output=monthDiff(this,that);if(units==='quarter'){output=output/3;}else if(units==='year'){output=output/12;}}else{delta=this-that;output=units==='second'?delta/1e3:// 1000
units==='minute'?delta/6e4:// 1000 * 60
units==='hour'?delta/36e5:// 1000 * 60 * 60
units==='day'?(delta-zoneDelta)/864e5:// 1000 * 60 * 60 * 24, negate dst
units==='week'?(delta-zoneDelta)/6048e5:// 1000 * 60 * 60 * 24 * 7, negate dst
delta;}return asFloat?output:absFloor(output);}function monthDiff(a,b){// difference in months
var wholeMonthDiff=(b.year()-a.year())*12+(b.month()-a.month()),// b is in (anchor - 1 month, anchor + 1 month)
anchor=a.clone().add(wholeMonthDiff,'months'),anchor2,adjust;if(b-anchor<0){anchor2=a.clone().add(wholeMonthDiff-1,'months');// linear across the month
adjust=(b-anchor)/(anchor-anchor2);}else{anchor2=a.clone().add(wholeMonthDiff+1,'months');// linear across the month
adjust=(b-anchor)/(anchor2-anchor);}//check for negative zero, return zero if negative zero
return-(wholeMonthDiff+adjust)||0;}utils_hooks__hooks.defaultFormat='YYYY-MM-DDTHH:mm:ssZ';utils_hooks__hooks.defaultFormatUtc='YYYY-MM-DDTHH:mm:ss[Z]';function toString(){return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');}function moment_format__toISOString(){var m=this.clone().utc();if(0<m.year()&&m.year()<=9999){if(isFunction(Date.prototype.toISOString)){// native implementation is ~50x faster, use it when we can
return this.toDate().toISOString();}else{return formatMoment(m,'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');}}else{return formatMoment(m,'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');}}function format(inputString){if(!inputString){inputString=this.isUtc()?utils_hooks__hooks.defaultFormatUtc:utils_hooks__hooks.defaultFormat;}var output=formatMoment(this,inputString);return this.localeData().postformat(output);}function from(time,withoutSuffix){if(this.isValid()&&(isMoment(time)&&time.isValid()||local__createLocal(time).isValid())){return create__createDuration({to:this,from:time}).locale(this.locale()).humanize(!withoutSuffix);}else{return this.localeData().invalidDate();}}function fromNow(withoutSuffix){return this.from(local__createLocal(),withoutSuffix);}function to(time,withoutSuffix){if(this.isValid()&&(isMoment(time)&&time.isValid()||local__createLocal(time).isValid())){return create__createDuration({from:this,to:time}).locale(this.locale()).humanize(!withoutSuffix);}else{return this.localeData().invalidDate();}}function toNow(withoutSuffix){return this.to(local__createLocal(),withoutSuffix);}// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale(key){var newLocaleData;if(key===undefined){return this._locale._abbr;}else{newLocaleData=locale_locales__getLocale(key);if(newLocaleData!=null){this._locale=newLocaleData;}return this;}}var lang=deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',function(key){if(key===undefined){return this.localeData();}else{return this.locale(key);}});function localeData(){return this._locale;}function startOf(units){units=normalizeUnits(units);// the following switch intentionally omits break keywords
// to utilize falling through the cases.
switch(units){case'year':this.month(0);/* falls through */case'quarter':case'month':this.date(1);/* falls through */case'week':case'isoWeek':case'day':case'date':this.hours(0);/* falls through */case'hour':this.minutes(0);/* falls through */case'minute':this.seconds(0);/* falls through */case'second':this.milliseconds(0);}// weeks are a special case
if(units==='week'){this.weekday(0);}if(units==='isoWeek'){this.isoWeekday(1);}// quarters are also special
if(units==='quarter'){this.month(Math.floor(this.month()/3)*3);}return this;}function endOf(units){units=normalizeUnits(units);if(units===undefined||units==='millisecond'){return this;}// 'date' is an alias for 'day', so it should be considered as such.
if(units==='date'){units='day';}return this.startOf(units).add(1,units==='isoWeek'?'week':units).subtract(1,'ms');}function to_type__valueOf(){return this._d.valueOf()-(this._offset||0)*60000;}function unix(){return Math.floor(this.valueOf()/1000);}function toDate(){return new Date(this.valueOf());}function toArray(){var m=this;return[m.year(),m.month(),m.date(),m.hour(),m.minute(),m.second(),m.millisecond()];}function toObject(){var m=this;return{years:m.year(),months:m.month(),date:m.date(),hours:m.hours(),minutes:m.minutes(),seconds:m.seconds(),milliseconds:m.milliseconds()};}function toJSON(){// new Date(NaN).toJSON() === null
return this.isValid()?this.toISOString():null;}function moment_valid__isValid(){return valid__isValid(this);}function parsingFlags(){return extend({},getParsingFlags(this));}function invalidAt(){return getParsingFlags(this).overflow;}function creationData(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict};}// FORMATTING
addFormatToken(0,['gg',2],0,function(){return this.weekYear()%100;});addFormatToken(0,['GG',2],0,function(){return this.isoWeekYear()%100;});function addWeekYearFormatToken(token,getter){addFormatToken(0,[token,token.length],0,getter);}addWeekYearFormatToken('gggg','weekYear');addWeekYearFormatToken('ggggg','weekYear');addWeekYearFormatToken('GGGG','isoWeekYear');addWeekYearFormatToken('GGGGG','isoWeekYear');// ALIASES
addUnitAlias('weekYear','gg');addUnitAlias('isoWeekYear','GG');// PRIORITY
addUnitPriority('weekYear',1);addUnitPriority('isoWeekYear',1);// PARSING
addRegexToken('G',matchSigned);addRegexToken('g',matchSigned);addRegexToken('GG',match1to2,match2);addRegexToken('gg',match1to2,match2);addRegexToken('GGGG',match1to4,match4);addRegexToken('gggg',match1to4,match4);addRegexToken('GGGGG',match1to6,match6);addRegexToken('ggggg',match1to6,match6);addWeekParseToken(['gggg','ggggg','GGGG','GGGGG'],function(input,week,config,token){week[token.substr(0,2)]=toInt(input);});addWeekParseToken(['gg','GG'],function(input,week,config,token){week[token]=utils_hooks__hooks.parseTwoDigitYear(input);});// MOMENTS
function getSetWeekYear(input){return getSetWeekYearHelper.call(this,input,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy);}function getSetISOWeekYear(input){return getSetWeekYearHelper.call(this,input,this.isoWeek(),this.isoWeekday(),1,4);}function getISOWeeksInYear(){return weeksInYear(this.year(),1,4);}function getWeeksInYear(){var weekInfo=this.localeData()._week;return weeksInYear(this.year(),weekInfo.dow,weekInfo.doy);}function getSetWeekYearHelper(input,week,weekday,dow,doy){var weeksTarget;if(input==null){return weekOfYear(this,dow,doy).year;}else{weeksTarget=weeksInYear(input,dow,doy);if(week>weeksTarget){week=weeksTarget;}return setWeekAll.call(this,input,week,weekday,dow,doy);}}function setWeekAll(weekYear,week,weekday,dow,doy){var dayOfYearData=dayOfYearFromWeeks(weekYear,week,weekday,dow,doy),date=createUTCDate(dayOfYearData.year,0,dayOfYearData.dayOfYear);this.year(date.getUTCFullYear());this.month(date.getUTCMonth());this.date(date.getUTCDate());return this;}// FORMATTING
addFormatToken('Q',0,'Qo','quarter');// ALIASES
addUnitAlias('quarter','Q');// PRIORITY
addUnitPriority('quarter',7);// PARSING
addRegexToken('Q',match1);addParseToken('Q',function(input,array){array[MONTH]=(toInt(input)-1)*3;});// MOMENTS
function getSetQuarter(input){return input==null?Math.ceil((this.month()+1)/3):this.month((input-1)*3+this.month()%3);}// FORMATTING
addFormatToken('D',['DD',2],'Do','date');// ALIASES
addUnitAlias('date','D');// PRIOROITY
addUnitPriority('date',9);// PARSING
addRegexToken('D',match1to2);addRegexToken('DD',match1to2,match2);addRegexToken('Do',function(isStrict,locale){return isStrict?locale._ordinalParse:locale._ordinalParseLenient;});addParseToken(['D','DD'],DATE);addParseToken('Do',function(input,array){array[DATE]=toInt(input.match(match1to2)[0],10);});// MOMENTS
var getSetDayOfMonth=makeGetSet('Date',true);// FORMATTING
addFormatToken('DDD',['DDDD',3],'DDDo','dayOfYear');// ALIASES
addUnitAlias('dayOfYear','DDD');// PRIORITY
addUnitPriority('dayOfYear',4);// PARSING
addRegexToken('DDD',match1to3);addRegexToken('DDDD',match3);addParseToken(['DDD','DDDD'],function(input,array,config){config._dayOfYear=toInt(input);});// HELPERS
// MOMENTS
function getSetDayOfYear(input){var dayOfYear=Math.round((this.clone().startOf('day')-this.clone().startOf('year'))/864e5)+1;return input==null?dayOfYear:this.add(input-dayOfYear,'d');}// FORMATTING
addFormatToken('m',['mm',2],0,'minute');// ALIASES
addUnitAlias('minute','m');// PRIORITY
addUnitPriority('minute',14);// PARSING
addRegexToken('m',match1to2);addRegexToken('mm',match1to2,match2);addParseToken(['m','mm'],MINUTE);// MOMENTS
var getSetMinute=makeGetSet('Minutes',false);// FORMATTING
addFormatToken('s',['ss',2],0,'second');// ALIASES
addUnitAlias('second','s');// PRIORITY
addUnitPriority('second',15);// PARSING
addRegexToken('s',match1to2);addRegexToken('ss',match1to2,match2);addParseToken(['s','ss'],SECOND);// MOMENTS
var getSetSecond=makeGetSet('Seconds',false);// FORMATTING
addFormatToken('S',0,0,function(){return~~(this.millisecond()/100);});addFormatToken(0,['SS',2],0,function(){return~~(this.millisecond()/10);});addFormatToken(0,['SSS',3],0,'millisecond');addFormatToken(0,['SSSS',4],0,function(){return this.millisecond()*10;});addFormatToken(0,['SSSSS',5],0,function(){return this.millisecond()*100;});addFormatToken(0,['SSSSSS',6],0,function(){return this.millisecond()*1000;});addFormatToken(0,['SSSSSSS',7],0,function(){return this.millisecond()*10000;});addFormatToken(0,['SSSSSSSS',8],0,function(){return this.millisecond()*100000;});addFormatToken(0,['SSSSSSSSS',9],0,function(){return this.millisecond()*1000000;});// ALIASES
addUnitAlias('millisecond','ms');// PRIORITY
addUnitPriority('millisecond',16);// PARSING
addRegexToken('S',match1to3,match1);addRegexToken('SS',match1to3,match2);addRegexToken('SSS',match1to3,match3);var token;for(token='SSSS';token.length<=9;token+='S'){addRegexToken(token,matchUnsigned);}function parseMs(input,array){array[MILLISECOND]=toInt(('0.'+input)*1000);}for(token='S';token.length<=9;token+='S'){addParseToken(token,parseMs);}// MOMENTS
var getSetMillisecond=makeGetSet('Milliseconds',false);// FORMATTING
addFormatToken('z',0,0,'zoneAbbr');addFormatToken('zz',0,0,'zoneName');// MOMENTS
function getZoneAbbr(){return this._isUTC?'UTC':'';}function getZoneName(){return this._isUTC?'Coordinated Universal Time':'';}var momentPrototype__proto=Moment.prototype;momentPrototype__proto.add=add_subtract__add;momentPrototype__proto.calendar=moment_calendar__calendar;momentPrototype__proto.clone=clone;momentPrototype__proto.diff=diff;momentPrototype__proto.endOf=endOf;momentPrototype__proto.format=format;momentPrototype__proto.from=from;momentPrototype__proto.fromNow=fromNow;momentPrototype__proto.to=to;momentPrototype__proto.toNow=toNow;momentPrototype__proto.get=stringGet;momentPrototype__proto.invalidAt=invalidAt;momentPrototype__proto.isAfter=isAfter;momentPrototype__proto.isBefore=isBefore;momentPrototype__proto.isBetween=isBetween;momentPrototype__proto.isSame=isSame;momentPrototype__proto.isSameOrAfter=isSameOrAfter;momentPrototype__proto.isSameOrBefore=isSameOrBefore;momentPrototype__proto.isValid=moment_valid__isValid;momentPrototype__proto.lang=lang;momentPrototype__proto.locale=locale;momentPrototype__proto.localeData=localeData;momentPrototype__proto.max=prototypeMax;momentPrototype__proto.min=prototypeMin;momentPrototype__proto.parsingFlags=parsingFlags;momentPrototype__proto.set=stringSet;momentPrototype__proto.startOf=startOf;momentPrototype__proto.subtract=add_subtract__subtract;momentPrototype__proto.toArray=toArray;momentPrototype__proto.toObject=toObject;momentPrototype__proto.toDate=toDate;momentPrototype__proto.toISOString=moment_format__toISOString;momentPrototype__proto.toJSON=toJSON;momentPrototype__proto.toString=toString;momentPrototype__proto.unix=unix;momentPrototype__proto.valueOf=to_type__valueOf;momentPrototype__proto.creationData=creationData;// Year
momentPrototype__proto.year=getSetYear;momentPrototype__proto.isLeapYear=getIsLeapYear;// Week Year
momentPrototype__proto.weekYear=getSetWeekYear;momentPrototype__proto.isoWeekYear=getSetISOWeekYear;// Quarter
momentPrototype__proto.quarter=momentPrototype__proto.quarters=getSetQuarter;// Month
momentPrototype__proto.month=getSetMonth;momentPrototype__proto.daysInMonth=getDaysInMonth;// Week
momentPrototype__proto.week=momentPrototype__proto.weeks=getSetWeek;momentPrototype__proto.isoWeek=momentPrototype__proto.isoWeeks=getSetISOWeek;momentPrototype__proto.weeksInYear=getWeeksInYear;momentPrototype__proto.isoWeeksInYear=getISOWeeksInYear;// Day
momentPrototype__proto.date=getSetDayOfMonth;momentPrototype__proto.day=momentPrototype__proto.days=getSetDayOfWeek;momentPrototype__proto.weekday=getSetLocaleDayOfWeek;momentPrototype__proto.isoWeekday=getSetISODayOfWeek;momentPrototype__proto.dayOfYear=getSetDayOfYear;// Hour
momentPrototype__proto.hour=momentPrototype__proto.hours=getSetHour;// Minute
momentPrototype__proto.minute=momentPrototype__proto.minutes=getSetMinute;// Second
momentPrototype__proto.second=momentPrototype__proto.seconds=getSetSecond;// Millisecond
momentPrototype__proto.millisecond=momentPrototype__proto.milliseconds=getSetMillisecond;// Offset
momentPrototype__proto.utcOffset=getSetOffset;momentPrototype__proto.utc=setOffsetToUTC;momentPrototype__proto.local=setOffsetToLocal;momentPrototype__proto.parseZone=setOffsetToParsedOffset;momentPrototype__proto.hasAlignedHourOffset=hasAlignedHourOffset;momentPrototype__proto.isDST=isDaylightSavingTime;momentPrototype__proto.isLocal=isLocal;momentPrototype__proto.isUtcOffset=isUtcOffset;momentPrototype__proto.isUtc=isUtc;momentPrototype__proto.isUTC=isUtc;// Timezone
momentPrototype__proto.zoneAbbr=getZoneAbbr;momentPrototype__proto.zoneName=getZoneName;// Deprecations
momentPrototype__proto.dates=deprecate('dates accessor is deprecated. Use date instead.',getSetDayOfMonth);momentPrototype__proto.months=deprecate('months accessor is deprecated. Use month instead',getSetMonth);momentPrototype__proto.years=deprecate('years accessor is deprecated. Use year instead',getSetYear);momentPrototype__proto.zone=deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',getSetZone);momentPrototype__proto.isDSTShifted=deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',isDaylightSavingTimeShifted);var momentPrototype=momentPrototype__proto;function moment__createUnix(input){return local__createLocal(input*1000);}function moment__createInZone(){return local__createLocal.apply(null,arguments).parseZone();}function preParsePostFormat(string){return string;}var prototype__proto=Locale.prototype;prototype__proto.calendar=locale_calendar__calendar;prototype__proto.longDateFormat=longDateFormat;prototype__proto.invalidDate=invalidDate;prototype__proto.ordinal=ordinal;prototype__proto.preparse=preParsePostFormat;prototype__proto.postformat=preParsePostFormat;prototype__proto.relativeTime=relative__relativeTime;prototype__proto.pastFuture=pastFuture;prototype__proto.set=locale_set__set;// Month
prototype__proto.months=localeMonths;prototype__proto.monthsShort=localeMonthsShort;prototype__proto.monthsParse=localeMonthsParse;prototype__proto.monthsRegex=monthsRegex;prototype__proto.monthsShortRegex=monthsShortRegex;// Week
prototype__proto.week=localeWeek;prototype__proto.firstDayOfYear=localeFirstDayOfYear;prototype__proto.firstDayOfWeek=localeFirstDayOfWeek;// Day of Week
prototype__proto.weekdays=localeWeekdays;prototype__proto.weekdaysMin=localeWeekdaysMin;prototype__proto.weekdaysShort=localeWeekdaysShort;prototype__proto.weekdaysParse=localeWeekdaysParse;prototype__proto.weekdaysRegex=weekdaysRegex;prototype__proto.weekdaysShortRegex=weekdaysShortRegex;prototype__proto.weekdaysMinRegex=weekdaysMinRegex;// Hours
prototype__proto.isPM=localeIsPM;prototype__proto.meridiem=localeMeridiem;function lists__get(format,index,field,setter){var locale=locale_locales__getLocale();var utc=create_utc__createUTC().set(setter,index);return locale[field](utc,format);}function listMonthsImpl(format,index,field){if(typeof format==='number'){index=format;format=undefined;}format=format||'';if(index!=null){return lists__get(format,index,field,'month');}var i;var out=[];for(i=0;i<12;i++){out[i]=lists__get(format,i,field,'month');}return out;}// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function listWeekdaysImpl(localeSorted,format,index,field){if(typeof localeSorted==='boolean'){if(typeof format==='number'){index=format;format=undefined;}format=format||'';}else{format=localeSorted;index=format;localeSorted=false;if(typeof format==='number'){index=format;format=undefined;}format=format||'';}var locale=locale_locales__getLocale(),shift=localeSorted?locale._week.dow:0;if(index!=null){return lists__get(format,(index+shift)%7,field,'day');}var i;var out=[];for(i=0;i<7;i++){out[i]=lists__get(format,(i+shift)%7,field,'day');}return out;}function lists__listMonths(format,index){return listMonthsImpl(format,index,'months');}function lists__listMonthsShort(format,index){return listMonthsImpl(format,index,'monthsShort');}function lists__listWeekdays(localeSorted,format,index){return listWeekdaysImpl(localeSorted,format,index,'weekdays');}function lists__listWeekdaysShort(localeSorted,format,index){return listWeekdaysImpl(localeSorted,format,index,'weekdaysShort');}function lists__listWeekdaysMin(localeSorted,format,index){return listWeekdaysImpl(localeSorted,format,index,'weekdaysMin');}locale_locales__getSetGlobalLocale('en',{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function ordinal(number){var b=number%10,output=toInt(number%100/10)===1?'th':b===1?'st':b===2?'nd':b===3?'rd':'th';return number+output;}});// Side effect imports
utils_hooks__hooks.lang=deprecate('moment.lang is deprecated. Use moment.locale instead.',locale_locales__getSetGlobalLocale);utils_hooks__hooks.langData=deprecate('moment.langData is deprecated. Use moment.localeData instead.',locale_locales__getLocale);var mathAbs=Math.abs;function duration_abs__abs(){var data=this._data;this._milliseconds=mathAbs(this._milliseconds);this._days=mathAbs(this._days);this._months=mathAbs(this._months);data.milliseconds=mathAbs(data.milliseconds);data.seconds=mathAbs(data.seconds);data.minutes=mathAbs(data.minutes);data.hours=mathAbs(data.hours);data.months=mathAbs(data.months);data.years=mathAbs(data.years);return this;}function duration_add_subtract__addSubtract(duration,input,value,direction){var other=create__createDuration(input,value);duration._milliseconds+=direction*other._milliseconds;duration._days+=direction*other._days;duration._months+=direction*other._months;return duration._bubble();}// supports only 2.0-style add(1, 's') or add(duration)
function duration_add_subtract__add(input,value){return duration_add_subtract__addSubtract(this,input,value,1);}// supports only 2.0-style subtract(1, 's') or subtract(duration)
function duration_add_subtract__subtract(input,value){return duration_add_subtract__addSubtract(this,input,value,-1);}function absCeil(number){if(number<0){return Math.floor(number);}else{return Math.ceil(number);}}function bubble(){var milliseconds=this._milliseconds;var days=this._days;var months=this._months;var data=this._data;var seconds,minutes,hours,years,monthsFromDays;// if we have a mix of positive and negative values, bubble down first
// check: https://github.com/moment/moment/issues/2166
if(!(milliseconds>=0&&days>=0&&months>=0||milliseconds<=0&&days<=0&&months<=0)){milliseconds+=absCeil(monthsToDays(months)+days)*864e5;days=0;months=0;}// The following code bubbles up values, see the tests for
// examples of what that means.
data.milliseconds=milliseconds%1000;seconds=absFloor(milliseconds/1000);data.seconds=seconds%60;minutes=absFloor(seconds/60);data.minutes=minutes%60;hours=absFloor(minutes/60);data.hours=hours%24;days+=absFloor(hours/24);// convert days to months
monthsFromDays=absFloor(daysToMonths(days));months+=monthsFromDays;days-=absCeil(monthsToDays(monthsFromDays));// 12 months -> 1 year
years=absFloor(months/12);months%=12;data.days=days;data.months=months;data.years=years;return this;}function daysToMonths(days){// 400 years have 146097 days (taking into account leap year rules)
// 400 years have 12 months === 4800
return days*4800/146097;}function monthsToDays(months){// the reverse of daysToMonths
return months*146097/4800;}function as(units){var days;var months;var milliseconds=this._milliseconds;units=normalizeUnits(units);if(units==='month'||units==='year'){days=this._days+milliseconds/864e5;months=this._months+daysToMonths(days);return units==='month'?months:months/12;}else{// handle milliseconds separately because of floating point math errors (issue #1867)
days=this._days+Math.round(monthsToDays(this._months));switch(units){case'week':return days/7+milliseconds/6048e5;case'day':return days+milliseconds/864e5;case'hour':return days*24+milliseconds/36e5;case'minute':return days*1440+milliseconds/6e4;case'second':return days*86400+milliseconds/1000;// Math.floor prevents floating point math errors here
case'millisecond':return Math.floor(days*864e5)+milliseconds;default:throw new Error('Unknown unit '+units);}}}// TODO: Use this.as('ms')?
function duration_as__valueOf(){return this._milliseconds+this._days*864e5+this._months%12*2592e6+toInt(this._months/12)*31536e6;}function makeAs(alias){return function(){return this.as(alias);};}var asMilliseconds=makeAs('ms');var asSeconds=makeAs('s');var asMinutes=makeAs('m');var asHours=makeAs('h');var asDays=makeAs('d');var asWeeks=makeAs('w');var asMonths=makeAs('M');var asYears=makeAs('y');function duration_get__get(units){units=normalizeUnits(units);return this[units+'s']();}function makeGetter(name){return function(){return this._data[name];};}var milliseconds=makeGetter('milliseconds');var seconds=makeGetter('seconds');var minutes=makeGetter('minutes');var hours=makeGetter('hours');var days=makeGetter('days');var months=makeGetter('months');var years=makeGetter('years');function weeks(){return absFloor(this.days()/7);}var round=Math.round;var thresholds={s:45,// seconds to minute
m:45,// minutes to hour
h:22,// hours to day
d:26,// days to month
M:11// months to year
};// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string,number,withoutSuffix,isFuture,locale){return locale.relativeTime(number||1,!!withoutSuffix,string,isFuture);}function duration_humanize__relativeTime(posNegDuration,withoutSuffix,locale){var duration=create__createDuration(posNegDuration).abs();var seconds=round(duration.as('s'));var minutes=round(duration.as('m'));var hours=round(duration.as('h'));var days=round(duration.as('d'));var months=round(duration.as('M'));var years=round(duration.as('y'));var a=seconds<thresholds.s&&['s',seconds]||minutes<=1&&['m']||minutes<thresholds.m&&['mm',minutes]||hours<=1&&['h']||hours<thresholds.h&&['hh',hours]||days<=1&&['d']||days<thresholds.d&&['dd',days]||months<=1&&['M']||months<thresholds.M&&['MM',months]||years<=1&&['y']||['yy',years];a[2]=withoutSuffix;a[3]=+posNegDuration>0;a[4]=locale;return substituteTimeAgo.apply(null,a);}// This function allows you to set the rounding function for relative time strings
function duration_humanize__getSetRelativeTimeRounding(roundingFunction){if(roundingFunction===undefined){return round;}if(typeof roundingFunction==='function'){round=roundingFunction;return true;}return false;}// This function allows you to set a threshold for relative time strings
function duration_humanize__getSetRelativeTimeThreshold(threshold,limit){if(thresholds[threshold]===undefined){return false;}if(limit===undefined){return thresholds[threshold];}thresholds[threshold]=limit;return true;}function humanize(withSuffix){var locale=this.localeData();var output=duration_humanize__relativeTime(this,!withSuffix,locale);if(withSuffix){output=locale.pastFuture(+this,output);}return locale.postformat(output);}var iso_string__abs=Math.abs;function iso_string__toISOString(){// for ISO strings we do not use the normal bubbling rules:
//  * milliseconds bubble up until they become hours
//  * days do not bubble at all
//  * months bubble up until they become years
// This is because there is no context-free conversion between hours and days
// (think of clock changes)
// and also not between days and months (28-31 days per month)
var seconds=iso_string__abs(this._milliseconds)/1000;var days=iso_string__abs(this._days);var months=iso_string__abs(this._months);var minutes,hours,years;// 3600 seconds -> 60 minutes -> 1 hour
minutes=absFloor(seconds/60);hours=absFloor(minutes/60);seconds%=60;minutes%=60;// 12 months -> 1 year
years=absFloor(months/12);months%=12;// inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
var Y=years;var M=months;var D=days;var h=hours;var m=minutes;var s=seconds;var total=this.asSeconds();if(!total){// this is the same as C#'s (Noda) and python (isodate)...
// but not other JS (goog.date)
return'P0D';}return(total<0?'-':'')+'P'+(Y?Y+'Y':'')+(M?M+'M':'')+(D?D+'D':'')+(h||m||s?'T':'')+(h?h+'H':'')+(m?m+'M':'')+(s?s+'S':'');}var duration_prototype__proto=Duration.prototype;duration_prototype__proto.abs=duration_abs__abs;duration_prototype__proto.add=duration_add_subtract__add;duration_prototype__proto.subtract=duration_add_subtract__subtract;duration_prototype__proto.as=as;duration_prototype__proto.asMilliseconds=asMilliseconds;duration_prototype__proto.asSeconds=asSeconds;duration_prototype__proto.asMinutes=asMinutes;duration_prototype__proto.asHours=asHours;duration_prototype__proto.asDays=asDays;duration_prototype__proto.asWeeks=asWeeks;duration_prototype__proto.asMonths=asMonths;duration_prototype__proto.asYears=asYears;duration_prototype__proto.valueOf=duration_as__valueOf;duration_prototype__proto._bubble=bubble;duration_prototype__proto.get=duration_get__get;duration_prototype__proto.milliseconds=milliseconds;duration_prototype__proto.seconds=seconds;duration_prototype__proto.minutes=minutes;duration_prototype__proto.hours=hours;duration_prototype__proto.days=days;duration_prototype__proto.weeks=weeks;duration_prototype__proto.months=months;duration_prototype__proto.years=years;duration_prototype__proto.humanize=humanize;duration_prototype__proto.toISOString=iso_string__toISOString;duration_prototype__proto.toString=iso_string__toISOString;duration_prototype__proto.toJSON=iso_string__toISOString;duration_prototype__proto.locale=locale;duration_prototype__proto.localeData=localeData;// Deprecations
duration_prototype__proto.toIsoString=deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',iso_string__toISOString);duration_prototype__proto.lang=lang;// Side effect imports
// FORMATTING
addFormatToken('X',0,0,'unix');addFormatToken('x',0,0,'valueOf');// PARSING
addRegexToken('x',matchSigned);addRegexToken('X',matchTimestamp);addParseToken('X',function(input,array,config){config._d=new Date(parseFloat(input,10)*1000);});addParseToken('x',function(input,array,config){config._d=new Date(toInt(input));});// Side effect imports
utils_hooks__hooks.version='2.15.1';setHookCallback(local__createLocal);utils_hooks__hooks.fn=momentPrototype;utils_hooks__hooks.min=min;utils_hooks__hooks.max=max;utils_hooks__hooks.now=now;utils_hooks__hooks.utc=create_utc__createUTC;utils_hooks__hooks.unix=moment__createUnix;utils_hooks__hooks.months=lists__listMonths;utils_hooks__hooks.isDate=isDate;utils_hooks__hooks.locale=locale_locales__getSetGlobalLocale;utils_hooks__hooks.invalid=valid__createInvalid;utils_hooks__hooks.duration=create__createDuration;utils_hooks__hooks.isMoment=isMoment;utils_hooks__hooks.weekdays=lists__listWeekdays;utils_hooks__hooks.parseZone=moment__createInZone;utils_hooks__hooks.localeData=locale_locales__getLocale;utils_hooks__hooks.isDuration=isDuration;utils_hooks__hooks.monthsShort=lists__listMonthsShort;utils_hooks__hooks.weekdaysMin=lists__listWeekdaysMin;utils_hooks__hooks.defineLocale=defineLocale;utils_hooks__hooks.updateLocale=updateLocale;utils_hooks__hooks.locales=locale_locales__listLocales;utils_hooks__hooks.weekdaysShort=lists__listWeekdaysShort;utils_hooks__hooks.normalizeUnits=normalizeUnits;utils_hooks__hooks.relativeTimeRounding=duration_humanize__getSetRelativeTimeRounding;utils_hooks__hooks.relativeTimeThreshold=duration_humanize__getSetRelativeTimeThreshold;utils_hooks__hooks.calendarFormat=getCalendarFormat;utils_hooks__hooks.prototype=momentPrototype;var _moment=utils_hooks__hooks;return _moment;});

},{}],8:[function(require,module,exports){
"use strict";

function TokenizationError(message, input, line) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;

    this.message = message || "";
    this.input = input;
    this.line = line;
}
TokenizationError.prototype = Object.create(Error.prototype);
TokenizationError.prototype.constructor = TokenizationError;

function ParseError(message, input, line, e) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.originalError = e;

    this.message = message || "";
    this.input = input;
    this.line = line;
}
ParseError.prototype = Object.create(Error.prototype);
ParseError.prototype.constructor = ParseError;

module.exports = {
    TokenizationError: TokenizationError, ParseError: ParseError
};

},{}],9:[function(require,module,exports){
'use strict';

var syntax = require('./syntax.js');
var lexical = require('./lexical.js');

function evalExp(exp, scope) {
    if (!scope) throw new Error('unable to evalExp: scope undefined');
    var operatorREs = lexical.operators,
        match;
    for (var i = 0; i < operatorREs.length; i++) {
        var operatorRE = operatorREs[i];
        var expRE = new RegExp('^(' + lexical.quoteBalanced.source + ')(' + operatorRE.source + ')(' + lexical.quoteBalanced.source + ')$');
        if (match = exp.match(expRE)) {
            var l = evalExp(match[1], scope);
            var op = syntax.operators[match[2].trim()];
            var r = evalExp(match[3], scope);
            return op(l, r);
        }
    }

    if (match = exp.match(lexical.rangeLine)) {
        var low = evalValue(match[1], scope),
            high = evalValue(match[2], scope);
        var range = [];
        for (var j = low; j <= high; j++) {
            range.push(j);
        }
        return range;
    }

    return evalValue(exp, scope);
}

function evalValue(str, scope) {
    str = str && str.trim();
    if (!str) return undefined;

    if (lexical.isLiteral(str)) {
        return lexical.parseLiteral(str);
    }
    if (lexical.isVariable(str)) {
        return scope.get(str);
    }
}

function isTruthy(val) {
    if (val instanceof Array) return !!val.length;
    return !!val;
}

function isFalsy(val) {
    return !isTruthy(val);
}

module.exports = {
    evalExp: evalExp, evalValue: evalValue, isTruthy: isTruthy, isFalsy: isFalsy
};

},{"./lexical.js":11,"./syntax.js":16}],10:[function(require,module,exports){
'use strict';

var lexical = require('./lexical.js');
var Exp = require('./expression.js');

var valueRE = new RegExp('' + lexical.value.source, 'g');

module.exports = function () {
    var filters = {};

    var _filterInstance = {
        render: function render(output, scope) {
            var args = this.args.map(function (arg) {
                return Exp.evalValue(arg, scope);
            });
            args.unshift(output);
            return this.filter.apply(null, args);
        },
        parse: function parse(str) {
            var match = lexical.filterLine.exec(str);
            if (!match) throw new Error('illegal filter: ' + str);

            var name = match[1],
                argList = match[2] || '',
                filter = filters[name];
            if (typeof filter !== 'function') {
                return {
                    name: name,
                    error: new Error('undefined filter: ' + name)
                };
            }

            var args = [];
            while (match = valueRE.exec(argList.trim())) {
                args.push(match[0]);
            }

            this.name = name;
            this.filter = filter;
            this.args = args;

            return this;
        }
    };

    function construct(str) {
        var instance = Object.create(_filterInstance);
        return instance.parse(str);
    }

    function register(name, filter) {
        filters[name] = filter;
    }

    function clear() {
        filters = {};
    }

    return {
        construct: construct, register: register, clear: clear
    };
};

},{"./expression.js":9,"./lexical.js":11}],11:[function(require,module,exports){
'use strict';

// quote related
var singleQuoted = /'[^']*'/;
var doubleQuoted = /"[^"]*"/;
var quoteBalanced = new RegExp('(?:' + singleQuoted.source + '|' + doubleQuoted.source + '|[^\'"])*');

var number = /(?:-?\d+\.?\d*|\.?\d+)/;
var bool = /true|false/;
var identifier = /[a-zA-Z_$][a-zA-Z_$0-9\-]*/;
var subscript = /\[\d+\]/;

var quoted = new RegExp('(?:' + singleQuoted.source + '|' + doubleQuoted.source + ')');
var literal = new RegExp('(?:' + quoted.source + '|' + bool.source + '|' + number.source + ')');
var variable = new RegExp(identifier.source + '(?:\\.' + identifier.source + '|' + subscript.source + ')*');

// range related
var rangeLimit = new RegExp('(?:' + variable.source + '|' + number.source + ')');
var range = new RegExp('\\(' + rangeLimit.source + '\\.\\.' + rangeLimit.source + '\\)');
var rangeCapture = new RegExp('\\((' + rangeLimit.source + ')\\.\\.(' + rangeLimit.source + ')\\)');

var value = new RegExp('(?:' + literal.source + '|' + variable.source + '|' + range.source + ')');

// hash related
var hash = new RegExp('(?:' + identifier.source + ')\\s*:\\s*(?:' + value.source + ')');
var hashCapture = new RegExp('(' + identifier.source + ')\\s*:\\s*(' + value.source + ')', 'g');

var tagLine = new RegExp('^\\s*(' + identifier.source + ')\\s*(.*)\\s*$');
var literalLine = new RegExp('^' + literal.source + '$', 'i');
var variableLine = new RegExp('^' + variable.source + '$');
var numberLine = new RegExp('^' + number.source + '$');
var boolLine = new RegExp('^' + bool.source + '$', 'i');
var quotedLine = new RegExp('^' + quoted.source + '$');
var rangeLine = new RegExp('^' + rangeCapture.source + '$');

// filter related
var valueList = new RegExp(value.source + '(\\s*,\\s*' + value.source + ')*');
var filter = new RegExp(identifier.source + '(?:\\s*:\\s*' + valueList.source + ')?', 'g');
var filterCapture = new RegExp('(' + identifier.source + ')(?:\\s*:\\s*(' + valueList.source + '))?');
var filterLine = new RegExp('^' + filterCapture.source + '$');

var operators = [/\s+or\s+/, /\s+and\s+/, /==|!=|<=|>=|<|>|\s+contains\s+/];

function isLiteral(str) {
    return literalLine.test(str);
}

function isRange(str) {
    return rangeLine.test(str);
}

function isVariable(str) {
    return variableLine.test(str);
}

function parseLiteral(str) {
    var res;
    if (res = str.match(numberLine)) {
        return Number(str);
    }
    if (res = str.match(boolLine)) {
        return str.toLowerCase() === 'true';
    }
    if (res = str.match(quotedLine)) {
        return str.slice(1, -1);
    }
}

module.exports = {
    quoted: quoted, number: number, bool: bool, literal: literal, filter: filter,
    hash: hash, hashCapture: hashCapture,
    range: range, rangeCapture: rangeCapture,
    identifier: identifier, value: value, quoteBalanced: quoteBalanced, operators: operators,
    quotedLine: quotedLine, numberLine: numberLine, boolLine: boolLine, rangeLine: rangeLine, literalLine: literalLine, filterLine: filterLine, tagLine: tagLine,
    isLiteral: isLiteral, isVariable: isVariable, parseLiteral: parseLiteral, isRange: isRange
};

},{}],12:[function(require,module,exports){
'use strict';

var lexical = require('./lexical.js');
var ParseError = require('./error.js').ParseError;

module.exports = function (Tag, Filter) {

    var stream = {
        init: function init(tokens) {
            this.tokens = tokens;
            this.handlers = {};
            return this;
        },
        on: function on(name, cb) {
            this.handlers[name] = cb;
            return this;
        },
        trigger: function trigger(event, arg) {
            var h = this.handlers[event];
            if (typeof h === 'function') {
                h(arg);
                return true;
            }
        },
        start: function start() {
            this.trigger('start');
            var token;
            while (!this.stopRequested && (token = this.tokens.shift())) {
                if (this.trigger('token', token)) continue;
                if (token.type == 'tag' && this.trigger('tag:' + token.name, token)) {
                    continue;
                }
                var template = parseToken(token, this.tokens);
                this.trigger('template', template);
            }
            if (!this.stopRequested) this.trigger('end');
            return this;
        },
        stop: function stop() {
            this.stopRequested = true;
            return this;
        }
    };

    function parse(tokens) {
        var token,
            templates = [];
        while (token = tokens.shift()) {
            templates.push(parseToken(token, tokens));
        }
        return templates;
    }

    function parseToken(token, tokens) {
        try {
            switch (token.type) {
                case 'tag':
                    return parseTag(token, tokens);
                case 'output':
                    return parseOutput(token.value);
                case 'html':
                    return token;
            }
        } catch (e) {
            throw new ParseError(e.message, token.input, token.line, e);
        }
    }

    function parseTag(token, tokens) {
        if (token.name === 'continue' || token.name === 'break') return token;
        return Tag.construct(token, tokens);
    }

    function parseOutput(str) {
        var match = lexical.value.exec(str);
        if (!match) throw new Error('illegal output string: ' + str);

        var initial = match[0];
        str = str.substr(match.index + match[0].length);

        var filters = [];
        while (match = lexical.filter.exec(str)) {
            filters.push([match[0].trim()]);
        }

        return {
            type: 'output',
            initial: initial,
            filters: filters.map(function (str) {
                return Filter.construct(str);
            })
        };
    }

    function parseStream(tokens) {
        var s = Object.create(stream);
        return s.init(tokens);
    }

    return {
        parse: parse, parseTag: parseTag, parseStream: parseStream, parseOutput: parseOutput
    };
};

},{"./error.js":8,"./lexical.js":11}],13:[function(require,module,exports){
'use strict';

var Exp = require('./expression.js');
var Promise = require('any-promise');

var render = {

    renderTemplates: function renderTemplates(templates, scope, opts) {
        var _this = this;

        if (!scope) throw new Error('unable to evalTemplates: scope undefined');
        opts = opts || {};
        opts.strict_filters = opts.strict_filters || false;

        var html = '';

        // This executes an array of promises sequentially for every template in the templates array - http://webcache.googleusercontent.com/search?q=cache:rNbMUn9TPtkJ:joost.vunderink.net/blog/2014/12/15/processing-an-array-of-promises-sequentially-in-node-js/+&cd=5&hl=en&ct=clnk&gl=us
        // It's fundamentally equivalent to the following...
        //  emptyPromise.then(renderTag(template0).then(renderTag(template1).then(renderTag(template2)...
        var lastPromise = templates.reduce(function (promise, template) {
            return promise.then(function (partial) {
                if (scope.safeGet('forloop.skip')) {
                    return Promise.resolve('');
                }
                if (scope.safeGet('forloop.stop')) {
                    throw new Error('forloop.stop'); // this will stop/break the sequential promise chain and go to the catch
                }

                var promiseLink = Promise.resolve('');
                switch (template.type) {
                    case 'tag':
                        // Add Promises to the chain
                        promiseLink = _this.renderTag(template, scope, _this.register).then(function (partial) {
                            if (partial === undefined) {
                                return true; // basically a noop (do nothing)
                            }
                            return html += partial;
                        });
                        break;
                    case 'html':
                        promiseLink = Promise.resolve(template.value).then(function (partial) {
                            return html += partial;
                        });
                        break;
                    case 'output':
                        var val = _this.evalOutput(template, scope, opts);
                        promiseLink = Promise.resolve(val === undefined ? '' : stringify(val)).then(function (partial) {
                            return html += partial;
                        });
                        break;
                }

                return promiseLink;
            }).catch(function (error) {
                if (error.message === 'forloop.skip') {
                    // the error is a controlled, purposeful stop. so just return the html that we have up to this point
                    return html;
                } else {
                    // rethrow actual error
                    throw error;
                }
            });
        }, Promise.resolve('')); // start the reduce chain with a resolved Promise. After first run, the "promise" argument
        //  in our reduce callback will be the returned promise from our "then" above.  In this
        //  case, that's the promise returned from this.renderTag or a resolved promise with raw html.

        return lastPromise.then(function (renderedHtml) {
            return renderedHtml;
        }).catch(function (error) {
            throw error;
        });
    },

    renderTag: function renderTag(template, scope, register) {
        if (template.name === 'continue') {
            scope.set('forloop.skip', true);
            return Promise.resolve('');
        }
        if (template.name === 'break') {
            scope.set('forloop.stop', true);
            scope.set('forloop.skip', true);
            return Promise.reject(new Error('forloop.stop')); // this will stop the sequential promise chain
        }
        return template.render(scope, register);
    },

    evalOutput: function evalOutput(template, scope, opts) {
        if (!scope) throw new Error('unable to evalOutput: scope undefined');
        var val = Exp.evalExp(template.initial, scope);
        template.filters.some(function (filter) {
            if (filter.error) {
                if (opts.strict_filters) {
                    throw filter.error;
                } else {
                    // render as null
                    val = '';
                    return true;
                }
            }
            val = filter.render(val, scope);
        });
        return val;
    },

    resetRegisters: function resetRegisters() {
        return this.register = {};
    }
};

function factory() {
    var instance = Object.create(render);
    instance.register = {};
    return instance;
}

function stringify(val) {
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
}

module.exports = factory;

},{"./expression.js":9,"any-promise":3}],14:[function(require,module,exports){
'use strict';

var Scope = {
    safeGet: function safeGet(str) {
        var i;
        // get all
        if (str === undefined) {
            var ctx = {};
            for (i = this.scopes.length - 1; i >= 0; i--) {
                var scp = this.scopes[i];
                for (var k in scp) {
                    if (scp.hasOwnProperty(k)) {
                        ctx[k] = scp[k];
                    }
                }
            }
            return ctx;
        }
        // get one path
        for (i = this.scopes.length - 1; i >= 0; i--) {
            var v = getPropertyByPath(this.scopes[i], str);
            if (v !== undefined) return v;
        }
    },
    get: function get(str) {
        var val = this.safeGet(str);
        if (val === undefined && this.opts.strict) {
            throw new Error('[strict_variables] undefined variable: ' + str);
        }
        return val;
    },
    set: function set(k, v) {
        setPropertyByPath(this.scopes[this.scopes.length - 1], k, v);
        return this;
    },
    push: function push(ctx) {
        if (!ctx) throw new Error('trying to push ' + ctx + ' into scopes');
        return this.scopes.push(ctx);
    },
    pop: function pop() {
        return this.scopes.pop();
    }
};

function setPropertyByPath(obj, path, val) {
    if (path instanceof String || typeof path === 'string') {
        var paths = path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
        for (var i = 0; i < paths.length; i++) {
            var key = paths[i];
            if (i === paths.length - 1) {
                return obj[key] = val;
            }
            if (undefined === obj[key]) obj[key] = {};
            // case for readonly objects
            obj = obj[key] || {};
        }
        return obj;
    }
    return obj[path] = val;
}

function getPropertyByPath(obj, path) {
    if (path instanceof String || typeof path === 'string') {
        var paths = path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
        paths.forEach(function (p) {
            return obj = obj && obj[p];
        });
        return obj;
    }
    return obj[path];
}

exports.factory = function (_ctx, opts) {
    opts = opts || {};
    opts.strict = opts.strict || false;

    var scope = Object.create(Scope);
    scope.opts = opts;
    scope.scopes = [_ctx || {}];
    return scope;
};

},{}],15:[function(require,module,exports){
"use strict";

var moment = require('moment');

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var suffixes = {
    1: 'st',
    2: 'nd',
    3: 'rd',
    'default': 'th'
};

// prototype extensions
var _date = {
    daysInMonth: function daysInMonth(d) {
        var feb = _date.isLeapYear(d) ? 29 : 28;
        return [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    },

    getTimezone: function getTimezone(d) {
        return d.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/, "$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3");
    },

    getGMTOffset: function getGMTOffset(d) {
        return (d.getTimezoneOffset() > 0 ? "-" : "+") + _number.pad(Math.floor(d.getTimezoneOffset() / 60), 2) + _number.pad(d.getTimezoneOffset() % 60, 2);
    },

    getDayOfYear: function getDayOfYear(d) {
        var num = 0;
        for (var i = 0; i < d.getMonth(); ++i) {
            num += _date.daysInMonth(d)[i];
        }
        return num + d.getDate();
    },

    // Startday is an integer of which day to start the week measuring from
    // TODO: that comment was retarted. fix it.
    getWeekOfYear: function getWeekOfYear(d, startDay) {
        // Skip to startDay of this week
        var now = this.getDayOfYear(d) + (startDay - d.getDay());
        // Find the first startDay of the year
        var jan1 = new Date(d.getFullYear(), 0, 1);
        var then = 7 - jan1.getDay() + startDay;
        return _number.pad(Math.floor((now - then) / 7) + 1, 2);
    },

    isLeapYear: function isLeapYear(d) {
        var year = d.getFullYear();
        return !!((year & 3) === 0 && (year % 100 || year % 400 === 0 && year));
    },

    getFirstDayOfMonth: function getFirstDayOfMonth(d) {
        var day = (d.getDay() - (d.getDate() - 1)) % 7;
        return day < 0 ? day + 7 : day;
    },

    getLastDayOfMonth: function getLastDayOfMonth(d) {
        var day = (d.getDay() + (_date.daysInMonth(d)[d.getMonth()] - d.getDate())) % 7;
        return day < 0 ? day + 7 : day;
    },

    getSuffix: function getSuffix(d) {
        var str = d.getDate().toString();
        var index = parseInt(str.slice(-1));
        return suffixes[index] || suffixes['default'];
    },

    applyOffset: function applyOffset(date, offset_seconds) {
        date.setTime(date.valueOf() - offset_seconds * 1000);
        return date;
    },

    century: function century(d) {
        return parseInt(d.getFullYear().toString().substring(0, 2), 10);
    }
};

var _obj = {
    values_of: function values_of(obj) {
        var values = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                values.push(obj[k]);
            }
        }
        return values;
    }
};

var _number = {
    pad: function pad(value, size, ch) {
        if (!ch) ch = '0';
        var result = value.toString();
        var pad = size - result.length;

        while (pad-- > 0) {
            result = ch + result;
        }

        return result;
    }
};

var format_codes = {
    a: function a(d) {
        return dayNamesShort[d.getDay()];
    },
    A: function A(d) {
        return dayNames[d.getDay()];
    },
    b: function b(d) {
        return monthNamesShort[d.getMonth()];
    },
    B: function B(d) {
        return monthNames[d.getMonth()];
    },
    c: function c(d) {
        return d.toLocaleString();
    },
    C: function C(d) {
        return _date.century(d);
    },
    d: function d(_d) {
        return _number.pad(_d.getDate(), 2);
    },
    e: function e(d) {
        return _number.pad(d.getDate(), 2, ' ');
    },
    H: function H(d) {
        return _number.pad(d.getHours(), 2);
    },
    I: function I(d) {
        return _number.pad(d.getHours() % 12 || 12, 2);
    },
    j: function j(d) {
        return _number.pad(_date.getDayOfYear(d), 3);
    },
    k: function k(d) {
        return _number.pad(d.getHours(), 2, ' ');
    },
    l: function l(d) {
        return _number.pad(d.getHours() % 12 || 12, 2, ' ');
    },
    L: function L(d) {
        return _number.pad(d.getMilliseconds(), 3);
    },
    m: function m(d) {
        return _number.pad(d.getMonth() + 1, 2);
    },
    M: function M(d) {
        return _number.pad(d.getMinutes(), 2);
    },
    p: function p(d) {
        return d.getHours() < 12 ? 'AM' : 'PM';
    },
    P: function P(d) {
        return d.getHours() < 12 ? 'am' : 'pm';
    },
    q: function q(d) {
        return _date.getSuffix(d);
    },
    s: function s(d) {
        return Math.round(d.valueOf() / 1000);
    },
    S: function S(d) {
        return _number.pad(d.getSeconds(), 2);
    },
    u: function u(d) {
        return d.getDay() || 7;
    },
    U: function U(d) {
        return _date.getWeekOfYear(d, 0);
    },
    w: function w(d) {
        return d.getDay();
    },
    W: function W(d) {
        return _date.getWeekOfYear(d, 1);
    },
    x: function x(d) {
        return d.toLocaleDateString();
    },
    X: function X(d) {
        return d.toLocaleTimeString();
    },
    y: function y(d) {
        return d.getFullYear().toString().substring(2, 4);
    },
    Y: function Y(d) {
        return d.getFullYear();
    },
    // TODO: guessing the pad function won't work with negative numbers?
    // TODO: getTimezoneOffset returns a positive number for GMT-7. Verify my
    // assumption that it will return negative for GMT+x
    z: function z(d) {
        var tz = d.getTimezoneOffset() / 60 * 100;
        return (tz > 0 ? '-' : '+') + _number.pad(tz, 4);
    },
    "%": function _() {
        return '%';
    }
};
format_codes.h = format_codes.b;
format_codes.N = format_codes.L;

// * r stands for regex, p stands for parser
// * all parseInt calls have to have the base supplied as the second
//   parameter, otherwise they will default to octal when parsing numbers
//   with leading zeros. This is most evident when parsing a date with 08 as
//   the minutes / year as 08 is an invalid octal number, and so returns 0
var parse_codes = {
    a: {
        r: "(?:" + dayNamesShort.join("|") + ")"
    },
    A: {
        r: "(?:" + dayNames.join("|") + ")"
    },
    b: {
        r: "(" + monthNamesShort.join("|") + ")",
        p: function p(data) {
            this.month = $.inArray(data, monthNamesShort);
        }
    },
    B: {
        r: "(" + monthNames.join("|") + ")",
        p: function p(data) {
            this.month = $.inArray(data, monthNames);
        }
    },
    C: {
        r: "(\\d{1,2})",
        p: function p(d) {
            this.century = parseInt(d, 10);
        }
    },
    d: {
        r: "(\\d{1,2})",
        p: function p(d) {
            this.day = parseInt(d, 10);
        }
    },
    H: {
        r: "(\\d{1,2})",
        p: function p(d) {
            this.hour = parseInt(d, 10);
        }
    },
    // This gives only the day. Parsing of the month happens at the end because
    // we also need the year
    j: {
        r: "(\\d{1,3})",
        p: function p(d) {
            this.day = parseInt(d, 10);
        }
    },
    L: {
        r: "(\\d{3})",
        p: function p(d) {
            this.milliseconds = parseInt(d, 10);
        }
    },
    m: {
        r: "(\\d{1,2})",
        p: function p(d) {
            this.month = parseInt(d, 10) - 1;
        }
    },
    M: {
        r: "(\\d{2})",
        p: function p(d) {
            this.minute = parseInt(d, 10);
        }
    },
    p: {
        r: "(AM|PM)",
        p: function p(d) {
            if (d == 'AM') {
                if (this.hour == 12) {
                    this.hour = 0;
                }
            } else {
                if (this.hour < 12) {
                    this.hour += 12;
                }
            }
        }
    },
    P: {
        r: "(am|pm)",
        p: function p(d) {
            if (d == 'am') {
                if (this.hour == 12) {
                    this.hour = 0;
                }
            } else {
                if (this.hour < 12) {
                    this.hour += 12;
                }
            }
        }
    },
    q: {
        r: "(?:" + _obj.values_of(suffixes).join('|') + ")"
    },
    S: {
        r: "(\\d{2})",
        p: function p(d) {
            this.second = parseInt(d, 10);
        }
    },
    y: {
        r: "(\\d{1,2})",
        p: function p(d) {
            this.year = parseInt(d, 10);
        }
    },
    Y: {
        r: "(\\d{4})",
        p: function p(d) {
            this.century = Math.floor(parseInt(d, 10) / 100);
            this.year = parseInt(d, 10) % 100;
        }
    },
    z: { // "Z", "+05:00", "+0500" all acceptable.
        r: "(Z|[+-]\\d{2}:?\\d{2})",
        p: function p(d) {
            // UTC, no offset.
            if (d == "Z") {
                this.zone = 0;
                return;
            }

            var seconds = parseInt(d[0] + d[1] + d[2], 10) * 3600; // e.g., "+05" or "-08"
            if (d[3] == ":") {
                // "+HH:MM" is preferred iso8601 format
                seconds += parseInt(d[4] + d[5], 10) * 60;
            } else {
                // "+HHMM" is frequently used, though.
                seconds += parseInt(d[3] + d[4], 10) * 60;
            }
            this.zone = seconds;
        }
    }
};
parse_codes.e = parse_codes.d;
parse_codes.h = parse_codes.b;
parse_codes.I = parse_codes.H;
parse_codes.k = parse_codes.H;
parse_codes.l = parse_codes.H;

var strftime = function strftime(d, format) {
    // I used to use string split with a regex and a capturing block here,
    // which I thought was really clever, but apparently this exact feature is
    // fucked in IE. In every other browser (and languages), the captured
    // blocks are present in the output. E.g.
    // var pairs = "hello%athere".split(/(%.)/);
    // => ['hello', '%a', 'there']
    // IE however, just treats it the same as if no capturing block is present
    // => ['hello', 'there']
    // An alternate implementation of split is available here
    // http://blog.stevenlevithan.com/archives/cross-browser-split
    // Because that's a large amount of code for this one specific use case,
    // I've just decided to loop through a regex instead.
    d = moment(d).toDate();

    var output = '';
    var remaining = format;

    while (true) {
        var r = /%./g;
        var results = r.exec(remaining);

        // No more format codes. Add the remaining text and return
        if (!results) {
            return output + remaining;
        }

        // Add the preceding text
        output += remaining.slice(0, r.lastIndex - 2);
        remaining = remaining.slice(r.lastIndex);

        // Add the format code
        var ch = results[0].charAt(1);
        var func = format_codes[ch];
        output += func ? func.call(this, d) : '%' + ch;
    }
};

module.exports = strftime;

},{"moment":7}],16:[function(require,module,exports){
'use strict';

var operators = {
    '==': function _(l, r) {
        return l == r;
    },
    '!=': function _(l, r) {
        return l != r;
    },
    '>': function _(l, r) {
        return l > r;
    },
    '<': function _(l, r) {
        return l < r;
    },
    '>=': function _(l, r) {
        return l >= r;
    },
    '<=': function _(l, r) {
        return l <= r;
    },
    'contains': function contains(l, r) {
        return l.indexOf(r) > -1;
    },
    'and': function and(l, r) {
        return l && r;
    },
    'or': function or(l, r) {
        return l || r;
    }
};

exports.operators = operators;

},{}],17:[function(require,module,exports){
'use strict';

var lexical = require('./lexical.js');
var Promise = require('any-promise');
var Exp = require('./expression.js');

function hash(markup, scope) {
    var obj = {},
        match;
    lexical.hashCapture.lastIndex = 0;
    while (match = lexical.hashCapture.exec(markup)) {
        var k = match[1],
            v = match[2];
        obj[k] = Exp.evalValue(v, scope);
    }
    return obj;
}

module.exports = function () {
    var tagImpls = {};

    var _tagInstance = {
        render: function render(scope, register) {
            var reg = register[this.name];
            if (!reg) reg = register[this.name] = {};
            var obj = hash(this.token.args, scope);
            return this.tagImpl.render && this.tagImpl.render(scope, obj, reg) || Promise.resolve('');
        },
        parse: function parse(token, tokens) {
            this.type = 'tag';
            this.token = token;
            this.name = token.name;

            var tagImpl = tagImpls[this.name];
            if (!tagImpl) throw new Error('tag ' + this.name + ' not found');
            this.tagImpl = Object.create(tagImpl);
            if (this.tagImpl.parse) {
                this.tagImpl.parse(token, tokens);
            }
        }
    };

    function register(name, tag) {
        tagImpls[name] = tag;
    }

    function construct(token, tokens) {
        var instance = Object.create(_tagInstance);
        instance.parse(token, tokens);
        return instance;
    }

    function clear() {
        tagImpls = {};
    }

    return {
        construct: construct, register: register, clear: clear
    };
};

},{"./expression.js":9,"./lexical.js":11,"any-promise":3}],18:[function(require,module,exports){
'use strict';

var lexical = require('./lexical.js');
var TokenizationError = require('./error.js').TokenizationError;

function parse(html) {
    var tokens = [];
    if (!html) return tokens;

    var syntax = /({%(.*?)%})|({{(.*?)}})/g;
    var result, htmlFragment, token;
    var lastMatchEnd = 0,
        lastMatchBegin = -1,
        parsedLinesCount = 0;

    while ((result = syntax.exec(html)) !== null) {
        // passed html fragments
        if (result.index > lastMatchEnd) {
            htmlFragment = html.slice(lastMatchEnd, result.index);
            tokens.push({
                type: 'html',
                raw: htmlFragment,
                value: htmlFragment
            });
        }
        // tag appeared
        if (result[1]) {
            token = factory('tag', 1, result);

            var match = token.value.match(lexical.tagLine);
            if (!match) {
                throw new TokenizationError('illegal tag: ' + token.raw, token.input, token.line);
            }
            token.name = match[1];
            token.args = match[2];

            tokens.push(token);
        }
        // output
        else {
                token = factory('output', 3, result);
                tokens.push(token);
            }
        lastMatchEnd = syntax.lastIndex;
    }

    // remaining html
    if (html.length > lastMatchEnd) {
        htmlFragment = html.slice(lastMatchEnd, html.length);
        tokens.push({
            type: 'html',
            raw: htmlFragment,
            value: htmlFragment
        });
    }
    return tokens;

    function factory(type, offset, match) {
        return {
            type: type,
            raw: match[offset],
            value: match[offset + 1].trim(),
            line: getLineNum(match),
            input: getLineContent(match)
        };
    }

    function getLineContent(match) {
        var idx1 = match.input.lastIndexOf('\n', match.index);
        var idx2 = match.input.indexOf('\n', match.index);
        if (idx2 === -1) idx2 = match.input.length;
        return match.input.slice(idx1 + 1, idx2);
    }

    function getLineNum(match) {
        var lines = match.input.slice(lastMatchBegin + 1, match.index).split('\n');
        parsedLinesCount += lines.length - 1;
        lastMatchBegin = match.index;
        return parsedLinesCount + 1;
    }
}

exports.parse = parse;

},{"./error.js":8,"./lexical.js":11}],19:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var Promise = require('any-promise');
var re = new RegExp('(' + lexical.identifier.source + ')\\s*=(.*)');

module.exports = function (liquid) {

    liquid.registerTag('assign', {
        parse: function parse(token) {
            var match = token.args.match(re);
            if (!match) throw new Error('illegal token ' + token.raw);
            this.key = match[1];
            this.value = match[2];
        },
        render: function render(scope, hash) {
            scope.set(this.key, liquid.evalOutput(this.value, scope));
            return Promise.resolve('');
        }
    });
};

},{"..":2,"any-promise":3}],20:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var re = new RegExp('(' + lexical.identifier.source + ')');

module.exports = function (liquid) {

    liquid.registerTag('capture', {
        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            var match = tagToken.args.match(re);
            if (!match) throw new Error(tagToken.args + ' not valid identifier');

            this.variable = match[1];
            this.templates = [];

            var stream = liquid.parser.parseStream(remainTokens);
            stream.on('tag:endcapture', function (token) {
                return stream.stop();
            }).on('template', function (tpl) {
                return _this.templates.push(tpl);
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });
            stream.start();
        },
        render: function render(scope, hash) {
            var _this2 = this;

            return liquid.renderer.renderTemplates(this.templates, scope).then(function (html) {
                scope.set(_this2.variable, html);
            });
        }
    });
};

},{"..":2}],21:[function(require,module,exports){
'use strict';

var Liquid = require('..');

module.exports = function (liquid) {
    liquid.registerTag('case', {

        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            this.cond = tagToken.args;
            this.cases = [];
            this.elseTemplates = [];

            var p = [],
                stream = liquid.parser.parseStream(remainTokens).on('tag:when', function (token) {
                if (!_this.cases[token.args]) {
                    _this.cases.push({
                        val: token.args,
                        templates: p = []
                    });
                }
            }).on('tag:else', function (token) {
                return p = _this.elseTemplates;
            }).on('tag:endcase', function (token) {
                return stream.stop();
            }).on('template', function (tpl) {
                return p.push(tpl);
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });

            stream.start();
        },

        render: function render(scope, hash) {
            for (var i = 0; i < this.cases.length; i++) {
                var branch = this.cases[i];
                var val = Liquid.evalExp(branch.val, scope);
                var cond = Liquid.evalExp(this.cond, scope);
                if (val === cond) {
                    return liquid.renderer.renderTemplates(branch.templates, scope);
                }
            }
            return liquid.renderer.renderTemplates(this.elseTemplates, scope);
        }

    });
};

},{"..":2}],22:[function(require,module,exports){
'use strict';

module.exports = function (liquid) {

    liquid.registerTag('comment', {
        parse: function parse(tagToken, remainTokens) {
            var stream = liquid.parser.parseStream(remainTokens);
            stream.on('token', function (token) {
                if (token.name === 'endcomment') stream.stop();
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });
            stream.start();
        }
    });
};

},{}],23:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var Promise = require('any-promise');
var lexical = Liquid.lexical;
var groupRE = new RegExp('^(?:(' + lexical.value.source + ')\\s*:\\s*)?(.*)$');
var candidatesRE = new RegExp(lexical.value.source, 'g');

module.exports = function (liquid) {
    liquid.registerTag('cycle', {

        parse: function parse(tagToken, remainTokens) {
            var match = groupRE.exec(tagToken.args);
            if (!match) throw new Error('illegal tag: ' + tagToken.raw);

            this.group = match[1] || '';
            var candidates = match[2];

            this.candidates = [];

            while (match = candidatesRE.exec(candidates)) {
                this.candidates.push(match[0]);
            }

            if (!this.candidates.length) {
                throw new Error('empty candidates: ' + tagToken.raw);
            }
        },

        render: function render(scope, hash, register) {
            var fingerprint = Liquid.evalValue(this.group, scope) + ':' + this.candidates.join(',');
            var idx = register[fingerprint];

            if (idx === undefined) {
                idx = register[fingerprint] = 0;
            }

            var candidate = this.candidates[idx];
            idx = (idx + 1) % this.candidates.length;
            register[fingerprint] = idx;

            return Promise.resolve(Liquid.evalValue(candidate, scope));
        }
    });
};

},{"..":2,"any-promise":3}],24:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;

module.exports = function (liquid) {

    liquid.registerTag('decrement', {
        parse: function parse(token) {
            var match = token.args.match(lexical.identifier);
            if (!match) throw new Error('illegal identifier ' + token.args);
            this.variable = match[0];
        },
        render: function render(scope, hash) {
            var v = scope.get(this.variable);
            if (typeof v !== 'number') v = 0;
            scope.set(this.variable, v - 1);
        }
    });
};

},{"..":2}],25:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var Promise = require('any-promise');
var lexical = Liquid.lexical;
var re = new RegExp('^(' + lexical.identifier.source + ')\\s+in\\s+' + ('(' + lexical.value.source + ')') + ('(?:\\s+' + lexical.hash.source + ')*') + '(?:\\s+(reversed))?$');

module.exports = function (liquid) {
    liquid.registerTag('for', {

        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            var match = re.exec(tagToken.args);
            if (!match) throw new Error('illegal tag: ' + tagToken.raw);
            this.variable = match[1];
            this.collection = match[2];
            this.reversed = !!match[3];

            this.templates = [];
            this.elseTemplates = [];

            var p,
                stream = liquid.parser.parseStream(remainTokens).on('start', function (x) {
                return p = _this.templates;
            }).on('tag:else', function (token) {
                return p = _this.elseTemplates;
            }).on('tag:endfor', function (token) {
                return stream.stop();
            }).on('template', function (tpl) {
                return p.push(tpl);
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });

            stream.start();
        },

        render: function render(scope, hash) {
            var _this2 = this;

            var collection = Liquid.evalExp(this.collection, scope);
            if (Liquid.isFalsy(collection)) {
                return liquid.renderer.renderTemplates(this.elseTemplates, scope);
            }

            var html = '';
            var length = collection.length;
            var offset = hash.offset || 0;
            var limit = hash.limit === undefined ? collection.length : hash.limit;

            collection = collection.slice(offset, offset + limit);
            if (this.reversed) collection.reverse();

            // for needs to execute the promises sequentially, not just resolve them sequentially, due to break and continue.
            // We can't just loop through executing everything then resolve them all sequentially like we do for render.renderTemplates
            // First, we build the array of parameters we are going to use for each call to renderTemplates
            var contexts = [];
            collection.some(function (item, i) {
                var ctx = {};
                ctx[_this2.variable] = item;
                ctx.forloop = {
                    first: i === 0,
                    index: i + 1,
                    index0: i,
                    last: i === length - 1,
                    length: length,
                    rindex: length - i,
                    rindex0: length - i - 1,
                    stop: false,
                    skip: false
                };
                // We are just putting together an array of the arguments we will be passing to our sequential promises
                contexts.push(ctx);
            });

            // This is some pretty tricksy javascript, at least to me.
            // This executes an array of promises sequentially for every argument in the contexts array - http://webcache.googleusercontent.com/search?q=cache:rNbMUn9TPtkJ:joost.vunderink.net/blog/2014/12/15/processing-an-array-of-promises-sequentially-in-node-js/+&cd=5&hl=en&ct=clnk&gl=us
            // It's fundamentally equivalent to the following...
            //  emptyPromise.then(renderTemplates(args0).then(renderTemplates(args1).then(renderTemplates(args2)...
            var lastPromise = contexts.reduce(function (promise, context) {
                return promise.then(function (partial) {
                    if (scope.get('forloop.stop')) {
                        throw new Error('forloop.stop'); // this will stop the sequential promise chain
                    }

                    return html += partial;
                }).then(function (partial) {
                    // todo: Make sure our scope management is sound here.  Create some tests that revolve around loops
                    //  with sections that take differing amounts of time to complete.  Make sure the order is maintained
                    //  and scope doesn't bleed over into other renderTemplate calls.
                    scope.push(context);
                    return liquid.renderer.renderTemplates(_this2.templates, scope);
                }).then(function (partial) {
                    scope.pop(context);
                    return partial;
                });
            }, Promise.resolve('')); // start the reduce chain with a resolved Promise. After first run, the "promise" argument
            //  in our reduce callback will be the returned promise from our "then" above.  In this
            //  case, the promise returned from liquid.renderer.renderTemplates.

            return lastPromise.then(function (partial) {
                return html += partial;
            }).catch(function (error) {
                if (error.message === 'forloop.stop') {
                    // the error is a controlled, purposeful stop. so just return the html that we have up to this point
                    return html;
                } else {
                    // rethrow actual error
                    throw error;
                }
            });
        }
    });
};

},{"..":2,"any-promise":3}],26:[function(require,module,exports){
'use strict';

var Liquid = require('..');

module.exports = function (liquid) {
    liquid.registerTag('if', {

        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            this.branches = [];
            this.elseTemplates = [];

            var p,
                stream = liquid.parser.parseStream(remainTokens).on('start', function (x) {
                return _this.branches.push({
                    cond: tagToken.args,
                    templates: p = []
                });
            }).on('tag:elsif', function (token) {
                if (!_this.branches[token.args]) {
                    _this.branches.push({
                        cond: token.args,
                        templates: p = []
                    });
                }
            }).on('tag:else', function (token) {
                return p = _this.elseTemplates;
            }).on('tag:endif', function (token) {
                return stream.stop();
            }).on('template', function (tpl) {
                return p.push(tpl);
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });

            stream.start();
        },

        render: function render(scope, hash) {
            for (var i = 0; i < this.branches.length; i++) {
                var branch = this.branches[i];
                var cond = Liquid.evalExp(branch.cond, scope);
                if (Liquid.isTruthy(cond)) {
                    return liquid.renderer.renderTemplates(branch.templates, scope);
                }
            }
            return liquid.renderer.renderTemplates(this.elseTemplates, scope);
        }

    });
};

},{"..":2}],27:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;
var withRE = new RegExp('with\\s+(' + lexical.value.source + ')');

module.exports = function (liquid) {

    liquid.registerTag('include', {
        parse: function parse(token) {
            var match = lexical.value.exec(token.args);
            if (!match) throw new Error('illegal token ' + token.raw);
            this.value = match[0];

            match = withRE.exec(token.args);
            if (match) {
                this.with = match[1];
            }
        },
        render: function render(scope, hash) {
            var filepath = Liquid.evalValue(this.value, scope);
            if (this.with) {
                hash[filepath] = Liquid.evalValue(this.with, scope);
            }
            return liquid.handleCache(filepath).then(function (templates) {
                scope.push(hash);
                return liquid.renderer.renderTemplates(templates, scope);
            }).then(function (html) {
                scope.pop();
                return html;
            });
        }
    });
};

},{"..":2}],28:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var lexical = Liquid.lexical;

module.exports = function (liquid) {

    liquid.registerTag('increment', {
        parse: function parse(token) {
            var match = token.args.match(lexical.identifier);
            if (!match) throw new Error('illegal identifier ' + token.args);
            this.variable = match[0];
        },
        render: function render(scope, hash) {
            var v = scope.get(this.variable);
            if (typeof v !== 'number') v = 0;
            scope.set(this.variable, v + 1);
        }
    });
};

},{"..":2}],29:[function(require,module,exports){
"use strict";

module.exports = function (engine) {
    require("./assign.js")(engine);
    require("./capture.js")(engine);
    require("./case.js")(engine);
    require("./comment.js")(engine);
    require("./cycle.js")(engine);
    require("./decrement.js")(engine);
    require("./for.js")(engine);
    require("./if.js")(engine);
    require("./include.js")(engine);
    require("./increment.js")(engine);
    require("./layout.js")(engine);
    require("./raw.js")(engine);
    require("./tablerow.js")(engine);
    require("./unless.js")(engine);
};

},{"./assign.js":19,"./capture.js":20,"./case.js":21,"./comment.js":22,"./cycle.js":23,"./decrement.js":24,"./for.js":25,"./if.js":26,"./include.js":27,"./increment.js":28,"./layout.js":30,"./raw.js":31,"./tablerow.js":32,"./unless.js":33}],30:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var Promise = require('any-promise');
var lexical = Liquid.lexical;

module.exports = function (liquid) {

    liquid.registerTag('layout', {
        parse: function parse(token, remainTokens) {
            var match = lexical.value.exec(token.args);
            if (!match) throw new Error('illegal token ' + token.raw);

            this.layout = match[0];
            this.tpls = liquid.parser.parse(remainTokens);
        },
        render: function render(scope, hash) {
            var layout = Liquid.evalValue(this.layout, scope);

            var html = '';
            scope.push({});
            // not sure if this first one is needed, since the results are ignored
            return liquid.renderer.renderTemplates(this.tpls, scope).then(function (partial) {
                html += partial;
                return liquid.handleCache(layout);
            }).then(function (templates) {
                return liquid.renderer.renderTemplates(templates, scope);
            }).then(function (partial) {
                scope.pop();
                return partial;
            }).catch(function (e) {
                e.file = layout;
                throw e;
            });
        }
    });

    liquid.registerTag('block', {
        parse: function parse(token, remainTokens) {
            var _this = this;

            var match = /\w+/.exec(token.args);
            this.block = match ? match[0] : '';

            this.tpls = [];
            var p,
                stream = liquid.parser.parseStream(remainTokens).on('tag:endblock', function (token) {
                return stream.stop();
            }).on('template', function (tpl) {
                return _this.tpls.push(tpl);
            }).on('end', function (x) {
                throw new Error('tag ' + token.raw + ' not closed');
            });
            stream.start();
        },
        render: function render(scope, hash) {
            var _this2 = this;

            var html = scope.get('_liquid.blocks.' + this.block);
            var promise = Promise.resolve('');
            if (html === undefined) {
                promise = liquid.renderer.renderTemplates(this.tpls, scope).then(function (partial) {
                    scope.set('_liquid.blocks.' + _this2.block, partial);
                    return partial;
                });
            } else {
                scope.set('_liquid.blocks.' + this.block, html);
                promise = Promise.resolve(html);
            }
            return promise;
        }
    });
};

},{"..":2,"any-promise":3}],31:[function(require,module,exports){
'use strict';

var Promise = require('any-promise');

module.exports = function (liquid) {

    liquid.registerTag('raw', {
        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            this.tokens = [];

            var stream = liquid.parser.parseStream(remainTokens);
            stream.on('token', function (token) {
                if (token.name === 'endraw') stream.stop();else _this.tokens.push(token);
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });
            stream.start();
        },
        render: function render(scope, hash) {
            var tokens = this.tokens.map(function (token) {
                return token.raw;
            }).join('');
            return Promise.resolve(tokens);
        }
    });
};

},{"any-promise":3}],32:[function(require,module,exports){
'use strict';

var Liquid = require('..');
var Promise = require('any-promise');
var lexical = Liquid.lexical;
var re = new RegExp('^(' + lexical.identifier.source + ')\\s+in\\s+' + ('(' + lexical.value.source + ')') + ('(?:\\s+' + lexical.hash.source + ')*$'));

module.exports = function (liquid) {
    liquid.registerTag('tablerow', {

        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            var match = re.exec(tagToken.args);
            if (!match) throw new Error('illegal tag: ' + tagToken.raw);
            this.variable = match[1];
            this.collection = match[2];

            this.templates = [];

            var p,
                stream = liquid.parser.parseStream(remainTokens).on('start', function (x) {
                return p = _this.templates;
            }).on('tag:endtablerow', function (token) {
                return stream.stop();
            }).on('template', function (tpl) {
                return p.push(tpl);
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });

            stream.start();
        },

        render: function render(scope, hash) {
            var _this2 = this;

            var collection = Liquid.evalExp(this.collection, scope) || [];

            var html = '<table>';
            var offset = hash.offset || 0;
            var limit = hash.limit === undefined ? collection.length : hash.limit;

            var cols = hash.cols,
                row,
                col;
            if (!cols) throw new Error('illegal cols: ' + cols);

            // build array of arguments to pass to sequential promises...
            collection = collection.slice(offset, offset + limit);
            var contexts = [];
            collection.some(function (item, i) {
                var ctx = {};
                ctx[_this2.variable] = item;
                // We are just putting together an array of the arguments we will be passing to our sequential promises
                contexts.push(ctx);
            });

            // This executes an array of promises sequentially for every argument in the contexts array - http://webcache.googleusercontent.com/search?q=cache:rNbMUn9TPtkJ:joost.vunderink.net/blog/2014/12/15/processing-an-array-of-promises-sequentially-in-node-js/+&cd=5&hl=en&ct=clnk&gl=us
            // It's fundamentally equivalent to the following...
            //  emptyPromise.then(renderTemplates(args0).then(renderTemplates(args1).then(renderTemplates(args2)...
            var lastPromise = contexts.reduce(function (promise, context, currentIndex) {
                return promise.then(function (partial) {
                    row = Math.floor(currentIndex / cols) + 1;
                    col = currentIndex % cols + 1;
                    if (col === 1) {
                        if (row !== 1) {
                            html += '</tr>';
                        }
                        html += '<tr class="row' + row + '">';
                    }

                    //ctx[this.variable] = context;

                    return html += '<td class="col' + col + '">';
                }).then(function (partial) {
                    scope.push(context);
                    return liquid.renderer.renderTemplates(_this2.templates, scope);
                }).then(function (partial) {
                    scope.pop(context);
                    html += partial;
                    return html += '</td>';
                });
            }, Promise.resolve('')); // start the reduce chain with a resolved Promise. After first run, the "promise" argument
            //  in our reduce callback will be the returned promise from our "then" above.  In this
            //  case, the promise returned from liquid.renderer.renderTemplates.

            return lastPromise.then(function () {
                if (row > 0) {
                    html += '</tr>';
                }
                html += '</table>';
                return html;
            }).catch(function (error) {
                throw error;
            });
        }
    });
};

},{"..":2,"any-promise":3}],33:[function(require,module,exports){
'use strict';

var Liquid = require('..');

module.exports = function (liquid) {
    liquid.registerTag('unless', {
        parse: function parse(tagToken, remainTokens) {
            var _this = this;

            this.templates = [];
            this.elseTemplates = [];
            var p,
                stream = liquid.parser.parseStream(remainTokens).on('start', function (x) {
                p = _this.templates;
                _this.cond = tagToken.args;
            }).on('tag:else', function (token) {
                return p = _this.elseTemplates;
            }).on('tag:endunless', function (token) {
                return stream.stop();
            }).on('template', function (tpl) {
                return p.push(tpl);
            }).on('end', function (x) {
                throw new Error('tag ' + tagToken.raw + ' not closed');
            });

            stream.start();
        },

        render: function render(scope, hash) {
            var cond = Liquid.evalExp(this.cond, scope);
            return Liquid.isFalsy(cond) ? liquid.renderer.renderTemplates(this.templates, scope) : liquid.renderer.renderTemplates(this.elseTemplates, scope);
        }
    });
};

},{"..":2}]},{},[2])(2)
});