export interface NavItem {
  label: string;
  href: string;
  enabled?: boolean;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Creatures',
    href: '/creatures/',
    children: [
      { label: 'All Creatures', href: '/creatures/' },
      { label: 'Four Perils 四凶', href: '/four-perils/' },
      { label: 'Four Divine 四灵', href: '/four-divine/' },
    ],
  },
  { label: 'Stories', href: '/stories/', enabled: false },
  { label: 'Real-World', href: '/real-world/' },
  { label: 'Name Generator', href: '/name-generator/', enabled: false },
  { label: 'About', href: '/about/' },
];
