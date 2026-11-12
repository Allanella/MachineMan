'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone, Share2 } from 'lucide-react'
import { ContactForm, CTASection, Footer, MachineCard, Navbar, SectionHeading } from '@/components/site'
import { imageUrls } from '@/lib/site-data'
import { useLive } from '@/lib/use-live'

/** Reads the real address-bar segment after /<section>/ (works for machines added later). */
function useUrlSlug(section: string, initial: string) {
  const [slug, setSlug] = useState(initial)
  useEffect(() => {
    const parts = window.location.pathname.split('/').filter(Boolean)
    const i = parts.indexOf(section)
    if (i >= 0 && parts[i + 1]) setSlug(decodeURIComponent(parts[i + 1]))
  }, [section])
  return slug
}

function NotFound({ what, href }: { what: string; href: string }) {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <section className="mx-auto max-w-3xl px-5 pb-32 pt-10 text-center lg:px-8">
          <p className="eyebrow text-[#b27f19]">404</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">{what} not found</h1>
          <p className="mt-3 text-sm text-[#707274]">It may have been removed or renamed.</p>
          <Link
            href={href}
            className="mt-8 inline-flex h-12 items-center bg-[#111] px-7 text-xs font-bold uppercase tracking-widest text-white"
          >
            Browse all
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}

function Loading() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <p className="px-5 py-32 text-center text-sm text-[#707274]">Loading…</p>
      </main>
      <Footer />
    </>
  )
}

