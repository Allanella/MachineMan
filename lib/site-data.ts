export type Machine = {
  slug: string
  name: string
  category: string
  description: string
  longDescription?: string
  highlights?: string[]
  idealFor?: string
  availability: 'Available' | 'Limited Availability' | 'Contact for Availability'
  image: string
  price: string
  specs?: Record<string, string>
}

export type GalleryItem = {
  id: string
  title: string
  category: string
  image: string
}

export const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.758423819046!2d32.5725057749646!3d0.3139513996829661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbd7fe9a36717%3A0xcf6f68a319d5cb78!2sMachineman!5e0!3m2!1sen!2srw!4v1791355176506!5m2!1sen!2srw";

export const imageUrls = {
  generator: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6021.JPG-Xrl0eZEmn4ffWvdVXgocgEsxGWoVBb.jpeg',
  tiller: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/arquivo_1790674212804-QZb1sUoUjQ9h9Y5vKYnpknxlj1QubG.jpg',
  phone: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/arquivo_1790674303452-ZZByhW9q7qUPM2yYGSNwyacHRzT6Xl.png',
  machineExtra1: '/arquivo_1790674384786.jpg',
  machineExtra2: '/arquivo_1790675961881.jpg',
  machineExtra3: '/IMG_6111.PNG',
  arquivo1: '/IMG_6111.PNG',
  arquivo2: '/IMG_6136.JPG.jpeg',
  arquivo3: '/IMG_6140.JPG.jpeg',
  arquivo4: '/IMG_6141.JPG.jpeg',
  arquivo5: '/IMG_6111.PNG',
  arquivo6: '/IMG_6136.JPG.jpeg',
  arquivo7: '/IMG_6140.JPG.jpeg',
  arquivo8: '/IMG_6141.JPG.jpeg',
  arquivo9: '/IMG_6111.PNG',
  arquivo10: '/IMG_6136.JPG.jpeg',
  arquivo11: '/IMG_6140.JPG.jpeg',
  arquivo12: '/IMG_6141.JPG.jpeg',
  arquivo13: '/IMG_6111.PNG',
  carPolisher: '/Car polisher.jpeg',
  chainTractor: '/chainTractor.jpeg',
  dieselWeldingGenerator: '/DieselWeldingGenerator.jpeg',
  hedgeTrimmer: '/Hedge trimmer.jpeg',
  airCompressor: '/Air compressor.jpeg',
  waterPump: '/Water pump.jpeg',
  walkingTractor: '/Walking tractor.jpeg',
  standby25kva: '/Standby generator 25KVA.jpeg',
  standby60kva: '/Standby generator 60KVA.jpeg',
  migWelding: '/MiG welding.jpeg',
  rechargeableHammerDrill: '/Rechargeable hammer drill.jpeg',
  cordlessImpactWrench: '/Cordless impact wrench.jpeg',
  tyreInflator: '/tyre inflater.jpeg',
  wirelessPaintSprayer: '/Wireless paint sprayer.jpeg',
  magneticDrill: '/magnetic drill.jpeg',
  motorisedGardenSprayer: '/motorised garden sprayer.jpeg',
}

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
    slug: 'diesel-welding-generator-210amps',
    name: 'Diesel Welding Generator 210amps',
    category: 'Welding Machines',
    description: 'High-quality diesel welding generator for heavy-duty site work.',
    longDescription: 'The EDON ED-DSW-210A is a robust diesel welding generator designed for continuous operation on construction sites. It provides reliable 210amp welding output and auxiliary power for tools.',
    availability: 'Available',
    image: imageUrls.dieselWeldingGenerator,
    price: 'UGX 4,500,000',
    specs: { Model: 'ED-DSW-210A', Output: '210 Amps', Fuel: 'Diesel' }
  },
  {
    slug: 'chain-tiller-tractor',
    name: 'Chain tiller/tractor',
    category: 'Farm Machinery & Equipment',
    description: 'Versatile chain tiller for efficient land preparation.',
    longDescription: 'Heavy-duty chain tiller designed for tough soil conditions. Ideal for small to medium-sized farms, this machine prepares seedbeds quickly and efficiently.',
    availability: 'Available',
    image: imageUrls.chainTractor,
    price: 'UGX 1,700,000',
    specs: { Type: 'Chain Tiller', Application: 'Agriculture' }
  },
  {
    slug: 'car-polisher-t-cut-machine',
    name: 'Car polisher / t-cut machine',
    category: 'Hand Tools',
    description: 'Professional grade car polisher for detailing and paint correction.',
    longDescription: 'This car polisher and t-cut machine is perfect for automotive detailing shops. It provides consistent speed for removing scratches and applying polish.',
    availability: 'Available',
    image: imageUrls.carPolisher,
    price: 'UGX 500,000',
    specs: { Type: 'Polisher', Application: 'Automotive' }
  },
  {
    slug: 'hedge-trimmer-rechargeable',
    name: 'Hedge trimmer rechargeable',
    category: 'Farm Machinery & Equipment',
    description: 'Cordless hedge trimmer for garden maintenance.',
    longDescription: 'Rechargeable hedge trimmer offering the convenience of cordless operation. Lightweight and easy to maneuver for precise trimming of hedges and shrubs.',
    availability: 'Available',
    image: imageUrls.hedgeTrimmer,
    price: 'UGX 500,000',
    specs: { Power: 'Rechargeable Battery', Application: 'Gardening' }
  },
  {
    slug: 'air-compressor-50-litres-runner',
    name: 'Air compressor 50 litres',
    category: 'Compressors',
    description: 'Runner brand 50-litre air compressor for workshops.',
    longDescription: 'The Runner 50-litre air compressor is ideal for powering pneumatic tools, spray guns, and inflating tires in workshops and garages.',
    availability: 'Available',
    image: imageUrls.airCompressor,
    price: 'UGX 2,000,000',
    specs: { Brand: 'Runner', Capacity: '50 Litres' }
  },
  {
    slug: 'submersible-water-pumps-wells',
    name: 'Submersible water pumps for wells',
    category: 'Water Pumps',
    description: 'Efficient submersible pumps for deep well water extraction.',
    longDescription: 'These submersible water pumps are designed for wells and boreholes. They provide reliable water supply for domestic, agricultural, and industrial use.',
    availability: 'Available',
    image: imageUrls.waterPump,
    price: 'UGX 500,000',
    specs: { Type: 'Submersible', Application: 'Water Extraction' }
  },
  {
    slug: 'garden-tiller-farm-walking-tractor',
    name: 'Garden tiller/ farm walking tractor',
    category: 'Farm Machinery & Equipment',
    description: 'Heavy-duty walking tractor for garden and farm tilling.',
    longDescription: 'This garden tiller and farm walking tractor is built for heavy-duty tilling. It is powerful enough to break new ground and prepare large gardens.',
    availability: 'Available',
    image: imageUrls.walkingTractor,
    price: 'UGX 7,000,000',
    specs: { Type: 'Walking Tractor', Application: 'Agriculture' }
  },
  {
    slug: 'perkins-25kva-standby-generator',
    name: '25kva standby/automatic Perkins generator',
    category: 'Generators',
    description: 'Reliable 25kVA Perkins standby generator with automatic transfer.',
    longDescription: 'The 25kVA Perkins generator is a robust power solution for businesses and homes. It features automatic standby capability, ensuring seamless power during outages.',
    availability: 'Available',
    image: imageUrls.standby25kva,
    price: 'UGX 30,000,000',
    specs: { Brand: 'Perkins', Output: '25kVA', Type: 'Standby' }
  },
  {
    slug: 'perkins-60kva-standby-generator',
    name: '60kva Perkins standby diesel generator',
    category: 'Generators',
    description: 'Heavy-duty 60kVA Perkins diesel generator for industrial use.',
    longDescription: 'The 60kVA Perkins standby diesel generator provides reliable backup power for large commercial and industrial facilities. Built for durability and performance.',
    availability: 'Available',
    image: imageUrls.standby60kva,
    price: 'UGX 60,000,000',
    specs: { Brand: 'Perkins', Output: '60kVA', Fuel: 'Diesel' }
  },
  {
    slug: 'mig-mag-gas-welding-machine-portable',
    name: 'MIG/MAG gas welding machine portable',
    category: 'Welding Machines',
    description: 'Portable MIG/MAG welding machine for versatile welding tasks.',
    longDescription: 'This portable MIG/MAG gas welding machine offers flexibility and precision for various welding applications. Ideal for workshops and on-site repairs.',
    availability: 'Available',
    image: imageUrls.migWelding,
    price: 'UGX 1,200,000',
    specs: { Type: 'MIG/MAG', Portability: 'Portable' }
  },
  {
    slug: 'rechargeable-hammer-drill',
    name: 'RECHARGEABLE HAMMER DRILL',
    category: 'Hand Tools',
    description: 'Cordless hammer drill for drilling and fastening tasks.',
    longDescription: 'Rechargeable hammer drill providing the power and convenience of cordless operation. Suitable for drilling into masonry, wood, and metal.',
    availability: 'Available',
    image: imageUrls.rechargeableHammerDrill,
    price: 'UGX 700,000',
    specs: { Type: 'Hammer Drill', Power: 'Rechargeable' }
  },
  {
    slug: 'magnetic-drill',
    name: 'Magnetic drill',
    category: 'Hand Tools',
    description: 'Powerful magnetic drill for precise metal drilling.',
    longDescription: 'This magnetic drill securely attaches to steel surfaces for accurate and efficient drilling. Ideal for construction and fabrication work.',
    availability: 'Available',
    image: imageUrls.magneticDrill,
    price: 'UGX 2,500,000',
    specs: { Type: 'Magnetic Drill', Application: 'Metalworking' }
  },
  {
    slug: 'yamaha-irrigation-water-pump',
    name: 'Yamaha irrigation water pump',
    category: 'Water Pumps',
    description: 'Yamaha WP20 irrigation pump for efficient water transfer.',
    longDescription: 'The Yamaha WP20 is a high-performance irrigation water pump. It is designed for moving large volumes of water quickly, making it ideal for agricultural irrigation.',
    availability: 'Available',
    image: imageUrls.waterPump,
    price: 'UGX 1,200,000',
    specs: { Brand: 'Yamaha', Model: 'WP20', Application: 'Irrigation' }
  },
  {
    slug: 'rechargeable-impact-wrench',
    name: 'Rechargeable impact wrench',
    category: 'Hand Tools',
    description: 'Cordless impact wrench for high-torque fastening.',
    longDescription: 'This rechargeable impact wrench delivers high torque for loosening and tightening bolts. Ideal for automotive and construction applications.',
    availability: 'Available',
    image: imageUrls.cordlessImpactWrench,
    price: 'UGX 600,000',
    specs: { Type: 'Impact Wrench', Power: 'Rechargeable' }
  },
  {
    slug: '50-litres-air-compressor-edon',
    name: '50 litres air compressor',
    category: 'Compressors',
    description: 'EDON 50-litre air compressor for professional use.',
    longDescription: 'The EDON 50-litre air compressor is a reliable and efficient source of compressed air for workshops, paint shops, and garages.',
    availability: 'Available',
    image: imageUrls.airCompressor,
    price: 'UGX 800,000',
    specs: { Brand: 'EDON', Capacity: '50 Litres' }
  },
  {
    slug: 'airless-paint-sprayer-cold-paint-sprayer',
    name: 'AIRLESS PAINT SPRAYER/ COLD PAINT SPRAYER',
    category: 'Heavy Construction Machinery',
    description: 'Airless paint sprayer for fast and even painting.',
    longDescription: 'This airless paint sprayer is designed for high-volume painting projects. It provides a smooth, even finish on walls, ceilings, and other surfaces.',
    availability: 'Available',
    image: imageUrls.wirelessPaintSprayer,
    price: 'UGX 500,000',
    specs: { Type: 'Airless Sprayer', Application: 'Painting' }
  },
  {
    slug: 'motorised-garden-sprayers',
    name: 'Motorised garden sprayers',
    category: 'Farm Machinery & Equipment',
    description: 'Motorised sprayer for efficient application of pesticides and fertilizers.',
    longDescription: 'This motorised garden sprayer is ideal for large gardens and farms. It delivers a consistent spray for pesticides, herbicides, and liquid fertilizers.',
    availability: 'Available',
    image: imageUrls.motorisedGardenSprayer,
    price: 'UGX 1,300,000',
    specs: { Type: 'Motorised Sprayer', Application: 'Agriculture' }
  },
  {
    slug: 'dc-tyre-inflator-portable-compressor',
    name: 'Dc tyre inflator / portable compressor',
    category: 'Hand Tools',
    description: 'Portable DC tyre inflator for quick inflation on the go.',
    longDescription: 'This DC tyre inflator is a portable compressor that plugs into your car\'s 12V outlet. It is perfect for emergency tyre inflation and inflating sports equipment.',
    availability: 'Available',
    image: imageUrls.tyreInflator,
    price: 'UGX 250,000',
    specs: { Type: 'Tyre Inflator', Power: 'DC 12V' }
  },
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

