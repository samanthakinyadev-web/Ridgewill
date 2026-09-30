export interface Ceo {
  name: string;
  title: string;
  photo: string;
  message: string;
}

export const ceo: Ceo = {
  name: 'WILSON MAINA',
  title: 'CEO',
  photo: '/assests/LOGO.png',
  message:
    'At Ridgewill Global Logistics, we are committed to delivering excellence in every shipment. Our team works around the clock to ensure your cargo reaches its destination safely, on time, and with full transparency.',
};

export type CeoType = typeof ceo;
