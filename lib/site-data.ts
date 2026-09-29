export type Machine = {
  slug: string
  name: string
  category: string
  description: string
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
  machineExtra1: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/arquivo_1790674384786.jpg',
  machineExtra2: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/arquivo_1790675961881.jpg',
  machineExtra3: '/arquivo_1790675964963.jpg',
  // Local uploaded images batch 1
  arquivo1: '/arquivo_1790677199957.jpg',
  arquivo2: '/arquivo_1790677206844.png',
  arquivo3: '/arquivo_1790677210865.png',
  arquivo4: '/arquivo_1790677220560.png',
  arquivo5: '/arquivo_1790677227505.png',
  arquivo6: '/arquivo_1790677247032.png',
  // New local uploaded images batch 2
  arquivo7: '/arquivo_1790682557239.png',
  arquivo8: '/arquivo_1790682562866.png',
  arquivo9: '/arquivo_1790682582623.png',
  arquivo10: '/arquivo_1790682585321.png',
  arquivo11: '/arquivo_1790682594423.png',
  arquivo12: '/arquivo_1790682610006.png',
  arquivo13: '/arquivo_1790682619704.png',
}

export const machines: Machine[] = [
  {
    slug: 'perkins-generator',
    name: 'Perkins Generator',
    category: 'Power Equipment',
    description: 'A robust enclosed generator for dependable heavy-duty power where it matters.',
    availability: 'Available',
    image: imageUrls.generator,
    specs: { Engine: 'Perkins', Application: 'Power generation', Duty: 'Continuous / Standby' }
  },
  {
    slug: 'diesel-power-tiller',
    name: 'Diesel Power Tiller',
    category: 'Agricultural Equipment',
    description: 'Versatile tilling equipment built for heavy soil preparation and practical agricultural work.',
    availability: 'Limited Availability',
    image: imageUrls.tiller,
    specs: { Engine: 'Diesel', Application: 'Agriculture', Drive: 'Gear Driven' }
  },
  {
    slug: 'heavy-duty-engine-unit',
    name: 'Industrial Engine Unit',
    category: 'Industrial Equipment',
    description: 'High-torque industrial driver engine built for heavy machinery and continuous site work.',
    availability: 'Available',
    image: imageUrls.machineExtra1,
    specs: { Type: 'Diesel Engine', Application: 'Industrial Drivers' }
  },
  {
    slug: 'compact-power-generator',
    name: 'Compact Silent Generator',
    category: 'Power Equipment',
    description: 'Fuel-efficient, low-noise power unit optimized for commercial and jobsite back-up power.',
    availability: 'Available',
    image: imageUrls.machineExtra2,
    specs: { Type: 'Silent Diesel', 'Noise Level': 'Low DB' }
  },
  {
    slug: 'multi-purpose-rotary-tiller',
    name: 'Rotary Tiller Machine',
    category: 'Agricultural Equipment',
    description: 'Rugged rotary tiller unit engineered for high-efficiency field tilling and cultivation.',
    availability: 'Limited Availability',
    image: imageUrls.machineExtra3,
    specs: { Fuel: 'Diesel', Category: 'Land Preparation' }
  },
  {
    slug: 'specialist-equipment-sourcing',
    name: 'Specialist Hardware Sourcing',
    category: 'Industrial Equipment',
    description: 'Tell us what specific machine or spec you need and our procurement team will assist you directly.',
    availability: 'Contact for Availability',
    image: imageUrls.arquivo7,
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

export const galleryImages: GalleryItem[] = [
  { id: '1', title: 'Perkins Heavy Silent Generator', category: 'Power Equipment', image: imageUrls.generator },
  { id: '2', title: 'Diesel Power Tiller Unit', category: 'Agricultural Equipment', image: imageUrls.tiller },
  { id: '3', title: 'Industrial Diesel Driver Engine', category: 'Industrial Equipment', image: imageUrls.machineExtra1 },
  { id: '4', title: 'Compact Jobsite Silent Generator', category: 'Power Equipment', image: imageUrls.machineExtra2 },
  { id: '5', title: 'Multi-Purpose Field Rotary Tiller', category: 'Agricultural Equipment', image: imageUrls.machineExtra3 },
  { id: '6', title: 'Heavy Duty Site Hardware', category: 'Industrial Equipment', image: imageUrls.arquivo1 },
  { id: '7', title: 'Commercial Power Unit', category: 'Power Equipment', image: imageUrls.arquivo2 },
  { id: '8', title: 'Agricultural Tiller Assembly', category: 'Agricultural Equipment', image: imageUrls.arquivo3 },
  { id: '9', title: 'Field Machinery Gear System', category: 'Industrial Equipment', image: imageUrls.arquivo4 },
  { id: '10', title: 'Enclosed Power Unit', category: 'Power Equipment', image: imageUrls.arquivo5 },
  { id: '11', title: 'Heavy Land Cultivator', category: 'Agricultural Equipment', image: imageUrls.arquivo6 },
  { id: '12', title: 'Industrial Engine Gearhead', category: 'Industrial Equipment', image: imageUrls.arquivo7 },
  { id: '13', title: 'High-Torque Drive Motor', category: 'Industrial Equipment', image: imageUrls.arquivo8 },
  { id: '14', title: 'Heavy Cultivator Blades', category: 'Agricultural Equipment', image: imageUrls.arquivo9 },
  { id: '15', title: 'Compact Power Generator Core', category: 'Power Equipment', image: imageUrls.arquivo10 },
  { id: '16', title: 'Rotary Tiller Gearbox', category: 'Agricultural Equipment', image: imageUrls.arquivo11 },
  { id: '17', title: 'Site Power Control Unit', category: 'Power Equipment', image: imageUrls.arquivo12 },
  { id: '18', title: 'Custom Hardware Supply', category: 'Industrial Equipment', image: imageUrls.arquivo13 },
]

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