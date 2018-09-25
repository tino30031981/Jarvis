if (typeof Array.prototype.contains2 != "function")
    Array.prototype.contains2 = function (value) {
        if (value === undefined || value === null)
            return null;
        var i = 0;
        if (typeof value === 'string') {
            for (i = 0; i < this.length; i++) {
                if (this[i] === undefined) continue;
                if (this[i] === null)
                    return false;
                else if (this[i].toString().toUpperCase() === value
						.toUpperCase())
                    return true;
            }
        } else {
            for (i = 0; i < this.length; i++) {
                if (this[i] === undefined) continue;
                if (this[i] === value) {
                    return true;
                }
            }
        }
        return false;
    };
Object.defineProperty(Array.prototype, "contains2", { enumerable: false });
if (typeof Array.prototype.find2 != "function")
    Array.prototype.find2 = function (key, value) {
        if (value === undefined || value === null)
            return null;
        var i = 0;
        if (typeof value === 'string') {
            for (i = 0; i < this.length; i++) {
                if (this[i][key] === null)
                    return null;
                else if (this[i][key].toString().toUpperCase() === value
						.toUpperCase())
                    return this[i];
            }
        } else {
            for (i = 0; i < this.length; i++) {
                if (this[i][key] === value) {
                    return this[i];
                }
            }
        }
        return null;
    };
if (typeof Array.prototype.findIndex2 != "function")
    Array.prototype.findIndex2 = function (key, value) {
        if (value === undefined || value === null)
            return -1;
        var i = 0;
        if (typeof value === 'string') {
            for (i = 0; i < this.length; i++) {
                if (this[i][key] === null)
                    return -1;
                else if (this[i][key].toString().toUpperCase() === value
						.toUpperCase())
                    return i;
            }
        } else {
            for (i = 0; i < this.length; i++)
                if (this[i][key] === value)
                    return i;
        }
        return -1;
    };
if (typeof Array.prototype.exist2 != "function")
    Array.prototype.exist2 = function (key, value) {
        var obj = this.find2(key, value);
        return (obj !== null);
    };
if (typeof Array.prototype.remove2 != "function")
    Array.prototype.remove2 = function (value) {
        this.splice(this.indexOf(value, 1));
    };
if (typeof Array.prototype.max != "function")
    Array.prototype.max = function () {
        return Math.max.apply(null, this);
    };
if (typeof Array.prototype.min != "function")
    Array.prototype.min = function () {
        return Math.min.apply(null, this);
    };
// Warn if overriding existing method
if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });
if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement /*, fromIndex*/) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1]) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) { k = 0; }
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
               (searchElement !== searchElement && currentElement !== currentElement)) {
                return true;
            }
            k++;
        }
        return false;
    };
}
// //Only add this implementation if one does not already exist.
// if (Array.prototype.slice == null) Array.prototype.slice = function (start,
// end) {
// if (start < 0) start = this.length + start; //'this' refers to the object to
// which the prototype is applied
// if (end == null) end = this.length;
// else if (end < 0) end = this.length + end;
// var newArray = [];
// for (var ct = 0, i = start; i < end; i++) newArray[ct++] = this[i];
// return newArray;
// }

// if (!Array.prototype.shift) { // if this method does not exist..
// Array.prototype.shift = function () {
// firstElement = this[0];
// this.reverse();
// this.length = Math.max(this.length - 1, 0);
// this.reverse();
// return firstElement;
// }

// }

// if (!Array.prototype.unshift) { // if this method does not exist..
// Array.prototype.unshift = function () {
// this.reverse();

// for (var i = arguments.length - 1; i >= 0; i--) {
// this[this.length] = arguments[i]
// }

// this.reverse();
// return this.length
// }
// }

// //This JavaScript library is copyright 2002 by Gavin Kistner and Refinery,
// Inc.
// //Reuse or modification permitted provided the previous line is included.
// //mailto:!@phrogz.net
// //http://www.refinery.com/

