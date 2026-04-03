import React from 'react';
import Editor from '@monaco-editor/react';

/**
 * CodeEditor — Pure Monaco editor component
 * Props:
 *   code: string          — controlled code value
 *   onChange: fn          — callback when code changes
 *   language: string      — 'javascript' | 'html' | 'python'
 */
const CodeEditor = ({ code, onChange, language = 'javascript' }) => {
  const getLang = (lang) => {
    const map = {
      javascript: 'javascript',
      js: 'javascript',
      html: 'html',
      python: 'python',
    };
    return map[lang?.toLowerCase()] || 'javascript';
  };

  const monacoLang = getLang(language);

  return (
    <Editor
      height="100%"
      language={monacoLang}
      value={code}
      onChange={(val) => onChange(val || '')}
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
        overviewRulerLanes: 0,
        overviewRulerBorder: false,
      }}
    />
  );
};

export default CodeEditor;
