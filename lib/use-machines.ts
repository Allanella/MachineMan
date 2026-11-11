'use client'

import { useEffect, useState } from 'react'

export type LiveMachine = {
  slug: string
  name: string
  category: string
  description: string
  longDescription: string
  price: string
  availability: string
  image: string
  specs: Record<string, string>
}

/**
 * Loads machines from the admin database.
 * `fallback` (your static list from site-data.ts) is shown first and
 * kept if the server can't be reached, so the page never goes blank.
 */
export function useMachines<T extends { slug: string }>(fallback: T[]): (T | LiveMachine)[] {
  const [items, setItems] = useState<(T | LiveMachine)[]>(fallback)

  useEffect(() => {
    let alive = true
    fetch('/api/machines.php', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows: any[]) => {
        if (!alive || !Array.isArray(rows) || rows.length === 0) return
        setItems(
          rows.map((m) => ({
            slug: m.slug,
            name: m.name,
            category: m.category,
            description: m.description,
            longDescription: m.long_description || m.description,
            price: m.price,
            availability: m.availability,
            image: m.image_url,
            specs: m.specs || {},
          }))
        )
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return items
}