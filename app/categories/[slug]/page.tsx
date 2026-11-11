// Save as: app/categories/[slug]/page.tsx   (replace the whole file)
import { CategoryView } from '@/components/views'
import { categories } from '@/lib/site-data'

// 'x-fallback' is a spare page. Categories added later in the admin are served through it.
export function generateStaticParams() {
  return [...categories.map(({ slug }) => ({ slug })), { slug: 'x-fallback' }]
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <CategoryView initialSlug={slug} />
}
