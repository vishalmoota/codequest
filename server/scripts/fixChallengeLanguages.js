const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Course = require('../models/Course');
require('dotenv').config();

async function fix() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Fix Python course challenges
    const pythonCourse = await Course.findOne({ 
      title: { $regex: /python/i } 
    });
    if (pythonCourse) {
      const result = await Challenge.updateMany(
        { courseId: pythonCourse._id },
        { $set: { language: 'python' } }
      );
      console.log(
        `✅ Fixed ${result.modifiedCount} Python challenges`
      );
    }

    // Fix HTML course challenges  
    const htmlCourse = await Course.findOne({ 
      title: { $regex: /html/i } 
    });
    if (htmlCourse) {
      const result = await Challenge.updateMany(
        { courseId: htmlCourse._id },
        { $set: { language: 'html' } }
      );
      console.log(
        `✅ Fixed ${result.modifiedCount} HTML challenges`
      );
    }

    // Fix JavaScript course challenges
    const jsCourse = await Course.findOne({ 
      title: { $regex: /javascript/i } 
    });
    if (jsCourse) {
      const result = await Challenge.updateMany(
        { courseId: jsCourse._id },
        { $set: { language: 'javascript' } }
      );
      console.log(
        `✅ Fixed ${result.modifiedCount} JS challenges`
      );
    }

    console.log('🎉 All challenge languages fixed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fix();
