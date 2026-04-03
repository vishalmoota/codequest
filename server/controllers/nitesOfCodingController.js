const User = require('../models/User');
const NitesOfCodingProgress = require('../models/NitesOfCodingProgress');
const CHALLENGES = require('../data/nitesOfCodingChallenges');

const TOTAL_CHALLENGES = CHALLENGES.length;

const getStartOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const getChallengeByDay = (day) => CHALLENGES.find((item) => item.day === day);

const hasCompletedDay = (progress, day) => progress.completedDays?.some((item) => item.day === day);

const getCompletedCount = (progress) => progress.completedDays?.length || 0;

const getAvailableDay = (progress) => {
  const startedAt = getStartOfDay(progress.startedAt || new Date());
  const today = getStartOfDay(new Date());
  const daysSinceStart = Math.max(1, Math.floor((today - startedAt) / 86400000) + 1);
  const sequentialUnlock = getCompletedCount(progress) + 1;
  return Math.min(TOTAL_CHALLENGES, Math.max(1, Math.min(daysSinceStart, sequentialUnlock)));
};

const ensureProgress = async (userId) => {
  let progress = await NitesOfCodingProgress.findOne({ userId });
  if (!progress) {
    progress = await NitesOfCodingProgress.create({
      userId,
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      currentUnlockedDay: 1,
      lastAccessedDay: 1,
      lastCompletedDay: 0,
      completedDays: [],
    });
  }

  const currentUnlockedDay = getAvailableDay(progress);
  progress.currentUnlockedDay = currentUnlockedDay;
  progress.lastAccessedAt = new Date();
  await progress.save();
  return progress;
};

const toSummary = (challenge, progress) => {
  const completed = hasCompletedDay(progress, challenge.day);
  const availableDay = progress.currentUnlockedDay || 1;
  const unlocked = challenge.day <= availableDay || completed;

  return {
    day: challenge.day,
    title: challenge.title,
    topic: challenge.topic,
    difficulty: challenge.difficulty,
    xpReward: challenge.xpReward,
    description: challenge.description,
    unlocked,
    completed,
    locked: !unlocked,
  };
};

const runJavaScriptTests = (code, functionName, testCases) => {
  const results = [];
  for (const testCase of testCases) {
    try {
      const wrapped = new Function(`${code}\nreturn ${functionName}(...arguments);`);
      const args = Array.isArray(testCase.args) ? testCase.args : [testCase.args];
      const actual = wrapped(...args);
      const passed = JSON.stringify(actual) === JSON.stringify(testCase.expected);
      results.push({
        passed,
        description: testCase.description || '',
        actual,
        expected: testCase.expected,
      });
    } catch (error) {
      results.push({
        passed: false,
        description: testCase.description || '',
        error: error.message,
        expected: testCase.expected,
      });
    }
  }
  return results;
};

const getChallengeOverview = async (req, res) => {
  try {
    const progress = await ensureProgress(req.user._id);
    const availableDay = progress.currentUnlockedDay || 1;
    const completedDays = progress.completedDays || [];

    res.json({
      totalChallenges: TOTAL_CHALLENGES,
      startedAt: progress.startedAt,
      currentUnlockedDay: availableDay,
      lastAccessedDay: progress.lastAccessedDay,
      completedCount: completedDays.length,
      completedDays: completedDays.map((item) => item.day),
      challenges: CHALLENGES.map((challenge) => toSummary(challenge, progress)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChallenge = async (req, res) => {
  try {
    const day = Number(req.params.day);
    if (!Number.isInteger(day) || day < 1 || day > TOTAL_CHALLENGES) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const progress = await ensureProgress(req.user._id);
    const challenge = getChallengeByDay(day);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const completed = hasCompletedDay(progress, day);
    const unlocked = day <= (progress.currentUnlockedDay || 1) || completed;
    if (!unlocked) {
      return res.status(403).json({
        message: 'This challenge is still locked. Complete the available challenge and come back tomorrow.',
        currentUnlockedDay: progress.currentUnlockedDay || 1,
      });
    }

    progress.lastAccessedDay = day;
    progress.lastAccessedAt = new Date();
    await progress.save();

    res.json({
      ...challenge,
      completed,
      unlocked,
      currentUnlockedDay: progress.currentUnlockedDay || 1,
      completedCount: getCompletedCount(progress),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitChallenge = async (req, res) => {
  try {
    const day = Number(req.params.day);
    const { code } = req.body;

    if (!Number.isInteger(day) || day < 1 || day > TOTAL_CHALLENGES) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({ message: 'Please write your solution first.' });
    }

    const challenge = getChallengeByDay(day);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const progress = await ensureProgress(req.user._id);
    const alreadyCompleted = hasCompletedDay(progress, day);
    const unlocked = day <= (progress.currentUnlockedDay || 1) || alreadyCompleted;

    if (!unlocked) {
      return res.status(403).json({
        success: false,
        message: 'This challenge is still locked. Complete the current day first.',
      });
    }

    const testResults = runJavaScriptTests(code, challenge.functionName, challenge.testCases);
    const allPassed = testResults.every((result) => result.passed);

    if (!allPassed) {
      return res.json({
        success: false,
        allPassed: false,
        testResults,
        message: 'Some test cases failed. Review the hints and try again.',
        hints: challenge.hints || [],
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let xpEarned = 0;
    if (!alreadyCompleted) {
      xpEarned = challenge.xpReward || 0;
      user.xp += xpEarned;
      progress.completedDays.push({
        day,
        completedAt: new Date(),
        xpAwarded: xpEarned,
      });
      progress.lastCompletedDay = Math.max(progress.lastCompletedDay || 0, day);
      progress.lastAccessedDay = day;
      progress.lastAccessedAt = new Date();
      progress.currentUnlockedDay = getAvailableDay(progress);
      await progress.save();
      await user.save();
    } else {
      progress.lastAccessedDay = day;
      progress.lastAccessedAt = new Date();
      progress.currentUnlockedDay = getAvailableDay(progress);
      await progress.save();
    }

    res.json({
      success: true,
      allPassed: true,
      alreadyCompleted,
      xpEarned,
      totalXP: user.xp,
      currentUnlockedDay: progress.currentUnlockedDay || 1,
      completedCount: getCompletedCount(progress),
      testResults,
      message: alreadyCompleted ? 'Challenge already completed earlier. No XP awarded.' : `Challenge complete! +${xpEarned} XP`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChallengeOverview,
  getChallenge,
  submitChallenge,
};
