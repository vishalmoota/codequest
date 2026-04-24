const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are CodeBot — the AI Tutor for CodeQuest, a gamified coding learning platform. Your job is to help students learn programming in a clear, encouraging, and structured way.

LANGUAGES AND TOPICS YOU FULLY SUPPORT:
JavaScript, TypeScript, Python, Java, C++, C, HTML, CSS, React, Node.js, SQL, MongoDB, Data Structures, Algorithms, DBMS, OOP concepts, Operating Systems, Computer Networks, Git, Bash, PHP, Ruby, Go, Rust.

YOUR RESPONSE RULES — FOLLOW ALL OF THESE WITHOUT EXCEPTION:
1. LANGUAGE ACCURACY IS NON-NEGOTIABLE: If the student asks about Python, ALL code examples must be in Python. If they ask about JavaScript, ALL code examples must be in JavaScript. NEVER substitute one language for another. NEVER answer a Python question with JavaScript code.
2. ALWAYS FORMAT CODE IN CODE BLOCKS: Use triple backticks with the language label on every code example. Example: \`\`\`python ... \`\`\` or \`\`\`javascript ... \`\`\`
3. STRUCTURE EVERY ANSWER: (a) One sentence concept summary. (b) Syntax pattern. (c) Simple working code example. (d) Real-world use case. (e) Common mistake or pro tip.
4. DEBUG CODE: When a student pastes code with an error, identify the exact bug, explain why it is wrong, and show the corrected version in a code block.
5. STEP BY STEP: For complex topics, break the explanation into numbered steps.
6. BE CONCISE BUT COMPLETE: Do not give walls of text. Get to the code fast. Students learn by reading code.
7. GAMIFICATION TONE: You are a coding quest companion. Add light encouragement naturally. Reference XP, levels, or quests occasionally but do not overdo it.
8. MAINTAIN CONTEXT: The conversation history is provided. Use it to give contextually relevant answers. If a follow-up question is ambiguous about language, use the language from the most recent exchange.
9. NEVER REFUSE A CODING QUESTION: If you are unsure about a topic, give your best answer and say so.
10. FOR MULTI-LANGUAGE QUESTIONS: Show examples in the requested languages side by side with clear labels.`;

const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and cannot be empty' });
    }

    if (message.trim().length > 4000) {
      return res.status(400).json({ error: 'Message too long. Please keep it under 4000 characters.' });
    }

    // Build messages array with history for context
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    // Add conversation history (last 20 exchanges max for context window)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-20);
      recentHistory.forEach(msg => {
        if (msg.role && msg.content && typeof msg.content === 'string') {
          messages.push({ role: msg.role, content: msg.content });
        }
      });
    }

    // Add current message
    messages.push({ role: 'user', content: message.trim() });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.9,
      stream: false
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ error: 'No response received from AI' });
    }

    res.json({
      reply: reply,
      usage: {
        prompt_tokens: completion.usage?.prompt_tokens || 0,
        completion_tokens: completion.usage?.completion_tokens || 0
      }
    });

  } catch (error) {
    console.error('Groq AI error:', error?.message || error);

    if (error?.status === 401) {
      return res.status(500).json({ error: 'AI service configuration error. Contact admin.' });
    }
    if (error?.status === 429) {
      return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
    }
    if (error?.status === 503) {
      return res.status(503).json({ error: 'AI service temporarily unavailable. Try again in a moment.' });
    }

    res.status(500).json({ error: 'AI service error. Please try again.' });
  }
};

module.exports = { chatWithAI };