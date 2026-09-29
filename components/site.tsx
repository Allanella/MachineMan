'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Wrench,
  Users,
  Search,
  ChevronRight,
  CornerDownLeft,
} from 'lucide-react'
import { address, categories, email, machines, navItems, phone, whatsapp, type Machine } from '@/lib/site-data'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Machine Man home">
      <div className="relative flex h-10 items-center transition-transform duration-300 group-hover:scale-105">
        <img
          src="/logo.png"
          alt="Machine Man Logo"
          className={`h-10 w-auto object-contain ${light ? 'brightness-0 invert' : ''}`}
        />
      </div>
    </Link>
  )
}

type DropdownId = 'categories' | 'machines' | null

const navLinkBase =
  'relative inline-flex items-center gap-1 py-2 text-[13px] font-semibold tracking-wide text-[#3d3f41] transition-colors hover:text-[#111] focus-visible:outline-none focus-visible:text-[#111] after:absolute after:inset-x-0 after:-bottom-[27px] after:h-[2px] after:origin-left after:scale-x-0 after:bg-[#e6b84d] after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100'

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<DropdownId>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const isActive = useCallback(
    (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')),
    [pathname]
  )

  // Header state on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
    setSearchOpen(false)
    setSearchQuery('')
  }, [pathname])

  // Click outside closes dropdowns
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setActiveDropdown(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // Keyboard: Esc closes, Ctrl/Cmd+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null)
        setSearchOpen(false)
        setMobileOpen(false)
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Lock body scroll for overlays
  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen, searchOpen])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  const openDropdown = (id: DropdownId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveDropdown(id)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 140)
  }

  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []
    return machines.filter((m) => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)).slice(0, 8)
  }, [searchQuery])

  const closeSearch = () => {
    setSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <header ref={navRef} className="fixed inset-x-0 top-0 z-50">
      {/* UTILITY BAR — collapses on scroll */}
      <div
        className={`hidden overflow-hidden bg-[#111] text-xs text-white/75 transition-all duration-300 md:block ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
        }`}
      >
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-5 lg:px-8">
          <span className="flex items-center gap-2">
            <MapPin size={13} className="text-[#e6b84d]" />
            {address}
          </span>
          <div className="flex items-center gap-7">
            <a href={`tel:${phone}`} className="flex items-center gap-2 transition hover:text-[#e6b84d]">
              <Phone size={13} className="text-[#e6b84d]" />
              {phone}
            </a>
            <span className="h-3 w-px bg-white/20" aria-hidden />
            <a href={`mailto:${email}`} className="flex items-center gap-2 transition hover:text-[#e6b84d]">
              <Mail size={13} className="text-[#e6b84d]" />
              {email}
            </a>
          </div>
        </div>
      </div>

      {/* MAIN BAR */}
      <div
        className={`relative border-b bg-white transition-all duration-300 ${
          scrolled ? 'border-black/10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]' : 'border-black/[0.07]'
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 transition-all duration-300 lg:px-8 ${
            scrolled ? 'h-[64px]' : 'h-[76px]'
          }`}
        >
          <Logo />

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {navItems.map(([label, href]) => {
              const isCategories = label === 'Categories'
              const isMachines = label === 'Machines'
              const id: DropdownId = isCategories ? 'categories' : isMachines ? 'machines' : null

              if (id) {
                const open = activeDropdown === id
                return (
                  <div key={href} className="relative" onMouseEnter={() => openDropdown(id)} onMouseLeave={scheduleClose}>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-haspopup="true"
                      onClick={() => setActiveDropdown(open ? null : id)}
                      className={`${navLinkBase} ${isActive(href) || open ? 'text-[#111]' : ''}`}
                    >
                      {label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${open ? 'rotate-180 text-[#b27f19]' : ''}`}
                      />
                    </button>
                    {(isActive(href) || open) && (
                      <span className="pointer-events-none absolute inset-x-0 -bottom-[27px] h-[2px] bg-[#e6b84d]" />
                    )}

                    {open && (
                      <div
                        className={`absolute left-1/2 top-full -translate-x-1/2 pt-[27px] ${
                          isCategories ? 'w-[680px]' : 'w-[520px]'
                        }`}
                      >
                        <div className="animate-in fade-in slide-in-from-top-2 border border-black/10 bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.3)]">
                          <div className="flex items-center justify-between border-b border-black/10 bg-[#faf9f6] px-6 py-3.5">
                            <span className="text-sm font-bold text-[#111]">
                              {isCategories ? 'Shop by category' : 'Featured machines'}
                            </span>
                            <Link
                              href={href}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#8a610f] hover:text-[#111]"
                            >
                              {isCategories ? 'View all categories' : 'Browse all machines'}
                              <ArrowUpRight size={13} />
                            </Link>
                          </div>

                          {isCategories ? (
                            <div className="grid grid-cols-3 gap-3 p-5">
                              {categories.map((cat) => (
                                <Link
                                  key={cat.slug}
                                  href={`/categories/${cat.slug}`}
                                  className="group block focus-visible:outline-none"
                                >
                                  <div className="aspect-[16/10] overflow-hidden bg-[#f3f3f1] ring-1 ring-black/5 transition group-hover:ring-[#e6b84d] group-focus-visible:ring-2 group-focus-visible:ring-[#e6b84d]">
                                    <img
                                      src={cat.image}
                                      alt=""
                                      referrerPolicy="no-referrer"
                                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                  </div>
                                  <p className="mt-2 text-[13px] font-semibold text-[#111] transition group-hover:text-[#8a610f]">
                                    {cat.name}
                                  </p>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-1 p-3">
                              {machines.slice(0, 6).map((m) => (
                                <Link
                                  key={m.slug}
                                  href={`/machines/${m.slug}`}
                                  className="group flex items-center gap-3 p-2.5 transition hover:bg-[#faf9f6] focus-visible:bg-[#faf9f6] focus-visible:outline-none"
                                >
                                  <img
                                    src={m.image}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                    className="h-12 w-12 shrink-0 object-cover ring-1 ring-black/5"
                                  />
                                  <div className="min-w-0">
                                    <p className="truncate text-[13px] font-semibold text-[#111] group-hover:text-[#8a610f]">
                                      {m.name}
                                    </p>
                                    <p className="truncate text-[11px] text-[#777]">{m.category}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`${navLinkBase} ${active ? 'text-[#111] after:scale-x-100' : ''}`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="group flex h-10 items-center gap-3 border border-black/10 bg-[#faf9f6] pl-3 pr-2 text-[13px] text-[#6f7273] transition hover:border-black/30 hover:bg-white focus-visible:border-[#111] focus-visible:outline-none"
              aria-label="Search machines"
            >
              <Search size={16} />
              <span className="hidden xl:inline">Search machines</span>
              <kbd className="hidden rounded-sm border border-black/10 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#8a8c8e] xl:inline">
                Ctrl K
              </kbd>
            </button>

            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat on WhatsApp"
              className="grid h-10 w-10 place-items-center border border-black/10 text-[#111] transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
            >
              <MessageCircle size={17} />
            </a>

            <Link
              href="/quote"
              className="ml-1 inline-flex h-10 items-center gap-2 bg-[#e6b84d] px-5 text-[13px] font-bold text-[#111] transition hover:bg-[#111] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2"
            >
              Request a quote <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* MOBILE ACTIONS */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid h-10 w-10 place-items-center text-[#111]"
              aria-label="Search machines"
            >
              <Search size={20} />
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center text-[#111]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE PANEL */}
        {mobileOpen && (
          <nav
            aria-label="Mobile"
            className="animate-in fade-in slide-in-from-top-2 max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-black/10 bg-white lg:hidden"
          >
            <div className="px-5 pt-2">
              {navItems.map(([label, href]) => {
                if (label === 'Categories') {
                  return (
                    <div key={href} className="border-b border-black/[0.07]">
                      <button
                        type="button"
                        aria-expanded={mobileCategoriesOpen}
                        onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                        className="flex w-full items-center justify-between py-4 text-base font-semibold text-[#111]"
                      >
                        {label}
                        <ChevronDown
                          size={18}
                          className={`text-[#999] transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {mobileCategoriesOpen && (
                        <div className="mb-3 grid grid-cols-2 gap-2">
                          {categories.map((c) => (
                            <Link
                              key={c.slug}
                              href={`/categories/${c.slug}`}
                              className="flex items-center gap-2 bg-[#faf9f6] p-2 text-[13px] font-medium text-[#333] active:bg-[#f0eee8]"
                            >
                              <img
                                src={c.image}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="h-9 w-9 shrink-0 object-cover"
                              />
                              <span className="leading-tight">{c.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center justify-between border-b border-black/[0.07] py-4 text-base font-semibold ${
                      active ? 'text-[#8a610f]' : 'text-[#111]'
                    }`}
                  >
                    {label}
                    <ChevronRight size={18} className="text-[#ccc]" />
                  </Link>
                )
              })}
            </div>

            <div className="space-y-3 px-5 py-6">
              <Link
                href="/quote"
                className="flex h-12 items-center justify-center gap-2 bg-[#e6b84d] text-sm font-bold text-[#111]"
              >
                Request a quote <ArrowUpRight size={16} />
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${phone}`}
                  className="flex h-12 items-center justify-center gap-2 border border-black/15 text-sm font-semibold text-[#111]"
                >
                  <Phone size={15} className="text-[#b27f19]" /> Call us
                </a>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 items-center justify-center gap-2 bg-[#25D366] text-sm font-semibold text-white"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>
              </div>
              <p className="flex items-start gap-2 pt-2 text-xs leading-5 text-[#777]">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#b27f19]" />
                {address}
              </p>
            </div>
          </nav>
        )}
      </div>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm animate-in fade-in"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeSearch()
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Search machines"
        >
          <div className="w-full max-w-xl border border-black/10 bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-black/10 px-4">
              <Search size={18} className="shrink-0 text-[#8a8c8e]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by machine name or category"
                className="h-14 w-full bg-transparent text-[15px] text-[#111] placeholder:text-[#9a9c9e] focus:outline-none"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="rounded-sm border border-black/10 px-2 py-1 text-[10px] font-semibold text-[#777] hover:bg-[#f3f3f1]"
              >
                Esc
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div className="p-4">
                  <p className="mb-3 text-xs font-semibold text-[#777]">Browse by category</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/categories/${c.slug}`}
                        onClick={closeSearch}
                        className="border border-black/10 px-3 py-1.5 text-xs font-medium text-[#333] transition hover:border-[#e6b84d] hover:bg-[#fdf8ea]"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <ul className="divide-y divide-black/5">
                  {results.map((m) => (
                    <li key={m.slug}>
                      <Link
                        href={`/machines/${m.slug}`}
                        onClick={closeSearch}
                        className="group flex items-center gap-4 px-4 py-3 transition hover:bg-[#faf9f6]"
                      >
                        <img
                          src={m.image}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 shrink-0 object-cover ring-1 ring-black/5"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#111]">{m.name}</p>
                          <p className="text-xs text-[#777]">{m.category}</p>
                        </div>
                        <CornerDownLeft size={15} className="text-[#ccc] transition group-hover:text-[#b27f19]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-semibold text-[#111]">No machines match “{searchQuery}”</p>
                  <p className="mt-1 text-xs text-[#777]">
                    Try a different name, or{' '}
                    <Link href="/quote" onClick={closeSearch} className="font-semibold text-[#8a610f] underline">
                      request a quote
                    </Link>{' '}
                    for something specific.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#111] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <Logo light />
          <p className="mt-7 max-w-xs text-sm leading-7 text-white/55">
            We Deal in Quality Machines. A Kampala-based machinery and hardware business for practical,
            dependable equipment.
          </p>
        </div>
        <div>
          <p className="eyebrow text-[#e6b84d]">Explore</p>
          <div className="mt-5 grid grid-cols-2 gap-y-3">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="text-sm text-white/60 hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow text-[#e6b84d]">Contact</p>
          <div className="mt-5 space-y-4 text-sm text-white/65">
            <p className="flex gap-3">
              <MapPin size={17} className="text-[#e6b84d]" />
              {address}
            </p>
            <a href={`tel:${phone}`} className="flex gap-3">
              <Phone size={17} className="text-[#e6b84d]" />
              {phone}
            </a>
            <a href={`mailto:${email}`} className="flex gap-3 break-all">
              <Mail size={17} className="text-[#e6b84d]" />
              {email}
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/35">
        © 2026 Machine Man / Machineman Hardware. All rights reserved.
      </div>
    </footer>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  light = false,
}: {
  eyebrow: string
  title: string
  text?: string
  light?: boolean
}) {
  return (
    <div className={`max-w-2xl ${light ? 'text-white' : ''}`}>
      <p className="eyebrow text-[#b27f19]">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] md:text-6xl">{title}</h2>
      {text && (
        <p className={`mt-5 max-w-xl text-base leading-7 ${light ? 'text-white/60' : 'text-[#6f7273]'}`}>
          {text}
        </p>
      )}
    </div>
  )
}

export function MachineCard({ machine }: { machine: Machine }) {
  return (
    <article className="group border border-black/10 bg-white">
      <Link href={`/machines/${machine.slug}`} className="block">
        <div className="relative aspect-[1.16] overflow-hidden bg-[#f3f3f1]">
          <img
            src={machine.image}
            alt={machine.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest">
            {machine.availability}
          </span>
          <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center bg-[#e6b84d] text-[#111] opacity-0 transition group-hover:opacity-100">
            <ArrowUpRight size={17} />
          </span>
        </div>
        <div className="p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b27f19]">
            {machine.category}
          </p>
          <h3 className="mt-3 text-xl font-black">{machine.name}</h3>
          <p className="mt-2 text-sm leading-6 text-[#707274]">{machine.description}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            View details <ArrowUpRight size={14} />
          </span>
        </div>
      </Link>
    </article>
  )
}

export function CTASection() {
  return (
    <section className="bg-[#e6b84d] px-5 py-16 md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end lg:px-8">
        <div>
          <p className="eyebrow text-[#111]/60">Let&apos;s get to work</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.05em] md:text-6xl">
            Looking for the right machine?
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#111]/65">
            Tell us what you need and our team will help you find the right equipment.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/quote"
            className="bg-[#111] px-6 py-4 text-xs font-bold uppercase tracking-widest text-white"
          >
            Request a Quote
          </Link>
          <a
            href={`tel:${phone}`}
            className="border border-[#111]/30 px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#111]"
          >
            Call {phone}
          </a>
        </div>
      </div>
    </section>
  )
}

export function FeatureStrip() {
  const features = [
    [ShieldCheck, 'Quality Equipment', 'We focus on quality machines for different applications.'],
    [Wrench, 'Reliable Service', 'Professional support from inquiry through purchase.'],
    [MapPin, 'Convenient Location', 'Located along Nabugabo Road in Kampala.'],
    [Users, 'Customer Focused', 'We help customers identify equipment suited to their needs.'],
  ]
  return (
    <section className="border-y border-black/10 bg-[#f6f6f3]">
      <div className="mx-auto grid max-w-7xl md:grid-cols-4 lg:px-8">
        {features.map(([Icon, title, text]) => (
          <div
            key={title as string}
            className="border-b border-black/10 px-5 py-8 last:border-0 md:border-b-0 md:border-r md:px-7 md:last:border-0"
          >
            <Icon size={22} className="text-[#b27f19]" />
            <h3 className="mt-5 font-bold">{title as string}</h3>
            <p className="mt-2 text-sm leading-6 text-[#707274]">{text as string}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ContactForm({ quote = false }: { quote?: boolean }) {
  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-4 md:grid-cols-2">
        <input required placeholder="Full name" className="field" />
        <input required placeholder="Phone number" className="field" />
        <input type="email" placeholder="Email address" className="field" />
        <input
          placeholder={quote ? 'Company / organization' : 'Machine / equipment needed'}
          className="field"
        />
      </div>
      {quote && (
        <div className="grid gap-4 md:grid-cols-2">
          <input placeholder="Machine required" className="field" />
          <input type="number" min="1" placeholder="Quantity" className="field" />
        </div>
      )}
      <textarea
        required
        placeholder={quote ? 'Additional requirements' : 'Tell us how we can help'}
        rows={5}
        className="field resize-none"
      />
      <button className="w-full bg-[#111] px-6 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#e6b84d] hover:text-[#111]">
        {quote ? 'Submit Request' : 'Send Inquiry'}{' '}
        <ArrowUpRight className="ml-2 inline" size={14} />
      </button>
    </form>
  )
}