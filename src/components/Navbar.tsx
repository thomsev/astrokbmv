import { useEffect, useState } from 'react';
import { cartStore } from './cartStore';

const links = [
  { href: '/', label: 'Hjem' },
  { href: '/kurs', label: 'Kurs' },
  { href: '/kunst', label: 'Kunst' },
  { href: '/butikk', label: 'Butikk' },
  { href: '/webkamera', label: 'Webkamera' },
  { href: '/kontakt', label: 'Kontakt' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const items = cartStore.get();
      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      setCount(total);
    };
    updateCount();
    const unsubscribe = cartStore.subscribe(() => updateCount());
    window.addEventListener('storage', updateCount);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  return (
    <nav className="navbar">
      <a className="nav-brand" href="/">KBMV</a>
      <div className="nav-links">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
        <button className="cart-button" type="button" aria-label="Handlekurv">
          <span>Kurv</span>
          {count > 0 && <span className="cart-badge">{count}</span>}
        </button>
      </div>
      <button
        className="menu-toggle"
        type="button"
        aria-label="Meny"
        onClick={() => setOpen((value) => !value)}
      >
        ☰
      </button>
      {open && (
        <div className="mobile-menu">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <button className="cart-button" type="button" aria-label="Handlekurv">
            <span>Kurv</span>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
        </div>
      )}
    </nav>
  );
}
