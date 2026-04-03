import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ParticleEffect from '../components/ParticleEffect';
import BadgePopup from '../components/BadgePopup';
import {
  Swords, Timer, Zap, Trophy, ArrowLeft, Play, Send, CheckCircle2,
  XCircle, Loader2, Flame, Shield, Heart, Star, Users
} from 'lucide-react';

// Battle challenge problems (client-side for demo; ideally fetched from server)
const BATTLE_PROBLEMS = [
  {
    id: 'battle_1',
    title: 'Speed Sum',
    description: 'Write a function `speedSum(arr)` that returns the sum of all numbers in the array. Be fast!',
    starterCode: 'function speedSum(arr) {\n  // Your code here\n}',
    functionName: 'speedSum',
    testCases: [
      { args: [[1, 2, 3]], expected: 6 },
      { args: [[10, -5, 3]], expected: 8 },
      { args: [[]], expected: 0 },
    ],
    timeLimit: 120,
    xpReward: 50,
    difficulty: 'easy',
  },
  {
    id: 'battle_2',
    title: 'Reverse String',
    description: 'Write a function `reverseStr(s)` that returns the reversed version of the string.',
    starterCode: 'function reverseStr(s) {\n  // Your code here\n}',
    functionName: 'reverseStr',
    testCases: [
      { args: ['hello'], expected: 'olleh' },
      { args: ['CodeQuest'], expected: 'tseuQedoC' },
      { args: [''], expected: '' },
    ],
    timeLimit: 90,
    xpReward: 60,
    difficulty: 'easy',
  },
  {
    id: 'battle_3',
    title: 'Count Characters',
    description: 'Write a function `charCount(str)` that returns an object with character counts.\n\nExample: charCount("aab") → {a: 2, b: 1}',
    starterCode: 'function charCount(str) {\n  // Your code here\n}',
    functionName: 'charCount',
    testCases: [
      { args: ['aab'], expected: { a: 2, b: 1 } },
      { args: ['hello'], expected: { h: 1, e: 1, l: 2, o: 1 } },
      { args: [''], expected: {} },
    ],
    timeLimit: 150,
    xpReward: 80,
    difficulty: 'medium',
  },
  {
    id: 'battle_4',
    title: 'Find Unique',
    description: 'Write a function `findUnique(arr)` that returns the first non-repeating element.\n\nExample: findUnique([1,2,1,3,2]) → 3',
    starterCode: 'function findUnique(arr) {\n  // Your code here\n}',
    functionName: 'findUnique',
    testCases: [
      { args: [[1, 2, 1, 3, 2]], expected: 3 },
      { args: [[5, 5, 5, 8]], expected: 8 },
      { args: [[1]], expected: 1 },
    ],
    timeLimit: 120,
    xpReward: 70,
    difficulty: 'medium',
  },
];

// Simulated AI opponent
const AI_NAMES = ['CodeBot', 'ByteStorm', 'AlgoNinja', 'PixelMage', 'SyntaxSage'];
const AI_AVATARS = ['🤖', '⚡', '🥷', '🧙', '📜'];

