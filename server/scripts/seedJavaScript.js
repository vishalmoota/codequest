const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Course = require('../models/Course');
require('dotenv').config();

const javascriptChallenges = [
  // LEVEL 1 - Variables & Basics
  {
    title: 'Sum Two Numbers',
    description: `Write a function that takes two numbers and returns their sum.
    
Example:
- add(3, 4) returns 7
- add(-1, 5) returns 4
- add(0, 0) returns 0`,
    language: 'javascript',
    exerciseType: 'coding',
    functionName: 'add',
    levelNum: 1,
    order: 1,
    starterCode: `function add(a, b) {
  // YOUR CODE HERE
  
}`,
    testCases: [
      { description: 'Basic addition', args: [3, 4], expected: 7 },
      { description: 'With negative numbers', args: [-1, 5], expected: 4 },
      { description: 'Zero values', args: [0, 0], expected: 0 },
      { description: 'Decimal numbers', args: [2.5, 3.5], expected: 6 },
    ],
    hints: [
      'Use the + operator to add two numbers',
      'Return the result using the return statement',
    ],
    difficulty: 'easy',
    tags: ['arithmetic', 'basic'],
    xpReward: 20,
    storyContext: 'Help the explorer calculate distances by adding two numbers.',
  },
  {
    title: 'Create a Greeting',
    description: `Write a function that takes a name and returns a greeting string.

The greeting should be: "Hello, [name]!"

Example:
- greet("Alice") returns "Hello, Alice!"
- greet("Bob") returns "Hello, Bob!"`,
    language: 'javascript',
    exerciseType: 'coding',
    functionName: 'greet',
    levelNum: 1,
    order: 2,
    starterCode: `function greet(name) {
  // YOUR CODE HERE
  
}`,
    testCases: [
      { description: 'Greet Alice', args: ['Alice'], expected: 'Hello, Alice!' },
      { description: 'Greet Bob', args: ['Bob'], expected: 'Hello, Bob!' },
      { description: 'Greet CodeQuest', args: ['CodeQuest'], expected: 'Hello, CodeQuest!' },
    ],
    hints: [
      'Use template literals with backticks: `Hello, ${name}!`',
      'Or use string concatenation: "Hello, " + name + "!"',
    ],
    difficulty: 'easy',
    tags: ['strings', 'basic'],
    xpReward: 20,
    storyContext: 'Greet villagers as they arrive at your coding settlement.',
  },
  {
    title: 'Check if Number is Even',
    description: `Write a function that determines if a number is even or odd.

Return true if even, false if odd.

Example:
- isEven(4) returns true
- isEven(3) returns false
- isEven(0) returns true`,
    language: 'javascript',
    exerciseType: 'coding',
    functionName: 'isEven',
    levelNum: 1,
    order: 3,
    starterCode: `function isEven(num) {
  // YOUR CODE HERE
  
}`,
    testCases: [
      { description: 'Even number', args: [4], expected: true },
      { description: 'Odd number', args: [3], expected: false },
      { description: 'Zero', args: [0], expected: true },
      { description: 'Negative even', args: [-2], expected: true },
      { description: 'Negative odd', args: [-5], expected: false },
    ],
    hints: [
      'Use the modulo operator: num % 2',
      'If num % 2 === 0, it is even',
    ],
    difficulty: 'easy',
    tags: ['operators', 'conditionals'],
    xpReward: 20,
    storyContext: 'Organize items into pairs to determine if they are even.',
  },

  // LEVEL 2 - Conditionals
  {
    title: 'Find Maximum of Two Numbers',
    description: `Write a function that returns the larger of two numbers.

Example:
- max(5, 3) returns 5
- max(2, 8) returns 8
- max(4, 4) returns 4`,
    language: 'javascript',
    exerciseType: 'coding',
    functionName: 'max',
    levelNum: 2,
    order: 1,
    starterCode: `function max(a, b) {
  // YOUR CODE HERE
  
}`,
    testCases: [
      { description: 'First is larger', args: [5, 3], expected: 5 },
      { description: 'Second is larger', args: [2, 8], expected: 8 },
      { description: 'Equal numbers', args: [4, 4], expected: 4 },
      { description: 'Negative numbers', args: [-3, -7], expected: -3 },
    ],
    hints: [
      'Use an if-else statement to compare a and b',
      'Return the larger value',
    ],
    difficulty: 'easy',
    tags: ['conditionals', 'comparison'],
    xpReward: 25,
    storyContext: 'Choose the stronger warrior for your battle.',
  },
  {
    title: 'Grade Calculator',
    description: `Write a function that returns a letter grade based on score (0-100).

Grading scale:
- 90-100: 'A'
- 80-89: 'B'
- 70-79: 'C'
- 60-69: 'D'
- Below 60: 'F'

Example:
- getGrade(95) returns 'A'
- getGrade(85) returns 'B'
- getGrade(55) returns 'F'`,
    language: 'javascript',
    exerciseType: 'coding',
    functionName: 'getGrade',
    levelNum: 2,
    order: 2,
    starterCode: `function getGrade(score) {
  // YOUR CODE HERE
  
}`,
    testCases: [
      { description: 'Grade A', args: [95], expected: 'A' },
      { description: 'Grade B', args: [85], expected: 'B' },
      { description: 'Grade C', args: [75], expected: 'C' },
      { description: 'Grade D', args: [65], expected: 'D' },
      { description: 'Grade F', args: [55], expected: 'F' },
      { description: 'Boundary (90)', args: [90], expected: 'A' },
      { description: 'Boundary (80)', args: [80], expected: 'B' },
    ],
    hints: [
      'Use if-else if statements',
      'Check the score against each grade threshold',
    ],
    difficulty: 'easy',
    tags: ['conditionals', 'range-checking'],
    xpReward: 30,
    storyContext: 'Evaluate student progress with proper grading.',
  },
  {
    title: 'Absolute Value',
    description: `Write a function that returns the absolute value (distance from zero) of a number.

Example:
- abs(-5) returns 5
- abs(3) returns 3
- abs(0) returns 0`,
    language: 'javascript',
    exerciseType: 'coding',
    functionName: 'abs',
    levelNum: 2,
    order: 3,
    starterCode: `function abs(num) {
  // YOUR CODE HERE
  
}`,
    testCases: [
      { description: 'Negative number', args: [-5], expected: 5 },
      { description: 'Positive number', args: [3], expected: 3 },
      { description: 'Zero', args: [0], expected: 0 },
      { description: 'Large negative', args: [-1000], expected: 1000 },
    ],
    hints: [
      'If num is negative, return -num',
      'Otherwise, return num',
      'Or use: return num < 0 ? -num : num',
    ],
    difficulty: 'easy',
    tags: ['conditionals', 'math'],
    xpReward: 20,
    storyContext: 'Measure distance regardless of direction.',
  },

  // LEVEL 3 - Loops & Arrays
  {
    title: 'Sum Array Elements',
    description: `Write a function that takes an array of numbers and returns their sum.

Example:
- sumArray([1, 2, 3]) returns 6
- sumArray([5, 10]) returns 15
- sumArray([]) returns 0`,
    language: 'javascript',
    exerciseType: 'coding',
    functionName: 'sumArray',
    levelNum: 3,
    order: 1,
    starterCode: `function sumArray(arr) {
  // YOUR CODE HERE
  
}`,
    testCases: [
      { description: 'Multiple numbers', args: [[1, 2, 3]], expected: 6 },
      { description: 'Two numbers', args: [[5, 10]], expected: 15 },
      { description: 'Empty array', args: [[]], expected: 0 },
      { description: 'Single element', args: [[42]], expected: 42 },
      { description: 'With negatives', args: [[1, -1, 5]], expected: 5 },
    ],
    hints: [
      'Initialize a sum variable to 0',
      'Loop through each element and add it to sum',
      'Or use the reduce() method',
    ],
    difficulty: 'easy',
    tags: ['arrays', 'loops'],
    xpReward: 30,
    storyContext: 'Calculate the total treasure collected.',
  },
  {
    title: 'Find Maximum in Array',
    description: `Write a function that returns the largest number in an array.

Example:
- findMax([3, 7, 2, 9, 1]) returns 9
- findMax([1]) returns 1
- findMax([-5, -2, -10]) returns -2`,
    language: 'javascript',
    exerciseType: 'coding',
    functionName: 'findMax',
    levelNum: 3,
    order: 2,
    starterCode: `function findMax(arr) {
  // YOUR CODE HERE
  
}`,
    testCases: [
      { description: 'Multiple numbers', args: [[3, 7, 2, 9, 1]], expected: 9 },
      { description: 'Single element', args: [[1]], expected: 1 },
      { description: 'All negatives', args: [[-5, -2, -10]], expected: -2 },
      { description: 'With zeros', args: [[0, 5, -3]], expected: 5 },
    ],
    hints: [
      'Start with the first element as max',
      'Loop through and update max if you find a larger value',
      'Or use Math.max() with spread operator',
    ],
    difficulty: 'easy',
    tags: ['arrays', 'loops'],
    xpReward: 30,
    storyContext: 'Find the most valuable treasure in your collection.',
  },
  {
    title: 'Count Occurrences',
    description: `Write a function that counts how many times a value appears in an array.

Example:
- countOccurrences([1, 2, 2, 3, 2], 2) returns 3
- countOccurrences(['a', 'b', 'a'], 'a') returns 2
- countOccurrences([5, 5, 5], 5) returns 3`,
    language: 'javascript',
    exerciseType: 'coding',
    functionName: 'countOccurrences',
    levelNum: 3,
    order: 3,
    starterCode: `function countOccurrences(arr, value) {
  // YOUR CODE HERE
  
}`,
    testCases: [
      { description: 'Multiple occurrences', args: [[1, 2, 2, 3, 2], 2], expected: 3 },
      { description: 'Strings', args: [['a', 'b', 'a'], 'a'], expected: 2 },
      { description: 'All same', args: [[5, 5, 5], 5], expected: 3 },
      { description: 'Not found', args: [[1, 2, 3], 4], expected: 0 },
    ],
    hints: [
      'Initialize a count variable to 0',
      'Loop through array and increment count when you find the value',
      'Or use the filter() method',
    ],
    difficulty: 'easy',
    tags: ['arrays', 'loops'],
    xpReward: 30,
    storyContext: 'Inventory your items by counting each type.',
  },
];

