import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Code2,
  Heart,
  MessageSquare,
  Rocket,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const posts = [
  {
    author: 'Ava',
    title: 'Built a responsive dashboard',
    body: 'Just finished the project tutorial and posted the final build to the feed.',
    stats: '128 likes • 24 comments',
    accent: '#00f5ff',
  },
  {
    author: 'Noah',
    title: 'Launched my custom portfolio',
    body: 'Saved my own project after wiring the editor, API calls, and the run flow.',
    stats: '94 likes • 18 comments',
    accent: '#7b2fff',
  },
  {
    author: 'Mina',
    title: 'Finished a Python automation quest',
    body: 'The tutorial completion post made the achievement feel like a social milestone.',
    stats: '76 likes • 11 comments',
    accent: '#00ff88',
  },
]

export default function CommunitySection() {
  const sectionRef = useRef(null)
  const postRefs = useRef([])
  const galleryRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const ctx = gsap.context(() => {
      postRefs.current.forEach((post, index) => {
        if (!post) return
        gsap.to(post, {
          y: index % 2 === 0 ? -90 : -40,
          x: index % 2 === 0 ? 24 : -24,
          rotateY: index % 2 === 0 ? 8 : -8,
          rotateX: 4,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      gsap.to(galleryRef.current, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const hoverEnter = (event) => {
    gsap.to(event.currentTarget, {
      y: -10,
      rotateX: 5,
      rotateY: 6,
      scale: 1.02,
      duration: 0.35,
      ease: 'power2.out',
    })
  }

  const hoverLeave = (event) => {
    gsap.to(event.currentTarget, {
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  return (
    <section ref={sectionRef} id="community" className="relative min-h-screen overflow-hidden px-4 py-20 text-white md:px-6" style={{ perspective: '1800px', transformStyle: 'preserve-3d' }}>
      <div className="absolute left-0 top-0 h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="absolute right-0 top-16 h-[28rem] w-[28rem] rounded-full bg-purple-500/10 blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 h-[20rem] w-[20rem] rounded-full bg-emerald-400/10 blur-[120px]" />

      <div ref={galleryRef} className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs uppercase tracking-[0.35em] text-cyan-200 backdrop-blur-xl">
            <Users size={13} /> Community feed
          </div>
          <h2 className="mt-6 text-[clamp(2.8rem,6vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
            Social posts with depth and parallax.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            The community section layers cards at different scroll speeds so the feed feels alive, dimensional, and premium.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-[2rem] border border-white/10 bg-[rgba(10,10,31,0.92)] p-6 backdrop-blur-xl" style={{ willChange: 'transform' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-slate-500">Live feed</div>
                <div className="mt-2 text-2xl font-black text-white">Project wins and social proof</div>
              </div>
              <Code2 size={24} className="text-cyan-200" />
            </div>

            <div className="mt-6 space-y-4">
              {posts.map((post, index) => (
                <article
                  key={post.title}
                  ref={(el) => { postRefs.current[index] = el }}
                  onMouseEnter={hoverEnter}
                  onMouseLeave={hoverLeave}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-transform duration-300"
                  style={{
                    boxShadow: `0 0 0 1px ${post.accent}25, 0 0 32px ${post.accent}15`,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.35em] text-slate-500">{post.author}</div>
                      <h3 className="mt-2 text-xl font-bold text-white">{post.title}</h3>
                    </div>
                    <Sparkles size={18} className="text-cyan-200" />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{post.body}</p>
                  <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
                    <span>{post.stats}</span>
                    <span className="inline-flex items-center gap-2 text-cyan-200"><Heart size={13} /> social</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.35em] text-slate-500">Post highlights</div>
                  <div className="mt-2 text-2xl font-black text-white">Tutorials completed</div>
                </div>
                <MessageSquare size={24} className="text-cyan-200" />
              </div>
              <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <div className="text-sm leading-7 text-slate-300">
                  Tutorial completions automatically create feed posts, making the learning journey visible and shareable.
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.34em] text-cyan-200">
                  <Zap size={13} /> +50 XP
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[rgba(10,10,31,0.92)] p-6 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.35em] text-slate-500">Community sections</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  'Project Tutorials Completed',
                  'Projects Built',
                  'Showcase',
                  'Leaderboard',
                ].map((item) => (
                  <div key={item} className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
