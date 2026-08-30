import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';

export function BrandMark({ size = 34 }) {
  return (
    <span className="brand-mark" style={{ width: size, height: size }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 10h10M7 14h6" />
        <circle cx="19" cy="5" r="3.4" fill="#fbbf24" stroke="#fff" />
      </svg>
    </span>
  );
}

export function Brand() {
  return (
    <Link to="/" className="brand">
      <BrandMark />
      <span>
        Kids Worksheets Generator
        <small>Create printable activities & books</small>
      </span>
    </Link>
  );
}

export function AppNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const inApp = !location.pathname.startsWith('/') || location.pathname === '/';
  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/create', label: 'Create' },
    { to: '/build', label: 'Book Builder' },
    { to: '/projects', label: 'My Projects' },
  ];

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Brand />
        <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? '✕' : '☰'}
        </button>
        <div className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/checkout" className={({ isActive }) => (isActive ? 'active' : '')}>Get $9 Offer</NavLink>
        </div>
        <div className="nav-cta">
          <Link to="/checkout" className="btn btn-primary btn-sm">Get Started for $9</Link>
        </div>
      </div>
    </nav>
  );
}

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <BrandMark size={28} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 700 }}>Kids Worksheets Generator</span>
          <span>· Create Kids Printables & Activity Books in Minutes</span>
        </div>
        <div className="links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
          <Link to="/checkout">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="page">
      <AppNav />
      <div className="wrap">
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
}
