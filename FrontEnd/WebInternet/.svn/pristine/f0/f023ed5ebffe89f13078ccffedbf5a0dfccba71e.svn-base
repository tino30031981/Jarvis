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