// /***************************************************************************************************
// * JavaScript Array Set Mathematics Library
// * version 1.2.1, April 26th, 2002 [IEMac5.1-/IEWin5.0-/OldNS .splice()
// replacement works properly]
// *
// * Methods: array1.union( array2 [,compareFunction] )
// * array1.subtract( array2 [,compareFunction] )
// * array1.intersect( array2 [,compareFunction] )
// * array1.exclusion( array2 [,compareFunction] )
// * array1.removeDuplicates( [compareFunction] )
// *
// * array1.unsortedUnion( array2 [,compareFunction] )
// * array1.unsortedSubtract( array2 [,compareFunction] )
// * array1.unsortedIntersect( array2 [,compareFunction] )
// * array1.unsortedExclusion( array2 [,compareFunction] )
// * array1.unsortedRemoveDuplicates( [compareFunction] )
// *
// *
// * Notes: All methods return a 'set' Array where duplicates have been removed.
// *
// * The union(), subtract(), intersect(), and removeDuplicates() methods
// * are faster than their 'unsorted' counterparts, but return a sorted set:
// * var a = ['a','e','c'];
// * var b = ['b','c','d'];
// * a.unsortedUnion(b) --> 'a','e','c','b','d'
// * a.union(b) --> 'a','b','c','d','e'
// *
// * Calling any of the methods on an array whose element pairs cannot all be
// * reliably ordered (objects for which a < b, a > b, and a==b ALL return
// false)
// * will produce inaccurate results UNLESS the (usually) optional
// * 'compareFunction' parameter is passed. This should specify a custom
// * comparison function, as required by the standard Array.sort(myFunc) method
// * For example:
// * var siblings = [ {name:'Dain'} , {name:'Chandra'} , {name:'Baird'} ,
// {name:'Linden'} ];
// * var brothers = [ {name:'Dain'} , {name:'Baird'} ];
// * function compareNames(a,b){ return (a.name < b.name)?-1:(a.name >
// b.name)?1:0 }
// * var sisters=siblings.unsortedSubtract(brothers, compareNames);
// *
// ***************************************************************************************************/

// if (Array.prototype.splice && typeof ([0].splice(0)) == "number")
// Array.prototype.splice = null;
// if (!Array.prototype.splice) Array.prototype.splice = function (ind, cnt) {
// var len = this.length;
// var arglen = arguments.length;
// if (arglen == 0) return ind;
// if (typeof (ind) != "number") ind = 0;
// else if (ind < 0) ind = Math.max(0, len + ind);
// if (ind > len) {
// if (arglen > 2) ind = len;
// else return [];
// }
// if (arglen < 2) cnt = len - ind;
// cnt = (typeof (cnt) == "number") ? Math.max(0, cnt) : 0;
// var removeArray = this.slice(ind, ind + cnt);
// var endArray = this.slice(ind + cnt);
// len = this.length = ind;
// for (var i = 2; i < arglen; i++) this[len++] = arguments[i];
// for (var i = 0, endlen = endArray.length; i < endlen; i++) this[len++] =
// endArray[i];
// return removeArray;
// }

// //*** SORTED IMPLEMENTATIONS
// ***************************************************
// Array.prototype.union = function (a2, compareFunction) {
// return this.concat(a2 ? a2 : null).removeDuplicates(compareFunction);
// }
// Array.prototype.subtract = function (a2, compareFunction) {
// if (!compareFunction) compareFunction = null;
// var a1 = this.removeDuplicates(compareFunction);
// if (!a2) return a1;
// var a2 = a2.removeDuplicates(compareFunction);
// var len2 = a2.length;
// if (compareFunction) {
// for (var i = 0; i < a1.length; i++) {
// var src = a1[i], found = false, src;
// for (var j = 0; j < len2 && compareFunction(src2 = a2[j], src) != 1; j++) if
// (compareFunction(src, src2) == 0) { found = true; break; }
// if (found) a1.splice(i--, 1);
// }
// } else {
// for (var i = 0; i < a1.length; i++) {
// var src = a1[i], found = false, src;
// for (var j = 0; (j < len2) && (src >= (src2 = a2[j])) ; j++) if (src2 == src)
// { found = true; break; }
// if (found) a1.splice(i--, 1);
// }
// }
// return a1;
// }
// Array.prototype.intersect = function (a2, compareFunction) {
// if (!compareFunction) compareFunction = null;
// var a1 = this.removeDuplicates(compareFunction);
// if (!a2) return a1;
// var a2 = a2.removeDuplicates(compareFunction);
// var len2 = a2.length;
// if (len2 < a1.length) {
// var c = a2; a2 = a1; a1 = c; c = null;
// len2 = a2.length;
// }
// if (compareFunction) {
// for (var i = 0; i < a1.length; i++) {
// var src = a1[i], found = false, src;
// for (var j = 0; j < len2 && compareFunction(src2 = a2[j], src) != 1; j++) if
// (compareFunction(src, src2) == 0) { found = true; break; }
// if (!found) a1.splice(i--, 1);
// }
// } else {
// for (var i = 0; i < a1.length; i++) {
// var src = a1[i], found = false, src;
// for (var j = 0; (j < len2) && (src >= (src2 = a2[j])) ; j++) if (src2 == src)
// { found = true; break; }
// if (!found) a1.splice(i--, 1);
// }
// }
// return a1;
// }
// Array.prototype.removeDuplicates = function (compareFunction) {
// if (!compareFunction) compareFunction = null;
// var a1 = this.concat().sort(compareFunction);
// if (compareFunction) {
// for (var i = 0; i < a1.length; i++) {
// var src = a1[i];
// for (var j = i + 1; j < a1.length && compareFunction(a1[j], src) == 0; j++) {
// }
// if (j - 1 > i) a1.splice(i + 1, j - i - 1);
// }
// } else {
// for (var i = 0; i < a1.length; i++) {
// var src = a1[i];
// for (var j = i + 1; j < a1.length && a1[j] == src; j++) { }
// if (j - 1 > i) a1.splice(i + 1, j - i - 1);
// }
// }
// return a1;
// }
// Array.prototype.exclusion = function (a2, compareFunction) {
// if (!compareFunction) compareFunction = null;
// var a1 = this.removeDuplicates(compareFunction);
// if (!a2) return a1;
// return a1.subtract(a2, compareFunction).concat(a2.subtract(a1,
// compareFunction)).sort(compareFunction);
// }

