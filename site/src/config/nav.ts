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
      { label: 'Four Symbols 四象', href: '/four-symbols/' },
    ],
  },
  { label: 'Stories', href: '/stories/' },
  { label: 'Real-World', href: '/real-world/' },
  { label: 'Articles', href: '/articles/' },
  {
    label: 'Name Generator',
    href: '/name-generator/',
    enabled: true,
    children: [
      { label: 'Xianxia Name 道号', href: '/name-generator/' },
      { label: 'Cultivator 修仙者名', href: '/cultivator-name-generator/' },
      { label: 'Sect 宗门名', href: '/sect-name-generator/' },
      { label: 'Sword 剑名', href: '/sword-name-generator/' },
      { label: 'Fox Spirit 狐仙名', href: '/fox-name-generator/' },
      { label: 'Dragon Name 龙名', href: '/dragon-name-generator/' },
    ],
  },
  { label: 'Versus', href: '/versus/' },
  { label: 'About', href: '/about/' },
];
