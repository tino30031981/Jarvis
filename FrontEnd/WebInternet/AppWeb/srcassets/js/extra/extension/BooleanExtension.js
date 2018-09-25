if (typeof Boolean.prototype.XOR != "function")
    Boolean.prototype.XOR = function (bool2) {
        var bool1 = this.valueOf();
        return (bool1 === true && bool2 === false) || (bool2 === true && bool1 === false);
        //return (bool1 && !bool2) || (bool2 && !bool1);
    };