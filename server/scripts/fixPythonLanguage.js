require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Challenge = require('../models/Challenge');

async function fixChallengeLangauges() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find Python course
    const pythonCourse = await Course.findOne({ 
      title: { $regex: /python/i } 
    });

    if (!pythonCourse) {
      console.log('Python course not found');
      process.exit(1);
    }

    console.log(`Found Python course: ${pythonCourse.title} (${pythonCourse._id})`);

    // Update all challenges in Python course to have language='python'
    const result = await Challenge.updateMany(
      { courseId: pythonCourse._id },
      { language: 'python' }
    );

    console.log(`Updated ${result.modifiedCount} challenges with language='python'`);

    // Also update challenges that don't have language set but belong to Python course
    const checkResult = await Challenge.countDocuments({
      courseId: pythonCourse._id,
      language: { $ne: 'python' }
    });

    console.log(`Remaining challenges without python language: ${checkResult}`);

    // Find and update any remaining ones
    const remaining = await Challenge.find({
      courseId: pythonCourse._id,
      language: { $ne: 'python' }
    });

    if (remaining.length > 0) {
      console.log('Remaining challenges:');
      remaining.forEach(ch => {
        console.log(`  - ${ch.title}: language=${ch.language}`);
      });
    }

    console.log('\nDone! All Python course challenges now have language="python"');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixChallengeLangauges();
