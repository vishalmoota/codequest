const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Course = require('../models/Course');
require('dotenv').config();

const pythonTheoryData = [
  // LEVEL 1 - Python Syntax & Basics
  {
    levelNum: 1,
    index: 0,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `Python is one of the most beginner-friendly languages.
Unlike JavaScript, Python uses indentation instead of curly braces.

Printing output:
print("Hello, World!")
print(42)
print(3.14)

Variables (no keyword needed):
name = "Alice"
age = 25
is_student = True

Python is case-sensitive: name and Name are different variables.
Use # for single-line comments.`,
    instructions: `Write a Python function that takes two numbers a and b 
and returns their sum.
Example: add(3, 4) should return 7.`,
    expectedOutput: `7`,
  },
  {
    levelNum: 1,
    index: 1,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `Python strings are flexible and powerful.

String operations:
text = "hello"
print(len(text))         # 5 — length of string
print(text.upper())      # "HELLO"
print(text[0])           # "h" — first character
print(text[-1])          # "o" — last character
print(text[1:3])         # "el" — slicing

Concatenation:
first = "Hello"
second = "World"
print(first + " " + second)   # "Hello World"

f-strings (modern formatting):
name = "Alice"
print(f"Hello, {name}!")      # "Hello, Alice!"`,
    instructions: `Write a Python function that takes a string s and 
returns it reversed.
Example: reverse_string("hello") should return "olleh".
Hint: Python strings can be reversed with slicing: s[::-1]`,
    expectedOutput: `olleh`,
  },
  {
    levelNum: 1,
    index: 2,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `The modulo operator % gives the remainder after division.

Examples:
10 % 2 == 0   # True — 10 is even
7 % 2 == 1    # True — 7 is odd
15 % 5 == 0   # True — 15 is divisible by 5

Checking even or odd:
number = 8
if number % 2 == 0:
    print("Even")
else:
    print("Odd")

Note: Python uses elif instead of else if.`,
    instructions: `Write a Python function that takes a number and returns 
"Even" if it is even, or "Odd" if it is odd.
Example: even_or_odd(4) → "Even", even_or_odd(7) → "Odd"`,
    expectedOutput: `Even`,
  },

  // LEVEL 2 - Control Flow
  {
    levelNum: 2,
    index: 0,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `Python uses if, elif, and else for decision making.
Indentation is REQUIRED — use 4 spaces consistently.

Example — grade calculator:
def get_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

Comparison operators:
== equal to         != not equal to
>  greater than     <  less than
>= greater or equal <= less or equal`,
    instructions: `Write a Python function that takes a score (0-100) 
and returns the letter grade:
A for 90 and above, B for 80-89, C for 70-79, D for 60-69, F below 60.`,
    expectedOutput: `B`,
  },
  {
    levelNum: 2,
    index: 1,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `Logical operators in Python use plain English words:

and — both conditions must be True
or  — at least one condition must be True
not — flips True to False and vice versa

Examples:
age = 20
has_id = True

if age >= 18 and has_id:
    print("Entry allowed")

if age < 13 or age > 65:
    print("Special pricing applies")

if not has_id:
    print("ID required")`,
    instructions: `Complete the control flow challenge using if/elif/else 
and logical operators as described in the problem statement.`,
    expectedOutput: ``,
  },
  {
    levelNum: 2,
    index: 2,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `Python has a ternary-style expression using if/else inline:

result = "Adult" if age >= 18 else "Minor"

This is equivalent to:
if age >= 18:
    result = "Adult"
else:
    result = "Minor"

You can also use match/case in Python 3.10+ (like switch):
match day:
    case "Monday":
        print("Start of week")
    case "Friday":
        print("End of week")
    case _:
        print("Midweek")`,
    instructions: `Complete the conditional challenge as described in 
the problem statement.`,
    expectedOutput: ``,
  },

  // LEVEL 3 - Loops & Iteration
  {
    levelNum: 3,
    index: 0,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `Python loops let you repeat code efficiently.

For loop with range():
for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 6):     # 1, 2, 3, 4, 5
    print(i)

for i in range(0, 10, 2): # 0, 2, 4, 6, 8 (step of 2)
    print(i)

While loop:
count = 0
while count < 5:
    print(count)
    count += 1

FizzBuzz pattern:
for i in range(1, 101):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`,
    instructions: `Complete the loop-based challenge as described in 
the problem statement.`,
    expectedOutput: ``,
  },
  {
    levelNum: 3,
    index: 1,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `Iterating over lists and strings in Python:

Looping over a list:
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

Looping with index using enumerate():
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

List comprehension (powerful Python shortcut):
squares = [x**2 for x in range(1, 6)]
# [1, 4, 9, 16, 25]

evens = [x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]`,
    instructions: `Complete the list iteration challenge as described 
in the problem statement.`,
    expectedOutput: ``,
  },
  {
    levelNum: 3,
    index: 2,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `Useful loop control statements in Python:

break — exit the loop immediately
continue — skip to the next iteration
pass — do nothing (placeholder)

Example:
for i in range(10):
    if i == 5:
        break        # stops at 5
    if i % 2 == 0:
        continue     # skips even numbers
    print(i)         # prints 1, 3

Nested loops:
for i in range(1, 4):
    for j in range(1, 4):
        print(i * j, end=" ")
    print()`,
    instructions: `Complete the loop control challenge as described in 
the problem statement.`,
    expectedOutput: ``,
  },

  // LEVEL 4 - Functions & Modules
  {
    levelNum: 4,
    index: 0,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `Functions in Python are defined with the def keyword.

Basic function:
def greet(name):
    return "Hello, " + name

print(greet("Alice"))   # "Hello, Alice"

Default parameters:
def greet(name="World"):
    return f"Hello, {name}!"

greet()          # "Hello, World!"
greet("Bob")     # "Hello, Bob!"

Multiple return values (returns a tuple):
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 1, 4, 1, 5])`,
    instructions: `Complete the function challenge as described in 
the problem statement.`,
    expectedOutput: ``,
  },
  {
    levelNum: 4,
    index: 1,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `Advanced function concepts in Python:

*args — accept any number of positional arguments:
def add_all(*args):
    return sum(args)

add_all(1, 2, 3, 4)   # 10

**kwargs — accept any number of keyword arguments:
def display(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

Lambda functions (anonymous, one-line):
square = lambda x: x ** 2
square(5)   # 25

sorted with key:
words = ["banana", "apple", "cherry"]
sorted(words, key=lambda w: len(w))`,
    instructions: `Complete the advanced function challenge as described 
in the problem statement.`,
    expectedOutput: ``,
  },
  {
    levelNum: 4,
    index: 2,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `Python has many useful built-in functions and modules:

Built-in functions:
len([1, 2, 3])       # 3
sum([1, 2, 3])       # 6
min([3, 1, 2])       # 1
max([3, 1, 2])       # 3
abs(-5)              # 5
round(3.7)           # 4
type("hello")        # <class 'str'>

Importing modules:
import math
math.sqrt(16)        # 4.0
math.pi              # 3.14159...

import random
random.randint(1, 10)  # random number 1-10`,
    instructions: `Complete the functions and modules challenge as 
described in the problem statement.`,
    expectedOutput: ``,
  },

  // LEVEL 5 - Data Structures
  {
    levelNum: 5,
    index: 0,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `Python Lists — ordered, mutable collections:

Creating and accessing:
fruits = ["apple", "banana", "cherry"]
print(fruits[0])     # "apple"
print(fruits[-1])    # "cherry" (last item)
print(fruits[1:3])   # ["banana", "cherry"] (slicing)

Modifying lists:
fruits.append("mango")      # add to end
fruits.insert(1, "grape")   # insert at index
fruits.remove("banana")     # remove by value
fruits.pop()                # remove last item
fruits.pop(0)               # remove at index

Useful list methods:
len(fruits)           # length
fruits.sort()         # sort in place
sorted(fruits)        # return sorted copy
fruits.reverse()      # reverse in place
fruits.count("apple") # count occurrences`,
    instructions: `Complete the list challenge as described in 
the problem statement.`,
    expectedOutput: ``,
  },
  {
    levelNum: 5,
    index: 1,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `Python Dictionaries — key-value pairs (like objects in JS):

Creating and accessing:
user = {"name": "Alice", "age": 25, "is_student": True}
print(user["name"])         # "Alice"
print(user.get("age"))      # 25 (safe access)
print(user.get("email", "N/A"))  # "N/A" (default)

Modifying dictionaries:
user["email"] = "alice@email.com"   # add/update
del user["is_student"]              # delete key

Iterating:
for key in user:
    print(key, user[key])

for key, value in user.items():
    print(f"{key}: {value}")

Useful methods:
user.keys()     # all keys
user.values()   # all values
user.items()    # all key-value pairs`,
    instructions: `Complete the dictionary challenge as described in 
the problem statement.`,
    expectedOutput: ``,
  },
  {
    levelNum: 5,
    index: 2,
    language: 'python',
    exerciseType: 'coding',
    theoryContent: `Python Tuples and Sets:

Tuples — ordered, IMMUTABLE (cannot change after creation):
coordinates = (10, 20)
point = (3, 4, 5)
x, y, z = point          # unpacking
print(point[0])           # 3
# point[0] = 5            # ERROR — tuples are immutable

Sets — unordered, unique values only:
unique = {1, 2, 3, 2, 1}
print(unique)    # {1, 2, 3} — duplicates removed

set_a = {1, 2, 3, 4}
set_b = {3, 4, 5, 6}
set_a & set_b    # {3, 4} — intersection
set_a | set_b    # {1, 2, 3, 4, 5, 6} — union
set_a - set_b    # {1, 2} — difference`,
    instructions: `Complete the data structures challenge as described 
in the problem statement.`,
    expectedOutput: ``,
  },
];