// //*** UNSORTED IMPLEMENTATIONS
// *************************************************
// Array.prototype.unsortedUnion = function (a2, compareFunction) {
// if (!compareFunction) compareFunction = null;
// return this.concat(a2 ? a2 : null).unsortedRemoveDuplicates(compareFunction);
// }
// Array.prototype.unsortedSubtract = function (a2, compareFunction) {
// if (!compareFunction) compareFunction = null;
// var a1 = this.unsortedRemoveDuplicates(compareFunction);
// if (!a2) return a1;
// var subtrahend = a2.unsortedRemoveDuplicates(compareFunction);
// if (compareFunction) {
// for (var i = 0; i < a1.length; i++) {
// var src = a1[i];
// for (var j = 0, len = subtrahend.length; j < len; j++) if
// (compareFunction(subtrahend[j], src) == 0) { a1.splice(i--, 1); break; }
// }
// } else {
// for (var i = 0; i < a1.length; i++) {
// var src = a1[i];
// for (var j = 0, len = subtrahend.length; j < len; j++) if (subtrahend[j] ==
// src) { a1.splice(i--, 1); break; }
// }
// }
// return a1;
// }
// Array.prototype.unsortedIntersect = function (a2, compareFunction) {
// if (!compareFunction) compareFunction = null;
// if (!a2) return this.unsortedRemoveDuplicates(compareFunction);
// var a1 = this;
// var len2 = a2.length;
// a1 = a1.unsortedRemoveDuplicates(compareFunction);
// if (compareFunction) {
// for (var i = 0; i < a1.length; i++) {
// var src = a1[i];
// for (var j = 0; j < len2; j++) if (compareFunction(a2[j], src) == 0) break;
// if (j == len2) a1.splice(i--, 1);
// }
// } else {
// for (var i = 0; i < a1.length; i++) {
// var src = a1[i];
// for (var j = 0; j < len2; j++) if (a2[j] == src) break;
// if (j == len2) a1.splice(i--, 1);
// }
// }
// return a1;
// }
// Array.prototype.unsortedRemoveDuplicates = function (compareFunction) {
// var a1 = this.concat();
// if (compareFunction) {
// for (var i = 0; i < a1.length; i++) {
// var src = a1[i];
// for (var j = i + 1; j < a1.length; j++) if (compareFunction(a1[j], src) == 0)
// a1.splice(j, 1);
// }
// } else {
// for (var i = 0; i < a1.length; i++) {
// var src = a1[i];
// for (var j = i + 1; j < a1.length; j++) if (a1[j] == src) a1.splice(j--, 1);
// }
// }
// return a1;
// }
// Array.prototype.unsortedExclusion = function (a2, compareFunction) {
// if (!compareFunction) compareFunction = null;
// var a1 = this.unsortedRemoveDuplicates(compareFunction);
// if (!a2) return a1;
// return a1.unsortedSubtract(a2,
// compareFunction).concat(a2.unsortedSubtract(a1,
// compareFunction)).sort(compareFunction);
// }
if (!Array.prototype.fill) {
  Array.prototype.fill = function(value) {

    // Steps 1-2.
    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    var O = Object(this);

    // Steps 3-5.
    var len = O.length >>> 0;

    // Steps 6-7.
    var start = arguments[1];
    var relativeStart = start >> 0;

    // Step 8.
    var k = relativeStart < 0 ?
      Math.max(len + relativeStart, 0) :
      Math.min(relativeStart, len);

    // Steps 9-10.
    var end = arguments[2];
    var relativeEnd = end === undefined ?
      len : end >> 0;

    // Step 11.
    var final = relativeEnd < 0 ?
      Math.max(len + relativeEnd, 0) :
      Math.min(relativeEnd, len);

    // Step 12.
    while (k < final) {
      O[k] = value;
      k++;
    }

    // Step 13.
    return O;
  };
}
if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}
if (!Array.prototype.find) {
	  Array.prototype.find = function(predicate) {
	    'use strict';
	    if (this == null) {
	      throw new TypeError('Array.prototype.find called on null or undefined');
	    }
	    if (typeof predicate !== 'function') {
	      throw new TypeError('predicate must be a function');
	    }
	    var list = Object(this);
	    var length = list.length >>> 0;
	    var thisArg = arguments[1];
	    var value;

	    for (var i = 0; i < length; i++) {
	      value = list[i];
	      if (predicate.call(thisArg, value, i, list)) {
	        return value;
	      }
	    }
	    return undefined;
	  };
	}
