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
