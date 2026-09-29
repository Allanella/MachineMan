'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { CTASection, Footer, Navbar, SectionHeading } from '@/components/site'
import { imageUrls } from '@/lib/site-data'

type Filter = 'All' | 'Generators' | 'Tillers' | 'Engines' | 'Hardware'

type GalleryImage = {
  src: string
  alt: string
  category: Exclude<Filter, 'All'>
}

const images: GalleryImage[] = [
  { src: imageUrls.generator, alt: 'Perkins Generator', category: 'Generators' },
  { src: imageUrls.tiller, alt: 'Diesel Power Tiller', category: 'Tillers' },
  { src: imageUrls.machineExtra1, alt: 'Industrial Diesel Driver Engine', category: 'Engines' },
  { src: imageUrls.machineExtra2, alt: 'Compact Silent Generator', category: 'Generators' },
  { src: imageUrls.machineExtra3, alt: 'Multi-Purpose Rotary Tiller', category: 'Tillers' },
  { src: imageUrls.arquivo1, alt: 'Heavy Duty Site Hardware', category: 'Hardware' },
  { src: imageUrls.arquivo2, alt: 'Commercial Power Unit', category: 'Generators' },
  { src: imageUrls.arquivo3, alt: 'Agricultural Tiller Assembly', category: 'Tillers' },
  { src: imageUrls.arquivo4, alt: 'Field Machinery Gear System', category: 'Tillers' },
  { src: imageUrls.arquivo5, alt: 'Enclosed Power Unit', category: 'Generators' },
  { src: imageUrls.arquivo6, alt: 'Heavy Land Cultivator', category: 'Tillers' },
  { src: imageUrls.arquivo7, alt: 'Industrial Engine Gearhead', category: 'Engines' },
  { src: imageUrls.arquivo8, alt: 'High-Torque Drive Motor', category: 'Engines' },
  { src: imageUrls.arquivo9, alt: 'Heavy Cultivator Blades', category: 'Tillers' },
  { src: imageUrls.arquivo10, alt: 'Compact Power Generator Core', category: 'Generators' },
  { src: imageUrls.arquivo11, alt: 'Rotary Tiller Gearbox', category: 'Tillers' },
  { src: imageUrls.arquivo12, alt: 'Site Power Control Unit', category: 'Generators' },
  { src: imageUrls.arquivo13, alt: 'Custom Hardware Supply', category: 'Hardware' },
]

const filters: Filter[] = ['All', 'Generators', 'Tillers', 'Engines', 'Hardware']

export default function GalleryPage() {
  const [filter, setFilter] = useState<Filter>('All')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const visible = useMemo(
    () => (filter === 'All' ? images : images.filter((i) => i.category === filter)),
    [filter]
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: images.length }
    images.forEach((i) => (c[i.category] = (c[i.category] || 0) + 1))
    return c
  }, [])

  const close = useCallback(() => setLightbox(null), [])
  const next = useCallback(
    () => setLightbox((i) => (i === null ? i : (i + 1) % visible.length)),
    [visible.length]
  )
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? i : (i - 1 + visible.length) % visible.length)),
    [visible.length]
  )

  // Keyboard controls + scroll lock while the lightbox is open
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, close, next, prev])

  const current = lightbox !== null ? visible[lightbox] : null

  return (
    <>
      <Navbar />
      <main className="pt-32">
        {/* HEADER */}
        <section className="mx-auto max-w-7xl px-5 pb-10 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="The visual catalogue"
              title="Gallery"
              text="A growing look at the generators, tillers, engines and hardware we stock at Machine Man."
            />
            <div className="flex gap-8 border-t border-black/10 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <div>
                <p className="text-3xl font-black tracking-tight">{images.length}</p>
                <p className="mt-1 text-xs text-[#707274]">Photos</p>
              </div>
              <div>
                <p className="text-3xl font-black tracking-tight">{filters.length - 1}</p>
                <p className="mt-1 text-xs text-[#707274]">Equipment types</p>
              </div>
            </div>
          </div>

          {/* FILTER BAR */}
          <div
            role="tablist"
            aria-label="Filter gallery"
            className="mt-10 flex gap-2 overflow-x-auto border-y border-black/10 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filters.map((f) => {
              const active = filter === f
              return (
                <button
                  key={f}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f)}
                  className={`inline-flex shrink-0 items-center gap-2 border px-4 py-2.5 text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b84d] focus-visible:ring-offset-2 ${
                    active
                      ? 'border-[#111] bg-[#111] text-white'
                      : 'border-black/10 bg-white text-[#3d3f41] hover:border-black/30'
                  }`}
                >
                  {f}
                  <span
                    className={`text-[11px] font-bold ${active ? 'text-[#e6b84d]' : 'text-[#9a9c9e]'}`}
                  >
                    {counts[f]}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* GRID */}
        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <div key={filter} className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {visible.map((item, i) => (
              <button
                key={item.src + i}
                onClick={() => setLightbox(i)}
                aria-label={`View ${item.alt}`}
                className="group relative mb-5 block w-full break-inside-avoid overflow-hidden border border-black/10 bg-[#f3f3f1] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b84d] focus-visible:ring-offset-2 animate-in fade-in"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/10 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <p className="text-xs font-semibold text-[#e6b84d]">{item.category}</p>
                  <p className="mt-1 text-base font-bold text-white">{item.alt}</p>
                </div>
                <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center bg-white/95 text-[#111] opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Maximize2 size={15} />
                </span>
              </button>
            ))}
          </div>

          {visible.length === 0 && (
            <p className="py-20 text-center text-sm text-[#707274]">No photos in this category yet.</p>
          )}

          {/* INLINE PROMPT */}
          <div className="mt-6 flex flex-col items-start justify-between gap-4 border border-black/10 bg-[#faf9f6] p-6 md:flex-row md:items-center md:p-8">
            <div>
              <p className="text-lg font-black tracking-tight">Don&apos;t see the machine you need?</p>
              <p className="mt-1 text-sm text-[#707274]">
                We stock more than we can photograph. Tell us what you&apos;re looking for.
              </p>
            </div>
            <a
              href="/quote"
              className="inline-flex h-11 shrink-0 items-center gap-2 bg-[#111] px-6 text-[13px] font-bold text-white transition hover:bg-[#e6b84d] hover:text-[#111]"
            >
              Request a quote <ArrowUpRight size={15} />
            </a>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />

      {/* LIGHTBOX */}
      {current && lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[70] flex flex-col bg-[#0b0b0b]/95 backdrop-blur-sm animate-in fade-in"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 text-white lg:px-8">
            <div>
              <p className="text-sm font-bold">{current.alt}</p>
              <p className="mt-0.5 text-xs text-white/50">
                {current.category} · {lightbox + 1} of {visible.length}
              </p>
            </div>
            <button
              onClick={close}
              aria-label="Close"
              className="grid h-11 w-11 place-items-center border border-white/20 transition hover:bg-white hover:text-[#111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b84d]"
            >
              <X size={20} />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 md:px-20"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) close()
            }}
          >
            {visible.length > 1 && (
              <button
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-3 z-10 grid h-12 w-12 place-items-center border border-white/20 bg-black/40 text-white transition hover:bg-[#e6b84d] hover:text-[#111] md:left-6"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            <img
              key={current.src}
              src={current.src}
              alt={current.alt}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain animate-in fade-in"
            />
            {visible.length > 1 && (
              <button
                onClick={next}
                aria-label="Next photo"
                className="absolute right-3 z-10 grid h-12 w-12 place-items-center border border-white/20 bg-black/40 text-white transition hover:bg-[#e6b84d] hover:text-[#111] md:right-6"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}