if (!Array.prototype.findIndex) {
	  Array.prototype.findIndex = function(predicate) {
	    if (this === null) {
	      throw new TypeError('Array.prototype.findIndex called on null or undefined');
	    }
	    if (typeof predicate !== 'function') {
	      throw new TypeError('predicate must be a function');
	    }
	    var list = Object(this);
	    var length = list.length >>> 0;
	    var thisArg = arguments[1];
	    var value;

	    for (var i = 0; i < length; i++) {
	      value = list[i];
	      if (predicate.call(thisArg, value, i, list)) {
	        return i;
	      }
	    }
	    return -1;
	  };
	}
if (!Array.prototype.includes) {
	  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
	    'use strict';
	    var O = Object(this);
	    var len = parseInt(O.length) || 0;
	    if (len === 0) {
	      return false;
	    }
	    var n = parseInt(arguments[1]) || 0;
	    var k;
	    if (n >= 0) {
	      k = n;
	    } else {
	      k = len + n;
	      if (k < 0) {k = 0;}
	    }
	    var currentElement;
	    while (k < len) {
	      currentElement = O[k];
	      if (searchElement === currentElement ||
	         (searchElement !== searchElement && currentElement !== currentElement)) {
	        return true;
	      }
	      k++;
	    }
	    return false;
	  };
	}
//Production steps of ECMA-262, Edition 5, 15.4.4.19
//Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

Array.prototype.map = function(callback, thisArg) {

 var T, A, k;

 if (this == null) {
   throw new TypeError(' this is null or not defined');
 }

 // 1. Let O be the result of calling ToObject passing the |this| 
 //    value as the argument.
 var O = Object(this);

 // 2. Let lenValue be the result of calling the Get internal 
 //    method of O with the argument "length".
 // 3. Let len be ToUint32(lenValue).
 var len = O.length >>> 0;

 // 4. If IsCallable(callback) is false, throw a TypeError exception.
 // See: http://es5.github.com/#x9.11
 if (typeof callback !== 'function') {
   throw new TypeError(callback + ' is not a function');
 }

 // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
 if (arguments.length > 1) {
   T = thisArg;
 }

 // 6. Let A be a new array created as if by the expression new Array(len) 
 //    where Array is the standard built-in constructor with that name and 
 //    len is the value of len.
 A = new Array(len);

 // 7. Let k be 0
 k = 0;

 // 8. Repeat, while k < len
 while (k < len) {

   var kValue, mappedValue;

   // a. Let Pk be ToString(k).
   //   This is implicit for LHS operands of the in operator
   // b. Let kPresent be the result of calling the HasProperty internal 
   //    method of O with argument Pk.
   //   This step can be combined with c
   // c. If kPresent is true, then
   if (k in O) {

     // i. Let kValue be the result of calling the Get internal 
     //    method of O with argument Pk.
     kValue = O[k];

     // ii. Let mappedValue be the result of calling the Call internal 
     //     method of callback with T as the this value and argument 
     //     list containing kValue, k, and O.
     mappedValue = callback.call(T, kValue, k, O);

     // iii. Call the DefineOwnProperty internal method of A with arguments
     // Pk, Property Descriptor
     // { Value: mappedValue,
     //   Writable: true,
     //   Enumerable: true,
     //   Configurable: true },
     // and false.

     // In browsers that support Object.defineProperty, use the following:
     // Object.defineProperty(A, k, {
     //   value: mappedValue,
     //   writable: true,
     //   enumerable: true,
     //   configurable: true
     // });

     // For best browser support, use the following:
     A[k] = mappedValue;
   }
   // d. Increase k by 1.
   k++;
 }

 // 9. return A
 return A;
};
}
if (!Array.of) {
	  Array.of = function() {
	    return Array.prototype.slice.call(arguments);
	  };
	}
