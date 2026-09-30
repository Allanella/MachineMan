export type Machine = {
  slug: string
  name: string
  category: string
  /** Short summary, used on cards across the site */
  description: string
  /** Fuller write-up, used on the machines page and detail pages */
  longDescription?: string
  /** Quick selling points */
  highlights?: string[]
  /** Who or what the machine is best suited to */
  idealFor?: string
  availability: 'Available' | 'Limited Availability' | 'Contact for Availability'
  image: string
  specs?: Record<string, string>
}

export type GalleryItem = {
  id: string
  title: string
  category: string
  image: string
}

export const imageUrls = {
  generator: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6021.JPG-Xrl0eZEmn4ffWvdVXgocgEsxGWoVBb.jpeg',
  tiller: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/arquivo_1790674212804-QZb1sUoUjQ9h9Y5vKYnpknxlj1QubG.jpg',
  phone: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/arquivo_1790674303452-ZZByhW9q7qUPM2yYGSNwyacHRzT6Xl.png',
  machineExtra1: '/arquivo_1790674384786.jpg',
  machineExtra2: '/arquivo_1790675961881.jpg',
  machineExtra3: '/IMG_6111.PNG',
  // Local uploaded images batch 1
  arquivo1: '/IMG_6111.PNG',
  arquivo2: '/IMG_6136.JPG.jpeg',
  arquivo3: '/IMG_6140.JPG.jpeg',
  arquivo4: '/IMG_6141.JPG.jpeg',
  arquivo5: '/IMG_6111.PNG',
  arquivo6: '/IMG_6136.JPG.jpeg',
  // Local uploaded images batch 2
  arquivo7: '/IMG_6140.JPG.jpeg',
  arquivo8: '/IMG_6141.JPG.jpeg',
  arquivo9: '/IMG_6111.PNG',
  arquivo10: '/IMG_6136.JPG.jpeg',
  arquivo11: '/IMG_6140.JPG.jpeg',
  arquivo12: '/IMG_6141.JPG.jpeg',
  arquivo13: '/IMG_6111.PNG',
}

/**
 * Safety net: keeps only the first item for each image, so the same photo
 * can never show up twice in a list (used by the gallery below).
 */
export function uniqueByImage<T extends { image: string }>(items: T[]): T[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.image)) return false
    seen.add(item.image)
    return true
  })
}