export const galleryImages: GalleryItem[] = uniqueByImage([
  { id: '1', title: 'Perkins Heavy Silent Generator', category: 'Power Equipment', image: imageUrls.generator },
  { id: '2', title: 'Diesel Power Tiller Unit', category: 'Agricultural Equipment', image: imageUrls.tiller },
  { id: '3', title: 'Industrial Engine Unit', category: 'Industrial Equipment', image: imageUrls.machineExtra1 },
  { id: '4', title: 'Compact Jobsite Silent Generator', category: 'Power Equipment', image: imageUrls.arquivo2 },
  { id: '5', title: 'Industrial Diesel Driver Engine', category: 'Industrial Equipment', image: imageUrls.arquivo3 },
  { id: '6', title: 'Heavy Duty Site Power Unit', category: 'Power Equipment', image: imageUrls.arquivo4 },
  { id: '7', title: 'Multi-Purpose Field Rotary Tiller', category: 'Agricultural Equipment', image: imageUrls.machineExtra3 },
  { id: '8', title: 'Custom Hardware Supply', category: 'Industrial Equipment', image: imageUrls.machineExtra2 },
  { id: '9', title: 'Diesel Welding Generator 210amps', category: 'Welding Machines', image: imageUrls.dieselWeldingGenerator },
  { id: '10', title: 'Chain tiller/tractor', category: 'Farm Machinery & Equipment', image: imageUrls.chainTractor },
  { id: '11', title: 'Car polisher / t-cut machine', category: 'Hand Tools', image: imageUrls.carPolisher },
  { id: '12', title: 'Hedge trimmer rechargeable', category: 'Farm Machinery & Equipment', image: imageUrls.hedgeTrimmer },
  { id: '13', title: 'Air compressor 50 litres', category: 'Compressors', image: imageUrls.airCompressor },
  { id: '14', title: 'Submersible water pumps for wells', category: 'Water Pumps', image: imageUrls.waterPump },
  { id: '15', title: 'Garden tiller/ farm walking tractor', category: 'Farm Machinery & Equipment', image: imageUrls.walkingTractor },
  { id: '16', title: '25kva standby/automatic Perkins generator', category: 'Generators', image: imageUrls.standby25kva },
  { id: '17', title: '60kva Perkins standby diesel generator', category: 'Generators', image: imageUrls.standby60kva },
  { id: '18', title: 'MIG/MAG gas welding machine portable', category: 'Welding Machines', image: imageUrls.migWelding },
  { id: '19', title: 'RECHARGEABLE HAMMER DRILL', category: 'Hand Tools', image: imageUrls.rechargeableHammerDrill },
  { id: '21', title: 'Magnetic drill', category: 'Hand Tools', image: imageUrls.magneticDrill },
  { id: '23', title: 'Yamaha irrigation water pump', category: 'Water Pumps', image: imageUrls.waterPump },
  { id: '24', title: 'Rechargeable impact wrench', category: 'Hand Tools', image: imageUrls.cordlessImpactWrench },
  { id: '25', title: '50 litres air compressor', category: 'Compressors', image: imageUrls.airCompressor },
  { id: '26', title: 'AIRLESS PAINT SPRAYER/ COLD PAINT SPRAYER', category: 'Heavy Construction Machinery', image: imageUrls.wirelessPaintSprayer },
  { id: '27', title: 'Motorised garden sprayers', category: 'Farm Machinery & Equipment', image: imageUrls.motorisedGardenSprayer },
  { id: '28', title: 'Dc tyre inflator / portable compressor', category: 'Hand Tools', image: imageUrls.tyreInflator },
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