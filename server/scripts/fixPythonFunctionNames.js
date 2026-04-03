const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Course = require('../models/Course');
require('dotenv').config();

const functionNames = [
  // Level 1
  'add', 'reverse_string', 'even_or_odd',
  // Level 2
  'get_grade', 'check_access', 'classify',
  // Level 3
  'fizzbuzz', 'sum_list', 'count_evens',
  // Level 4
  'factorial', 'add_all', 'apply',
  // Level 5
  'max_in_list', 'merge_dicts', 'unique_items',
];

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
      if (functionNames[i]) {
        await Challenge.findByIdAndUpdate(challenges[i]._id, {
          $set: { functionName: functionNames[i] }
        });
        console.log(
          `✅ Set functionName "${functionNames[i]}" for: ${challenges[i].title}`
        );
      }
    }

    console.log('🎉 All Python function names fixed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fix();
