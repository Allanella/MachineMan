'use client'

import { useEffect, useState } from 'react'

export type UploadedMedia = {
  id: number
  title: string
  category: string
  src: string
  type: 'image' | 'video'
  createdAt: string
}

/**
 * Loads items uploaded through /admin from the database.
 * Returns an empty list if the API is unreachable (for example in `next dev`),
 * so the static gallery keeps working either way.
 */
export function useUploads() {
  const [items, setItems] = useState<UploadedMedia[]>([])

  useEffect(() => {
    let cancelled = false

    fetch('/api/media.php', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => {
        if (cancelled || !Array.isArray(rows)) return
        // Paths saved by upload.php are resolved relative to the /admin/ folder.
        // This also works if they are saved as absolute paths or full URLs.
        const base = window.location.origin + '/admin/'
        setItems(
          rows.map((r: any) => ({
            id: Number(r.id),
            title: String(r.title ?? ''),
            category: String(r.category ?? 'Other'),
            src: new URL(String(r.file_url), base).href,
            type: String(r.file_type ?? '').toLowerCase().includes('video') ? 'video' : 'image',
            createdAt: String(r.created_at ?? ''),
          }))
        )
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  return items
}