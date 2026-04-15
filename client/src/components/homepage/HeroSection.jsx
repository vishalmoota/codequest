import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Braces,
  Code2,
  Cpu,
  Gamepad2,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const floatingItems = [
  { label: '{ }', icon: Braces, x: '8%', y: '18%', delay: 0.2 },
  { label: '</>', icon: Code2, x: '82%', y: '14%', delay: 0.4 },
  { label: 'function()', icon: Terminal, x: '72%', y: '72%', delay: 0.6 },
  { label: '+50 XP', icon: Zap, x: '18%', y: '68%', delay: 0.8 },
  { label: 'boss fight', icon: Gamepad2, x: '46%', y: '10%', delay: 1 },
]

const heroHud = [
  { label: 'Quest Streak', value: '14 days' },
  { label: 'Active Rank', value: 'Gold' },
  { label: 'Next Reward', value: '+250 XP' },
]

export default function HeroSection({ user }) {
  const sectionRef = useRef(null)
  const titleRefs = useRef([])
  const kickerRef = useRef(null)
  const copyRef = useRef(null)
  const controlsRef = useRef(null)
  const panelRef = useRef(null)
  const floatingRefs = useRef([])
  const parallaxLayerRef = useRef(null)
  const glowLayerRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })

      tl.fromTo(
        parallaxLayerRef.current,
        { scale: 1.15, yPercent: 10 },
        { scale: 1, yPercent: -10, ease: 'none', duration: 1 },
        0
      )
        .fromTo(
          glowLayerRef.current,
          { opacity: 0.15, scale: 0.9 },
          { opacity: 0.42, scale: 1.08, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          kickerRef.current,
          { y: 40, opacity: 0, z: -120 },
          { y: 0, opacity: 1, z: 0, duration: 0.6 },
          0.08
        )
        .fromTo(
          titleRefs.current,
          { y: 140, opacity: 0, z: -260, rotateX: 48 },
          { y: 0, opacity: 1, z: 0, rotateX: 0, stagger: 0.08, duration: 0.9 },
          0.14
        )
        .fromTo(
          copyRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          0.35
        )
        .fromTo(
          controlsRef.current,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          0.42
        )
        .fromTo(
          panelRef.current,
          { x: 70, rotateY: -24, rotateX: 10, scale: 0.92, opacity: 0 },
          { x: 0, rotateY: 0, rotateX: 0, scale: 1, opacity: 1, duration: 0.9 },
          0.18
        )
        .fromTo(
          floatingRefs.current,
          { y: 50, scale: 0.65, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, stagger: 0.08, duration: 0.75 },
          0.22
        )

      floatingRefs.current.forEach((node, index) => {
        if (!node) return
        gsap.to(node, {
          y: index % 2 === 0 ? -14 : 14,
          x: index % 2 === 0 ? 10 : -10,
          rotation: index % 2 === 0 ? 6 : -6,
          repeat: -1,
          yoyo: true,
          duration: 3.8 + index * 0.5,
          ease: 'sine.inOut',
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#050510] px-4 pt-24 text-white md:px-6"
      style={{ perspective: '1800px', transformStyle: 'preserve-3d' }}
    >
      <div
        ref={parallaxLayerRef}
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 20% 20%, rgba(0,245,255,0.14), transparent 28%), radial-gradient(circle at 80% 24%, rgba(123,47,255,0.16), transparent 30%), linear-gradient(180deg, rgba(5,5,16,0.48), rgba(5,5,16,0.96))',
        }}
      />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
      <div ref={glowLayerRef} className="absolute left-[-10%] top-[12%] h-80 w-80 rounded-full bg-cyan-400/15 blur-[120px]" />
      <div className="absolute right-[8%] top-[18%] h-72 w-72 rounded-full bg-purple-500/15 blur-[120px]" />
      <div className="absolute bottom-[-12%] left-[30%] h-80 w-80 rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
        <div className="relative z-10">
          <div
            ref={kickerRef}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.35em] text-cyan-200 backdrop-blur-xl"
            style={{ boxShadow: '0 0 30px rgba(0,245,255,0.12)' }}
          >
            <Sparkles size={14} /> Premium scroll-driven learning
          </div>

          <h1 className="font-black uppercase leading-[0.86] tracking-[-0.06em] text-white" style={{ textShadow: '0 0 18px rgba(0,245,255,0.15)' }}>
            <span ref={(el) => { titleRefs.current[0] = el }} className="block text-[clamp(3.8rem,10vw,8.2rem)]">
              ENTER CODEQUEST
            </span>
            <span ref={(el) => { titleRefs.current[1] = el }} className="block bg-gradient-to-r from-cyan-300 via-cyan-200 to-purple-300 bg-clip-text text-[clamp(1.8rem,4vw,3.6rem)] text-transparent">
              LEVEL UP YOUR CODING SKILLS
            </span>
            <span ref={(el) => { titleRefs.current[2] = el }} className="block text-[clamp(1.15rem,2.2vw,1.65rem)] font-semibold tracking-[0.35em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.65)]">
              THROUGH QUESTS, XP, AND COMMUNITY
            </span>
          </h1>

          <p ref={copyRef} className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            A cinematic coding academy where every lesson feels like a campaign, every challenge earns XP, and every milestone unlocks the next tier of mastery.
          </p>

          <div ref={controlsRef} className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to={user ? '/dashboard' : '/signup'} className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-600 px-7 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(0,245,255,0.18)] transition-transform hover:scale-[1.02]">
              <Zap size={18} /> Start Your Quest
            </Link>
            <a href="#features" className="inline-flex items-center justify-center gap-3 rounded-full border border-white/12 bg-white/[0.04] px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition-all hover:border-cyan-300/50 hover:bg-white/[0.08]">
              <Play size={18} /> Explore the Journey
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {heroHud.map((item, index) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl" style={{ transformStyle: 'preserve-3d', boxShadow: index === 1 ? '0 0 24px rgba(0,245,255,0.12)' : 'none' }}>
                <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">{item.label}</div>
                <div className="mt-2 text-xl font-black text-white" style={{ textShadow: '0 0 12px rgba(123,47,255,0.18)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div ref={panelRef} className="relative">
          <div className="absolute inset-6 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute inset-10 rounded-full bg-purple-500/15 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[rgba(10,10,31,0.82)] p-6 shadow-[0_0_80px_rgba(0,0,0,0.35)]" style={{ transformStyle: 'preserve-3d' }}>
            <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
              <span>Quest HUD</span>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-200">Live</span>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(0,245,255,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(123,47,255,0.18),transparent_35%),linear-gradient(180deg,#0b0b20,#04040a)]">
              <div className="absolute inset-0 opacity-80">
                <div className="absolute left-6 top-8 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" />
                <div className="absolute right-8 top-12 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl" />
                <div className="absolute bottom-8 left-10 h-20 w-20 rounded-full bg-[#ffd700]/15 blur-2xl" />
              </div>

              {floatingItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    ref={(el) => { floatingRefs.current[index] = el }}
                    className="absolute inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-md"
                    style={{ left: item.x, top: item.y, willChange: 'transform' }}
                  >
                    <Icon size={14} className="text-cyan-300" />
                    {item.label}
                  </div>
                )
              })}

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[22rem] w-[18rem]" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute left-1/2 top-6 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
                  <div className="absolute left-1/2 top-12 h-40 w-40 -translate-x-1/2 rounded-full bg-purple-500/18 blur-3xl" />
                  <div className="absolute left-1/2 top-16 h-[14rem] w-[14rem] -translate-x-1/2 rounded-[2.4rem] border border-cyan-400/20 bg-[rgba(255,255,255,0.03)] shadow-[0_0_60px_rgba(0,245,255,0.12)] backdrop-blur-2xl" style={{ transform: 'translateZ(40px)' }}>
                    <div className="absolute inset-4 rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent)]" />
                    <div className="absolute left-1/2 top-7 h-20 w-20 -translate-x-1/2 rounded-full border border-cyan-300/30 bg-cyan-400/12 shadow-[0_0_28px_rgba(0,245,255,0.18)]">
                      <div className="absolute left-4 top-8 h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(0,245,255,0.95)]" />
                      <div className="absolute right-4 top-8 h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(0,245,255,0.95)]" />
                    </div>
                    <div className="absolute left-1/2 top-28 h-32 w-36 -translate-x-1/2 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(0,245,255,0.15),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]">
                      <div className="absolute left-1/2 top-4 h-4 w-16 -translate-x-1/2 rounded-full bg-cyan-400/20" />
                      <div className="absolute left-1/2 top-10 h-1.5 w-20 -translate-x-1/2 rounded-full bg-purple-400/50" />
                      <div className="absolute left-1/2 top-16 h-12 w-24 -translate-x-1/2 rounded-2xl border border-white/8 bg-black/20" />
                    </div>
                    <div className="absolute left-1/2 top-[14.5rem] h-14 w-44 -translate-x-1/2 rounded-[1.5rem] border border-white/8 bg-black/20" />
                    <div className="absolute left-[-1rem] top-[12rem] h-16 w-12 rounded-[1.2rem] border border-white/8 bg-cyan-400/10 shadow-[0_0_20px_rgba(0,245,255,0.12)]" />
                    <div className="absolute right-[-1rem] top-[12rem] h-16 w-12 rounded-[1.2rem] border border-white/8 bg-purple-500/10 shadow-[0_0_20px_rgba(123,47,255,0.12)]" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3 text-[10px] uppercase tracking-[0.3em] text-slate-400">
                <div className="rounded-full border border-white/8 bg-black/20 px-3 py-2 text-center">Quest Bot</div>
                <div className="rounded-full border border-white/8 bg-black/20 px-3 py-2 text-center">Rank Core</div>
                <div className="rounded-full border border-white/8 bg-black/20 px-3 py-2 text-center">XP Engine</div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-2 top-8 hidden rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-200 backdrop-blur-md xl:block">
            +50 XP
          </div>
          <div className="pointer-events-none absolute left-0 top-1/2 hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/80 backdrop-blur-md xl:block">
            Achievement Unlocked
          </div>
        </div>
      </div>
    </section>
  )
}
