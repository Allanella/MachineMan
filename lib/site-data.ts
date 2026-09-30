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
    longDescription: `This is a Perkins-powered enclosed (soundproof) diesel generator set, built for places that need dependable electricity for long hours, or automatic standby cover when the grid fails. Perkins is one of the best-known names in diesel engines, and sets built around them are valued for steady output, good fuel economy and easy access to spare parts. The steel canopy protects the engine and alternator from rain and dust and keeps noise down, so the set can sit beside buildings as well as on open sites.

Key Specifications:
• Type: Enclosed, sound-attenuated diesel generator set
• Engine: Perkins liquid-cooled diesel engine
• Output: Sets in this class are commonly offered from about 15 kVA up to 50 kVA and above; the exact rating of the unit in stock is confirmed on request
• Output voltage: 230/240 V single phase and 400/415 V three phase, 50 Hz
• Enclosure: Weather-resistant steel canopy with acoustic lining and corrosion-resistant coating
• Controls: Digital controller showing voltage, frequency, oil pressure, engine temperature and running hours

Core Features & Capabilities:
• Sound-Attenuated Canopy: Acoustic lining reduces operating noise, which matters in towns, clinics, offices and residential areas.
• Standby-Ready: Can be paired with an automatic transfer switch (ATS) so the load moves to the generator automatically when mains power drops.
• Built-In Protections: Controllers on sets of this type normally shut the engine down on low oil pressure, high coolant temperature and overload.
• Weather Protection: Sealed, lockable access doors keep rain, dust and tampering away from the engine and alternator.
• Service Friendly: Filters, dipsticks and the battery are reachable through the canopy doors, so routine servicing is quick.

Applications & Suitability:
Well suited to commercial buildings, construction sites, workshops, clinics and hospitals, schools, hotels, factories and farms that need either continuous power or reliable backup.

Note: Exact power rating and specifications depend on the unit in stock. Contact us to confirm before you order.`,
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
    longDescription: `This is a diesel power tiller (two-wheel tractor) built to take the hard labour out of land preparation. A single-cylinder, water-cooled diesel engine drives the wheels and the rotary tiller through a heavy-duty gearbox, turning hard or weedy ground into a fine seedbed far faster than hand tools. The same power unit can also pull a trailer or run a pump, which makes it one of the most useful machines a small or medium farm can own.

Key Specifications (typical for 12 HP class diesel power tillers):
• Type: Walking-type two-wheel diesel power tiller
• Engine: Single-cylinder, horizontal, 4-stroke, water-cooled, direct-injection diesel, typically rated at about 12 HP
• Transmission: Multi-speed gearbox, commonly 6 forward and 2 reverse gears
• Rotary tiller: Working width of about 600 mm, working depth of about 150 mm, with around 18 blades
• Fuel: Tank of roughly 9 to 12 litres; consumption is commonly around 1.2 to 1.4 litres per hour
• Weight: Roughly 370 to 480 kg depending on attachments

Core Features & Capabilities:
• High-Torque Gear Drive: The gearbox puts the engine's low-speed torque to work in heavy soil without belt slip.
• Multi-Purpose Use: Besides tilling, it can be fitted with a plough, trailer, water pump or other attachments to spread its use over the whole season.
• Low Running Cost: A water-cooled diesel engine runs cooler and uses less fuel than a petrol tiller doing the same work.
• Durable Build: Robust steel frame and large-tread tyres give traction on wet or uneven fields.

Applications & Suitability:
Suited to smallholder and commercial farms, vegetable and maize growers, rice and paddy fields, orchards and farm contractors preparing land for planting.

Note: Engine size and attachments vary by unit. Contact us to confirm the specifications of the tiller in stock.`,
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
    longDescription: `This is a stationary industrial diesel engine built to supply steady mechanical power to heavy machinery. It is a bare drive engine, meaning it is meant to be coupled to something else, such as a pump, mill, crusher or generator end, rather than to be used on its own. A heavy cast-iron block and a governed fuel system let it run for long hours at a constant speed, even when the load changes.

Key Specifications:
• Type: Stationary industrial diesel drive engine
• Engine: 4-stroke, direct-injection diesel; water cooled
• Power: Engines of this type are offered across a wide range of ratings, from about 10 HP single-cylinder units up to multi-cylinder engines; the rating of the unit in stock is confirmed on request
• Output: Keyed shaft or flywheel end for belt pulleys or direct couplings
• Starting: Hand crank or electric start, depending on the model
• Mounting: Steel skid or base frame

Core Features & Capabilities:
• Constant-Speed Governor: A mechanical governor keeps engine speed steady when the load is applied or removed.
• Built for Long Duty: Oversized cooling and lubrication are designed for long working days.
• Flexible Power Take-Off: Can drive belts, pulleys, hydraulic pumps or be coupled directly to equipment.
• Easy Maintenance: Simple mechanical design with accessible filters and oil points, so local mechanics can service it.

Applications & Suitability:
A dependable driver for water pumps, irrigation, grain and maize mills, stone crushers, concrete mixers, sawmills and custom-built site machinery.

Note: Power rating and mounting details depend on the unit in stock. Contact us to confirm the specifications.`,
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
    longDescription: `This is a compact, low-noise diesel generator for places where a loud, open-frame set is not an option. A sound-insulated canopy and a fuel-efficient diesel engine make it a comfortable neighbour to shops, offices, clinics and guest houses, while the compact body and wheels make it easy to move and position.

Key Specifications:
• Type: Compact soundproof (silent) diesel generator
• Power: Sets in this class are commonly rated between about 3 kVA and 10 kVA; the rating of the unit in stock is confirmed on request
• Voltage: 230 V single phase, 50 Hz, with a 12 V DC battery-charging output on most models
• Noise: Canopy sets of this size usually run at roughly 65 to 75 dB(A) measured at 7 metres
• Engine: Diesel, air-cooled or water-cooled depending on size
• Mobility: Frame with wheels and a lifting handle

Core Features & Capabilities:
• Low-Noise Canopy: Sound insulation lets it run near people without the noise of an open set.
• Stable Output: An automatic voltage regulator (AVR) holds the voltage steady, which protects computers, tills, lighting and other sensitive equipment.
• Digital Display: Shows voltage, frequency and running hours, and helps you plan maintenance.
• Low Fuel Use: Diesel engines are generally more fuel-efficient than petrol sets for long running periods.
• Built-In Safety: Low-oil shutdown and overload protection guard the engine and the connected equipment.

Applications & Suitability:
Suited to shops, offices, salons, restaurants and cafes, clinics, guest houses, events, mobile businesses and small job sites that need quiet backup power.

Note: Exact power rating and noise level depend on the model in stock. Contact us to confirm.`,
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
    longDescription: `This is a heavy-duty industrial diesel driver engine, meant for machines that have to work for long hours under constant load. It supplies steady mechanical power to equipment such as irrigation pumps, milling machines and crushers, and its strong low-speed torque keeps heavy, high-inertia equipment turning without stalling.

Key Specifications:
• Type: Heavy-duty industrial diesel driver engine
• Engine: 4-stroke, direct-injection diesel; water cooled
• Power: Driver engines of this type are available from about 10 HP to well over 50 HP; the rating of the unit in stock is confirmed on request
• Starting: Electric starter with battery, or hand crank on smaller units
• Drive connection: Keyed shaft, flywheel end or PTO flange, depending on the model
• Frame: Rigid welded base frame with vibration-damping mounts

Core Features & Capabilities:
• Strong Low-Speed Torque: Holds speed under heavy loads, so pumps and mills keep running at working speed.
• Continuous Duty: Built for long working days rather than short, occasional use.
• Dust-Protected Intake: Heavy-duty air filtration protects the engine from dust on farms and work sites.
• Fuel Economy: Direct fuel injection burns diesel efficiently, which lowers the running cost on long jobs.
• Simple to Service: Spare parts and servicing for common diesel engines are easy to find locally.

Applications & Suitability:
Widely used to drive maize and grain mills, irrigation and water-supply pumps, borehole setups, rock crushers, sawmills and other agricultural and industrial processing equipment.

Note: Power rating and drive connection depend on the unit in stock. Contact us to confirm.`,
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
    longDescription: `This is a rugged open-frame site generator built to cope with the dust, knocks and weather of active work sites. A strong tubular steel frame protects the engine and alternator, and outlets for both single-phase and three-phase equipment let it run site lighting, power tools and small machinery from one unit.

Key Specifications:
• Type: Open-frame heavy-duty diesel site generator
• Power: Units of this type are commonly rated from about 5 kVA to 10 kVA; the rating of the unit in stock is confirmed on request
• Outlets: 230 V single-phase sockets and 400 V three-phase industrial sockets on most models
• Frame: Tubular steel roll frame with vibration-damping engine mounts
• Protection: Circuit breakers and overload protection on the control panel
• Fuel: Large diesel tank for long running between refuels

Core Features & Capabilities:
• Rugged Roll Frame: Protects the engine, alternator and control panel from knocks and handling on site.
• Weather-Protected Sockets: Covered outlets help keep splashes and dust out of the electrical connections.
• Long Run Time: A large fuel tank supports full working days without constant refuelling.
• Strong Alternator: Copper-wound alternator copes with the heavy starting current of motors and power tools.
• Easy Handling: Lifting point and handles make it easier to load, move and position.

Applications & Suitability:
Suited to construction sites, road works, steel fabrication and welding workshops, mining camps, farms and emergency power restoration.

Note: Exact power rating and outlets depend on the unit in stock. Contact us to confirm.`,
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
    longDescription: `This is a rotary tiller and cultivator built for efficient soil preparation, weed control and seedbed making. Its powered rotating blades cut through the soil and mix it in a single pass, leaving a fine, even bed that is ready for planting, so it covers ground much faster than hoes or ploughs.

Key Specifications:
• Type: Diesel-powered rotary tiller / cultivator
• Engine: Single-cylinder 4-stroke diesel; the exact size depends on the model
• Working width: Commonly between about 600 mm and 1,200 mm, depending on model
• Working depth: Commonly around 100 to 150 mm, adjustable
• Blades: Hardened steel rotary blades on a tine shaft, with a rear guard
• Controls: Handlebar with throttle, clutch and gear levers

Core Features & Capabilities:
• One-Pass Tilling: Breaks up soil, cuts weeds and mixes in crop residue or manure in a single pass.
• Adjustable Depth: A depth skid or rear stake sets how deep the blades work, for shallow weeding or deeper bed preparation.
• Operator Protection: Side guards and a rear flap reduce flying soil and stones.
• Gear Selection: Lower gears give more torque in hard ground, higher gears suit light weeding and levelling.
• Diesel Economy: Good fuel economy for a full day in the field.

Applications & Suitability:
Suited to vegetable farms, maize and bean fields, tea and coffee plantations, nurseries, greenhouses and gardens.

Note: Working width and engine size vary by model. Contact us to confirm the specifications of the unit in stock.`,
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
    longDescription: `Cannot find the exact machine you need? This service is for customers who want a specific machine, capacity or specification that we do not keep in stock. Tell us what the equipment must do and our team will help you find a suitable match through our supplier contacts, and advise on what to choose before you commit.

What the service covers:
• Service: Sourcing of specialised industrial, power and agricultural equipment to order
• Typical requests: Generators in particular sizes, diesel engines, tillers, pumps and other machinery or hardware
• Advice: Help matching capacity, power and engine type to your actual workload
• Communication: We keep you updated on availability and options as we look

How it works:
• Tell Us What You Need: Share the type of machine, the capacity or size, and how you plan to use it.
• We Search: We check our stock and contact suppliers for suitable options.
• We Advise: We explain the options so you can choose the right specification and budget.
• You Decide: You choose the machine that fits, with our help through the purchase.

Applications & Suitability:
Helpful for contractors, farmers, workshops and businesses with specialised or hard-to-find equipment needs.

Note: Availability, price and delivery time depend on the machine and supplier. Contact us with your requirements and we will confirm.`,
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