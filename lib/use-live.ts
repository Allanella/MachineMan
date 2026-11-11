'use client'

import { useEffect, useState } from 'react'
import {
  machines as staticMachines,
  categories as staticCategories,
  services as staticServices,
  imageUrls,
  type Machine,
} from '@/lib/site-data'
import { SETTING_DEFAULTS } from '@/lib/live-defaults'

export type Category = {
  slug: string
  name: string
  description: string
  image: string
  featured: boolean
}

export type Project = { tag: string; title: string; text: string; image: string }

export type Live = {
  /** true once the server has answered (or failed to) */
  ready: boolean
  machines: Machine[]
  categories: Category[]
  services: [string, string][]
  projects: Project[]
  /** every editable text, keyed like 'hero_text' */
  s: Record<string, string>
  phone: string
  email: string
  whatsapp: string
  address: string
}

function build(
  s: Record<string, string>,
  machines: Machine[],
  categories: Category[],
  services: [string, string][],
  projects: Project[],
  ready: boolean
): Live {
  return {
    ready,
    machines,
    categories,
    services,
    projects,
    s,
    phone: s.phone,
    email: s.email,
    whatsapp: s.whatsapp,
    address: s.address,
  }
}

const fallbackCategories: Category[] = staticCategories.map((c) => ({
  slug: c.slug,
  name: c.name,
  description: c.description,
  image: c.image,
  featured: true,
}))

const fallbackProjects: Project[] = [
  {
    tag: 'Equipment delivery',
    title: 'Project details coming soon',
    text: 'Customer, location, machine and date details can be added from the admin panel.',
    image: imageUrls.generator,
  },
  {
    tag: 'Machine supply',
    title: 'Built for real applications',
    text: 'Use this space for verified customer projects and delivery stories.',
    image: imageUrls.tiller,
  },
]

// Shown first (and kept if the server cannot be reached), so a page is never blank
let current: Live = build(
  SETTING_DEFAULTS,
  staticMachines,
  fallbackCategories,
  staticServices as [string, string][],
  fallbackProjects,
  false
)
let started = false
const listeners = new Set<(l: Live) => void>()

function getJson(url: string): Promise<any> {
  return fetch(url, { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null)
}

function load() {
  if (started) return
  started = true
  Promise.all([getJson('/api/site.php'), getJson('/api/machines.php')]).then(([site, ms]) => {
    let s = current.s
    let categories = current.categories
    let services = current.services
    let machines = current.machines
    let projects = current.projects

    if (site && typeof site === 'object') {
      if (site.settings && typeof site.settings === 'object') {
        const over: Record<string, string> = {}
        for (const k in site.settings) if (site.settings[k] !== '') over[k] = String(site.settings[k])
        s = { ...SETTING_DEFAULTS, ...over }
      }
      if (Array.isArray(site.categories) && site.categories.length) {
        categories = site.categories.map((c: any) => ({
          slug: c.slug,
          name: c.name,
          description: c.description || '',
          image: c.image || '',
          featured: !!c.featured,
        }))
      }
      if (Array.isArray(site.projects) && site.projects.length) {
        projects = site.projects.map((p: any) => ({
          tag: p.tag || '',
          title: p.title,
          text: p.text || '',
          image: p.image || '',
        }))
      }
      if (Array.isArray(site.services) && site.services.length) {
        services = site.services.map((x: any) => [x.title, x.text || ''] as [string, string])
      }
    }

    if (Array.isArray(ms) && ms.length) {
      machines = ms.map((m: any) => ({
        slug: m.slug,
        name: m.name,
        category: m.category,
        description: m.description || '',
        longDescription: m.long_description || m.description || '',
        availability: (m.availability || 'Available') as Machine['availability'],
        image: m.image_url || '',
        price: m.price || '',
        specs: m.specs && !Array.isArray(m.specs) ? m.specs : {},
      }))
    }

    current = build(s, machines, categories, services, projects, true)
    listeners.forEach((l) => l(current))
  })
}

/** Live site content from the admin panel, with the built-in content as a fallback. */
export function useLive(): Live {
  const [live, setLive] = useState<Live>(current)
  useEffect(() => {
    listeners.add(setLive)
    setLive(current)
    load()
    return () => {
      listeners.delete(setLive)
    }
  }, [])
  return live
}
