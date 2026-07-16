import React, { useContext } from 'react';
import { Heart, Bookmark, BookmarkCheck } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const MovieCard = ({ movie, onReviewClick, progress, episodeInfo }) => {
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
    <div className="movie-card-container" onClick={() => onReviewClick(movie)}>
      <div className="movie-card">
        <img
          src={movie.poster_path || movie.poster || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80'}
          alt={movie.title}
          className="movie-card-poster"
          loading="lazy"
        />
        
        {/* Quick Action Badges (top right of card) */}
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
                  color: inWatchlist ? 'var(--accent-orange)' : '#fff',
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

        {/* Episode/Season Overlay Info */}
        {episodeInfo && (
          <div style={{
            position: 'absolute',
            bottom: progress !== undefined ? '10px' : '6px',
            left: '6px',
            background: 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.65rem',
            fontWeight: '600',
            zIndex: 4
          }}>
            {episodeInfo}
          </div>
        )}

        {/* Progress Bar Overlay */}
        {progress !== undefined && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.2)',
            zIndex: 4
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'var(--accent-orange)'
            }} />
          </div>
        )}

        {/* Hover Info Overlay */}
        <div className="movie-card-info">
          <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'center', height: '100%', width: '100%' }}>
            <span style={{
              background: 'var(--accent-orange)',
              color: '#000',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: '700',
              boxShadow: '0 2px 8px rgba(255, 159, 28, 0.4)',
              margin: 'auto'
            }}>
              {isReviewed ? 'Editar' : 'Avaliar'}
            </span>
          </div>
        </div>
      </div>

      {/* Movie Details Under Poster (YouCine/Premium style) */}
      <div className="movie-card-title-under" title={movie.title}>
        {movie.title}
      </div>
      <div className="movie-card-meta-under">
        <span>{movie.release_date ? movie.release_date.split('-')[0] : movie.release_date || 'N/A'}</span>
        {isReviewed ? (
          <span style={{ color: '#ffb800', fontWeight: 'bold' }}>★ {review.rating}</span>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>★ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
        )}
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
