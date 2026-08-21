import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="font-display text-5xl font-bold text-steel-soft">404</p>
      <p className="text-ink dark:text-chalk">This page doesn't exist.</p>
      <Link to="/" className="text-sm font-medium text-pitch hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
