import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieCarousel = ({ movies, onReviewClick }) => {
  const trackRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = trackRef.current.clientWidth * 0.75;
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleTouchStart = (e) => {
    isDown.current = true;
    startX.current = e.touches[0].pageX - trackRef.current.offsetLeft;
    scrollLeftStart.current = trackRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isDown.current) return;
    const x = e.touches[0].pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Ajuste de sensibilidade do swipe
    trackRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleTouchEnd = () => {
    isDown.current = false;
  };

  if (!movies || movies.length === 0) {
    return (
      <div style={{ padding: '2rem 0', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>
        Nenhum título encontrado nesta categoria.
      </div>
    );
  }

  return (
    <div className="carousel-container">
      {/* Left Navigation Arrow */}
      <button 
        className="carousel-btn left" 
        onClick={() => scroll('left')}
        title="Rolar para esquerda"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Movie Row Track */}
      <div 
        className="carousel-track" 
        ref={trackRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {movies.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            onReviewClick={onReviewClick} 
          />
        ))}
      </div>

      {/* Right Navigation Arrow */}
      <button 
        className="carousel-btn right" 
        onClick={() => scroll('right')}
        title="Rolar para direita"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default MovieCarousel;