async function seedPythonTheory() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the Python course
    const pythonCourse = await Course.findOne({ 
      title: { $regex: /python/i } 
    });

    if (!pythonCourse) {
      console.log('Python course not found in database.');
      console.log('Make sure you ran the original seed.js first.');
      process.exit(1);
    }

    console.log(`Found Python course: ${pythonCourse.title} (${pythonCourse._id})`);

    let updatedCount = 0;

    for (const data of pythonTheoryData) {
      // Get all challenges for this level, sorted by creation order
      const challengesInLevel = await Challenge.find({
        courseId: pythonCourse._id,
        levelNum: data.levelNum,
      }).sort({ createdAt: 1, _id: 1 });

      if (!challengesInLevel[data.index]) {
        console.log(`No challenge found at level ${data.levelNum} index ${data.index} — skipping`);
        continue;
      }

      const challenge = challengesInLevel[data.index];

      await Challenge.findByIdAndUpdate(challenge._id, {
        $set: {
          language: data.language,
          exerciseType: data.exerciseType,
          theoryContent: data.theoryContent,
          instructions: data.instructions,
          expectedOutput: data.expectedOutput,
        }
      });

      console.log(`Updated: Level ${data.levelNum} - ${challenge.title}`);
      updatedCount++;
    }

    console.log(`\nDone! Updated ${updatedCount} Python challenges with theory content.`);
    process.exit(0);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedPythonTheory();
