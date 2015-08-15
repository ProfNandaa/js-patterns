//omitting 'new' - antipattern

function Waffle() {
  this.tastes = "yummy";
}

//a new object
var good_morning = new Waffle();
console.log(typeof good_morning); //"object"
console.log(good_morning.tastes); //"yummy"

//antipattern: forgotten 'new'
var good_morning = Waffle();
console.log(typeof good_morning); //"undefined"
console.log(global.tastes); //"yummy", since this --> window(browser)
                            //or global(Node)

//using 'that' (convention), to make sure that the constructor works
//fine, howerver it is called

function Waffle() {
  var that = {};
  that.tastes = "yummy";
  return that;
}

var first = new Waffle(),
    second = Waffle();

console.log(first.tastes); //"yummy"
console.log(second.tastes); //"yummy"

/*
The problem with this pattern is that the link to the prototype is lost,
so any members you add to the Waffle() prototype will not be available
to the objects.
*/

/* -- Self-invoking Constructor --*/
/* To address the drawback of the previous pattern and have prototype
 properties available to the instance objects, consider the
 following approach.
*/

function Waffle() {
  if (!(this instanceof Waffle)) {
    return new Waffle();
  }

  this.tastes = "yummy";
}

Waffle.prototype.wantAnother = true;

//testing invocations
var first = new Waffle(),
    second = Waffle();

console.log(first.wantAnother); //true
console.log(second.wantAnother); //true

/*
Another general-purpose way to check the instance is to compare with
arguments.callee instead of hard-coding the constructor name.

Though arguments.callee is not allowed in ES5!!
*/

function Waffle() {
  if (!(this instanceof arguments.callee)) {
    return new arguments.callee();
  }

  this.tastes = "yummy";
}

//checking for 'arrayness'

var a = [1,5,7];

console.log(typeof a); //"object" --> not so helpful

//correct way
console.log(Array.isArray(a)); //true

/* -- Working with JSON -- */
var b = {
  name: 'Anthony',
  year: 2015,
  class: 'XI'
}

var b_json = JSON.stringify(b);
console.log(b_json);

var c = JSON.parse(b_json);
console.log(c);

/* -- primitives vs. objects for - Number, String --*/


// primitive string
var greet = "Hello there";
// primitive is converted to an object
// in order to use the split() method
console.log(greet.split(' ')[0]); // "Hello"
// attemting to augment a primitive is not an error
greet.smile = true;
// but it doesn't actually work
console.log(typeof greet.smile); // "undefined"
