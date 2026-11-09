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

export const categories = [
  {
    slug: 'power-equipment',
    name: 'Power Equipment',
    description: 'Heavy-duty generators and dependable power solutions for continuous and backup energy.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6021.JPG-Xrl0eZEmn4ffWvdVXgocgEsxGWoVBb.jpeg'
  },
  {
    slug: 'agricultural-equipment',
    name: 'Agricultural Equipment',
    description: 'Practical, high-yield farm machinery and power tillers engineered for land cultivation.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/arquivo_1790674212804-QZb1sUoUjQ9h9Y5vKYnpknxlj1QubG.jpg'
  },
  {
    slug: 'industrial-equipment',
    name: 'Industrial Equipment',
    description: 'Heavy machinery and driving units built for demanding construction and industrial applications.',
    image: '/arquivo_1790674384786.jpg'
  },
  {
    slug: 'welding-machines',
    name: 'Welding Machines',
    description: 'High-quality diesel and electric welding machines for heavy-duty work.',
    image: '/DieselWeldingGenerator.jpeg'
  },
  {
    slug: 'hand-tools',
    name: 'Hand Tools',
    description: 'Professional grade tools and equipment for workshop and detailing.',
    image: '/Car polisher.jpeg'
  },
  {
    slug: 'compressors',
    name: 'Compressors',
    description: 'Reliable air compressors for workshops and pneumatic tools.',
    image: '/Air compressor.jpeg'
  },
  {
    slug: 'water-pumps',
    name: 'Water Pumps',
    description: 'Efficient water pumps for wells, irrigation, and deep extraction.',
    image: '/Water pump.jpeg'
  },
  {
    slug: 'generators',
    name: 'Generators',
    description: 'Standby and portable diesel generators for residential and commercial power.',
    image: '/Standby generator 25KVA.jpeg'
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

const API_BASE_URL = 'https://machinemanuganda.com/admin/api.php';

function slugify(text: string): string {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

// Fetch live database items from cPanel
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

// Dynamic Machines List
export async function getMachines(): Promise<Machine[]> {
  const items = await getLiveItems();
  return items.map((item) => ({
    id: item.id,
    slug: slugify(item.title),
    name: item.title,
    category: item.category || 'General',
    description: item.description || item.title,
    longDescription: item.description || '',
    availability: 'Available',
    image: item.file_url,
    price: item.price || 'Contact for Price',
    file_type: item.file_type
  }));
}

// Dynamic Gallery Items
export async function getGalleryImages(): Promise<GalleryItem[]> {
  const items = await getLiveItems();
  return items.map((item) => ({
    id: String(item.id),
    title: item.title,
    category: item.category || 'General',
    image: item.file_url,
    file_type: item.file_type || 'image'
  }));
}

// Helper: Get Single Machine
export async function getMachine(slug: string): Promise<Machine | undefined> {
  const machines = await getMachines();
  return machines.find((machine) => machine.slug === slug);
}

// Helper: Get Machines by Category
export async function getCategoryMachines(slug: string): Promise<Machine[]> {
  const category = categories.find((item) => item.slug === slug);
  const machines = await getMachines();
  if (!category) return [];
  return machines.filter((machine) => machine.category.toLowerCase() === category.name.toLowerCase());
}