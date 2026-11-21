export type Bundle = {
  id: string;
  name: string;
  data: string;
  price: number;
  validity: string;
  category: "daily" | "weekly" | "monthly" | "unlimited";
  promo?: boolean;
  tag?: string;
};

export const BUNDLES: Bundle[] = [
  { id: "d1", name: "Daily Lite", data: "500MB", price: 0.5, validity: "24 Hours", category: "daily" },
  { id: "d2", name: "Daily Plus", data: "1.5GB", price: 1, validity: "24 Hours", category: "daily", tag: "Popular" },
  { id: "d3", name: "Daily Max", data: "3GB", price: 2, validity: "24 Hours", category: "daily" },
  { id: "w1", name: "Weekly Starter", data: "3GB", price: 2.5, validity: "7 Days", category: "weekly" },
  { id: "w2", name: "Weekly Plus", data: "7GB", price: 4, validity: "7 Days", category: "weekly", tag: "Popular" },
  { id: "w3", name: "Weekly Max", data: "12GB", price: 6, validity: "7 Days", category: "weekly" },
  { id: "m1", name: "Monthly Lite", data: "10GB", price: 5, validity: "30 Days", category: "monthly" },
  { id: "m2", name: "Monthly 20GB", data: "20GB", price: 8, validity: "30 Days", category: "monthly", tag: "Best value" },
  { id: "m3", name: "Monthly Pro", data: "50GB", price: 15, validity: "30 Days", category: "monthly" },
  { id: "u1", name: "Unlimited Night", data: "Unlimited 12am-6am", price: 6, validity: "30 Days", category: "unlimited" },
  { id: "u2", name: "Unlimited", data: "Unlimited", price: 10, validity: "30 Days", category: "unlimited", promo: true },
];

export type Shop = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  headOffice?: boolean;
};

export const SHOPS: Shop[] = [
  {
    id: "s1",
    name: "Tagtel Head Office",
    address: "772 Off Ceres Road, Cranborne Ave & Smuts Rd, Prospect Industrial Park, Harare",
    phone: "+263242700700",
    hours: "Mon-Fri 08:00-17:00, Sat 08:00-14:00",
    lat: -17.8654,
    lng: 31.0724,
    headOffice: true,
  },
  {
    id: "s2",
    name: "Tagtel Avondale Shop",
    address: "Avondale Shopping Centre, King George Rd, Harare",
    phone: "+263242700701",
    hours: "Mon-Fri 08:00-17:00, Sat 08:00-14:00",
    lat: -17.7986,
    lng: 31.036,
  },
  {
    id: "s3",
    name: "Tagtel Bulawayo Shop",
    address: "Fife Street & 9th Avenue, Bulawayo CBD",
    phone: "+263292700702",
    hours: "Mon-Fri 08:00-17:00, Sat 08:00-14:00",
    lat: -20.1533,
    lng: 28.5839,
  },
  {
    id: "s4",
    name: "Tagtel Mutare Shop",
    address: "Herbert Chitepo Street, Mutare",
    phone: "+263202700703",
    hours: "Mon-Fri 08:00-17:00, Sat 08:00-14:00",
    lat: -18.9707,
    lng: 32.6709,
  },
];

export const USAGE_THIS_MONTH = [
  { label: "W1", gb: 4.2 },
  { label: "W2", gb: 6.8 },
  { label: "W3", gb: 3.1 },
  { label: "W4", gb: 5.5 },
];

export const FAQS = [
  {
    q: "Why is my speed slow?",
    a: "Slow speeds are usually caused by network congestion, weather affecting the wireless link, or too many devices on one connection. Restart your router, move closer to it, and check that your bundle has not run out. If it is still slow after 10 minutes, report a fault below.",
  },
  {
    q: "How do I renew my bundle?",
    a: "Open Buy Data, pick the same bundle you had, and pay with EcoCash. Your new bundle starts immediately and any remaining data is carried over for 24 hours.",
  },
  {
    q: "How long does EcoCash payment take?",
    a: "You receive a USSD prompt on your phone within 30 seconds. Enter your EcoCash PIN and your data is loaded within 2 minutes.",
  },
  {
    q: "Can I use one bundle on many devices?",
    a: "Yes. Share it over your Tagtel router Wi-Fi. Data is shared across all connected devices.",
  },
];

export const SUPPORT_WHATSAPP = "263772000000";
export const SUPPORT_PHONE = "+263242700700";
export const SUPPORT_EMAIL = "support@tagtel.co.zw";