/* ------------------------------------------------------------------ */
export function MachineDetailView({ initialSlug }: { initialSlug: string }) {
  const { machines, phone, ready } = useLive()
  const slug = useUrlSlug('machines', initialSlug)
  const machine = machines.find((m) => m.slug === slug)

  if (!machine) return ready ? <NotFound what="Machine" href="/machines" /> : <Loading />

  return (
    <>
      <Navbar />
      <main className="pt-28">
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="aspect-square bg-[#f3f3f1]">
            <img
              src={machine.image}
              alt={machine.name}
              className="h-full w-full object-contain mix-blend-multiply"
            />
          </div>
          <div className="self-center">
            <p className="eyebrow text-[#b27f19]">{machine.category}</p>
            <h1 className="mt-5 text-5xl font-black tracking-[-0.06em] md:text-7xl">{machine.name}</h1>

            {/* AVAILABILITY + PRICE */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-block bg-[#e6b84d] px-3 py-2 text-[10px] font-bold uppercase tracking-widest">
                {machine.availability}
              </span>
              {machine.price && (
                <span className="inline-block border border-[#b27f19]/30 bg-[#fdf8ea] px-4 py-2 text-sm font-black tracking-tight text-[#b27f19]">
                  {machine.price}
                </span>
              )}
            </div>

            <p className="mt-7 text-lg leading-8 text-[#686b6d]">{machine.description}</p>
            {machine.longDescription && machine.longDescription !== machine.description && (
              <p className="mt-4 text-base leading-7 text-[#686b6d]">{machine.longDescription}</p>
            )}

            {machine.specs && Object.keys(machine.specs).length > 0 && (
              <div className="mt-8 border-y border-black/10 py-6">
                {Object.entries(machine.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between border-b border-black/10 py-3 text-sm last:border-0"
                  >
                    <span className="text-[#777]">{key}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/quote"
                className="bg-[#111] px-6 py-4 text-xs font-bold uppercase tracking-widest text-white"
              >
                Request a Quote <ArrowUpRight className="ml-2 inline" size={14} />
              </Link>
              <a
                href={`tel:${phone}`}
                className="border border-black/20 px-6 py-4 text-xs font-bold uppercase tracking-widest"
              >
                Call Us
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <SectionHeading eyebrow="You may also like" title="Related machines" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[...machines.filter((m) => m.category === machine.category), ...machines]
              .filter((item, i, arr) => item.slug !== machine.slug && arr.findIndex((o) => o.slug === item.slug) === i)
              .slice(0, 3)
              .map((item) => (
                <MachineCard key={item.slug} machine={item} />
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

/* ------------------------------------------------------------------ */
export function CategoryView({ initialSlug }: { initialSlug: string }) {
  const { categories, machines, ready } = useLive()
  const slug = useUrlSlug('categories', initialSlug)
  const category = categories.find((c) => c.slug === slug)
  const [type, setType] = useState('')

  if (!category) return ready ? <NotFound what="Category" href="/machines" /> : <Loading />

  const all = machines.filter((m) => m.category === category.name)
  // Types such as Diesel / Petrol / Standby, taken from each machine's "Type" spec
  const types = Array.from(new Set(all.map((m) => m.specs?.Type).filter(Boolean) as string[]))
  const items = type ? all.filter((m) => m.specs?.Type === type) : all

  return (
    <>
      <Navbar />
      <main className="pt-32">
        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <SectionHeading eyebrow="Category" title={category.name} text={category.description} />
          {types.length > 1 && (
            <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter by type">
              {['', ...types].map((t) => (
                <button
                  key={t || 'all'}
                  type="button"
                  onClick={() => setType(t)}
                  className={`border px-4 py-2.5 text-[13px] font-semibold transition ${
                    type === t
                      ? 'border-[#111] bg-[#111] text-white'
                      : 'border-black/10 bg-white text-[#3d3f41] hover:border-black/30'
                  }`}
                >
                  {t || 'All'}
                </button>
              ))}
            </div>
          )}
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {items.length ? (
              items.map((machine) => <MachineCard key={machine.slug} machine={machine} />)
            ) : (
              <p className="text-[#666]">Machines in this category will appear here as the catalogue grows.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

/* ------------------------------------------------------------------ */
export function ServicesView() {
  const { services, s } = useLive()
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
          <SectionHeading eyebrow="How we help" title={s.services_title} text={s.services_intro} />
          <div className="mt-12 grid gap-px border border-black/10 bg-black/10 md:grid-cols-2">
            {services.map(([title, text], i) => (
              <div key={title + i} className="bg-white p-8 md:p-10">
                <span className="text-sm font-black text-[#b27f19]">0{i + 1}</span>
                <h2 className="mt-10 text-2xl font-black">{title}</h2>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#666]">{text}</p>
                <a
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                >
                  Contact us <ArrowUpRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </section>
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

/* ------------------------------------------------------------------ */
export function ProjectsView() {
  const { projects, s } = useLive()
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
          <SectionHeading eyebrow="Work in the field" title={s.projects_title} text={s.projects_intro} />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {projects.map((p, i) => (
              <article key={p.title + i} className="border border-black/10">
                {p.image && <img src={p.image} alt={p.title} className="aspect-video w-full object-cover" />}
                <div className="p-6">
                  {p.tag && <p className="eyebrow text-[#b27f19]">{p.tag}</p>}
                  <h2 className="mt-3 text-2xl font-black">{p.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#666]">{p.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

/* ------------------------------------------------------------------ */
export function AboutView() {
  const { s } = useLive()
  const blocks = [1, 2, 3, 4].map((n) => [s[`about_b${n}_title`], s[`about_b${n}_text`]])
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <SectionHeading eyebrow="About Machine Man" title={s.about_title} text={s.about_intro} />
            <div className="mt-10 grid gap-6 text-sm leading-7 text-[#666] md:grid-cols-2">
              {blocks.map(([title, text]) => (
                <div key={title}>
                  <strong className="block text-[#111]">{title}</strong>
                  {text}
                </div>
              ))}
            </div>
          </div>
          <div className="aspect-[.85] bg-[#f3f3f1]">
            <img
              src={s.about_image || imageUrls.tiller}
              alt="Machine Man equipment"
              className="h-full w-full object-contain mix-blend-multiply"
            />
          </div>
        </section>
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

/* ------------------------------------------------------------------ */
export function ContactView() {
  const { s, phone, email, address, whatsapp } = useLive()
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            {/* LEFT COLUMN: CONTACT DETAILS & SOCIALS */}
            <div className="flex flex-col justify-between space-y-8">
              <div>
                <SectionHeading eyebrow="Get in touch" title={s.contact_title} text={s.contact_intro} />

                {/* DIRECT QUICK CONTACT BUTTONS */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 border border-[#25D366]/30 bg-[#25D366]/10 p-4 transition hover:bg-[#25D366] hover:text-white"
                  >
                    <div className="grid h-10 w-10 place-items-center bg-[#25D366] text-white group-hover:bg-white group-hover:text-[#25D366]">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Chat directly</p>
                      <p className="text-sm font-black">WhatsApp Us</p>
                    </div>
                  </a>

                  <a
                    href={s.tiktok_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 border border-black/20 bg-black/5 p-4 transition hover:bg-black hover:text-white"
                  >
                    <div className="grid h-10 w-10 place-items-center bg-black text-white group-hover:bg-white group-hover:text-black">
                      <Share2 size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Follow our videos</p>
                      <p className="text-sm font-black">{s.tiktok_label}</p>
                    </div>
                  </a>
                </div>

                {/* DETAILED CONTACT LIST */}
                <div className="mt-10 space-y-6 border-t border-black/10 pt-8 text-sm">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center bg-[#f3f3f1] text-[#b27f19]">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold uppercase tracking-wider text-[#111]">
                        Location / Address
                      </strong>
                      <span className="mt-1 block leading-relaxed text-[#5c5e60]">{address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center bg-[#f3f3f1] text-[#b27f19]">
                      <Phone size={18} />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold uppercase tracking-wider text-[#111]">
                        Phone &amp; WhatsApp
                      </strong>
                      <a
                        href={`tel:${phone}`}
                        className="mt-1 block font-medium text-[#111] transition hover:text-[#b27f19]"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center bg-[#f3f3f1] text-[#b27f19]">
                      <Mail size={18} />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold uppercase tracking-wider text-[#111]">
                        Email Address
                      </strong>
                      <a
                        href={`mailto:${email}`}
                        className="mt-1 block font-medium text-[#111] transition hover:text-[#b27f19]"
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* GOOGLE MAPS EMBED */}
              <div className="mt-8 border border-black/10 bg-white p-2 shadow-sm">
                <iframe
                  src={s.maps_embed_url}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Machine Man Location"
                ></iframe>
              </div>

              {/* STORE HOURS BANNER */}
              <div className="border border-black/10 bg-[#f9f9f8] p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#b27f19]">Working Hours</p>
                <p className="mt-1 text-xs font-bold text-[#111]">{s.hours_line1}</p>
                <p className="text-xs text-[#777]">{s.hours_line2}</p>
              </div>
            </div>

            {/* RIGHT COLUMN: INQUIRY FORM */}
            <div className="border border-black/10 bg-white p-8 shadow-sm md:p-12">
              <p className="eyebrow text-[#b27f19]">Send an inquiry</p>
              <h2 className="mb-8 mt-2 text-3xl font-black tracking-tight">Tell us what equipment you need.</h2>
              <ContactForm />
            </div>
          </div>
        </section>
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
