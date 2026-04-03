const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Safely execute Python code with timeout
 * @param {string} code - Python code to execute
 * @param {number} timeoutMs - Timeout in milliseconds (default 5000ms)
 * @returns {Promise<string>} - Output from the code
 */
const executePython = (code, timeoutMs = 5000) => {
  return new Promise((resolve, reject) => {
    const tempFile = path.join(os.tmpdir(), `py_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.py`);
    
    // Write code to temporary file
    try {
      fs.writeFileSync(tempFile, code, 'utf8');
    } catch (err) {
      return reject(new Error(`Failed to create temp file: ${err.message}`));
    }

    // Spawn Python process
    let output = '';
    let errorOutput = '';
    let processKilled = false;

    const python = spawn('python', [tempFile], {
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024 // 10MB max output
    });

    // Timeout handler
    const timeoutHandle = setTimeout(() => {
      processKilled = true;
      python.kill('SIGTERM');
      reject(new Error(`Python execution timed out (${timeoutMs}ms). Your code might have an infinite loop.`));
    }, timeoutMs);

    // Handle stdout
    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Handle stderr
    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Handle process exit
    python.on('close', (code) => {
      clearTimeout(timeoutHandle);
      
      // Clean up temp file
      try {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      } catch (err) {
        console.error(`Failed to clean up temp file: ${err.message}`);
      }

      if (processKilled) return; // Already rejected due to timeout

      if (code !== 0) {
        // Python script failed
        const errorMsg = errorOutput || output || 'Unknown error';
        reject(new Error(errorMsg.trim()));
      } else {
        resolve(output || '(no output)');
      }
    });

    // Handle errors
    python.on('error', (err) => {
      clearTimeout(timeoutHandle);
      
      // Clean up temp file
      try {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      } catch (cleanupErr) {
        console.error(`Failed to clean up temp file: ${cleanupErr.message}`);
      }
      
      reject(new Error(`Failed to execute Python: ${err.message}`));
    });
  });
};

/**
 * Run Python code with test cases
 * @param {string} userCode - User's Python function code
 * @param {string} functionName - Name of function to test
 * @param {Array} testCases - Array of {args: [], expected: ...}
 * @returns {Promise<Array>} - Array of test results
 */
const runPythonTests = async (userCode, functionName, testCases) => {
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    
    try {
      // Build Python test code
      const args = tc.args || [];
      const expected = tc.expected;

      // Serialize args to Python literals
      const argsStr = args.map(a => serializeToLiteral(a)).join(', ');
      const expectedStr = serializeToLiteral(expected);

      const testCode = `
${userCode}

# Test execution
try:
    _result = ${functionName}(${argsStr})
    _expected = ${expectedStr}
    
    if _result == _expected:
        print("PASS")
    else:
        print(f"FAIL: got {repr(_result)}, expected {repr(_expected)}")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
`;

      const output = await executePython(testCode, 5000);
      const passed = output.trim().startsWith('PASS');

      results.push({
        passed,
        description: tc.description || `Test ${i + 1}`,
        output: output.trim(),
      });
    } catch (err) {
      results.push({
        passed: false,
        description: tc.description || `Test ${i + 1}`,
        output: `Error: ${err.message}`,
      });
    }
  }

  return results;
};

/**
 * Convert JavaScript value to Python literal syntax
 */
const serializeToLiteral = (value) => {
  if (typeof value === 'string') return `"${value.replace(/"/g, '\\"')}"`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value === null) return 'None';
  if (Array.isArray(value)) {
    const items = value.map(item => {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        // Nested object
        return '{' + Object.entries(item).map(([k, v]) => {
          const key = `'${k}'`;
          const val = serializeToLiteral(v);
          return `${key}: ${val}`;
        }).join(', ') + '}';
      }
      return serializeToLiteral(item);
    }).join(', ');
    return `[${items}]`;
  }
  if (typeof value === 'object' && value !== null) {
    // Object / dictionary
    const items = Object.entries(value).map(([k, v]) => {
      const key = `'${k}'`;
      const val = serializeToLiteral(v);
      return `${key}: ${val}`;
    }).join(', ');
    return `{${items}}`;
  }
  return String(value);
};

module.exports = { executePython, runPythonTests, serializeToLiteral };