const CodeBattlePage = () => {
  const { user, updateUser } = useAuth();
  const [phase, setPhase] = useState('lobby'); // lobby | countdown | battle | result
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [testResults, setTestResults] = useState(null);
  const [won, setWon] = useState(null);
  const [showParticles, setShowParticles] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiName] = useState(AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)]);
  const [aiAvatar] = useState(AI_AVATARS[Math.floor(Math.random() * AI_AVATARS.length)]);
  const [difficulty, setDifficulty] = useState('easy');
  const [badgePopup, setBadgePopup] = useState([]);
  const [xpEarnedServer, setXpEarnedServer] = useState(0);
  const timerRef = useRef(null);
  const aiTimerRef = useRef(null);

  const startBattle = () => {
    const filtered = BATTLE_PROBLEMS.filter(p => p.difficulty === difficulty);
    const selected = filtered[Math.floor(Math.random() * filtered.length)] || BATTLE_PROBLEMS[0];
    setProblem(selected);
    setCode(selected.starterCode);
    setTimeLeft(selected.timeLimit);
    setTestResults(null);
    setWon(null);
    setAiProgress(0);
    setPhase('countdown');
    setCountdown(3);
  };

  // Countdown phase
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) {
      setPhase('battle');
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Battle timer
  useEffect(() => {
    if (phase !== 'battle') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // Simulate AI progress
  useEffect(() => {
    if (phase !== 'battle') return;
    const aiSolveTime = problem ? (problem.timeLimit * (0.5 + Math.random() * 0.4)) : 60;
    const incrementInterval = 200;
    const totalIncrements = (aiSolveTime * 1000) / incrementInterval;
    let currentIncrement = 0;

    aiTimerRef.current = setInterval(() => {
      currentIncrement++;
      const progress = Math.min((currentIncrement / totalIncrements) * 100, 100);
      setAiProgress(progress);

      if (progress >= 100) {
        clearInterval(aiTimerRef.current);
      }
    }, incrementInterval);

    return () => clearInterval(aiTimerRef.current);
  }, [phase, problem]);

  const handleTimeUp = () => {
    setPhase('result');
    setWon(false);
  };

  const runUserCode = (userCode, functionName, testCases) => {
    const results = [];
    for (const tc of testCases) {
      try {
        const wrapped = new Function(`${userCode}\n return ${functionName}(...arguments);`);
        const args = Array.isArray(tc.args) ? tc.args : [tc.args];
        const actual = wrapped(...args);
        const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
        results.push({ passed, actual, expected: tc.expected });
      } catch (err) {
        results.push({ passed: false, error: err.message, expected: tc.expected });
      }
    }
    return results;
  };

  const handleSubmit = async () => {
    if (!problem) return;
    clearInterval(timerRef.current);
    clearInterval(aiTimerRef.current);

    const results = runUserCode(code, problem.functionName, problem.testCases);
    setTestResults(results);

    const allPassed = results.every(r => r.passed);
    const playerWon = allPassed && aiProgress < 100;

    setWon(allPassed ? (playerWon ? 'player' : 'tie') : 'ai');
    setPhase('result');

    if (allPassed) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 3000);

      // Award XP on server
      try {
        const res = await api.post('/gamification/battle-complete', {
          xpReward: problem.xpReward,
          won: playerWon,
        });
        if (res.data.success) {
          setXpEarnedServer(res.data.xpEarned);
          updateUser({ xp: res.data.totalXP, streak: res.data.streak });
          if (res.data.newBadges?.length > 0) {
            setBadgePopup(res.data.newBadges);
          }
        }
      } catch (err) {
        console.error('Failed to record battle XP:', err);
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'text-red-400 animate-pulse';
    if (timeLeft <= 30) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  // ========= LOBBY =========
  if (phase === 'lobby') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-2xl border border-red-500/20 mb-4">
              <Swords size={40} className="text-red-400" />
            </div>
            <h1 className="text-4xl font-black mb-2">
              <span className="gradient-text">Code Battle</span> Arena
            </h1>
            <p className="text-slate-400">Race against an AI opponent to solve coding challenges. The fastest coder wins!</p>
          </div>

          <div className="card mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Select Difficulty</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'easy', label: 'Easy', emoji: '🌿', color: 'emerald' },
                { id: 'medium', label: 'Medium', emoji: '🔥', color: 'yellow' },
                { id: 'hard', label: 'Hard', emoji: '💀', color: 'red' },
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-200 hover:scale-105
                    ${difficulty === d.id
                      ? `border-${d.color}-500/50 bg-${d.color}-500/10`
                      : 'border-dark-400 bg-dark-700 hover:border-dark-300'}`}
                >
                  <span className="text-2xl block mb-1">{d.emoji}</span>
                  <span className="text-sm font-semibold text-slate-200">{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Your Opponent</h3>
            <div className="flex items-center gap-4 p-4 bg-dark-600 rounded-xl">
              <span className="text-3xl">{aiAvatar}</span>
              <div>
                <span className="font-bold text-slate-100">{aiName}</span>
                <p className="text-xs text-slate-500">AI Challenger • Adapts to difficulty</p>
              </div>
              <Shield size={20} className="ml-auto text-red-400" />
            </div>
          </div>

          <button
            onClick={startBattle}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500
              text-white font-black text-lg rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95
              shadow-xl shadow-red-600/30 flex items-center justify-center gap-3"
          >
            <Swords size={22} />
            Enter Battle Arena
          </button>

          <Link to="/dashboard" className="block text-center mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft size={14} className="inline mr-1" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ========= COUNTDOWN =========
  if (phase === 'countdown') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-bounce-in">
          <div className="text-8xl font-black text-primary-400 mb-4"
            style={{ textShadow: '0 0 40px rgba(99,102,241,0.5)' }}>
            {countdown || 'GO!'}
          </div>
          <p className="text-slate-400 text-lg">Get ready to code!</p>
        </div>
      </div>
    );
  }

  // ========= BATTLE =========
  if (phase === 'battle' && problem) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Battle header */}
        <div className="flex items-center justify-between px-4 py-2 bg-dark-800 border-b border-red-500/20">
          <div className="flex items-center gap-3">
            <Swords size={16} className="text-red-400" />
            <span className="text-sm font-bold text-red-300">BATTLE MODE</span>
            <span className="text-slate-500">|</span>
            <span className="text-sm text-slate-400">{problem.title}</span>
          </div>

          <div className={`flex items-center gap-2 font-mono font-bold text-xl ${getTimerColor()}`}>
            <Timer size={18} />
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-yellow-400 font-semibold">
              <Zap size={14} className="inline" /> {problem.xpReward} XP
            </span>
          </div>
        </div>

        {/* AI progress bar */}
        <div className="px-4 py-2 bg-dark-800/50 border-b border-dark-400/30">
          <div className="flex items-center gap-3">
            <span className="text-sm">{aiAvatar}</span>
            <span className="text-xs text-slate-400">{aiName}</span>
            <div className="flex-1 h-2 bg-dark-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-200"
                style={{ width: `${aiProgress}%` }}
              />
            </div>
            <span className="text-xs text-slate-500">{Math.round(aiProgress)}%</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Problem panel */}
          <div className="w-2/5 overflow-y-auto p-6 border-r border-dark-400/30">
            <h2 className="text-xl font-bold mb-3">{problem.title}</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap mb-4">{problem.description}</p>

            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Test Cases</h3>
            <div className="space-y-2">
              {problem.testCases.map((tc, i) => (
                <div key={i} className={`p-3 rounded-xl text-xs font-mono border
                  ${testResults?.[i]?.passed === true ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : testResults?.[i]?.passed === false ? 'bg-red-500/10 border-red-500/30 text-red-300'
                    : 'bg-dark-700 border-dark-400 text-slate-400'}`}>
                  Input: {JSON.stringify(tc.args)} → Expected: {JSON.stringify(tc.expected)}
                  {testResults?.[i] && !testResults[i].passed && (
                    <div className="mt-1 text-red-400">Got: {JSON.stringify(testResults[i].actual)}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Editor panel */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <Editor
                height="100%"
                language="javascript"
                value={code}
                onChange={val => setCode(val)}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "'Fira Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                  tabSize: 2,
                  automaticLayout: true,
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-dark-400/50 bg-dark-800/50">
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 
                  hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all hover:scale-105"
              >
                <Send size={16} />
                Submit Solution
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========= RESULT =========
  if (phase === 'result') {
    const allPassed = testResults?.every(r => r.passed);
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <ParticleEffect active={showParticles} type={won === 'player' ? 'confetti' : 'stars'} />
        <div className="max-w-md w-full text-center animate-bounce-in">
          <div className="mb-6">
            {won === 'player' ? (
              <>
                <div className="text-7xl mb-4">🏆</div>
                <h1 className="text-4xl font-black text-yellow-400 mb-2">Victory!</h1>
                <p className="text-slate-400">You defeated {aiName}! Lightning fast coding! ⚡</p>
              </>
            ) : won === 'tie' ? (
              <>
                <div className="text-7xl mb-4">🤝</div>
                <h1 className="text-4xl font-black text-blue-400 mb-2">Tie!</h1>
                <p className="text-slate-400">Both solved it! Great coding from both sides.</p>
              </>
            ) : (
              <>
                <div className="text-7xl mb-4">{allPassed === false ? '💔' : '⏱️'}</div>
                <h1 className="text-4xl font-black text-red-400 mb-2">
                  {allPassed === false ? 'Not Quite!' : 'Time\'s Up!'}
                </h1>
                <p className="text-slate-400">
                  {allPassed === false ? 'Some tests failed. Practice makes perfect!' : `${aiName} was faster this time. Try again!`}
                </p>
              </>
            )}
          </div>

          {allPassed && (
            <div className="card mb-6 text-left">
              <div className="flex items-center gap-2 text-yellow-400 font-bold mb-1">
                <Zap size={16} />
                +{xpEarnedServer || problem?.xpReward || 0} XP Earned
              </div>
              <p className="text-xs text-slate-500">
                Time taken: {formatTime((problem?.timeLimit || 0) - timeLeft)}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setPhase('lobby'); setXpEarnedServer(0); }}
              className="flex-1 py-3 bg-dark-600 hover:bg-dark-500 text-slate-200 font-semibold rounded-xl transition-all"
            >
              New Battle
            </button>
            <Link
              to="/dashboard"
              className="flex-1 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all text-center"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <BadgePopup badges={badgePopup} onClose={() => setBadgePopup([])} />
      </div>
    );
  }

  return null;
};

export default CodeBattlePage;
