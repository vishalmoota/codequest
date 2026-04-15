import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  BarChart3,
  Braces,
  Code2,
  Cpu,
  Gamepad2,
  Layers3,
  Medal,
  ShieldCheck,
  Terminal,
  Trophy,
  Zap,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: Code2,
    title: 'Quest-Based Learning',
    copy: 'Every course feels like a campaign with chapters, mission goals, and immediate reward feedback.',
    tag: 'Mission Flow',
  },
  {
    icon: Terminal,
    title: 'Live Coding Interface',
    copy: 'Solve challenges in a Monaco-style editor with code execution, output, and fast feedback loops.',
    tag: 'Editor Core',
  },
  {
    icon: Trophy,
    title: 'XP and Rank Progression',
    copy: 'Progress is visible at every step with XP, levels, ranks, streaks, and completion rewards.',
    tag: 'Reward Layer',
  },
  {
    icon: Gamepad2,
    title: 'Battle-Like Challenges',
    copy: 'Challenge cards feel like encounters, with timed flow, hints, and immersive feedback.',
    tag: 'Arena Mode',
  },
]

const terminalLines = [
  'npm run quest:complete',
  '-> XP +50',
  '-> Badge unlocked',
  '-> Community post created',
]

export default function FeaturesSection() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])
  const terminalRef = useRef(null)
  const glowRef = useRef(null)
  const timelineRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const ctx = gsap.context(() => {
      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=180%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })

      timelineRef.current
        .fromTo(
          glowRef.current,
          { opacity: 0.14, scale: 0.9 },
          { opacity: 0.38, scale: 1.1, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          terminalRef.current,
          { y: 80, rotateY: -20, z: -180, opacity: 0 },
          { y: 0, rotateY: 0, z: 0, opacity: 1, ease: 'none', duration: 1 },
          0.08
        )

      cardsRef.current.forEach((card, index) => {
        if (!card) return
        timelineRef.current.fromTo(
          card,
          {
            y: 160,
            scale: 0.82,
            rotateX: 30,
            rotateY: index % 2 === 0 ? -22 : 22,
            opacity: 0,
            z: -260,
          },
          {
            y: 0,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            opacity: 1,
            z: 0,
            ease: 'power3.out',
            duration: 0.8,
          },
          0.18 + index * 0.2
        )
      })

      gsap.to('.feature-scan-line', {
        xPercent: 100,
        repeat: -1,
        duration: 5.5,
        ease: 'none',
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative min-h-screen overflow-hidden px-4 py-20 text-white md:px-6"
      style={{ perspective: '1800px', transformStyle: 'preserve-3d' }}
    >
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[32rem] w-[32rem] rounded-full bg-cyan-400/15 blur-[120px]"
      />
      <div className="absolute right-0 top-0 h-[24rem] w-[24rem] rounded-full bg-purple-500/15 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs uppercase tracking-[0.34em] text-cyan-200 backdrop-blur-xl">
            <Zap size={13} /> Why CodeQuest feels premium
          </div>
          <h2 className="mt-6 max-w-3xl text-[clamp(2.6rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
            Scroll-driven systems built like a game engine.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            The feature deck is pinned, scrubbed to scroll, and sequenced with a GSAP timeline so each card feels like it rises from depth rather than simply appearing.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <article
                  key={feature.title}
                  ref={(el) => { cardsRef.current[index] = el }}
                  className="group rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-2"
                  style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-200 shadow-[0_0_24px_rgba(0,245,255,0.12)]">
                      <Icon size={20} />
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-slate-400">
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{feature.copy}</p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-cyan-200 transition-transform group-hover:translate-x-1">
                    Discover <ArrowRight size={16} />
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div ref={terminalRef} className="relative mx-auto w-full max-w-xl" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
          <div className="absolute inset-6 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(10,10,31,0.92)] p-6 shadow-[0_0_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-white/8 pb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-slate-500">Quest Console</div>
                <div className="mt-2 text-xl font-black text-white">Feature Engine</div>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                Ready
              </div>
            </div>

            <div className="relative mt-6 overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/30 p-5">
              <div className="feature-scan-line absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-70" />
              {terminalLines.map((line, index) => (
                <div key={line} className="flex items-center gap-3 py-2 font-mono text-sm text-slate-300">
                  <span className="text-cyan-300">0{index + 1}</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Depth</div>
                <div className="mt-2 text-2xl font-black text-white">3D</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Motion</div>
                <div className="mt-2 text-2xl font-black text-cyan-300">Scrub</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Reward</div>
                <div className="mt-2 text-2xl font-black text-[#ffd700]">XP</div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: '3D Layers', icon: Layers3 },
              { label: 'Metrics', icon: BarChart3 },
              { label: 'Badges', icon: Medal },
              { label: 'Shield', icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center backdrop-blur-xl">
                  <Icon size={20} className="mx-auto text-cyan-200" />
                  <div className="mt-2 text-[10px] uppercase tracking-[0.32em] text-slate-400">{item.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 hidden rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.35em] text-cyan-200 md:block">
        Features one by one
      </div>
    </section>
  )
}
