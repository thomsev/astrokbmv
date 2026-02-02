import { useEffect, useMemo, useState } from 'react';
import '../styles/carousel.css';

export type Slide = {
  title: string;
  description: string;
  image: string;
};

type Props = {
  slides: Slide[];
};

export default function ArtCarousel({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const motionDisabled = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (motionDisabled) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [motionDisabled, slides.length]);

  const slide = slides[index];

  return (
    <div className="carousel">
      <div className="carousel-image">
        <img src={slide.image} alt={slide.title} />
      </div>
      <div className="carousel-text">
        <h3>{slide.title}</h3>
        <p>{slide.description}</p>
      </div>
      <div className="carousel-dots" role="tablist" aria-label="Kunstverk">
        {slides.map((item, idx) => (
          <button
            key={item.title}
            className={`carousel-dot ${idx === index ? 'active' : ''}`}
            aria-label={`Vis ${item.title}`}
            onClick={() => setIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