export const machines: Machine[] = [
  {
    slug: 'perkins-generator',
    name: 'Perkins Generator',
    category: 'Power Equipment',
    description: 'A robust enclosed generator for dependable heavy-duty power where it matters.',
    longDescription:
      'Built around a Perkins engine, a name widely trusted for dependable diesel power, this enclosed generator set is made for places that cannot afford to lose electricity. The protective canopy shelters the components from dust and rain and keeps day-to-day operation tidy, while the set is suited to both continuous and standby duty. It is a practical choice for construction sites, workshops, farms, clinics and commercial premises.',
    highlights: [
      'Perkins diesel engine',
      'Enclosed canopy for site protection',
      'Suited to continuous or standby duty',
    ],
    idealFor: 'Construction sites, workshops, farms and commercial premises',
    availability: 'Available',
    image: imageUrls.generator,
    specs: { Engine: 'Perkins', Application: 'Power generation', Duty: 'Continuous / Standby' }
  },
  {
    slug: 'diesel-power-tiller',
    name: 'Diesel Power Tiller',
    category: 'Agricultural Equipment',
    description: 'Versatile tilling equipment built for heavy soil preparation and practical agricultural work.',
    longDescription:
      'A diesel-driven power tiller designed to take the hard labour out of land preparation. The gear-driven transmission puts the engine\'s torque to work breaking up heavy soil, turning in crop residue and preparing seedbeds far faster than hand tools. It is a hard-working option for smallholders and commercial growers who want a machine that copes with real field conditions.',
    highlights: [
      'Diesel engine with strong low-end torque',
      'Gear-driven transmission',
      'Handles heavy soil preparation',
    ],
    idealFor: 'Smallholder and commercial farms preparing land for planting',
    availability: 'Limited Availability',
    image: imageUrls.tiller,
    specs: { Engine: 'Diesel', Application: 'Agriculture', Drive: 'Gear Driven' }
  },
  {
    slug: 'heavy-duty-engine-unit',
    name: 'Industrial Engine Unit',
    category: 'Industrial Equipment',
    description: 'High-torque industrial driver engine built for heavy machinery and continuous site work.',
    longDescription:
      'A high-torque diesel driver engine made to power heavy machinery for long working days. Its robust construction is meant for continuous site work, whether it is driving pumps, mills or other industrial equipment. If you are replacing an engine or specifying a new drive, our team can help you match it to your workload before you buy.',
    highlights: [
      'High-torque diesel engine',
      'Built for continuous site work',
      'Suitable as a driver for industrial equipment',
    ],
    idealFor: 'Contractors and businesses powering heavy machinery',
    availability: 'Available',
    image: imageUrls.machineExtra1,
    specs: { Type: 'Diesel Engine', Application: 'Industrial Drivers' }
  },
  {
    slug: 'compact-power-generator',
    name: 'Compact Silent Generator',
    category: 'Power Equipment',
    description: 'Fuel-efficient, low-noise power unit optimized for commercial and jobsite back-up power.',
    longDescription:
      'A compact, low-noise diesel generator for places where a loud set is simply not an option. Its quiet operation and fuel-conscious running make it a comfortable fit beside shops, offices, guest houses and active job sites. The smaller footprint makes it easier to position and move than larger sets, without giving up dependable back-up power.',
    highlights: [
      'Low-noise silent operation',
      'Fuel-efficient diesel running',
      'Compact footprint that is easy to place',
    ],
    idealFor: 'Shops, offices, guest houses and jobsite back-up power',
    availability: 'Available',
    image: imageUrls.arquivo2,
    specs: { Type: 'Silent Diesel', 'Noise Level': 'Low DB' }
  },
  {
    slug: 'industrial-diesel-driver-engine',
    name: 'Industrial Diesel Driver Engine',
    category: 'Industrial Equipment',
    description: 'Heavy-duty diesel driver engine for driving water pumps, agricultural machinery, and industrial gear.',
    longDescription:
      'Engineered for long duty cycles under constant load, this industrial diesel driver engine provides steady performance for site equipment, high-volume irrigation pumps, and processing machinery.',
    highlights: [
      'Heavy-duty output for constant workload',
      'Efficient air/water cooling structure',
      'Direct-injection fuel economy',
    ],
    idealFor: 'Pumping stations, stone crushers, and agricultural processing equipment',
    availability: 'Available',
    image: imageUrls.arquivo3,
    specs: { Type: 'Industrial Diesel', Application: 'Machinery Drive' }
  },
  {
    slug: 'heavy-duty-site-power-unit',
    name: 'Heavy Duty Site Power Unit',
    category: 'Power Equipment',
    description: 'Multi-purpose site power unit engineered for harsh jobsite environments.',
    longDescription:
      'Designed to handle peak electrical loads on active job sites, this heavy-duty power unit provides steady, regulated power for heavy machinery and site illumination.',
    highlights: [
      'Reinforced steel frame housing',
      'Multi-voltage distribution outputs',
      'Heavy-duty alternator',
    ],
    idealFor: 'Construction sites and outdoor commercial setups',
    availability: 'Available',
    image: imageUrls.arquivo4,
    specs: { Type: 'Power Unit', Application: 'Site Electricity' }
  },
  {
    slug: 'multi-purpose-rotary-tiller',
    name: 'Rotary Tiller Machine',
    category: 'Agricultural Equipment',
    description: 'Rugged rotary tiller unit engineered for high-efficiency field tilling and cultivation.',
    longDescription:
      'A rugged rotary tiller built for efficient tilling and cultivation across a range of field conditions. The rotating blades break up and mix the soil in a single pass, leaving a fine, even bed that is ready for planting. It is a versatile addition for growers who want to cover more ground in less time.',
    highlights: [
      'Rotary blades for fine, even soil',
      'Diesel powered',
      'Versatile for tilling and cultivation',
    ],
    idealFor: 'Growers who want to cover more ground in less time',
    availability: 'Limited Availability',
    image: imageUrls.machineExtra3,
    specs: { Fuel: 'Diesel', Category: 'Land Preparation' }
  },
  {
    slug: 'specialist-equipment-sourcing',
    name: 'Specialist Hardware Sourcing',
    category: 'Industrial Equipment',
    description: 'Tell us what specific machine or spec you need and our procurement team will assist you directly.',
    longDescription:
      'Cannot find the exact machine you need? Tell us the type of equipment, the capacity and how you plan to use it, and our procurement team will work through our supplier network to find a suitable match. We stay in touch through the process so you know what is available, and we advise on the right specification before you commit.',
    highlights: [
      'Tell us the machine or specification',
      'We source through our supplier network',
      'Advice on capacity before you buy',
    ],
    idealFor: 'Specialised or hard-to-find equipment requests',
    availability: 'Contact for Availability',
    image: imageUrls.machineExtra2,
    specs: { Custom: 'On-Demand Sourcing' }
  }
]

