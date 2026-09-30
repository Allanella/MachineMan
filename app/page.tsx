'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight, CheckCircle2, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { CTASection, FeatureStrip, Footer, MachineCard, Navbar, SectionHeading } from '@/components/site'
import { categories, imageUrls, machines, galleryImages, whatsapp } from '@/lib/site-data'

const HERO_MS = 5500

/** Drops repeated photos so no image shows twice in the same slider. */
function uniqueByUrl<T extends { url: string }>(items: T[]): T[] {
  return items.filter((item, i, arr) => arr.findIndex((o) => o.url === item.url) === i)
}

const heroImages = uniqueByUrl([
  { url: imageUrls.generator, label: 'Heavy Power Generators' },
  { url: imageUrls.tiller, label: 'Agricultural Power Tillers' },
  { url: imageUrls.arquivo7, label: 'Industrial Engine Gearheads' },
  { url: imageUrls.arquivo8, label: 'High-Torque Drive Systems' },
  { url: imageUrls.machineExtra2, label: 'Silent Commercial Generators' },
])

const showcaseImages = uniqueByUrl([
  { url: imageUrls.tiller, label: 'Agricultural & Field Machinery' },
  { url: imageUrls.arquivo9, label: 'Heavy Field Cultivator Hardware' },
  { url: imageUrls.arquivo11, label: 'Precision Tiller Gearbox' },
  { url: imageUrls.arquivo13, label: 'Custom Industrial Supply' },
])

