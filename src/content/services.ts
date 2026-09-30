export interface Service {
  id: string;
  slug: string;
  title: string;
  shortName: string;
  tagline: string;
  icon: string;
  intro: string;
  highlights: string[];
  idealFor: string;
  image: string;
}

export const services: Service[] = [
  {
    id: 'air-freight',
    slug: 'air-freight',
    title: 'Air Freight',
    shortName: 'Air Freight',
    tagline: 'Fast, reliable air cargo solutions',
    icon: '✈',
    intro:
      'Our air freight services ensure your time-sensitive shipments move quickly and securely across the globe. We partner with leading airlines and handle export coordination to guarantee on-time delivery.',
    highlights: [
      'Door-to-door pickup and delivery worldwide',
      'Real-time shipment tracking',
      'Priority handling for urgent consignments',
      'Competitive rates with no hidden costs',
    ],
    idealFor: 'Urgent shipments, high-value cargo, and time-critical deliveries.',
    image: '/services/air-freight.jpg',
  },
  {
    id: 'sea-freight',
    slug: 'sea-freight',
    title: 'Sea Freight',
    shortName: 'Sea Freight',
    tagline: 'Cost-effective ocean shipping solutions',
    icon: '🚢',
    intro:
      'We offer full and less-than-container-load (LCL) ocean freight services with competitive pricing and reliable transit times. Our extensive network ensures seamless shipping from origin to destination.',
    highlights: [
      'FCL and LCL consolidation services',
      'Direct and transhipment routing options',
      'Cargo insurance available',
      'Customs documentation handled',
    ],
    idealFor: 'Bulk cargo, manufactured goods, and cost-effective shipments.',
    image: '/services/sea-freight.jpg',
  },
  {
    id: 'fresh-produce-logistics',
    slug: 'fresh-produce-logistics',
    title: 'Fresh Produce Logistics',
    shortName: 'Fresh Produce Logistics',
    tagline: 'Specialized cold-chain logistics for perishables',
    icon: '🥦',
    intro:
      'We specialize in the temperature-controlled transportation of fresh produce, perishables, and chilled goods. Our cold-chain solutions maintain product integrity from farm to market across Africa and beyond.',
    highlights: [
      'Temperature-controlled transport at every stage',
      'Phytosanitary and health certificate handling',
      'Specialized packaging and palletization',
      'Priority export documentation for perishables',
    ],
    idealFor: 'Fresh fruits, vegetables, flowers, dairy, and other perishable goods.',
    image: '/services/fresh-produce.png',
  },
  {
    id: 'customs-clearance',
    slug: 'customs-clearance',
    title: 'Customs Clearance',
    shortName: 'Customs Clearance',
    tagline: 'Expert customs brokerage services',
    icon: '📋',
    intro:
      'Our experienced customs brokers ensure your cargo clears border agencies smoothly and in compliance with local and international regulations. We handle all documentation and duties on your behalf.',
    highlights: [
      'Complete customs documentation preparation',
      'Duty and tax calculation and payment',
      'Compliance with local regulations',
      'Proactive communication on clearance status',
    ],
    idealFor: 'Importers and exporters needing seamless customs processing.',
    image: '/services/customs-clearance.jpg',
  },
  {
    id: 'dangerous-goods-handling',
    slug: 'dangerous-goods-handling',
    title: 'Dangerous Goods Handling',
    shortName: 'Dangerous Goods Handling',
    tagline: 'Compliant dangerous goods transportation',
    icon: '⚠',
    intro:
      'We provide certified handling and transportation of dangerous goods by air, sea, and road. All operations comply with IATA, IMDG, and ADR regulations to ensure safety and regulatory adherence.',
    highlights: [
      'IATA, IMDG, and ADR compliant packaging',
      'Specialized dangerous goods training certification',
      'Proper labeling, marking, and documentation',
      'Safety data sheet management',
    ],
    idealFor: 'Chemicals, pharmaceuticals, batteries, and other regulated shipments.',
    image: '/services/dangerous-goods.png',
  },
  {
    id: 'warehousing-distribution',
    slug: 'warehousing-distribution',
    title: 'Warehousing & Distribution',
    shortName: 'Warehousing & Distribution',
    tagline: 'Secure storage and efficient distribution',
    icon: '📦',
    intro:
      'Our modern warehousing facilities offer secure, climate-controlled storage and value-added distribution services. From inventory management to final-mile delivery, we keep your supply chain moving.',
    highlights: [
      'Secure, climate-controlled storage facilities',
      'Inventory management and order fulfillment',
      'Pick-and-pack and kitting services',
      'Distribution to multiple destinations',
    ],
    idealFor: 'Businesses needing storage, fulfillment, and distribution services.',
    image: '/services/warehousing.jpg',
  },
];

export const serviceBySlug = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);