if (!Array.prototype.reduce)
{
  Array.prototype.reduce = function(fun /*, inicial*/)
  {
    var longitud = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    // no se devuelve ningún valor si no hay valor inicial y el array está vacío
    if (longitud == 0 && arguments.length == 1)
      throw new TypeError();

    var indice = 0;
    if (arguments.length >= 2)
    {
      var rv = arguments[1];
    }
    else
    {
      do
      {
        if (indice in this)
        {
          rv = this[indice++];
          break;
        }

        // si el array no contiene valores, no existe valor inicial a devolver
        if (++indice >= longitud)
          throw new TypeError();
      }
      while (true);
    }

    for (; indice < longitud; indice++)
    {
      if (indice in this)
        rv = fun.call(null, rv, this[indice], indice, this);
    }

    return rv;
  };
}
if (!Array.prototype.reduceRight)
{
  Array.prototype.reduceRight = function(fun /*, inicial*/)
  {
    var longitud = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    // no se devuelve ningún valor si no hay valor inicial y el array está vacío
    if (longitud == 0 && arguments.length == 1)
      throw new TypeError();

    var indice = longitud - 1;
    if (arguments.length >= 2)
    {
      var rv = arguments[1];
    }
    else
    {
      do
      {
        if (indice in this)
        {
          rv = this[indice--];
          break;
        }

        // si el array no contiene valores, no existe valor incial a devolver
        if (--indice < 0)
          throw new TypeError();
      }
      while (true);
    }

    for (; indice >= 0; indice--)
    {
      if (indice in this)
        rv = fun.call(null, rv, this[indice], indice, this);
    }

    return rv;
  };
}
if (typeof Boolean.prototype.XOR != "function")
    Boolean.prototype.XOR = function (bool2) {
        var bool1 = this.valueOf();
        return (bool1 === true && bool2 === false) || (bool2 === true && bool1 === false);
        //return (bool1 && !bool2) || (bool2 && !bool1);
    };
if (typeof Date.prototype.customFormat != "function")
    Date.prototype.customFormat = function (formatString) {
        var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhh, hh, h, mm, m, ss, s, ampm, dMod, th;
        YY = ((YYYY = this.getFullYear()) + "").substr(2, 2);
        MM = (M = this.getMonth() + 1) < 10 ? ('0' + M) : M;
        MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substr(0, 3);
        DD = (D = this.getDate()) < 10 ? ('0' + D) : D;
        DDD = (DDDD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.getDay()]).substr(0, 3);
        th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
        formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);

        h = (hhh = this.getHours());
        if (h === 0) h = 24;
        if (h > 12) h -= 12;
        hh = h < 10 ? ('0' + h) : h;
        ampm = hhh < 12 ? 'am' : 'pm';
        mm = (m = this.getMinutes()) < 10 ? ('0' + m) : m;
        ss = (s = this.getSeconds()) < 10 ? ('0' + s) : s;
        return formatString.replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm);
    };
//var now = new Date();
//alert("Today is " + now.customFormat('#DDDD#, #MMMM# #D##th#') + "\nThe time is " + now.customFormat('#h#:#mm##ampm#') + ".");
if (typeof Date.prototype.to12HourTimeString != "function")
    Date.prototype.to12HourTimeString = function () {
        var h = this.getHours();
        var m = "0" + this.getMinutes();
        var s = "0" + this.getSeconds();

        var ap = "am";

        if (h >= 12) {
            ap = "pm";

            if (h >= 13)
                h -= 12;
        } else if (h === 0)
            h = 12;

        h = "0" + h;
        return h.slice(-2) + ":" +
          m.slice(-2) + ":" +
          s.slice(-2) + " " + ap;
    };
if (typeof Date.prototype.to24HourTimeString != "function")
    Date.prototype.to24HourTimeString = function () {
        var h = "0" + this.getHours();
        var m = "0" + this.getMinutes();
        var s = "0" + this.getSeconds();
        return h.slice(-2) + ":" + m.slice(-2) + ":" + s.slice(-2);
    };
if (typeof Date.prototype.lastday != "function")
    Date.prototype.lastday = function () {
        var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
        return d.getDate();
    }; Date.DAYNAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (typeof Date.now != "function")
    Date.now = function (format) {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        if (month.toString().length == 1) {
            var month = '0' + month;
        }
        if (day.toString().length == 1) {
            var day = '0' + day;
        }
        if (hour.toString().length == 1) {
            var hour = '0' + hour;
        }
        if (minute.toString().length == 1) {
            var minute = '0' + minute;
        }
        if (second.toString().length == 1) {
            var second = '0' + second;
        }
        var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        return dateTime;
    };
Date.MONTHNAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

Date.msPERDAY = 1000 * 60 * 60 * 24;

