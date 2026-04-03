const express = require('express');
const vm = require('vm');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { executePython } = require('../utils/pythonExecutor');

const formatValue = (value) => {
  if (typeof value === 'string') return value;
  if (value instanceof Error) return value.message;
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

const runJavaScript = async (code) => {
  const logs = [];
  const sandboxConsole = {
    log: (...args) => logs.push(args.map(formatValue).join(' ')),
    error: (...args) => logs.push(args.map(formatValue).join(' ')),
    warn: (...args) => logs.push(args.map(formatValue).join(' ')),
  };

  const sandbox = {
    console: sandboxConsole,
    Math,
    Date,
    JSON,
    Number,
    String,
    Boolean,
    Array,
    Object,
    RegExp,
    parseFloat,
    parseInt,
    isNaN,
    isFinite,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
  };

  try {
    const script = new vm.Script(code, { timeout: 3000 });
    script.runInNewContext(sandbox, { timeout: 3000 });
    return {
      stdout: logs.join('\n') || '(no output)',
      stderr: '',
    };
  } catch (error) {
    return {
      stdout: logs.join('\n'),
      stderr: error.message || String(error),
    };
  }
};

router.post('/', protect, async (req, res) => {
  try {
    const { code = '', language = 'javascript' } = req.body || {};
    const normalizedLanguage = String(language).toLowerCase();

    if (normalizedLanguage === 'python') {
      const result = await executePython(code);
      return res.json({
        stdout: result.stdout || '',
        stderr: result.stderr || '',
      });
    }

    if (normalizedLanguage === 'html' || normalizedLanguage === 'html-css') {
      return res.json({
        stdout: 'HTML preview updated',
        stderr: '',
        previewHtml: code,
      });
    }

    const result = await runJavaScript(code);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      stdout: '',
      stderr: error.message || 'Code execution failed',
    });
  }
});

module.exports = router;
