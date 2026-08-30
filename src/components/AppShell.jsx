import { Outlet, NavLink } from 'react-router-dom';
import Icon from './Icon.jsx';

const items = [
  { to: '/create', label: 'Create', icon: 'sparkles' },
  { to: '/activities', label: 'Activities', icon: 'grid' },
  { to: '/build', label: 'Book Builder', icon: 'book' },
  { to: '/projects', label: 'My Projects', icon: 'folder' },
  { to: '/checkout', label: 'Export & Upgrade', icon: 'download' },
];

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <aside className="app-side">
        <div className="side-label">Workspace</div>
        <nav className="side-nav">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon name={it.icon} size={18} /> {it.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="app-main">{children || <Outlet />}</div>
    </div>
  );
}
