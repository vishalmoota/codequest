import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import CodeEditor from '../components/CodeEditor';

const LANG_META = {
  python: {
    label: 'Python', tag: '# Python', filename: 'script.py',
    monacoLang: 'python', accent: '#4ade80',
    defaultCode: '# Try the examples from the theory here!\n\nprint("Hello, Python!")\n',
  },
  javascript: {
    label: 'JavaScript', tag: '// JavaScript', filename: 'script.js',
    monacoLang: 'javascript', accent: '#f7df1e',
    defaultCode: '// Try the examples from the theory here!\n\nconsole.log("Hello, JavaScript!");\n',
  },
  html: {
    label: 'HTML & CSS', tag: '<!-- HTML -->', filename: 'index.html',
    monacoLang: 'html', accent: '#60a5fa',
    defaultCode: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Practice</title>\n    <style>\n      body { font-family: sans-serif; padding: 20px; }\n    </style>\n  </head>\n  <body>\n    <!-- Try the examples from the theory here! -->\n    <h1>Hello HTML!</h1>\n  </body>\n</html>',
  },
};

const getLangMeta = (lang) =>
  LANG_META[lang?.toLowerCase()] || LANG_META.javascript;

// Module-level singleton — shared across all renders
let _pyodideInstance = null;
let _pyodideLoadPromise = null;

const loadPyodide = () => {
  // Return existing instance immediately
  if (_pyodideInstance) {
    return Promise.resolve(_pyodideInstance);
  }
  // Return existing promise if already loading
  if (_pyodideLoadPromise) {
    return _pyodideLoadPromise;
  }
  // Start loading
  _pyodideLoadPromise = new Promise((resolve, reject) => {
    // Check if already loaded in window
    if (window.pyodide) {
      _pyodideInstance = window.pyodide;
      return resolve(_pyodideInstance);
    }
    
    const existingScript = document.querySelector(
      'script[src*="pyodide"]'
    );
    
    const onLoad = async () => {
      try {
        const py = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
        });
        _pyodideInstance = py;
        window.pyodide = py; // Cache on window too
        resolve(py);
      } catch (e) {
        _pyodideLoadPromise = null; // Allow retry
        reject(e);
      }
    };

    if (existingScript) {
      if (window.loadPyodide) {
        onLoad();
      } else {
        existingScript.addEventListener('load', onLoad);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 
      'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
    script.onload = onLoad;
    script.onerror = (e) => {
      _pyodideLoadPromise = null;
      reject(new Error('Failed to load Pyodide script'));
    };
    document.head.appendChild(script);
  });

  return _pyodideLoadPromise;
};


const runPython = async (code) => {
  const py = await loadPyodide();
  try {
    // Redirect stdout to capture print() output
    py.runPython(`
import sys
import io
sys.stdout = io.StringIO()
`);
    py.runPython(code);
    const output = py.runPython('sys.stdout.getvalue()');
    return output || '(no output)';
  } catch (e) {
    // Get clean error message without Pyodide internal stack
    const msg = e.message || String(e);
    const lines = msg.split('\n');
    // Return only the last meaningful error line
    const errorLine = lines.filter(l => l.trim()).pop() || msg;
    throw new Error(errorLine);
  }
};

const runJavaScript = (code) => {
  const logs = [];
  const fakeConsole = {
    log: (...args) => logs.push(
      args.map(a => 
        typeof a === 'object' ? JSON.stringify(a) : String(a)
      ).join(' ')
    ),
    error: (...args) => logs.push('ERROR: ' + args.join(' ')),
    warn: (...args) => logs.push('WARN: ' + args.join(' ')),
  };
  try {
    // eslint-disable-next-line no-new-func
    new Function('console', code)(fakeConsole);
    return logs.join('\n') || '(no output)';
  } catch (e) {
    throw new Error(e.message);
  }
};

