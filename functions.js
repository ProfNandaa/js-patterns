/* -- returning functions --*/
//example

var setup = function () {
  var count = 0;
  return function () {
    return (count +=1 );
  };
}

//usage
var next = setup();
console.log(next()); //1
console.log(next()); //2
console.log(next()); //3


/*-- Self-defining function --*/

var scareMe = function () {
  console.log("Boo!");
  scareMe = function () {
    console.log("Double boo!");
  }
}

scareMe();
//first implementation has been overwritten
scareMe();

/*This pattern is useful when your function has some
initial preparatory work to do and it needs to do it only once.
*/

/*-- Immediate Function --*/
(function () {
  var name = "John",
      date = new Date();
  console.log("I met " + name + " on " + date);
})();

/*-- Immediate Object Initialization --*/

/*
The benefits of this pattern are the same as the
immediate function pattern: you protect
the global namespace while performing the one-off initialization tasks
*/

//example
({
  // here you can define setting values
  // a.k.a. configuration constants
  maxwidth: 600,
  maxheight: 400,
  // you can also define utility methods
  gimmeMax: function () {
    return this.maxwidth + "x" + this.maxheight;
  },
  // initialize
  init: function () {
    console.log(this.gimmeMax());
    // more init tasks...
  }
}).init();

/*-- Init-Time Branching --*/

//to avoid repetition of logic every time
//example

//the interface
var utils = {
  addListener: null,
  removeListener: null
}


// the implementation

// if (typeof window.addEventListener === 'function') {
//   utils.addListener = function (el, type, fn) {
//     el.addEventListener(type, fn, false);
//   };
//   utils.removeListener = function (el, type, fn) {
//     el.removeEventListener(type, fn, false);
//   };
// } else if (typeof document.attachEvent === 'function') { // IE
//   utils.addListener = function (el, type, fn) {
//     el.attachEvent('on' + type, fn);
//   };
//   utils.removeListener = function (el, type, fn) {
//     el.detachEvent('on' + type, fn);
//   };
// } else { // older browsers
//   utils.addListener = function (el, type, fn) {
//     el['on' + type] = fn;
//   };
//   utils.removeListener = function (el, type, fn) {
//     el['on' + type] = null;
//   };
// }

/*-- Function Propertis - A Memoization Patter --*/
/*
You can add custom properties to your functions at any time.
One use case for custom properties is to cache the results
(the return value) of a function, so the next time the
function is called, it doesn’t have to redo potentially
heavy computations.
*/

var myFunc = function (param) {
  if (!myFunc.cache[param]) {
    var result = {};
    // ... expensive operation ...
    myFunc.cache[param] = result;
  }
  return myFunc.cache[param];
};
// cache storage
myFunc.cache = {};

/*
If you have more parameters and more complex
ones, a generic solution would be to serialize them.
*/

//e.g.

//var cachekey = JSON.stringify(Array.prototype.slice.call(arguments));

/*-- Configuration Objects --*/
/*
The configuration object pattern is a way to provide cleaner
APIs, especially if you’re building a library or any other
code that will be consumed by other programs.
*/

/*-- Currying A Function --*/

//example

/// a curried add
// accepts partial list of arguments
function add(x, y) {
  if (typeof y === "undefined") { // partial
    return function (y) {
      return x + y;
    };
  }
  // full application
  return x + y;
}

//test
console.log(add(3)(5)); //8

// create and store a new function
var add2000 = add(2000);
console.log(add2000(10));
