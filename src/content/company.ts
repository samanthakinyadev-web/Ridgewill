export const company = {
  name: 'Ridgewill Global Logistics',
  tagline: 'Your Partner For All Your Logistics Solutions',
  brandLine:
    'We do not just deliver cargo. We deliver confidence, continuity, and global connection.',

  phone: '0721 148 009',
  phoneInternational: '254721148009',
  email: 'ridgewillglobal@gmail.com',

  whatsappLink: 'https://wa.me/254721148009',

  address: 'Nairobi, Kenya',

  workingHours: 'Mon–Fri: 8:00 AM – 5:00 PM EAT',

  socialLinks: [
    {
      name: 'WhatsApp',
      url: 'https://wa.me/254721148009',
      icon: 'logo-whatsapp',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/ridgewillglobal',
      icon: 'logo-linkedin',
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/ridgewillglobal',
      icon: 'logo-facebook',
    },
  ] as SocialLink[],

  whatsappMessagePrefix: 'Ridgewill Global Logistics',
} as const;

export interface SocialLink {
  name: string;
  url: string;
  icon?: string;
}

export const siteConfig = {
  title: 'Ridgewill Global Logistics | Freight Forwarding & Supply Chain Solutions',
  description:
    'Reliable freight forwarding connecting Africa to Europe, the Middle East, Asia and beyond. Air freight, sea freight, fresh produce logistics, customs clearance, dangerous goods handling, and warehousing & distribution.',
  url: 'https://ridgewillglobal.com',
} as const;
