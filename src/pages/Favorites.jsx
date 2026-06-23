import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import MovieCard from '../components/MovieCard';
import { Heart } from 'lucide-react';

const Favorites = ({ onReviewMovie }) => {
  const { user, reviews } = useContext(AppContext);

  if (!user) return null;

  // Filter reviews by current user and favorite flag
  const favoriteReviews = reviews.filter(
    (r) => r.username === user.username && r.favorite === true
  );

  return (
    <div style={{ padding: '0 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
        <Heart size={24} className="text-neon" fill="var(--accent-neon-green)" />
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800 }}>
          Seus Favoritos
        </h1>
      </div>

      {favoriteReviews.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ marginBottom: '1rem', fontSize: '3rem' }}>🖤</div>
          Nenhum filme ou série favoritado ainda.
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Durante a avaliação de um filme, clique no ícone de Coração para salvá-lo aqui!
          </p>
        </div>
      ) : (
        <div className="movie-grid" style={{ padding: 0 }}>
          {favoriteReviews.map((review) => {
            // Map review data to structure required by MovieCard
            const movieObj = {
              id: review.movieId,
              title: review.title,
              poster_path: review.poster,
              type: review.type,
              vote_average: 0
            };
            return (
              <MovieCard
                key={review.id}
                movie={movieObj}
                onReviewClick={onReviewMovie}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;
