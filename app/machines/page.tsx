import { Footer, MachineCard, Navbar, SectionHeading } from '@/components/site'
import { machines } from '@/lib/site-data'
export const metadata = { title: 'Our Machines | Machine Man Uganda' }
export default function MachinesPage() { return <><Navbar /><main className="pt-32"><section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8"><SectionHeading eyebrow="The catalogue" title="Our Machines" text="Explore quality machines and equipment available from Machine Man. Product information is structured to connect to a future catalogue or database." /><div className="mt-12 grid gap-5 md:grid-cols-3">{machines.map((machine) => <MachineCard key={machine.slug} machine={machine} />)}</div></section></main><Footer /></> }
