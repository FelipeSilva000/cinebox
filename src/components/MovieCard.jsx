import React, { useContext } from 'react';
import { Heart, Bookmark, Edit, BookmarkCheck } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const MovieCard = ({ movie, onReviewClick }) => {
  const { user, reviews, watchlist, toggleFavorite, addToWatchlist, removeFromWatchlist } = useContext(AppContext);

  const movieId = movie.id;
  const isReviewed = user ? reviews.some(r => r.movieId === movieId && r.username === user.username) : false;
  const review = user ? reviews.find(r => r.movieId === movieId && r.username === user.username) : null;
  const isFavorited = review ? review.favorite : false;
  const inWatchlist = user ? watchlist.some(w => w.movieId === movieId && w.addedBy === user.username) : false;

  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    if (!user) return;
    if (inWatchlist) {
      removeFromWatchlist(movieId);
    } else {
      addToWatchlist({
        movieId: movie.id,
        title: movie.title,
        poster: movie.poster_path || movie.poster,
        type: movie.type || 'movie'
      });
    }
  };

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    if (!user) return;
    toggleFavorite(
      movie.id,
      movie.title,
      movie.poster_path || movie.poster,
      movie.type
    );
  };

  return (
    <div className="movie-card" onClick={() => onReviewClick(movie)}>
      <img
        src={movie.poster_path || movie.poster || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80'}
        alt={movie.title}
        className="movie-card-poster"
        loading="lazy"
      />
      
      {/* Quick Action Badges (top right/left of card) */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        zIndex: 5,
        opacity: 0,
        transition: 'opacity 0.25s ease'
      }} className="movie-card-actions">
        {user && (
          <>
            <button
              onClick={handleFavoriteToggle}
              style={{
                background: 'rgba(19, 21, 32, 0.85)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isFavorited ? '#ef4444' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title={isFavorited ? 'Remover dos favoritos' : 'Favoritar'}
            >
              <Heart size={15} fill={isFavorited ? '#ef4444' : 'none'} />
            </button>
            <button
              onClick={handleWatchlistToggle}
              style={{
                background: 'rgba(19, 21, 32, 0.85)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: inWatchlist ? 'var(--accent-neon-orange)' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title={inWatchlist ? 'Remover da minha lista' : 'Adicionar à minha lista'}
            >
              {inWatchlist ? (
                <BookmarkCheck size={15} style={{ color: '#ff8000' }} />
              ) : (
                <Bookmark size={15} />
              )}
            </button>
          </>
        )}
      </div>

      {/* Hover Info Overlay */}
      <div className="movie-card-info">
        <h3 className="movie-title-card">{movie.title}</h3>
        <p className="movie-year-card">
          {movie.release_date ? movie.release_date.split('-')[0] : movie.release_date || 'N/A'}
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          {isReviewed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#ffb800', fontSize: '0.8rem', fontWeight: 'bold' }}>
              <span>★</span> {review.rating}
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              TMDB: {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </div>
          )}
          
          <button style={{
            background: 'var(--accent-neon-green)',
            color: 'var(--bg-primary)',
            border: 'none',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '0.7rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <Edit size={10} /> {isReviewed ? 'Editar' : 'Avaliar'}
          </button>
        </div>
      </div>
      
      {/* Styles inline logic for displaying actions on card hover */}
      <style>{`
        .movie-card:hover .movie-card-actions {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default MovieCard;
