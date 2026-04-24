const express = require('express');

const router = express.Router();

const LOCAL_MODEL = process.env.LOCAL_CHAT_MODEL || 'llama3.2';
const LOCAL_CHAT_URL = process.env.LOCAL_CHAT_URL || 'http://127.0.0.1:11434/api/chat';

router.post('/chat', async (req, res) => {
  const { messages, detectedLanguage } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const response = await fetch(LOCAL_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: LOCAL_MODEL,
        stream: false,
        messages: [
          {
            role: 'system',
            content: `You are CodeBot, an expert coding tutor for CodeQuest - a gamified coding learning platform for students learning to code.

The student appears to be asking about: ${detectedLanguage || 'programming in general'}.

YOUR CORE RULES - FOLLOW EVERY ONE:
1. LANGUAGE ACCURACY IS MANDATORY: If the student asks about Python, answer with Python syntax and Python examples ONLY. If they ask about JavaScript, use JavaScript ONLY. NEVER mix languages. NEVER answer a Python question with JavaScript code.
2. DETECT LANGUAGE FROM QUESTION: Read the question carefully. Identify the programming language. Answer in that exact language.
3. ALWAYS INCLUDE CODE EXAMPLES: For any syntax or concept question, show working code in the correct language inside a code block using triple backticks with the language label.
4. STRUCTURE YOUR ANSWERS: (a) Brief concept explanation in 1-2 sentences. (b) Syntax pattern. (c) Simple working example. (d) One real-world use case. (e) A tip or common mistake to avoid.
5. SUPPORT ALL LANGUAGES: You are fluent in JavaScript, Python, HTML, CSS, React, TypeScript, Node.js, SQL, Java, C++, C, Bash, PHP, Ruby, Go, Rust, and any other language a student asks about.
6. BE ENCOURAGING: Students are on a coding quest. Add motivational touches naturally. Keep responses clear and student-friendly.
7. FORMAT CODE PROPERLY: Always wrap code in triple backtick code blocks with the language identifier like \`\`\`python or \`\`\`javascript.
8. IF LANGUAGE IS UNCLEAR: Answer in the most likely language based on context, then ask at the end "Are you working in Python or JavaScript? I can show you both!"
9. NEVER REFUSE A CODING QUESTION. NEVER say you cannot help with a specific language.
10. For conceptual questions with no specific language, use pseudocode or explain in plain English with examples in multiple languages if helpful.`,
          },
          ...messages.slice(-20).map((message) => ({
            role: message.role === 'assistant' ? 'assistant' : 'user',
            content: message.content,
          })),
        ],
        options: {
          temperature: 0.4,
          num_predict: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Local model error:', response.status, errText);
      return res.json({
        reply: generateFallbackResponse(messages[messages.length - 1]?.content || '', detectedLanguage),
      });
    }

    const data = await response.json();
    const reply = typeof data?.message?.content === 'string'
      ? data.message.content
      : typeof data?.response === 'string'
        ? data.response
        : '';

    if (!reply.trim()) {
      return res.json({
        reply: generateFallbackResponse(messages[messages.length - 1]?.content || '', detectedLanguage),
      });
    }

    return res.json({ reply });
  } catch (error) {
    console.error('Chatbot route error:', error);
    const fallback = generateFallbackResponse(messages[messages.length - 1]?.content || '', detectedLanguage);
    return res.json({ reply: fallback });
  }
});

