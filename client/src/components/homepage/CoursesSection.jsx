import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  Braces,
  ChevronRight,
  Code2,
  Cpu,
  Laptop2,
  Rocket,
  Shield,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const courses = [
  {
    title: 'JavaScript',
    emoji: '⚡',
    level: 'Beginner',
    copy: 'Variables, loops, functions, async patterns, and browser power in one quest line.',
    accent: '#ffd700',
    topics: ['Variables', 'Functions', 'Async', 'Objects'],
  },
  {
    title: 'Python',
    emoji: '🐍',
    level: 'Beginner',
    copy: 'Readable syntax, automation, data structures, and problem solving with clear feedback.',
    accent: '#00ff88',
    topics: ['Syntax', 'Lists', 'Loops', 'Files'],
  },
  {
    title: 'React',
    emoji: '⚛️',
    level: 'Intermediate',
    copy: 'Component thinking, state, UI composition, and interactive builds with modern patterns.',
    accent: '#00f5ff',
    topics: ['Components', 'State', 'Hooks', 'Context'],
  },
  {
    title: 'HTML/CSS',
    emoji: '🌐',
    level: 'Beginner',
    copy: 'Responsive layouts, motion, and polished interfaces built like real product pages.',
    accent: '#7b2fff',
    topics: ['Layout', 'Flexbox', 'Grid', 'Motion'],
  },
]

export default function CoursesSection() {
  const sectionRef = useRef(null)
  const cardRefs = useRef([])
  const heroRef = useRef(null)
  const codePanelRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean)
      gsap.fromTo(
        cards,
        { y: 130, rotateX: 36, rotateY: -8, scale: 0.86, opacity: 0, z: -220 },
        {
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          opacity: 1,
          z: 0,
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: '+=130%',
            scrub: true,
          },
        }
      )

      gsap.fromTo(
        heroRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: '+=100%',
            scrub: true,
          },
        }
      )

      gsap.fromTo(
        codePanelRef.current,
        { rotateY: 18, x: 80, opacity: 0 },
        {
          rotateY: 0,
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: '+=120%',
            scrub: true,
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const handleEnter = (event) => {
    gsap.to(event.currentTarget, {
      y: -12,
      rotateX: 8,
      rotateY: -6,
      scale: 1.02,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const handleLeave = (event) => {
    gsap.to(event.currentTarget, {
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    })
  }

  return (
    <section ref={sectionRef} id="courses" className="relative min-h-screen overflow-hidden px-4 py-20 text-white md:px-6" style={{ perspective: '1800px', transformStyle: 'preserve-3d' }}>
      <div className="absolute left-0 top-12 h-[26rem] w-[26rem] rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="absolute right-0 top-20 h-[24rem] w-[24rem] rounded-full bg-purple-500/10 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div ref={heroRef} className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs uppercase tracking-[0.35em] text-cyan-200 backdrop-blur-xl">
            <Laptop2 size={13} /> Course worlds
          </div>
          <h2 className="mt-6 text-[clamp(2.8rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
            Courses that feel like polished game realms.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Every course card is animated from depth, then gently reacts on hover so the catalog feels tactile without becoming noisy.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {courses.map((course, index) => (
            <article
              key={course.title}
              ref={(el) => { cardRefs.current[index] = el }}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              className="group relative overflow-hidden rounded-[1.85rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-transform duration-300"
              style={{
                boxShadow: `0 0 0 1px ${course.accent}40, 0 0 50px ${course.accent}18`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at top, ${course.accent}22, transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent)` }} />
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-6xl">{course.emoji}</div>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-slate-400">
                    {course.level}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-black text-white">{course.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{course.copy}</p>

                <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
                    <span>Topics</span>
                    <span>{index + 1}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {course.topics.map((topic) => (
                      <span key={topic} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-300">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.05]">
                  <div className="h-full rounded-full" style={{ width: `${52 + index * 12}%`, background: `linear-gradient(90deg, ${course.accent}, rgba(255,255,255,0.9))` }} />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Rocket size={16} className="text-cyan-200" /> Start quest
                  </div>
                  <ChevronRight size={18} className="text-cyan-200 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div ref={codePanelRef} className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[rgba(10,10,31,0.92)] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-slate-500">Interactive Preview</div>
                <div className="mt-2 text-2xl font-black text-white">Course sidebar and editor hints</div>
              </div>
              <Cpu size={24} className="text-cyan-200" />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                { label: 'Live editor', icon: Terminal },
                { label: 'Theory nodes', icon: Braces },
                { label: 'AI hints', icon: Shield },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4 text-center">
                    <Icon size={20} className="mx-auto text-cyan-200" />
                    <div className="mt-3 text-xs uppercase tracking-[0.32em] text-slate-400">{item.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.35em] text-slate-500">Quest controls</div>
            <div className="mt-4 flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
              <Zap size={18} className="text-[#ffd700]" />
              Scroll to unlock the next course card with a depth-driven reveal.
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
              <Sparkles size={18} className="text-cyan-200" />
              Hover each card to tilt it like a premium product showcase.
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
              <ArrowRight size={18} className="text-emerald-300" />
              Course cards keep their own glow trails and progress bars.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
