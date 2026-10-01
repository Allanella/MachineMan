'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowUpRight, Check, MessageCircle, Phone, Search } from 'lucide-react'
import { CTASection, Footer, Navbar, SectionHeading } from '@/components/site'
import { machines, phone, whatsapp, type Machine } from '@/lib/site-data'

const availabilityStyle: Record<Machine['availability'], { dot: string; text: string }> = {
  Available: { dot: 'bg-emerald-500', text: 'text-emerald-800' },
  'Limited Availability': { dot: 'bg-amber-500', text: 'text-amber-800' },
  'Contact for Availability': { dot: 'bg-sky-500', text: 'text-sky-800' },
}

function MachinesContent() {
  const searchParams = useSearchParams()

  const category = searchParams.get('category') ?? 'All'
  const q = (searchParams.get('q') ?? '').trim()
  const stockOnly = searchParams.get('stock') === '1'

  const categoryList = ['All', ...Array.from(new Set(machines.map((m) => m.category)))]
  const countFor = (c: string) => (c === 'All' ? machines.length : machines.filter((m) => m.category === c).length)

  const visible = machines.filter((m) => {
    if (category !== 'All' && m.category !== category) return false
    if (stockOnly && m.availability !== 'Available') return false
    if (!q) return true
    return [m.name, m.category, m.description, m.longDescription, m.idealFor]
      .filter(Boolean)
      .some((field) => field!.toLowerCase().includes(q.toLowerCase()))
  })

  const tabHref = (c: string) => {
    const params = new URLSearchParams()
    if (c !== 'All') params.set('category', c)
    if (q) params.set('q', q)
    if (stockOnly) params.set('stock', '1')
    const s = params.toString()
    return s ? `/machines?${s}` : '/machines'
  }

  return (
    <>
      {/* HEADER */}
      <section className="mx-auto max-w-7xl px-5 pb-10 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="The catalogue"
            title="Our Machines"
            text="Explore quality generators, tillers and industrial equipment available from Machine Man in Kampala. Can't see what you need? We'll source it for you."
          />
          <div className="flex gap-8 border-t border-black/10 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div>
              <p className="text-3xl font-black tracking-tight">{machines.length}</p>
              <p className="mt-1 text-xs text-[#707274]">Listings</p>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight">{categoryList.length - 1}</p>
              <p className="mt-1 text-xs text-[#707274]">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLBAR */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="border-y border-black/10 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <nav
              aria-label="Filter by category"
              className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {categoryList.map((c) => {
                const active = category === c
                return (
                  <Link
                    key={c}
                    href={tabHref(c)}
                    scroll={false}
                    aria-current={active ? 'true' : undefined}
                    className={`inline-flex shrink-0 items-center gap-2 border px-4 py-2.5 text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b84d] focus-visible:ring-offset-2 ${
                      active
                        ? 'border-[#111] bg-[#111] text-white'
                        : 'border-black/10 bg-white text-[#3d3f41] hover:border-black/30'
                    }`}
                  >
                    {c}
                    <span className={`text-[11px] font-bold ${active ? 'text-[#e6b84d]' : 'text-[#9a9c9e]'}`}>
                      {countFor(c)}
                    </span>
                  </Link>
                )
              })}
            </nav>

            <form action="/machines" method="get" className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {category !== 'All' && <input type="hidden" name="category" value={category} />}
              <label className="flex h-11 items-center gap-2 border border-black/10 bg-[#faf9f6] px-3 transition focus-within:border-[#111] focus-within:bg-white sm:w-64">
                <Search size={16} className="shrink-0 text-[#8a8c8e]" />
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Search machines"
                  aria-label="Search machines"
                  className="w-full bg-transparent text-[13px] placeholder:text-[#9a9c9e] focus:outline-none"
                />
              </label>
              <label className="flex h-11 cursor-pointer items-center gap-2 text-[13px] font-semibold text-[#3d3f41]">
                <input
                  type="checkbox"
                  name="stock"
                  value="1"
                  defaultChecked={stockOnly}
                  className="h-4 w-4 accent-[#111]"
                />
                In stock only
              </label>
              <button
                type="submit"
                className="h-11 bg-[#111] px-5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#e6b84d] hover:text-[#111]"
              >
                Apply
              </button>
            </form>
          </div>
        </div>

        <p className="mt-5 text-xs text-[#707274]">
          Showing <strong className="text-[#111]">{visible.length}</strong> of {machines.length} machines
          {(category !== 'All' || q || stockOnly) && (
            <Link href="/machines" className="ml-3 font-semibold text-[#8a610f] underline">
              Clear filters
            </Link>
          )}
        </p>

        {/* GRID */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((m) => {
            const style = availabilityStyle[m.availability]
            const specs = Object.entries(m.specs ?? {}).slice(0, 3)
            return (
              <article
                key={m.slug}
                className="group flex flex-col border border-black/10 bg-white transition duration-300 hover:-translate-y-1.5 hover:border-black/25 hover:shadow-[0_24px_40px_-24px_rgba(0,0,0,0.35)]"
              >
                <Link href={`/machines/${m.slug}`} className="block" aria-label={`View ${m.name}`}>
                  <div className="relative aspect-[1.25] overflow-hidden bg-[#f3f3f1]">
                    <img
                      src={m.image}
                      alt={m.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
                    <span
                      className={`absolute left-4 top-4 inline-flex items-center gap-2 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest ${style.text}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      {m.availability}
                    </span>
                    <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center bg-[#e6b84d] text-[#111] opacity-0 transition group-hover:opacity-100">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b27f19]">{m.category}</p>
                  <h3 className="mt-3 text-xl font-black tracking-tight">
                    <Link href={`/machines/${m.slug}`} className="transition hover:text-[#8a610f]">
                      {m.name}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#616467]">{m.description}</p>

                  {m.highlights && (
                    <ul className="mt-5 space-y-2">
                      {m.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-[13px] text-[#333]">
                          <Check size={15} className="mt-0.5 shrink-0 text-[#b27f19]" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  {m.idealFor && (
                    <div className="mt-5 border-l-2 border-[#e6b84d] bg-[#faf9f6] px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#8a610f]">Ideal for</p>
                      <p className="mt-1 text-[13px] leading-5 text-[#333]">{m.idealFor}</p>
                    </div>
                  )}

                  {specs.length > 0 && (
                    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-black/10 pt-5">
                      {specs.map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-[10px] font-semibold uppercase tracking-widest text-[#8a8c8e]">{k}</dt>
                          <dd className="mt-0.5 text-[13px] font-semibold text-[#111]">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                    <Link
                      href={`/machines/${m.slug}`}
                      className="inline-flex h-11 items-center justify-center border border-black/15 text-xs font-bold uppercase tracking-widest text-[#111] transition hover:border-[#111] hover:bg-[#111] hover:text-white"
                    >
                      Details
                    </Link>
                    <Link
                      href="/quote"
                      className="inline-flex h-11 items-center justify-center gap-2 bg-[#e6b84d] text-xs font-black uppercase tracking-widest text-[#111] transition hover:bg-[#111] hover:text-white"
                    >
                      Get quote <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {visible.length === 0 && (
          <div className="border border-dashed border-black/20 bg-[#faf9f6] px-6 py-16 text-center">
            <p className="text-lg font-black tracking-tight">No machines match your filters</p>
            <p className="mt-2 text-sm text-[#707274]">Try a different search, or ask us to source it for you.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/machines"
                className="inline-flex h-11 items-center border border-black/15 px-6 text-xs font-bold uppercase tracking-widest transition hover:bg-[#111] hover:text-white"
              >
                Clear filters
              </Link>
              <Link
                href="/quote"
                className="inline-flex h-11 items-center gap-2 bg-[#e6b84d] px-6 text-xs font-black uppercase tracking-widest text-[#111] transition hover:bg-[#111] hover:text-white"
              >
                Request a quote <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* HELP BANNER */}
      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <div className="relative overflow-hidden bg-[#111] px-6 py-10 text-white md:px-12 md:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#e6b84d]/15 blur-3xl"
          />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="eyebrow text-[#e6b84d]">Not sure which one?</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] md:text-4xl">Talk to us before you buy.</h2>
              <p className="mt-3 text-sm leading-7 text-white/60">
                Tell us the job and we will help you pick the right capacity and engine type, or source something
                specific for you.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/quote"
                className="inline-flex h-12 items-center gap-2 bg-[#e6b84d] px-6 text-xs font-black uppercase tracking-widest text-[#111] transition hover:bg-white"
              >
                Request a quote <ArrowUpRight size={15} />
              </Link>
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 border border-white/25 px-5 text-xs font-bold uppercase tracking-widest transition hover:bg-white hover:text-[#111]"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <a
                href={`tel:${phone}`}
                className="inline-flex h-12 items-center gap-2 border border-white/25 px-5 text-xs font-bold uppercase tracking-widest transition hover:bg-white hover:text-[#111]"
              >
                <Phone size={15} /> Call
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default function MachinesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <Suspense fallback={<div className="mx-auto max-w-7xl px-5 py-20 text-center text-sm">Loading catalogue...</div>}>
          <MachinesContent />
        </Suspense>
        <CTASection />
      </main>
      <Footer />
    </>
  )
}