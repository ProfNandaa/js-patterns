/*-- Classical vs. Modern Inheritance Patterns --*/

//the parent constructor
function Parent(name) {
	this.name = name | 'Adam';
}

//adding functionality to the prototype
Parent.prototype.say = function () {
	return this.name;
}

//empty child constructor
function Child(name) {}

//Inheritance magic happens here
inherit(Child, Parent);

//approaches to implementing the inherit function

// #1 - The Default Patterns
/*
The default method most commonly used is to create an object 
using the Parent() constructor and assign this object to 
the Child() ’s prototype
*/

function inherit(C, P) {
	C.prototype = new P();
}

var kid = new Child();
kid.say(); // "Adam"

/*
One drawback of this pattern is that you inherit both own 
properties added to this and prototype properties. Most of 
the time you don’t want the own properties, because
they are likely to be specific to one instance and not reusable.
*/

// #2 - Rent-a-Constructor
