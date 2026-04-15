import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  BadgeCheck,
  BarChart3,
  Crown,
  Flame,
  Medal,
  Shield,
  Star,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { label: 'Learners', value: 12400, suffix: '+' },
  { label: 'Challenges', value: 150, suffix: '+' },
  { label: 'Badges', value: 18, suffix: '+' },
  { label: 'Completion', value: 94, suffix: '%' },
]

const badges = [
  { label: 'First Blood', icon: Flame },
  { label: 'Quest Runner', icon: Trophy },
  { label: 'XP Hunter', icon: Medal },
  { label: 'Guardian', icon: Shield },
]

const leaderboard = [
  { name: 'Ava', score: '2,840 XP', rank: 'Gold' },
  { name: 'Noah', score: '2,610 XP', rank: 'Platinum' },
  { name: 'Mina', score: '2,420 XP', rank: 'Gold' },
]

export default function GamificationSection() {
  const sectionRef = useRef(null)
  const statRefs = useRef([])
  const barRefs = useRef([])
  const badgeRefs = useRef([])
  const leaderboardRefs = useRef([])
  const xpRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const ctx = gsap.context(() => {
      const counterState = stats.map(() => ({ value: 0 }))

      stats.forEach((stat, index) => {
        const node = statRefs.current[index]
        if (!node) return

        gsap.to(counterState[index], {
          value: stat.value,
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: '+=120%',
            scrub: true,
          },
          onUpdate: () => {
            node.textContent = `${Math.round(counterState[index].value).toLocaleString('en-US')}${stat.suffix}`
          },
        })
      })

      gsap.fromTo(
        xpRef.current,
        { scaleX: 0.18 },
        {
          scaleX: 0.92,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: '+=110%',
            scrub: true,
          },
        }
      )

      barRefs.current.forEach((bar, index) => {
        if (!bar) return
        gsap.fromTo(
          bar,
          { scaleX: 0, opacity: 0.3 },
          {
            scaleX: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top center',
              end: '+=120%',
              scrub: true,
            },
            delay: index * 0.08,
          }
        )
      })

      badgeRefs.current.forEach((badge, index) => {
        if (!badge) return
        gsap.fromTo(
          badge,
          { y: 60, rotateX: 32, scale: 0.86, opacity: 0 },
          {
            y: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top center',
              end: '+=130%',
              scrub: true,
            },
            delay: index * 0.05,
          }
        )
      })

      leaderboardRefs.current.forEach((row, index) => {
        if (!row) return
        gsap.fromTo(
          row,
          { x: index % 2 === 0 ? -60 : 60, opacity: 0, scale: 0.95 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top center',
              end: '+=120%',
              scrub: true,
            },
            delay: index * 0.08,
          }
        )
      })

      gsap.to(progressRef.current, {
        width: '100%',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="gamification"
      className="relative min-h-screen overflow-hidden px-4 py-20 text-white md:px-6"
      style={{ perspective: '1600px', transformStyle: 'preserve-3d' }}
    >
      <div className="absolute left-0 top-0 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/12 blur-[120px]" />
      <div className="absolute right-0 top-10 h-[24rem] w-[24rem] rounded-full bg-cyan-400/12 blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 h-[24rem] w-[24rem] rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs uppercase tracking-[0.35em] text-cyan-200 backdrop-blur-xl">
            <Crown size={13} /> XP, ranks, and achievements
          </div>
          <h2 className="mt-6 max-w-3xl text-[clamp(2.8rem,6vw,5.8rem)] font-black uppercase leading-[0.92] tracking-[-0.06em] text-white">
            Gamification that feels like a HUD.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            The progress system blends counters, badges, and leaderboard visuals so every scroll feels like a new reward drop.
          </p>

          <div className="mt-8 rounded-[1.85rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span className="font-semibold text-white">XP Progress</span>
              <span>635 / 1000</span>
            </div>
            <div className="mt-4 h-4 overflow-hidden rounded-full border border-cyan-400/20 bg-slate-950/80">
              <div ref={xpRef} className="h-full origin-left rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-[#ffd700]" style={{ transform: 'scaleX(0.18)', boxShadow: '0 0 24px rgba(0,245,255,0.25)' }} />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.32em] text-slate-500">
              <span>Next rank: Platinum</span>
              <span>+250 XP</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {stats.map((stat, index) => (
              <div key={stat.label} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">{stat.label}</div>
                <div ref={(el) => { statRefs.current[index] = el }} className="mt-3 text-4xl font-black text-white" style={{ textShadow: '0 0 14px rgba(0,245,255,0.18)' }}>
                  0{stat.suffix}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-[rgba(10,10,31,0.9)] p-6 shadow-[0_0_80px_rgba(0,0,0,0.35)]" style={{ transformStyle: 'preserve-3d' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-slate-500">Achievement Deck</div>
                <div className="mt-2 text-2xl font-black text-white">Loot and Milestones</div>
              </div>
              <BadgeCheck size={24} className="text-cyan-200" />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {badges.map((badge, index) => {
                const Icon = badge.icon
                return (
                  <div
                    key={badge.label}
                    ref={(el) => { badgeRefs.current[index] = el }}
                    className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
                    style={{ willChange: 'transform' }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-cyan-200">
                      <Icon size={20} />
                    </div>
                    <div className="mt-4 text-lg font-bold text-white">{badge.label}</div>
                    <div className="mt-2 text-sm leading-7 text-slate-400">A collectible reward that reinforces progress and momentum.</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.35em] text-slate-500">Leaderboard</div>
                  <div className="mt-2 text-2xl font-black text-white">Top Quest Runners</div>
                </div>
                <BarChart3 size={24} className="text-cyan-200" />
              </div>
              <div className="mt-5 space-y-3">
                {leaderboard.map((row, index) => (
                  <div
                    key={row.name}
                    ref={(el) => { leaderboardRefs.current[index] = el }}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                  >
                    <div>
                      <div className="font-semibold text-white">{row.name}</div>
                      <div className="text-xs uppercase tracking-[0.32em] text-slate-500">{row.rank}</div>
                    </div>
                    <div className="font-mono text-sm text-cyan-200">{row.score}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[rgba(10,10,31,0.92)] p-6 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.35em] text-slate-500">Reward Burst</div>
              <div className="mt-4 text-5xl font-black text-[#ffd700]">+50 XP</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                XP popups, streak bonuses, and badge unlocks are surfaced as part of the visual reward system.
              </p>
              <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-3 text-sm text-cyan-200">
                  <Star size={16} /> Daily momentum
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-slate-500">
                  <Users size={14} /> Community streaks
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
