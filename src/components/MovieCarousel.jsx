import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieCarousel = ({ movies, onReviewClick }) => {
  const trackRef = useRef(null);

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = trackRef.current.clientWidth * 0.75;
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
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
        style={{
          WebkitOverflowScrolling: 'touch' /* Ativa rolagem inercial nativa no iOS */
        }}
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
