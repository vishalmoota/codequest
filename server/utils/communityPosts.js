const Post = require('../models/Post');

const getRankFromXP = (xp = 0) => {
  if (xp >= 2000) return 'Diamond';
  if (xp >= 1000) return 'Platinum';
  if (xp >= 500) return 'Gold';
  if (xp >= 200) return 'Silver';
  return 'Bronze';
};

const getUserAvatar = (user) => {
  if (!user) return '🧑‍💻';
  const avatarMap = {
    explorer: '🧑‍💻',
    coder: '👨‍💻',
    wizard: '🧙‍♂️',
    knight: '⚔️',
    hacker: '🕵️',
    ninja: '🥷',
    robot: '🤖',
    dragon: '🐉',
  };

  return avatarMap[user.avatar?.character] || '🧑‍💻';
};

const normalizeTags = (tags = []) => Array.from(new Set(
  (Array.isArray(tags) ? tags : [])
    .map((tag) => String(tag || '').trim())
    .filter(Boolean)
));

const buildTutorialCompletionPost = ({ studentName, tutorial, levelCount = 0 }) => {
  const tutorialTitle = tutorial?.title || 'Project Tutorial';
  const hashtags = normalizeTags([
    ...(tutorial?.tags || []),
    'projecttutorialscompleted',
    'tutorialcomplete',
    'showcase',
  ]);

  const lines = [
    `${studentName} has completed ${tutorialTitle} and built the project by following every step.`,
    '',
    `Tutorial details: ${tutorial?.description || 'Completed project tutorial.'}`,
    `Language: ${tutorial?.language || 'mixed'}`,
    `Difficulty: ${tutorial?.difficulty || 'Beginner'}`,
    `Duration: ${tutorial?.duration || 'N/A'}`,
    `Levels/Steps finished: ${levelCount || tutorial?.steps?.length || 0}`,
    '',
    hashtags.map((tag) => `#${String(tag).replace(/\s+/g, '').toLowerCase()}`).join(' '),
  ];

  return {
    title: `${tutorialTitle} completed by ${studentName}`,
    body: lines.filter(Boolean).join('\n'),
    channel: 'project-tutorials-completed',
    type: 'showcase',
    tags: hashtags,
  };
};

const buildProjectBuiltPost = ({ studentName, project }) => {
  const title = project?.title || 'Custom Project';
  const hashtags = normalizeTags([
    project?.language,
    project?.title,
    'projectsbuilt',
    'buildinpublic',
    'showcase',
  ]);
  const outputSnippet = String(project?.lastOutput || '').trim().slice(0, 180);
  const codeSnippet = String(project?.code || '').trim().slice(0, 180);

  const lines = [
    `${studentName} successfully built and saved a custom project: ${title}.`,
    '',
    `Language: ${project?.language || 'javascript'}`,
    `Runs: ${project?.runCount || 1}`,
    outputSnippet ? `Latest output: ${outputSnippet}` : 'Latest output: (no console output)',
    codeSnippet ? `Snippet: ${codeSnippet}` : '',
    '',
    hashtags.map((tag) => `#${String(tag).replace(/\s+/g, '').toLowerCase()}`).join(' '),
  ];

  return {
    title: `${title} built by ${studentName}`,
    body: lines.filter(Boolean).join('\n'),
    channel: 'projects-built',
    type: 'showcase',
    tags: hashtags,
  };
};

const createCommunityPost = async ({ sourceType, sourceId, author, postData, sourceMeta = {} }) => {
  if (!sourceType || !sourceId || !author || !postData?.title || !postData?.body) {
    return null;
  }

  const existing = await Post.findOne({ sourceType, sourceId });
  if (existing) {
    return existing;
  }

  const post = await Post.create({
    ...postData,
    sourceType,
    sourceId,
    sourceMeta,
    author: author._id,
    authorName: author.username,
    authorAvatar: getUserAvatar(author),
    authorRank: getRankFromXP(author.xp || 0),
  });

  await post.populate('author', 'username xp avatar');
  return post;
};

module.exports = {
  createCommunityPost,
  buildTutorialCompletionPost,
  buildProjectBuiltPost,
};