// Theory content per course language and level
const THEORY_CONTENT = {
  javascript: {
    1: {
      title: 'Variables, Data Types & the JS Runtime',
      sections: [
        {
          heading: 'Variables: var, let & const',
          content: `Variables are named containers for data.
JavaScript has three ways to declare them:

const PI = 3.14159;        // read-only, cannot reassign
let score = 0;             // re-assignable
var age = 25;              // old way, avoid in modern JS

Key rule: Default to const. Use let only when you need 
to reassign. Never use var.`,
          code: `const name = "Alice";\nlet score = 0;\nscore = score + 10;\nconsole.log(name);\nconsole.log(score);`,
        },
        {
          heading: 'Primitive Data Types',
          content: `JavaScript has 7 primitive types:

string   → "hello", 'world', \`template\`
number   → 42, 3.14, -7
boolean  → true, false
null     → intentional empty value
undefined→ variable declared but not assigned
symbol   → unique identifier (advanced)
bigint   → very large integers (advanced)

typeof operator tells you the type:
typeof "hello"  // "string"
typeof 42       // "number"
typeof true     // "boolean"`,
          code: `const text = "Hello World";\nconst num = 42;\nconst isActive = true;\n\nconsole.log(typeof text);\nconsole.log(typeof num);\nconsole.log(typeof isActive);\nconsole.log(text.length);`,
        },
        {
          heading: 'Template Literals & String Methods',
          content: `Template literals use backticks and allow 
embedding expressions with \${}.

const name = "Alice";
const greeting = \`Hello, \${name}!\`;

String methods:
"hello".toUpperCase()     // "HELLO"
"hello".length            // 5
"hello world".split(" ")  // ["hello", "world"]
"  hello  ".trim()        // "hello"
"hello".includes("ell")   // true`,
          code: `const firstName = "Alice";\nconst lastName = "Smith";\nconst age = 25;\n\nconst message = \`Hello, \${firstName} \${lastName}! You are \${age} years old.\`;\nconsole.log(message);\nconsole.log(message.toUpperCase());\nconsole.log(message.length);`,
        },
      ],
    },
    2: {
      title: 'Conditionals & Control Flow',
      sections: [
        {
          heading: 'if / else if / else',
          content: `Conditionals let your code make decisions.

if (condition) {
  // runs if condition is true
} else if (otherCondition) {
  // runs if otherCondition is true
} else {
  // runs if nothing above is true
}

Comparison operators:
===  strictly equal
!==  not equal
>    greater than
<    less than
>=   greater than or equal
<=   less than or equal`,
          code: `const score = 85;\n\nif (score >= 90) {\n  console.log("Grade: A");\n} else if (score >= 80) {\n  console.log("Grade: B");\n} else if (score >= 70) {\n  console.log("Grade: C");\n} else {\n  console.log("Grade: F");\n}`,
        },
        {
          heading: 'Logical Operators',
          content: `Combine multiple conditions:

&&  AND — both must be true
||  OR  — at least one must be true
!   NOT — flips true/false

Examples:
age >= 18 && hasID    // both required
isWeekend || isHoliday // either works
!isLoggedIn           // opposite`,
          code: `const age = 20;\nconst hasID = true;\n\nif (age >= 18 && hasID) {\n  console.log("Entry allowed");\n}\n\nconst isWeekend = false;\nconst isHoliday = true;\n\nif (isWeekend || isHoliday) {\n  console.log("Day off!");\n}`,
        },
        {
          heading: 'Ternary Operator',
          content: `Shorthand for simple if/else:

condition ? valueIfTrue : valueIfFalse

Examples:
const status = age >= 18 ? "Adult" : "Minor";
const label = isLoggedIn ? "Logout" : "Login";`,
          code: `const age = 20;\nconst status = age >= 18 ? "Adult" : "Minor";\nconsole.log(status);\n\nconst num = 7;\nconst parity = num % 2 === 0 ? "Even" : "Odd";\nconsole.log(parity);`,
        },
      ],
    },
    3: {
      title: 'Loops & Iteration',
      sections: [
        {
          heading: 'for loop',
          content: `Repeat code a set number of times.

for (initialization; condition; update) {
  // code to repeat
}

Example:
for (let i = 0; i < 5; i++) {
  console.log(i); // 0 1 2 3 4
}`,
          code: `for (let i = 1; i <= 5; i++) {\n  console.log(\`Count: \${i}\`);\n}\n\n// Sum 1 to 10\nlet sum = 0;\nfor (let i = 1; i <= 10; i++) {\n  sum += i;\n}\nconsole.log("Sum:", sum);`,
        },
        {
          heading: 'while loop & array iteration',
          content: `while runs as long as condition is true:
let i = 0;
while (i < 5) {
  i++;
}

Array iteration:
const nums = [1, 2, 3, 4, 5];

// forEach
nums.forEach(n => console.log(n));

// for...of (modern, clean)
for (const n of nums) {
  console.log(n);
}`,
          code: `const fruits = ["apple", "banana", "cherry"];\n\n// forEach\nfruits.forEach((fruit, index) => {\n  console.log(\`\${index + 1}. \${fruit}\`);\n});\n\n// for...of\nconsole.log("\\nUsing for...of:");\nfor (const fruit of fruits) {\n  console.log(fruit.toUpperCase());\n}`,
        },
        {
          heading: 'break, continue & FizzBuzz',
          content: `break  — exit the loop entirely
continue — skip current iteration

FizzBuzz classic:
for (let i = 1; i <= 20; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}`,
          code: `// FizzBuzz 1-20\nfor (let i = 1; i <= 20; i++) {\n  if (i % 15 === 0) console.log("FizzBuzz");\n  else if (i % 3 === 0) console.log("Fizz");\n  else if (i % 5 === 0) console.log("Buzz");\n  else console.log(i);\n}`,
        },
      ],
    },
    4: {
      title: 'Functions',
      sections: [
        {
          heading: 'Function declarations & expressions',
          content: `Functions are reusable blocks of code.

Declaration (hoisted — can call before defining):
function greet(name) {
  return "Hello, " + name;
}

Expression (not hoisted):
const greet = function(name) {
  return "Hello, " + name;
};

Arrow function (modern shorthand):
const greet = (name) => "Hello, " + name;`,
          code: `function add(a, b) {\n  return a + b;\n}\n\nconst multiply = (a, b) => a * b;\n\nconst square = n => n * n;\n\nconsole.log(add(3, 4));\nconsole.log(multiply(3, 4));\nconsole.log(square(5));`,
        },
        {
          heading: 'Default parameters & rest args',
          content: `Default parameters:
function greet(name = "World") {
  return \`Hello, \${name}!\`;
}
greet()        // "Hello, World!"
greet("Alice") // "Hello, Alice!"

Rest parameters (collect extra args):
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4) // 10`,
          code: `const greet = (name = "World") => \`Hello, \${name}!\`;\nconsole.log(greet());\nconsole.log(greet("Alice"));\n\nconst sum = (...nums) => nums.reduce((a, b) => a + b, 0);\nconsole.log(sum(1, 2, 3, 4, 5));`,
        },
        {
          heading: 'Closures & higher-order functions',
          content: `A closure is a function that remembers 
variables from its outer scope.

Higher-order functions take or return functions:
map()    — transform each item
filter() — keep items that pass a test
reduce() — combine items into one value`,
          code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\nconst doubled = numbers.map(n => n * 2);\nconsole.log("Doubled:", doubled);\n\nconst evens = numbers.filter(n => n % 2 === 0);\nconsole.log("Evens:", evens);\n\nconst total = numbers.reduce((sum, n) => sum + n, 0);\nconsole.log("Total:", total);`,
        },
      ],
    },
    5: {
      title: 'Arrays & Objects',
      sections: [
        {
          heading: 'Arrays — creation & methods',
          content: `Arrays store ordered lists of values.

const fruits = ["apple", "banana", "cherry"];
fruits[0]              // "apple"
fruits.length          // 3
fruits.push("mango")   // add to end
fruits.pop()           // remove from end
fruits.unshift("kiwi") // add to start
fruits.shift()         // remove from start
fruits.includes("apple") // true
fruits.indexOf("banana")  // 1`,
          code: `const nums = [3, 1, 4, 1, 5, 9, 2, 6];\nconsole.log("Original:", nums);\n\nconst sorted = [...nums].sort((a, b) => a - b);\nconsole.log("Sorted:", sorted);\n\nconst doubled = nums.map(n => n * 2);\nconsole.log("Doubled:", doubled);\n\nconst big = nums.filter(n => n > 4);\nconsole.log("Greater than 4:", big);`,
        },
        {
          heading: 'Objects — key-value pairs',
          content: `Objects store data as key: value pairs.

const user = {
  name: "Alice",
  age: 25,
  isStudent: true,
};

Access: user.name or user["name"]
Add:    user.email = "alice@email.com"
Delete: delete user.age

Useful methods:
Object.keys(user)    // ["name", "age", ...]
Object.values(user)  // ["Alice", 25, ...]
Object.entries(user) // [["name","Alice"], ...]`,
          code: `const user = {\n  name: "Alice",\n  age: 25,\n  skills: ["JS", "Python", "HTML"],\n};\n\nconsole.log(user.name);\nconsole.log(user["age"]);\nconsole.log(Object.keys(user));\nconsole.log(Object.values(user));\n\n// Destructuring\nconst { name, age } = user;\nconsole.log(\`\${name} is \${age} years old\`);`,
        },
        {
          heading: 'Destructuring & spread operator',
          content: `Destructuring unpacks values:

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// Object destructuring
const { name, age, city = "Unknown" } = user;

Spread operator (...) copies or merges:
const arr2 = [...arr1, 4, 5];
const merged = { ...obj1, ...obj2 };`,
          code: `const [a, b, ...rest] = [10, 20, 30, 40, 50];\nconsole.log(a, b, rest);\n\nconst user = { name: "Alice", age: 25 };\nconst { name, age, city = "Unknown" } = user;\nconsole.log(name, age, city);\n\nconst arr1 = [1, 2, 3];\nconst arr2 = [...arr1, 4, 5, 6];\nconsole.log(arr2);\n\nconst merged = { ...user, email: "alice@email.com" };\nconsole.log(merged);`,
        },
      ],
    },
  },
  python: {
    1: {
      title: 'Python Syntax & Basics',
      sections: [
        {
          heading: 'Variables & Print',
          content: `Python uses indentation instead of curly braces.
No var/let/const — just assign directly.

name = "Alice"
age = 25
is_student = True

print() outputs to terminal:
print("Hello, World!")
print(name)
print(f"Hello, {name}!")   # f-string

# Comments use the hash symbol
Python is case-sensitive: name ≠ Name`,
          code: `name = "Alice"\nage = 25\nis_student = True\n\nprint(name)\nprint(age)\nprint(is_student)\nprint(f"Hello, {name}! You are {age} years old.")`,
        },
        {
          heading: 'Data Types & String Methods',
          content: `Python types:
str   → "hello"
int   → 42
float → 3.14
bool  → True, False
None  → null equivalent

String operations:
text = "hello world"
text.upper()         # "HELLO WORLD"
text.capitalize()    # "Hello world"
len(text)            # 11
text[0]              # "h"
text[-1]             # "d"
text[0:5]            # "hello"
text.split(" ")      # ["hello", "world"]`,
          code: `text = "hello world"\nprint(text.upper())\nprint(text.capitalize())\nprint(len(text))\nprint(text[0])\nprint(text[-1])\nprint(text[0:5])\nprint(text.split(" "))\nprint(type(text))\nprint(type(42))\nprint(type(3.14))`,
        },
        {
          heading: 'Input & Basic Math',
          content: `Math operators in Python:
+   addition
-   subtraction
*   multiplication
/   division (returns float)
//  integer division
%   modulo (remainder)
**  exponent (power)

Examples:
10 / 3    # 3.3333...
10 // 3   # 3
10 % 3    # 1
2 ** 8    # 256`,
          code: `print(10 + 3)\nprint(10 - 3)\nprint(10 * 3)\nprint(10 / 3)\nprint(10 // 3)\nprint(10 % 3)\nprint(2 ** 8)\n\n# Converting types\nnum_str = "42"\nnum = int(num_str)\nprint(num + 8)`,
        },
      ],
    },
    2: {
      title: 'Control Flow',
      sections: [
        {
          heading: 'if / elif / else',
          content: `Python uses elif instead of else if.
Indentation (4 spaces) defines code blocks.

score = 85

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
else:
    print("F")

Comparison: ==  !=  >  <  >=  <=`,
          code: `score = 85\n\nif score >= 90:\n    print("Grade: A")\nelif score >= 80:\n    print("Grade: B")\nelif score >= 70:\n    print("Grade: C")\nelif score >= 60:\n    print("Grade: D")\nelse:\n    print("Grade: F")\n\nprint(f"Your score: {score}")`,
        },
        {
          heading: 'Logical Operators',
          content: `Python uses words, not symbols:
and  → both must be True
or   → at least one must be True
not  → flips True/False

Examples:
age >= 18 and has_id
is_weekend or is_holiday
not is_logged_in

in operator checks membership:
"apple" in ["apple", "banana"]  # True
"x" in "hello"                  # False`,
          code: `age = 20\nhas_id = True\n\nif age >= 18 and has_id:\n    print("Entry allowed")\n\nfruits = ["apple", "banana", "cherry"]\nif "apple" in fruits:\n    print("Apple found!")\n\nis_weekend = False\nis_holiday = True\nif is_weekend or is_holiday:\n    print("Day off!")`,
        },
        {
          heading: 'Ternary & match/case',
          content: `Python one-line conditional:
result = value_if_true if condition else value_if_false

Examples:
status = "Adult" if age >= 18 else "Minor"
label = "Even" if n % 2 == 0 else "Odd"

Python 3.10+ match/case (like switch):
match day:
    case "Monday":
        print("Start of week")
    case "Friday":
        print("End of week")
    case _:
        print("Midweek")`,
          code: `age = 20\nstatus = "Adult" if age >= 18 else "Minor"\nprint(status)\n\nfor n in range(1, 8):\n    label = "Even" if n % 2 == 0 else "Odd"\n    print(f"{n} is {label}")`,
        },
      ],
    },
    3: {
      title: 'Loops & Iteration',
      sections: [
        {
          heading: 'for loop & range()',
          content: `for loop iterates over any sequence.

range(5)       → 0, 1, 2, 3, 4
range(1, 6)    → 1, 2, 3, 4, 5
range(0, 10, 2)→ 0, 2, 4, 6, 8

for i in range(5):
    print(i)

Iterating over a list:
fruits = ["apple", "banana"]
for fruit in fruits:
    print(fruit)`,
          code: `# Count from 1 to 5\nfor i in range(1, 6):\n    print(f"Count: {i}")\n\nprint()\n\n# Iterate list\nfruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n    print(fruit.upper())\n\nprint()\n\n# Sum using loop\ntotal = 0\nfor i in range(1, 11):\n    total += i\nprint(f"Sum 1-10: {total}")`,
        },
        {
          heading: 'while loop & enumerate()',
          content: `while runs while condition is True:
count = 0
while count < 5:
    print(count)
    count += 1

enumerate() gives index + value:
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

List comprehension — powerful shortcut:
squares = [x**2 for x in range(1, 6)]
evens = [x for x in range(10) if x % 2 == 0]`,
          code: `fruits = ["apple", "banana", "cherry", "mango"]\n\nfor i, fruit in enumerate(fruits):\n    print(f"{i+1}. {fruit}")\n\nprint()\n\n# List comprehension\nsquares = [x**2 for x in range(1, 6)]\nprint("Squares:", squares)\n\nevens = [x for x in range(1, 21) if x % 2 == 0]\nprint("Evens:", evens)`,
        },
        {
          heading: 'break, continue & nested loops',
          content: `break  — exit loop immediately
continue — skip to next iteration
pass   — placeholder, does nothing

Nested loops:
for i in range(1, 4):
    for j in range(1, 4):
        print(i * j, end=" ")
    print()`,
          code: `# FizzBuzz in Python\nfor i in range(1, 21):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)`,
        },
      ],
    },
    4: {
      title: 'Functions & Modules',
      sections: [
        {
          heading: 'def keyword & return',
          content: `Define functions with def:

def function_name(parameters):
    # body (indented)
    return value

def greet(name):
    return f"Hello, {name}!"

Default parameters:
def greet(name="World"):
    return f"Hello, {name}!"

greet()        # "Hello, World!"
greet("Alice") # "Hello, Alice!"`,
          code: `def greet(name="World"):\n    return f"Hello, {name}!"\n\nprint(greet())\nprint(greet("Alice"))\n\ndef add(a, b):\n    return a + b\n\nprint(add(3, 4))\n\ndef square(n):\n    return n ** 2\n\nprint(square(5))`,
        },
        {
          heading: '*args, **kwargs & lambda',
          content: `*args — variable positional arguments:
def add_all(*args):
    return sum(args)
add_all(1, 2, 3, 4)  # 10

**kwargs — variable keyword arguments:
def display(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

Lambda (anonymous one-line function):
square = lambda x: x ** 2
square(5)  # 25`,
          code: `def add_all(*args):\n    return sum(args)\n\nprint(add_all(1, 2, 3, 4, 5))\n\n# Lambda with sorted\nwords = ["banana", "apple", "cherry", "date"]\nsorted_by_length = sorted(words, key=lambda w: len(w))\nprint(sorted_by_length)\n\n# map and filter with lambda\nnums = [1, 2, 3, 4, 5, 6, 7, 8]\ndoubled = list(map(lambda x: x * 2, nums))\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint(doubled)\nprint(evens)`,
        },
        {
          heading: 'Built-in functions & math module',
          content: `Useful built-ins:
len(), sum(), min(), max()
abs(), round(), type()
int(), float(), str()
sorted(), reversed()
enumerate(), zip(), range()

Import modules:
import math
math.sqrt(16)     # 4.0
math.pi           # 3.14159
math.floor(3.7)   # 3
math.ceil(3.2)    # 4

import random
random.randint(1, 10)
random.choice(["a", "b", "c"])`,
          code: `import math\n\nprint(math.sqrt(144))\nprint(math.pi)\nprint(math.floor(3.9))\nprint(math.ceil(3.1))\nprint(abs(-42))\nprint(round(3.14159, 2))\n\nnums = [5, 2, 8, 1, 9, 3]\nprint(min(nums))\nprint(max(nums))\nprint(sum(nums))\nprint(sorted(nums))`,
        },
      ],
    },
    5: {
      title: 'Data Structures',
      sections: [
        {
          heading: 'Lists',
          content: `Lists — ordered, mutable collections:

fruits = ["apple", "banana", "cherry"]
fruits[0]              # "apple"
fruits[-1]             # "cherry"
fruits[1:3]            # ["banana", "cherry"]
fruits.append("mango") # add to end
fruits.insert(1, "kiwi")
fruits.remove("banana")
fruits.pop()           # remove last
len(fruits)            # length
fruits.sort()          # sort in place
sorted(fruits)         # return sorted copy`,
          code: `nums = [3, 1, 4, 1, 5, 9, 2, 6, 5]\nprint("Original:", nums)\n\nnums.append(10)\nprint("After append:", nums)\n\nnums.sort()\nprint("Sorted:", nums)\n\nunique = list(set(nums))\nprint("Unique:", sorted(unique))\n\nprint("Sum:", sum(nums))\nprint("Max:", max(nums))\nprint("Count of 5:", nums.count(5))`,
        },
        {
          heading: 'Dictionaries',
          content: `Dicts — key-value pairs (like JS objects):

user = {"name": "Alice", "age": 25}
user["name"]          # "Alice"
user.get("email", "N/A")  # safe access
user["email"] = "alice@x.com"
del user["age"]

Iterating:
for key, value in user.items():
    print(f"{key}: {value}")

user.keys()    # all keys
user.values()  # all values`,
          code: `user = {\n    "name": "Alice",\n    "age": 25,\n    "skills": ["Python", "JS", "HTML"]\n}\n\nprint(user["name"])\nprint(user.get("email", "Not set"))\n\nuser["email"] = "alice@example.com"\n\nfor key, value in user.items():\n    print(f"{key}: {value}")\n\nprint(list(user.keys()))\nprint(list(user.values()))`,
        },
        {
          heading: 'Tuples & Sets',
          content: `Tuples — ordered, IMMUTABLE:
point = (10, 20)
x, y = point          # unpacking
point[0]              # 10
# point[0] = 5        # ERROR!

Sets — unordered, unique values only:
unique = {1, 2, 3, 2, 1}  # {1, 2, 3}
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
a & b    # {3, 4} intersection
a | b    # {1,2,3,4,5,6} union
a - b    # {1, 2} difference`,
          code: `# Tuples\npoint = (10, 20, 30)\nx, y, z = point\nprint(f"x={x}, y={y}, z={z}")\n\n# Sets\nwords = ["apple", "banana", "apple", "cherry", "banana"]\nunique_words = set(words)\nprint("Unique:", unique_words)\nprint("Count:", len(unique_words))\n\na = {1, 2, 3, 4, 5}\nb = {4, 5, 6, 7, 8}\nprint("Intersection:", a & b)\nprint("Union:", a | b)\nprint("Difference:", a - b)`,
        },
      ],
    },
  },
  html: {
    1: {
      title: 'HTML Fundamentals',
      sections: [
        {
          heading: 'HTML Structure & Basic Tags',
          content: `HTML defines the structure of web pages.
Tags are wrapped in angle brackets.

Basic boilerplate:
<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    Content goes here
  </body>
</html>

Common tags:
<h1> to <h6>  — headings
<p>           — paragraph
<strong>      — bold
<em>          — italic
<br>          — line break
<hr>          — horizontal line`,
          code: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>Welcome to HTML!</h1>\n    <h2>This is a subheading</h2>\n    <p>This is a <strong>paragraph</strong> with <em>italic</em> text.</p>\n    <hr>\n    <p>HTML is the backbone of every website.</p>\n  </body>\n</html>`,
        },
        {
          heading: 'Links, Images & Lists',
          content: `Links:
<a href="https://example.com">Click me</a>
<a href="#section">Jump to section</a>
target="_blank" opens in new tab

Images:
<img src="image.jpg" alt="description">
alt is required for accessibility

Unordered list:
<ul>
  <li>Item</li>
</ul>

Ordered list:
<ol>
  <li>First</li>
</ol>`,
          code: `<!DOCTYPE html>\n<html>\n  <head><title>Links & Lists</title></head>\n  <body>\n    <h1>My Favourite Languages</h1>\n    <ul>\n      <li>JavaScript</li>\n      <li>Python</li>\n      <li>HTML & CSS</li>\n    </ul>\n    \n    <h2>Resources</h2>\n    <ol>\n      <li><a href="https://developer.mozilla.org">MDN Web Docs</a></li>\n      <li><a href="https://www.w3schools.com">W3Schools</a></li>\n    </ol>\n  </body>\n</html>`,
        },
        {
          heading: 'Semantic HTML',
          content: `Semantic tags describe their purpose:

<header>  — top section, logo, nav
<nav>     — navigation links
<main>    — main content
<section> — thematic section
<article> — standalone content
<aside>   — sidebar
<footer>  — bottom section

Non-semantic (generic containers):
<div>   — block container
<span>  — inline container

Always prefer semantic over generic!`,
          code: `<!DOCTYPE html>\n<html>\n  <head><title>Semantic HTML</title></head>\n  <body>\n    <header>\n      <h1>CodeQuest</h1>\n    </header>\n    <nav>\n      <a href="#">Home</a> |\n      <a href="#">Courses</a> |\n      <a href="#">Community</a>\n    </nav>\n    <main>\n      <section>\n        <h2>Learn to Code</h2>\n        <p>Start your coding journey today!</p>\n      </section>\n    </main>\n    <footer>\n      <p>&copy; 2024 CodeQuest. All rights reserved.</p>\n    </footer>\n  </body>\n</html>`,
        },
      ],
    },
    2: {
      title: 'CSS Basics',
      sections: [
        {
          heading: 'CSS Selectors & Properties',
          content: `CSS controls how HTML looks.
Write CSS in <style> tag in <head>.

Selector types:
p { }         — element selector
.class { }    — class selector
#id { }       — ID selector
* { }         — all elements

Common properties:
color, background-color
font-size, font-weight, font-family
text-align, text-decoration
border, border-radius
padding, margin, width, height`,
          code: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>CSS Basics</title>\n    <style>\n      body {\n        font-family: sans-serif;\n        background-color: #0d1117;\n        color: white;\n        padding: 20px;\n      }\n      h1 {\n        color: #60a5fa;\n        text-align: center;\n      }\n      .card {\n        background: #1a1a2e;\n        border: 1px solid #60a5fa;\n        border-radius: 8px;\n        padding: 20px;\n        margin: 10px 0;\n      }\n    </style>\n  </head>\n  <body>\n    <h1>Styled with CSS!</h1>\n    <div class="card">Card One</div>\n    <div class="card">Card Two</div>\n  </body>\n</html>`,
        },
        {
          heading: 'Box Model',
          content: `Every element is a box with layers:
Content → Padding → Border → Margin

padding  — space inside border
border   — visible outline
margin   — space outside border

box-sizing: border-box includes padding
in the width calculation (use always!)

Shorthand:
padding: 10px 20px;    /* top/bottom left/right */
margin: 0 auto;        /* center block element */`,
          code: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Box Model</title>\n    <style>\n      * { box-sizing: border-box; margin: 0; padding: 0; }\n      body { background: #f0f0f0; padding: 40px; font-family: sans-serif; }\n      .card {\n        width: 300px;\n        margin: 0 auto;\n        background: white;\n        padding: 24px;\n        border: 2px solid #6c63ff;\n        border-radius: 12px;\n        box-shadow: 0 4px 12px rgba(0,0,0,0.1);\n      }\n      h2 { color: #6c63ff; margin-bottom: 8px; }\n    </style>\n  </head>\n  <body>\n    <div class="card">\n      <h2>Profile Card</h2>\n      <p>Built with the CSS box model.</p>\n    </div>\n  </body>\n</html>`,
        },
        {
          heading: 'Typography & Colors',
          content: `Font properties:
font-family: 'Arial', sans-serif;
font-size: 18px;
font-weight: bold;  /* or 100-900 */
line-height: 1.6;
letter-spacing: 2px;
text-transform: uppercase;

Colors:
color: red;              /* named */
color: #ff0000;          /* hex */
color: rgb(255, 0, 0);   /* RGB */
color: rgba(255,0,0,0.5);/* RGBA */

Gradients:
background: linear-gradient(135deg, #667eea, #764ba2);`,
          code: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Typography</title>\n    <style>\n      body {\n        font-family: Georgia, serif;\n        max-width: 600px;\n        margin: 40px auto;\n        padding: 0 20px;\n        background: linear-gradient(135deg, #1a1a2e, #16213e);\n        color: white;\n        min-height: 100vh;\n      }\n      h1 {\n        font-size: 2.5rem;\n        letter-spacing: 3px;\n        color: #f7df1e;\n      }\n      h3 { font-style: italic; color: #60a5fa; }\n      p { line-height: 1.8; font-size: 16px; }\n      .highlight { color: #4ade80; font-weight: bold; }\n    </style>\n  </head>\n  <body>\n    <h1>The Art of Typography</h1>\n    <h3>Making text beautiful</h3>\n    <p>Good typography makes your site feel <span class="highlight">professional</span> and readable.</p>\n  </body>\n</html>`,
        },
      ],
    },
    3: {
      title: 'Layouts: Flexbox & Grid',
      sections: [
        {
          heading: 'CSS Flexbox',
          content: `Flexbox — one-dimensional layout.

.container {
  display: flex;
  flex-direction: row;       /* or column */
  justify-content: center;   /* main axis */
  align-items: center;       /* cross axis */
  gap: 16px;
}

justify-content values:
flex-start, flex-end, center
space-between, space-around

align-items values:
stretch, center, flex-start, flex-end`,
          code: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Flexbox</title>\n    <style>\n      * { box-sizing: border-box; margin: 0; padding: 0; }\n      body { font-family: sans-serif; background: #0d1117; color: white; }\n      nav {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        padding: 16px 32px;\n        background: #161b22;\n        border-bottom: 1px solid #30363d;\n      }\n      .logo { font-weight: bold; font-size: 1.2rem; color: #f7df1e; }\n      .links { display: flex; gap: 24px; list-style: none; }\n      .links a { color: #c9d1d9; text-decoration: none; }\n      .links a:hover { color: white; }\n    </style>\n  </head>\n  <body>\n    <nav>\n      <div class="logo">CodeQuest</div>\n      <ul class="links">\n        <li><a href="#">Home</a></li>\n        <li><a href="#">Courses</a></li>\n        <li><a href="#">Community</a></li>\n      </ul>\n    </nav>\n  </body>\n</html>`,
        },
        {
          heading: 'CSS Grid',
          content: `Grid — two-dimensional layout.

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

fr unit = fraction of available space
repeat(3, 1fr) = 3 equal columns

Auto-responsive:
grid-template-columns: 
  repeat(auto-fit, minmax(200px, 1fr));

Place items:
grid-column: 1 / 3;  /* span 2 columns */`,
          code: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>CSS Grid</title>\n    <style>\n      * { box-sizing: border-box; }\n      body { font-family: sans-serif; background: #0d1117; color: white; padding: 20px; }\n      h1 { text-align: center; margin-bottom: 20px; color: #60a5fa; }\n      .grid {\n        display: grid;\n        grid-template-columns: repeat(3, 1fr);\n        gap: 16px;\n      }\n      .card {\n        background: #161b22;\n        border: 1px solid #30363d;\n        border-radius: 8px;\n        padding: 20px;\n        text-align: center;\n      }\n      .card:hover { border-color: #60a5fa; }\n    </style>\n  </head>\n  <body>\n    <h1>Feature Grid</h1>\n    <div class="grid">\n      <div class="card"><h3>🚀 Fast</h3><p>Lightning performance</p></div>\n      <div class="card"><h3>🎨 Beautiful</h3><p>Stunning design</p></div>\n      <div class="card"><h3>📱 Responsive</h3><p>Works everywhere</p></div>\n      <div class="card"><h3>🔒 Secure</h3><p>Safe by default</p></div>\n      <div class="card"><h3>⚡ Powerful</h3><p>Built to scale</p></div>\n      <div class="card"><h3>🤝 Community</h3><p>Open source</p></div>\n    </div>\n  </body>\n</html>`,
        },
        {
          heading: 'Centering & Positioning',
          content: `Center with flexbox:
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

Center with grid:
.container {
  display: grid;
  place-items: center;
  height: 100vh;
}

CSS position:
relative — relative to itself
absolute — relative to nearest parent
fixed    — fixed on screen
sticky   — sticks while scrolling`,
          code: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Centering</title>\n    <style>\n      * { margin: 0; padding: 0; box-sizing: border-box; }\n      body {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        min-height: 100vh;\n        background: linear-gradient(135deg, #0d1117, #1a1a2e);\n        font-family: sans-serif;\n      }\n      .hero {\n        text-align: center;\n        color: white;\n      }\n      h1 { font-size: 3rem; color: #f7df1e; margin-bottom: 12px; }\n      p { color: #8b949e; margin-bottom: 24px; }\n      .btn {\n        background: #6c63ff;\n        color: white;\n        border: none;\n        padding: 12px 32px;\n        border-radius: 8px;\n        font-size: 1rem;\n        cursor: pointer;\n      }\n      .btn:hover { background: #5a52d5; }\n    </style>\n  </head>\n  <body>\n    <div class="hero">\n      <h1>CodeQuest</h1>\n      <p>Learn to code through gamified challenges</p>\n      <button class="btn">Start Learning</button>\n    </div>\n  </body>\n</html>`,
        },
      ],
    },
    4: {
      title: 'Styling & Design',
      sections: [
        {
          heading: 'Transitions & Hover Effects',
          content: `CSS transitions animate property changes.

.element {
  transition: property duration easing;
}

Examples:
transition: background 0.3s ease;
transition: all 0.3s ease;
transition: color 0.2s, transform 0.3s;

Transform:
transform: scale(1.1);        /* grow */
transform: translateY(-5px);  /* move up */
transform: rotate(45deg);     /* rotate */

Use on :hover for interactive effects.`,
          code: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Transitions</title>\n    <style>\n      body {\n        display: flex;\n        gap: 20px;\n        justify-content: center;\n        align-items: center;\n        height: 100vh;\n        background: #0d1117;\n      }\n      .btn {\n        padding: 14px 28px;\n        border: none;\n        border-radius: 8px;\n        font-size: 1rem;\n        font-weight: bold;\n        cursor: pointer;\n        transition: all 0.3s ease;\n      }\n      .primary { background: #6c63ff; color: white; }\n      .primary:hover {\n        background: #5a52d5;\n        transform: translateY(-3px);\n        box-shadow: 0 8px 20px rgba(108,99,255,0.4);\n      }\n      .outline { background: transparent; color: #6c63ff; border: 2px solid #6c63ff; }\n      .outline:hover { background: #6c63ff; color: white; }\n    </style>\n  </head>\n  <body>\n    <button class="btn primary">Primary Button</button>\n    <button class="btn outline">Outline Button</button>\n  </body>\n</html>`,
        },
        {
          heading: 'CSS Animations',
          content: `Keyframe animations:

@keyframes animName {
  0%   { property: start; }
  100% { property: end; }
}

.element {
  animation: animName 1s ease infinite;
}

Animation properties:
animation-duration: 1s;
animation-iteration-count: infinite;
animation-direction: alternate;
animation-delay: 0.5s;`,
          code: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Animations</title>\n    <style>\n      body {\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        align-items: center;\n        height: 100vh;\n        background: #0d1117;\n        gap: 30px;\n      }\n      @keyframes spin {\n        from { transform: rotate(0deg); }\n        to { transform: rotate(360deg); }\n      }\n      @keyframes pulse {\n        0%, 100% { transform: scale(1); opacity: 1; }\n        50% { transform: scale(1.1); opacity: 0.7; }\n      }\n      @keyframes fadeInUp {\n        from { opacity: 0; transform: translateY(20px); }\n        to { opacity: 1; transform: translateY(0); }\n      }\n      .spinner {\n        width: 60px; height: 60px;\n        border: 4px solid #1a1a2e;\n        border-top: 4px solid #6c63ff;\n        border-radius: 50%;\n        animation: spin 1s linear infinite;\n      }\n      .text {\n        color: white;\n        font-family: sans-serif;\n        animation: pulse 2s ease infinite;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="spinner"></div>\n    <p class="text">Loading CodeQuest...</p>\n  </body>\n</html>`,
        },
        {
          heading: 'CSS Variables & Gradients',
          content: `CSS custom properties (variables):

:root {
  --primary: #6c63ff;
  --secondary: #ff6584;
  --dark: #0d1117;
}

.button {
  background: var(--primary);
}
.button:hover {
  background: var(--secondary);
}

Gradients:
linear-gradient(135deg, #color1, #color2)
radial-gradient(circle, #color1, #color2)`,
          code: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>CSS Variables</title>\n    <style>\n      :root {\n        --primary: #6c63ff;\n        --secondary: #ff6584;\n        --accent: #f7df1e;\n        --bg: #0d1117;\n        --card-bg: #161b22;\n        --text: #c9d1d9;\n      }\n      * { box-sizing: border-box; margin: 0; padding: 0; }\n      body {\n        background: var(--bg);\n        color: var(--text);\n        font-family: sans-serif;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        min-height: 100vh;\n      }\n      .card {\n        background: linear-gradient(135deg, var(--primary), var(--secondary));\n        padding: 32px;\n        border-radius: 16px;\n        text-align: center;\n        max-width: 300px;\n      }\n      h2 { color: white; margin-bottom: 8px; }\n      p { color: rgba(255,255,255,0.8); margin-bottom: 20px; }\n      .btn {\n        background: var(--accent);\n        color: #000;\n        border: none;\n        padding: 10px 24px;\n        border-radius: 8px;\n        font-weight: bold;\n        cursor: pointer;\n        transition: opacity 0.3s;\n      }\n      .btn:hover { opacity: 0.85; }\n    </style>\n  </head>\n  <body>\n    <div class="card">\n      <h2>Gradient Card</h2>\n      <p>Built with CSS custom properties</p>\n      <button class="btn">Click Me</button>\n    </div>\n  </body>\n</html>`,
        },
      ],
    },
    5: {
      title: 'Responsive Design',
      sections: [
        {
          heading: 'Media Queries',
          content: `Responsive design adapts to screen sizes.
Always include viewport meta tag:
<meta name="viewport" content="width=device-width, initial-scale=1.0">

Media queries:
/* Mobile first — default styles for mobile */

/* Tablet (768px+) */
@media (min-width: 768px) { }

/* Desktop (1024px+) */
@media (min-width: 1024px) { }

Responsive images:
img { max-width: 100%; height: auto; }

Fluid font size:
font-size: clamp(1rem, 2.5vw, 2rem);`,
          code: `<!DOCTYPE html>\n<html>\n  <head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Responsive</title>\n    <style>\n      * { box-sizing: border-box; margin: 0; padding: 0; }\n      body { font-family: sans-serif; background: #0d1117; color: white; padding: 20px; }\n      .grid {\n        display: grid;\n        grid-template-columns: 1fr;\n        gap: 16px;\n      }\n      @media (min-width: 768px) {\n        .grid { grid-template-columns: repeat(2, 1fr); }\n      }\n      @media (min-width: 1024px) {\n        .grid { grid-template-columns: repeat(3, 1fr); }\n      }\n      .card {\n        background: #161b22;\n        border: 1px solid #30363d;\n        border-radius: 8px;\n        padding: 20px;\n        text-align: center;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="grid">\n      <div class="card"><h3>Card 1</h3><p>Responsive layout</p></div>\n      <div class="card"><h3>Card 2</h3><p>1 col on mobile</p></div>\n      <div class="card"><h3>Card 3</h3><p>2 cols on tablet</p></div>\n      <div class="card"><h3>Card 4</h3><p>3 cols on desktop</p></div>\n    </div>\n  </body>\n</html>`,
        },
        {
          heading: 'Responsive Navigation',
          content: `Hamburger menu pattern:
- Mobile: hide links, show ☰ button
- Desktop: show links, hide button

CSS:
.nav-links { display: none; }
.hamburger { display: block; }

@media (min-width: 768px) {
  .nav-links { display: flex; }
  .hamburger { display: none; }
}

JavaScript toggle:
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});`,
          code: `<!DOCTYPE html>\n<html>\n  <head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Responsive Nav</title>\n    <style>\n      * { margin: 0; padding: 0; box-sizing: border-box; }\n      nav { background: #161b22; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }\n      .logo { color: #f7df1e; font-weight: bold; font-size: 1.2rem; }\n      .hamburger { background: none; border: 1px solid #30363d; color: white; padding: 8px 12px; cursor: pointer; display: block; border-radius: 4px; }\n      .nav-links { display: none; width: 100%; flex-direction: column; gap: 8px; padding-top: 12px; list-style: none; }\n      .nav-links.open { display: flex; }\n      .nav-links a { color: #c9d1d9; text-decoration: none; padding: 8px 0; }\n      @media (min-width: 768px) {\n        .hamburger { display: none; }\n        .nav-links { display: flex !important; flex-direction: row; width: auto; padding-top: 0; gap: 24px; }\n      }\n    </style>\n  </head>\n  <body>\n    <nav>\n      <div class="logo">CodeQuest</div>\n      <button class="hamburger" onclick="this.nextElementSibling.classList.toggle('open')">☰</button>\n      <ul class="nav-links">\n        <li><a href="#">Home</a></li>\n        <li><a href="#">Courses</a></li>\n        <li><a href="#">Community</a></li>\n      </ul>\n    </nav>\n  </body>\n</html>`,
        },
        {
          heading: 'Complete Responsive Page',
          content: `Putting it all together — a full page:

✅ Viewport meta tag
✅ CSS reset (*, box-sizing)
✅ CSS custom properties
✅ Semantic HTML
✅ Flexbox navbar
✅ Centered hero section
✅ Responsive grid
✅ Footer
✅ Hover transitions
✅ Media queries

This is how real websites are built!`,
          code: `<!DOCTYPE html>\n<html>\n  <head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Complete Page</title>\n    <style>\n      :root { --primary: #6c63ff; --bg: #0d1117; --card: #161b22; }\n      * { margin: 0; padding: 0; box-sizing: border-box; }\n      body { font-family: sans-serif; background: var(--bg); color: white; }\n      nav { display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; background: var(--card); }\n      .logo { color: #f7df1e; font-weight: bold; }\n      .hero { text-align: center; padding: 80px 20px; }\n      .hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); color: #f7df1e; margin-bottom: 16px; }\n      .hero p { color: #8b949e; margin-bottom: 32px; }\n      .btn { background: var(--primary); color: white; border: none; padding: 14px 32px; border-radius: 8px; font-size: 1rem; cursor: pointer; transition: all 0.3s; }\n      .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(108,99,255,0.4); }\n      .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 40px 32px; }\n      .feature { background: var(--card); padding: 24px; border-radius: 8px; text-align: center; border: 1px solid #30363d; }\n      footer { text-align: center; padding: 24px; color: #8b949e; border-top: 1px solid #30363d; }\n    </style>\n  </head>\n  <body>\n    <nav><div class="logo">CodeQuest</div><button class="btn">Sign Up</button></nav>\n    <section class="hero">\n      <h1>Learn to Code</h1>\n      <p>Gamified coding challenges for everyone</p>\n      <button class="btn">Start for Free</button>\n    </section>\n    <div class="features">\n      <div class="feature"><div style="font-size:2rem">🎮</div><h3>Gamified</h3><p>Earn XP and badges</p></div>\n      <div class="feature"><div style="font-size:2rem">⚡</div><h3>Fast</h3><p>Instant feedback</p></div>\n      <div class="feature"><div style="font-size:2rem">🤝</div><h3>Community</h3><p>Learn together</p></div>\n    </div>\n    <footer><p>&copy; 2024 CodeQuest. All rights reserved.</p></footer>\n  </body>\n</html>`,
        },
      ],
    },
  },
};

const TheoryPage = () => {
  const { courseId, levelNum } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const iframeRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);

  const levelNumber = parseInt(levelNum);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/courses/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        setError('Failed to load course.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const lang = course?.language?.toLowerCase() || 'javascript';
  const langMeta = getLangMeta(lang);

  const theoryData = THEORY_CONTENT[lang]?.[levelNumber] || {
    title: `Level ${levelNumber} Theory`,
    sections: [{
      heading: 'Theory Content',
      content: 'Theory content for this level will be available soon.',
      code: langMeta.defaultCode,
    }],
  };

  const totalSections = theoryData.sections.length;

  useEffect(() => {
    if (theoryData.sections[currentSection]) {
      setCode(theoryData.sections[currentSection].code || langMeta.defaultCode);
      setOutput('');
    }
  }, [currentSection, lang, theoryData.sections, langMeta]);

  useEffect(() => {
    if (!course) return;
    const courseLang = course?.language?.toLowerCase();
    if (courseLang === 'python') {
      setPyodideLoading(true);
      loadPyodide()
        .then(() => {
          setPyodideReady(true);
          setPyodideLoading(false);
          console.log('Pyodide loaded successfully for TheoryPage');
        })
        .catch((err) => {
          console.error('Pyodide failed to load:', err);
          setPyodideLoading(false);
        });
    }
  }, [course]); // depends on course, not lang string

  const handleRun = useCallback(async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setOutput('');

    try {
      // Detect language from course object
      const courseLang = course?.language?.toLowerCase() || 'javascript';
      
      if (courseLang === 'python') {
        if (!pyodideReady) {
          setOutput(
            '⏳ Python is still loading... please wait 10-15 ' +
            'seconds and try again.\n\nPyodide (Python runtime) ' +
            'needs to download on first use.'
          );
          setIsRunning(false);
          return;
        }
        const result = await runPython(code);
        setOutput(result);
      } else if (courseLang === 'html') {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = code;
        }
        setOutput('✅ HTML rendered in preview below.');
      } else {
        // JavaScript
        const result = runJavaScript(code);
        setOutput(result);
      }
    } catch (e) {
      setOutput(`❌ Error:\n${e.message}`);
    } finally {
      setIsRunning(false);
    }
  }, [code, course, pyodideReady]);

  const handleSectionComplete = () => {
    if (!completedSections.includes(currentSection)) {
      setCompletedSections(prev => [...prev, currentSection]);
    }
    if (currentSection < totalSections - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handleCompleteTheory = async () => {
    setMarkingComplete(true);
    try {
      // Mark theory as complete in backend
      await axios.put(`/gamification/course-progress/${courseId}`, {
        theoryCompleted: levelNumber,
        action: 'complete-theory',
      });

      // Fetch challenges for this level to get the first one
      try {
        const challengesRes = await axios.get(`/challenges?courseId=${courseId}&levelNum=${levelNumber}`);
        const challenges = challengesRes.data;
        if (challenges && challenges.length > 0) {
          // Navigate to the first challenge
          navigate(`/course/${courseId}/level/${levelNumber}/challenge/${challenges[0]._id}`);
        } else {
          // If no challenges, go back to course page
          navigate(`/course/${courseId}`);
        }
      } catch (err) {
        // If can't fetch challenges, go back to course page
        navigate(`/course/${courseId}`);
      }
    } catch (_) {
      // If backend doesn't support this yet, still try to fetch and navigate to challenges
      try {
        const challengesRes = await axios.get(`/challenges?courseId=${courseId}&levelNum=${levelNumber}`);
        const challenges = challengesRes.data;
        if (challenges && challenges.length > 0) {
          navigate(`/course/${courseId}/level/${levelNumber}/challenge/${challenges[0]._id}`);
        } else {
          navigate(`/course/${courseId}`);
        }
      } catch (err) {
        navigate(`/course/${courseId}`);
      }
    } finally {
      setMarkingComplete(false);
    }
  };

  const allSectionsRead = completedSections.length >= totalSections - 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📖</div>
          <p className="text-gray-400 font-mono">Loading theory...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-mono mb-4">{error || 'Not found'}</p>
          <button onClick={() => navigate(-1)}
            className="px-4 py-2 bg-purple-600 text-white rounded font-mono">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const section = theoryData.sections[currentSection];

  return (
    <div className="min-h-screen lg:h-screen bg-gray-950 text-white flex flex-col overflow-y-auto lg:overflow-hidden">

      {/* TOP NAV */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 px-4 py-2 border-b
                      border-white/10 bg-gray-900 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => navigate(`/course/${courseId}`)}
            className="text-gray-400 hover:text-white text-xs sm:text-sm font-mono transition whitespace-nowrap">
            ← {course.title}
          </button>
          <span className="text-gray-600">/</span>
          <span className="text-gray-300 text-xs sm:text-sm font-mono truncate max-w-[42vw] sm:max-w-none">
            Level {levelNumber} Theory
          </span>
          {/* Section progress */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <div className="w-32 bg-gray-700 rounded-full h-1.5">
              <div className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${((currentSection + 1) / totalSections) * 100}%`,
                  backgroundColor: langMeta.accent,
                }} />
            </div>
            <span className="text-xs text-gray-500 font-mono">
              {currentSection + 1}/{totalSections}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lang === 'python' && (
            <span className="text-xs font-mono px-2 py-1 rounded"
              style={{
                backgroundColor: pyodideReady
                  ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)',
                color: pyodideReady ? '#4ade80' : '#fbbf24',
              }}>
              {pyodideReady ? '● Python Ready'
                : pyodideLoading ? '⏳ Loading...' : '● Python'}
            </span>
          )}
          <span className="text-xs font-mono px-2 py-1 rounded"
            style={{
              backgroundColor: `${langMeta.accent}20`,
              color: langMeta.accent,
            }}>
            {langMeta.label}
          </span>
        </div>
      </div>

      {/* SPLIT LAYOUT */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-y-visible lg:overflow-hidden">

        {/* LEFT — Theory Content */}
        <div className="w-full lg:w-2/5 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10
                        overflow-hidden flex-shrink-0"
          style={{ minWidth: '0px', maxWidth: '100%' }}>

          {/* Section tabs */}
          <div className="flex gap-1 px-4 pt-3 pb-0 flex-shrink-0 
                          overflow-x-auto border-b border-white/8">
            {theoryData.sections.map((s, idx) => (
              <button key={idx}
                onClick={() => setCurrentSection(idx)}
                className="px-3 py-2 text-xs font-mono rounded-t-lg
                           whitespace-nowrap transition flex items-center gap-1"
                style={{
                  backgroundColor: currentSection === idx
                    ? `${langMeta.accent}20` : 'transparent',
                  color: currentSection === idx
                    ? langMeta.accent : '#6b7280',
                  borderBottom: currentSection === idx
                    ? `2px solid ${langMeta.accent}` : '2px solid transparent',
                }}>
                {completedSections.includes(idx) && '✓ '}
                {idx + 1}. {s.heading.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Scrollable theory content */}
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-xl font-bold font-mono mb-1"
              style={{ color: langMeta.accent }}>
              {theoryData.title}
            </h2>
            <h3 className="text-base font-semibold text-gray-200 mb-4">
              {section.heading}
            </h3>

            {/* Theory text */}
            <div className="rounded-lg p-4 mb-5 text-sm leading-relaxed
                            text-gray-300 whitespace-pre-wrap font-mono"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
              {section.content}
            </div>

            {/* Topics in this chapter */}
            <div className="mb-5">
              <p className="text-xs font-mono text-gray-500 uppercase 
                             tracking-widest mb-3">
                Topics in this chapter
              </p>
              <div className="space-y-2">
                {theoryData.sections.map((s, idx) => (
                  <button key={idx}
                    onClick={() => setCurrentSection(idx)}
                    className="w-full flex items-center justify-between
                               px-3 py-2 rounded-lg text-sm transition"
                    style={{
                      backgroundColor: currentSection === idx
                        ? `${langMeta.accent}15` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${currentSection === idx
                        ? `${langMeta.accent}40` : 'rgba(255,255,255,0.08)'}`,
                    }}>
                    <div className="flex items-center gap-2">
                      <span style={{ color: langMeta.accent }}>
                        {completedSections.includes(idx) ? '✅' : '📌'}
                      </span>
                      <span className="text-gray-300 text-left">
                        {s.heading}
                      </span>
                    </div>
                    <span className="text-gray-600 text-xs">›</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Complete section button */}
            <div className="mt-6 space-y-3">
              <button onClick={handleSectionComplete}
                className="w-full py-2.5 text-sm font-mono font-bold
                           rounded-lg transition hover:opacity-90"
                style={{ backgroundColor: langMeta.accent, color: '#000' }}>
                {currentSection < totalSections - 1
                  ? `Next Topic → (${currentSection + 1}/${totalSections})`
                  : '✓ Mark as Read'}
              </button>

              {allSectionsRead && (
                <button onClick={handleCompleteTheory}
                  disabled={markingComplete}
                  className="w-full py-2.5 text-sm font-mono font-bold
                             rounded-lg border-2 transition hover:bg-white/10
                             disabled:opacity-50"
                  style={{ borderColor: langMeta.accent, color: langMeta.accent }}>
                  {markingComplete
                    ? '⏳ Saving...'
                    : '🎯 Complete Theory & Go to Challenges →'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — Editor & Output */}
        <div className="w-full lg:flex-1 flex flex-col overflow-hidden min-h-[68vh] lg:min-h-0">

          {/* File tab */}
          <div className="flex items-center gap-0 border-b border-white/10
                          bg-gray-900 px-4 flex-shrink-0">
            <div className="flex items-center gap-2 px-4 py-2 text-sm
                            font-mono border-b-2"
              style={{ borderColor: langMeta.accent, color: langMeta.accent }}>
              <span>📄</span>
              <span>{langMeta.filename}</span>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden min-h-[44vh] lg:min-h-0">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={langMeta.monacoLang}
            />
          </div>

          {/* Run button bar */}
          <div className="flex items-center justify-between px-4 py-2
                          border-t border-white/10 bg-gray-900 flex-shrink-0">
            <span className="text-xs text-gray-500 font-mono">
              Try the code — modify and experiment!
            </span>
            <button
              onClick={handleRun}
              disabled={isRunning || 
                (lang === 'python' && !pyodideReady)}
              className="flex items-center gap-2 px-4 py-1.5 text-sm
                         font-mono font-bold rounded-lg text-black
                         transition hover:opacity-90
                         disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: langMeta.accent }}
              title={
                lang === 'python' && !pyodideReady
                  ? 'Python runtime is loading, please wait...'
                  : ''
              }
            >
              {isRunning
                ? '⏳ Running...'
                : lang === 'python' && pyodideLoading
                ? '⏳ Loading Python...'
                : lang === 'python' && !pyodideReady
                ? '⏳ Loading Python...'
                : '▶ Run'}
            </button>
          </div>

          {/* Terminal / Preview */}
          <div className="flex-shrink-0 border-t border-white/10"
            style={{ height: '180px' }}>
            {lang === 'html' ? (
              <div className="h-full flex flex-col">
                <div className="px-3 py-1.5 text-xs font-mono text-gray-500
                               border-b border-white/10 bg-gray-900 flex-shrink-0">
                  Preview
                </div>
                <iframe ref={iframeRef} className="flex-1 w-full bg-white"
                  title="HTML Preview" sandbox="allow-scripts" />
              </div>
            ) : (
              <div className="h-full flex flex-col bg-gray-900">
                <div className="px-3 py-1.5 text-xs font-mono text-gray-500
                               border-b border-white/10 flex-shrink-0">
                  Terminal
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                  {output ? (
                    <pre className="font-mono text-sm whitespace-pre-wrap"
                      style={{ color: output.startsWith('❌') ? '#f87171' : '#86efac' }}>
                      {output}
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center
                                    justify-center text-gray-600">
                      <span className="text-3xl mb-2">⟨/⟩</span>
                      <span className="text-xs font-mono">
                        Click Run to view your results
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheoryPage;
