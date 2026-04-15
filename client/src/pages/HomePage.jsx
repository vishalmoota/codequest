import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code2 } from 'lucide-react'

const TERMINAL_LINES = [
  '> INITIALIZING CODEQUEST SYSTEM v2.087...',
  '> Loading neural compiler... [████████████] 100%',
  '> ',
  '> Welcome, Recruit.',
  '> ',
  '> The year is 2087. Machines handle repetitive work.',
  '> Only those who THINK in code hold real power.',
  '> You have been selected for the CodeQuest Program.',
  '> ',
  '> Mission: Master JavaScript, Python, and HTML.',
  '> Complete challenges. Earn XP. Rise through the ranks.',
  '> The quest awaits those bold enough to begin.',
  '> ',
  '> Scanning profile...',
  '> Status: UNRANKED -> Ready for initialization',
  '> ',
  '> [ Keep scrolling to enter the arena... ] _',
]

const NITE_DAYS = Array.from({ length: 30 }, (_, index) => ({
  day: index + 1,
  completed: index < 12,
}))

const COMMUNITIES = [
  'PlayerOne completed JavaScript Level 12',
  'CodeWarrior earned the 30-Day Streak badge',
  'NightCoder built their first React project',
  'PixelQueen reached Diamond rank',
  'ByteKnight won the weekly challenge',
]

const LANGUAGES = [
  { label: 'JavaScript', text: 'The Language of the Web', color: '#10b981' },
  { label: 'Python', text: "The Serpent's Wisdom", color: '#60a5fa' },
  { label: 'HTML', text: 'The Architect\'s Blueprint', color: '#f59e0b' },
]

const STATS = [
  { value: '10,247', label: 'Quests Completed', accent: '#00ffff' },
  { value: '847', label: 'Active Warriors', accent: '#10b981', dot: true },
  { value: '3', label: 'Languages Mastered', accent: '#7c3aed' },
  { value: '312', label: 'Coding Challenges', accent: '#f59e0b' },
  { value: '30', label: 'Nites of Coding', accent: '#60a5fa' },
  { value: '∞', label: 'Lines Written', accent: '#e2e8f0' },
]

const GAME_MODES = [
  { title: 'Dashboard', label: 'Command center', detail: 'See XP, rank, streaks, and your next quest at a glance.' },
  { title: 'Courses', label: 'Skill campaigns', detail: 'Progress through guided lessons that unlock theory and practice.' },
  { title: 'Challenges', label: 'Timed battles', detail: 'Fight the clock, earn instant XP, and keep the combo alive.' },
  { title: 'Leaderboard', label: 'Rank arena', detail: 'Measure your progress against other recruits and climb the ladder.' },
  { title: 'Profile', label: 'Player card', detail: 'Show off your rank, badges, achievements, and coding identity.' },
  { title: 'Achievements', label: 'Loot vault', detail: 'Collect badges, milestones, streak rewards, and bonus drops.' },
  { title: 'Projects', label: 'Forge mode', detail: 'Build full creations from scratch with guided tools and builder support.' },
  { title: 'Battle', label: 'PvP mode', detail: 'Go head-to-head in code duels and prove your logic under pressure.' },
  { title: 'Build', label: 'Creator lab', detail: 'Prototype, assemble, and launch full-stack ideas in one flow.' },
  { title: 'Community', label: 'Guild hall', detail: 'Share wins, celebrate streaks, and level up together.' },
  { title: '30 Nites', label: 'Night raid', detail: 'Complete one challenge per night and keep the 30-day streak alive.' },
]

const PROGRESSION = [
  { name: 'Rookie', xp: '0 XP', color: '#94a3b8', description: 'Learn the basics and activate your first quest.' },
  { name: 'Coder', xp: '250 XP', color: '#60a5fa', description: 'Unlock the first wave of lessons and challenge tiers.' },
  { name: 'Forge Knight', xp: '1,000 XP', color: '#10b981', description: 'Earn streak bonuses, projects, and deeper skill trees.' },
  { name: 'Battle Mage', xp: '5,000 XP', color: '#f59e0b', description: 'Master timed arenas, boss rounds, and advanced builds.' },
  { name: 'Mythic Legend', xp: '10,000 XP', color: '#7c3aed', description: 'Hold top ranks with a decorated badge wall and elite status.' },
]

const REWARDS = [
  'XP bursts for every solved quest',
  'Streak shields that protect daily momentum',
  'Badge drops for milestones and mastery',
  'Unlockable boss fights and timed arenas',
  'Project loot that turns lessons into real builds',
  'Guild rewards through community activity',
]

const HERO_DOTS = Array.from({ length: 60 }, (_, index) => {
  const seed = Math.abs(Math.sin(index * 12.9898) * 43758.5453) % 1
  const seed2 = Math.abs(Math.sin(index * 78.233) * 12345.6789) % 1
  return {
    id: index,
    left: `${(seed * 100).toFixed(2)}%`,
    top: `${(seed2 * 100).toFixed(2)}%`,
    duration: `${2 + (index % 7)}s`,
    delay: `${(index % 11) * 0.17}s`,
  }
})

const HERO_CHIPS = [
  { label: '+120 XP', left: '9%', top: '18%', duration: '6.5s', delay: '0.2s' },
  { label: 'LEVEL UP', left: '17%', top: '32%', duration: '7s', delay: '0.8s' },
  { label: 'QUEST', left: '74%', top: '16%', duration: '5.8s', delay: '0.35s' },
  { label: 'BOSS FIGHT', left: '69%', top: '29%', duration: '6.2s', delay: '1s' },
  { label: 'RANK', left: '15%', top: '74%', duration: '7.3s', delay: '0.55s' },
  { label: 'SKILL TREE', left: '76%', top: '68%', duration: '6.8s', delay: '1.15s' },
]

