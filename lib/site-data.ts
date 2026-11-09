export type Machine = {
  id?: number | string
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
  file_type?: 'image' | 'video'
}

export type GalleryItem = {
  id: string
  title: string
  category: string
  image: string
  file_type?: 'image' | 'video'
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
  astroKorea: '/Astro Korea.jpeg',
  waterPumps: '/water pumps.jpeg',
};

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
];

export const services = [
  ['Machine Sales', 'Quality machines and equipment ready for site deployment.'],
  ['Equipment Sourcing', 'Custom procurement for specialized industrial hardware and tools.'],
  ['Machine Consultation', 'Professional advice to match equipment to your exact workload requirements.'],
  ['Equipment Supply & Logistics', 'Seamless end-to-end purchasing and delivery assistance in Uganda.']
];

export const navItems = [
  ['Machines', '/machines'],
  ['Categories', '/categories'],
  ['Services', '/services'],
  ['Projects', '/projects'],
  ['Gallery', '/gallery'],
  ['About', '/about'],
  ['Contact', '/contact']
];

export const phone = '+256 707 849 453';
export const email = 'mugenyihussein2001@gmail.com';
export const whatsapp = 'https://wa.me/256707849453';
export const address = 'Kampala, Nabugabo Road, Uganda';
export const siteDescription = 'Machine Man / Machineman Hardware supplies quality machines and equipment in Kampala, Uganda. Located along Nabugabo Road.';

// Static fallback arrays so existing components build successfully
export const machines: Machine[] = [
  {
    slug: 'diesel-welding-generator-210amps',
    name: 'Diesel Welding Generator 210amps',
    category: 'Welding Machines',
    description: 'High-quality diesel welding generator for heavy-duty site work.',
    availability: 'Available',
    image: imageUrls.dieselWeldingGenerator,
    price: 'UGX 4,500,000'
  }
];

export const galleryImages: GalleryItem[] = [
  { id: '1', title: 'Perkins Heavy Silent Generator', category: 'Power Equipment', image: imageUrls.generator }
];

const API_BASE_URL = 'https://machinemanuganda.com/admin/api.php';

function slugify(text: string): string {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export async function getLiveItems(): Promise<any[]> {
  try {
    const res = await fetch(API_BASE_URL, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.ok ? data.items : [];
  } catch (error) {
    console.error('Failed to fetch live inventory:', error);
    return [];
  }
}

export async function getMachines(): Promise<Machine[]> {
  const items = await getLiveItems();
  if (!items.length) return machines;
  return items.map((item) => ({
    id: item.id,
    slug: slugify(item.title),
    name: item.title,
    category: item.category || 'General',
    description: item.description || item.title,
    availability: 'Available',
    image: item.file_url,
    price: item.price || 'Contact for Price',
    file_type: item.file_type
  }));
}

export async function getGalleryImages(): Promise<GalleryItem[]> {
  const items = await getLiveItems();
  if (!items.length) return galleryImages;
  return items.map((item) => ({
    id: String(item.id),
    title: item.title,
    category: item.category || 'General',
    image: item.file_url,
    file_type: item.file_type || 'image'
  }));
}

export async function getMachine(slug: string): Promise<Machine | undefined> {
  const allMachines = await getMachines();
  return allMachines.find((machine) => machine.slug === slug);
}

export async function getCategoryMachines(slug: string): Promise<Machine[]> {
  const category = categories.find((item) => item.slug === slug);
  const allMachines = await getMachines();
  if (!category) return [];
  return allMachines.filter((machine) => machine.category.toLowerCase() === category.name.toLowerCase());
}