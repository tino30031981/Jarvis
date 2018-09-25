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