Date.prototype.DAYNAMES = Date.DAYNAMES;

Date.prototype.MONTHNAMES = Date.MONTHNAMES;

Date.prototype.msPERDAY = Date.msPERDAY;
if (typeof Date.prototype.copy != "function")
    Date.prototype.copy = function () {
        return new Date(this.getTime());
    };
if (typeof Date.prototype.getFullDay != "function")
    Date.prototype.getFullDay = function () {
        return this.DAYNAMES[this.getDay()];
    };
if (typeof Date.prototype.getDayAbbr != "function")
    Date.prototype.getDayAbbr = function () {
        return this.getFullDay().slice(0, 3);
    };
if (typeof Date.prototype.getFullMonth != "function")
    Date.prototype.getFullMonth = function () {
        return this.MONTHNAMES[this.getMonth()];
    };
if (typeof Date.prototype.getMonthAbbr != "function")
    Date.prototype.getMonthAbbr = function () {
        return this.getFullMonth().slice(0, 3);
    };
if (typeof Date.prototype.to12HourTimeString != "function")
    Date.prototype.to12HourTimeString = function () {
        var h = this.getHours();
        var m = "0" + this.getMinutes();
        var s = "0" + this.getSeconds();
        var ap = "am";
        if (h >= 12) {
            ap = "pm";
            if (h >= 13)
                h -= 12;
        } else if (h === 0) {
            h = 12;
        }
        h = "0" + h;
        return h.slice(-2) + ":" + m.slice(-2) + ":" + s.slice(-2) + " " + ap;
    };
if (typeof Date.prototype.to24HourTimeString != "function")
    Date.prototype.to24HourTimeString = function () {
        var h = "0" + this.getHours();
        var m = "0" + this.getMinutes();
        var s = "0" + this.getSeconds();
        return h.slice(-2) + ":" + m.slice(-2) + ":" + s.slice(-2);
    };
if (typeof Date.prototype.lastday != "function")
    Date.prototype.lastday = function () {
        var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
        return d.getDate();
    };
