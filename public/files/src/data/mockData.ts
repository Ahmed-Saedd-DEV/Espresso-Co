import type { Product } from '../types/product';
import type { User } from '../types/auth';
import type { Order } from '../types/order';
import type { CartItem } from '../types/cart';

export const mockUser: User = {
  id: 'u_1001',
  name: 'Julian Vance',
  email: 'julian.vance@espresso-atelier.com',
  role: 'customer',
  verified: true,
  createdAt: '2024-10-15T00:00:00.000Z',
};

export const mockAdminUser: User = {
  ...mockUser,
  id: 'u_admin_1',
  name: 'Avery Morgan',
  email: 'admin@espresso-atelier.com',
  role: 'admin',
};

export const mockProducts: Product[] = [
  {
    id: 'yg-1',
    name: 'Yirgacheffe Washed G1',
    category: 'Single Origin',
    price: 24,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD019ewt-xai65ytoN-WW4-A56U6VcCke_5oId9vMs3fMFfKLu4c8WoUn0XMxhsoQG1HogRMhQVOR9CMMQyNzagh5tu2bSEHY-1dYhIJicogmrPRDaNvRpgLJPCZ--MMklrI1tCem-VzmogW_glt2lqTAgNew9xgtUEozeil9onfQiLEZT1kLarLAjo5la0sm_Fw30aVvwgnGlDroTayIAFTX4TvlG1v-wUePvfkMyta_YfliTP0bY3',
    description: 'A bright and floral washed Ethiopian lot from the Gedeo region, celebrated for its citrus brightness, delicate aromatics, and silky cup structure.',
    subtitle: 'Candied lemon, jasmine bloom, and a clean tea-like finish',
    rating: 4.9,
    reviews: 128,
    stock: 42,
    featured: true,
  },
  {
    id: 'sec-2',
    name: 'Milano Espresso Roast',
    category: 'Signature Blend',
    price: 21.5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg0mkqSmFU_4ushDkokiwadQQfxuGW3H2ztwcN_b_2w3q42icBZnRYN96I_zI7YcGbx3UXJgGbC97FYCOd_CXQTQL_oERuuTjp5NwOmaRG2uc65HmcQBRhL6PPcwcZ1CGy46Y5hobb86w6vO_escS7BN50Z8N_BAfW7f03RnJtIaFUGtyBc6bJdxa76pLwQKYhuRUoFuC49ojgZF7OJKGCJBWLBOA36wx0sui1pSdDoPrT-KzpxLV0',
    description: 'A balanced espresso roast with chocolate depth, caramelized sweetness, and a round body designed for milk and straight espresso service.',
    subtitle: 'Cocoa nib, molasses, and orange peel',
    rating: 4.8,
    reviews: 87,
    stock: 18,
    featured: true,
  },
  {
    id: 'canel-3',
    name: 'Madagascar Vanilla Bean Canelé',
    category: 'Patisserie',
    price: 18.5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdgnfNeUDsY43iv3hPV2L510L2hKUGRdxqAxA8Opk2pBAO5SJvjGxBxE4lr-uCeVfFeX3zHZrcMoLtRoSY-MW7dRrQOGOXf__6ZslLD5PqouYWKbL-GUMe008utYVojZUG36Hg3ir1i35zcC0mCxF1a6BkeIaYI7buk-c-m9VGk0nuVxjz-HG0q8KHz64hMXgZ7HnSxDxcGwUCaQblen_JG_OFfiBwZ7e-EvgVTd8ndjN6jF2SJGiz',
    description: 'A classic French canelé with floral vanilla warmth and deep caramelized edges.',
    subtitle: 'Golden crust and tender custard center',
    rating: 4.7,
    reviews: 64,
    stock: 20,
    featured: true,
  },
  {
    id: 'brew-4',
    name: 'Milan Mini Brew Set',
    category: 'Gear',
    price: 62,
    image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80',
    description: 'A compact barista kit for home brewing with precision pours and a refined, tactile workflow.',
    subtitle: 'Ceramic dripper and brew accessories',
    rating: 4.9,
    reviews: 42,
    stock: 12,
    featured: false,
  },
  {
    id: 'pan-5',
    name: 'Panama Geisha Boquete',
    category: 'Special Release',
    price: 29,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80',
    description: 'A washed Geisha lot prized for floral aroma, layered citrus, and an exceptionally clean finish.',
    subtitle: 'Tea-like and vividly perfumed',
    rating: 5,
    reviews: 19,
    stock: 15,
    featured: false,
  },
  {
    id: 'moc-6',
    name: 'Mocha Nocturne',
    category: 'Dark Roast',
    price: 26,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
    description: 'A deep, velvety roast built for late-night espresso moments and syrupy black chocolate notes.',
    subtitle: 'Dark cocoa, black cherry, and spice',
    rating: 4.8,
    reviews: 56,
    stock: 9,
    featured: false,
  },
];

export const mockCartItems: CartItem[] = [
  {
    id: 'yg-1',
    name: 'Yirgacheffe Reserve 250g',
    category: 'Micro-Lot 08 • Whole Bean',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ4AYOJhCofQ3Jr4MrRvFyJ0WgBnhxu24HJ97U4x1NvW5HEceRK6gM19FYcPrU41Ivg_DTX5AuSF1s9veIVw13kP_cxqFncNi4YNf33hOHYr_z0WD5oPHO20nxBQ5ebDOG0O6xwxQAfTrK-27U-X4_mIJ1ouCvq7vtQS70XbNoAYAe0wyITDpTo39Zxvt1fRufrqPV0xQntvttCRReJeqCafTb2yJIYWIS6im8LZSkFDQ_F6CpnXEBB',
    price: 24,
    quantity: 2,
  },
  {
    id: 'canel-3',
    name: 'Madagascar Vanilla Bean Canelé',
    category: 'Patisserie • Box of 4',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC97ZlK-tBpNT5DlsuBE6_Yj7FTjnHxHuGPHM5S6Y4l_Y34h_ckbS4LQshIoZF0hUgY58ZIJFKd34BDzGzDcangCfu4z9MlQ0kYC5JUV6IVhgJcgBz8TSvbVndiUGyoXC8S4JrwgVU10H7IpFjlOd4ZR-3XdpN-jf_COp1YtHjAuXnbGvUnnRqYsB06dD3zj2RLebcdt1iboe9iXZMC2HMbUIHYDzFFobszeLi1vL6UFa3dXzFD7ojS',
    price: 18.5,
    quantity: 1,
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ESP-88219',
    userId: 'u_1001',
    status: 'PENDING',
    createdAt: '2024-10-30T10:24:00.000Z',
    total: 66.5,
    email: 'julian.vance@espresso-atelier.com',
    customerName: 'Julian Vance',
    shippingAddress: 'Via Brera 22, Milan 20121',
    items: [
      { id: 'yg-1', name: 'Yirgacheffe Reserve 250g', quantity: 2, price: 24, image: mockProducts[0].image },
      { id: 'canel-3', name: 'Madagascar Vanilla Bean Canelé', quantity: 1, price: 18.5, image: mockProducts[2].image },
    ],
  },
  {
    id: 'ESP-88102',
    userId: 'u_1001',
    status: 'PROCESSING',
    createdAt: '2024-10-28T09:15:00.000Z',
    total: 46,
    email: 'julian.vance@espresso-atelier.com',
    customerName: 'Julian Vance',
    shippingAddress: 'Via Brera 22, Milan 20121',
    items: [{ id: 'sec-2', name: 'Cerro Azul Gesha 250g', quantity: 1, price: 46, image: mockProducts[1].image }],
  },
];
