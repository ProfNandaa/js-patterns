/*-- Singleton --*/
/*
The idea of the singleton pattern is to have only 
one instance of a specific class.
*/

var obj = {
	myprop: 'my value'
}

var obj2 = {
	myprop: 'my value'
}

obj === obj2; // false
obj == obj2; 	// false

// So every time you create an object using an object
// literal, you are creating a singleton.

// using new

var uni = new Universe();
var uni2 = new Universe();
uni == uni2; // true

// 1. instance as a static property

function Universe() {
	// do we have an existing instance?
	if (typeof Universe.instance === "object") {
		return Universe.instance;
	}

	// proceed as normal
	this.start_time = 0;
	this.bang = "Big";

	// cache
	Universe.instance = this;

	// implicit return
	// return this;
}

// testing
var uni = new Universe();
var uni2 = new Universe();
console.log(uni == uni2); // true

console.log(uni);

/*
this is a straightforward solution with the only drawback 
that instance is public.
*/

// 2. instance in a closure

function Universe() {
	// the cached instance
	var instance;

	// rewrite the constructor
	Universe = function () {
		return instance;
	}

	// cary over the prototype properties
	Universe.prototype = this;

	// the instance
	instance = new Universe;

	// reset the constructor pointer
	instance.constructor = Universe;

	// All the functionality
	this.start_time = 0;
	this.big = "Bang";

	return instance;
}

/*-- Factory --*/

// Example:

// parent constructor
function CarMaker() {}

// a method of the parent
CarMaker.prototype.drive = function () {
	return "Vroom, I have " + this.doors + " doors";
}

// the static factory method
CarMaker.factory = function (type) {
	var constr = type,
			newcar;

	// error if the constructor doesn't exist
	if (typeof CarMaker[constr] !== "function") {
		throw {
			name: "Error",
			message: constr + " doesn't exist"
		};
	}

	// at this point, the constructor is known to exist
	// let's have it inherit the parent but only once
	if (typeof CarMaker[constr].prototype.drive !== "function") {
		CarMaker[constr].prototype = new CarMaker();
	}

	// create a new instance
	newcar = new CarMaker[constr]();

	// optionally, call some methods then return...
	return newcar;
};

// define specific car makers
CarMaker.Compact = function () {
	this.doors = 4;
}

CarMaker.Convertible = function () {
	this.doors = 2;
}

CarMaker.SUV = function () {
	this.doors = 24;
}

// Object implements the factory pattern

var o = new Object(),
		n = new Object(1),
		s = Object('1'),
		b = Object(true);

// test
o.constructor === Object; // true
n.constructor === Number; // true
s.constructor === String; // true
b.constructor === Boolean; // true


/*-- Iterator --*/

// Example
var agg = (function () {

	var index = 0,
			data = [1, 2, 3, 4, 5],
			length = data.length;

	return {
		next: function () {
			var element;
			if (!this.hasNext()) {
				return null;
			}
			element = data[index];
			index = index + 2;
			return element;
		},
		hasNext: function () {
			return index < length;
		},
		rewind: function () {
			index = 0;
		},
		current: function () {
			return data[index];
		}
	};
}());

while (agg.hasNext()) {
	console.log(agg.next());
}

// go back
agg.rewind();

console.log(agg.current());

/*-- Decorator --*/
/*
In the decorator pattern, additional functionality can 
be added to an object dynamically, at runtime.
*/

// Example
function Sale(price) {
	this.price = price || 100;
}

Sale.prototype.getPrice = function () {
	return this.price;
}

// The decorator objects will be implemented as properties
// of a constructor property:

Sale.decorators = {};

Sale.decorators.fedtax = {
	getPrice: function () {
		var price = this.uber.getPrice();
		price += price * 5 / 100;
		return price;
	}
};

Sale.decorators.money = {
	getPrice: function () {
		return "$" + this.uber.getPrice().toFixed(2);
	}
};

Sale.decorators.cdn = {
	getPrice: function () {
		return "CDN$" + this.uber.getPrice().toFixed(2);
	}
}

Sale.protototype.decorate = function (decorator) {
	var F = function () {},
			overrides = this.constructor.decorators[decorator],
			i, newobj;

	F.prototype = this;
	newobj = new F();
	newobj.uber = F.prototype;
	for (i in overrides) {
		if (overrides.hasOwnProperty(i)) {
			newobj[i] = overrides[i];
		}
	}

	return newobj;
}

// implementation using a list

function SaleX(price) {
	this.price = (price > 0) ? price : 100;
	this.decorators_list = [];
}

SaleX.decorators = {};

SaleX.decorators.fedtax = {
	getPrice: function (price) {
		return price + price * 5 / 100;
	}
};

SaleX.decorators.quebec = {
	getPrice: function (price) {
		return price + price * 7.5 / 100;
	}
};

SaleX.decorators.money = {
	getPrice: function (price) {
		return "$" + price.toFixed(2);
	}
};

SaleX.prototype.decorate = function (decorator) {
	this.decorators_list.push(decorator);
};

SaleX.prototype.getPrice = function () {
	var price = this.price,
			i,
			max = this.decorators_list.length,
			name;

	for (i = 0; i < max; i += 1) {
		name = this.decorators_list[i];
		price = SaleX.decorators[name].getPrice(price);
	}

	return price;
}

/*-- Facade --*/
/*
So instead of duplicating the two method calls all over 
the application, you can create a façade method that calls
both of them.
*/

var myevent = {
	// ...
	stop: function (e) {
		e.preventDefault();
		e.stopPropagation();
	}
	// ...
}

/*-- Proxy --*/
/*
One object acts as an interface to another object.
*/


