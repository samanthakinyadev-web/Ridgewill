export interface PortfolioEntry {
  title: string;
  category: string;
  route?: string;
  description: string;
  image: string;
}

export const portfolio: PortfolioEntry[] = [
  {
    title: 'Europe Fresh Produce Connect',
    category: 'Air Freight',
    route: 'Nairobi → Amsterdam',
    description:
      'Weekly consolidated air freight of fresh flowers and produce from Kenya to the Netherlands, with temperature-controlled handling and priority customs clearance.',
    image: '/assests/AIRFREIGHT.jpeg',
  },
  {
    title: 'West Africa Container Service',
    category: 'Sea Freight',
    route: 'Mombasa → Tema',
    description:
      'Monthly LCL consolidation service moving manufactured goods from Kenya to Ghana, including customs clearance and inland delivery.',
    image: '/assests/SEAFREIGHT.jpeg',
  },
  {
    title: 'Pharmaceutical Dangerous Goods',
    category: 'Dangerous Goods Handling',
    route: 'Nairobi → Dubai',
    description:
      'Compliant transport of temperature-sensitive pharmaceuticals classified as dangerous goods, handling UN-certified packaging and full documentation.',
    image: '/assests/DANGEROUS GOODS.png',
  },
];