if (typeof Date.prototype.getDaysBetween != "function")
    Date.prototype.getDaysBetween = function (d) {
        var tmp = d.copy();
        tmp.setHours(this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
        var diff = tmp.getTime() - this.getTime();
        return diff / this.msPERDAY;
    };
if (typeof Date.prototype.getDayOfYear != "function")
    Date.prototype.getDayOfYear = function () {
        var start = new Date(this.getFullYear(), 0, 0);
        return this.getDaysBetween(start) * -1;
    };
if (typeof Date.prototype.addDays != "function")
    Date.prototype.addDays = function (d) {
        this.setDate(this.getDate() + d);
    };
if (typeof Date.prototype.addWeeks != "function")
    Date.prototype.addWeeks = function (w) {
        this.addDays(w * 7);
    };
if (typeof Date.prototype.addMonths != "function")
    Date.prototype.addMonths = function (m) {
        var d = this.getDate();
        this.setMonth(this.getMonth() + m);
        if (this.getDate() < d)
            this.setDate(0);
    };
if (typeof Date.prototype.addYears != "function")
    Date.prototype.addYears = function (y) {
        var m = this.getMonth();
        this.setFullYear(this.getFullYear() + y);
        if (m < this.getMonth()) {
            this.setDate(0);
        }
    };
if (typeof Date.prototype.addWeekDays != "function")
    Date.prototype.addWeekDays = function (d) {
        var startDay = this.getDay();  //current weekday 0 thru 6
        var wkEnds = 0;                //# of weekends needed
        var partialWeek = d % 5;       //# of weekdays for partial week
        if (d < 0) {                 //subtracting weekdays
            wkEnds = Math.ceil(d / 5); //negative number weekends
            switch (startDay) {
                case 6:                  //start Sat. 1 less weekend
                    if (partialWeek === 0 && wkEnds < 0)
                        wkEnds++;
                    break;
                case 0:                   //starting day is Sunday
                    if (partialWeek === 0)
                        d++;              //decrease days to add
                    else
                        d--;              //increase days to add
                    break;
                default:
                    if (partialWeek <= -startDay)
                        wkEnds--;
            }
        } else if (d > 0) {            //adding weekdays
            wkEnds = Math.floor(d / 5);
            var w = wkEnds;
            switch (startDay) {
                case 6:
                    /* If staring day is Sat. and
                     * no partial week one less day needed
                     * if partial week one more day needed
                     */
                    if (partialWeek === 0)
                        d--;
                    else
                        d++;
                    break;
                case 0:        //Sunday
                    if (partialWeek === 0 && wkEnds > 0)
                        wkEnds--;
                    break;
                default:
                    if (5 - day < partialWeek)
                        wkEnds++;
            }
        }
        d += wkEnds * 2;
        this.addDays(d);
    };
if (typeof Date.prototype.getWeekDays != "function")
    Date.prototype.getWeekDays = function (d) {
        var wkEnds = 0;
        var days = Math.abs(this.getDaysBetween(d));
        var startDay = 0, endDay = 0;
        if (days) {
            if (d < this) {
                startDay = d.getDay();
                endDay = this.getDay();
            } else {
                startDay = this.getDay();
                endDay = d.getDay();
            }
            wkEnds = Math.floor(days / 7);
            if (startDay != 6 && startDay > endDay)
                wkEnds++;
            if (startDay != endDay && (startDay == 6 || endDay == 6))
                days--;
            days -= (wkEnds * 2);
        }
        return days;
    };
if (typeof Date.prototype.getMonthsBetween != "function")
    Date.prototype.getMonthsBetween = function (d) {
        var sDate, eDate;
        var d1 = this.getFullYear() * 12 + this.getMonth();
        var d2 = d.getFullYear() * 12 + d.getMonth();
        var sign;
        var months = 0;
        if (this == d) {
            months = 0;
        } else if (d1 == d2) { //same year and month
            months = (d.getDate() - this.getDate()) / this.lastday();
        } else {
            if (d1 < d2) {
                sDate = this;
                eDate = d;
                sign = 1;
            } else {
                sDate = d;
                eDate = this;
                sign = -1;
            }
            var sAdj = sDate.lastday() - sDate.getDate();
            var eAdj = eDate.getDate();
            var adj = (sAdj + eAdj) / sDate.lastday() - 1;
            months = Math.abs(d2 - d1) + adj;
            months = (months * sign);
        }
        return months;
    };
if (typeof Date.prototype.getYearsBetween != "function")
    Date.prototype.getYearsBetween = function (d) {
        var months = this.getMonthsBetween(d);
        return months / 12;
    };
if (typeof Date.prototype.getAge != "function")
    Date.prototype.getAge = function () {
        var today = new Date();
        return this.getYearsBetween(today).toFixed(2);
    };
if (typeof Date.prototype.sameDayEachWeek != "function")
    Date.prototype.sameDayEachWeek = function (day, date) {
        var aDays = [];
        var eDate, nextDate, adj;
        if (this > date) {
            eDate = this;
            nextDate = date.copy();
        } else {
            eDate = date;
            nextDate = this.copy();
        }
        adj = (day - nextDate.getDay() + 7) % 7;
        nextDate.setDate(nextDate.getDate() + adj);
        while (nextDate < eDate) {
            aDays[aDays.length] = nextDate.copy();
            nextDate.setDate(nextDate.getDate() + 7);
        }
        return aDays;
    };
if (typeof Date.prototype.toDate != "function")
    Date.toDate = function (d) {
        var newDate;
        if (arguments.length === 0) {
            newDate = new Date();
        } else if (d instanceof Date) {
            newDate = new Date(d.getTime());
        } else if (typeof d == "string") {
            newDate = new Date(d);
        } else if (arguments.length >= 3) {
            var dte = [0, 0, 0, 0, 0, 0];
            for (var i = 0; i < arguments.length && i < 7; i++) {
                dte[i] = arguments[i];
            }
            newDate = new Date(dte[0], dte[1], dte[2], dte[3], dte[4], dte[5]);
        } else if (typeof d == "number") {
            newDate = new Date(d);
        } else {
            newDate = null;
        }
        if (newDate == "Invalid Date")
            return null;
        else
            return newDate;
    };
JSON.flatten = function (data) {
    var result = {};
    var results = [];
    if (data instanceof Array) {
        var i = 0;
        for (i = 0; i < data.length; i++) {
            result = {};
            recurse(data[i], "");
            results.push(result);
        };
        return results;
    }
    else {
        recurse(data, "");
        return result;
    }
    function recurse(cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for (var i = 0, l = cur.length; i < l; i++)
                recurse(cur[i], prop + "[" + i + "]");
            if (l == 0) result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + "." + p : p);
            }
            if (isEmpty && prop) result[prop] = {};
        }
    }
};
JSON.unflatten = function (data) {
    "use strict";
    if (Object(data) !== data || Array.isArray(data)) return data;
    var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};
    for (var p in data) {
        var cur = resultholder,
            prop = "",
            m;
        while (m = regex.exec(p)) {
            cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
            prop = m[2] || m[1];
        }
        cur[prop] = data[p];
    }
    return resultholder[""] || resultholder;
};
if (typeof Number.prototype.toCurrency != "function")
    Number.prototype.toCurrency = function (noFractions, currencySymbol, decimalSeparator, thousandsSeparator) {
        var n, startAt, intLen;
        if (currencySymbol === null) currencySymbol = "$";
        if (decimalSeparator === null) decimalSeparator = ".";
        if (thousandsSeparator === null) thousandsSeparator = ",";
        n = this.round(noFractions ? 0 : 2, true, decimalSeparator);
        intLen = n.length - (noFractions ? 0 : 3);
        if ((startAt = intLen % 3) === 0) startAt = 3;
        for (var i = 0, len = Math.ceil(intLen / 3) - 1; i < len; i++) n = n.insertAt(i * 4 + startAt, thousandsSeparator);
        return currencySymbol + n;
    };
