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



