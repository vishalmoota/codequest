const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Course = require('../models/Course');
require('dotenv').config();

const starterCodeMap = {
  // Level 1
  0: "def add(a, b):\n    # Write your solution here\n    pass",
  1: "def reverse_string(s):\n    # Write your solution here\n    pass",
  2: "def even_or_odd(n):\n    # Write your solution here\n    pass",
  // Level 2
  3: "def get_grade(score):\n    # Write your solution here\n    pass",
  4: "def check_access(age, has_id):\n    # Write your solution here\n    pass",
  5: "def classify(n):\n    # Write your solution here\n    pass",
  // Level 3
  6: "def fizzbuzz(n):\n    # Write your solution here\n    pass",
  7: "def sum_list(nums):\n    # Write your solution here\n    pass",
  8: "def count_evens(nums):\n    # Write your solution here\n    pass",
  // Level 4
  9: "def factorial(n):\n    # Write your solution here\n    pass",
  10: "def add_all(*args):\n    # Write your solution here\n    pass",
  11: "def apply(func, value):\n    # Write your solution here\n    pass",
  // Level 5
  12: "def max_in_list(nums):\n    # Write your solution here\n    pass",
  13: "def merge_dicts(d1, d2):\n    # Write your solution here\n    pass",
  14: "def unique_items(lst):\n    # Write your solution here\n    pass",
};

async function fix() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const pythonCourse = await Course.findOne({
      title: { $regex: /python/i }
    });

    if (!pythonCourse) {
      console.log('❌ Python course not found');
      process.exit(1);
    }

    const challenges = await Challenge.find({
      courseId: pythonCourse._id,
    }).sort({ levelNum: 1, createdAt: 1, _id: 1 });

    console.log(`ℹ️ Found ${challenges.length} Python challenges`);

    for (let i = 0; i < challenges.length; i++) {
      const ch = challenges[i];
      const starter = starterCodeMap[i];
      if (starter) {
        await Challenge.findByIdAndUpdate(ch._id, {
          $set: { starterCode: starter }
        });
        console.log(`✅ Fixed starter code for: ${ch.title}`);
      }
    }

    console.log('🎉 All Python starter codes fixed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fix();