if (typeof Number.prototype.toInteger != "function")
    Number.prototype.toInteger = function (thousandsSeparator) {
        var n, startAt, intLen;
        if (thousandsSeparator === null) thousandsSeparator = ",";
        n = this.round(0, true);
        intLen = n.length;
        if ((startAt = intLen % 3) === 0) startAt = 3;
        for (var i = 0, len = Math.ceil(intLen / 3) - 1; i < len; i++) n = n.insertAt(i * 4 + startAt, thousandsSeparator);
        return n;
    };
if (typeof Number.prototype.round != "function")
    Number.prototype.round = function (decimals, returnAsString, decimalSeparator) {
        //Supports 'negative' decimals, e.g. myNumber.round(-3) rounds to the nearest thousand
        var n, factor, breakPoint, whole, frac;
        if (!decimals) decimals = 0;
        factor = Math.pow(10, decimals);
        n = (this.valueOf() + "");         //To get the internal value of an Object, use the valueOf() method
        if (!returnAsString) return Math.round(n * factor) / factor;
        if (!decimalSeparator) decimalSeparator = ".";
        if (n === 0) return "0." + ((factor + "").substr(1));
        breakPoint = (n = Math.round(n * factor) + "").length - decimals;
        whole = n.substr(0, breakPoint);
        if (decimals > 0) {
            frac = n.substr(breakPoint);
            if (frac.length < decimals) frac = (Math.pow(10, decimals - frac.length) + "").substr(1) + frac;
            return whole + decimalSeparator + frac;
        } else return whole + ((Math.pow(10, -decimals) + "").substr(1));
    };
if (typeof Number.prototype.withCommas != "function")
    Number.prototype.withCommas = function () {
        return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
if (typeof Object.prototype.getId32 != "function")
    if (typeof Object.getId32 !== 'function') {
        Object.getId32 = function () {
            if (this === undefined || this === null || this <= 0 || this === '' || this == ' ') return 0;
            else return this;
        };
    }
if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target, firstSource) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) == str;
    };
}
if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str) {
        return this.slice(-str.length) == str;
    };
}
if (typeof String.prototype.insertAt != 'function') {
    String.prototype.insertAt = function (loc, strChunk) {
        return (this.valueOf().substr(0, loc)) + strChunk + (this.valueOf().substr(loc));
    };
}
if (typeof String.prototype.isEmpty != 'function') {
    String.prototype.isEmpty = function () {
        return (this.length === 0 || !this.trim());
    };
}
if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}
if (!String.isNullOrWhiteSpace) {
    String.isNullOrWhiteSpace= function(value){
  	 return /(^undefined$|^null$|^\s+$|^$)/gi.test(value);
  };
}
if (!String.prototype.toDateString) {
    String.prototype.toDateString = function (format) {
        if (this === null || this === "") return "";
        var date = new Date(this);
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based         
        var dd = (date.getDate() + 1).toString();
        if (format === "yyyy-mm-dd")
            return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
        else if (format === "dd-mm-yyyy")
            return (dd[1] ? dd : "0" + dd[0]) + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + yyyy;
        else if (format === "mm-dd-yyyy")
            return (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]) + '-' + yyyy;
    };
}
if (!String.prototype.replaceBlankWith) {
    String.prototype.replaceBlankWith = function (replacer) {
        if (this === null) return null;
        replacer = replacer || " ";
        return this.replace(/\n/g, "").replace(/[\t ]+\</g, replacer).replace(/\>[\t ]+\</g, replacer).replace(/\>[\t ]+$/g, replacer);
    };
}
if (!String.prototype.trimEnd) {
    String.prototype.trimEnd = function (trim) {
        return this.replace(/,\s*$/, "");
    };
}
if (!String.prototype.trimStart) {
    String.prototype.trimStart = function (trim) {
        return this.replace(/^\s*,/g, '');
    };
}
if (!String.prototype.trimStartEnd) {
    String.prototype.trimStartEnd = function (trim) {
        return this.replace(/^,|,$/g, '');
    };
}
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}