import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { CheckCircle2, ChevronRight, Clock3, Code2, Lock, Play, RotateCcw, Send, Sparkles, Terminal, Trophy, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const TOTAL_DAYS = 30;

const deepEqual = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const runJavaScriptTests = (code, functionName, testCases) => {
  const results = [];

  for (const testCase of testCases) {
    try {
      const wrapped = new Function(`${code}\nreturn ${functionName}(...arguments);`);
      const args = Array.isArray(testCase.args) ? testCase.args : [testCase.args];
      const actual = wrapped(...args);
      const passed = deepEqual(actual, testCase.expected);
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

const formatValue = (value) => JSON.stringify(value, null, 2);

const ThirtyNitesOfCodingPage = () => {
  const { day } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const challengeSectionRef = useRef(null);

  const [overview, setOverview] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingChallenge, setLoadingChallenge] = useState(false);
  const [code, setCode] = useState('');
  const [terminalMessage, setTerminalMessage] = useState('Select today\'s unlocked challenge to begin.');
  const [liveResults, setLiveResults] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [lockMessage, setLockMessage] = useState('');
  const [selectionNote, setSelectionNote] = useState('');
  const [successModal, setSuccessModal] = useState(null);

  const selectedSummary = useMemo(() => {
    if (!overview || !selectedDay) return null;
    return overview.challenges.find((item) => item.day === selectedDay) || null;
  }, [overview, selectedDay]);

  const currentUnlockDay = overview?.currentUnlockedDay || 1;
  
  // Remove stray popup JSX from the hook area
  
  const completedDays = overview?.completedDays || [];

  const loadOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const response = await api.get('/nites-of-coding');
      setOverview(response.data);

      const initialDay = Number(day) || response.data.currentUnlockedDay || 1;
      const validDay = Math.min(TOTAL_DAYS, Math.max(1, initialDay));
      setSelectedDay(validDay);
    } catch (error) {
      setLockMessage(error.response?.data?.message || 'Unable to load 30 Nights of Coding right now.');
    } finally {
      setLoadingOverview(false);
    }
  }, [day]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    if (!selectedDay) return;
    navigate(`/30nitesofcoding/${selectedDay}`, { replace: true });
  }, [navigate, selectedDay]);

  useEffect(() => {
    if (!selectedDay || !overview) return;

    const summary = overview.challenges.find((item) => item.day === selectedDay);
    if (!summary) return;

    if (!summary.unlocked && !summary.completed) {
      setChallenge(null);
      setCode('');
      setLiveResults([]);
      setTerminalMessage('This day is still locked. Complete the current challenge and return tomorrow.');
      return;
    }

    let active = true;
    const fetchChallenge = async () => {
      setLoadingChallenge(true);
      setSubmitMessage('');
      setLockMessage('');
      setSelectionNote('');

      try {
        const response = await api.get(`/nites-of-coding/${selectedDay}`);
        if (!active) return;
        setChallenge(response.data);
        setCode((currentCode) => currentCode || response.data.starterCode || '');
        setTerminalMessage('Write your solution. Tests will run automatically as you type.');
      } catch (error) {
        if (!active) return;
        if (error.response?.status === 403) {
          setChallenge(null);
          setCode('');
          setLiveResults([]);
          setTerminalMessage(error.response?.data?.message || 'This challenge is locked.');
          setLockMessage(error.response?.data?.message || 'This challenge is locked.');
        } else {
          setChallenge(null);
          setTerminalMessage(error.response?.data?.message || 'Unable to load challenge.');
        }
      } finally {
        if (active) setLoadingChallenge(false);
      }
    };

    fetchChallenge();
    return () => {
      active = false;
    };
  }, [overview, selectedDay]);

  const evaluateCode = useCallback((source) => {
    if (!challenge) return;

    if (!source.trim()) {
      setLiveResults([]);
      setTerminalMessage('Start typing your solution to run the tests.');
      return;
    }

    const results = runJavaScriptTests(source, challenge.functionName, challenge.testCases || []);
    setLiveResults(results);

    const syntaxOrRuntimeError = results.find((item) => item.error);
    if (syntaxOrRuntimeError) {
      const hint = challenge.hints?.[0] ? `Hint: ${challenge.hints[0]}` : 'Hint: check the function signature and brackets first.';
      setTerminalMessage(`Error: ${syntaxOrRuntimeError.error}\n${hint}`);
      return;
    }

    const passedCount = results.filter((item) => item.passed).length;
    const total = results.length;
    if (passedCount === total && total > 0) {
      setTerminalMessage(`All tests passed. ${passedCount}/${total} test cases are green.`);
    } else {
      const hint = challenge.hints?.[0] ? `Hint: ${challenge.hints[0]}` : 'Hint: review the failing example and adjust your logic.';
      setTerminalMessage(`${passedCount}/${total} test cases passed.\n${hint}`);
    }
  }, [challenge]);

  useEffect(() => {
    if (!challenge) return undefined;
    const timer = window.setTimeout(() => evaluateCode(code), 450);
    return () => window.clearTimeout(timer);
  }, [code, challenge, evaluateCode]);

  const handleSelectDay = (dayNumber) => {
    const summary = overview?.challenges.find((item) => item.day === dayNumber);
    if (!summary) return;

    if (!summary.unlocked && !summary.completed) {
      setSelectionNote('That day is locked. Finish the current challenge and come back tomorrow.');
      setLockMessage('That day is locked. Finish the current challenge and come back tomorrow.');
      return;
    }

    setSelectionNote('');
    setSelectedDay(dayNumber);
    navigate(`/30nitesofcoding/${dayNumber}`);
    window.setTimeout(() => {
      challengeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleRun = () => {
    evaluateCode(code);
  };

  const handleReset = () => {
    if (!challenge) return;
    setCode(challenge.starterCode || '');
    setTerminalMessage('Starter code restored.');
    setLiveResults([]);
    setSubmitMessage('');
  };

  const handleSubmit = async () => {
    if (!challenge) return;
    if (!code.trim()) {
      setSubmitMessage('Write a solution before submitting.');
      return;
    }

    if (liveResults.length > 0 && liveResults.some((item) => item.error || !item.passed)) {
      setSubmitMessage('Fix the failing tests before submitting for XP.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await api.post(`/nites-of-coding/${selectedDay}/submit`, { code });
      const data = response.data;
      if (data.success) {
        if (typeof data.totalXP === 'number') {
          updateUser({ xp: data.totalXP });
        }

        setSubmitMessage('');
        setTerminalMessage(data.message || 'Submission complete.');
        setChallenge((current) => current ? { ...current, completed: true } : current);
        setOverview((current) => {
          if (!current) return current;
          return {
            ...current,
            currentUnlockedDay: data.currentUnlockedDay || current.currentUnlockedDay,
            completedCount: data.completedCount ?? current.completedCount,
            completedDays: current.completedDays.includes(selectedDay)
              ? current.completedDays
              : [...current.completedDays, selectedDay],
            challenges: current.challenges.map((item) => {
              if (item.day === selectedDay) {
                return { ...item, completed: true, unlocked: true, locked: false };
              }
              if (item.day === data.currentUnlockedDay) {
                return { ...item, unlocked: true, locked: false };
              }
              return item;
            }),
          };
        });

        setSuccessModal({
          title: challenge?.title || selectedSummary?.title || `Day ${selectedDay}`,
          xpEarned: data.alreadyCompleted ? 0 : (data.xpEarned || challenge?.xpReward || 0),
          alreadyCompleted: !!data.alreadyCompleted,
        });
      } else {
        setSubmitMessage(data.message || 'Submission complete.');
        setTerminalMessage(data.message || 'Submission complete.');
      }
    } catch (error) {
      setSubmitMessage(error.response?.data?.message || 'Submission failed.');
      setTerminalMessage(error.response?.data?.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTestResult = (result, index) => {
    if (result.error) {
      return (
        <div key={index} className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-300">
          <div className="font-semibold">Test {index + 1}: Error</div>
          <div className="mt-1 whitespace-pre-wrap text-red-200/90">{result.error}</div>
        </div>
      );
    }

    return (
      <div key={index} className={`rounded-xl border px-3 py-2 text-xs ${result.passed ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300' : 'border-red-500/20 bg-red-500/5 text-red-300'}`}>
        <div className="font-semibold">Test {index + 1}: {result.description || 'Test case'}</div>
        <div className="mt-1 text-[11px] text-slate-400">
          Expected: {formatValue(result.expected)}
          {!result.passed && <span className="block">Actual: {formatValue(result.actual)}</span>}
        </div>
      </div>
    );
  };

  const selectedProgressLabel = challenge?.completed
    ? 'Completed'
    : selectedSummary?.unlocked
      ? `Day ${selectedDay} unlocked`
      : 'Locked';

  const readyToSolve = !!challenge;
  const passedCount = liveResults.filter((item) => item.passed).length;
  const totalTests = liveResults.length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-gray-900 to-gray-950 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
              <Sparkles size={12} /> #30nitesofcoding
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gray-300">
              <Clock3 size={12} /> One challenge per day
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
              <Trophy size={12} /> XP awarded once
            </span>
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">30 Days of JavaScript DSA</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400 md:text-base">
            Solve one problem each day, unlock the next one tomorrow, and keep your XP locked to a single award per challenge.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-400">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Started</div>
              <div className="mt-1 font-bold text-white">{overview?.startedAt ? new Date(overview.startedAt).toLocaleDateString() : 'Today'}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Unlocked</div>
              <div className="mt-1 font-bold text-white">Day {currentUnlockDay}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Completed</div>
              <div className="mt-1 font-bold text-white">{completedDays.length} / {TOTAL_DAYS}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">XP</div>
              <div className="mt-1 font-bold text-white">{user?.xp || 0}</div>
            </div>
          </div>
          {selectionNote && <p className="mt-4 text-sm text-amber-300">{selectionNote}</p>}
          {lockMessage && !readyToSolve && <p className="mt-4 text-sm text-red-300">{lockMessage}</p>}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Challenge Roadmap</h2>
              <p className="text-sm text-gray-500">Click the current unlocked day to open the split-screen editor.</p>
            </div>
            <div className="text-sm text-gray-400">
              {currentUnlockDay}/{TOTAL_DAYS} available
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {overview?.challenges?.map((item) => {
              const active = item.day === selectedDay;
              return (
                <button
                  key={item.day}
                  onClick={() => handleSelectDay(item.day)}
                  className={`rounded-2xl border p-4 text-left transition ${active ? 'border-violet-400/40 bg-violet-500/15 shadow-lg shadow-violet-500/10' : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'} ${item.locked && !item.completed ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Day {item.day}</div>
                      <div className="mt-1 text-sm font-bold text-white">{item.title}</div>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/20 text-xs text-gray-200">
                      {item.locked && !item.completed ? <Lock size={14} /> : <ChevronRight size={14} />}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-400">
                    <span className={`rounded-full px-2 py-0.5 font-bold ${item.completed ? 'bg-emerald-500/15 text-emerald-300' : item.locked ? 'bg-white/5 text-gray-500' : 'bg-violet-500/15 text-violet-200'}`}>
                      {item.completed ? 'Completed' : item.locked ? 'Locked' : 'Unlocked'}
                    </span>
                    <span>{item.topic}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {!loadingOverview && selectedSummary && selectedSummary.locked && !selectedSummary.completed && !challenge && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-gray-400">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl text-amber-300">
              <Lock size={24} />
            </div>
            <h3 className="mt-4 text-xl font-black text-white">This challenge is locked</h3>
            <p className="mt-2 text-sm leading-relaxed">Complete the currently available day first. The next one unlocks tomorrow after the previous day is finished.</p>
          </div>
        )}

        <div ref={challengeSectionRef} className="relative">
          {successModal && challenge && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/55 px-4">
              <div className="w-full max-w-md rounded-3xl border border-emerald-500/30 bg-gray-900 p-8 text-center shadow-2xl">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-3xl text-emerald-300">
                  ✓
                </div>
                <h2 className="text-2xl font-black text-white">Solution Submitted</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  {successModal.title} was submitted correctly.
                </p>
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-500">XP Earned</div>
                  <div className="mt-1 text-3xl font-black text-emerald-300">
                    +{successModal.xpEarned}
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  {successModal.alreadyCompleted
                    ? 'You already earned XP for this challenge earlier. No extra XP was added.'
                    : 'XP is awarded only once for each challenge.'}
                </p>
                <button
                  onClick={() => setSuccessModal(null)}
                  className="mt-6 w-full rounded-2xl bg-emerald-500 px-4 py-3 font-bold text-black transition hover:bg-emerald-400"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {challenge && (
            <div className="grid gap-5 lg:grid-cols-[1.05fr_1.35fr]">
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200">
                  Day {selectedDay}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
                  {selectedSummary?.topic || challenge?.topic}
                </span>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200">
                  {challenge?.difficulty || selectedSummary?.difficulty || 'easy'}
                </span>
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
                  {selectedProgressLabel}
                </span>
              </div>

              <h2 className="text-2xl font-black text-white">{selectedSummary?.title || challenge?.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{challenge?.description || selectedSummary?.description}</p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-gray-950/60 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Function signature</div>
                <div className="mt-2 rounded-xl border border-white/10 bg-black/30 p-3 font-mono text-sm text-amber-200">
                  {challenge?.signature || 'Loading signature...'}
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-gray-950/60 p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Test Cases</div>
                  <div className="mt-3 space-y-3">
                    {(challenge?.testCases || []).map((testCase, index) => (
                      <div key={index} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300">
                        <div className="font-semibold text-white">{testCase.description || `Case ${index + 1}`}</div>
                        <div className="mt-1 text-xs text-gray-500">Input: {formatValue(testCase.args)}</div>
                        <div className="mt-1 text-xs text-gray-500">Expected: {formatValue(testCase.expected)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-gray-950/60 p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Hints</div>
                  <div className="mt-3 space-y-3 text-sm text-gray-300">
                    {(challenge?.hints || selectedSummary?.hints || []).map((hint, index) => (
                      <div key={index} className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-3 text-amber-100/90">
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Hint {index + 1}</div>
                        {hint}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-gray-950/60 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">What to do</div>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  {challenge?.description || selectedSummary?.description}
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">JavaScript IDE</div>
                  <h3 className="text-lg font-black text-white">Solve the function below</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Code2 size={14} className="text-yellow-300" />
                  JavaScript only
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-gray-950/80">
                <Editor
                  height="420px"
                  language="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    tabSize: 2,
                  }}
                />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <button
                  onClick={handleRun}
                  disabled={!challenge || loadingChallenge}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-500/30 bg-violet-500/15 px-4 py-3 text-sm font-bold text-violet-100 transition hover:border-violet-400/50 hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Play size={14} /> Run Tests
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!challenge || isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={14} /> {isSubmitting ? 'Submitting...' : 'Submit for XP'}
                </button>
                <button
                  onClick={handleReset}
                  disabled={!challenge}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-gray-200 transition hover:border-white/20 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw size={14} /> Reset
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-dark-400/50 bg-black/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                  <Terminal size={14} className="text-green-400" /> Terminal
                </div>
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{terminalMessage}</pre>
                {submitMessage && <p className="mt-3 text-sm font-semibold text-amber-300">{submitMessage}</p>}
                {readyToSolve && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle2 size={12} className={passedCount === totalTests && totalTests > 0 ? 'text-emerald-400' : 'text-gray-500'} />
                    {passedCount}/{totalTests || (challenge?.testCases?.length || 0)} tests passing live
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-gray-300">
                      <Zap size={10} className="text-yellow-300" /> {challenge?.xpReward || selectedSummary?.xpReward || 0} XP
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                {liveResults.map((result, index) => renderTestResult(result, index))}
              </div>
            </section>
            </div>
          )}
        </div>

        {loadingOverview && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-400">
            Loading 30 Nights of Coding...
          </div>
        )}

        {!loadingOverview && !selectedSummary && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-400">
            Choose a challenge to begin.
          </div>
        )}
      </div>

    </div>
  );
};

export default ThirtyNitesOfCodingPage;
