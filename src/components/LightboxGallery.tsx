import { useEffect, useRef, useState } from 'react';
import '../styles/lightbox.css';

type ArtItem = {
  title: string;
  description: string;
  image: string;
};

type Props = {
  items: ArtItem[];
};

export default function LightboxGallery({ items }: Props) {
  const [active, setActive] = useState<ArtItem | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActive(null);
      }
      if (event.key === 'Tab') {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    panelRef.current?.querySelector<HTMLElement>('button')?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [active]);

  return (
    <>
      <div className="gallery-grid">
        {items.map((item) => (
          <button
            key={item.title}
            type="button"
            className="gallery-card"
            onClick={() => setActive(item)}
          >
            <img src={item.image} alt={item.title} />
          </button>
        ))}
      </div>
      {active && (
        <div
          className="lightbox-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActive(null);
          }}
        >
          <div className="lightbox-panel" ref={panelRef} role="dialog" aria-modal="true">
            <img src={active.image} alt={active.title} />
            <div className="lightbox-content">
              <button className="lightbox-close" onClick={() => setActive(null)} aria-label="Lukk">
                ✕
              </button>
              <h3>{active.title}</h3>
              <p>{active.description}</p>
              <a className="button" href="/kontakt">
                Kontakt om kjøp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
