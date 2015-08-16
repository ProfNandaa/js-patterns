/*-- Namespace Pattern --*/

/*
Namespaces help reduce the number of globals required by
our programs and at the same time also help avoid naming
collisions or excessive name prefixing.
*/

//1 global

//global object
var MYAPP = {};

//constructors
MYAPP.Parent = function () {};
MYAPP.Child = function () {};

//a variable
MYAPP.some_var = 1;

//an object container
MYAPP.modules = {};

//nested objects
MYAPP.modules.module1 = {};
MYAPP.modules.module1.date = {a: 1, b: 2};
MYAPP.modules.module2 = {};

/*-- General Purpose Namespace Function --*/
/*
Before adding a property or creating a namespace,
it’s best to check first that it doesn’t already
exist, as shown in this example:
*/

if (typeof MYAPP === "undefined") {
  var MYAPP = {};
}

//or (shorter)

var MYAPP = MYAPP || {};

//using a namespace function

// MYAPP.namespace('MYAPP.modules.module3');

// equivalent to
// var MYAPP = {
//   modules: {
//     module3: {}
//   }
// };

MYAPP.namespace = function (ns_string) {
  var parts = ns_string.split('.'),
      parent = MYAPP,
      i;

  // strip redudant leading global
  if (parts[0] === "MYAPP") {
    parts = parts.slice(1);
  }

  for (i = 0; i < parts.length; i += 1) {
    // create a property if it doesn't exist
    if (typeof parent[parts[i]] === "undefined") {
      parent[parts[i]] = {};
    }
    parent = parent[parts[i]];
  }

  return parent;
}

MYAPP.namespace("MYAPP.modules.module3");

console.log(MYAPP);

/*-- Declaring Dependacies --*/
/*
It’s a good idea to declare the modules your code relies on
at the top of your function or module. The declaration involves
creating only a local variable and pointing to the desired module:
*/

/*
When following this dependency declaration pattern, the global symbol
resolution is performed only once in the function. After that the local
variable is used, which is much faster.
*/

//e.g.

var myFunction = function () {
  //dependencies
  var event = YAHOO.util.Event,
      dom = YAHOO.util.Dom;

  // use event and dom variables
  // for the rest of the function
}

/*-- Private Properties and Methods --*/

/*
Although the language doesn’t have special syntax for private members,
you can implement them using a closure. Your constructor functions
create a closure and any variables that are part of the closure scope
are not exposed outside the constructor.
*/

function Gadget() {
  // private member
  var name = "iPod";

  //public function
  this.getName = function () {
    return name;
  }
}

var toy = new Gadget();

console.log(toy.name); // undefined
console.log(toy.getName()); // "iPod"

/*
In the previous example, getName() is a privileged method
because it has “special” access to the private property name .
*/

/* Privacy Failure - When you’re directly returning a private variable
from a privileged method and this variable happens to be an object or array,
then outside code can modify the private variable because it’s passed
by reference.
*/

function Phone() {
  // private member
  var specs = {
    screen_width: 320,
    screen_height: 480,
    color: "white"
  }

  // public function
  this.getSpecs = function () {
    return specs;
  }
}

/*
The problem here is that getSpecs() returns a reference to
the specs object. This enables the user of Gadget to modify
the seemingly hidden and private specs :
*/
var p1 = new Phone(),
    specs = p1.getSpecs();

specs.color = "black";
specs.price = "free";

console.dir(p1.getSpecs());

/*
The solution to this unexpected behavior is to be careful not to pass
references to objects and arrays you want to keep private.

A work-around to this is to create a copy of the specs object,
using a general-purpose object-cloning function
*/

/*-- Object Literals and Privacy --*/

//example

var myobj; // this will be the object

(function () {
  // private members
  var name = "james";

  // implement the public part
  // note -- no `var`
  myobj = {
    // privileged method
    getName: function () {
      return name;
    }
  };
}());

console.log(myobj.getName()); // "james"

// the same idea but with slightly different implementation:

var obj = (function () {
  //private members
  var name = "nandaa";

  //implement the public part
  return {
    getName: function () {
      return name;
    }
  };
}());

console.log(obj.getName()); // "nandaa"

/*-- Prototypes and Privacy --*/
/*
One drawback of the private members when used with constructors
is that they are recreated every time the constructor is invoked
to create a new object.

To avoid the duplication of effort and save memory,
you can add common properties
and methods to the prototype property of the constructor.
*/

function GadgetX() {
  // private member
  var name = "iPod";

  // public function
  this.getName = function () {
    return name;
  };
}

GadgetX.prototype = (function () {
  // private member
  var browser = "Mobile Webkit";

  //public prototype members
  return {
    getBrowser: function () {
      return browser;
    }
  };
}());


var toy1 = new GadgetX();
console.log(toy1.getName()); // privileged "own" method
console.log(toy1.getBrowser()); // privileged prototype method

/*-- Revealing Private Methods and Public Functions
(Revealing Module Pattern) --*/

var myarray;

(function () {
  var astr = "[object Array]",
      toString = Object.prototype.toString;

  function isArray(a) {
    return toString.call(a) === astr;
  }

  function indexOf(haystack, needle) {
    var i = 0,
        max = haystack.length;

    for ( ; i < max; i += 1) {
      if (haystack[i] === needle) {
        return i;
      }
    }
    return -1;
  }

  myarray = {
    isArray: isArray,
    indexOf: indexOf,
    inArray: indexOf
  };

}());

console.log(myarray.isArray([1,2])); // true
console.log(myarray.isArray({o: 3})); // false
console.log(myarray.inArray(["a", "b", "c"], "a")); // 0

/*
Now if something unexpected happens, for example,
to the public indexOf() , the private indexOf() is still safe
and therefore inArray() will continue to work:
*/

myarray.indexOf = null;

console.log(myarray.inArray([1, 10, 5, 6, 7], 5)); //2