/** Fades and lifts content into view once, when it scrolls on screen. */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)
  const [showcaseIndex, setShowcaseIndex] = useState(0)

  const nextHero = () => setHeroIndex((p) => (p + 1) % heroImages.length)
  const prevHero = () => setHeroIndex((p) => (p - 1 + heroImages.length) % heroImages.length)

  // Auto transition showcase block image
  useEffect(() => {
    const timer = setInterval(() => {
      setShowcaseIndex((prev) => (prev + 1) % showcaseImages.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <style>{`
        @keyframes hero-progress { from { transform: scaleX(0) } to { transform: scaleX(1) } }
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes nudge { 0%,100% { transform: translateY(0) } 50% { transform: translateY(6px) } }
        .hero-progress { transform-origin: left; animation: hero-progress ${HERO_MS}ms linear forwards; }
        .marquee-track { animation: marquee 40s linear infinite; }
        .marquee:hover .marquee-track { animation-play-state: paused; }
        .nudge { animation: nudge 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hero-progress { animation: none; transform: scaleX(1); }
          .marquee-track, .nudge { animation: none; }
        }
      `}</style>

      <Navbar />
      <main>
        {/* HERO SECTION WITH ANIMATED FADING IMAGE BACKGROUND */}
        <section
          className="relative flex min-h-[92vh] items-end overflow-hidden bg-[#111] pt-28"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
        >
          {heroImages.map((item, idx) => (
            <div
              key={item.url}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === heroIndex ? 'opacity-50' : 'opacity-0'
              }`}
              aria-hidden={idx !== heroIndex}
            >
              <img
                src={item.url}
                alt={item.label}
                referrerPolicy="no-referrer"
                className={`h-full w-full object-cover transition-transform ease-out ${
                  idx === heroIndex ? 'scale-110 duration-[7000ms]' : 'scale-100 duration-1000'
                }`}
              />
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
          {/* subtle blueprint grid */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:64px_64px]"
          />

          <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 pb-20 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8 lg:pb-28">
            <div className="max-w-3xl text-white">
              <div className="inline-flex items-center gap-2 border border-[#e6b84d]/40 bg-[#e6b84d]/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.2em] text-[#e6b84d] uppercase backdrop-blur-sm">
                <Zap size={14} /> MACHINEMAN HARDWARE · KAMPALA, UGANDA
              </div>

              <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl md:text-8xl">
                QUALITY MACHINES.<br />
                <span className="bg-gradient-to-r from-[#e6b84d] to-[#f7d98a] bg-clip-text text-transparent">
                  BUILT FOR THE JOB.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                Your reliable partner for industrial, power, and agricultural equipment in Kampala, Uganda. We connect contractors, farmers, and businesses with dependable machinery.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/machines"
                  className="group inline-flex items-center gap-3 bg-[#e6b84d] px-7 py-4 text-xs font-black uppercase tracking-widest text-[#111] shadow-[0_10px_30px_-10px_rgba(230,184,77,0.6)] transition hover:bg-white"
                >
                  Explore Catalogue
                  <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-3 border border-white/30 bg-white/5 px-7 py-4 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition hover:border-white hover:bg-white/10"
                >
                  Request a Quote
                </Link>
              </div>

              {/* SLIDER CONTROLS & INDICATORS */}
              <div className="mt-12 flex flex-wrap items-center gap-4">
                <button
                  onClick={prevHero}
                  className="grid h-9 w-9 place-items-center border border-white/20 text-white transition hover:bg-white hover:text-black"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-2">
                  {heroImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHeroIndex(idx)}
                      className={`relative h-1.5 overflow-hidden bg-white/25 transition-all duration-500 ${
                        idx === heroIndex ? 'w-14' : 'w-5 hover:bg-white/50'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    >
                      {idx === heroIndex && (
                        <span
                          key={heroIndex}
                          onAnimationEnd={nextHero}
                          style={{ animationPlayState: heroPaused ? 'paused' : 'running' }}
                          className="hero-progress absolute inset-0 bg-[#e6b84d]"
                        />
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={nextHero}
                  className="grid h-9 w-9 place-items-center border border-white/20 text-white transition hover:bg-white hover:text-black"
                  aria-label="Next slide"
                >
                  <ChevronRight size={16} />
                </button>
                <span className="ml-2 font-mono text-xs text-white/50">
                  {String(heroIndex + 1).padStart(2, '0')} / {String(heroImages.length).padStart(2, '0')}
                  <span className="mx-2 text-white/20">|</span>
                  <span key={heroIndex} className="animate-in fade-in text-white/70">
                    {heroImages[heroIndex].label}
                  </span>
                </span>
              </div>
            </div>

            {/* THUMBNAIL RAIL */}
            <div className="hidden w-56 flex-col gap-2 lg:flex">
              {heroImages.map((item, idx) => (
                <button
                  key={item.url}
                  onClick={() => setHeroIndex(idx)}
                  aria-label={item.label}
                  className={`group relative flex items-center gap-3 border p-1.5 pr-3 text-left backdrop-blur-md transition ${
                    idx === heroIndex
                      ? 'border-[#e6b84d] bg-white/10'
                      : 'border-white/10 bg-black/20 hover:border-white/40'
                  }`}
                >
                  <img
                    src={item.url}
                    alt=""
                    referrerPolicy="no-referrer"
                    className={`h-11 w-11 shrink-0 object-cover transition ${
                      idx === heroIndex ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                    }`}
                  />
                  <span
                    className={`text-[11px] font-semibold leading-tight transition ${
                      idx === heroIndex ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 xl:flex">
            Scroll to explore <ArrowDown size={16} className="nudge" />
          </div>
        </section>

        {/* CATEGORY MARQUEE */}
        <div className="marquee overflow-hidden border-y border-black/10 bg-[#e6b84d] py-4">
          <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
            {[...categories, ...categories, ...categories, ...categories].map((c, i) => (
              <span key={i} className="flex items-center gap-10 text-sm font-black uppercase tracking-[0.18em] text-[#111]">
                {c.name}
                <Zap size={14} className="fill-[#111]" />
              </span>
            ))}
          </div>
        </div>

        {/* FEATURES STRIP */}
        <FeatureStrip />

        {/* CATALOGUE SECTION */}
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 md:py-28">
          <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="The catalogue"
              title="Featured Equipment"
              text="Explore our featured range of machines available directly from our Kampala stock."
            />
            <Link
              href="/machines"
              className="group inline-flex items-center gap-2 border-b-2 border-transparent pb-1 text-xs font-bold uppercase tracking-widest transition hover:border-[#b27f19] hover:text-[#b27f19]"
            >
              View all machines ({machines.length})
              <ArrowUpRight size={15} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {machines.map((machine, i) => (
              <Reveal key={machine.slug} delay={(i % 3) * 90}>
                <div className="h-full transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-24px_rgba(0,0,0,0.35)]">
                  <MachineCard machine={machine} />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ABOUT & MOTION SHOWCASE SECTION */}
        <section className="mx-auto grid max-w-7xl gap-14 px-5 py-20 lg:grid-cols-2 lg:items-center lg:px-8 md:py-28">
          <Reveal>
            <div className="relative">
              {/* offset accent frame */}
              <div aria-hidden className="absolute -bottom-4 -right-4 h-full w-full border-2 border-[#e6b84d]" />
              <div className="relative aspect-[1.1] overflow-hidden border border-black/10 bg-[#f3f3f1]">
                {showcaseImages.map((item, idx) => (
                  <img
                    key={item.url}
                    src={item.url}
                    alt={item.label}
                    referrerPolicy="no-referrer"
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out ${
                      idx === showcaseIndex ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
                    }`}
                  />
                ))}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 border border-black/10 bg-white/90 p-5 backdrop-blur-md">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#b27f19]">Rotating Showcase</p>
                      <p key={showcaseIndex} className="animate-in fade-in slide-in-from-bottom-1 mt-1 text-base font-black text-[#111]">
                        {showcaseImages[showcaseIndex].label}
                      </p>
                    </div>
                    <div className="flex gap-1.5 pb-1.5">
                      {showcaseImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setShowcaseIndex(idx)}
                          aria-label={`Show image ${idx + 1}`}
                          className={`h-1.5 transition-all ${idx === showcaseIndex ? 'w-6 bg-[#b27f19]' : 'w-2 bg-black/20 hover:bg-black/40'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <SectionHeading
              eyebrow="About Machine Man"
              title="Your Machinery Partner in Kampala"
              text="Machineman Hardware is situated on Nabugabo Road, Kampala. We specialize in supplying reliable power equipment, tillers, and industrial hardware."
            />

            <div className="mt-8 space-y-3 text-sm text-[#616467]">
              {[
                ['Practical Equipment:', 'Handpicked machinery tested for regional working conditions.'],
                ['Direct Consultation:', 'We help you choose the right capacity and engine type before buying.'],
                ['Sourcing Assistance:', 'Need specialized hardware? We leverage our network to source for you.'],
              ].map(([title, text]) => (
                <p
                  key={title}
                  className="group flex items-start gap-3 border border-black/[0.08] bg-white p-4 transition hover:border-[#e6b84d] hover:shadow-md"
                >
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#b27f19] transition group-hover:scale-110" />
                  <span>
                    <strong className="text-[#111]">{title}</strong> {text}
                  </span>
                </p>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border-b-2 border-[#111] pb-1 text-xs font-black uppercase tracking-widest text-[#111] transition hover:border-[#b27f19] hover:text-[#b27f19]"
              >
                Learn More About Us <ArrowUpRight size={14} />
              </Link>
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1fa855] hover:underline"
              >
                WhatsApp Direct <ArrowUpRight size={14} />
              </a>
            </div>
          </Reveal>
        </section>

        {/* DYNAMIC GALLERY PREVIEW STRIP */}
        <section className="border-t border-black/10 bg-[#f8f8f6] py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="Stock Showcase"
                title="Equipment Gallery"
                text="A visual snapshot of our heavy machinery, power tillers, and industrial units."
              />
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-2 border-b-2 border-transparent pb-1 text-xs font-bold uppercase tracking-widest transition hover:border-[#b27f19] hover:text-[#b27f19]"
              >
                View Full Gallery ({galleryImages.length})
                <ArrowUpRight size={15} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>

            {/* Bento layout: first tile is featured, a few tiles span wider on desktop */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:auto-rows-[230px] lg:grid-cols-4">
              {galleryImages.slice(0, 6).map((item, idx) => {
                const span =
                  idx === 0 ? 'lg:col-span-2 lg:row-span-2' : idx >= 3 ? 'lg:col-span-2' : ''
                return (
                  <Reveal key={item.id} delay={(idx % 3) * 80} className={span}>
                    <Link
                      href="/gallery"
                      className="group relative block aspect-[4/3] h-full w-full overflow-hidden border border-black/10 bg-white lg:aspect-auto"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 transition duration-300 lg:opacity-0 lg:group-hover:opacity-100" />
                      <div className="absolute inset-x-0 bottom-0 translate-y-0 p-5 text-white opacity-100 transition duration-300 lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#e6b84d]">{item.category}</p>
                        <p className={`mt-1 font-bold ${idx === 0 ? 'text-lg' : 'text-sm'}`}>{item.title}</p>
                      </div>
                      <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center bg-[#e6b84d] text-[#111] opacity-0 transition duration-300 group-hover:opacity-100">
                        <ArrowUpRight size={16} />
                      </span>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="relative overflow-hidden bg-[#111] px-5 py-20 text-white md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#e6b84d]/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl lg:px-8">
            <Reveal>
              <SectionHeading
                light
                eyebrow="Explore by application"
                title="Equipment Categories"
                text="A focused selection of core machine categories, tailored for tough operating environments."
              />
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {categories.map((category, idx) => (
                <Reveal key={category.slug} delay={idx * 100}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="group relative flex min-h-[380px] flex-col justify-end overflow-hidden border border-white/10 p-8 transition duration-300 hover:-translate-y-1.5 hover:border-[#e6b84d]/70"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-110 group-hover:opacity-65"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <span className="absolute right-6 top-6 grid h-11 w-11 -translate-y-2 place-items-center border border-white/20 bg-black/30 text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:translate-y-0 group-hover:border-[#e6b84d] group-hover:bg-[#e6b84d] group-hover:text-[#111] group-hover:opacity-100">
                      <ArrowUpRight size={18} />
                    </span>

                    <div className="relative">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#e6b84d]">
                        0{idx + 1} // Category
                      </span>
                      <h3 className="mt-2 text-2xl font-black text-white transition-colors group-hover:text-[#e6b84d]">
                        {category.name}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-white/70">{category.description}</p>
                      <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                        Browse Category
                        <span className="h-px w-6 bg-[#e6b84d] transition-all duration-300 group-hover:w-12" />
                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <CTASection />
      </main>
      <Footer />
    </>
  )
}