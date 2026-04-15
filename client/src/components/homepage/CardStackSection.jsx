import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Code2, Heart, MessageSquare, Rocket, Sparkles, Star, Zap } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const cards = [
  {
    id: 'build',
    badge: 'Project Build',
    title: 'Ship a project tutorial with a social reveal.',
    copy: 'Tutorial completion posts land in the community automatically, turning progress into visible momentum.',
    accent: 'from-cyan-400/20 to-cyan-400/5',
    icon: Code2,
  },
  {
    id: 'custom',
    badge: 'Custom Project',
    title: 'Save a self-built project and trigger a showcase post.',
    copy: 'Your own ideas become feed-ready achievements with comments, likes, and a premium presentation.',
    accent: 'from-purple-500/20 to-purple-500/5',
    icon: Rocket,
  },
  {
    id: 'social',
    badge: 'Community',
    title: 'The feed feels like a live product launch board.',
    copy: 'Cards overlap, glide, and stack in depth while the section stays pinned to the viewport.',
    accent: 'from-emerald-400/20 to-emerald-400/5',
    icon: MessageSquare,
  },
  {
    id: 'xp',
    badge: 'Reward Drop',
    title: 'Every milestone gets a burst of XP and badges.',
    copy: 'Lean transforms, layered depth, and tight scrub timing keep the motion instant and smooth.',
    accent: 'from-yellow-400/20 to-yellow-400/5',
    icon: Zap,
  },
]

export default function CardStackSection() {
  const sectionRef = useRef(null)
  const stackRef = useRef(null)
  const cardRefs = useRef([])
  const glowRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const stack = stackRef.current
    if (!section || !stack) return undefined

    const ctx = gsap.context(() => {
      const cardsNodes = cardRefs.current.filter(Boolean)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=180%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })

      tl.fromTo(
        glowRef.current,
        { opacity: 0.18, scale: 0.92 },
        { opacity: 0.42, scale: 1.06, duration: 1, ease: 'none' },
        0
      )

      cardsNodes.forEach((card, index) => {
        const depth = index * 28
        const offset = index * 0.16

        tl.fromTo(
          card,
          {
            y: 240,
            scale: 0.84 - index * 0.03,
            rotateX: 18,
            rotateY: index % 2 === 0 ? -18 : 18,
            opacity: index === 0 ? 1 : 0,
            z: -240 - depth,
          },
          {
            y: index * -24,
            scale: 1 - index * 0.03,
            rotateX: 0,
            rotateY: 0,
            opacity: 1,
            z: 0,
            duration: 0.7,
            ease: 'none',
          },
          offset
        )
      })

      cardsNodes.forEach((card, index) => {
        const nextCard = cardsNodes[index + 1]
        if (!nextCard) return

        tl.to(
          card,
          {
            y: -260,
            scale: 0.92,
            opacity: 0,
            z: -160,
            duration: 0.7,
            ease: 'none',
          },
          0.45 + index * 0.24
        ).fromTo(
          nextCard,
          {
            y: 240,
            scale: 0.9,
            opacity: 0.4,
            z: -120,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            z: 0,
            duration: 0.7,
            ease: 'none',
          },
          0.45 + index * 0.24
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

      cardsNodes.forEach((card, index) => {
        if (!card) return
        gsap.to(card.querySelector('[data-float]'), {
          y: index % 2 === 0 ? -10 : 10,
          x: index % 2 === 0 ? 8 : -8,
          rotation: index % 2 === 0 ? 4 : -4,
          repeat: -1,
          yoyo: true,
          duration: 3.6 + index * 0.4,
          ease: 'sine.inOut',
        })
      })
    }, stack)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden px-4 py-20 text-white md:px-6"
      style={{ perspective: '2200px', transformStyle: 'preserve-3d' }}
    >
      <div ref={glowRef} className="absolute left-0 top-0 h-[28rem] w-[28rem] rounded-full bg-cyan-400/15 blur-[140px]" />
      <div className="absolute right-0 top-16 h-[26rem] w-[26rem] rounded-full bg-purple-500/15 blur-[140px]" />
      <div className="absolute bottom-0 left-1/4 h-[24rem] w-[24rem] rounded-full bg-emerald-400/12 blur-[140px]" />

      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs uppercase tracking-[0.35em] text-cyan-200 backdrop-blur-xl">
            <Star size={13} /> Stacked scroll cards
          </div>
          <h2 className="mt-6 text-[clamp(2.8rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
            Overlapping cards that move in depth.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            A pinned, scrubbed card stack creates the premium overlapping transition. Each card rises, passes over the previous one, and settles with true 3D depth.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-[2rem] border border-white/10 bg-[rgba(10,10,31,0.88)] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/8 pb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-slate-500">Stack console</div>
                <div className="mt-2 text-2xl font-black text-white">Pin, overlap, transition</div>
              </div>
              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                Live
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                'Top card exits smoothly',
                'Next card rises into view',
                'Z-depth and opacity shift together',
                'No blank sections between states',
              ].map((item) => (
                <div key={item} className="rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3 text-sm text-cyan-200">
                <Heart size={16} /> Scroll synced
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div ref={progressRef} className="h-full origin-left rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-[#ffd700]" style={{ transform: 'scaleX(0)' }} />
              </div>
            </div>
          </div>

          <div ref={stackRef} className="relative mx-auto h-[38rem] w-full max-w-3xl" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(0,245,255,0.08),transparent_30%),linear-gradient(180deg,rgba(5,5,16,0.7),rgba(10,10,31,0.72))]" />
            <div className="absolute left-6 top-6 text-xs uppercase tracking-[0.35em] text-slate-500">Cards stack</div>
            <div className="absolute right-6 top-6 text-xs uppercase tracking-[0.35em] text-cyan-200">Depth enabled</div>

            {cards.map((card, index) => {
              const Icon = card.icon
              return (
                <article
                  key={card.id}
                  ref={(el) => { cardRefs.current[index] = el }}
                  className={`absolute left-1/2 top-20 w-[92%] -translate-x-1/2 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${card.accent} p-6 shadow-[0_0_60px_rgba(0,0,0,0.25)] backdrop-blur-xl`}
                  style={{
                    zIndex: cards.length - index,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity',
                  }}
                >
                  <div data-float className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-slate-200">
                          {card.badge}
                        </div>
                        <h3 className="mt-5 max-w-2xl text-3xl font-black leading-tight text-white md:text-4xl">{card.title}</h3>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-cyan-200">
                        <Icon size={22} />
                      </div>
                    </div>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{card.copy}</p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4">
                        <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Channel</div>
                        <div className="mt-2 text-lg font-bold text-white">Social</div>
                      </div>
                      <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4">
                        <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Reward</div>
                        <div className="mt-2 text-lg font-bold text-cyan-200">+50 XP</div>
                      </div>
                      <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4">
                        <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Action</div>
                        <div className="mt-2 text-lg font-bold text-[#ffd700]">Post</div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3 text-sm uppercase tracking-[0.32em] text-slate-400">
                      <MessageSquare size={15} className="text-cyan-200" /> Comments enabled
                      <span className="h-1 w-1 rounded-full bg-slate-500" />
                      <Heart size={15} className="text-pink-300" /> Likes enabled
                    </div>
                  </div>
                </article>
              )
            })}

            <div className="pointer-events-none absolute bottom-6 right-6 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-200 backdrop-blur-md">
              Scroll to stack
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