const MATRIX_COLUMNS = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: `${6 + index * 8}%`,
  duration: `${9 + (index % 4)}s`,
  delay: `${index * 0.35}s`,
  text: ['0101', 'quest', 'XP', 'rank', 'JS', 'PY', 'HTML', 'arena', 'void', '0', '1', 'code'][index],
}))

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

  @keyframes robotFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-18px); }
  }

  @keyframes swordGlow {
    0%, 100% { box-shadow: 0 0 8px #00ffff, 0 0 16px rgba(0,255,255,0.4), 0 0 24px rgba(0,255,255,0.2); }
    50% { box-shadow: 0 0 20px #00ffff, 0 0 40px rgba(0,255,255,0.7), 0 0 60px rgba(0,255,255,0.3); }
  }

  @keyframes swordSwing {
    0%, 100% { transform: rotate(-45deg) translateY(0px); }
    40% { transform: rotate(-52deg) translateY(-3px); }
    70% { transform: rotate(-40deg) translateY(2px); }
  }

  @keyframes coreReactor {
    0%, 100% { transform: scale(0.95); box-shadow: 0 0 20px #00ffff, 0 0 40px rgba(0,255,255,0.4); }
    50% { transform: scale(1.05); box-shadow: 0 0 30px #00ffff, 0 0 60px rgba(0,255,255,0.7); }
  }

  @keyframes energyFlow {
    0% { background-position: 200% center; }
    100% { background-position: -200% center; }
  }

  @keyframes orbitA {
    0% { transform: rotate(0deg) translateX(90px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
  }

  @keyframes orbitB {
    0% { transform: rotate(120deg) translateX(110px) rotate(-120deg); }
    100% { transform: rotate(480deg) translateX(110px) rotate(-480deg); }
  }

  @keyframes orbitC {
    0% { transform: rotate(240deg) translateX(75px) rotate(-240deg); }
    100% { transform: rotate(600deg) translateX(75px) rotate(-600deg); }
  }

  @keyframes groundPulse {
    0%, 100% { transform: translateX(-50%) scaleX(1); opacity: 0.4; }
    50% { transform: translateX(-50%) scaleX(1.15); opacity: 0.2; }
  }

  @keyframes visorScan {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; box-shadow: 0 0 25px #ef4444, 0 0 50px rgba(239,68,68,0.6); }
  }

  @keyframes helmetGlow {
    0%, 100% { box-shadow: 0 0 15px rgba(0,255,255,0.4); }
    50% { box-shadow: 0 0 25px rgba(0,255,255,0.7), 0 0 50px rgba(0,255,255,0.3); }
  }

  @keyframes runeSpin {
    0% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
    50% { transform: translateY(-10px) rotate(12deg); opacity: 1; }
    100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
  }

  @keyframes floatDot {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes chipFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-12px) scale(1.03); }
  }

  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 10px #10b981; }
    50% { box-shadow: 0 0 30px #10b981, 0 0 60px #10b981; }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes drift {
    0% { transform: translate3d(0, 0, 0) rotate(0deg); }
    50% { transform: translate3d(8px, -12px, 0) rotate(180deg); }
    100% { transform: translate3d(0, 0, 0) rotate(360deg); }
  }

  @keyframes ticker {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  @keyframes flamePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @keyframes scanSweep {
    0% { transform: translateX(-120%) rotate(12deg); opacity: 0; }
    20% { opacity: 0.55; }
    50% { opacity: 0.75; }
    100% { transform: translateX(120%) rotate(12deg); opacity: 0; }
  }

  @keyframes orbPulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.18); opacity: 1; }
  }

  @keyframes cardLift {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  @keyframes ringSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes gridShift {
    from { background-position: 0 0, 0 0, 0 0; }
    to { background-position: 120px 120px, -120px -120px, 0 0; }
  }

  @keyframes driftSlow {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(0, -18px, 0) scale(1.04); }
  }

  @keyframes driftReverse {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(0, 16px, 0) scale(1.06); }
  }

  @keyframes pulseBorder {
    0%, 100% { opacity: 0.35; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.08); }
  }

  @keyframes cursorPulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.95; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.65; }
  }

  @keyframes scanlines {
    0% { background-position: 0 0; }
    100% { background-position: 0 4px; }
  }

  @keyframes hudCornerPulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.9; }
  }

  @keyframes particleDrift {
    0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
    33% { transform: translateY(-30px) translateX(15px) rotate(120deg); }
    66% { transform: translateY(-15px) translateX(-10px) rotate(240deg); }
    100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
  }

  @keyframes glitchShift {
    0%, 95%, 100% { transform: translateX(0); }
    96% { transform: translateX(-3px); }
    97% { transform: translateX(3px); }
    98% { transform: translateX(-2px); }
    99% { transform: translateX(2px); }
  }

  @keyframes hologramFlicker {
    0%, 100% { opacity: 1; }
    92% { opacity: 1; }
    93% { opacity: 0.7; }
    94% { opacity: 1; }
    97% { opacity: 0.85; }
    98% { opacity: 1; }
  }

  @keyframes borderChase {
    0% { box-shadow: 2px 0 0 #00ffff, -2px 0 0 transparent, 0 2px 0 transparent, 0 -2px 0 transparent; }
    25% { box-shadow: 0 2px 0 #00ffff, 0 -2px 0 transparent, -2px 0 0 transparent, 2px 0 0 transparent; }
    50% { box-shadow: -2px 0 0 #00ffff, 2px 0 0 transparent, 0 -2px 0 transparent, 0 2px 0 transparent; }
    75% { box-shadow: 0 -2px 0 #00ffff, 0 2px 0 transparent, 2px 0 0 transparent, -2px 0 0 transparent; }
    100% { box-shadow: 2px 0 0 #00ffff, -2px 0 0 transparent, 0 2px 0 transparent, 0 -2px 0 transparent; }
  }

  @keyframes xpBarFill {
    0% { width: 0%; box-shadow: none; }
    50% { box-shadow: 0 0 20px #10b981; }
    100% { width: 75%; box-shadow: 0 0 10px #10b981; }
  }

  @keyframes badgePop {
    0% { transform: scale(0) rotate(-180deg); opacity: 0; }
    60% { transform: scale(1.3) rotate(10deg); }
    80% { transform: scale(0.9) rotate(-5deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  @keyframes countUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes matrixRain {
    0% { transform: translateY(-100%); opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }

  @keyframes cardShimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes runeRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes typewriterCursor {
    0%, 100% { border-right-color: #00ff41; }
    50% { border-right-color: transparent; }
  }

  @keyframes progressPulse {
    0%, 100% { box-shadow: 0 0 5px #10b981; }
    50% { box-shadow: 0 0 20px #10b981, 0 0 40px rgba(16,185,129,0.5); }
  }

  @keyframes energyCharge {
    0% { width: 0%; opacity: 0.5; }
    100% { width: 100%; opacity: 1; }
  }

  @keyframes warpSpeed {
    0% { transform: scaleX(0); opacity: 1; }
    100% { transform: scaleX(1); opacity: 0; }
  }

  @keyframes flame {
    0%, 100% { transform: scaleY(1) scaleX(1); }
    33% { transform: scaleY(1.1) scaleX(0.95); }
    66% { transform: scaleY(0.95) scaleX(1.05); }
  }

  @keyframes lockShake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }

  @keyframes auraRotate {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }

  .home-page {
    color: #e2e8f0;
    cursor: none;
    background:
      radial-gradient(circle at 14% 16%, rgba(0,255,255,0.14), transparent 18%),
      radial-gradient(circle at 84% 12%, rgba(124,58,237,0.18), transparent 17%),
      radial-gradient(circle at 50% 84%, rgba(16,185,129,0.1), transparent 20%),
      radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04), transparent 48%),
      linear-gradient(180deg, #03030b 0%, #060611 18%, #04040c 52%, #030308 100%);
  }

  .home-section {
    position: relative;
    overflow: hidden;
  }

  .hero-grid {
    background-image:
      radial-gradient(circle at center, rgba(0,255,255,0.08), transparent 40%),
      linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px);
    background-size: 100% 100%, 50px 50px, 50px 50px;
    animation: gridShift 26s linear infinite;
  }

  .home-depth-plane {
    position: absolute;
    left: 50%;
    bottom: -22vh;
    width: min(140vw, 1600px);
    height: 56vh;
    transform: translateX(-50%) perspective(1200px) rotateX(74deg);
    transform-origin: center bottom;
    background:
      linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.62)),
      linear-gradient(rgba(0,255,255,0.12) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,0.08) 1px, transparent 1px);
    background-size: 100% 100%, 80px 80px, 80px 80px;
    border-radius: 50% 50% 0 0;
    box-shadow: 0 -40px 160px rgba(0,0,0,0.7) inset, 0 0 120px rgba(0,255,255,0.05);
    opacity: 0.45;
  }

  .home-depth-plane::before {
    content: '';
    position: absolute;
    inset: 12% 18% 6%;
    border-radius: 50% 50% 0 0;
    border: 1px solid rgba(0,255,255,0.16);
    box-shadow: 0 0 28px rgba(0,255,255,0.08), inset 0 0 28px rgba(124,58,237,0.08);
    animation: pulseBorder 8s ease-in-out infinite;
  }

  .home-orb {
    position: absolute;
    border-radius: 999px;
    filter: blur(10px);
    mix-blend-mode: screen;
  }

  .home-orb-cyan {
    background: radial-gradient(circle, rgba(0,255,255,0.36), rgba(0,255,255,0.05) 60%, transparent 72%);
    box-shadow: 0 0 70px rgba(0,255,255,0.12);
  }

  .home-orb-purple {
    background: radial-gradient(circle, rgba(124,58,237,0.38), rgba(124,58,237,0.06) 60%, transparent 72%);
    box-shadow: 0 0 70px rgba(124,58,237,0.14);
  }

  .home-scanline {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0,255,255,0.85), rgba(124,58,237,0.55), transparent);
    box-shadow: 0 0 24px rgba(0,255,255,0.3);
    opacity: 0.25;
    animation: driftSlow 10s ease-in-out infinite;
  }

  .home-scanline.alt {
    opacity: 0.18;
    animation: driftReverse 13s ease-in-out infinite;
  }

  .home-global-scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,255,0.015) 3px, rgba(0,255,255,0.015) 4px);
    animation: scanlines 0.1s linear infinite;
    opacity: 0.7;
  }

  .home-global-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%);
  }

  .hud-corner {
    position: absolute;
    width: 60px;
    height: 60px;
    border: 1px solid rgba(0,255,255,0.45);
    animation: hudCornerPulse 2.8s ease-in-out infinite;
  }

  .hud-corner.tl {
    left: 18px;
    top: 18px;
    border-right: 0;
    border-bottom: 0;
    clip-path: polygon(0 0, 100% 0, 100% 16%, 16% 16%, 16% 100%, 0 100%);
  }

  .hud-corner.tr {
    right: 18px;
    top: 18px;
    border-left: 0;
    border-bottom: 0;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 84% 100%, 84% 16%, 0 16%);
  }

  .hud-corner.bl {
    left: 18px;
    bottom: 18px;
    border-right: 0;
    border-top: 0;
    clip-path: polygon(0 84%, 84% 84%, 84% 0, 100% 0, 100% 100%, 0 100%);
  }

  .hud-corner.br {
    right: 18px;
    bottom: 18px;
    border-left: 0;
    border-top: 0;
    clip-path: polygon(16% 84%, 100% 84%, 100% 100%, 0 100%, 0 0, 16% 0);
  }

  .matrix-column {
    position: absolute;
    top: -20%;
    width: 2px;
    color: rgba(0,255,65,0.6);
    font-family: monospace;
    font-size: 0.6rem;
    line-height: 1.1;
    text-shadow: 0 0 6px rgba(0,255,65,0.45);
    animation: matrixRain var(--duration, 12s) linear infinite;
  }

  .title-glitch {
    animation: glitchShift 8s ease-in-out infinite;
  }

  .holo-panel {
    position: relative;
    background: rgba(0,0,0,0.7);
    border: 1px solid rgba(0,255,255,0.4);
    border-radius: 8px;
    padding: 12px;
    font-family: monospace;
    backdrop-filter: blur(14px);
    box-shadow: 0 0 24px rgba(0,255,255,0.08);
    overflow: hidden;
    animation: hologramFlicker 7s ease-in-out infinite;
  }

  .holo-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.06) 45%, transparent 60%);
    animation: cardShimmer 5s linear infinite;
    pointer-events: none;
  }

  .game-chip {
    position: absolute;
    padding: 0.45rem 1rem;
    border-radius: 999px;
    background: rgba(0,0,0,0.82);
    font-family: monospace;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    animation: particleDrift 8s ease-in-out infinite;
  }

  .scene-card-3d {
    transform-style: preserve-3d;
    perspective: 1200px;
  }

  .scene-card-3d > * {
    transition: transform 300ms ease, box-shadow 300ms ease, filter 300ms ease;
  }

  .scene-card-3d .mode-card,
  .scene-card-3d .quest-card,
  .scene-card-3d .hud-panel,
  .scene-card-3d .reward-pill {
    transform: translateZ(0);
  }

  .game-stats-card {
    position: relative;
    padding: 1.2rem;
    min-height: 160px;
    border-radius: 20px;
    background: rgba(8,8,24,0.9);
    border: 1px solid rgba(0,255,255,0.18);
    clip-path: polygon(12px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 12px);
    box-shadow: 0 0 24px rgba(0,255,255,0.06);
    overflow: hidden;
  }

  .game-stats-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(0,255,255,0.08) 35%, transparent 60%);
    animation: cardShimmer 4s linear infinite;
    pointer-events: none;
  }

  .hero-aura {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
    animation: auraRotate 26s linear infinite;
    pointer-events: none;
  }

  .hero-progress-bar {
    position: relative;
    width: min(500px, 90vw);
    height: 6px;
    border-radius: 999px;
    background: #0d1030;
    overflow: hidden;
    box-shadow: inset 0 0 12px rgba(0,0,0,0.55);
  }

  .hero-progress-bar::after {
    content: '';
    display: block;
    width: 73%;
    height: 100%;
    background: linear-gradient(90deg, #10b981, #00ffff, #7c3aed);
    background-size: 200% 100%;
    animation: cardShimmer 2s linear infinite, xpBarFill 2.8s ease-out forwards;
  }

  .typewriter {
    display: inline-block;
    border-right: 1px solid #00ff41;
    animation: typewriterCursor 1s steps(2, end) infinite;
  }

  .scene-overlay-card {
    background: rgba(0,0,0,0.7);
    border: 1px solid rgba(0,255,255,0.4);
    border-radius: 10px;
    padding: 12px;
    color: #e2e8f0;
    font-family: monospace;
    backdrop-filter: blur(14px);
    box-shadow: 0 0 24px rgba(0,255,255,0.08);
  }

  .terminal-tabs {
    display: flex;
    gap: 0.5rem;
    background: #111;
    border: 1px solid rgba(255,255,255,0.06);
    border-bottom: 0;
    border-radius: 10px 10px 0 0;
    padding: 0.35rem 0.5rem 0;
  }

  .terminal-tab {
    padding: 0.45rem 0.7rem;
    border-radius: 8px 8px 0 0;
    color: rgba(255,255,255,0.55);
    font-size: 0.75rem;
    letter-spacing: 0.04em;
  }

  .terminal-tab.active {
    color: #fff;
    border-bottom: 2px solid #00ffff;
    background: rgba(0,255,255,0.05);
  }

  .terminal-lines {
    display: grid;
    grid-template-columns: 30px 1fr;
    background: #050505;
    border-left: 1px solid #1a1a1a;
    border-right: 1px solid #1a1a1a;
    border-bottom: 1px solid #1a1a1a;
  }

  .terminal-line-nums {
    padding: 1rem 0 1rem 0.45rem;
    background: #0a0a0a;
    border-right: 1px solid #1a1a1a;
    color: #3a3a3a;
    font-size: 0.8rem;
    line-height: 1.8;
    user-select: none;
  }

  .terminal-code {
    padding: 1rem;
    color: #d4d4d4;
    font-size: 0.9rem;
    line-height: 1.8;
  }

  .status-bar {
    display: flex;
    gap: 1rem;
    align-items: center;
    height: 22px;
    padding: 0 12px;
    background: #007acc;
    color: white;
    font-size: 0.7rem;
    font-family: monospace;
    border-radius: 0 0 10px 10px;
  }

  .game-button {
    display: block;
    width: 100%;
    border: 0;
    border-radius: 10px;
    padding: 1rem 1.4rem;
    font-family: 'Orbitron', monospace;
    letter-spacing: 0.2em;
    color: #fff;
    background: linear-gradient(135deg, #10b981, #059669, #10b981);
    background-size: 200% 100%;
    box-shadow: 0 0 20px #10b981, 0 0 40px rgba(16,185,129,0.4), 0 4px 15px rgba(0,0,0,0.5);
    cursor: pointer;
    animation: cardShimmer 2s linear infinite;
  }

  .game-button:hover {
    transform: scale(1.03) translateY(-2px);
    box-shadow: 0 0 28px #10b981, 0 0 60px rgba(16,185,129,0.5), 0 8px 24px rgba(0,0,0,0.55);
  }

  .press-start {
    display: inline-block;
    font-size: 0.65rem;
    color: #94a3b8;
    letter-spacing: 0.2em;
    animation: blink 1s steps(2, end) infinite;
  }

  .reward-card {
    border: 1px solid rgba(245,158,11,0.18);
    background: rgba(245,158,11,0.05);
    border-radius: 6px;
    padding: 8px 12px;
    text-align: center;
    color: #e2e8f0;
    font-family: monospace;
  }

  .skill-node {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 1rem;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.8), 0 0 18px currentColor;
  }

  .rank-pill {
    position: relative;
    padding: 0.85rem 1rem;
    border-radius: 999px;
    background: rgba(0,0,0,0.65);
    border: 1px solid rgba(0,255,255,0.16);
  }

  .badge-cell {
    position: relative;
    width: 55px;
    height: 55px;
    border-radius: 8px;
    background: #0d1030;
    border: 1px solid rgba(255,255,255,0.12);
    display: grid;
    place-items: center;
    font-size: 1.1rem;
  }

  .badge-cell.unlocked {
    box-shadow: 0 0 18px rgba(0,255,255,0.18);
  }

  .badge-cell.locked::after {
    content: '🔒';
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 1rem;
    color: rgba(255,255,255,0.65);
  }

  .game-stat-number {
    font-family: 'Orbitron', monospace;
    font-size: clamp(2rem, 5vw, 3rem);
    text-shadow: 0 0 14px currentColor;
  }

  .leader-row {
    display: grid;
    grid-template-columns: 24px 26px 1fr auto;
    align-items: center;
    gap: 0.6rem;
    padding: 0.65rem 0.8rem;
    border-radius: 10px;
    background: rgba(2,6,23,0.72);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .hero-mini-hud {
    background: rgba(0,0,0,0.7);
    border: 1px solid rgba(0,255,255,0.4);
    border-radius: 8px;
    padding: 12px;
    font-family: monospace;
    backdrop-filter: blur(12px);
    animation: hologramFlicker 7s ease-in-out infinite;
  }

  .home-cursor {
    position: fixed;
    top: 0;
    left: 0;
    width: 22px;
    height: 22px;
    margin-left: -11px;
    margin-top: -11px;
    border-radius: 999px;
    border: 1px solid rgba(0,255,255,0.9);
    background: radial-gradient(circle, rgba(0,255,255,0.95), rgba(124,58,237,0.55));
    box-shadow: 0 0 18px rgba(0,255,255,0.8), 0 0 40px rgba(124,58,237,0.35);
    pointer-events: none;
    z-index: 120;
    transform: translate3d(0, 0, 0);
    animation: cursorPulse 1.8s ease-in-out infinite;
  }

  .home-cursor-ring {
    position: fixed;
    top: 0;
    left: 0;
    width: 56px;
    height: 56px;
    margin-left: -28px;
    margin-top: -28px;
    border-radius: 999px;
    border: 1px solid rgba(0,255,255,0.35);
    background: radial-gradient(circle, rgba(0,255,255,0.05), transparent 65%);
    box-shadow: 0 0 24px rgba(0,255,255,0.18), inset 0 0 24px rgba(124,58,237,0.12);
    pointer-events: none;
    z-index: 119;
    transform: translate3d(0, 0, 0);
    transition: transform 120ms linear;
  }

  .quest-card {
    position: relative;
    background: linear-gradient(180deg, rgba(8, 8, 24, 0.96), rgba(5, 5, 20, 0.92));
    border: 1px solid rgba(0, 255, 255, 0.22);
    border-radius: 22px;
    backdrop-filter: blur(20px);
    padding: 2rem;
    color: #e2e8f0;
    box-shadow: 0 0 24px rgba(0, 255, 255, 0.06), inset 0 0 24px rgba(124,58,237,0.08);
    overflow: hidden;
  }

  .quest-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.05) 45%, transparent 60%);
    transform: translateX(-120%);
    animation: scanSweep 6s linear infinite;
    pointer-events: none;
  }

  .terminal-cursor {
    display: inline-block;
    color: #00ff41;
    margin-left: 0.1rem;
    animation: blink 1s steps(2, end) infinite;
  }

  .brand-button {
    border: 0;
    background: transparent;
    color: #00ffff;
    cursor: pointer;
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    letter-spacing: 0.12em;
    white-space: nowrap;
  }

  .nav-button {
    border: 0;
    background: transparent;
    color: #00ffff;
    cursor: pointer;
    font-family: monospace;
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
    text-decoration: none;
  }

  .mobile-menu-button {
    border: 1px solid rgba(0, 255, 255, 0.25);
    background: rgba(8, 8, 30, 0.9);
    color: #00ffff;
    border-radius: 12px;
    width: 46px;
    height: 46px;
    padding: 0;
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
    box-shadow: 0 0 18px rgba(0, 245, 255, 0.08);
  }

  .mobile-menu-button span {
    width: 18px;
    height: 2px;
    border-radius: 999px;
    background: #00ffff;
    display: block;
    box-shadow: 0 0 8px rgba(0, 245, 255, 0.45);
  }

  .home-mobile-menu {
    display: none;
  }

  .home-mobile-menu-item {
    width: 100%;
    text-align: left;
    padding: 0.9rem 1rem;
    border-radius: 14px;
    background: rgba(8, 8, 30, 0.88);
    border: 1px solid rgba(0, 255, 255, 0.12);
  }

  .home-mobile-cta {
    width: 100%;
    border: 1px solid #00ffff;
    border-radius: 14px;
    background: rgba(0, 255, 255, 0.06);
    color: #00ffff;
    padding: 0.95rem 1rem;
    font-family: 'Orbitron', monospace;
    font-size: 0.95rem;
    cursor: pointer;
  }

  .hero-chip {
    position: absolute;
    padding: 0.65rem 0.95rem;
    border-radius: 999px;
    background: rgba(8, 8, 30, 0.72);
    border: 1px solid rgba(0,255,255,0.18);
    color: #00ffff;
    font-family: monospace;
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    text-shadow: 0 0 12px rgba(0,255,255,0.55);
  }

  .mode-card {
    position: relative;
    border-radius: 20px;
    border: 1px solid rgba(0,255,255,0.16);
    background: linear-gradient(180deg, rgba(8,8,24,0.92), rgba(5,5,20,0.85));
    box-shadow: 0 0 22px rgba(0,255,255,0.05);
    overflow: hidden;
    transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
  }

  .mode-card:hover {
    transform: translateY(-6px);
    border-color: rgba(0,255,255,0.4);
    box-shadow: 0 12px 30px rgba(0,255,255,0.08), 0 0 32px rgba(124,58,237,0.12);
  }

  .mode-card::after {
    content: '';
    position: absolute;
    inset: auto -20% -50% -20%;
    height: 70%;
    background: radial-gradient(circle at center, rgba(0,255,255,0.14), transparent 60%);
    opacity: 0.7;
    pointer-events: none;
  }

  .hud-panel {
    background: linear-gradient(180deg, rgba(8,8,24,0.94), rgba(3,6,18,0.9));
    border: 1px solid rgba(0,255,255,0.16);
    border-radius: 24px;
    box-shadow: 0 0 28px rgba(0,255,255,0.05), inset 0 0 40px rgba(16,185,129,0.05);
    backdrop-filter: blur(18px);
  }

  .progress-step {
    position: relative;
    padding: 1rem 1.1rem;
    border-radius: 16px;
    background: rgba(2,6,23,0.82);
    border: 1px solid rgba(0,255,255,0.12);
  }

  .progress-step::before {
    content: '';
    position: absolute;
    left: 18px;
    top: 50%;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: currentColor;
    box-shadow: 0 0 18px currentColor;
    transform: translateY(-50%);
  }

  .reward-pill {
    border: 1px solid rgba(0,255,255,0.16);
    border-radius: 999px;
    padding: 0.75rem 1rem 0.75rem 2.25rem;
    background: rgba(2,6,23,0.8);
    color: #e2e8f0;
    font-family: monospace;
    position: relative;
  }

  .reward-pill::before {
    content: '✦';
    position: absolute;
    left: 0.9rem;
    top: 50%;
    transform: translateY(-50%);
    color: #00ffff;
  }

  html {
    scroll-behavior: auto;
  }

  @media (max-width: 768px) {
    .mobile-menu-button {
      display: inline-flex;
    }

    .home-nav-links {
      display: none !important;
    }

    .home-mobile-menu {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      padding: 0 1rem 1rem;
      margin-top: 0.5rem;
      position: relative;
      z-index: 51;
    }

    .home-nav-shell {
      padding: 0.75rem 1rem;
      align-items: center;
    }

    .brand-button span {
      font-size: 0.95rem !important;
    }

    .brand-button .w-10,
    .brand-button .h-10 {
      width: 2rem !important;
      height: 2rem !important;
    }

    .home-page [id='hero'] {
      min-height: auto !important;
      padding-top: 1.5rem !important;
      padding-bottom: 2rem !important;
    }

    .home-page [id='hero'] .hero-grid {
      overflow: hidden;
    }

    .home-page [id='hero'] h1 {
      font-size: clamp(2.2rem, 11vw, 4rem) !important;
      letter-spacing: 0.04em !important;
    }

    .home-page [id='hero'] > div:last-child,
    .home-page .hero-chip,
    .home-page .home-orb,
    .home-page .hud-corner,
    .home-page .matrix-column,
    .home-page .home-scanline {
      display: none !important;
    }

    .home-page [id='hero'] .hero-mini-hud {
      display: none !important;
    }

    .home-page [id='hero'] .hero-robot-stage {
      top: 44% !important;
      width: min(100vw, 360px) !important;
      height: 300px !important;
      transform: translate(-50%, -50%) scale(0.7) !important;
    }

    .home-page [id='hero'] .hero-progress-bar {
      width: 100% !important;
    }

    .home-page [id='worlds'] > div,
    .home-page [id='progression'] > div,
    .home-page [id='courses'] > div,
    .home-page [id='challenges'] > div,
    .home-page [id='projects'] > div,
    .home-page [id='community'] > div,
    .home-page [id='nites'] > div,
    .home-page footer > div {
      grid-template-columns: 1fr !important;
    }

    .home-page [id='worlds'] .terminal-lines {
      grid-template-columns: 24px 1fr !important;
    }

    .home-page [id='worlds'] .terminal-code,
    .home-page [id='challenges'] .terminal-code {
      font-size: 0.8rem !important;
      line-height: 1.7 !important;
    }

    .home-page [id='worlds'] .scene-card-3d,
    .home-page [id='progression'] .hud-panel,
    .home-page [id='projects'] .scene-card-3d,
    .home-page [id='projects'] .quest-card,
    .home-page [id='challenges'] .quest-card,
    .home-page [id='nites'] .scene-card-3d,
    .home-page footer .scene-card-3d {
      transform: none !important;
    }

    .home-page [id='community'] .leader-row {
      grid-template-columns: 1fr auto !important;
      font-size: 0.8rem !important;
    }

    .home-page [id='nites'] .scene-card-3d > div:first-child + div {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }
  }

  @media (max-width: 480px) {
    .home-nav-shell {
      gap: 0.75rem;
    }

    .home-page [id='hero'] {
      padding: 1rem 0.75rem 2rem !important;
    }

    .home-page [id='hero'] .hero-robot-stage {
      top: 42% !important;
      width: min(100vw, 320px) !important;
      height: 270px !important;
      transform: translate(-50%, -50%) scale(0.62) !important;
    }

    .home-page [id='hero'] h1 {
      font-size: clamp(1.9rem, 12vw, 3.1rem) !important;
    }

    .home-page [id='hero'] p,
    .home-page [id='hero'] .typewriter {
      font-size: 0.92rem !important;
    }

    .home-page [id='worlds'],
    .home-page [id='progression'],
    .home-page [id='courses'],
    .home-page [id='challenges'],
    .home-page [id='projects'],
    .home-page [id='community'],
    .home-page [id='nites'] {
      padding-left: 0.75rem !important;
      padding-right: 0.75rem !important;
    }

    .home-page [id='nites'] .scene-card-3d > div:first-child + div {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    .home-page footer .reward-card,
    .home-page [id='projects'] .rank-pill,
    .home-page [id='nites'] .reward-card {
      font-size: 0.85rem !important;
    }
  }
`

function Robot({ victory = false }) {
  const robotScale = victory ? 1.04 : 1

  const energyParticles = Array.from({ length: 20 }, (_, index) => {
    const orbit = index % 3 === 0 ? 'orbitA' : index % 3 === 1 ? 'orbitB' : 'orbitC'
    const size = 4 + (index % 3) * 2
    const colors = ['#00ffff', '#7c3aed', '#f59e0b']

    return {
      id: index,
      orbit,
      size,
      color: colors[index % colors.length],
      duration: `${7 + (index % 5)}s`,
      delay: `${(index % 6) * 0.18}s`,
    }
  })

  const runes = [
    { symbol: '◈', left: '-54px', top: '90px', duration: '6s' },
    { symbol: '⬢', left: '290px', top: '120px', duration: '7s' },
    { symbol: '⬡', left: '256px', top: '286px', duration: '5.8s' },
  ]

  const bobStyle = {
    position: 'relative',
    width: victory ? '300px' : '280px',
    height: victory ? '448px' : '420px',
    margin: '0 auto',
    animation: 'robotFloat 4.8s ease-in-out infinite',
    filter: 'drop-shadow(0 0 22px rgba(0,255,255,0.18))',
  }

  const shellStyle = {
    position: 'absolute',
    inset: 0,
    transform: `scale(${robotScale})`,
    transformOrigin: 'center center',
  }

  const headStyle = {
    position: 'absolute',
    left: '50%',
    top: '12px',
    width: '90px',
    height: '85px',
    transform: 'translateX(-50%)',
    borderRadius: '12px 12px 8px 8px',
    background: 'linear-gradient(160deg, #1e2040, #0a0c1e)',
    border: '2px solid #00ffff',
    boxShadow: '0 0 18px rgba(0,255,255,0.45), inset 0 0 18px rgba(255,255,255,0.05)',
    animation: 'helmetGlow 3s ease-in-out infinite',
  }

  const crestStyle = {
    position: 'absolute',
    left: '50%',
    top: '-30px',
    width: '30px',
    height: '35px',
    transform: 'translateX(-50%)',
    clipPath: 'polygon(50% 0%, 85% 40%, 70% 100%, 30% 100%, 15% 40%)',
    background: 'linear-gradient(180deg, #f59e0b, #7c3aed)',
    boxShadow: '0 0 12px rgba(245,158,11,0.7), 0 0 22px rgba(124,58,237,0.4)',
  }

  const crestOrbStyle = {
    position: 'absolute',
    left: '50%',
    top: '-34px',
    width: '10px',
    height: '10px',
    transform: 'translateX(-50%)',
    borderRadius: '50%',
    background: '#00ffff',
    boxShadow: '0 0 15px #00ffff, 0 0 30px #00ffff',
    animation: 'pulseGlow 1.8s ease-in-out infinite',
  }

  const earGuardStyle = {
    position: 'absolute',
    top: '18px',
    width: '18px',
    height: '25px',
    background: '#0d1030',
    border: '1px solid #3b82f6',
    clipPath: 'polygon(0% 0%, 100% 12%, 84% 100%, 16% 100%, 0% 12%)',
  }

  const visorStyle = {
    position: 'absolute',
    left: '50%',
    top: '35px',
    width: '65px',
    height: '12px',
    transform: 'translateX(-50%)',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, #ef4444, #ff6b35, #ef4444)',
    boxShadow: '0 0 15px #ef4444, 0 0 30px rgba(239,68,68,0.5)',
    animation: 'visorScan 2.8s ease-in-out infinite',
  }

  const chinStyle = {
    position: 'absolute',
    left: '50%',
    top: '49px',
    width: '55px',
    height: '20px',
    transform: 'translateX(-50%)',
    background: '#0d1030',
    borderTop: '1px solid rgba(0,255,255,0.3)',
  }

  const chestVentsStyle = {
    position: 'absolute',
    left: '50%',
    top: '55px',
    width: '24px',
    height: '10px',
    transform: 'translateX(-50%)',
    display: 'grid',
    gap: '2px',
  }

  const shoulderGuardStyle = {
    position: 'absolute',
    top: '36px',
    width: '55px',
    height: '40px',
    clipPath: 'polygon(15% 0%, 85% 0%, 100% 60%, 85% 100%, 15% 100%, 0% 60%)',
    background: 'linear-gradient(135deg, #1e2040, #0a0c1e)',
    border: '1px solid #3b82f6',
    boxShadow: '0 0 12px rgba(59,130,246,0.2)',
  }

  const torsoStyle = {
    position: 'absolute',
    left: '50%',
    top: '92px',
    width: '110px',
    height: '120px',
    transform: 'translateX(-50%)',
    borderRadius: '8px',
    background: 'linear-gradient(180deg, #16183a, #0a0c1e)',
    border: '2px solid rgba(0,255,255,0.4)',
    boxShadow: '0 0 28px rgba(0,255,255,0.12), inset 0 0 18px rgba(255,255,255,0.05)',
  }

  const sidePanelStyle = {
    position: 'absolute',
    top: '0',
    width: '12px',
    height: '100%',
    background: 'linear-gradient(180deg, #1e2040, #0a0c1e)',
    border: '1px solid #3b82f6',
  }

  const reactorStyle = {
    position: 'absolute',
    left: '50%',
    top: '34px',
    width: '40px',
    height: '40px',
    transform: 'translateX(-50%)',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #00ffff 0%, #3b82f6 40%, #0a0c1e 70%)',
    boxShadow: '0 0 20px #00ffff, 0 0 40px rgba(0,255,255,0.5)',
    animation: 'coreReactor 2.2s ease-in-out infinite',
  }

  const reactorFrameStyle = {
    position: 'absolute',
    left: '50%',
    top: '29px',
    width: '54px',
    height: '54px',
    transform: 'translateX(-50%)',
    clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
    border: '2px solid #f59e0b',
    boxShadow: '0 0 10px #f59e0b',
  }

  const energyBarStyle = {
    position: 'absolute',
    left: '50%',
    width: '92px',
    height: '4px',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(90deg, transparent, #7c3aed, #00ffff, #7c3aed, transparent)',
    backgroundSize: '200% 100%',
    animation: 'energyFlow 2.8s linear infinite',
  }

  const boltStyle = {
    position: 'absolute',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#f59e0b',
  }

  const armAssemblyStyle = {
    position: 'absolute',
    top: '104px',
    width: '22px',
    height: '140px',
  }

  const upperArmStyle = {
    position: 'absolute',
    top: '0',
    left: '50%',
    width: '22px',
    height: '55px',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(180deg, #1a1c3a, #0d0f2e)',
    border: '1px solid #3b82f6',
    borderRadius: '6px',
  }

  const elbowStyle = {
    position: 'absolute',
    left: '50%',
    top: '46px',
    width: '28px',
    height: '28px',
    transform: 'translateX(-50%)',
    borderRadius: '50%',
    background: '#0a0c1e',
    border: '2px solid #00ffff',
    boxShadow: '0 0 10px rgba(0,255,255,0.35)',
  }

  const forearmStyle = {
    position: 'absolute',
    left: '50%',
    top: '62px',
    width: '20px',
    height: '50px',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(180deg, #1a1c3a, #0d0f2e)',
    border: '1px solid #3b82f6',
    borderRadius: '6px',
  }

  const gauntletStyle = {
    position: 'absolute',
    left: '50%',
    top: '108px',
    width: '26px',
    height: '32px',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #1e2040, #0a0c1e)',
    border: '1px solid #7c3aed',
    borderRadius: '6px',
  }

  const gauntletGoldStyle = {
    position: 'absolute',
    left: '50%',
    top: '108px',
    width: '30px',
    height: '32px',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #1e2040, #0a0c1e)',
    border: '1px solid #f59e0b',
    borderRadius: '6px',
  }

  const legAssemblyStyle = {
    position: 'absolute',
    top: '212px',
    width: '30px',
    height: '168px',
  }

  const upperLegStyle = {
    position: 'absolute',
    left: '50%',
    top: '0',
    width: '30px',
    height: '50px',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(180deg, #1a1c3a, #0d0f2e)',
    border: '1px solid #3b82f6',
    borderRadius: '4px',
  }

  const kneeGuardStyle = {
    position: 'absolute',
    left: '50%',
    top: '38px',
    width: '36px',
    height: '16px',
    transform: 'translateX(-50%)',
    background: '#0a0c1e',
    border: '2px solid #00ffff',
    borderRadius: '4px',
  }

  const lowerLegStyle = {
    position: 'absolute',
    left: '50%',
    top: '52px',
    width: '28px',
    height: '55px',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(180deg, #1a1c3a, #0d0f2e)',
    border: '1px solid #3b82f6',
    borderRadius: '4px',
  }

  const bootStyle = {
    position: 'absolute',
    left: '50%',
    top: '104px',
    width: '38px',
    height: '20px',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #1e2040, #0a0c1e)',
    border: '1px solid #f59e0b',
    borderRadius: '4px 4px 8px 8px',
  }

  const groundShadowStyle = {
    position: 'absolute',
    left: '50%',
    bottom: '4px',
    width: '180px',
    height: '20px',
    transform: 'translateX(-50%)',
    borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(0,255,255,0.15) 0%, transparent 70%)',
    animation: 'groundPulse 2.8s ease-in-out infinite',
  }

  return (
    <div style={bobStyle}>
      <div style={shellStyle}>
        <div style={groundShadowStyle} />

        <div style={headStyle}>
          <div style={crestStyle} />
          <div style={crestOrbStyle} />
          <div style={{ ...earGuardStyle, left: '-17px', clipPath: 'polygon(0% 12%, 100% 0%, 100% 100%, 16% 100%, 0% 60%)' }} />
          <div style={{ ...earGuardStyle, right: '-17px', clipPath: 'polygon(0% 0%, 100% 12%, 100% 60%, 84% 100%, 0% 100%)' }} />
          <div style={visorStyle} />
          <div style={chinStyle}>
            <div style={{ position: 'absolute', left: '12px', top: '5px', width: '2px', height: '10px', background: 'rgba(0,255,255,0.35)' }} />
            <div style={{ position: 'absolute', left: '26px', top: '5px', width: '2px', height: '10px', background: 'rgba(0,255,255,0.35)' }} />
            <div style={{ position: 'absolute', left: '40px', top: '5px', width: '2px', height: '10px', background: 'rgba(0,255,255,0.35)' }} />
          </div>
        </div>

        <div style={{ ...shoulderGuardStyle, left: '18px', top: '82px' }}>
          <div style={{ position: 'absolute', inset: '8px 6px auto 6px', height: '1px', background: 'rgba(0,255,255,0.2)', boxShadow: '0 9px 0 rgba(0,255,255,0.2), 0 18px 0 rgba(0,255,255,0.2)' }} />
          <div style={{ position: 'absolute', right: '-3px', top: '18px', width: '6px', height: '6px', borderRadius: '50%', background: '#7c3aed', boxShadow: '0 0 10px #7c3aed' }} />
        </div>
        <div style={{ ...shoulderGuardStyle, right: '18px', top: '82px' }}>
          <div style={{ position: 'absolute', inset: '8px 6px auto 6px', height: '1px', background: 'rgba(0,255,255,0.2)', boxShadow: '0 9px 0 rgba(0,255,255,0.2), 0 18px 0 rgba(0,255,255,0.2)' }} />
          <div style={{ position: 'absolute', left: '-3px', top: '18px', width: '6px', height: '6px', borderRadius: '50%', background: '#7c3aed', boxShadow: '0 0 10px #7c3aed' }} />
        </div>

        <div style={torsoStyle}>
          <div style={sidePanelStyle} />
          <div style={{ ...sidePanelStyle, right: '0' }} />
          <div style={{ ...boltStyle, left: '4px', top: '4px' }} />
          <div style={{ ...boltStyle, right: '4px', top: '4px' }} />
          <div style={{ ...boltStyle, left: '4px', bottom: '4px' }} />
          <div style={{ ...boltStyle, right: '4px', bottom: '4px' }} />

          <div style={reactorFrameStyle} />
          <div style={reactorStyle} />

          <div style={{ ...energyBarStyle, top: '78px' }} />
          <div style={{ ...energyBarStyle, top: '88px' }} />

          <div style={{ position: 'absolute', left: '50%', top: '26px', width: '40px', height: '40px', transform: 'translateX(-50%)', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.18)' }} />
        </div>

        <div style={{ ...armAssemblyStyle, left: '34px', transform: 'rotate(8deg)' }}>
          <div style={upperArmStyle} />
          <div style={elbowStyle} />
          <div style={forearmStyle} />
          <div style={gauntletStyle}>
            <div style={{ position: 'absolute', left: '5px', top: '8px', width: '16px', height: '2px', background: 'rgba(255,255,255,0.2)', boxShadow: '0 5px 0 rgba(255,255,255,0.2), 0 10px 0 rgba(255,255,255,0.2)' }} />
          </div>
        </div>

        <div style={{ ...armAssemblyStyle, right: '34px', transform: 'rotate(-25deg)', transformOrigin: 'top center' }}>
          <div style={upperArmStyle} />
          <div style={elbowStyle} />
          <div style={{ ...forearmStyle, height: '58px', top: '58px' }} />
          <div style={gauntletGoldStyle} />

          <div style={{ position: 'absolute', right: '-18px', top: '86px', width: '160px', height: '22px', transform: 'rotate(-45deg)', transformOrigin: 'left center', animation: 'swordSwing 4s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', left: '0', top: '6px', width: '30px', height: '8px', borderRadius: '2px', background: 'linear-gradient(90deg, #8b4513, #5c2e00)', border: '1px solid #f59e0b', backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,200,100,0.35) 0 1px, transparent 1px 4px)' }} />
            <div style={{ position: 'absolute', left: '28px', top: '3px', width: '16px', height: '16px', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
            <div style={{ position: 'absolute', left: '42px', top: '5px', width: '118px', height: '4px', clipPath: 'polygon(0% 0%, 100% 40%, 100% 60%, 0% 100%)', background: 'linear-gradient(90deg, #e8e8f0, #a0a0c0, #ffffff)', animation: 'swordGlow 2s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', left: '52px', top: '4px', width: '98px', height: '6px', background: 'linear-gradient(90deg, rgba(0,255,255,0.0), rgba(0,255,255,0.55), rgba(0,255,255,0.0))', filter: 'blur(1px)' }} />
          </div>
        </div>

        <div style={{ ...legAssemblyStyle, left: '82px' }}>
          <div style={upperLegStyle} />
          <div style={kneeGuardStyle} />
          <div style={lowerLegStyle} />
          <div style={bootStyle} />
          <div style={{ position: 'absolute', right: '-1px', top: '112px', width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
        </div>

        <div style={{ ...legAssemblyStyle, right: '82px' }}>
          <div style={upperLegStyle} />
          <div style={kneeGuardStyle} />
          <div style={lowerLegStyle} />
          <div style={bootStyle} />
          <div style={{ position: 'absolute', left: '-1px', top: '112px', width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
        </div>

        {energyParticles.map((particle) => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              background: particle.color,
              boxShadow: `0 0 10px ${particle.color}, 0 0 20px ${particle.color}`,
              animation: `${particle.orbit} ${particle.duration} linear infinite`,
              animationDelay: particle.delay,
              transformOrigin: 'center center',
              opacity: 0.85,
            }}
          />
        ))}

        {runes.map((rune, index) => (
          <div
            key={rune.symbol}
            style={{
              position: 'absolute',
              left: rune.left,
              top: rune.top,
              color: index === 1 ? '#7c3aed' : '#00ffff',
              fontFamily: 'Orbitron, monospace',
              fontSize: '1.1rem',
              textShadow: `0 0 10px ${index === 1 ? '#7c3aed' : '#00ffff'}`,
              animation: `${index === 1 ? 'runeSpin' : 'runeSpin'} ${rune.duration} ease-in-out infinite`,
              opacity: 0.9,
            }}
          >
            {rune.symbol}
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionTitle({ eyebrow, title, description, align = 'left' }) {
  return (
    <div style={{ textAlign: align, maxWidth: '880px', margin: align === 'center' ? '0 auto' : '0' }}>
      <div style={{ color: '#00ffff', fontFamily: 'Orbitron, monospace', letterSpacing: '0.24em', fontSize: '0.8rem', marginBottom: '0.85rem' }}>
        {eyebrow}
      </div>
      <h2 style={{ margin: 0, fontFamily: 'Orbitron, monospace', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#e2e8f0', letterSpacing: '0.06em' }}>
        {title}
      </h2>
      <p style={{ margin: '1rem 0 0', color: '#94a3b8', fontFamily: 'monospace', fontSize: '1rem', lineHeight: 1.8 }}>
        {description}
      </p>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const cursorRef = useRef(null)
  const cursorRingRef = useRef(null)
  const communityRef = useRef(null)
  const [cursorVisible, setCursorVisible] = useState(false)
  const [scene3Animated, setScene3Animated] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.add('home-page')

    return () => {
      document.body.classList.remove('home-page')
    }
  }, [])

  useEffect(() => {
    if (!communityRef.current) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setScene3Animated(true)
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(communityRef.current)

    return () => observer.disconnect()
  }, [])

  const jumpToSection = (id) => {
    const target = document.getElementById(id)
    if (!target) {
      return
    }

    setMobileMenuOpen(false)
    const offset = 86
    const top = window.scrollY + target.getBoundingClientRect().top - offset
    window.scrollTo({ top, behavior: 'auto' })
  }

  const handleStartQuest = () => {
    setMobileMenuOpen(false)
    navigate('/login')
  }

  const handlePointerMove = (event) => {
    if (!cursorRef.current || !cursorRingRef.current) {
      return
    }

    const { clientX, clientY } = event
    cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`
    cursorRingRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`
  }

  return (
    <div
      ref={pageRef}
      className="home-page"
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setCursorVisible(true)}
      onPointerLeave={() => setCursorVisible(false)}
      style={{ minHeight: '100vh', background: '#0a0a1a' }}
    >
      <style>{STYLES}</style>

      <div aria-hidden="true" className="home-cursor-ring" ref={cursorRingRef} style={{ opacity: cursorVisible ? 1 : 0 }} />
      <div aria-hidden="true" className="home-cursor" ref={cursorRef} style={{ opacity: cursorVisible ? 1 : 0 }} />

      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(0,255,255,0.08), transparent 28%), radial-gradient(circle at 80% 15%, rgba(124,58,237,0.09), transparent 24%), radial-gradient(circle at 50% 80%, rgba(16,185,129,0.07), transparent 26%), linear-gradient(rgba(0,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.045) 1px, transparent 1px)', backgroundSize: '100% 100%, 100% 100%, 100% 100%, 72px 72px, 72px 72px', mixBlendMode: 'screen', opacity: 0.55 }} />
        <div className="home-global-scanlines" />
        <div className="home-global-vignette" />
        <div className="home-depth-plane" />
        <div className="home-orb home-orb-cyan" style={{ left: '10%', top: '14%', width: '18rem', height: '18rem', animation: 'orbPulse 9s ease-in-out infinite' }} />
        <div className="home-orb home-orb-purple" style={{ right: '8%', top: '20%', width: '15rem', height: '15rem', animation: 'orbPulse 11s ease-in-out infinite' }} />
        <div className="home-orb home-orb-cyan" style={{ left: '48%', bottom: '10%', width: '24rem', height: '8rem', opacity: 0.2, filter: 'blur(34px)', animation: 'driftSlow 14s ease-in-out infinite' }} />
        <div className="hud-corner tl" />
        <div className="hud-corner tr" />
        <div className="hud-corner bl" />
        <div className="hud-corner br" />
        {MATRIX_COLUMNS.map((column, index) => (
          <div
            key={column.id}
            className="matrix-column"
            style={{ left: column.left, '--duration': column.duration, animationDelay: column.delay, opacity: 0.05 + (index % 4) * 0.01 }}
          >
            <div>{column.text}</div>
            <div>{column.text}</div>
            <div>{column.text}</div>
            <div>{column.text}</div>
            <div>{column.text}</div>
            <div>{column.text}</div>
          </div>
        ))}
        <div className="home-scanline" style={{ top: '18%', animationDelay: '0s' }} />
        <div className="home-scanline alt" style={{ top: '62%', animationDelay: '1.5s' }} />
        <div className="home-scanline" style={{ top: '78%', animationDelay: '3s' }} />
      </div>

      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(5,5,18,0.88)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(0,255,255,0.18)',
        }}
      >
        <div
          className="home-nav-shell"
          style={{
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '0.85rem 1.25rem',
          }}
        >
          <button type="button" onClick={() => jumpToSection('hero')} className="brand-button" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div className="p-3 bg-yellow-500/20 rounded-2xl border border-yellow-500/30" style={{ padding: '0.35rem' }}>
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center" style={{ width: '2.5rem', height: '2.5rem' }}>
                <Code2 size={24} className="text-dark-900" />
              </div>
            </div>
            <span style={{ color: '#00ffff', fontSize: '1rem' }}>CODEQUEST</span>
          </button>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="home-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => jumpToSection('hero')} className="nav-button">
              Dashboard
            </button>
              <button type="button" onClick={() => jumpToSection('worlds')} className="nav-button">
                Worlds
            </button>
              <button type="button" onClick={() => jumpToSection('progression')} className="nav-button">
                Ranks
              </button>
            <button type="button" onClick={() => jumpToSection('challenges')} className="nav-button">
              Challenges
            </button>
            <button type="button" onClick={() => jumpToSection('projects')} className="nav-button">
              Projects
            </button>
            <button type="button" onClick={() => jumpToSection('community')} className="nav-button">
              Community
            </button>
            <button type="button" onClick={() => jumpToSection('nites')} className="nav-button">
              30 Nites
            </button>
            <button
              type="button"
              onClick={handleStartQuest}
              style={{
                color: '#00ffff',
                border: '1px solid #00ffff',
                borderRadius: '6px',
                background: 'rgba(0,255,255,0.04)',
                cursor: 'pointer',
                fontFamily: 'Orbitron, monospace',
                padding: '0.5rem 1rem',
                fontSize: '0.95rem',
              }}
            >
              Start Quest
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="home-mobile-menu">
            <button type="button" onClick={() => jumpToSection('hero')} className="nav-button home-mobile-menu-item">Dashboard</button>
            <button type="button" onClick={() => jumpToSection('worlds')} className="nav-button home-mobile-menu-item">Worlds</button>
            <button type="button" onClick={() => jumpToSection('progression')} className="nav-button home-mobile-menu-item">Ranks</button>
            <button type="button" onClick={() => jumpToSection('challenges')} className="nav-button home-mobile-menu-item">Challenges</button>
            <button type="button" onClick={() => jumpToSection('projects')} className="nav-button home-mobile-menu-item">Projects</button>
            <button type="button" onClick={() => jumpToSection('community')} className="nav-button home-mobile-menu-item">Community</button>
            <button type="button" onClick={() => jumpToSection('nites')} className="nav-button home-mobile-menu-item">30 Nites</button>
            <button type="button" onClick={handleStartQuest} className="home-mobile-cta">Start Quest</button>
          </div>
        )}
      </nav>

      <main>
        <section id="hero" className="home-section hero-grid" style={{ minHeight: 'calc(100vh - 73px)', position: 'relative', backgroundColor: 'transparent', overflow: 'hidden', paddingTop: '1rem', boxShadow: 'inset 0 -70px 160px rgba(0,0,0,0.55)' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,255,255,0.08), transparent 40%)' }} />
          <div className="hero-aura" aria-hidden="true" />
          {HERO_DOTS.map((dot) => (
            <div
              key={dot.id}
              style={{
                position: 'absolute',
                left: dot.left,
                top: dot.top,
                width: '3px',
                height: '3px',
                borderRadius: '999px',
                background: '#00ffff',
                opacity: 0.4,
                animation: `floatDot ${dot.duration} ease-in-out infinite`,
                animationDelay: dot.delay,
              }}
            />
          ))}
          {HERO_CHIPS.map((chip) => (
            <div
              key={chip.label}
              className="hero-chip game-chip"
              style={{
                left: chip.left,
                top: chip.top,
                color: chip.label.includes('XP') ? '#f59e0b' : chip.label.includes('LEVEL') ? '#7c3aed' : chip.label.includes('BOSS') ? '#ef4444' : chip.label.includes('QUEST') ? '#00ffff' : chip.label.includes('SKILL') ? '#10b981' : '#3b82f6',
                borderColor: chip.label.includes('XP') ? '#f59e0b' : chip.label.includes('LEVEL') ? '#7c3aed' : chip.label.includes('BOSS') ? '#ef4444' : chip.label.includes('QUEST') ? '#00ffff' : chip.label.includes('SKILL') ? '#10b981' : '#3b82f6',
                boxShadow: `0 0 18px ${chip.label.includes('XP') ? 'rgba(245,158,11,0.32)' : chip.label.includes('LEVEL') ? 'rgba(124,58,237,0.32)' : chip.label.includes('BOSS') ? 'rgba(239,68,68,0.32)' : chip.label.includes('QUEST') ? 'rgba(0,255,255,0.32)' : chip.label.includes('SKILL') ? 'rgba(16,185,129,0.32)' : 'rgba(59,130,246,0.32)'}`,
                animation: `chipFloat ${chip.duration} ease-in-out infinite, particleDrift ${8 + (chip.duration.length % 3)}s ease-in-out infinite`,
                animationDelay: chip.delay,
              }}
            >
              {chip.label} {chip.label.includes('XP') ? '⚡' : chip.label.includes('LEVEL') ? '🎯' : chip.label.includes('BOSS') ? '💀' : chip.label.includes('QUEST') ? '🗺️' : chip.label.includes('SKILL') ? '🌳' : '⬆️'}
            </div>
          ))}

          <div className="hero-robot-stage" style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translate(-50%, -50%)', left: '50%', top: '50%', pointerEvents: 'none', zIndex: 2 }}>
            <Robot />
          </div>

          <div className="hero-mini-hud" style={{ position: 'absolute', top: '80px', left: '20px', width: '180px', zIndex: 3 }}>
            <div style={{ color: '#00ffff', fontSize: '0.6rem', letterSpacing: '0.18em', marginBottom: '0.55rem', fontFamily: 'Orbitron, monospace' }}>PLAYER STATUS</div>
            <div style={{ color: '#e2e8f0', fontSize: '0.78rem', lineHeight: 1.8 }}>RANK: UNRANKED</div>
            <div style={{ color: '#f59e0b', fontSize: '0.78rem', lineHeight: 1.8 }}>XP: 0 / 250</div>
            <div style={{ width: '100%', height: '6px', borderRadius: '999px', background: '#0d1030', overflow: 'hidden', margin: '0.4rem 0' }}>
              <div style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg, #10b981, #00ffff, #7c3aed)', boxShadow: '0 0 14px #10b981', animation: 'energyCharge 2.4s ease-out forwards' }} />
            </div>
            <div style={{ color: '#f97316', fontSize: '0.78rem', lineHeight: 1.8 }}>STREAK: 0 🔥</div>
          </div>

          <div className="hero-mini-hud" style={{ position: 'absolute', top: '80px', right: '20px', width: '160px', zIndex: 3 }}>
            <div style={{ color: '#10b981', fontSize: '0.65rem', letterSpacing: '0.18em', marginBottom: '0.55rem', fontFamily: 'Orbitron, monospace', animation: 'blink 1s steps(2, end) infinite' }}>MISSION ACTIVE</div>
            {['Complete first quest', 'Earn 250 XP', 'Join the arena'].map((mission, index) => (
              <div key={mission} style={{ display: 'flex', gap: '0.45rem', alignItems: 'flex-start', marginBottom: '0.35rem', color: index === 0 ? '#e2e8f0' : 'rgba(226,232,240,0.6)', fontSize: '0.74rem', lineHeight: 1.4 }}>
                <span style={{ color: '#00ffff' }}>◆</span>
                <span>{mission}</span>
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', bottom: '80px', left: '20px', zIndex: 3, display: 'grid', gap: '0.6rem' }}>
            {[
              { text: '⚔️ CHALLENGES: 200+', color: '#00ffff' },
              { text: '🏆 PROJECTS: 20+', color: '#7c3aed' },
              { text: '🔥 STREAKS: ACTIVE', color: '#f59e0b' },
            ].map((pill, index) => (
              <div key={pill.text} className="scene-overlay-card" style={{ padding: '4px 12px', borderRadius: '20px', borderColor: pill.color, color: pill.color, fontSize: '0.7rem', animation: `countUp ${0.45 + index * 0.2}s ease-out both`, animationDelay: `${index * 0.15}s` }}>
                {pill.text}
              </div>
            ))}
          </div>

          <div className="hero-mini-hud" style={{ position: 'absolute', bottom: '80px', right: '20px', width: '150px', zIndex: 3 }}>
            <div style={{ color: '#00ffff', fontSize: '0.65rem', letterSpacing: '0.18em', marginBottom: '0.55rem', fontFamily: 'Orbitron, monospace' }}>LEADERBOARD</div>
            {[
              { rank: '#1', name: 'PixelQueen', xp: '24,820 XP', color: '#f59e0b' },
              { rank: '#2', name: 'ByteKnight', xp: '18,440 XP', color: '#cbd5e1' },
              { rank: '#3', name: 'NightCoder', xp: '12,100 XP', color: '#cd7f32' },
            ].map((row) => (
              <div key={row.rank} style={{ display: 'grid', gridTemplateColumns: '18px 1fr auto', gap: '0.4rem', alignItems: 'center', marginBottom: '0.35rem', color: '#e2e8f0', fontSize: '0.72rem', opacity: 0.88 }}>
                <span style={{ color: row.color }}>{row.rank}</span>
                <span>{row.name}</span>
                <span style={{ color: row.color }}>{row.xp}</span>
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', left: '50%', top: '49%', transform: 'translate(-50%, -50%)', width: 'min(96vw, 1100px)', height: '420px', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: '320px', height: '320px', transform: 'translate(-50%, -50%)', borderRadius: '50%', border: '1px solid rgba(0,255,255,0.2)', boxShadow: '0 0 50px rgba(0,255,255,0.08)', animation: 'ringSpin 18s linear infinite' }} />
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: '430px', height: '430px', transform: 'translate(-50%, -50%)', borderRadius: '50%', border: '1px dashed rgba(124,58,237,0.28)', boxShadow: '0 0 40px rgba(124,58,237,0.07)' }} />
            <div style={{ position: 'absolute', left: '50%', top: '51%', width: '560px', height: '2px', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.6), transparent)', boxShadow: '0 0 24px rgba(0,255,255,0.4)' }} />
          </div>

          <div style={{ position: 'absolute', left: '50%', top: '63%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 2 }}>
            <h1
              className="title-glitch"
              style={{
                margin: 0,
                fontFamily: 'Orbitron, monospace',
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                color: '#00ffff',
                textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff',
                letterSpacing: '0.14em',
              }}
            >
              CODEQUEST
            </h1>
            <div className="typewriter" style={{ marginTop: '0.45rem', color: '#00ffff', fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: '0.18em', opacity: 0.5 }}>
              &lt; / coding • warriors • wanted &gt;
            </div>
            <p style={{ margin: '0.75rem 0 0', color: '#cbd5e1', fontFamily: 'monospace', fontSize: '1.15rem', letterSpacing: '0.08em' }}>
              Enter the Arena. Master the Code.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.7rem', flexWrap: 'wrap' }}>
              {['XP', 'STREAK', 'BOSS FIGHTS', 'PROJECTS', 'RANK UP'].map((tag) => (
                <span key={tag} style={{ padding: '0.5rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(0,255,255,0.16)', background: 'rgba(8,8,24,0.8)', color: '#00ffff', fontFamily: 'Orbitron, monospace', fontSize: '0.72rem', letterSpacing: '0.14em', boxShadow: '0 0 18px rgba(0,255,255,0.06)' }}>
                  {tag}
                </span>
              ))}
            </div>
            <div style={{ marginTop: '1.2rem', display: 'grid', gap: '0.45rem', alignItems: 'center', justifyItems: 'center' }}>
              <div style={{ display: 'flex', width: 'min(500px, 90vw)', justifyContent: 'space-between', color: '#00ffff', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.14em' }}>
                <span>GLOBAL QUEST PROGRESS</span>
                <span>73%</span>
              </div>
              <div className="hero-progress-bar" />
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#64748b',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              letterSpacing: '0.12em',
            }}
          >
            SCROLL TO ENTER ↓
          </div>
        </section>

        <section id="worlds" className="home-section" style={{ padding: '5.5rem 1.5rem', background: 'linear-gradient(180deg, rgba(5,5,16,0.4) 0%, rgba(7,8,20,0.92) 100%)' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <SectionTitle
              eyebrow="GAME SYSTEMS"
              title="Every feature is a mode in the same quest"
              description="The home page should feel like the control room for the whole platform. Each section below maps directly to a part of the product and frames it like a level, arena, or reward loop."
            />

            <div className="scene-card-3d" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: '1rem', alignItems: 'start' }}>
              <div className="scene-overlay-card" style={{ minHeight: '520px', padding: '0', overflow: 'hidden' }}>
                <div className="terminal-tabs">
                  <div className="terminal-tab active">main.js</div>
                  <div className="terminal-tab">quest.py</div>
                  <div className="terminal-tab">arena.html</div>
                </div>
                <div className="terminal-lines">
                  <div className="terminal-line-nums">
                    {TERMINAL_LINES.map((_, index) => (
                      <div key={index}>{index + 1}</div>
                    ))}
                  </div>
                  <div className="terminal-code">
                    {TERMINAL_LINES.map((line, index) => {
                      const lineKey = `${line}-${index}`
                      const isComment = line.includes('Welcome') || line.includes('You have been selected') || line.includes('quest')
                      const display = line
                        .replace('INITIALIZING', '<span style="color:#569cd6">INITIALIZING</span>')
                        .replace('Loading', '<span style="color:#569cd6">Loading</span>')
                        .replace('Ready', '<span style="color:#569cd6">Ready</span>')
                        .replace('UNRANKED', '<span style="color:#f59e0b">UNRANKED</span>')
                        .replace('100%', '<span style="color:#f59e0b">100%</span>')
                        .replace('JavaScript', '<span style="color:#ce9178">JavaScript</span>')
                        .replace('Python', '<span style="color:#ce9178">Python</span>')
                        .replace('HTML', '<span style="color:#ce9178">HTML</span>')
                      return (
                        <div key={lineKey} style={{ color: isComment ? '#6a9955' : '#d4d4d4', minHeight: '1.8rem' }} dangerouslySetInnerHTML={{ __html: display || '&nbsp;' }} />
                      )
                    })}
                    <div style={{ marginTop: '1rem', color: '#00ff41', fontWeight: 700 }}>[RECRUIT@CODEQUEST ~]$ <span className="terminal-cursor">_</span></div>
                  </div>
                </div>
                <div className="status-bar">
                  <span>⚡ CodeQuest v2.087</span>
                  <span>JavaScript</span>
                  <span>UTF-8</span>
                  <span>LF</span>
                  <span>Ln 1, Col 1</span>
                </div>
                <div style={{ padding: '0.75rem 1rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ color: '#10b981', fontFamily: 'Orbitron, monospace', letterSpacing: '0.12em', fontSize: '0.72rem', animation: 'hologramFlicker 3s ease-in-out infinite' }}>SYSTEM ONLINE</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '18px' }}>
                    {[8, 12, 16, 10].map((height, index) => (
                      <span key={height} style={{ width: '4px', height: `${height}px`, background: '#10b981', borderRadius: '999px', animation: `pulseGlow ${1.4 + index * 0.15}s ease-in-out infinite` }} />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem', transform: 'translateZ(0)' }}>
                {GAME_MODES.map((mode, index) => (
                  <div key={mode.title} className="mode-card" style={{ padding: '1.25rem', minHeight: '176px', animation: `${index % 2 === 0 ? 'cardLift' : 'floatDot'} ${5.8 + (index % 3)}s ease-in-out infinite`, transform: `rotateX(${index % 2 === 0 ? '-3deg' : '4deg'}) translateZ(${index % 2 === 0 ? '10px' : '0'})` }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ color: '#00ffff', fontFamily: 'Orbitron, monospace', letterSpacing: '0.14em', fontSize: '0.76rem' }}>{mode.label}</div>
                      <div style={{ marginTop: '0.55rem', color: '#e2e8f0', fontFamily: 'Orbitron, monospace', fontSize: '1.2rem', letterSpacing: '0.06em' }}>{mode.title}</div>
                      <p style={{ margin: '0.85rem 0 0', color: '#94a3b8', fontFamily: 'monospace', lineHeight: 1.8, fontSize: '0.96rem' }}>{mode.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="progression" className="home-section" style={{ padding: '5.5rem 1.5rem', background: 'linear-gradient(180deg, rgba(7,8,20,0.92) 0%, rgba(5,5,16,0.98) 100%)' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '2rem', alignItems: 'stretch' }}>
            <div className="hud-panel" style={{ padding: '2rem', transform: 'perspective(1200px) rotateY(4deg)' }}>
              <SectionTitle
                eyebrow="RANK LADDER"
                title="XP becomes identity"
                description="Your progress is visible everywhere: in levels, badges, streaks, and social proof. The page now reflects a real game loop instead of a generic marketing layout."
              />
              <div style={{ marginTop: '2rem', display: 'grid', gap: '0.8rem' }}>
                {PROGRESSION.map((step) => (
                  <div key={step.name} className="progress-step" style={{ color: step.color, paddingLeft: '3rem', minHeight: '88px' }}>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', color: '#e2e8f0' }}>
                      <div>
                        <div style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.12em', color: step.color }}>{step.name}</div>
                        <div style={{ marginTop: '0.35rem', color: '#94a3b8', fontFamily: 'monospace', lineHeight: 1.7 }}>{step.description}</div>
                      </div>
                      <div style={{ fontFamily: 'Orbitron, monospace', color: step.color, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{step.xp}</div>
                    </div>
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.55rem', alignItems: 'center' }}>
                      <div className="skill-node" style={{ color: step.color, background: 'rgba(2,6,23,0.92)' }}>
                        {step.name === 'Rookie' ? '🌱' : step.name === 'Coder' ? '⚡' : step.name === 'Forge Knight' ? '🔥' : step.name === 'Battle Mage' ? '⚔️' : '💎'}
                      </div>
                      <div style={{ flex: 1, height: '3px', borderRadius: '999px', background: 'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(0,255,255,0.45), rgba(255,255,255,0.04))' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="quest-card" style={{ minHeight: '220px', transform: 'perspective(1200px) rotateX(3deg)' }}>
                <div style={{ color: '#00ffff', fontFamily: 'Orbitron, monospace', letterSpacing: '0.16em', fontSize: '0.78rem' }}>PLAYER HUD</div>
                <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.85rem' }}>
                  {[
                    { label: 'Rank', value: 'Forge Knight', accent: '#10b981' },
                    { label: 'XP', value: '4,820', accent: '#00ffff' },
                    { label: 'Streak', value: '12 days', accent: '#f59e0b' },
                    { label: 'Badges', value: '18 unlocked', accent: '#7c3aed' },
                  ].map((item) => (
                    <div key={item.label} style={{ padding: '1rem', borderRadius: '16px', border: '1px solid rgba(0,255,255,0.14)', background: 'rgba(2,6,23,0.82)' }}>
                      <div style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.85rem' }}>{item.label}</div>
                      <div style={{ marginTop: '0.45rem', color: item.accent, fontFamily: 'Orbitron, monospace', fontSize: '1.15rem', letterSpacing: '0.08em' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hud-panel" style={{ padding: '1.5rem 1.7rem', transform: 'perspective(1200px) rotateX(4deg)' }}>
                <div style={{ color: '#f59e0b', fontFamily: 'Orbitron, monospace', letterSpacing: '0.16em', fontSize: '0.78rem' }}>REWARD LOOP</div>
                <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
                  {REWARDS.map((reward) => (
                    <div key={reward} className="reward-pill">
                      {reward}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="courses" className="home-section" style={{ padding: '5rem 1.5rem', background: 'linear-gradient(180deg, #0a0a1a 0%, #080816 100%)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <SectionTitle
                eyebrow="LEARNING PATH"
                title="From Zero to Code Hero"
                description="Courses now sit inside a game loop: fundamentals unlock theory, quizzes, and project drops while the player steadily climbs the rank ladder."
              />
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.92rem' }}>
                <span>50+ Levels</span>
                <span>3 Languages</span>
                <span>Unlock new worlds as you level up</span>
              </div>
            </div>
            <div className="quest-card">
              <div style={{ height: '4px', borderRadius: '999px', background: 'linear-gradient(90deg, #7c3aed, #00ffff)', marginBottom: '1.5rem' }} />
              <div style={{ display: 'grid', gap: '0.85rem' }}>
                {['START', 'JS Basics', 'Functions', 'DOM', 'Projects', 'CERTIFIED'].map((label, index) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.9rem 1rem', borderRadius: '14px', background: index === 5 ? 'rgba(0,255,255,0.08)' : 'rgba(2,6,23,0.9)', border: '1px solid rgba(0,255,255,0.14)' }}>
                    <span style={{ color: index % 2 === 0 ? '#00ffff' : '#7c3aed', fontFamily: 'Orbitron, monospace', letterSpacing: '0.08em' }}>{label}</span>
                    <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{index + 1}/6</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="challenges" className="home-section" style={{ padding: '5rem 1.5rem', background: 'linear-gradient(180deg, #080816 0%, #050510 100%)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <SectionTitle
                eyebrow="CHALLENGES"
                title="Battle the Algorithm"
                description="Timed problems now feel like arena fights, complete with instant XP, pressure, and a visible reward pulse on success."
              />
              <div style={{ marginTop: '1.5rem', color: '#f59e0b', fontFamily: 'Orbitron, monospace', fontSize: '1.25rem', letterSpacing: '0.12em' }}>
                +120 XP ⚡
              </div>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.92rem' }}>
                <span>200+ Challenges</span>
                <span>Real-time Execution</span>
                <span>JS • Python • HTML</span>
              </div>
            </div>
            <div className="quest-card" style={{ background: 'rgba(2,6,23,0.96)', padding: 0, overflow: 'hidden' }}>
              <div className="terminal-tabs" style={{ borderRadius: '16px 16px 0 0', background: '#111' }}>
                <div className="terminal-tab active">battle.js</div>
                <div className="terminal-tab">quest.py</div>
                <div className="terminal-tab">arena.html</div>
              </div>
              <div className="terminal-lines" style={{ minHeight: '360px' }}>
                <div className="terminal-line-nums" style={{ lineHeight: 2.05 }}>
                  {['1', '2', '3', '4', '5', '6', '7', '8'].map((num) => (
                    <div key={num}>{num}</div>
                  ))}
                </div>
                <div className="terminal-code">
                  <div><span style={{ color: '#569cd6' }}>const</span> <span style={{ color: '#9cdcfe' }}>solve</span> <span style={{ color: '#d4d4d4' }}>=</span> <span style={{ color: '#569cd6' }}>function</span><span style={{ color: '#d4d4d4' }}>(</span><span style={{ color: '#ce9178' }}>input</span><span style={{ color: '#d4d4d4' }}>) {'{'}</span></div>
                  <div style={{ paddingLeft: '1rem' }}><span style={{ color: '#569cd6' }}>const</span> total <span style={{ color: '#d4d4d4' }}>=</span> input.a <span style={{ color: '#d4d4d4' }}>+</span> input.b</div>
                  <div style={{ paddingLeft: '1rem' }}><span style={{ color: '#569cd6' }}>if</span> (total &gt; 0) <span style={{ color: '#d4d4d4' }}>{'{'}</span></div>
                  <div style={{ paddingLeft: '2rem' }}><span style={{ color: '#569cd6' }}>return</span> <span style={{ color: '#ce9178' }}>`Sum: ${'{'}total{'}'}`</span></div>
                  <div style={{ paddingLeft: '1rem' }}><span style={{ color: '#d4d4d4' }}>{'}'}</span></div>
                  <div style={{ color: '#6a9955' }}>// Real-time validation, instant feedback</div>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button type="button" className="game-button" style={{ width: 'auto', padding: '0.85rem 1.1rem', letterSpacing: '0.12em', background: 'linear-gradient(135deg, #10b981, #059669, #10b981)' }}>▶ RUN CODE</button>
                    <button type="button" className="game-button" style={{ width: 'auto', padding: '0.85rem 1.1rem', letterSpacing: '0.12em', background: 'linear-gradient(135deg, #f59e0b, #d97706, #f59e0b)' }}>⚡ SUBMIT</button>
                  </div>
                  <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', borderRadius: '12px', background: '#040814', border: '1px solid rgba(16,185,129,0.24)', color: '#10b981' }}>
                    <div style={{ color: '#94a3b8', marginBottom: '0.4rem' }}>Output:</div>
                    {['✓ Test 1 passed', '✓ Test 2 passed', '✓ Test 3 passed'].map((line, index) => (
                      <div key={line} style={{ animation: `countUp ${0.35 + index * 0.2}s ease-out both`, animationDelay: `${index * 0.2}s` }}>{line}</div>
                    ))}
                    <div style={{ marginTop: '0.4rem', color: '#f59e0b', animation: 'badgePop 1.2s ease-out both', animationDelay: '0.6s' }}>+120 XP</div>
                  </div>
                </div>
              </div>
              <div className="status-bar">
                <span>⚡ CodeQuest v2.087</span>
                <span>JavaScript</span>
                <span>UTF-8</span>
                <span>LF</span>
                <span>Ln 1, Col 1</span>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="home-section" style={{ padding: '5rem 1.5rem', background: 'linear-gradient(180deg, #050510 0%, #0b1023 100%)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <SectionTitle
                eyebrow="PROJECTS"
                title="Build. Ship. Conquer."
                description="Projects are now framed as forge missions: you assemble a real creation, push through the builder, and ship something you can actually show off."
              />
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.92rem' }}>
                <span>20+ Guided Projects</span>
                <span>Custom Builder</span>
                <span>Download Your Creations</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: '1rem' }}>
              <div className="scene-card-3d" style={{ background: 'rgba(5,8,20,0.98)', minHeight: '320px' }}>
                <div className="hero-mini-hud">
                  <span className="game-chip">FORGE / build</span>
                  <span className="game-chip">LIVE PREVIEW</span>
                </div>
                <div style={{ marginTop: '1rem', color: '#f59e0b', fontFamily: 'Orbitron, monospace', fontSize: '1rem', letterSpacing: '0.16em' }}>PROJECT TREE</div>
                <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
                  {['src/', 'components/', 'assets/', 'build/'].map((folder, index) => (
                    <div key={folder} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', padding: '0.85rem 1rem', borderRadius: '14px', background: index % 2 === 0 ? 'rgba(16,185,129,0.08)' : 'rgba(0,255,255,0.06)', border: '1px solid rgba(148,163,184,0.14)' }}>
                      <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{folder}</span>
                      <span style={{ color: index % 2 === 0 ? '#10b981' : '#00ffff', fontFamily: 'Orbitron, monospace', fontSize: '0.72rem', letterSpacing: '0.16em' }}>READY</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {['wireframe', 'animation', 'deploy'].map((phase) => (
                    <span key={phase} className="rank-pill">{phase}</span>
                  ))}
                </div>
              </div>
              <div className="quest-card" style={{ background: 'rgba(2,6,23,0.98)', border: '1px solid rgba(245,158,11,0.22)', minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ color: '#94a3b8', fontFamily: 'monospace' }}>build terminal</div>
                  <div style={{ color: '#10b981', fontFamily: 'Orbitron, monospace', fontSize: '0.72rem', letterSpacing: '0.16em' }}>DEPLOYED</div>
                </div>
                <div style={{ flex: 1, borderRadius: '14px', background: 'linear-gradient(180deg, rgba(10,16,36,0.96), rgba(4,8,20,0.98))', border: '1px solid rgba(0,255,255,0.14)', padding: '1rem', fontFamily: 'monospace', color: '#e2e8f0' }}>
                  <div style={{ color: '#6a9955' }}>npm run forge</div>
                  <div style={{ marginTop: '0.65rem', color: '#94a3b8' }}>Compiling artifacts...</div>
                  <div style={{ marginTop: '0.65rem', color: '#10b981' }}>✓ Component map assembled</div>
                  <div style={{ marginTop: '0.45rem', color: '#10b981' }}>✓ Animation sequence loaded</div>
                  <div style={{ marginTop: '0.45rem', color: '#f59e0b' }}>⚡ Ship-ready build generated</div>
                  <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(16,185,129,0.09)', border: '1px solid rgba(16,185,129,0.18)' }}>
                    <div style={{ color: '#94a3b8', marginBottom: '0.35rem' }}>Preview status</div>
                    <div style={{ color: '#10b981' }}>Hello World ✓ <span className="terminal-cursor">_</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="community" className="home-section" style={{ padding: '5rem 1.5rem', background: 'radial-gradient(circle at center, #0d0d2e 0%, #0a0a1a 70%)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <SectionTitle
              eyebrow="COMMUNITY"
              title="The Arena Speaks"
              description="XP bars, ranks, streaks, badges, and leaderboards turn progress into a social game loop where every win is visible."
              align="center"
            />

            <div style={{ width: '100%', marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    minHeight: '160px',
                    padding: '1.2rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(0,255,255,0.18)',
                    background: 'rgba(8,8,24,0.9)',
                    clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
                    boxShadow: '0 0 24px rgba(0,255,255,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(2rem, 5vw, 3rem)', color: stat.accent, textShadow: `0 0 14px ${stat.accent}` }}>
                      {stat.value}
                    </div>
                    <div style={{ marginTop: '0.6rem', color: '#cbd5e1', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                      {stat.label}
                    </div>
                    {stat.dot ? <div style={{ width: '9px', height: '9px', borderRadius: '999px', background: '#10b981', marginTop: '0.55rem', boxShadow: '0 0 14px #10b981', animation: 'pulseGlow 1.6s ease-in-out infinite' }} /> : null}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ width: '100%', maxWidth: '1200px', marginTop: '2.5rem', overflow: 'hidden', borderTop: '1px solid rgba(0,255,255,0.12)', borderBottom: '1px solid rgba(0,255,255,0.12)', padding: '1rem 0', background: 'rgba(8,8,24,0.7)' }}>
              <div style={{ display: 'flex', gap: '4rem', width: '200%', animation: 'ticker 20s linear infinite' }}>
                {[...COMMUNITIES, ...COMMUNITIES].map((item, index) => (
                  <div key={`${item}-${index}`} style={{ whiteSpace: 'nowrap', padding: '0.65rem 1rem', borderRadius: '999px', border: '1px solid rgba(0,255,255,0.18)', color: '#e2e8f0', background: 'rgba(2,6,23,0.92)', boxShadow: '0 0 16px rgba(0,255,255,0.05)', fontFamily: 'monospace' }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="nites" className="home-section" style={{ padding: '5rem 1.5rem', background: '#0a0a1a' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <SectionTitle
              eyebrow="30 NITES"
              title="One challenge per night"
              description="A 30-day coding gauntlet becomes a raid calendar, turning daily consistency into a streak-driven reward system."
            />

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '1.25rem', alignItems: 'start' }}>
              <div className="scene-card-3d" style={{ background: 'rgba(5,8,20,0.98)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ color: '#f59e0b', fontFamily: 'Orbitron, monospace', fontSize: '0.85rem', letterSpacing: '0.16em' }}>CALENDAR RAID</div>
                  <div className="game-chip">STREAK x2</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '0.6rem' }}>
                  {NITE_DAYS.map((day) => (
                    <div
                      key={day.day}
                      style={{
                        aspectRatio: '1 / 1',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: day.completed ? 'linear-gradient(180deg, rgba(16,185,129,0.95), rgba(6,95,70,0.95))' : 'rgba(26,26,46,0.92)',
                        border: day.completed ? '1px solid rgba(16,185,129,0.38)' : '1px solid rgba(45,45,78,0.9)',
                        color: day.completed ? '#ffffff' : '#4a4a6e',
                        boxShadow: day.completed ? '0 0 14px rgba(16,185,129,0.35)' : 'none',
                        margin: '0 auto',
                      }}
                    >
                      <div>{day.day}</div>
                      <div style={{ fontSize: '0.72rem', marginTop: '0.1rem' }}>{day.completed ? '✓' : '🔒'}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="scene-card-3d" style={{ background: 'rgba(5,8,20,0.98)', alignSelf: 'stretch' }}>
                <div style={{ color: '#00ffff', fontFamily: 'Orbitron, monospace', fontSize: '0.8rem', letterSpacing: '0.16em' }}>REWARD TRACK</div>
                <div style={{ marginTop: '1rem', display: 'grid', gap: '0.8rem' }}>
                  {['Day 01', 'Day 10', 'Day 20', 'Day 30'].map((label, index) => (
                    <div key={label} className="reward-card">
                      <div style={{ color: '#f59e0b', fontFamily: 'Orbitron, monospace', fontSize: '0.75rem', letterSpacing: '0.12em' }}>{label}</div>
                      <div style={{ marginTop: '0.35rem', color: '#e2e8f0', fontFamily: 'monospace' }}>{index === 0 ? 'Boot sequence' : index === 1 ? 'Combo boost' : index === 2 ? 'Legend tier' : 'Final boss skin'}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)', color: '#10b981', fontFamily: 'monospace' }}>
                  12 Day Streak Active <span className="terminal-cursor">_</span>
                </div>
              </div>
            </div>

            <p style={{ margin: '1.5rem 0 0', color: '#94a3b8', fontFamily: 'monospace', fontSize: '1rem', textAlign: 'center' }}>
              A 30-day coding gauntlet. One challenge per night. No excuses.
            </p>

            <div style={{ width: '100%', maxWidth: '400px', margin: '1.5rem auto 0', height: '12px', borderRadius: '8px', background: '#1a1a2e', overflow: 'hidden', boxShadow: '0 0 18px rgba(16,185,129,0.1)' }}>
              <div style={{ width: '40%', height: '100%', background: '#10b981', borderRadius: '8px', boxShadow: '0 0 16px #10b981' }} />
            </div>

            <div style={{ marginTop: '1rem', color: '#f59e0b', fontFamily: 'Orbitron, monospace', fontSize: '1.2rem', letterSpacing: '0.08em', textAlign: 'center', animation: 'flamePulse 1.5s ease-in-out infinite' }}>
              🔥 12 Day Streak Active
            </div>
          </div>
        </section>

        <section className="home-section" style={{ padding: '5rem 1.5rem 6rem', background: 'radial-gradient(ellipse at center, rgba(45,27,105,0.95) 0%, #0a0a1a 70%)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem', justifyItems: 'center' }}>
            <div style={{ maxWidth: '700px', width: '100%', background: 'rgba(5,5,20,0.95)', border: '2px solid #f59e0b', borderRadius: '16px', boxShadow: '0 0 30px rgba(245,158,11,0.3), 0 0 60px rgba(245,158,11,0.1)', padding: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f59e0b', fontFamily: 'Orbitron, monospace', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '0.06em', flexWrap: 'wrap' }}>
                <span>⚔️</span>
                <span>YOUR QUEST AWAITS, RECRUIT</span>
              </div>
              <div style={{ margin: '1.25rem 0', height: '1px', background: 'rgba(245,158,11,0.3)' }} />
              <p style={{ margin: 0, color: '#94a3b8', fontFamily: 'monospace', fontStyle: 'italic', lineHeight: 1.9 }}>
                Every master was once a beginner. Every legend was once unknown. Your code journey starts with one line.
              </p>
              <div style={{ marginTop: '1.5rem', color: '#00ffff', fontFamily: 'Orbitron, monospace', fontSize: '1rem', letterSpacing: '0.08em' }}>
                Choose your path:
              </div>
              <div style={{ marginTop: '0.85rem' }}>
                {LANGUAGES.map((language) => (
                  <div key={language.label} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '1rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: language.color, boxShadow: `0 0 12px ${language.color}` }} />
                    <span>{language.label} - {language.text}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleStartQuest}
                style={{
                  display: 'block',
                  margin: '2rem auto 0',
                  padding: '1rem 3.5rem',
                  fontSize: '1.3rem',
                  fontFamily: 'Orbitron, monospace',
                  letterSpacing: '0.2em',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px #10b981, 0 0 40px rgba(16,185,129,0.4)',
                }}
              >
                START THE QUEST
              </button>
            </div>
          </div>
        </section>

        <footer style={{ background: '#0b1326', borderTop: '1px solid rgba(148,163,184,0.16)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem 1.5rem' }}>
            <div className="scene-card-3d" style={{ background: 'rgba(5,8,20,0.96)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.9rem' }}>
                    <div className="p-3 bg-yellow-500/20 rounded-2xl border border-yellow-500/30" style={{ padding: '0.35rem' }}>
                      <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <Code2 size={24} className="text-dark-900" />
                      </div>
                    </div>
                    <div style={{ color: '#e2e8f0', fontFamily: 'Orbitron, monospace', fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.08em' }}>
                      CodeQuest
                    </div>
                  </div>
                  <p style={{ margin: 0, color: '#94a3b8', fontFamily: 'monospace', maxWidth: '320px', lineHeight: 1.8 }}>
                    Keep leveling up. Complete quests, earn XP, and build your coding streak one challenge at a time.
                  </p>
                </div>

                <div style={{ textAlign: 'right', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '1rem' }}>
                  Made for <span style={{ color: '#00ffff' }}>daily quests</span> and coding streaks
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                <div className="reward-card">
                  <div style={{ color: '#10b981', fontFamily: 'Orbitron, monospace', fontSize: '0.78rem', letterSpacing: '0.18em' }}>DAILY XP</div>
                  <div style={{ marginTop: '0.55rem', color: '#e2e8f0', fontFamily: 'monospace' }}>+120 for every completed quest</div>
                </div>
                <div className="reward-card">
                  <div style={{ color: '#00ffff', fontFamily: 'Orbitron, monospace', fontSize: '0.78rem', letterSpacing: '0.18em' }}>STREAK BONUS</div>
                  <div style={{ marginTop: '0.55rem', color: '#e2e8f0', fontFamily: 'monospace' }}>Unlock bonus rewards by coding every day</div>
                </div>
                <div className="reward-card">
                  <div style={{ color: '#f59e0b', fontFamily: 'Orbitron, monospace', fontSize: '0.78rem', letterSpacing: '0.18em' }}>NEXT QUEST</div>
                  <div style={{ marginTop: '0.55rem', color: '#e2e8f0', fontFamily: 'monospace' }}>Pick a lesson, battle a challenge, or build a project</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(148,163,184,0.16)' }}>
                <div style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>
                  © 2026 CodeQuest, Inc. &nbsp;&nbsp; Terms &nbsp;&nbsp; Privacy Policy
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
                  {['⚔️', '⭐', '🏆', '🔥'].map((icon) => (
                    <div
                      key={icon}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#1b2440',
                        border: '1px solid rgba(148,163,184,0.16)',
                        color: '#e2e8f0',
                        fontSize: '1rem',
                      }}
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