function generateFallbackResponse(question, language) {
  const q = question.toLowerCase();
  const lang = (language || '').toLowerCase();

  let targetLang = lang;
  if (q.includes('python') || lang === 'python') targetLang = 'python';
  else if (q.includes('javascript') || q.includes(' js ') || lang === 'javascript') targetLang = 'javascript';
  else if (q.includes('html') || lang === 'html') targetLang = 'html';
  else if (q.includes('css') || lang === 'css') targetLang = 'css';
  else if (q.includes('react') || lang === 'react') targetLang = 'react';

  if (q.includes('loop') || q.includes('for') || q.includes('while') || q.includes('iterate')) {
    if (targetLang === 'python') return `Great question! Here are loops in **Python** 🐍\n\n**For loop:**\n\`\`\`python\n# Loop through a range\nfor i in range(5):\n    print(i)  # prints 0,1,2,3,4\n\n# Loop through a list\nfruits = ['apple', 'banana', 'cherry']\nfor fruit in fruits:\n    print(fruit)\n\n# Loop with index\nfor index, fruit in enumerate(fruits):\n    print(f"{index}: {fruit}")\n\`\`\`\n\n**While loop:**\n\`\`\`python\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1\n\`\`\`\n\n**Pro tip:** Python's \`for\` loop directly iterates over items - no index needed unless you use \`enumerate()\`! ⚡\n\nKeep going - loops are a core XP skill in your coding quest! 🎯`;
    if (targetLang === 'javascript') return `Great question! Here are loops in **JavaScript** ⚡\n\n**For loop:**\n\`\`\`javascript\n// Classic for loop\nfor (let i = 0; i < 5; i++) {\n  console.log(i); // prints 0,1,2,3,4\n}\n\n// For...of (arrays)\nconst fruits = ['apple', 'banana', 'cherry'];\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n\n// forEach method\nfruits.forEach((fruit, index) => {\n  console.log(\`${index}: ${fruit}\`);\n});\n\`\`\`\n\n**While loop:**\n\`\`\`javascript\nlet count = 0;\nwhile (count < 5) {\n  console.log(count);\n  count++;\n}\n\`\`\`\n\nMaster loops and unlock the Arrays & Iteration quest! 🏆`;
    return `Here are loops in multiple languages:\n\n**Python 🐍**\n\`\`\`python\nfor i in range(5):\n    print(i)\n\`\`\`\n\n**JavaScript ⚡**\n\`\`\`javascript\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n\`\`\`\n\nWhich language are you working with? I'll give you a deeper dive! 🎯`;
  }

  if (q.includes('variable') || q.includes('var') || q.includes('declare') || q.includes('const') || q.includes('let')) {
    if (targetLang === 'python') return `**Variables in Python 🐍**\n\n\`\`\`python\n# Python uses dynamic typing - no type declaration needed\nname = "CodeWarrior"      # string\nxp = 1500                 # integer\nleveled_up = True         # boolean\nratio = 98.5              # float\n\n# Multiple assignment\na, b, c = 1, 2, 3\n\n# Constants (by convention, ALL_CAPS)\nMAX_LEVEL = 100\n\`\`\`\n\n**Key difference from JS:** No \`let\`, \`const\`, or \`var\` - just assign directly! ⚡`;
    if (targetLang === 'javascript') return `**Variables in JavaScript ⚡**\n\n\`\`\`javascript\n// Modern JS - use const and let\nconst playerName = "CodeWarrior"; // cannot reassign\nlet xp = 1500;                    // can reassign\nlet leveledUp = true;\n\n// Update a let variable\nxp += 500;\nconsole.log(xp); // 2000\n\n// Avoid var in modern code (function-scoped, hoisted)\n// var oldWay = "avoid this";\n\`\`\`\n\n**Rule of thumb:** Use \`const\` by default, \`let\` when you need to reassign. Never use \`var\`. 🏆`;
    return `**Variables - Python vs JavaScript:**\n\n\`\`\`python\n# Python\nname = "Warrior"\nxp = 1500\n\`\`\`\n\n\`\`\`javascript\n// JavaScript\nconst name = "Warrior";\nlet xp = 1500;\n\`\`\`\n\nWhich language are you studying? 🎯`;
  }

  if (q.includes('function') || q.includes('def ') || q.includes('method') || q.includes('arrow')) {
    if (targetLang === 'python') return `**Functions in Python 🐍**\n\n\`\`\`python\n# Define a function\ndef greet(name):\n    return f"Welcome, {name}! Your quest begins!"\n\n# Call it\nmessage = greet("CodeWarrior")\nprint(message)\n\n# Default parameters\ndef level_up(player, amount=100):\n    return player + amount\n\n# Multiple return values\ndef get_stats():\n    return 1500, 12, "Forge Knight"\n\nxp, streak, rank = get_stats()\n\`\`\`\n\nFunctions are your reusable weapons in the coding arsenal! ⚔️`;
    if (targetLang === 'javascript') return `**Functions in JavaScript ⚡**\n\n\`\`\`javascript\n// Function declaration\nfunction greet(name) {\n  return \`Welcome, ${name}! Your quest begins!\`;\n}\n\n// Arrow function (modern)\nconst levelUp = (xp, amount = 100) => xp + amount;\n\n// Async function\nconst fetchQuest = async (id) => {\n  const res = await fetch(\`/api/quests/${id}\`);\n  return res.json();\n};\n\n// Call them\nconsole.log(greet("CodeWarrior"));\nconsole.log(levelUp(1500)); // 1600\n\`\`\`\n\nArrow functions are the modern warrior's weapon of choice! ⚔️`;
  }

  return `I'm CodeBot, your coding quest companion! 🤖⚡\n\nI can help you with:\n- **Python** 🐍 - syntax, OOP, data structures, libraries\n- **JavaScript** ⚡ - ES6+, async/await, DOM, Node.js\n- **HTML** 🌐 - structure, semantic tags, forms\n- **CSS** 🎨 - styling, flexbox, grid, animations\n- **React** ⚛️ - components, hooks, state management\n- **TypeScript**, **SQL**, **Java**, **C++**, and more!\n\nTry asking:\n- "How do Python list comprehensions work?"\n- "Explain JavaScript promises"\n- "What is CSS flexbox?"\n\nWhat coding challenge are you facing today? 🎯`;
}

module.exports = router;