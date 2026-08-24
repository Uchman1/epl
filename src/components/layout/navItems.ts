import {
  LayoutDashboard,
  CalendarDays,
  Table2,
  Users,
  UserRound,
  BarChart3,
  GitCompareArrows,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Matches', path: '/matches', icon: CalendarDays },
  { label: 'Table', path: '/table', icon: Table2 },
  { label: 'Teams', path: '/teams', icon: Users },
  { label: 'Players', path: '/players', icon: UserRound },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Compare', path: '/compare', icon: GitCompareArrows },
  { label: 'Settings', path: '/settings', icon: Settings },
];

// Mobile bottom nav shows a curated subset — the full set lives in the "More" sheet.
export const MOBILE_PRIMARY_ITEMS: NavItem[] = [
  NAV_ITEMS[0], NAV_ITEMS[1], NAV_ITEMS[2], NAV_ITEMS[3],
];
