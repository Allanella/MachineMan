// Save as: app/machines/[slug]/page.tsx   (replace the whole file)
import { MachineDetailView } from '@/components/views'
import { getMachine, machines } from '@/lib/site-data'

// 'x-fallback' is a spare page. Machines added later in the admin are served through it.
export function generateStaticParams() {
  return [...machines.map(({ slug }) => ({ slug })), { slug: 'x-fallback' }]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const machine = getMachine((await params).slug)
  return {
    title: machine ? `${machine.name} | Machine Man Uganda` : 'Machine | Machine Man Uganda',
    description: machine?.description,
  }
}

export default async function MachineDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <MachineDetailView initialSlug={slug} />
}
