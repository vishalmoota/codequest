require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose  = require('mongoose');
const connectDB = require('../config/db');
const Course    = require('../models/Course');
const Challenge = require('../models/Challenge');
const Narrative = require('../models/Narrative');

/* ───────────────────────────────────── helpers ─── */
const easy   = 'easy';
const medium = 'medium';
const hard   = 'hard';
const expert = 'expert';

/* ════════════════════════════════════════════════════
   COURSE  1 — JavaScript Fundamentals
   ════════════════════════════════════════════════════ */
const jsCourse = {
  title: 'JavaScript Fundamentals',
  description: 'Master the building blocks of the web — variables, functions, arrays, objects and more.',
  language: 'javascript',
  levels: [
    { 
      levelNum: 1, 
      title: 'Variables & Types',     
      icon: '📦', 
      description: 'Learn to store and work with data.',
      theory: {
        title: 'Variables, Data Types & the JS Runtime',
        emoji: '📦',
        description: 'JavaScript is the language of the web. Every website you interact with uses JS. In this chapter you\'ll learn the very first building blocks: how to STORE DATA, what TYPES of data exist, and how to PRINT output. Think of variables like labelled boxes where you keep information.',
        topics: [
          {
            name: 'Variables: var, let & const',
            emoji: '📝',
            content: 'Variables are named containers for data. JavaScript has three ways to declare them:',
            codeExamples: [
              {
                title: 'const (read-only)',
                code: '// PREFER: "const" for values that don\'t change\nconst PI = 3.14159;\nconst playerName = "Alice";\n// Cannot reassign:\n// PI = 3.15;  ❌ ERROR',
                explanation: 'const is the safest choice for values that won\'t change.'
              },
              {
                title: 'let (reassignable)',
                code: '// "let" for values that can change\nlet score = 0;\nscore = score + 10;  // ✓ Works!\n\n// "let" only visible in this block\nif (true) {\n  let temp = "only here";\n}\n// console.log(temp);  ❌ temp not defined outside',
                explanation: 'let is block-scoped and allows reassignment.'
              },
              {
                title: 'var (legacy)',
                code: '// Avoid: "var" is function-scoped (causes bugs)\nvar age = 25;\nif (true) {\n  var age = 30;  // Changes the outer var!\n}\nconsole.log(age);  // 30 (function-scoped → confusing)',
                explanation: 'var predates let/const but has quirky scoping. Don\'t use it.'
              }
            ],
            keyRules: [
              'Default to <code>const</code>. Use <code>let</code> only when you need to reassign. Never use <code>var</code>.',
              'Variable names must start with a letter, _ or $. They are case-sensitive: <code>score ≠ Score</code>.',
              '<code>const</code> prevents reassignment, but objects/arrays inside can still be modified.'
            ]
          },
          {
            name: 'Primitive Data Types',
            emoji: '🔹',
            content: 'The 7 building block types of JS. These are the "pure" values that JavaScript works with:',
            subtopics: [
              {
                name: 'number',
                emoji: '🔢',
                description: 'Integers and decimals.',
                content: 'JavaScript treats all numbers the same. No separate int/float types.',
                codeExamples: [
                  {
                    code: 'const age = 25;  // integer\nconst pi = 3.14159;  // decimal\nconst big = -1000000;\nconst tiny = 0.0001;\nconst result = 42 / 10;  // 4.2',
                    explanation: 'All numeric values are the "number" type.'
                  }
                ]
              },
              {
                name: 'string',
                emoji: '📜',
                description: 'Text wrapped in quotes.',
                content: 'Strings store text. Wrap in single \' or double " or backticks ` (template literals).',
                codeExamples: [
                  {
                    code: 'const name = "Alice";\nconst greeting = \'Hello!\';\nconst message = `Welcome, ${name}!`;  // Template literal',
                    explanation: 'Three ways to write strings. Template literals allow variables with ${...}.'
                  }
                ]
              },
              {
                name: 'boolean',
                emoji: '✅',
                description: 'true or false.',
                content: 'Booleans are used in conditions and comparisons. Named after mathematician George Boole.',
                codeExamples: [
                  {
                    code: 'const isActive = true;\nconst hasKey = false;\nconst isAdult = age >= 18;  // Result of comparison',
                    explanation: 'Conditions produce boolean values.'
                  }
                ]
              },
              {
                name: 'null & undefined',
                emoji: '∅',
                description: 'Absence of value.',
                content: 'null = intentionally empty. undefined = declared but no value assigned.',
                codeExamples: [
                  {
                    code: 'let x;  // undefined (declared but not assigned)\nconst empty = null;  // Intentionally empty\nconst result = null;  // "no result"',
                    explanation: 'null is deliberate; undefined is accidental/default.'
                  }
                ]
              }
            ],
            keyRules: [
              'The 7 primitive types: <code>number</code>, <code>string</code>, <code>boolean</code>, <code>null</code>, <code>undefined</code>, <code>bigint</code>, <code>symbol</code>.',
              'Use <code>typeof</code> to check a value\'s type: <code>typeof 42 === "number"</code>',
              'In conditions, values are "truthy" or "falsy": <code>0, "", null, undefined, NaN</code> are falsy; everything else is truthy.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'Which keyword should you use for a variable that won\'t change?',
            options: ['const', 'let', 'var', 'new'],
            correctAnswer: 0
          },
          {
            question: 'What is the `typeof` the value `42`?',
            options: ['integer', 'number', 'digit', 'numeric'],
            correctAnswer: 1
          },
          {
            question: 'What does this print? `console.log(typeof "hello")`',
            options: ['"hello"', 'string', 'text', 'String'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'MDN: JavaScript Basics',
            author: 'Mozilla',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps',
            emoji: '📖',
            type: 'docs'
          },
          {
            title: 'Eloquent JavaScript Ch 1',
            author: 'Marijn Haverbeke',
            url: 'https://eloquentjavascript.net/01_values.html',
            emoji: '📕',
            type: 'book'
          },
          {
            title: 'JavaScript.info: Variables',
            author: 'Ilya Kantor',
            url: 'https://javascript.info/variables',
            emoji: '🔗',
            type: 'website'
          },
          {
            title: 'You Don\'t Know JS Yet: Getting Started',
            author: 'Kyle Simpson',
            url: 'https://github.com/getify/You-Dont-Know-JS',
            emoji: '📚',
            type: 'book'
          }
        ]
      }
    },
    { 
      levelNum: 2, 
      title: 'Functions',              
      icon: '⚡', 
      description: 'Create reusable blocks of code.',
      theory: {
        title: 'Functions: Reusable Code Blocks',
        emoji: '⚡',
        description: 'Functions let you wrap logic into reusable units. Instead of writing the same code repeatedly, define it once and call it many times. Functions are at the heart of programming.',
        topics: [
          {
            name: 'Function Declaration & Calling',
            emoji: '📌',
            content: 'A function is a named block of code that performs a task. Declare it once, call it many times.',
            codeExamples: [
              {
                title: 'Function Basics',
                code: 'function greet(name) {\n  console.log("Hello, " + name);\n}\n\ngreet("Alice");  // Hello, Alice\ngreet("Bob");    // Hello, Bob',
                explanation: 'Define the function once with function keyword, then call it by name.'
              },
              {
                title: 'Return Values',
                code: 'function add(a, b) {\n  return a + b;  // Send value back to caller\n}\n\nconst result = add(5, 3);  // result = 8\nconsole.log(result);',
                explanation: 'return sends a value back. Without it, the function returns undefined.'
              }
            ],
            keyRules: [
              'Parameters appear in the function definition. Arguments are values passed when calling.',
              'A function can have 0 or more parameters.',
              '<code>return</code> exits the function and sends a value back to the caller.',
              'After return, any code below is NOT executed.'
            ]
          },
          {
            name: 'Arrow Functions (ES6)',
            emoji: '🏹',
            content: 'A shorthand syntax for functions in modern JavaScript. Popular and concise.',
            codeExamples: [
              {
                title: 'Arrow Function Syntax',
                code: '// Traditional\nfunction double(x) {\n  return x * 2;\n}\n\n// Arrow function (same thing)\nconst double = (x) => x * 2;\nconst double = x => x * 2;  // Parentheses optional for 1 param',
                explanation: 'Arrow functions use => syntax. For single-line returns, omit the braces.'
              },
              {
                title: 'When to Use',
                code: 'const square = x => x * x;\n\n// Multi-line arrow function\nconst calculate = (a, b) => {\n  const sum = a + b;\n  return sum * 2;  // Need braces & return for multi-line\n};\n\n// No parameters\nconst getRandom = () => Math.random();',
                explanation: 'Arrow functions are popular for callbacks and array methods.'
              }
            ],
            keyRules: [
              'Arrow syntax: <code>(params) => expression</code> or <code>(params) => { statements; return value; }</code>',
              'Single param: parentheses optional. No params: use <code>()</code>.',
              'Implicit return for single expressions: <code>x => x * 2</code> automatically returns <code>x * 2</code>.'
            ]
          },
          {
            name: 'Parameters & Default Values',
            emoji: '⚙️',
            content: 'Functions accept parameters and can have default values.',
            codeExamples: [
              {
                title: 'Default Parameters',
                code: '// If level is not provided, default to 1\nfunction levelUp(playerName, level = 1) {\n  console.log(playerName + " is now level " + level);\n}\n\nlevelUp("Alice");       // Alice is now level 1\nlevelUp("Bob", 5);      // Bob is now level 5',
                explanation: 'Default values prevent undefined surprises.'
              }
            ],
            keyRules: [
              'Default parameter values use <code> = </code>: <code>(x = 10)</code>',
              'Parameters with defaults must come after required parameters.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'What keyword do you use to send a value back from a function?',
            options: ['give', 'send', 'return', 'output'],
            correctAnswer: 2
          },
          {
            question: 'What does this function return? `const fn = x => x * 2; fn(5);`',
            options: ['5', '10', 'x * 2', 'undefined'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'MDN: Functions',
            author: 'Mozilla',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
            emoji: '📖',
            type: 'docs'
          },
          {
            title: 'JavaScript.info: Functions',
            author: 'Ilya Kantor',
            url: 'https://javascript.info/function-basics',
            emoji: '🔗',
            type: 'website'
          }
        ]
      }
    },
    { 
      levelNum: 3, 
      title: 'Arrays',                 
      icon: '📚', 
      description: 'Manage collections of data.',
      theory: {
        title: 'Arrays: Ordered Collections',
        emoji: '📚',
        description: 'Arrays store multiple values in order. Access elements by index (starting from 0). Perfect for lists, inventories, and any ordered data.',
        topics: [
          {
            name: 'Creating & Accessing Arrays',
            emoji: '🔍',
            content: 'Arrays use square brackets. Index starts at 0.',
            codeExamples: [
              {
                title: 'Array Creation',
                code: 'const fruits = ["apple", "banana", "cherry"];\nconst numbers = [10, 20, 30, 40];\nconst mixed = [1, "hello", true, null];\n\n// Access by index\nconsole.log(fruits[0]);   // "apple"\nconsole.log(fruits[1]);   // "banana"\nconsole.log(fruits.length);  // 3',
                explanation: 'Index 0 is the first element. Use .length to get count.'
              }
            ],
            keyRules: [
              'Arrays are 0-indexed: first element is <code>arr[0]</code>, not <code>arr[1]</code>.',
              '<code>.length</code> property gives the number of elements.',
              'Arrays can hold any data type, even mixed types.',
              '<code>index</code> = position in array. <code>value</code> = what\'s stored there.'
            ]
          },
          {
            name: 'Mutating Arrays (push, pop, shift, unshift)',
            emoji: '✏️',
            content: 'Methods that change the array:',
            codeExamples: [
              {
                title: 'Adding & Removing',
                code: 'const heroes = ["Wizard", "Knight"];\n\n// Add to end\nheroes.push("Rogue");     // ["Wizard", "Knight", "Rogue"]\n\n// Remove from end\nheroes.pop();             // ["Wizard", "Knight"]\n\n// Add to start\nheroes.unshift("Bard");   // ["Bard", "Wizard", "Knight"]\n\n// Remove from start\nheroes.shift();           // ["Wizard", "Knight"]',
                explanation: 'push/pop work on the end. shift/unshift work on the start.'
              }
            ],
            keyRules: [
              '<code>push()</code> adds to end, returns new length.',
              '<code>pop()</code> removes from end, returns removed item.',
              '<code>unshift()</code> adds to start, returns new length.',
              '<code>shift()</code> removes from start, returns removed item.'
            ]
          },
          {
            name: 'Iterating Arrays (map, filter, forEach)',
            emoji: '🔄',
            content: 'Transform and iterate over arrays:',
            codeExamples: [
              {
                title: 'map: Transform Each Element',
                code: 'const numbers = [1, 2, 3, 4];\n\n// Create a new array with doubled values\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled);  // [2, 4, 6, 8]\n\n// Original unchanged\nconsole.log(numbers);  // [1, 2, 3, 4]',
                explanation: 'map returns a NEW array; original stays the same.'
              },
              {
                title: 'filter: Keep Only Matching Items',
                code: 'const scores = [85, 92, 78, 95, 60];\n\n// Keep only scores >= 80\nconst passing = scores.filter(s => s >= 80);\nconsole.log(passing);  // [85, 92, 95]',
                explanation: 'filter returns a new array with only items that pass the test.'
              },
              {
                title: 'forEach: Do Something for Each',
                code: 'const tasks = ["code", "test", "deploy"];\n\n// Do something for each (no new array)\ntasks.forEach((task, i) => {\n  console.log(`Task ${i}: ${task}`);\n});\n// Task 0: code\n// Task 1: test\n// Task 2: deploy',
                explanation: 'forEach runs a function for each item but returns undefined.'
              }
            ],
            keyRules: [
              '<code>map()</code> transforms each element, returns NEW array.',
              '<code>filter()</code> keeps items where predicate is true.',
              '<code>forEach()</code> runs function for each item, returns undefined.',
              '<code>find()</code> returns first item matching condition.',
              '<code>reduce()</code> combines all items into a single value.'
            ]
          },
          {
            name: 'Other Array Methods',
            emoji: '🛠️',
            content: 'More essential array tools:',
            codeExamples: [
              {
                title: 'slice, indexOf, includes',
                code: 'const arr = [10, 20, 30, 40, 50];\n\n// slice: get portion (doesn\'t mutate)\nconst partial = arr.slice(1, 4);  // [20, 30, 40]\n\n// indexOf: find position\nconst pos = arr.indexOf(30);      // 2\n\n// includes: check existence\nconst has20 = arr.includes(20);   // true\n\n// join: convert to string\nconst str = [1, 2, 3].join("-");  // "1-2-3"',
                explanation: 'These methods help you work with and inspect arrays.'
              }
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'What method adds an element to the END of an array?',
            options: ['unshift', 'push', 'add', 'append'],
            correctAnswer: 1
          },
          {
            question: 'What does `arr.map()` return?',
            options: ['undefined', 'a new array', 'the first element', 'the length'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'MDN: Array Methods',
            author: 'Mozilla',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
            emoji: '📖',
            type: 'docs'
          },
          {
            title: 'JavaScript.info: Arrays',
            author: 'Ilya Kantor',
            url: 'https://javascript.info/array',
            emoji: '🔗',
            type: 'website'
          }
        ]
      }
    },
    { 
      levelNum: 4, 
      title: 'Objects & Classes',       
      icon: '🏰', 
      description: 'Model real-world entities.',
      theory: {
        title: 'Objects & Data Structures',
        emoji: '🏰',
        description: 'Objects group related data and behavior. Use them to model real-world things like players, items, or houses. Objects are the foundation of JavaScript\'s object-oriented features.',
        topics: [
          {
            name: 'Object Literals',
            emoji: '{}',
            content: 'Create objects with key-value pairs:',
            codeExamples: [
              {
                title: 'Creating Objects',
                code: 'const player = {\n  name: "Alice",\n  level: 5,\n  xp: 1200,\n  isActive: true\n};\n\n// Access properties\nconsole.log(player.name);     // "Alice"\nconsole.log(player["level"]);  // 5\n\n// Modify properties\nplayer.level = 6;\nplayer.xp += 100;',
                explanation: 'Use dot notation (obj.prop) or bracket notation (obj["prop"]).'
              }
            ],
            keyRules: [
              'Objects use curly braces and key-value pairs.',
              'Keys are strings (quotes optional if they\'re valid identifiers).',
              'Use dot notation: <code>obj.key</code> or bracket notation: <code>obj["key"]</code>.',
              'Add new properties anytime: <code>obj.newKey = value;</code>'
            ]
          },
          {
            name: 'Methods & `this`',
            emoji: '🎯',
            content: 'Objects can contain functions (called methods). Use `this` to reference the object itself.',
            codeExamples: [
              {
                title: 'Object Methods',
                code: 'const hero = {\n  name: "Zara",\n  hp: 100,\n  \n  // Method: function inside object\n  takeDamage(dmg) {\n    this.hp -= dmg;  // "this" refers to hero\n    return `${this.name} took ${dmg} damage`;\n  }\n};\n\nhero.takeDamage(20);\nconsole.log(hero.hp);  // 80',
                explanation: '`this` inside a method refers to the object itself.'
              }
            ],
            keyRules: [
              'Methods are functions stored as object properties.',
              '<code>this</code> inside a method refers to the object.',
              'Call methods: <code>obj.method(args)</code>'
            ]
          },
          {
            name: 'Classes (ES6)',
            emoji: '🏛️',
            content: 'Classes are blueprints for creating objects. Think of a class as a template.',
            codeExamples: [
              {
                title: 'Class Basics',
                code: 'class Hero {\n  constructor(name, hp) {\n    this.name = name;\n    this.hp = hp;\n  }\n  \n  takeDamage(dmg) {\n    this.hp -= dmg;\n  }\n  \n  greet() {\n    return `I am ${this.name}`;\n  }\n}\n\nconst alice = new Hero("Alice", 100);\nalice.takeDamage(20);\nconsole.log(alice.greet());  // I am Alice',
                explanation: 'constructor runs when creating a new instance with new.'
              }
            ],
            keyRules: [
              '<code>constructor()</code> initializes new instances.',
              '<code>new ClassName()</code> creates a new instance.',
              '<code>this</code> refers to the current instance.',
              'Methods are shared by all instances.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'How do you access an object property named "level"?',
            options: ['obj[level]', 'obj.level', 'obj->level', 'obj:level'],
            correctAnswer: 1
          },
          {
            question: 'What keyword creates a new instance of a class?',
            options: ['create', 'new', 'make', 'init'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'MDN: Working with Objects',
            author: 'Mozilla',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects',
            emoji: '📖',
            type: 'docs'
          },
          {
            title: 'JavaScript.info: Objects',
            author: 'Ilya Kantor',
            url: 'https://javascript.info/object',
            emoji: '🔗',
            type: 'website'
          },
          {
            title: 'MDN: Classes',
            author: 'Mozilla',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes',
            emoji: '📖',
            type: 'docs'
          }
        ]
      }
    },
    { 
      levelNum: 5, 
      title: 'Advanced Concepts',       
      icon: '🌟', 
      description: 'Closures, promises and more.',
      theory: {
        title: 'Advanced Concepts: Closures, Async & More',
        emoji: '🌟',
        description: 'Take your JavaScript skills to the next level. Learn about closures (functions that remember), promises (async operations), and destructuring (elegant unpacking).',
        topics: [
          {
            name: 'Closures',
            emoji: '🔒',
            content: 'A closure is a function that remembers variables from its outer scope even after the outer function returns. This is one of JavaScript\'s most powerful features.',
            codeExamples: [
              {
                title: 'Creating a Closure',
                code: 'function createCounter() {\n  let count = 0;  // Outer variable\n  \n  return function() {  // Inner function "closes over" count\n    count++;\n    return count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter());  // 1\nconsole.log(counter());  // 2\nconsole.log(counter());  // 3',
                explanation: 'The returned function remembers "count" even after createCounter finishes.'
              }
            ],
            keyRules: [
              'A closure happens when a function accesses variables from its outer scope.',
              'The inner function "closes over" those variables and keeps them in memory.',
              'Each call to createCounter() creates a NEW closure with its own count.'
            ]
          },
          {
            name: 'Promises & Async/Await',
            emoji: '⏳',
            content: 'Handle asynchronous operations (things that take time, like API calls).',
            codeExamples: [
              {
                title: 'Promises',
                code: 'const wait = (ms) => {\n  return new Promise(resolve => {\n    setTimeout(() => {\n      resolve("Done!");\n    }, ms);\n  });\n};\n\nwait(1000).then(msg => console.log(msg));\n// After 1 second: "Done!"',
                explanation: 'A Promise represents a value that will be available in the future.'
              },
              {
                title: 'Async/Await',
                code: 'async function greet() {\n  const msg = await wait(1000);\n  console.log(msg);  // "Done!"\n}\n\ngreet();',
                explanation: 'async/await makes async code look like regular sync code.'
              }
            ],
            keyRules: [
              '<code>Promise</code> takes a function with <code>resolve</code> and <code>reject</code> callbacks.',
              '<code>.then()</code> runs after the promise resolves.',
              '<code>async</code> function always returns a promise.',
              '<code>await</code> pauses execution until promise settles.'
            ]
          },
          {
            name: 'Destructuring & Spread Operator',
            emoji: '📦',
            content: 'Elegant ways to unpack and merge data:',
            codeExamples: [
              {
                title: 'Array Destructuring',
                code: 'const colors = ["red", "green", "blue"];\n\n// Old way\nconst first = colors[0];\nconst second = colors[1];\n\n// Destructuring\nconst [first, second, third] = colors;\n\n// Skip some\nconst [a, , c] = colors;  // Skip green',
                explanation: 'Unpack array elements into variables in one line.'
              },
              {
                title: 'Object Destructuring',
                code: 'const player = { name: "Alice", level: 5 };\n\n// Destructuring\nconst { name, level } = player;\n\n// Rename\nconst { name: playerName, level: playerLevel } = player;',
                explanation: 'Extract object properties into variables.'
              },
              {
                title: 'Spread Operator',
                code: 'const arr1 = [1, 2, 3];\nconst arr2 = [4, 5, 6];\n\n// Merge arrays\nconst merged = [...arr1, ...arr2];  // [1, 2, 3, 4, 5, 6]\n\n// Merge objects\nconst obj1 = { a: 1 };\nconst obj2 = { b: 2 };\nconst combined = { ...obj1, ...obj2 };  // { a: 1, b: 2 }',
                explanation: 'Spread ... expands arrays/objects into individual elements.'
              }
            ],
            keyRules: [
              'Array destructuring: <code>const [a, b, c] = arr;</code>',
              'Object destructuring: <code>const { key } = obj;</code>',
              'Spread operator: <code>...array</code> or <code>...object</code>'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'What does a closure do?',
            options: ['Closes the program', 'Remembers variables from outer scope', 'Returns undefined', 'Prevents errors'],
            correctAnswer: 1
          },
          {
            question: 'Which keyword makes a function return a Promise?',
            options: ['promise', 'async', 'await', 'then'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'You Don\'t Know JS: Scope & Closures',
            author: 'Kyle Simpson',
            url: 'https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/scope-closures',
            emoji: '📚',
            type: 'book'
          },
          {
            title: 'MDN: Closures',
            author: 'Mozilla',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
            emoji: '📖',
            type: 'docs'
          },
          {
            title: 'JavaScript.info: Promises',
            author: 'Ilya Kantor',
            url: 'https://javascript.info/promise',
            emoji: '🔗',
            type: 'website'
          }
        ]
      }
    },
  ],
};

const jsChallenges = [
  // ── Level 1 ──
  { levelNum:1, order:0, title:'Hello Variables',     functionName:'helloVar',     difficulty:easy, xpReward:15, tags:['variables'],
    description:'Create a function that returns the string `"Hello, CodeQuest!"`.',
    starterCode:'function helloVar() {\n  // Return the greeting\n}',
    storyContext:'Your first quest begins — speak the ancient greeting to unlock the gate.',
    hints:['Use a return statement with a string literal.'],
    testCases:[{args:[],expected:'Hello, CodeQuest!',description:'Returns greeting'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `Variables store data in JavaScript. Use const for values that don't change, let for values that do.
Example:
const name = "Alice";
let score = 0;
score = score + 10;

Data types: string ("hello"), number (42), boolean (true/false).
Use console.log() to print output.`,
    instructions: `Write a function that returns the string "Hello, CodeQuest!".`,
    expectedOutput: `Hello, CodeQuest!` },
  { levelNum:1, order:1, title:'Sum Two Numbers',     functionName:'sum',          difficulty:easy, xpReward:15, tags:['variables','math'],
    description:'Return the sum of two numbers.',
    starterCode:'function sum(a, b) {\n  // Your code\n}',
    storyContext:'The bridge guardian demands a toll — calculate the correct fare.',
    hints:['Use the + operator.'],
    testCases:[{args:[2,3],expected:5,description:'2+3=5'},{args:[-1,1],expected:0,description:'-1+1=0'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `Strings are sequences of characters.
Useful string operations:
- str.split('') → splits string into array of characters
- arr.reverse() → reverses an array
- arr.join('') → joins array back into string
Example: "hello".split('').reverse().join('') → "olleh"`,
    instructions: `Write a function that takes two numbers and returns their sum.
Example: add(2, 3) should return 5.`,
    expectedOutput: `5` },
  { levelNum:1, order:2, title:'Type Checker',         functionName:'whatType',     difficulty:easy, xpReward:20, tags:['types'],
    description:'Return the `typeof` the given value as a string.',
    starterCode:'function whatType(val) {\n  // Return the type\n}',
    storyContext:'The Oracle can only help if you identify the nature of the artifact.',
    hints:['Use the typeof operator.'],
    testCases:[{args:[42],expected:'number',description:'number'},{args:['hi'],expected:'string',description:'string'},{args:[true],expected:'boolean',description:'boolean'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `The modulo operator % gives the remainder of division.
Example: 10 % 2 === 0 (even), 7 % 2 === 1 (odd)
Use if/else to make decisions:
if (number % 2 === 0) {
  return "Even";
} else {
  return "Odd";
}`,
    instructions: `Write a function that takes a value and returns the type using the typeof operator.`,
    expectedOutput: `number` },

  // ── Level 2 ──
  { levelNum:2, order:0, title:'Double Trouble',       functionName:'double',       difficulty:easy, xpReward:20, tags:['functions'],
    description:'Return the input multiplied by 2.',
    starterCode:'function double(n) {\n  // Your code\n}',
    storyContext:'The Enchanter asks you to amplify the power crystal — double its energy!',
    hints:['Multiply the parameter by 2.'],
    testCases:[{args:[5],expected:10,description:'5→10'},{args:[0],expected:0,description:'0→0'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `Conditional statements let your code make decisions.
if / else if / else example:
if (score >= 90) {
  return "A";
} else if (score >= 80) {
  return "B";
} else {
  return "F";
}
Comparison operators: >= , <= , === , !== , > , <`,
    instructions: `Complete the challenge using conditional logic as described in the problem statement.`,
    expectedOutput: `` },
  { levelNum:2, order:1, title:'Is Even?',             functionName:'isEven',       difficulty:easy, xpReward:20, tags:['functions','boolean'],
    description:'Return `true` if the number is even, `false` otherwise.',
    starterCode:'function isEven(n) {\n  // Your code\n}',
    storyContext:'Only creatures with even-numbered runes may pass the shadow gate.',
    hints:['Use the modulo operator %.'],
    testCases:[{args:[4],expected:true,description:'4 is even'},{args:[7],expected:false,description:'7 is odd'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `Logical operators combine conditions:
- && means AND (both must be true)
- || means OR (at least one must be true)
- ! means NOT (flips true/false)
Example:
if (age >= 18 && hasID) { return "Entry allowed"; }`,
    instructions: `Write a function that returns true if the number is even, false otherwise.`,
    expectedOutput: `` },
  { levelNum:2, order:2, title:'Greet by Name',        functionName:'greet',        difficulty:medium, xpReward:25, tags:['functions','strings'],
    description:'Return `"Hello, <name>!"` using template literals.',
    starterCode:'function greet(name) {\n  // Your code\n}',
    storyContext:'The village elder greets every adventurer by name — build the greeting spell.',
    hints:['Use template literals: `Hello, ${name}!`'],
    testCases:[{args:['Ada'],expected:'Hello, Ada!',description:'Ada'},{args:['Quest'],expected:'Hello, Quest!',description:'Quest'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `The ternary operator is a shorthand if/else:
condition ? valueIfTrue : valueIfFalse
Example:
const result = age >= 18 ? "Adult" : "Minor";`,
    instructions: `Write a function that accepts a name and returns a greeting using template literals.`,
    expectedOutput: `` },

  // ── Level 3 ──
  { levelNum:3, order:0, title:'Array Sum',            functionName:'arraySum',     difficulty:medium, xpReward:25, tags:['arrays'],
    description:'Return the sum of all numbers in an array.',
    starterCode:'function arraySum(arr) {\n  // Your code\n}',
    storyContext:'Count the gold coins gathered from the dungeon chests.',
    hints:['Use reduce or a for loop.'],
    testCases:[{args:[[1,2,3]],expected:6,description:'[1,2,3]→6'},{args:[[10,-5,5]],expected:10,description:'Mixed'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `Loops repeat code multiple times.
For loop example:
for (let i = 1; i <= 10; i++) {
  console.log(i);
}
While loop example:
let i = 0;
while (i < 5) {
  i++;
}
Use loops with conditionals to solve problems.`,
    instructions: `Write a function that sums all numbers in an array using a loop or reduce.`,
    expectedOutput: `` },
  { levelNum:3, order:1, title:'Filter Evens',         functionName:'filterEvens',  difficulty:medium, xpReward:25, tags:['arrays','filter'],
    description:'Return a new array with only even numbers.',
    starterCode:'function filterEvens(arr) {\n  // Your code\n}',
    storyContext:'Separate the magical crystals — only even-charged ones can power the portal.',
    hints:['Use .filter() with the modulo operator.'],
    testCases:[{args:[[1,2,3,4,5,6]],expected:[2,4,6],description:'1-6→evens'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `Array iteration with loops:
const nums = [1, 2, 3, 4, 5];
for (let i = 0; i < nums.length; i++) {
  console.log(nums[i]);
}
Or use forEach:
nums.forEach(num => console.log(num));`,
    instructions: `Write a function that filters out odd numbers and returns only even numbers.`,
    expectedOutput: `` },
  { levelNum:3, order:2, title:'Reverse Array',        functionName:'reverseArr',   difficulty:medium, xpReward:30, tags:['arrays'],
    description:'Return a reversed copy of the array (do not mutate the original).',
    starterCode:'function reverseArr(arr) {\n  // Your code\n}',
    storyContext:'Read the ancient scroll backwards to decode the hidden message.',
    hints:['Use .slice() then .reverse(), or spread + reverse.'],
    testCases:[{args:[[1,2,3]],expected:[3,2,1],description:'[1,2,3]→[3,2,1]'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `Nested loops run one loop inside another.
Example — multiplication table:
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    console.log(i * j);
  }
}`,
    instructions: `Write a function that returns a reversed copy of the array without mutating the original.`,
    expectedOutput: `` },

  // ── Level 4 ──
  { levelNum:4, order:0, title:'Object Keys',          functionName:'getKeys',      difficulty:medium, xpReward:25, tags:['objects'],
    description:'Return an array of keys from the given object.',
    starterCode:'function getKeys(obj) {\n  // Your code\n}',
    storyContext:'The treasure map lists artifact names — extract the labels.',
    hints:['Use Object.keys().'],
    testCases:[{args:[{a:1,b:2}],expected:['a','b'],description:'keys'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `Functions are reusable blocks of code.
Function declaration:
function greet(name) {
  return "Hello, " + name;
}
Arrow function (modern style):
const greet = (name) => "Hello, " + name;
Functions can have default parameters:
const greet = (name = "World") => "Hello, " + name;`,
    instructions: `Write a function that extracts and returns the keys from an object.`,
    expectedOutput: `` },
  { levelNum:4, order:1, title:'Merge Objects',        functionName:'mergeObjs',    difficulty:medium, xpReward:30, tags:['objects','spread'],
    description:'Merge two objects into one. If keys overlap, the second object wins.',
    starterCode:'function mergeObjs(a, b) {\n  // Your code\n}',
    storyContext:'Combine the two halves of the enchanted amulet.',
    hints:['Use the spread operator: { ...a, ...b }.'],
    testCases:[{args:[{x:1},{x:2,y:3}],expected:{x:2,y:3},description:'merge with overlap'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `Arrays store ordered lists of values:
const fruits = ["apple", "banana", "cherry"];
fruits.push("mango");       // add to end
fruits.pop();               // remove from end
fruits.map(f => f + "!")    // transform each item
fruits.filter(f => f.length > 5)  // filter items`,
    instructions: `Write a function that merges two objects, with the second object overwriting duplicate keys.`,
    expectedOutput: `` },
  { levelNum:4, order:2, title:'Class Instance',       functionName:'makeHero',     difficulty:hard, xpReward:35, tags:['classes'],
    description:'Return an object `{ name, hp: 100, greet() }` where greet returns `"I am <name>"`. (Return a plain object is fine.)',
    starterCode:'function makeHero(name) {\n  // Your code\n}',
    storyContext:'Craft a hero to join your guild — give them a name and a greeting.',
    hints:['Return an object literal with a greet method.'],
    testCases:[{args:['Zara'],expected:{name:'Zara',hp:100},description:'hero properties (greet tested separately)'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `Objects store key-value pairs:
const user = { name: "Alice", age: 25 };
user.name        // "Alice"
user["age"]      // 25
Object.keys(user)   // ["name", "age"]`,
    instructions: `Write a function that creates a hero object with a name, hp, and greet method.`,
    expectedOutput: `` },

  // ── Level 5 ──
  { levelNum:5, order:0, title:'Counter Closure',      functionName:'makeCounter',  difficulty:hard, xpReward:35, tags:['closures'],
    description:'Return a function. Each time it is called it returns an incrementing number starting from 1.',
    starterCode:'function makeCounter() {\n  // Your code\n}',
    storyContext:'Forge a tally rune — each activation marks the next count.',
    hints:['Use a variable in outer scope; return an inner function that increments it.'],
    testCases:[{args:[],expected:'function',description:'returns a function'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `Functions are reusable blocks of code.
Function declaration:
function greet(name) {
  return "Hello, " + name;
}
Arrow function (modern style):
const greet = (name) => "Hello, " + name;
Functions can have default parameters:
const greet = (name = "World") => "Hello, " + name;`,
    instructions: `Write a function that creates and returns a counter function.`,
    expectedOutput: `` },
  { levelNum:5, order:1, title:'Flat Map',             functionName:'flattenOne',   difficulty:hard, xpReward:35, tags:['arrays','advanced'],
    description:'Flatten a nested array by one level. e.g. `[[1,2],[3]]` → `[1,2,3]`.',
    starterCode:'function flattenOne(arr) {\n  // Your code\n}',
    storyContext:'The dungeon floors collapse into one — merge the layers.',
    hints:['Use .flat() or [].concat(...arr).'],
    testCases:[{args:[[[1,2],[3,[4]]]],expected:[1,2,3,[4]],description:'flatten one level'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `Arrays store ordered lists of values:
const fruits = ["apple", "banana", "cherry"];
fruits.push("mango");       // add to end
fruits.pop();               // remove from end
fruits.map(f => f + "!")    // transform each item
fruits.filter(f => f.length > 5)  // filter items`,
    instructions: `Write a function that flattens a nested array by one level.`,
    expectedOutput: `` },
  { levelNum:5, order:2, title:'Debounce',             functionName:'debounce',     difficulty:expert, xpReward:50, tags:['closures','advanced'],
    description:'Implement a simple debounce: return a wrapper that delays calling `fn` by `ms` milliseconds, resetting the timer on each call. Return the wrapper function.',
    starterCode:'function debounce(fn, ms) {\n  // Your code\n}',
    storyContext:'The rapid-fire spell is unstable — add a cooldown to prevent overload.',
    hints:['Use setTimeout and clearTimeout inside a closure.'],
    testCases:[{args:[],expected:'function',description:'returns a function'}],
    language: 'javascript',
    exerciseType: 'coding',
    theoryContent: `Functions are reusable blocks of code.
Function declaration:
function greet(name) {
  return "Hello, " + name;
}
Arrow function (modern style):
const greet = (name) => "Hello, " + name;
Functions can have default parameters:
const greet = (name = "World") => "Hello, " + name;`,
    instructions: `Write a debounce function that delays function execution.`,
    expectedOutput: `` }
];

/* ════════════════════════════════════════════════════
   COURSE  2 — Python Basics (JS-verified)
   ════════════════════════════════════════════════════ */
const pythonCourse = {
  title: 'Python Basics',
  description: 'Explore Python concepts through interactive JavaScript challenges — learn the ideas, practice the logic.',
  language: 'python',
  levels: [
    { 
      levelNum:1, 
      title:'Print & Variables', 
      icon:'🐍', 
      description:'Variables, printing, and basic I/O.',
      theory: {
        title: 'Variables & Output in Python',
        emoji: '🐍',
        description: 'Python is known for being beginner-friendly and readable. In this level, learn how to create variables and print output — the foundation of any program.',
        topics: [
          {
            name: 'Variables (No Type Declaration)',
            emoji: '📝',
            content: 'In Python, you don\'t need to declare variable types. Just assign a value and Python figures it out.',
            codeExamples: [
              {
                title: 'Creating Variables',
                code: 'name = "Alice"\nage = 25\nhealth = 100.5\nis_active = True\n\nprint(name)    # Alice\nprint(type(name))  # <class \'string\'>',
                explanation: 'Python infers types automatically. No let/const needed.'
              }
            ],
            keyRules: [
              'Variable names must start with letter or underscore, can contain letters/numbers/underscores.',
              'Python is case-sensitive: <code>name ≠ Name</code>.',
              'Use <code>type(var)</code> to check variable type.'
            ]
          },
          {
            name: 'Print Output',
            emoji: '🖨️',
            content: 'Use `print()` to display values on the console.',
            codeExamples: [
              {
                title: 'print() Basics',
                code: 'print("Hello, World!")\nprint(42)\nprint(3.14)\n\n# Multiple values\nprint("Score:", 100, "Level:", 5)',
                explanation: 'print() displays output. Separate multiple values with commas.'
              },
              {
                title: 'F-Strings (Formatted Strings)',
                code: 'name = "Bob"\nlevel = 3\n\n# F-string syntax\nprint(f"Player {name} is now level {level}!")\n# Output: Player Bob is now level 3!',
                explanation: 'F-strings use {} for variable interpolation. Most modern approach.'
              }
            ],
            keyRules: [
              'Use <code>print()</code> to output text.',
              'F-strings: <code>f"Text {variable}"</code> for string interpolation.',
              'String concatenation: <code>"Hello " + name</code>'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'How do you create a variable in Python?',
            options: ['var x = 5;', 'x = 5', 'let x = 5;', 'int x = 5;'],
            correctAnswer: 1
          },
          {
            question: 'What\'s the correct way to print a variable with text?',
            options: ['print "Score: " + score', 'print(f"Score: {score}")', 'print("Score: %s" % score)', 'Both b and c'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'Python.org: Variables',
            author: 'Python Software Foundation',
            url: 'https://docs.python.org/3/tutorial/introduction.html',
            emoji: '🐍',
            type: 'docs'
          },
          {
            title: 'Real Python: Python Basics',
            author: 'Real Python',
            url: 'https://realpython.com/python-data-types/',
            emoji: '🔗',
            type: 'website'
          }
        ]
      }
    },
    { 
      levelNum:2, 
      title:'Control Flow',      
      icon:'🔀', 
      description:'if/else, loops and ranges.',
      theory: {
        title: 'Control Flow: if, for, while',
        emoji: '🔀',
        description: 'Control what your program does based on conditions. Use if/else for decisions and loops (for, while) to repeat code.',
        topics: [
          {
            name: 'if/else Statements',
            emoji: '❓',
            content: 'Execute code based on conditions. Python uses indentation (spaces) instead of braces.',
            codeExamples: [
              {
                title: 'if/elif/else',
                code: 'age = 15\n\nif age >= 18:\n    print("Adult")\nelif age >= 13:\n    print("Teenager")\nelse:\n    print("Child")\n    \n# Output: Teenager',
                explanation: 'Notice Python uses indentation (4 spaces) instead of braces. This is mandatory!'
              }
            ],
            keyRules: [
              'Python uses INDENTATION for code blocks (usually 4 spaces).',
              'Comparison operators: <code>==</code>, <code>!=</code>, <code><</code>, <code>></code>, <code><=</code>, <code>>=</code>.',
              'Logical operators: <code>and</code>, <code>or</code>, <code>not</code>'
            ]
          },
          {
            name: 'for Loops',
            emoji: '🔄',
            content: 'Repeat code a specific number of times.',
            codeExamples: [
              {
                title: 'for Loop with range()',
                code: '# range(5) produces 0, 1, 2, 3, 4\nfor i in range(5):\n    print(i)\n\n# range(start, end, step)\nfor i in range(2, 10, 2):\n    print(i)  # 2, 4, 6, 8',
                explanation: 'range() generates sequences. range(n) goes 0 to n-1.'
              },
              {
                title: 'for Loop Over Collections',
                code: 'fruits = ["apple", "banana", "cherry"]\n\nfor fruit in fruits:\n    print(fruit)\n    \n# With index\nfor i, fruit in enumerate(fruits):\n    print(f"{i}: {fruit}")',
                explanation: 'Loop through items in a list. enumerate() gives index and item.'
              }
            ],
            keyRules: [
              '<code>for item in iterable:</code> loops through each item.',
              '<code>range(n)</code> produces 0 to n-1.',
              '<code>range(start, end, step)</code> for custom ranges.',
              '<code>enumerate(list)</code> gives index and value.'
            ]
          },
          {
            name: 'while Loops',
            emoji: '⏰',
            content: 'Repeat code while a condition is true.',
            codeExamples: [
              {
                title: 'while Loop',
                code: 'count = 0\n\nwhile count < 5:\n    print(count)\n    count += 1  # Same as count = count + 1\n    \n# Output: 0 1 2 3 4',
                explanation: 'Keep running until the condition becomes False.'
              }
            ],
            keyRules: [
              '<code>while condition:</code> repeats while True.',
              'Be careful of infinite loops!',
              'Use <code>break</code> to exit a loop, <code>continue</code> to skip an iteration.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'What does `range(5)` produce?',
            options: ['[1, 2, 3, 4, 5]', '[0, 1, 2, 3, 4]', '[5]', '[0, 1, 2, 3, 4, 5]'],
            correctAnswer: 1
          },
          {
            question: 'How does Python mark code blocks?',
            options: ['with braces {}', 'with indentation', 'with semicolons', 'with colons on every line'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'Python.org: Control Flow',
            author: 'Python Software Foundation',
            url: 'https://docs.python.org/3/tutorial/controlflow.html',
            emoji: '🐍',
            type: 'docs'
          },
          {
            title: 'Real Python: if Statements',
            author: 'Real Python',
            url: 'https://realpython.com/python-if-else/',
            emoji: '🔗',
            type: 'website'
          }
        ]
      }
    },
    { 
      levelNum:3, 
      title:'Lists & Tuples',    
      icon:'📋', 
      description:'Ordered collections and slicing.',
      theory: {
        title: 'Lists & Tuples: Sequences',
        emoji: '📋',
        description: 'Ordered collections of items. Lists are mutable (can change); tuples are immutable (fixed).',
        topics: [
          {
            name: 'Lists',
            emoji: '📚',
            content: 'Mutable ordered collections. Can add, remove, or modify items.',
            codeExamples: [
              {
                title: 'Creating & Accessing Lists',
                code: 'fruits = ["apple", "banana", "cherry"]\nnumbers = [1, 2, 3, 4, 5]\nmixed = [1, "hello", 3.14, True]\n\nprint(fruits[0])      # apple\nprint(fruits[-1])     # cherry (last item)\nprint(len(fruits))    # 3',
                explanation: 'Index 0 is first. Negative indices count from end.'
              },
              {
                title: 'List Methods',
                code: 'fruits = ["apple", "banana"]\n\n# Add items\nfruits.append("cherry")        # ["apple", "banana", "cherry"]\nfruits.insert(1, "blueberry")  # ["apple", "blueberry", "banana", "cherry"]\n\n# Remove items\nfruits.pop()         # Remove last\nfruits.remove("apple")  # Remove by value\n\n# Other methods\nfruits.sort()        # Sort alphabetically\nlen(fruits)          # Get length',
                explanation: 'Common list operations.'
              },
              {
                title: 'List Slicing',
                code: 'numbers = [0, 1, 2, 3, 4, 5]\n\nprint(numbers[1:4])    # [1, 2, 3] (start:end, end exclusive)\nprint(numbers[:3])     # [0, 1, 2] (start from 0)\nprint(numbers[2:])     # [2, 3, 4, 5] (to end)\nprint(numbers[::2])    # [0, 2, 4] (every 2nd item)',
                explanation: 'Slicing syntax: list[start:end:step].'
              }
            ],
            keyRules: [
              'Lists are mutable: <code>list[0] = "new value"</code>works.',
              'Negative indexing: <code>list[-1]</code> is the last item.',
              'Slicing: <code>list[start:end]</code> (end is exclusive).',
              'append(), pop(), remove(), sort() modify the list.'
            ]
          },
          {
            name: 'Tuples',
            emoji: '🔒',
            content: 'Immutable (unchangeable) sequences. Once created, cannot be modified.',
            codeExamples: [
              {
                title: 'Creating Tuples',
                code: 'person = ("Alice", 25, "Engineer")\ncolors = ("red", "green", "blue")\nsingle = (42,)  # Comma needed for single item!\n\n# Access like lists\nprint(person[0])    # Alice\n\n# Cannot modify\n# person[0] = "Bob"  # ERROR!',
                explanation: 'Tuples use parentheses. They\'re immutable (safer for data).'
              }
            ],
            keyRules: [
              'Tuples use <code>( )</code>, lists use <code>[ ]</code>.',
              'Tuples cannot be changed after creation.',
              'Useful for protecting data that shouldn\'t change.',
              'Single-item tuple needs trailing comma: <code>(42,)</code>'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'What does `numbers[-1]` give you?',
            options: ['The first item', 'The last item', 'An error', 'Negative 1'],
            correctAnswer: 1
          },
          {
            question: 'Which is immutable?',
            options: ['List', 'Tuple', 'Array', 'Dictionary'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'Python.org: Lists',
            author: 'Python Software Foundation',
            url: 'https://docs.python.org/3/tutorial/introduction.html#lists',
            emoji: '🐍',
            type: 'docs'
          },
          {
            title: 'Real Python: Lists vs Tuples',
            author: 'Real Python',
            url: 'https://realpython.com/lists-tuples-dictionaries-sets-python/',
            emoji: '🔗',
            type: 'website'
          }
        ]
      }
    },
    { 
      levelNum:4, 
      title:'Dictionaries',      
      icon:'📖', 
      description:'Key-value data structures.',
      theory: {
        title: 'Dictionaries: Key-Value Pairs',
        emoji: '📖',
        description: 'Store data with named keys. Like a real dictionary — look up words to get definitions. Perfect for structured data.',
        topics: [
          {
            name: 'Creating & Accessing Dictionaries',
            emoji: '🔑',
            content: 'Dictionaries map keys to values. Use curly braces `{}`.',
            codeExamples: [
              {
                title: 'Dictionary Basics',
                code: 'player = {\n    "name": "Alice",\n    "level": 5,\n    "health": 100,\n    "is_active": True\n}\n\n# Access by key\nprint(player["name"])            # Alice\nprint(player.get("level"))       # 5\nprint(player.get("xp", 0))       # 0 (default if key doesn\'t exist)',
                explanation: 'Use square brackets [] to access values. get() is safer (doesn\'t error).'
              }
            ],
            keyRules: [
              'Dictionaries use curly braces: <code>{ "key": "value" }</code>',
              'Keys are usually strings, values can be any type.',
              '<code>dict[key]</code> gets value, errors if key missing.',
              '<code>dict.get(key, default)</code> returns default if key missing.'
            ]
          },
          {
            name: 'Modifying Dictionaries',
            emoji: '✏️',
            content: 'Add, change, or remove key-value pairs.',
            codeExamples: [
              {
                title: 'CRUD Operations',
                code: 'player = {"name": "Alice", "level": 1}\n\n# Create/Update\nplayer["health"] = 100     # Add new key\nplayer["level"] = 5        # Update existing\n\n# Read\nprint(player["name"])      # Alice\n\n# Delete\ndel player["health"]       # Remove key\nplayer.pop("level")        # Remove and get value\n\n# List all keys/values\nprint(player.keys())         # dict_keys([...])\nprint(player.values())       # dict_values([...])\nprint(player.items())        # dict_items([(key, val), ...])',
                explanation: 'Dictionaries are mutable. Modify anytime.'
              },
              {
                title: 'Iterating Dictionaries',
                code: 'player = {"name": "Bob", "level": 3, "xp": 500}\n\n# Loop through keys\nfor key in player:\n    print(key)\n    \n# Loop through key-value pairs\nfor key, value in player.items():\n    print(f"{key}: {value}")',
                explanation: 'Common pattern: assign to two variables in for loop.'
              }
            ],
            keyRules: [
              '<code>dict[key] = value</code> creates/updates.',
              '<code>del dict[key]</code> removes.',
              '<code>dict.pop(key)</code> removes and returns value.',
              '<code>.items()</code> gives key-value tuples for iteration.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'How do you access a dictionary value safely?',
            options: ['dict[key]', 'dict.get(key)', 'dict.get(key, default)', 'Both b and c'],
            correctAnswer: 3
          },
          {
            question: 'What does `player.items()` return?',
            options: ['Just keys', 'Just values', 'Key-value tuples', 'A string'],
            correctAnswer: 2
          }
        ],
        references: [
          {
            title: 'Python.org: Dictionaries',
            author: 'Python Software Foundation',
            url: 'https://docs.python.org/3/tutorial/datastructures.html#dictionaries',
            emoji: '🐍',
            type: 'docs'
          },
          {
            title: 'Real Python: Dictionaries',
            author: 'Real Python',
            url: 'https://realpython.com/python-dicts/',
            emoji: '🔗',
            type: 'website'
          }
        ]
      }
    },
    { 
      levelNum:5, 
      title:'Functions & Advanced',    
      icon:'🚀', 
      description:'Functions, comprehensions, and sets.',
      theory: {
        title: 'Functions & Advanced Data Structures',
        emoji: '🚀',
        description: 'Create reusable code blocks with functions. Master list/dict comprehensions and set operations for advanced data manipulation.',
        topics: [
          {
            name: 'Defining Functions',
            emoji: '⚙️',
            content: 'Functions are reusable blocks of code. Define once, call many times.',
            codeExamples: [
              {
                title: 'Basic Function',
                code: '# Define a function\ndef greet(name):\n    return f"Hello, {name}!"\n\n# Call the function\nprint(greet("Alice"))    # Hello, Alice!\nprint(greet("Bob"))      # Hello, Bob!',
                explanation: 'Use `def` keyword to define. `return` sends value back to caller.'
              },
              {
                title: 'Default Parameters',
                code: '# Parameter with default value\ndef power(base, exponent=2):\n    return base ** exponent\n\nprint(power(5))          # 25 (uses default exponent=2)\nprint(power(5, 3))       # 125 (custom exponent)',
                explanation: 'Default values make parameters optional.'
              }
            ],
            keyRules: [
              'Use <code>def functionName(params):</code> to define.',
              '<code>return</code> sends value back (function ends here).',
              'Default parameters: <code>def func(x=default):</code>',
              'Function names follow same rules as variables.'
            ]
          },
          {
            name: 'List & Dict Comprehensions',
            emoji: '🎯',
            content: 'Compact syntax for creating lists and dicts.',
            codeExamples: [
              {
                title: 'List Comprehension',
                code: '# Create list of squares\nsquares = [x**2 for x in range(5)]\nprint(squares)  # [0, 1, 4, 9, 16]\n\n# With condition (only even numbers)\nevens = [x for x in range(10) if x % 2 == 0]\nprint(evens)    # [0, 2, 4, 6, 8]',
                explanation: 'Syntax: [expression for item in iterable if condition]'
              },
              {
                title: 'Dict Comprehension',
                code: '# Create dict of squares\nsquares_dict = {x: x**2 for x in range(5)}\nprint(squares_dict)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}\n\n# From another dict\nuser = {"name": "Alice", "age": 25}\nuppers = {k: v.upper() if isinstance(v, str) else v for k, v in user.items()}',
                explanation: 'Dict comprehension syntax: {key: value for item in iterable}'
              }
            ],
            keyRules: [
              'List comprehension: <code>[expr for x in iterable if condition]</code>',
              'Dict comprehension: <code>{k: v for x in iterable}</code>',
              'Much faster than loops for creating collections.',
              'Readable and Pythonic!'
            ]
          },
          {
            name: 'Sets & Operations',
            emoji: '⭕',
            content: 'Unordered collections of unique items. Perfect for removing duplicates and checking membership.',
            codeExamples: [
              {
                title: 'Set Basics',
                code: '# Create set (removes duplicates automatically)\ntags = {"python", "coding", "python", "tutorial"}  # Dup removed\nprint(tags)  # {"python", "coding", "tutorial"}\n\n# Convert list to set\nduplicates = [1, 2, 2, 3, 3, 3]\nunique = set(duplicates)\nprint(unique)  # {1, 2, 3}',
                explanation: 'Sets store unique values only. Order is not guaranteed.'
              },
              {
                title: 'Set Operations',
                code: 'set_a = {1, 2, 3, 4}\nset_b = {3, 4, 5, 6}\n\n# Union (all items from both)\nunion = set_a | set_b  # {1, 2, 3, 4, 5, 6}\n\n# Intersection (only common items)\nintersection = set_a & set_b  # {3, 4}\n\n# Difference (in A but not B)\ndifference = set_a - set_b  # {1, 2}',
                explanation: 'Set operations are fast and useful for data analysis.'
              }
            ],
            keyRules: [
              'Sets use curly braces: <code>{ }</code> (but no key:value like dicts).',
              'Duplicates are automatically removed.',
              'Useful for: removing duplicates, checking membership, set operations.',
              '<code>|</code> union, <code>&</code> intersection, <code>-</code> difference.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'What does `[x * 2 for x in range(5)]` produce?',
            options: ['[0, 1, 2, 3, 4]', '[0, 2, 4, 6, 8]', '[2, 4, 6, 8, 10]', '[1, 2, 4, 8, 16]'],
            correctAnswer: 2
          },
          {
            question: 'What\'s the result of `{1, 2, 2, 3, 3, 3}`?',
            options: ['{1, 2, 2, 3, 3, 3}', '{1, 2, 3}', '[1, 2, 3]', 'Error'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'Python.org: Functions',
            author: 'Python Software Foundation',
            url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions',
            emoji: '🐍',
            type: 'docs'
          },
          {
            title: 'Real Python: List Comprehensions',
            author: 'Real Python',
            url: 'https://realpython.com/list-comprehensions-and-generator-expressions/',
            emoji: '🔗',
            type: 'website'
          }
        ]
      }
    },
  ],
};

const pythonChallenges = [
  // Level 1
  { levelNum:1, order:0, title:'Variable Swap',        functionName:'swap',         difficulty:easy, xpReward:15, tags:['variables','python'],
    description:'Given two values, return them as a tuple **swapped**. In Python: `a, b = b, a`.',
    starterCode:'def swap(a, b):\n    # Return (b, a)\n    pass',
    storyContext:'The alchemist mixed up the potions — swap them back!',
    hints:['Simply return (b, a). In Python, (value) is a tuple.'],
    testCases:[{args:[1,2],expected:[2,1],description:'swap 1,2'},{args:['x','y'],expected:['y','x'],description:'swap strings'}] },
  { levelNum:1, order:1, title:'String Repeat',        functionName:'repeatStr',    difficulty:easy, xpReward:15, tags:['strings','python'],
    description:'Python: `"ha" * 3` → `"hahaha"`. Implement the same: repeat a string `n` times.',
    starterCode:'def repeatStr(s, n):\n    # Return string repeated n times\n    pass',
    storyContext:'The echo cave repeats your words — how many times?',
    hints:['In Python, use string * n to repeat.'],
    testCases:[{args:['ha',3],expected:'hahaha',description:'ha×3'},{args:['!',5],expected:'!!!!!',description:'!×5'}] },
  { levelNum:1, order:2, title:'String Length',         functionName:'strLen',       difficulty:easy, xpReward:15, tags:['strings','python'],
    description:'Python uses `len(s)`. Return the length of the string.',
    starterCode:'def strLen(s):\n    # Return length of string\n    pass',
    storyContext:'Measure the length of the enchanted rope.',
    hints:['Use len() function to get string length.'],
    testCases:[{args:['hello'],expected:5,description:'hello→5'},{args:[''],expected:0,description:'empty'}] },

  // Level 2
  { levelNum:2, order:0, title:'FizzBuzz Value',       functionName:'fizzBuzz',     difficulty:medium, xpReward:25, tags:['control-flow','python'],
    description:'Return "Fizz" if n divisible by 3, "Buzz" if by 5, "FizzBuzz" if both, otherwise the number as string.',
    starterCode:'def fizzBuzz(n):\n    # Check divisibility and return appropriate string\n    pass',
    storyContext:'The troll bridge toll has strange rules…',
    hints:['Check divisibility with %, test 15 first, then 3, then 5.'],
    testCases:[{args:[15],expected:'FizzBuzz',description:'15'},{args:[9],expected:'Fizz',description:'9'},{args:[10],expected:'Buzz',description:'10'},{args:[7],expected:'7',description:'7'}] },
  { levelNum:2, order:1, title:'Range List',          functionName:'range',        difficulty:medium, xpReward:25, tags:['loops','python'],
    description:'Python\'s `range(start, end)` returns numbers from start up to (not including) end. Return a list.',
    starterCode:'def range(start, end):\n    # Return list of numbers from start to end (exclusive)\n    pass',
    storyContext:'Generate the sequence of steps to cross the numbered bridge.',
    hints:['Use a for loop or list comprehension: [x for x in range(start, end)].'],
    testCases:[{args:[0,5],expected:[0,1,2,3,4],description:'0-4'},{args:[3,7],expected:[3,4,5,6],description:'3-6'}] },
  { levelNum:2, order:2, title:'Count Vowels',         functionName:'countVowels',  difficulty:medium, xpReward:25, tags:['strings','loops','python'],
    description:'Count the number of vowels (a, e, i, o, u) in a string (case-insensitive).',
    starterCode:'def countVowels(s):\n    # Return count of vowels\n    vowels = "aeiouAEIOU"\n    count = 0\n    # Your code here\n    return count',
    storyContext:'The singing crystal resonates with vowel sounds — count them.',
    hints:['Convert to lowercase, loop through chars, check against "aeiou".'],
    testCases:[{args:['Hello World'],expected:3,description:'Hello World→3'},{args:['rhythm'],expected:0,description:'no vowels'}] },

  // Level 3
  { levelNum:3, order:0, title:'Slice List',          functionName:'sliceArr',     difficulty:medium, xpReward:25, tags:['arrays','python'],
    description:'Python slicing: `arr[start:end]`. Return elements from index start to end (exclusive).',
    starterCode:'def sliceArr(arr, start, end):\n    # Return slice of array from start to end\n    pass',
    storyContext:'Cut the gem array to fit the treasure box.',
    hints:['Use Python slice notation: arr[start:end]'],
    testCases:[{args:[[10,20,30,40,50],1,4],expected:[20,30,40],description:'slice 1-3'}] },
  { levelNum:3, order:1, title:'List Comprehension',   functionName:'squares',      difficulty:medium, xpReward:30, tags:['arrays','python'],
    description:'Python: `[x**2 for x in range(n)]`. Return a list of squares from 0 to n-1.',
    starterCode:'def squares(n):\n    # Return list of squares using list comprehension\n    pass',
    storyContext:'Generate the power levels for each guild rank.',
    hints:['Use list comprehension: [x**2 for x in range(n)]'],
    testCases:[{args:[5],expected:[0,1,4,9,16],description:'squares 0-4'}] },
  { levelNum:3, order:2, title:'Unique Values',        functionName:'unique',       difficulty:medium, xpReward:30, tags:['arrays','python'],
    description:'Python: `list(set(arr))`. Return unique values from the list, sorted in ascending order.',
    starterCode:'def unique(arr):\n    # Return sorted list of unique values\n    pass',
    storyContext:'Remove duplicate artifacts from the inventory.',
    hints:['Convert to set to remove duplicates, then back to list, then sort.'],
    testCases:[{args:[[3,1,2,3,1]],expected:[1,2,3],description:'unique sorted'}] },

  // Level 4
  { levelNum:4, order:0, title:'Dict Items',       functionName:'entries',      difficulty:medium, xpReward:30, tags:['objects','python'],
    description:'Python: `dict.items()`. Return a list of [key, value] pairs from the dictionary.',
    starterCode:'def entries(d):\n    # Return list of [key, value] pairs (use list comprehension)\n    # Pattern: [[k, v] for k, v in d.items()]\n    pass',
    storyContext:'The merchant wants an itemized receipt — list each property.',
    hints:['Use dict.items() to get key-value pairs, convert to list of lists using list comprehension.'],
    testCases:[{args:[{a:1,b:2}],expected:[['a',1],['b',2]],description:'entries'}] },
  { levelNum:4, order:1, title:'Word Counter',         functionName:'wordCount',    difficulty:hard, xpReward:35, tags:['objects','strings','python'],
    description:'Count occurrences of each word (lowercase) in a string. Return a dictionary.',
    starterCode:'def wordCount(text):\n    # Return dictionary with word counts\n    words = text.lower().split()\n    counts = {}\n    # Your code here\n    return counts',
    storyContext:'The librarian needs a frequency index of the ancient text.',
    hints:['Split by spaces, loop through words, build dict with counts.'],
    testCases:[{args:['the cat sat on the mat'],expected:{the:2,cat:1,sat:1,on:1,mat:1},description:'word freq'}] },
  { levelNum:4, order:2, title:'Invert Dict',        functionName:'invert',       difficulty:hard, xpReward:35, tags:['objects','python'],
    description:'Swap keys and values. `{"a":"x"}` → `{"x":"a"}`.',
    starterCode:'def invert(d):\n    # Return dictionary with keys and values swapped\n    pass',
    storyContext:'The mirror realm reverses all mappings.',
    hints:['Loop through d.items(), swap key and value in new dict.'],
    testCases:[{args:[{a:'1',b:'2'}],expected:{'1':'a','2':'b'},description:'invert'}] },

  // Level 5
  { levelNum:5, order:0, title:'Define Function',     functionName:'add',          difficulty:medium, xpReward:30, tags:['functions','python'],
    description:'Define a function `add(a, b)` that returns the sum of two numbers.',
    starterCode:'def add(a, b):\n    # Return the sum\n    pass',
    storyContext:'Teach the apprentice the spell of addition.',
    hints:['Simply return a + b.'],
    testCases:[{args:[3,5],expected:8,description:'add 3+5'},{args:[10,20],expected:30,description:'add 10+20'},{args:[-5,3],expected:-2,description:'add negative'}] },
  { levelNum:5, order:1, title:'List Comprehension',   functionName:'tripleNums',    difficulty:medium, xpReward:35, tags:['functions','arrays','python'],
    description:'Use list comprehension to return a list where each number from input list is tripled.',
    starterCode:'def tripleNums(nums):\n    # Use list comprehension to triple each number\n    pass',
    storyContext:'The magic amplifier triples all the dragon gem values.',
    hints:['Use [x*3 for x in nums] notation.'],
    testCases:[{args:[[1,2,3]],expected:[3,6,9],description:'triple [1,2,3]'},{args:[[0,5,10]],expected:[0,15,30],description:'triple [0,5,10]'}] },
  { levelNum:5, order:2, title:'Remove Duplicates Set',functionName:'getDuplicatesFree',difficulty:hard, xpReward:40, tags:['functions','sets','python'],
    description:'Use a set to remove duplicates from a list and return a sorted list of unique values.',
    starterCode:'def getDuplicatesFree(lst):\n    # Use set to remove duplicates, return sorted list\n    pass',
    storyContext:'Filter the ore collection — remove duplicate stones and sort by purity.',
    hints:['Convert to set with set(lst), then back to list with list(...), then sort.'],
    testCases:[{args:[[5,2,5,3,2,1]],expected:[1,2,3,5],description:'unique sorted'},{args:[[9,9,9]],expected:[9],description:'all same'}] },
];

/* ════════════════════════════════════════════════════
   COURSE  3 — HTML & CSS Mastery
   ════════════════════════════════════════════════════ */
const htmlCourse = {
  title: 'HTML & CSS Mastery',
  description: 'Learn to build beautiful web pages — structure with HTML, style with CSS.',
  language: 'html',
  levels: [
    { 
      levelNum:1, 
      title:'HTML Basics',   
      icon:'🌐', 
      description:'Tags, elements and structure.',
      theory: {
        title: 'HTML: Structure of the Web',
        emoji: '🌐',
        description: 'HTML stands for HyperText Markup Language. It\'s the skeleton of every web page — it defines what content appears and how it\'s organized. HTML uses tags (words in angle brackets) to mark up content.',
        topics: [
          {
            name: 'HTML Document Structure',
            emoji: '📄',
            content: 'Every HTML page has the same basic structure:',
            codeExamples: [
              {
                title: 'Basic Document',
                code: '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="UTF-8">\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Welcome!</h1>\n    <p>This is my website.</p>\n  </body>\n</html>',
                explanation: 'DOCTYPE declares HTML5. <head> has metadata, <body> has visible content.'
              }
            ],
            keyRules: [
              '<code><!DOCTYPE html></code> must be first (HTML5).',
              '<code><head></code> contains metadata (title, styles, scripts).',
              '<code><body></code> contains visible content.',
              'Tags come in pairs: <code><tag>content</tag></code>. Some are self-closing: <code><img /></code>'
            ]
          },
          {
            name: 'Common HTML Elements',
            emoji: '🏷️',
            content: 'Building blocks for web content:',
            subtopics: [
              {
                name: 'Headings & Text',
                emoji: '📝',
                description: 'Organize content with hierarchy.',
                content: 'Headings rank from <h1> (biggest, most important) to <h6> (smallest). Paragraphs use <p>.',
                codeExamples: [
                  {
                    code: '<h1>Main Title</h1>\t<!-- Largest, use once per page -->\n<h2>Section</h2>\n<h3>Subsection</h3>\n<p>Normal paragraph text goes here.</p>\n<strong>Bold text</strong>\n<em>Italic text</em>',
                    explanation: 'Structure content hierarchically. <strong> for emphasis, <em> for italics.'
                  }
                ]
              },
              {
                name: 'Lists',
                emoji: '📋',
                description: 'Organize items.',
                content: 'Ordered (<ol>) for numbered, unordered (<ul>) for bullets.',
                codeExamples: [
                  {
                    code: '<!-- Unordered (bullets) -->\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n\n<!-- Ordered (numbered) -->\n<ol>\n  <li>First</li>\n  <li>Second</li>\n</ol>',
                    explanation: '<li> (list item) goes inside <ul> or <ol>.'
                  }
                ]
              },
              {
                name: 'Links & Images',
                emoji: '🔗',
                description: 'Connect to other pages and show pictures.',
                content: '<a> for links, <img> for images (self-closing).',
                codeExamples: [
                  {
                    code: '<!-- Links -->\n<a href="https://example.com">Click here</a>\n<a href="about.html">About page</a>\n\n<!-- Images -->\n<img src="photo.jpg" alt="My photo">\n<img src="logo.png" alt="Logo" width="100" height="100">',
                    explanation: '<a> uses href attribute. <img> needs src and alt (for accessibility).'
                  }
                ]
              },
              {
                name: 'Divs & Spans',
                emoji: '📦',
                description: 'Container elements (no default styling).',
                content: '<div> is block (full width), <span> is inline.',
                codeExamples: [
                  {
                    code: '<!-- Block container (full width) -->\n<div class="card">\n  <h3>Title</h3>\n  <p>Content here</p>\n</div>\n\n<!-- Inline container (flows with text) -->\n<p>This is <span class="highlight">highlighted</span> text.</p>',
                    explanation: 'Use div for layout sections, span for inline styling.'
                  }
                ]
              }
            ],
            keyRules: [
              '<code><h1>-<h6></code> for headings (use once <h1> per page).',
              '<code><p></code> for paragraphs.',
              '<code><ul></code>, <code><ol></code>, <code><li></code> for lists.',
              '<code><a href="..."></code> for links.',
              '<code><img src="..." alt="..."></code> for images (always include alt text!).'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'What does DOCTYPE declare?',
            options: ['Document language', 'HTML version (HTML5)', 'CSS version', 'JavaScript version'],
            correctAnswer: 1
          },
          {
            question: 'Where should visible content go?',
            options: ['<head>', '<body>', '<html>', '<title>'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'MDN: HTML Basics',
            author: 'Mozilla',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML',
            emoji: '📖',
            type: 'docs'
          },
          {
            title: 'HTML Living Standard',
            author: 'WHATWG',
            url: 'https://html.spec.whatwg.org/',
            emoji: '📚',
            type: 'docs'
          }
        ]
      }
    },
    { 
      levelNum:2, 
      title:'CSS Selectors', 
      icon:'🎨', 
      description:'Target and style elements.',
      theory: {
        title: 'CSS Selectors & Styling',
        emoji: '🎨',
        description: 'CSS controls the look and feel of your web page. Selectors target HTML elements, then rules style them. Learn to select elements and apply colors, fonts, spacing, and more.',
        topics: [
          {
            name: 'CSS Rule Syntax',
            emoji: '⚙️',
            content: 'A CSS rule has a selector and declarations:',
            codeExamples: [
              {
                title: 'CSS Rule Structure',
                code: 'selector {\n  property: value;\n  property: value;\n}\n\n/* Example */\np {\n  color: blue;           /* Text color */\n  font-size: 16px;       /* Font size */\n  background-color: yellow;  /* Background */\n}',
                explanation: 'Selector picks element(s). Declarations set properties.'
              }
            ],
            keyRules: [
              'CSS rules have selector and property-value pairs.',
              'Properties and values separated by colons: <code>property: value;</code>',
              'Each declaration ends with a semicolon.',
              'Wrap rules in curly braces.'
            ]
          },
          {
            name: 'Selector Types',
            emoji: '🎯',
            content: 'Different ways to target elements:',
            subtopics: [
              {
                name: 'Element Selector',
                emoji: '🏷️',
                description: 'Target by tag name.',
                content: 'Simplest: target all elements of a type.',
                codeExamples: [
                  {
                    code: '/* All paragraphs */\np {\n  color: blue;\n}\n\n/* All headings */\nh1, h2, h3 {\n  font-weight: bold;\n}',
                    explanation: 'Use element name without brackets.'
                  }
                ]
              },
              {
                name: 'Class Selector',
                emoji: '🎨',
                description: 'Target by class attribute.',
                content: 'Use class for reusable styles.',
                codeExamples: [
                  {
                    code: '/* CSS */\n.hero {\n  font-size: 2rem;\n  color: darkblue;\n}\n\n.card {\n  border: 1px solid gray;\n  padding: 10px;\n}\n\n<!-- HTML -->\n<h1 class="hero">Welcome</h1>\n<div class="card">Content</div>',
                    explanation: 'Class selector uses a dot: .classname'
                  }
                ]
              },
              {
                name: 'ID Selector',
                emoji: '🔑',
                description: 'Target by unique ID.',
                content: 'IDs should be unique per page. More specific than classes.',
                codeExamples: [
                  {
                    code: '/* CSS */\n#main {\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n<!-- HTML -->\n<div id="main">Main content</div>',
                    explanation: 'ID selector uses hash: #idname'
                  }
                ]
              }
            ],
            keyRules: [
              'Element: <code>p { ... }</code>',
              'Class: <code>.classname { ... }</code> (reusable)',
              'ID: <code>#idname { ... }</code> (unique, use sparingly)',
              'Multiple selectors: <code>h1, h2, p { ... }</code>'
            ]
          },
          {
            name: 'Combinators',
            emoji: '🔗',
            content: 'Combine selectors to target nested elements:',
            codeExamples: [
              {
                title: 'Combinator Types',
                code: '/* Descendant (any level) */\ndiv p { color: blue; }\n\n/* Child (direct child only) */\ndiv > p { color: red; }\n\n/* Adjacent sibling */\nh1 + p { font-weight: bold; }\n\n<!-- HTML Example -->\n<div>\n  <p>Blue (descendant)</p>\n  <section>\n    <p>Also blue (descendant)</p>\n  </section>\n</div>',
                explanation: 'Combinators select elements in specific relationships.'
              }
            ],
            keyRules: [
              'Descendant: <code>sel1 sel2</code> (space) — any depth',
              'Child: <code>sel1 > sel2</code> — direct child only',
              'Adjacent: <code>sel1 + sel2</code> — next sibling'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'How do you target all elements with class="button"?',
            options: ['.button', '#button', 'button{}', '$button'],
            correctAnswer: 0
          },
          {
            question: 'What\'s more specific: element or class selector?',
            options: ['Element', 'Class', 'They\'re equal', 'Depends'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'MDN: CSS Selectors',
            author: 'Mozilla',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors',
            emoji: '📖',
            type: 'docs'
          },
          {
            title: 'CSS Tricks: Selectors Guide',
            author: 'CSS-Tricks',
            url: 'https://css-tricks.com/how-css-is-scoped/',
            emoji: '🔗',
            type: 'website'
          }
        ]
      }
    },
    { 
      levelNum:3, 
      title:'Flexbox & Grid', 
      icon:'📐', 
      description:'Modern layout techniques.',
      theory: {
        title: 'Flexbox & CSS Grid: Modern Layouts',
        emoji: '📐',
        description: 'Stop struggling with layout! Flexbox and Grid make it easy to position elements responsively. Master the modern web layout tools.',
        topics: [
          {
            name: 'Flexbox Fundamentals',
            emoji: '↔️',
            content: 'Flexbox arranges items in a row or column automatically.',
            codeExamples: [
              {
                title: 'Basic Flexbox',
                code: '/* CSS */\n.container {\n  display: flex;              /* Activate flexbox */\n  justify-content: center;    /* Center horizontally */\n  align-items: center;        /* Center vertically */\n  gap: 1rem;                  /* Space between items */\n  height: 200px;\n}\n\n<!-- HTML -->\n<div class="container">\n  <button>Save</button>\n  <button>Cancel</button>\n</div>',
                explanation: 'display: flex activates flexbox. Items auto-arrange.'
              },
              {
                title: 'Flexbox Properties',
                code: '.container {\n  display: flex;\n  flex-direction: row;        /* row (default) or column */\n  justify-content: space-between;  /* Distribute along main axis */\n  align-items: stretch;       /* Align on cross axis */\n  flex-wrap: wrap;            /* Wrap items to next line */\n}',
                explanation: 'Common flex properties for layout control.'
              }
            ],
            keyRules: [
              '<code>display: flex;</code> enables flexbox.',
              '<code>flex-direction:</code> row (default) or column.',
              '<code>justify-content:</code> main axis (left-right if row).',
              '<code>align-items:</code> cross axis (up-down if row).'
            ]
          },
          {
            name: 'CSS Grid Fundamentals',
            emoji: '⊞',
            content: 'Grid creates 2D layouts with rows and columns.',
            codeExamples: [
              {
                title: 'Basic Grid',
                code: '/* CSS */\n.grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;  /* 3 equal columns */\n  gap: 1rem;\n}\n\n<!-- HTML -->\n<div class="grid">\n  <div>Card 1</div>\n  <div>Card 2</div>\n  <div>Card 3</div>\n</div>',
                explanation: '1fr = 1 fraction (equal space). Creates 3-column layout.'
              },
              {
                title: 'Advanced Grid',
                code: '.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 1rem;\n}\n\n/* This creates flexible columns that adjust to screen size */\n/* repeat(n, size) — repeat n times */\n/* auto-fit — fit as many as possible */\n/* minmax(min, max) — responsive size */\n/* 1fr — fill remaining space equally */',
                explanation: 'Advanced grid for responsive layouts without media queries.'
              }
            ],
            keyRules: [
              '<code>display: grid;</code> enables grid.',
              '<code>grid-template-columns:</code> define column structure.',
              '<code>grid-template-rows:</code> define row structure.',
              '<code>gap:</code> space between items.',
              '<code>repeat(n, size)</code> and <code>1fr</code> for flexible layouts.'
            ]
          },
          {
            name: 'Flexbox vs Grid',
            emoji: '⚖️',
            content: 'When to use which:',
            codeExamples: [
              {
                title: 'Use Flexbox for:',
                code: '/* 1D layouts (rows or columns) */\n/* Navigation menus */\n.nav {\n  display: flex;\n  justify-content: space-around;\n}\n\n/* Button rows */\n.buttons {\n  display: flex;\n  gap: 0.5rem;\n}\n\n/* Centering */\n.centered {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
                explanation: 'Flexbox for simple, linear layouts.'
              },
              {
                title: 'Use Grid for:',
                code: '/* 2D layouts (rows AND columns) */\n/* Dashboard layouts */\n.dashboard {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-rows: 60px 1fr 40px;\n}\n\n/* Gallery grids */\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n}',
                explanation: 'Grid for complex, 2D layouts.'
              }
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'Which property activates flexbox?',
            options: ['flex: true;', 'display: flex;', 'layout: flex;', 'flex-enable: on;'],
            correctAnswer: 1
          },
          {
            question: 'What does `1fr` mean in grid?',
            options: ['1 fraction of available space', '1 frame', 'First row', '1 flex-ratio'],
            correctAnswer: 0
          }
        ],
        references: [
          {
            title: 'MDN: Flexbox',
            author: 'Mozilla',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox',
            emoji: '📖',
            type: 'docs'
          },
          {
            title: 'MDN: CSS Grid',
            author: 'Mozilla',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids',
            emoji: '📖',
            type: 'docs'
          },
          {
            title: 'CSS-Tricks: Guide to Flexbox',
            author: 'CSS-Tricks',
            url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
            emoji: '🔗',
            type: 'website'
          }
        ]
      }
    },
    { 
      levelNum:4, 
      title:'Responsive Design', 
      icon:'📱', 
      description:'Make pages work on every screen.',
      theory: {
        title: 'Responsive Design: Mobile-First Web',
        emoji: '📱',
        description: 'Make your website look great on any device — phone, tablet, or desktop. Learn media queries, flexible units, and responsive images.',
        topics: [
          {
            name: 'Mobile-First Approach',
            emoji: '📱',
            content: 'Design for mobile first, then enhance for larger screens.',
            codeExamples: [
              {
                title: 'Mobile-First CSS',
                code: '/* Default: mobile (small screen) */\nbody {\n  font-size: 14px;\n}\n\n.card {\n  width: 100%;  /* Full width on mobile */\n  padding: 1rem;\n}\n\n/* Tablet and up */\n@media (min-width: 768px) {\n  body {\n    font-size: 16px;\n  }\n  .card {\n    width: 48%;  /* Side by side */\n  }\n}\n\n/* Desktop and up */\n@media (min-width: 1024px) {\n  .card {\n    width: 30%;  /* 3 columns */\n  }\n}',
                explanation: 'Media queries add styles for larger screens. Start simple, enhance progressively.'
              }
            ],
            keyRules: [
              'Always include viewport meta tag: <code><meta name="viewport" content="width=device-width, initial-scale=1.0"></code>',
              '<code>@media (condition) { ... }</code> applies styles conditionally.',
              '<code>min-width</code> for "bigger than this".',
              '<code>max-width</code> for "smaller than this".'
            ]
          },
          {
            name: 'Flexible Units',
            emoji: '📏',
            content: 'Use relative units instead of fixed pixels:',
            codeExamples: [
              {
                title: 'Relative Units',
                code: '/* Avoid fixed pixels */\n/* DON\'T: width: 500px; */\n\n/* DO: Use relative units */\n.container {\n  max-width: 1200px;   /* Max width setter */\n  width: 100%;         /* Fill parent */\n  padding: 2rem;       /* rem = relative to root */\n  margin: 0 auto;      /* Auto margin centers */\n}\n\n.card {\n  width: 90%;          /* 90% of parent */\n  font-size: 1rem;     /* Same as root (16px by default) */\n  line-height: 1.5;    /* Unitless multiplier */\n}\n\n.small-text {\n  font-size: 0.875rem;  /* 14px if root is 16px */\n}',
                explanation: 'Relative units adapt to screen size. % for layout, rem for typography.'
              }
            ],
            keyRules: [
              '<code>%</code> = percentage of parent.',
              '<code>rem</code> = relative to root font size (usually 16px).',
              '<code>em</code> = relative to parent font size.',
              '<code>vw</code>/<code>vh</code> = percentage of viewport width/height.',
              'Avoid fixed <code>px</code> for layout; use only for small details.'
            ]
          },
          {
            name: 'Responsive Images',
            emoji: '🖼️',
            content: 'Make images adapt to screen size:',
            codeExamples: [
              {
                title: 'Flexible Images',
                code: '/* CSS */\nimg {\n  max-width: 100%;    /* Never bigger than container */\n  height: auto;       /* Maintain aspect ratio */\n  display: block;     /* Remove inline spacing */\n}\n\n/* Responsive image sources */\n<picture>\n  <source media="(min-width: 1024px)" srcset="photo-large.jpg">\n  <source media="(min-width: 768px)" srcset="photo-medium.jpg">\n  <img src="photo-small.jpg" alt="Photo">\n</picture>',
                explanation: '<picture> element serves different images based on screen size.'
              }
            ],
            keyRules: [
              'Always set <code>max-width: 100%</code> and <code>height: auto</code> on images.',
              'Use <code>&lt;picture></code> for art-direction (crop/resize for different screens).',
              'Use <code>srcset</code> attribute for resolution-aware images.',
              'Always include <code>alt</code> text for accessibility.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'What meta tag controls responsive behavior?',
            options: ['<meta responsive>', '<meta name="viewport" content="width=device-width">', '<meta device="mobile">', '<meta responsive="true">'],
            correctAnswer: 1
          },
          {
            question: 'Which is better for layout: 500px or 100%?',
            options: ['500px (more control)', '100% (more flexible)', 'Both are equal', 'Neither'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'MDN: Responsive Design',
            author: 'Mozilla',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design',
            emoji: '📖',
            type: 'docs'
          },
          {
            title: 'Web.dev: Responsive Web Design Basics',
            author: 'Google',
            url: 'https://web.dev/responsive-web-design-basics/',
            emoji: '🔗',
            type: 'website'
          }
        ]
      }
    },
  ],
};

const htmlChallenges = [
  // Level 1 - HTML Structure
  { levelNum:1, order:0, title:'Tag Builder',          functionName:'buildTag',     difficulty:easy, xpReward:15, tags:['html'],
    description:'Master HTML: Create an HTML string `<tag>content</tag>` given a tag name and content. Learn how HTML tags wrap content.',
    starterCode:'function buildTag(tag, content) {\n  // Construct an HTML element string\n  // Example: buildTag("p", "Hello") → "<p>Hello</p>"\n}',
    storyContext:'The Web Wizard needs you to craft HTML elements from raw materials.',
    hints:['Use template literals to combine strings: `<${tag}>${content}</${tag}>`'],
    testCases:[{args:['h1','Hello'],expected:'<h1>Hello</h1>',description:'h1 tag'},{args:['p','text'],expected:'<p>text</p>',description:'p tag'}] },
  { levelNum:1, order:1, title:'Link Creator',         functionName:'makeLink',     difficulty:easy, xpReward:20, tags:['html','anchor'],
    description:'HTML Anchors: Create an `<a>` tag with href and text: `<a href="url">text</a>`. Learn how hyperlinks work.',
    starterCode:'function makeLink(url, text) {\n  // Build an anchor (link) element with href attribute\n  // Example: makeLink("https://example.com", "Click") → \'<a href="https://example.com">Click</a>\'\n}',
    storyContext:'Build a portal (hyperlink) to connect two web realms.',
    hints:['Include the href attribute in the opening tag. Use template literals.'],
    testCases:[{args:['https://example.com','Click'],expected:'<a href="https://example.com">Click</a>',description:'link'}] },
  { levelNum:1, order:2, title:'List Builder',         functionName:'buildList',    difficulty:medium, xpReward:25, tags:['html','lists'],
    description:'HTML Lists: Given an array of items, build an unordered list: `<ul>` with `<li>` elements. Understanding list structure.',
    starterCode:'function buildList(items) {\n  // Convert array items to <li> elements wrapped in <ul>\n  // Example: ["a","b"] → "<ul><li>a</li><li>b</li></ul>"\n}',
    storyContext:'The inventory system needs a formatted supply list.',
    hints:['Use .map() to convert each item to "<li>item</li>", join them, then wrap in <ul></ul>.'],
    testCases:[{args:[['a','b']],expected:'<ul><li>a</li><li>b</li></ul>',description:'list'}] },

  // Level 2 - CSS Fundamentals
  { levelNum:2, order:0, title:'CSS Property',         functionName:'cssProperty',  difficulty:easy, xpReward:20, tags:['css'],
    description:'CSS Properties: Return the correct CSS property name to change text color. Learn CSS property names.',
    starterCode:'function cssProperty() {\n  // Return the CSS property name that controls text color\n}',
    storyContext:'Which CSS spell changes the text color?',
    hints:['Hint: What CSS property controls font/text color? (not backgroundColor)'],
    testCases:[{args:[],expected:'color',description:'color property'}] },
  { levelNum:2, order:1, title:'CSS Specificity',    functionName:'specificity',  difficulty:medium, xpReward:25, tags:['css','selectors'],
    description:'CSS Selectors: Return the three selector types ordered from lowest to highest specificity.',
    starterCode:'function specificity() {\n  // Return array of selector types in order of increasing specificity\n  // ["element", "class", "id"]\n}',
    storyContext:'The CSS Council ranks selectors by power level.',
    hints:['Order: element selector < class selector < ID selector in specificity strength.'],
    testCases:[{args:[],expected:['element','class','id'],description:'specificity order'}] },
  { levelNum:2, order:2, title:'CSS Declaration',         functionName:'styleStr',     difficulty:medium, xpReward:25, tags:['css'],
    description:'CSS Rules: Given property and value, format a CSS declaration: `property: value;`. Learning CSS syntax.',
    starterCode:'function styleStr(prop, val) {\n  // Format a CSS property:value pair with semicolon\n  // Example: styleStr("color", "red") → "color: red;"\n}',
    storyContext:'Compose the magical incantation (CSS rule) for the enchanted stylesheet.',
    hints:['Template literal: `${prop}: ${val};` (notice the spaces and semicolon)'],
    testCases:[{args:['color','red'],expected:'color: red;',description:'color rule'},{args:['font-size','16px'],expected:'font-size: 16px;',description:'font-size'}] },

  // Level 3 - Modern CSS Layouts
  { levelNum:3, order:0, title:'Flexbox Direction',       functionName:'flexDir',      difficulty:easy, xpReward:20, tags:['css','flexbox'],
    description:'Flexbox: Return the CSS flex-direction value that stacks items vertically. Learning flexbox layouts.',
    starterCode:'function flexDir() {\n  // Return the flex-direction value for vertical stacking\n}',
    storyContext:'The layout wizard needs the vertical stacking spell.',
    hints:['flex-direction property values: row (horizontal default) or column (vertical)?'],
    testCases:[{args:[],expected:'column',description:'column'}] },
  { levelNum:3, order:1, title:'CSS Grid',        functionName:'gridCols',     difficulty:medium, xpReward:25, tags:['css','grid'],
    description:'CSS Grid: Return grid-template-columns value that creates n equal columns using fr units. Learn responsive grids.',
    starterCode:'function gridCols(n) {\n  // Return CSS grid-template-columns for n equal columns\n  // Example: gridCols(3) → "1fr 1fr 1fr"\n}',
    storyContext:'Design the castle blueprint — divide the hall into equal sections.',
    hints:['Create "1fr" repeated n times, separated by spaces. Use Array(n).fill() or loop.'],
    testCases:[{args:[3],expected:'1fr 1fr 1fr',description:'3 cols'},{args:[1],expected:'1fr',description:'1 col'}] },
  { levelNum:3, order:2, title:'Flexbox Centering',       functionName:'centerCSS',    difficulty:medium, xpReward:30, tags:['css','flexbox'],
    description:'Centering with Flexbox: Return an object with CSS properties (camelCase) to center content. Master centering techniques.',
    starterCode:'function centerCSS() {\n  // Return { display, justifyContent, alignItems }\n  // with correct values for perfect centering\n}',
    storyContext:'The portal must be perfectly centered to open.',
    hints:['display: "flex" activates flexbox, justifyContent and alignItems: "center" for centering.'],
    testCases:[{args:[],expected:{display:'flex',justifyContent:'center',alignItems:'center'},description:'center'}] },

  // Level 4 - Responsive Design
  { levelNum:4, order:0, title:'Responsive Breakpoint',    functionName:'breakpoint',   difficulty:medium, xpReward:25, tags:['css','responsive'],
    description:'Responsive Design: Return the common tablet breakpoint width in pixels. Learn responsive design standards.',
    starterCode:'function breakpoint() {\n  // Return the tablet breakpoint width (pixel value)\n}',
    storyContext:'At what screen width does the layout shapeshift?',
    hints:['Common media query breakpoints: 768px for tablets, 1024px for desktops.'],
    testCases:[{args:[],expected:768,description:'768px'}] },
  { levelNum:4, order:1, title:'Responsive Units',      functionName:'pxToRem',      difficulty:medium, xpReward:25, tags:['css','responsive'],
    description:'Rem Units: Convert pixels to rem (16px base). Return the number. Learn scalable CSS units.',
    starterCode:'function pxToRem(px) {\n  // Convert pixels to rem units (16px = 1rem)\n}',
    storyContext:'Translate the fixed measurement into a fluid one.',
    hints:['Formula: rem = px / 16 (assuming default 16px root font-size)'],
    testCases:[{args:[32],expected:2,description:'32→2'},{args:[16],expected:1,description:'16→1'}] },
  { levelNum:4, order:2, title:'Viewport Meta Tag',        functionName:'viewportTag',  difficulty:hard, xpReward:35, tags:['html','responsive'],
    description:'Mobile Responsiveness: Return the content attribute for a responsive viewport meta tag. Understanding mobile-first design.',
    starterCode:'function viewportTag() {\n  // Return the content string for viewport meta tag\n}',
    storyContext:'Configure the portal viewport for all device sizes.',
    hints:['Standard viewport meta: "width=device-width, initial-scale=1.0"'],
    testCases:[{args:[],expected:'width=device-width, initial-scale=1.0',description:'viewport'}] },
];

/* ════════════════════════════════════════════════════
   COURSE  4 — React Foundations
   ════════════════════════════════════════════════════ */
const reactCourse = {
  title: 'React Foundations',
  description: 'Build dynamic UIs with components, state, props and hooks.',
  language: 'react',
  levels: [
    { 
      levelNum:1, 
      title:'Components & JSX', 
      icon:'⚛️', 
      description:'Build your first component.',
      theory: {
        title: 'Components & JSX: Building Blocks of React',
        emoji: '⚛️',
        description: 'React is a library for building interactive UIs with reusable components. Components are functions that return JSX — a syntax that looks like HTML but is actually JavaScript.',
        topics: [
          {
            name: 'What are Components?',
            emoji: '🧩',
            content: 'Components are reusable chunks of UI. They\'re just JavaScript functions that return JSX (HTML-like syntax).',
            codeExamples: [
              {
                title: 'Function Component',
                code: 'function Welcome() {\n  return <h1>Hello, World!</h1>;\n}\n\nfunction Card({ title, children }) {\n  return (\n    <div className="card">\n      <h2>{title}</h2>\n      <p>{children}</p>\n    </div>\n  );\n}',
                explanation: 'Components are functions. Props are parameters. Return JSX (looks like HTML).'
              }
            ],
            keyRules: [
              'Component names must start with capital letter.',
              'Components return JSX (one root element).',
              'Props are function parameters.',
              'JSX is converted to React.createElement() calls.'
            ]
          },
          {
            name: 'JSX Syntax Rules',
            emoji: '📝',
            content: 'JSX is HTML-like syntax written in JavaScript. But there are important rules:',
            codeExamples: [
              {
                title: 'JSX Dos and Don\'ts',
                code: '// ✅ DO: Return single root element\nfunction Good() {\n  return <div>\n    <h1>Title</h1>\n    <p>Content</p>\n  </div>;\n}\n\n// ❌ DON\'T: Multiple root elements\n// function Bad() {\n//   return <h1>Title</h1> <p>Content</p>;  // ERROR\n// }\n\n// ✅ DO: Use className (not class)\nreturn <div className="highlight">Text</div>;\n\n// ✅ DO: Embed variables with {}\nconst name = "Alice";\nreturn <h1>Hello, {name}!</h1>;\n\n// ✅ DO: Close all tags (even self-closing)\nreturn <>\n  <img src="photo.jpg" />\n  <input type="text" />\n</>',
                explanation: 'JSX rules mirror basic JavaScript/HTML patterns with React-specific tweaks.'
              }
            ],
            keyRules: [
              'Single root element (wrap in <div> or use <> fragment).',
              'Use <code>className</code> instead of <code>class</code>.',
              'Variables with <code>{}</code>: <code>{name}</code>, <code>{count + 1}</code>.',
              'All tags must close: <code><img /></code>, <code><input /></code>, etc.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'Component names must start with:',
            options: ['lowercase letter', 'UPPERCASE letter', 'underscore', 'dollar sign'],
            correctAnswer: 1
          },
          {
            question: 'What do you use to embed JavaScript in JSX?',
            options: ['${...}', '{% %}', '{...}', '<%= %>'],
            correctAnswer: 2
          }
        ],
        references: [
          {
            title: 'React Docs: Components',
            author: 'Meta',
            url: 'https://react.dev/learn/your-first-component',
            emoji: '⚛️',
            type: 'docs'
          },
          {
            title: 'React Docs: JSX',
            author: 'Meta',
            url: 'https://react.dev/learn/writing-markup-with-jsx',
            emoji: '⚛️',
            type: 'docs'
          }
        ]
      }
    },
    { 
      levelNum:2, 
      title:'State & Events',   
      icon:'🔄', 
      description:'Make interactive UIs.',
      theory: {
        title: 'State & Events: Making UIs Interactive',
        emoji: '🔄',
        description: 'State allows components to remember information and respond to user interactions. Events (like clicks) trigger state changes.',
        topics: [
          {
            name: 'useState Hook',
            emoji: '💾',
            content: 'The useState hook lets you add state to function components.',
            codeExamples: [
              {
                title: 'Using useState',
                code: 'import { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}',
                explanation: 'useState returns [currentValue, setterFunction]. Calling setter triggers re-render.'
              }
            ],
            keyRules: [
              'Import: <code>import { useState } from "react";</code>',
              'Syntax: <code>const [state, setState] = useState(initialValue);</code>',
              'Calling setState causes component to re-render.',
              'State updates are asynchronous.'
            ]
          },
          {
            name: 'Events & Handlers',
            emoji: '🖱️',
            content: 'Respond to user interactions with event handlers.',
            codeExamples: [
              {
                title: 'Event Handlers',
                code: 'function LoginForm() {\n  const [email, setEmail] = useState("");\n  const [submitted, setSubmitted] = useState(false);\n  \n  const handleChange = (e) => {\n    setEmail(e.target.value);\n  };\n  \n  const handleSubmit = (e) => {\n    e.preventDefault();  // Stop page reload\n    setSubmitted(true);\n  };\n  \n  return (\n    <form onSubmit={handleSubmit}>\n      <input \n        type="email" \n        value={email} \n        onChange={handleChange} \n      />\n      <button type="submit">Login</button>\n      {submitted && <p>Form submitted!</p>}\n    </form>\n  );\n}',
                explanation: 'onClick, onChange, onSubmit, etc. Handler receives event object with target.value.'
              }
            ],
            keyRules: [
              'JSX events: <code>onClick={handler}</code> (camelCase).',
              'Event handlers receive event object.',
              'Use <code>e.target.value</code> to get input value.',
              'Use <code>e.preventDefault()</code> in forms to stop default behavior.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'What does useState return?',
            options: ['A state value', 'A setter function', 'An array with [value, setter]', 'An object'],
            correctAnswer: 2
          },
          {
            question: 'How do you access input value in onChange?',
            options: ['event.value', 'event.target.value', 'event.input.value', 'value()'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'React Docs: useState',
            author: 'Meta',
            url: 'https://react.dev/reference/react/useState',
            emoji: '⚛️',
            type: 'docs'
          }
        ]
      }
    },
    { 
      levelNum:3, 
      title:'Props & Lists',     
      icon:'📋', 
      description:'Pass data and render lists.',
      theory: {
        title: 'Props & Lists: Composing Components',
        emoji: '📋',
        description: 'Props allow parent components to pass data to children. Lists of components need special keys for React performance.',
        topics: [
          {
            name: 'Props: Component Communication',
            emoji: '📦',
            content: 'Props are how components communicate. Parent passes props, child receives them as function parameters.',
            codeExamples: [
              {
                title: 'Using Props',
                code: 'function UserCard({ name, level, avatar }) {\n  return (\n    <div className="user-card">\n      <img src={avatar} alt={name} />\n      <h3>{name}</h3>\n      <p>Level: {level}</p>\n    </div>\n  );\n}\n\n// Parent component\nfunction UserList() {\n  return (\n    <div>\n      <UserCard name="Alice" level={5} avatar="alice.jpg" />\n      <UserCard name="Bob" level={3} avatar="bob.jpg" />\n    </div>\n  );\n}',
                explanation: 'Destructure props in function parameters. Props are read-only.'
              }
            ],
            keyRules: [
              'Props are read-only (don\'t modify them).',
              'Pass props as attributes: <code><Card name="Alice" level={5} /></code>',
              'Receive as function parameters or object: <code>function Card(props)</code>',
              'Destructure for convenience: <code>function Card({ name, level })</code>'
            ]
          },
          {
            name: 'Rendering Lists',
            emoji: '🔁',
            content: 'Use .map() to render a list of components. Each item needs a unique `key`.',
            codeExamples: [
              {
                title: 'Lists with Keys',
                code: 'const users = [\n  { id: 1, name: "Alice" },\n  { id: 2, name: "Bob" },\n  { id: 3, name: "Charlie" }\n];\n\nfunction UserList() {\n  return (\n    <ul>\n      {users.map(user => (\n        <li key={user.id}>\n          {user.name}\n        </li>\n      ))}\n    </ul>\n  );\n}\n\n// ❌ DON\'T use index as key (if list can reorder)\n// {users.map((user, i) => <li key={i}>{user.name}</li>)}\n\n// ✅ DO use unique identifier\n// {users.map(user => <li key={user.id}>{user.name}</li>)}',
                explanation: 'key prop helps React identify which items changed. Use stable unique IDs, not array indices.'
              }
            ],
            keyRules: [
              'Always provide a <code>key</code> prop when rendering lists.',
              'Key should be unique and stable (same across renders).',
              'Don\'t use array index as key if list can reorder.',
              '<code>.filter()</code> before <code>.map()</code> to transform data.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'Are props mutable (can you change them)?',
            options: ['Yes, always', 'No, props are read-only', 'Only child props', 'Only top-level props'],
            correctAnswer: 1
          },
          {
            question: 'What should you use as a `key` in lists?',
            options: ['Array index', 'Unique stable ID', 'Item name', 'Position'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'React Docs: Props',
            author: 'Meta',
            url: 'https://react.dev/learn/passing-props-to-a-component',
            emoji: '⚛️',
            type: 'docs'
          },
          {
            title: 'React Docs: Rendering Lists',
            author: 'Meta',
            url: 'https://react.dev/learn/rendering-lists',
            emoji: '⚛️',
            type: 'docs'
          }
        ]
      }
    },
    { 
      levelNum:4, 
      title:'Effects & Context', 
      icon:'🌍', 
      description:'Side effects and global state.',
      theory: {
        title: 'useEffect & Context: Advanced Patterns',
        emoji: '🌍',
        description: 'useEffect handles side effects (API calls, subscriptions). Context shares data across the component tree without prop drilling.',
        topics: [
          {
            name: 'useEffect Hook',
            emoji: '⚡',
            content: 'useEffect runs code after component renders (for side effects).',
            codeExamples: [
              {
                title: 'useEffect Patterns',
                code: 'import { useEffect, useState } from "react";\n\nfunction DataFetcher() {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  \n  // Run once on mount (empty dependency array)\n  useEffect(() => {\n    fetch("/api/data")\n      .then(r => r.json())\n      .then(data => {\n        setData(data);\n        setLoading(false);\n      });\n  }, []);  // Empty = run once\n  \n  // Run when userId changes\n  useEffect(() => {\n    console.log("userId changed!");\n  }, [userId]);  // Dependency array\n  \n  // Cleanup on unmount\n  useEffect(() => {\n    const timer = setInterval(() => console.log("tick"), 1000);\n    return () => clearInterval(timer);  // Cleanup\n  }, []);\n  \n  if (loading) return <p>Loading...</p>;\n  return <div>{JSON.stringify(data)}</div>;\n}',
                explanation: 'Dependencies control when effect runs. Return cleanup function if needed.'
              }
            ],
            keyRules: [
              'Empty deps []: Run once on mount.',
              'No deps: Run after every render (usually bad).',
              '<code>[dependency]</code>: Run when dependency changes.',
              'Return a cleanup function for subscriptions/timers.'
            ]
          },
          {
            name: 'Context API',
            emoji: '🌐',
            content: 'Share data across the component tree without passing props at every level.',
            codeExamples: [
              {
                title: 'Using Context',
                code: 'import { createContext, useContext, useState } from "react";\n\n// Create context\nconst ThemeContext = createContext("light");\n\n// Provider component\nfunction App() {\n  const [theme, setTheme] = useState("light");\n  \n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      <Header />\n      <Main />\n      <Footer />\n    </ThemeContext.Provider>\n  );\n}\n\n// Consumer component\nfunction Header() {\n  const { theme, setTheme } = useContext(ThemeContext);\n  \n  return (\n    <header style={{ background: theme === "dark" ? "#333" : "#fff" }}>\n      <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>\n        Toggle Theme\n      </button>\n    </header>\n  );\n}',
                explanation: 'createContext creates shared state. Provider wraps tree. useContext accesses value.'
              }
            ],
            keyRules: [
              '<code>createContext(initialValue)</code> creates context.',
              '<code>&lt;Context.Provider value={...}></code> provides value to tree.',
              '<code>useContext(Context)</code> reads the value (anywhere below provider).',
              'Good for: themes, auth, settings. Not for frequently-changing state.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'When does useEffect with empty dependency array run?',
            options: ['On every render', 'Once on mount', 'When any prop changes', 'Never'],
            correctAnswer: 1
          },
          {
            question: 'Why use Context instead of props?',
            options: ['More performant', 'Avoids prop drilling', 'Required for styling', 'Always needed'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'React Docs: useEffect',
            author: 'Meta',
            url: 'https://react.dev/reference/react/useEffect',
            emoji: '⚛️',
            type: 'docs'
          },
          {
            title: 'React Docs: Context',
            author: 'Meta',
            url: 'https://react.dev/learn/passing-data-deeply-with-context',
            emoji: '⚛️',
            type: 'docs'
          }
        ]
      }
    },
  ],
};

const reactChallenges = [
  // Level 1 - JSX & Props
  { levelNum:1, order:0, title:'JSX Basics',         functionName:'jsxGreeting',  difficulty:easy, xpReward:15, tags:['react','jsx'],
    description:'React JSX: Understand what a JSX `<h1>Hello, {name}!</h1>` component renders. Return the text content.',
    starterCode:'function jsxGreeting(name) {\n  // Return what this JSX would render as text:\n  // <h1>Hello, {name}!</h1>\n}',
    storyContext:'Your first React component speaks — what does it say?',
    hints:['JSX interpolates variables with {}: "Hello, " + name + "!"'],
    testCases:[{args:['World'],expected:'Hello, World!',description:'greeting'}] },
  { levelNum:1, order:1, title:'Props Extraction',      functionName:'extractProps', difficulty:easy, xpReward:20, tags:['react','props'],
    description:'React Props: Given a component props object `{ title, subtitle }`, combine and display them.',
    starterCode:'function extractProps(props) {\n  // Component receives props object\n  // Return formatted string: "title - subtitle"\n}',
    storyContext:'The component needs to display its props — format them.',
    hints:['Access properties: props.title and props.subtitle, combine with " - ".'],
    testCases:[{args:[{title:'React',subtitle:'Rocks'}],expected:'React - Rocks',description:'combine props'}] },
  { levelNum:1, order:2, title:'Conditional Rendering',   functionName:'showIf',       difficulty:medium, xpReward:25, tags:['react','conditional'],
    description:'React Conditionals: Return `"visible"` if condition is true, `"hidden"` if false. Learn conditional rendering.',
    starterCode:'function showIf(show) {\n  // Simulate conditional render: show is true/false\n  // Return appropriate string\n}',
    storyContext:'The component appears and disappears based on the boolean spell.',
    hints:['Use ternary: show ? "visible" : "hidden"'],
    testCases:[{args:[true],expected:'visible',description:'visible'},{args:[false],expected:'hidden',description:'hidden'}] },

  // Level 2 - State Management
  { levelNum:2, order:0, title:'State Updates',         functionName:'toggle',       difficulty:medium, xpReward:25, tags:['react','state'],
    description:'React State: Simulate toggling a boolean state like `setState(prev => !prev)`. Return the new state.',
    starterCode:'function toggle(state) {\n  // Simulate React state toggle\n  // Return opposite boolean\n}',
    storyContext:'Flip the switch on the magical lantern.',
    hints:['Return the negation: !state'],
    testCases:[{args:[true],expected:false,description:'true→false'},{args:[false],expected:true,description:'false→true'}] },
  { levelNum:2, order:1, title:'useReducer Pattern',        functionName:'reducer',      difficulty:medium, xpReward:30, tags:['react','state'],
    description:'React Hooks: Implement a simple reducer pattern. Given state and action, return updated state.',
    starterCode:'function reducer(state, action) {\n  // Simulate useReducer: handle actions\n  // state: { count }, action: "increment" or "decrement"\n}',
    storyContext:'The state machine processes each action — update the count.',
    hints:['Check action type, return new object with updated count.'],
    testCases:[{args:[{count:0},'increment'],expected:{count:1},description:'inc'},{args:[{count:5},'decrement'],expected:{count:4},description:'dec'}] },
  { levelNum:2, order:2, title:'Event Handling',        functionName:'handleEvent',  difficulty:medium, xpReward:25, tags:['react','events'],
    description:'React Events: Extract value from synthetic event. Learn how to handle onChange events.',
    starterCode:'function handleEvent(event) {\n  // Extract input value from React event object\n  // event: { target: { value } }\n}',
    storyContext:'Capture what the user typed in the enchanted input field.',
    hints:['Access: event.target.value'],
    testCases:[{args:[{target:{value:'hello'}}],expected:'hello',description:'extract value'}] },

  // Level 3 - List Rendering
  { levelNum:3, order:0, title:'Render Names',         functionName:'getNames',     difficulty:easy, xpReward:20, tags:['react','lists'],
    description:'React Lists: Given user objects with `id` and `name`, render just the names array.',
    starterCode:'function getNames(users) {\n  // Map array of user objects to array of names\n}',
    storyContext:'The guild roster needs just the names for the display board.',
    hints:['Use .map(): users.map(u => u.name)'],
    testCases:[{args:[[{id:1,name:'A'},{id:2,name:'B'}]],expected:['A','B'],description:'names'}] },
  { levelNum:3, order:1, title:'Filter & Display',        functionName:'activeUsers',  difficulty:medium, xpReward:25, tags:['react','lists'],
    description:'React Filters: From array of users, return names of only active ones.',
    starterCode:'function activeUsers(users) {\n  // Filter active users, then extract names\n}',
    storyContext:'Only active guild members may enter the hall.',
    hints:['Chain .filter(u => u.active).map(u => u.name)'],
    testCases:[{args:[[{name:'A',active:true},{name:'B',active:false},{name:'C',active:true}]],expected:['A','C'],description:'active names'}] },
  { levelNum:3, order:2, title:'Dynamic Keys',        functionName:'getKeys',      difficulty:medium, xpReward:25, tags:['react','lists'],
    description:'React Dynamic Fields: Extract a specific key from each object in array.',
    starterCode:'function getKeys(arr, key) {\n  // Extract `key` from each object\n}',
    storyContext:'Extract the specified rune from each artifact.',
    hints:['Use .map(item => item[key]) with bracket notation.'],
    testCases:[{args:[[{a:1,b:2},{a:3,b:4}],'a'],expected:[1,3],description:'extract key a'}] },

  // Level 4 - Advanced Patterns
  { levelNum:4, order:0, title:'Dependency Tracking',     functionName:'depsChanged',  difficulty:medium, xpReward:30, tags:['react','effects'],
    description:'useEffect Dependencies: Compare dependency arrays. Return true if any value changed.',
    starterCode:'function depsChanged(oldDeps, newDeps) {\n  // Check if dependency array changed\n  // useEffect re-runs if deps change\n}',
    storyContext:'The effect guardian checks if dependencies shifted.',
    hints:['Compare element-wise: oldDeps[i] !== newDeps[i]'],
    testCases:[{args:[[1,2],[1,2]],expected:false,description:'same'},{args:[[1,2],[1,3]],expected:true,description:'changed'}] },
  { levelNum:4, order:1, title:'Context Merging',        functionName:'mergeCtx',     difficulty:medium, xpReward:30, tags:['react','context'],
    description:'React Context: Merge default context with user overrides. Overrides win.',
    starterCode:'function mergeCtx(defaults, overrides) {\n  // Merge objects: overrides replace defaults\n}',
    storyContext:'The context provider combines default and custom settings.',
    hints:['Spread syntax: { ...defaults, ...overrides }'],
    testCases:[{args:[{theme:'light',lang:'en'},{theme:'dark'}],expected:{theme:'dark',lang:'en'},description:'merge ctx'}] },
  { levelNum:4, order:2, title:'Memoization',       functionName:'memoize',      difficulty:hard, xpReward:40, tags:['react','performance'],
    description:'Performance: Implement memoization to cache function results and avoid re-computation.',
    starterCode:'function memoize(fn) {\n  // Return memoized function that caches results\n  // const memoFn = memoize(fn);\n}',
    storyContext:'The computation oracle remembers past answers to avoid work.',
    hints:['Use closure with Map/object cache keyed by first argument.'],
    testCases:[{args:[],expected:'function',description:'returns function'}] },
];

/* ════════════════════════════════════════════════════
   COURSE  5 — TypeScript Essentials
   ════════════════════════════════════════════════════ */
const tsCourse = {
  title: 'TypeScript Essentials',
  description: 'Add type safety to your JavaScript — catch bugs before they happen.',
  language: 'typescript',
  levels: [
    { 
      levelNum:1, 
      title:'Basic Types',    
      icon:'🔷', 
      description:'Strings, numbers, booleans and inference.',
      theory: {
        title: 'TypeScript Basics: Types Add Safety',
        emoji: '🔷',
        description: 'TypeScript is JavaScript with types. Types help catch bugs early by preventing operations that don\'t make sense. Add type safety to your code without compromise.',
        topics: [
          {
            name: 'Type Annotations',
            emoji: '📝',
            content: 'Tell TypeScript what types your variables, parameters, and returns should be:',
            codeExamples: [
              {
                title: 'Basic Annotations',
                code: '// Variables\nlet name: string = "Alice";      // must be string\nlet level: number = 5;           // must be number\nlet active: boolean = true;      // must be boolean\nlet items: number[] = [1, 2, 3]; // array of numbers\n\n// Function parameters and return type\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n\n// Optional types (can be undefined)\nlet email: string | undefined = undefined;\nlet status: "online" | "offline" = "online";  // literal types',
                explanation: 'Type annotations come after the variable/parameter name with a colon.'
              }
            ],
            keyRules: [
              'Syntax: <code>name: type</code>',
              'Basic types: <code>string</code>, <code>number</code>, <code>boolean</code>',
              'Arrays: <code>number[]</code> or <code>Array<number></code>',
              'Union types: <code>string | number</code> (can be either)',
              'Literals: <code>"online" | "offline"</code> (specific values)'
            ]
          },
          {
            name: 'Type Inference',
            emoji: '🧠',
            content: 'TypeScript can figure out types automatically (you don\'t always need to annotate).',
            codeExamples: [
              {
                title: 'Inference Examples',
                code: '// TypeScript infers the type from the value\nlet name = "Alice";     // inferred: string\nlet level = 5;          // inferred: number\nlet items = [1, 2, 3];  // inferred: number[]\n\nconst result = "Hello"; // inferred: literal "Hello"\n\nfunction add(a: number, b: number) {\n  return a + b;  // return type inferred: number\n}\n\n// Sometimes inference isn\'t enough, annotate explicitly\nlet something: unknown = "test";  // deliberately unknown type\nlet noValue: void;                // functions that don\'t return anything',
                explanation: 'Inference saves typing but explicit annotations document intent.'
              }
            ],
            keyRules: [
              'TypeScript infers types from assignments.',
              'Use inference when obvious, annotate when unclear.',
              '<code>any</code> disables type checking (avoid!)',
              '<code>unknown</code> is safe (requires type narrowing).',
              '<code>void</code> for functions that don\'t return.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'What\'s the syntax for a type annotation?',
            options: ['name as string', 'name: string', 'string name', '<string>name'],
            correctAnswer: 1
          },
          {
            question: 'What does TypeScript infer as the type of [1, 2, 3]?',
            options: ['Array', 'number[]', 'any', 'number'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'TypeScript Docs: Basic Types',
            author: 'Microsoft',
            url: 'https://www.typescriptlang.org/docs/handbook/basic-types.html',
            emoji: '🔷',
            type: 'docs'
          },
          {
            title: 'TypeScript Handbook',
            author: 'Microsoft',
            url: 'https://www.typescriptlang.org/docs/handbook/',
            emoji: '📖',
            type: 'docs'
          }
        ]
      }
    },
    { 
      levelNum:2, 
      title:'Interfaces',      
      icon:'📝', 
      description:'Define shapes for objects.',
      theory: {
        title: 'Interfaces: Defining Object Shapes',
        emoji: '📝',
        description: 'Interfaces describe the structure of objects — what properties they have and what types. Perfect for contracts between parts of your code.',
        topics: [
          {
            name: 'Creating Interfaces',
            emoji: '🏗️',
            content: 'Use `interface` keyword to define object shapes:',
            codeExamples: [
              {
                title: 'Interface Definition',
                code: 'interface User {\n  id: number;              // required\n  name: string;            // required\n  email?: string;          // optional (can be undefined)\n  level: number;\n  badges: string[];\n  isActive: boolean;\n}\n\n// Now you can use User as a type\nconst user: User = {\n  id: 1,\n  name: "Alice",\n  level: 5,\n  badges: ["champion", "speedster"],\n  isActive: true\n  // email is optional, can be omitted\n};\n\nfunction printUser(user: User): void {\n  console.log(`${user.name} (Level ${user.level})`);\n}',
                explanation: 'Interfaces define contracts. Properties with ? are optional. Functions can accept interfaces as parameters.'
              }
            ],
            keyRules: [
              'Interface property is required by default.',
              'Add <code>?</code> to make optional: <code>email?: string</code>',
              'Use interface as type annotation: <code>const user: User</code>',
              'Function parameters can require interface: <code>function greet(user: User)</code>'
            ]
          },
          {
            name: 'Extending Interfaces',
            emoji: '🔗',
            content: 'Interfaces can extend other interfaces (inheritance):',
            codeExamples: [
              {
                title: 'Interface Inheritance',
                code: '// Base interface\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\n// Extend to create Admin interface\ninterface Admin extends User {\n  permissions: string[];  // Admin-specific\n  lastLogin: Date;\n}\n\n// Admin must have all User properties PLUS Admin properties\nconst admin: Admin = {\n  id: 1,\n  name: "SuperUser",\n  email: "admin@example.com",\n  permissions: ["delete_users", "edit_content"],\n  lastLogin: new Date()\n};',
                explanation: 'Inheritance avoids repeating properties. Admin is a User with extra properties.'
              }
            ],
            keyRules: [
              '<code>interface Child extends Parent { ... }</code>',
              'Child inherits all parent properties.',
              'Can extend multiple interfaces: <code>extends A, B</code>',
              'Great for modeling hierarchies (User → Admin, Person → Employee).'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'How do you make a property optional in an interface?',
            options: ['property?', 'optional property', 'property: optional', 'property!'],
            correctAnswer: 0
          },
          {
            question: 'Which is correct?',
            options: ['interface Admin: User', 'interface Admin extends User', 'Admin extends User', 'interface Admin from User'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'TypeScript Docs: Interfaces',
            author: 'Microsoft',
            url: 'https://www.typescriptlang.org/docs/handbook/interfaces.html',
            emoji: '🔷',
            type: 'docs'
          }
        ]
      }
    },
    { 
      levelNum:3, 
      title:'Generics',        
      icon:'🧬', 
      description:'Write flexible, reusable code.',
      theory: {
        title: 'Generics: Reusable Type-Safe Code',
        emoji: '🧬',
        description: 'Generics let you write functions and types that work with any type while maintaining type safety. Like "template types".',
        topics: [
          {
            name: 'Generic Functions',
            emoji: '⚙️',
            content: 'Use type parameters (usually <code>T</code>) to make functions generic:',
            codeExamples: [
              {
                title: 'Generic Functions',
                code: '// Single type parameter\nfunction identity<T>(value: T): T {\n  return value;\n}\n\nidentity<string>("hello");     // T is string\nidentity<number>(42);          // T is number\nidentity(true);                // T inferred: boolean\n\n// Multiple type parameters\nfunction pair<K, V>(key: K, value: V): [K, V] {\n  return [key, value];\n}\n\npair("name", "Alice");  // [string, string]\npair(1, "test");        // [number, string]\n\n// Constraint: T must have a length property\nfunction getLength<T extends { length: number }>(obj: T): number {\n  return obj.length;\n}\n\ngetLength("hello");     // 5 (string has length)\ngetLength([1, 2, 3]);   // 3 (array has length)\n// getLength(42);       // ❌ ERROR: number doesn\'t have length',
                explanation: 'Angle brackets <T> declare type parameters. T is a placeholder for "any type".'
              }
            ],
            keyRules: [
              'Generic syntax: <code>function name<T>(...): T { ... }</code>',
              'T is a type variable, replaced by actual type when called.',
              'Common names: T (type), K (key), V (value).',
              'Can constrain types: <code><T extends string></code>'
            ]
          },
          {
            name: 'Generic Types & Arrays',
            emoji: '📚',
            content: 'Use generics with types and interfaces:',
            codeExamples: [
              {
                title: 'Generic Interfaces & Arrays',
                code: '// Generic interface\ninterface Box<T> {\n  value: T;\n  empty: () => void;\n}\n\nconst stringBox: Box<string> = {\n  value: "hello",\n  empty: () => { }\n};\n\n// Generic array function\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\nfirst([1, 2, 3]);       // returns number\nfirst(["a", "b"]);      // returns string\n\n// Built-in generic: Promise\nconst userPromise: Promise<{ id: number }> = \n  fetch("/api/user").then(r => r.json());',
                explanation: 'Any type can be generic. Angle brackets specify the type when using it.'
              }
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'What does T represent in generics?',
            options: ['A specific type (like string)', 'TypeScript', 'A placeholder for any type', 'A built-in type'],
            correctAnswer: 2
          },
          {
            question: 'How do you call a generic function?',
            options: ['func(T)', 'func<Type>()', 'func::Type', 'func<Type>()'],
            correctAnswer: 3
          }
        ],
        references: [
          {
            title: 'TypeScript Docs: Generics',
            author: 'Microsoft',
            url: 'https://www.typescriptlang.org/docs/handbook/generics.html',
            emoji: '🔷',
            type: 'docs'
          }
        ]
      }
    },
    { 
      levelNum:4, 
      title:'Utility Types',   
      icon:'🛠️', 
      description:'Built-in type transformations.',
      theory: {
        title: 'Utility Types: Type Transformations',
        emoji: '🛠️',
        description: 'TypeScript provides built-in utility types to transform types. Save time and reduce duplication.',
        topics: [
          {
            name: 'Common Utility Types',
            emoji: '🔧',
            content: 'TypeScript\'s standard library of type helpers:',
            codeExamples: [
              {
                title: 'Utility Types Examples',
                code: 'interface User {\n  id: number;\n  name: string;\n  email: string;\n  phone?: string;\n}\n\n// Partial<T> - all properties optional\ntype UserPreview: Partial<User>;  // can have any subset of User properties\n\n// Required<T> - all properties required (removes ?)\ntype CompleteUser: Required<User>;  // phone is required\n\n// Pick<T, K> - select only specific properties\ntype UserInfo: Pick<User, "name" | "email">; // only name & email\n\n// Omit<T, K> - exclude specific properties\ntype UserPreview: Omit<User, "id" | "email">;  // all except id & email\n\n// Record<K, V> - key-value pairs\ntype ColorMap: Record<"red" | "green" | "blue", string>;\n// { red: string; green: string; blue: string; }\n\n// Readonly<T> - make all properties readonly\ntype ReadOnlyUser: Readonly<User>;\n// can\'t modify properties after creation',
                explanation: 'Utility types save typing and ensure consistency. You use angle brackets to specify the type and properties.'
              }
            ],
            keyRules: [
              '<code>Partial<T></code>: All properties optional.',
              '<code>Required<T></code>: All properties required.',
              '<code>Pick<T, K></code>: Only selected properties.',
              '<code>Omit<T, K></code>: All except selected.',
              '<code>Record<K, V></code>: Key-value mapping.',
              '<code>Readonly<T></code>: Immutable properties.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'What does Partial<User> do?',
            options: ['Deletes some properties', 'Makes all properties optional', 'Makes all properties required', 'Duplicates the type'],
            correctAnswer: 1
          },
          {
            question: 'Which removes properties from a type?',
            options: ['Pick', 'Omit', 'Partial', 'Record'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'TypeScript Docs: Utility Types',
            author: 'Microsoft',
            url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html',
            emoji: '🔷',
            type: 'docs'
          }
        ]
      }
    },
  ],
};

const tsChallenges = [
  // Level 1 - Type Fundamentals
  { levelNum:1, order:0, title:'Type Guards',           functionName:'isString',     difficulty:easy, xpReward:15, tags:['typescript','types'],
    description:'TypeScript Types: Check if a value is a string. Learn type guards with typeof.',
    starterCode:'function isString(val: any): boolean {\n  // Use typeof to check if val is a string\n}',
    storyContext:'The type guardian checks each artifact before it enters the vault.',
    hints:['Use: typeof val === "string"'],
    testCases:[{args:['hello'],expected:true,description:'string'},{args:[42],expected:false,description:'number'},{args:[true],expected:false,description:'boolean'}] },
  { levelNum:1, order:1, title:'Safe Parsing',           functionName:'safeParse',    difficulty:medium, xpReward:25, tags:['typescript','types'],
    description:'TypeScript Number Type: Safely parse strings to numbers. Return 0 for invalid input.',
    starterCode:'function safeParse(str: string): number {\n  // Parse string to number, return 0 if invalid (NaN)\n}',
    storyContext:'The data stream contains corrupt values — clean them up safely.',
    hints:['Parse with Number() or parseFloat(), check isNaN()'],
    testCases:[{args:['42'],expected:42,description:'valid'},{args:['abc'],expected:0,description:'invalid'},{args:['3.14'],expected:3.14,description:'float'}] },
  { levelNum:1, order:2, title:'Array Type Check',     functionName:'allNumbers',   difficulty:medium, xpReward:25, tags:['typescript','arrays'],
    description:'TypeScript Arrays: Verify all elements are numbers. Learn type predicates.',
    starterCode:'function allNumbers(arr: any[]): boolean {\n  // Return true if every element is a number\n}',
    storyContext:'Verify the array contains only numeric runes.',
    hints:['Use .every(item => typeof item === "number")'],
    testCases:[{args:[[1,2,3]],expected:true,description:'all nums'},{args:[[1,'2',3]],expected:false,description:'mixed'}] },

  // Level 2 - Interface Patterns
  { levelNum:2, order:0, title:'Shape Validation',      functionName:'hasKeys',      difficulty:medium, xpReward:25, tags:['typescript','interfaces'],
    description:'TypeScript Interfaces: Validate object shape. Check if all required keys exist.',
    starterCode:'function hasKeys(obj: any, keys: string[]): boolean {\n  // Check if obj has ALL keys from the array\n}',
    storyContext:'Validate that the artifact matches the expected interface.',
    hints:['Use .every(k => k in obj)'],
    testCases:[{args:[{a:1,b:2},['a','b']],expected:true,description:'has all'},{args:[{a:1},['a','b']],expected:false,description:'missing b'}] },
  { levelNum:2, order:1, title:'Pick<T, K> Utility',      functionName:'pick',         difficulty:medium, xpReward:30, tags:['typescript','interfaces'],
    description:'TypeScript Utility Types: Implement Pick<T, K> to extract specific properties.',
    starterCode:'function pick(obj: any, keys: string[]): any {\n  // Return new object with only specified keys\n}',
    storyContext:'Extract only the properties the spell requires.',
    hints:['Build new object iterating through keys array'],
    testCases:[{args:[{a:1,b:2,c:3},['a','c']],expected:{a:1,c:3},description:'pick a,c'}] },
  { levelNum:2, order:2, title:'Omit<T, K> Utility',      functionName:'omit',         difficulty:medium, xpReward:30, tags:['typescript','interfaces'],
    description:'TypeScript Utility Types: Implement Omit<T, K> to exclude specific properties.',
    starterCode:'function omit(obj: any, keys: string[]): any {\n  // Return object without specified keys\n}',
    storyContext:'Remove the cursed properties from the artifact.',
    hints:['Filter Object.entries(), rebuild without omitted keys'],
    testCases:[{args:[{a:1,b:2,c:3},['b']],expected:{a:1,c:3},description:'omit b'}] },

  // Level 3 - Generics
  { levelNum:3, order:0, title:'Generic Identity',    functionName:'identity',     difficulty:easy, xpReward:20, tags:['typescript','generics'],
    description:'TypeScript Generics: Create a generic identity function `<T>(val: T): T`.',
    starterCode:'function identity<T>(val: T): T {\n  // Return the input unchanged\n}',
    storyContext:'The mirror function returns exactly what it receives.',
    hints:['Just return val'],
    testCases:[{args:[42],expected:42,description:'number'},{args:['hi'],expected:'hi',description:'string'}] },
  { levelNum:3, order:1, title:'Generic Array Index',       functionName:'first',        difficulty:easy, xpReward:20, tags:['typescript','generics'],
    description:'TypeScript Generics: Get first element of generic array, return type is `T | undefined`.',
    starterCode:'function first<T>(arr: T[]): T | undefined {\n  // Return first element or undefined\n}',
    storyContext:'Peek at the first item in the treasure chest.',
    hints:['Return arr[0]'],
    testCases:[{args:[[1,2,3]],expected:1,description:'first'},{args:[[]],expected:undefined,description:'empty'}] },
  { levelNum:3, order:2, title:'Generic Wrap',        functionName:'toArray',      difficulty:medium, xpReward:25, tags:['typescript','generics'],
    description:'TypeScript Generics: Ensure value is array. Wrap non-arrays.',
    starterCode:'function toArray<T>(val: T | T[]): T[] {\n  // If already array, return; else wrap\n}',
    storyContext:'Ensure the spell ingredients are always in list form.',
    hints:['Check Array.isArray()'],
    testCases:[{args:[[1,2]],expected:[1,2],description:'already array'},{args:[42],expected:[42],description:'wrap'}] },

  // Level 4 - Advanced Utilities
  { levelNum:4, order:0, title:'Partial<T> Pattern',       functionName:'makePartial',  difficulty:medium, xpReward:25, tags:['typescript','utility'],
    description:'TypeScript Utility: Implement Partial<T> pattern to make properties optional.',
    starterCode:'function makePartial<T extends any>(original: T, partial: Partial<T>): T {\n  // Merge objects, partial overrides\n}',
    storyContext:'Apply the partial enchantment to update only some properties.',
    hints:['Spread syntax: { ...original, ...partial }'],
    testCases:[{args:[{a:1,b:2},{b:99}],expected:{a:1,b:99},description:'partial override'}] },
  { levelNum:4, order:1, title:'Record<K, V> Pattern',       functionName:'buildRecord',  difficulty:medium, xpReward:30, tags:['typescript','utility'],
    description:'TypeScript Utility: Implement Record<K, V> to map keys to a value type.',
    starterCode:'function buildRecord<K extends string, V>(keys: K[], value: V): Record<K, V> {\n  // Map each key to the value\n}',
    storyContext:'Initialize the ledger with default values for each category.',
    hints:['Build object with each key → value mapping'],
    testCases:[{args:[['a','b','c'],0],expected:{a:0,b:0,c:0},description:'record'}] },
  { levelNum:4, order:2, title:'Readonly<T> Freeze',      functionName:'freeze',       difficulty:hard, xpReward:35, tags:['typescript','utility'],
    description:'TypeScript Utility: Implement Readonly<T> by creating frozen object copy.',
    starterCode:'function freeze<T extends any>(obj: T): Readonly<T> {\n  // Deep freeze object\n}',
    storyContext:'Lock the artifact so no property can be changed.',
    hints:['Use Object.freeze() on shallow copy: { ...obj }'],
    testCases:[{args:[{a:1}],expected:{a:1},description:'frozen copy'}] },
];

/* ════════════════════════════════════════════════════
   COURSE  6 — Node.js & Backend
   ════════════════════════════════════════════════════ */
const nodeCourse = {
  title: 'Node.js & Backend',
  description: 'Build APIs, work with data, and understand server-side JavaScript.',
  language: 'nodejs',
  levels: [
    { 
      levelNum:1, 
      title:'Node Basics',     
      icon:'🟢', 
      description:'Modules, globals and core APIs.',
      theory: {
        title: 'Node.js Fundamentals: Server-Side JavaScript',
        emoji: '🟢',
        description: 'Node.js lets you run JavaScript outside the browser — on servers. Master the core concepts: modules, globals, and file system APIs.',
        topics: [
          {
            name: 'Node.js Architecture',
            emoji: '⚙️',
            content: 'Node.js runs on the V8 engine (same as Chrome). It provides server-side APIs and removes browser APIs.',
            codeExamples: [
              {
                title: 'Key Globals & Process',
                code: '// Global objects (not in browser JS)\n__dirname          // current directory path\n__filename         // current file path\nprocess.env        // environment variables\nprocess.argv       // command-line arguments\nprocess.exit(1)    // exit with code\nprocess.cwd()      // current working directory\n\n// Example\nconsole.log("Current directory:", __dirname);\nconsole.log("NODE_ENV:", process.env.NODE_ENV);\nconsole.log("Arguments:", process.argv.slice(2));\n// Run: NODE_ENV=prod node app.js arg1 arg2',
                explanation: 'These globals are specific to Node.js and not available in browsers.'
              }
            ],
            keyRules: [
              '<code>__dirname</code> and <code>__filename</code> give paths.',
              '<code>process.env</code> object contains environment variables.',
              '<code>process.argv</code> array has command-line arguments.',
              '<code>require()</code> imports modules (CommonJS).'
            ]
          },
          {
            name: 'CommonJS Modules',
            emoji: '📦',
            content: 'Node uses CommonJS for modules. Export with `module.exports`, import with `require()`.',
            codeExamples: [
              {
                title: 'Module Export & Import',
                code: '// math.js\nconst add = (a, b) => a + b;\nconst subtract = (a, b) => a - b;\n\n// Export methods\nmodule.exports = {\n  add,\n  subtract,\n};\n\n// app.js\nconst math = require(\'./math\');\nconsole.log(math.add(5, 3));      // 8\n\n// Or destructure\nconst { subtract } = require(\'./math\');\nconsole.log(subtract(10, 4));     // 6\n\n// Import built-in modules\nconst fs = require(\'fs\');\nconst path = require(\'path\');\nconst http = require(\'http\');',
                explanation: 'Each file is a module. module.exports defines what it shares. require() loads it.'
              }
            ],
            keyRules: [
              '<code>module.exports = { ... }</code> defines exports.',
              '<code>const mod = require(\'./file\')</code> imports.',
              'Paths: <code>./math</code> (relative), <code>fs</code> (built-in).',
              'Built-in modules: fs, path, http, events, os, util.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'What\'s the difference between __dirname and process.cwd()?',
            options: ['Same thing', '__dirname is file location, cwd() is current working dir', '__dirname is global, cwd() is local', 'No difference'],
            correctAnswer: 1
          },
          {
            question: 'How do you export a function in Node.js?',
            options: ['export function fn() {}', 'module.exports = { fn }', 'exports fn', 'public fn()'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'Node.js Official Docs',
            author: 'OpenJS Foundation',
            url: 'https://nodejs.org/en/docs/',
            emoji: '🟢',
            type: 'docs'
          }
        ]
      }
    },
    { 
      levelNum:2, 
      title:'HTTP & REST',     
      icon:'🌐', 
      description:'Build APIs that talk JSON.',
      theory: {
        title: 'HTTP Methods & RESTful APIs',
        emoji: '🌐',
        description: 'REST (Representational State Transfer) is the standard for web APIs. Learn HTTP methods, status codes, and Express basics.',
        topics: [
          {
            name: 'HTTP Methods & Status Codes',
            emoji: '📡',
            content: 'HTTP defines standard methods for different operations:',
            codeExamples: [
              {
                title: 'HTTP Methods',
                code: '// GET - retrieve data (safe, no side effects)\nGET /api/users        → fetch all users\nGET /api/users/1      → fetch user 1\n\n// POST - create new resource\nPOST /api/users       → create a new user\n\n// PUT - replace resource\nPUT /api/users/1      → replace user 1 completely\n\n// PATCH - partial update\nPATCH /api/users/1    → update user 1 partially\n\n// DELETE - remove resource\nDELETE /api/users/1   → delete user 1\n\n// Status Codes\n200 OK                 → success (GET, PUT, PATCH)\n201 Created            → success, new resource created (POST)\n204 No Content         → success, no response body (DELETE)\n400 Bad Request        → client error (invalid data)\n401 Unauthorized       → must authenticate\n403 Forbidden          → authenticated but not allowed\n404 Not Found          → resource doesn\'t exist\n500 Internal Error     → server error',
                explanation: 'Each method has semantics. Status codes tell the client what happened.'
              }
            ],
            keyRules: [
              '<code>GET</code> retrieves. <code>POST</code> creates. <code>PUT</code>/<code>PATCH</code> update. <code>DELETE</code> removes.',
              '<code>200</code> success. <code>201</code> created. <code>4xx</code> client error. <code>5xx</code> server error.',
              'Always return appropriate status codes.',
              'RESTful URLs: <code>/api/resource</code> (plural for collections).'
            ]
          },
          {
            name: 'Express Basics',
            emoji: '⚡',
            content: 'Express is a popular framework for building Node APIs:',
            codeExamples: [
              {
                title: 'Express Routes',
                code: 'const express = require(\'express\');\nconst app = express();\n\n// Middleware\napp.use(express.json());  // parse JSON bodies\n\n// Routes\napp.get(\'/api/users\', (req, res) => {\n  res.status(200).json({ users: [] });\n});\n\napp.post(\'/api/users\', (req, res) => {\n  const { name } = req.body;  // from JSON body\n  console.log("Creating user:", name);\n  res.status(201).json({ id: 1, name });\n});\n\napp.get(\'/api/users/:id\', (req, res) => {\n  const { id } = req.params;  // from URL\n  res.json({ id, name: "Alice" });\n});\n\napp.put(\'/api/users/:id\', (req, res) => {\n  const { id } = req.params;\n  const updated = { ...req.body, id };\n  res.json(updated);\n});\n\napp.delete(\'/api/users/:id\', (req, res) => {\n  res.status(204).send();  // no content\n});\n\napp.listen(3000, () => console.log("Server on :3000"));',
                explanation: 'Express handles routing. req has params/body/query. res sends responses with status & data.'
              }
            ],
            keyRules: [
              '<code>app.get/post/put/delete(route, handler)</code>',
              '<code>req.params</code> from URL: <code>/users/:id</code>',
              '<code>req.query</code> from query string: <code>?sort=name</code>',
              '<code>req.body</code> from request body (JSON)',
              '<code>res.json(data)</code> sends JSON. <code>res.status(code)</code> sets code.'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'Which HTTP method creates a new resource?',
            options: ['GET', 'POST', 'PUT', 'DELETE'],
            correctAnswer: 1
          },
          {
            question: 'What status code should POST return on success?',
            options: ['200', '201', '202', '204'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'Express.js Guide',
            author: 'Express Community',
            url: 'https://expressjs.com/guide/routing.html',
            emoji: '⚡',
            type: 'docs'
          },
          {
            title: 'REST API Best Practices',
            author: 'REST',
            url: 'https://restfulapi.net/',
            emoji: '🔗',
            type: 'website'
          }
        ]
      }
    },
    { 
      levelNum:3, 
      title:'Data & Databases',
      icon:'💾', 
      description:'Store and retrieve data.',
      theory: {
        title: 'Database Fundamentals with MongoDB',
        emoji: '💾',
        description: 'Databases persist data. MongoDB is popular for Node. Learn schemas, CRUD operations, and queries.',
        topics: [
          {
            name: 'MongoDB & Mongoose',
            emoji: '🗄️',
            content: 'MongoDB stores JSON-like documents. Mongoose provides schemas for validation.',
            codeExamples: [
              {
                title: 'Mongoose Setup',
                code: 'const mongoose = require(\'mongoose\');\n\n// Connect to MongoDB\nawait mongoose.connect(process.env.MONGO_URI);\n\n// Define schema\nconst userSchema = new mongoose.Schema({\n  name: {\n    type: String,\n    required: true,\n  },\n  email: {\n    type: String,\n    unique: true,\n    required: true,\n  },\n  level: {\n    type: Number,\n    default: 1,\n  },\n  createdAt: {\n    type: Date,\n    default: Date.now,\n  },\n});\n\n// Create model\nconst User = mongoose.model(\'User\', userSchema);\n\nmodule.exports = User;',
                explanation: 'Mongoose validates data before saving. Schemas prevent bad data.'
              }
            ],
            keyRules: [
              'Schema defines documents\' structure.',
              '<code>required: true</code> makes field mandatory.',
              '<code>unique: true</code> prevents duplicates.',
              '<code>default: value</code> sets default.',
              '<code>type: String/Number/Date/Array/Object</code>'
            ]
          },
          {
            name: 'CRUD Operations',
            emoji: '📝',
            content: 'Create, Read, Update, Delete — the four fundamental ops:',
            codeExamples: [
              {
                title: 'Mongoose CRUD',
                code: 'const User = require(\'./models/User\');\n\n// CREATE\nconst user = await User.create({\n  name: "Alice",\n  email: "alice@example.com",\n});\n\n// READ\nconst allUsers = await User.find();  // all\nconst oneUser = await User.findById("123...");  // by ID\nconst filtered = await User.find({ level: { $gte: 5 } });  // query\n\n// UPDATE\nawait User.findByIdAndUpdate(userId, { level: 10 });\n\n// DELETE\nawait User.findByIdAndDelete(userId);\n\n// Queries with operators\nawait User.find({ age: { $gt: 18 } });      // greater than\nawait User.find({ tags: { $in: [\'js\', \'node\'] } });  // in array\nawait User.find({ name: /^A/ });           // regex (starts with A)',
                explanation: 'Mongoose queries are async. Use await or .then(). Operators like $gt, $in enable complex queries.'
              }
            ],
            keyRules: [
              '<code>await Model.create(data)</code> — insert',
              '<code>await Model.find(query)</code> — find matching docs',
              '<code>await Model.findById(id)</code> — find by _id',
              '<code>await Model.findByIdAndUpdate(id, data)</code>',
              '<code>await Model.findByIdAndDelete(id)</code>',
              'Operators: <code>$gt</code>, <code>$lt</code>, <code>$in</code>, <code>$regex</code>'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'What does `unique: true` do in a schema?',
            options: ['Generates unique ID', 'Prevents duplicate values', 'Indexes for speed', 'Makes field required'],
            correctAnswer: 1
          },
          {
            question: 'Which finds all users with name "Alice"?',
            options: ['User.find("Alice")', 'User.find({ name: "Alice" })', 'User.query("Alice")', 'User.get("Alice")'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'Mongoose Docs',
            author: 'Mongoose Contributors',
            url: 'https://mongoosejs.com/docs/',
            emoji: '🗄️',
            type: 'docs'
          }
        ]
      }
    },
    { 
      levelNum:4, 
      title:'Auth & Security', 
      icon:'🔐', 
      description:'Protect your API.',
      theory: {
        title: 'Authentication & Security',
        emoji: '🔐',
        description: 'Protect your APIs with authentication and best practices. Learn JWT, password hashing, and security principles.',
        topics: [
          {
            name: 'JWT (JSON Web Tokens)',
            emoji: '🔑',
            content: 'JWT is a standard for secure authentication. Stateless — no server-side session storage needed.',
            codeExamples: [
              {
                title: 'JWT Implementation',
                code: 'const jwt = require(\'jsonwebtoken\');\nconst SECRET_KEY = process.env.JWT_SECRET;\n\n// CREATE token after login\nconst user = await User.findOne({ email });\nif (!user) throw new Error("Not found");\n\nconst token = jwt.sign(\n  { userId: user._id, email: user.email },  // payload\n  SECRET_KEY,                               // secret\n  { expiresIn: \'7d\' }                      // options\n);\n\n// res.json({ token, user });\n\n// VERIFY token in middleware\nfunction verifyToken(req, res, next) {\n  const token = req.headers.authorization?.split(\' \')[1];\n  if (!token) return res.status(401).json({ error: "No token" });\n  \n  try {\n    const decoded = jwt.verify(token, SECRET_KEY);\n    req.user = decoded;  // attach to request\n    next();\n  } catch (err) {\n    res.status(401).json({ error: "Invalid token" });\n  }\n}\n\n// Protected route\napp.get(\'/api/profile\', verifyToken, (req, res) => {\n  res.json(req.user);  // from middleware\n});',
                explanation: 'JWT payload is signed. Client sends it in Authorization header. Verify on each request.'
              }
            ],
            keyRules: [
              '<code>jwt.sign(payload, secret, options)</code> creates token.',
              '<code>jwt.verify(token, secret)</code> validates.',
              'Token has 3 parts: header.payload.signature.',
              'Client sends: <code>Authorization: Bearer TOKEN</code>',
              'Use HTTPS in production (tokens are sensitive!).'
            ]
          },
          {
            name: 'Password Security',
            emoji: '🔒',
            content: 'Never store plaintext passwords. Hash them with bcrypt:',
            codeExamples: [
              {
                title: 'Password Hashing with bcrypt',
                code: 'const bcrypt = require(\'bcryptjs\');\n\n// SIGNUP - hash password\nconst signup = async (email, plainPassword) => {\n  const salt = await bcrypt.genSalt(10);\n  const hashedPassword = await bcrypt.hash(plainPassword, salt);\n  \n  const user = await User.create({\n    email,\n    password: hashedPassword,  // store hash, not plaintext\n  });\n  return user;\n};\n\n// LOGIN - compare passwords\nconst login = async (email, plainPassword) => {\n  const user = await User.findOne({ email });\n  if (!user) throw new Error("User not found");\n  \n  const isMatch = await bcrypt.compare(plainPassword, user.password);\n  if (!isMatch) throw new Error("Wrong password");\n  \n  const token = jwt.sign({ userId: user._id }, SECRET);\n  return { token, user };\n};',
                explanation: 'bcrypt hashes passwords. compare() verifies without exposing the hash.'
              }
            ],
            keyRules: [
              'Never store plaintext passwords.',
              'Use bcrypt to hash: <code>await bcrypt.hash(password, salt)</code>',
              'Verify with: <code>await bcrypt.compare(plainPassword, hash)</code>',
              'Salting adds randomness to prevent rainbow tables.',
              'Use at least 10 rounds for bcrypt.'
            ]
          },
          {
            name: 'Security Best Practices',
            emoji: '🛡️',
            content: 'Follow these principles to keep your API secure:',
            codeExamples: [
              {
                title: 'Security Checklist',
                code: '// 1. Use environment variables for secrets\nrequire("dotenv").config();\nconst SECRET = process.env.JWT_SECRET;  // NOT in code!\n\n// 2. Validate & sanitize inputs\nconst { email, name } = req.body;\nif (!email?.includes("@")) return res.status(400).json({ error: "Invalid" });\n\n// 3. Use HTTPS (production only)\napp.use((req, res, next) => {\n  if (process.env.NODE_ENV === "prod" && !req.https) {\n    return res.status(400).json({ error: "Use HTTPS" });\n  }\n  next();\n});\n\n// 4. Rate limiting\nconst rateLimit = require("express-rate-limit");\nconst limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });\napp.use(limiter);\n\n// 5. CORS\nconst cors = require("cors");\napp.use(cors({ origin: process.env.FRONTEND_URL }));\n\n// 6. Use strong passwords (hash with strong salt)\nconst salt = await bcrypt.genSalt(12);  // 12 rounds\nconst hash = await bcrypt.hash(password, salt);',
                explanation: 'Security is defense-in-depth. Multiple layers protect against different attacks.'
              }
            ],
            keyRules: [
              'Store secrets in<code>.env</code> file (never in code).',
              'Validate all inputs.',
              'Use HTTPS in production.',
              'Implement rate limiting (prevent brute force).',
              '(Configure CORS correctly.',
              'Hash passwords with bcrypt (min 10 rounds).'
            ]
          }
        ],
        quickQuiz: [
          {
            question: 'Where should JWTsecret be stored?',
            options: ['In code', '.env file', 'Database', 'Frontend'],
            correctAnswer: 1
          },
          {
            question: 'Should passwords be stored as plaintext?',
            options: ['Yes, for speed', 'No, always hash', 'Only for testing', 'Depends on framework'],
            correctAnswer: 1
          }
        ],
        references: [
          {
            title: 'JWT.io',
            author: 'auth0',
            url: 'https://jwt.io/',
            emoji: '🔑',
            type: 'website'
          },
          {
            title: 'bcryptjs NPM',
            author: 'dcodeIO',
            url: 'https://www.npmjs.com/package/bcryptjs',
            emoji: '🔒',
            type: 'website'
          },
          {
            title: 'OWASP Security Guidelines',
            author: 'OWASP',
            url: 'https://owasp.org/',
            emoji: '🛡️',
            type: 'website'
          }
        ]
      }
    },
  ],
};

const nodeChallenges = [
  // Level 1 - Node.js Basics
  { levelNum:1, order:0, title:'Module System',        functionName:'createModule', difficulty:easy, xpReward:15, tags:['node','modules'],
    description:'Node.js Modules: Create a module object with `add(a,b)` and `subtract(a,b)` methods. Simulate module.exports.',
    starterCode:'function createModule() {\n  // Return { add, subtract }\n  // Simulate module.exports = { ... }\n}',
    storyContext:'Build the math module for the server.',
    hints:['Return object with two function properties'],
    testCases:[{args:[],expected:'object',description:'returns object'}] },
  { levelNum:1, order:1, title:'CLI Arguments',      functionName:'parseArgs',    difficulty:medium, xpReward:25, tags:['node','process'],
    description:'Node.js process.argv: Parse CLI arguments like `["--name", "Ada"]` into `{ name: "Ada" }`.',
    starterCode:'function parseArgs(args) {\n  // Parse command-line arguments array\n  // Returns object with --key value pairs\n}',
    storyContext:'Parse the command-line spells into usable form.',
    hints:['Loop args in steps of 2, strip -- from keys, build object'],
    testCases:[{args:[['--name','Ada','--level','5']],expected:{name:'Ada',level:'5'},description:'parse 2 args'}] },
  { levelNum:1, order:2, title:'Path Operations',           functionName:'pathParts',    difficulty:easy, xpReward:20, tags:['node','path'],
    description:'Node.js path module: Parse filepath into directory, filename, and extension.',
    starterCode:'function pathParts(filepath) {\n  // Parse "src/utils/helpers.js"\n  // Return { dir, file, ext }\n}',
    storyContext:'Dissect the file path to locate the treasure.',
    hints:['Use lastIndexOf("/") and lastIndexOf(".") to split parts'],
    testCases:[{args:['src/utils/helpers.js'],expected:{dir:'src/utils',file:'helpers.js',ext:'.js'},description:'parse path'}] },

  // Level 2 - HTTP & APIs
  { levelNum:2, order:0, title:'HTTP Status Codes',          functionName:'statusCode',   difficulty:easy, xpReward:15, tags:['node','http'],
    description:'Node.js HTTP: Return correct status code. 200 for GET success, 201 for POST success, 400 for error.',
    starterCode:'function statusCode(method, success) {\n  // Return appropriate HTTP status code\n}',
    storyContext:'The API guardian returns the correct response code.',
    hints:['201 for POST+success, 200 for GET+success, 400 for failure'],
    testCases:[{args:['GET',true],expected:200,description:'GET 200'},{args:['POST',true],expected:201,description:'POST 201'},{args:['GET',false],expected:400,description:'fail 400'}] },
  { levelNum:2, order:1, title:'Routing Parameters',        functionName:'matchRoute',   difficulty:medium, xpReward:25, tags:['node','routing'],
    description:'Node.js Express Routing: Match route pattern "/users/:id" against actual path and extract parameters.',
    starterCode:'function matchRoute(pattern, path) {\n  // Match "/users/:id" to "/users/42"\n  // Return { id: "42" } or null\n}',
    storyContext:'The routing engine must find the right handler for each request.',
    hints:['Split by "/", match segments, extract dynamic :params'],
    testCases:[{args:['/users/:id','/users/42'],expected:{id:'42'},description:'match'},{args:['/users/:id','/posts/1'],expected:null,description:'no match'}] },
  { levelNum:2, order:2, title:'JSON Response Format',        functionName:'jsonResponse', difficulty:easy, xpReward:20, tags:['node','http'],
    description:'Node.js API: Format response with status, data, and timestamp fields.',
    starterCode:'function jsonResponse(status, data) {\n  // Return standard JSON response object\n}',
    storyContext:'Package the API response in the proper format.',
    hints:['Return { status, data, timestamp: "ok" }'],
    testCases:[{args:[200,{name:'Ada'}],expected:{status:200,data:{name:'Ada'},timestamp:'ok'},description:'response'}] },

  // Level 3 - Database Concepts
  { levelNum:3, order:0, title:'Schema Validation',     functionName:'validate',     difficulty:medium, xpReward:30, tags:['node','database'],
    description:'Database Schema: Validate document against schema. Check all fields match expected types.',
    starterCode:'function validate(data, schema) {\n  // Check data fields match schema types\n  // schema: { name: "string", age: "number" }\n}',
    storyContext:'Validate the document before saving to the enchanted database.',
    hints:['Loop schema entries, typeof data[field] === type for each'],
    testCases:[{args:[{name:'Ada',age:25},{name:'string',age:'number'}],expected:true,description:'valid'},{args:[{name:123},{name:'string'}],expected:false,description:'invalid'}] },
  { levelNum:3, order:1, title:'Database Query Filter',         functionName:'filterDocs',   difficulty:medium, xpReward:30, tags:['node','database'],
    description:'Database Queries: Filter documents matching all criteria in filter object (like MongoDB find).',
    starterCode:'function filterDocs(docs, filter) {\n  // Return docs matching ALL filter criteria\n}',
    storyContext:'Query the ancient archive — find all matching scrolls.',
    hints:['Use .filter() to check each doc against filter criteria'],
    testCases:[{args:[[{a:1,b:2},{a:1,b:3},{a:2,b:2}],{a:1}],expected:[{a:1,b:2},{a:1,b:3}],description:'filter by a'}] },
  { levelNum:3, order:2, title:'Result Pagination',           functionName:'paginate',     difficulty:medium, xpReward:25, tags:['node','database'],
    description:'Database Pagination: Return page of results based on page number and size.',
    starterCode:'function paginate(arr, page, size) {\n  // Return page slice (1-based page numbering)\n}',
    storyContext:'The archive is vast — return just one page of results.',
    hints:['start = (page-1)*size, use .slice(start, start+size)'],
    testCases:[{args:[[1,2,3,4,5,6,7,8,9,10],2,3],expected:[4,5,6],description:'page 2, size 3'}] },

  // Level 4 - Security & Advanced
  { levelNum:4, order:0, title:'Hash Function',      functionName:'simpleHash',   difficulty:medium, xpReward:25, tags:['node','security'],
    description:'Security: Implement simple hash by summing character codes mod 1000.',
    starterCode:'function simpleHash(str) {\n  // Sum charCodes, return mod 1000\n}',
    storyContext:'The encryption rune requires a hash of the incantation.',
    hints:['Loop through str, sum charCodeAt(i) values, return sum % 1000'],
    testCases:[{args:['hello'],expected:532,description:'hello hash'},{args:['abc'],expected:294,description:'abc hash'}] },
  { levelNum:4, order:1, title:'Token Verification',       functionName:'verifyToken',  difficulty:medium, xpReward:30, tags:['node','auth'],
    description:'Authentication: Verify token format "userId.timestamp.signature" against secret.',
    starterCode:'function verifyToken(token, secret) {\n  // Verify token signature, return { valid, userId }\n}',
    storyContext:'Validate the adventurer\'s identity token at the gate.',
    hints:['Split token by ".", compute expected sig as (userId+timestamp+secret).length'],
    testCases:[{args:['user1.12345.21','secret'],expected:{valid:true,userId:'user1'},description:'valid token'}] },
  { levelNum:4, order:2, title:'Rate Limiting',         functionName:'rateLimiter',  difficulty:hard, xpReward:40, tags:['node','security'],
    description:'Security: Implement rate limiter. Return function tracking calls per key, reject if over limit.',
    starterCode:'function rateLimiter(limit) {\n  // Return function(key) that tracks and limits calls\n}',
    storyContext:'The API gateway must throttle overzealous spellcasters.',
    hints:['Use closure with Map to track count per key'],
    testCases:[{args:[2],expected:'function',description:'returns function'}] },
];

/* ════════════════════════════════════════════════════
   SEED RUNNER
   ════════════════════════════════════════════════════ */
async function seed() {
  await connectDB();
  console.log('🗑️  Clearing old data …');
  await Promise.all([Course.deleteMany({}), Challenge.deleteMany({}), Narrative.deleteMany({})]);

  const courseDefs = [
    { meta: jsCourse,     challenges: jsChallenges },
    { meta: pythonCourse,  challenges: pythonChallenges },
    { meta: htmlCourse,    challenges: htmlChallenges },
    { meta: reactCourse,   challenges: reactChallenges },
    { meta: tsCourse,      challenges: tsChallenges },
    { meta: nodeCourse,    challenges: nodeChallenges },
  ];

  const narrativeDefs = [
    { setting: 'The Code Kingdom',      mainCharacter: 'Script Sage',      worldDescription: 'A digital realm where JavaScript powers all magic and machinery.' },
    { setting: 'The Serpent Garden',     mainCharacter: 'Pythoness',        worldDescription: 'An enchanted garden where Python snakes guard the secrets of logic.' },
    { setting: 'The Web Citadel',        mainCharacter: 'Tag Weaver',       worldDescription: 'A massive fortress built entirely from HTML elements and styled by CSS enchantments.' },
    { setting: 'The Component Realm',    mainCharacter: 'Reactor',          worldDescription: 'A dynamic world where components assemble and morph in real-time.' },
    { setting: 'The Type Fortress',      mainCharacter: 'Type Guardian',    worldDescription: 'A stronghold where strict types ensure no bug passes through the gates.' },
    { setting: 'The Server Depths',      mainCharacter: 'Node Runner',      worldDescription: 'Underground caverns powered by event loops, where APIs open hidden passages.' },
  ];

  for (let i = 0; i < courseDefs.length; i++) {
    const { meta, challenges } = courseDefs[i];
    const course = await Course.create(meta);
    console.log(`📘 Created course: ${course.title}  (${course.levels.length} levels)`);

    const docs = challenges.map(c => ({ ...c, courseId: course._id }));
    await Challenge.insertMany(docs);
    console.log(`   ✅ ${docs.length} challenges seeded`);

    // Create narrative for this course
    const narDef = narrativeDefs[i];
    const chapters = course.levels.map((lvl, idx) => ({
      chapterNum: lvl.levelNum,
      title: `Chapter ${lvl.levelNum}: ${lvl.title}`,
      description: lvl.description,
      theme: narDef.setting,
      levelRange: `Level ${lvl.levelNum}`,
      estimatedTime: 20 + idx * 10,
      difficultyRating: idx === 0 ? 'beginner' : idx < 3 ? 'intermediate' : 'advanced',
      steps: [{
        stepId: `intro_${lvl.levelNum}`,
        title: `Enter ${lvl.title}`,
        narrative: `Your journey through ${narDef.setting} continues. ${lvl.description}`,
        characterDialog: `${narDef.mainCharacter}: "Welcome to ${lvl.title}. Let me guide you through this chapter."`,
        backdrop: narDef.worldDescription,
      }],
    }));

    await Narrative.create({
      courseId: course._id,
      title: `${course.title}: The Quest`,
      setting: narDef.setting,
      mainCharacter: narDef.mainCharacter,
      chapters,
      worldDescription: narDef.worldDescription,
    });
    console.log(`   📜 Narrative created`);
  }

  console.log('\n🎉 Seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
