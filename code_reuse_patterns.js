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
/*
This next pattern solves the problem of passing arguments from 
the child to the parent. It borrows the parent constructor, 
passing the child object to be bound to this and also
forwarding any arguments:
*/

function Child(a, b, c, d) {
	Parent.apply(this, arguments);
}

// Example

// parent constructor
function Article() {
	this.tags = ['js', 'css'];
}

var article = new Article();

// a blog-post inherits from an article object
// via classical pattern #1

function BlogPost() {}
BlogPost.prototype = article;
var blog = new BlogPost();

// notice that above you didn't need `new Article()`
// because you already had an instance available

// a static page inherits from article
// via the rented constructor pattern

function StaticPage() {
	Article.call(this);
}

var page = new StaticPage();

console.log(article.hasOwnProperty('tags')); // true
console.log(blog.hasOwnProperty('tags')); // false
console.log(page.hasOwnProperty('tags')); // true

// notice the difference when modifying the inherited
// `tags` property

blog.tags.push('html');
page.tags.push('php');

console.log(article.tags.join(', ')); // "js, css, html"

// Multiple inheritance by Borrowing Constructors

/*
Using the borrowing constructors patterns, it’s possible 
to implement multiple inheritance simply by borrowing 
from more than one constructor:
*/

function Cat() {
	this.legs = 4;
	this.say = function () {
		return "meaowww";
	}
}

function Bird() {
	this.wings = 2;
	this.fly = true;
}

function CatWings() {
	Cat.apply(this);
	Bird.apply(this);
}

var jane = new CatWings();
console.log(jane);

/*
The drawback of this pattern is that nothing from 
the prototype gets inherited and the prototype is the 
place to add reusable methods and properties, 
which will not be re-created for every instance.

A benefit is that you get true copies of the parent’s own 
members, and there’s no risk that a child can accidentally 
overwrite a parent’s property.
*/

// #3 - Rent and Set Prototype

function Child(a, b, c, d) {
	Parent.apply(this, arguments);
}

Child.prototype = new Parent();

/*
A drawback is that the parent constructor is called twice, 
so it could be inefficient. At the end, the own properties 
(such as name in our case) get inherited twice.
*/

// #4 - Share the Prototype

/*
So you can just set the child’s prototype to be the same 
as the parent’s prototype:
*/

function inherit(C, P) {
	C.prototype = P.prototype;
}

/*
This gives you short and fast prototype chain lookups 
because all objects actually share the same prototype. 
But that’s also a drawback because if one child or grandchild
somewhere down the inheritance chain modifies the prototype, 
it affects all parents and grandparents.
*/

// #5 - A Temporary Constructor

function inherit(C, P) {
	var F = function () {};
	F.prototype = P.prototype;
	C.prototype = new F();
}

/*
here the child only inherits properties of the prototype.
In this pattern, any members that the parent constructor adds
to this are not inherited.
*/

//storing superclass and resetting the constructor pointer

function inherit(C, P) {
	var F = function () {};
	F.prototype = P.prototype;
	C.prototype = new F();
	C.uber = P.prototype;
	C.prototype.constructor = C;
}

// Addition to ES5 - Object.create()

var parent = new Parent();

var child = Object.create(parent);

var child = Object.create(parent, {
	age: { value: 2} // ES5 descriptor
});

child.hasOwnProperty("age"); // true

// Inheritance by Copying Properties

function extend(parent, child) {
	var i;
	child = child || {};
	for (i in parent) {
		if (parent.hasOwnProperty(i)) {
			child[i] = parent[i];
		}
		return child;
	}
}

/*
let’s modify the extend() function to make deep copies. 
All you need is to check if a property’s type is an object, 
and if so, recursively copy its properties.
*/

function extendDeep(parent, child) {
	var i,
			toStr = Object.prototype.toString,
			astr = "[object Array]";

	child = child || {};

	for (i in parent) {
		if (parent.hasOwnProperty(i)) {
			if (typeof parent[i] === "object") {
				child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
				extendDeep(parent[i], child[i]);
			} else {
				child[i] = parent[i];
			}
		}
	}
	return child;
}

// Mixins

/*
Instead of copying from one object, you can copy from 
any number of objects and mix them all into a new object.

The implementation is simple; just loop through arguments 
and copy every property of every object passed to the function:
*/

function mix() {
	var arg, prop, child = {};
	for (arg = 0; arg < arguments.length; arg += 1) {
		for (prop in arguments[arg]) {
			if (arguments[arg].hasOwnProperty(prop)) {
				child[prop] = arguments[arg][prop];
			}
		}
	}
	return child;
}

var cake = mix(
	{eggs: 2, large: true},
	{butter: 1, salted: true},
	{flour: "3 cups"},
	{sugar: "sure!"}
);

console.log(cake);

// Borrowing methods

/*
You want to use just the methods you like, without 
inheriting all the other methods that you’ll never need.

Use call() or apply()
*/

// Example: Borrow from Array

function f() {
	var args = [].slice.call(arguments, 1, 3);
	return args;
}

console.log(f(1, 2, 3, 4, 5, 6)); // returns [2, 3]

// Borrow and Bind

var one = {
	name: "object",
	say: function (greet) {
		return greet + ", " + this.name;
	}
}

var two = {
	name: "another object"
};

one.say.apply(two, ['hello']); // "hello, another object"

var say = one.say;
say('hoho'); // "hoho, undefined"

// passing as a callback
var yetanother = {
	name: "Yet another object",
	method: function (callback) {
		return callback('Holla');
	}
};

yetanother.method(one.say); // Holla, undefined

/*
In both of the above cases this inside say() was 
pointing to the global object, and the whole
snippet didn’t work as expected To bind an object to a method,
we can use a simple function like this:
*/

function bind(o, m) {
	return function () {
		return m.apply(o, [].slice.call(arguments));
	}
}

/*
This bind() function accepts an object o and a method m , 
binds the two together, and then returns another function. 
The returned function has access to o and m via a closure.
*/

var twosay = bind(two, one.say);
twosay('yo'); // "yo, yet another object"

/*
As you can see, even though twosay() was created as a global 
function, this didn’t point to the global object, but it 
pointed to object two , which was passed to bind().
*/

// Function.prototype.bind()

/*
ES5 adds a method bind() to Function.prototype , making it 
just as easy to use as apply() and call(). 
So you can do expressions like:
*/

var newFunc = obj.someFunc.bind(myobj, 1, 2, 3);