const seedJavaScriptChallenges = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding JavaScript challenges');

    // Find JavaScript course
    const course = await Course.findOne({ language: 'javascript' });
    if (!course) {
      console.error('JavaScript course not found. Please seed courses first.');
      process.exit(1);
    }

    console.log(`Found JavaScript course: ${course._id}`);

    // Clear existing JavaScript challenges for this course
    await Challenge.deleteMany({ courseId: course._id, language: 'javascript' });
    console.log('Cleared existing JavaScript challenges');

    // Add courseId to all challenges
    const challengesWithCourseId = javascriptChallenges.map(ch => ({
      ...ch,
      courseId: course._id,
    }));

    // Seed challenges
    const createdChallenges = await Challenge.insertMany(challengesWithCourseId);
    console.log(`✅ Successfully seeded ${createdChallenges.length} JavaScript challenges`);

    // Show summary by level
    const byLevel = {};
    createdChallenges.forEach(ch => {
      byLevel[ch.levelNum] = (byLevel[ch.levelNum] || 0) + 1;
    });
    console.log('\nChallenges by level:');
    Object.entries(byLevel)
      .sort((a, b) => a[0] - b[0])
      .forEach(([level, count]) => {
        console.log(`  Level ${level}: ${count} challenges`);
      });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding challenges:', error);
    process.exit(1);
  }
};

seedJavaScriptChallenges();
