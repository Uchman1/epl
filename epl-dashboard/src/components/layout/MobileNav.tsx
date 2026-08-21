import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { MOBILE_PRIMARY_ITEMS } from './navItems';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { NAV_ITEMS } from './navItems';

export function MobileNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreItems = NAV_ITEMS.slice(MOBILE_PRIMARY_ITEMS.length);

  return (
    <>
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute inset-x-0 bottom-16 rounded-t-2xl border-t border-chalk-line bg-white p-3 dark:border-ink-line dark:bg-ink-soft"
            onClick={(e) => e.stopPropagation()}
          >
            {moreItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-ink dark:text-chalk"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-stretch border-t border-chalk-line bg-white/95 backdrop-blur dark:border-ink-line dark:bg-ink-soft/95 lg:hidden">
        {MOBILE_PRIMARY_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              clsx(
                'flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium',
                isActive ? 'text-pitch' : 'text-steel'
              )
            }
          >
            <item.icon className="h-5 w-5" strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
        <button
          onClick={() => setMoreOpen((v) => !v)}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-steel"
        >
          <MoreHorizontal className="h-5 w-5" />
          More
        </button>
      </nav>
    </>
  );
}
