import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { NAV_ITEMS } from './navItems';
import { Wordmark } from './Wordmark';

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-chalk-line bg-white/60 px-4 py-6 dark:border-ink-line dark:bg-ink-soft/40 lg:flex">
      <div className="px-2 pb-6">
        <Wordmark />
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-pitch text-white'
                  : 'text-steel hover:bg-chalk-soft hover:text-ink dark:hover:bg-ink-line/50 dark:hover:text-chalk'
              )
            }
          >
            <item.icon className="h-4 w-4" strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <p className="px-3 pt-4 text-[11px] leading-relaxed text-steel-soft">
        Mock season data for development. Connect a live provider in Settings.
      </p>
    </aside>
  );
}