export const categories = [
  {
    slug: 'power-equipment',
    name: 'Power Equipment',
    description: 'Heavy-duty generators and dependable power solutions for continuous and backup energy.',
    image: imageUrls.generator
  },
  {
    slug: 'agricultural-equipment',
    name: 'Agricultural Equipment',
    description: 'Practical, high-yield farm machinery and power tillers engineered for land cultivation.',
    image: imageUrls.tiller
  },
  {
    slug: 'industrial-equipment',
    name: 'Industrial Equipment',
    description: 'Heavy machinery and driving units built for demanding construction and industrial applications.',
    image: imageUrls.machineExtra1
  }
]

// One entry per photo. uniqueByImage() guarantees no photo is ever listed twice.
export const galleryImages: GalleryItem[] = uniqueByImage([
  { id: '1', title: 'Perkins Heavy Silent Generator', category: 'Power Equipment', image: imageUrls.generator },
  { id: '2', title: 'Diesel Power Tiller Unit', category: 'Agricultural Equipment', image: imageUrls.tiller },
  { id: '3', title: 'Industrial Engine Unit', category: 'Industrial Equipment', image: imageUrls.machineExtra1 },
  { id: '4', title: 'Compact Jobsite Silent Generator', category: 'Power Equipment', image: imageUrls.arquivo2 },
  { id: '5', title: 'Industrial Diesel Driver Engine', category: 'Industrial Equipment', image: imageUrls.arquivo3 },
  { id: '6', title: 'Heavy Duty Site Power Unit', category: 'Power Equipment', image: imageUrls.arquivo4 },
  { id: '7', title: 'Multi-Purpose Field Rotary Tiller', category: 'Agricultural Equipment', image: imageUrls.machineExtra3 },
  { id: '8', title: 'Custom Hardware Supply', category: 'Industrial Equipment', image: imageUrls.machineExtra2 },
])

export const services = [
  ['Machine Sales', 'Quality machines and equipment ready for site deployment.'],
  ['Equipment Sourcing', 'Custom procurement for specialized industrial hardware and tools.'],
  ['Machine Consultation', 'Professional advice to match equipment to your exact workload requirements.'],
  ['Equipment Supply & Logistics', 'Seamless end-to-end purchasing and delivery assistance in Uganda.']
]

export const navItems = [
  ['Machines', '/machines'],
  ['Categories', '/categories'],
  ['Services', '/services'],
  ['Projects', '/projects'],
  ['Gallery', '/gallery'],
  ['About', '/about'],
  ['Contact', '/contact']
]

export const phone = '+256 707 849 453'
export const email = 'mugenyihussein2001@gmail.com'
export const whatsapp = 'https://wa.me/256707849453'
export const address = 'Kampala, Nabugabo Road, Uganda'
export const siteDescription = 'Machine Man / Machineman Hardware supplies quality machines and equipment in Kampala, Uganda. Located along Nabugabo Road.'

export function getMachine(slug: string) {
  return machines.find((machine) => machine.slug === slug)
}

export function getCategoryMachines(slug: string) {
  const category = categories.find((item) => item.slug === slug)
  return machines.filter((machine) => machine.category === category?.name)
}