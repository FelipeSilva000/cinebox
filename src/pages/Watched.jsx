import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import StarRating from '../components/StarRating';
import { Heart, Calendar, Filter, Edit2 } from 'lucide-react';

const Watched = ({ onReviewMovie }) => {
  const { user, reviews, users } = useContext(AppContext);
  
  const [filterUser, setFilterUser] = useState('all'); // 'all' | username
  const [filterType, setFilterType] = useState('all'); // 'all' | 'movie' | 'series'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'rating-desc' | 'rating-asc'

  if (!user) return null;

  // 1. Filter reviews
  let filteredReviews = reviews.filter(r => r.rating > 0); // Only watched/rated titles

  if (filterUser !== 'all') {
    filteredReviews = filteredReviews.filter(r => r.username === filterUser);
  }

  if (filterType !== 'all') {
    filteredReviews = filteredReviews.filter(r => r.type === filterType);
  }

  // 2. Sort reviews
  filteredReviews.sort((a, b) => {
    if (sortBy === 'newest') {
      return b.timestamp - a.timestamp;
    }
    if (sortBy === 'rating-desc') {
      return b.rating - a.rating;
    }
    if (sortBy === 'rating-asc') {
      return a.rating - b.rating;
    }
    return 0;
  });

  const handleEditReview = (review) => {
    onReviewMovie({
      id: review.movieId,
      title: review.title,
      poster_path: review.poster,
      type: review.type
    });
  };

  return (
    <div style={{ padding: '0 2rem' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', textAlign: 'left' }}>
        Títulos Assistidos e Diários
      </h1>

      {/* Filter and Sorting Bar */}
      <div className="glass-panel filters-bar" style={{ border: '1px solid var(--border-light)' }}>
        <div className="filters-group">
          <Filter size={16} style={{ color: 'var(--accent-neon-green)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Filtros:</span>
          
          {/* User Filter */}
          <select 
            className="select-filter"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          >
            <option value="all">Todos os Perfis</option>
            {users.map(u => (
              <option key={u.username} value={u.username}>Apenas {u.name}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select 
            className="select-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Filmes & Séries</option>
            <option value="movie">Apenas Filmes</option>
            <option value="series">Apenas Séries</option>
          </select>
        </div>

        {/* Sorting option */}
        <div className="filters-group">
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Ordenar por:</span>
          <select 
            className="select-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Mais recentes</option>
            <option value="rating-desc">Nota: Maior para Menor</option>
            <option value="rating-asc">Nota: Menor para Maior</option>
          </select>
        </div>
      </div>

      {/* Watched reviews list */}
      {filteredReviews.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Nenhum registro encontrado com os filtros selecionados.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          {filteredReviews.map((review) => {
            const isOwnReview = review.username === user.username;
            return (
              <div 
                key={review.id} 
                className="glass-panel review-log-card" 
                style={{ 
                  textAlign: 'left', 
                  position: 'relative',
                  border: '1px solid var(--border-light)',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                {/* Movie Poster */}
                <img 
                  src={review.poster} 
                  alt={review.title}
                  style={{ 
                    width: '90px', 
                    height: '135px', 
                    borderRadius: '6px', 
                    objectFit: 'cover', 
                    border: '1px solid var(--border-light)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)' 
                  }}
                />

                {/* Review Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff', margin: '0 0 0.25rem' }}>
                        {review.title}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span className="badge-tag" style={{ fontSize: '0.7rem' }}>
                          {review.type === 'movie' ? 'Filme' : 'Série'}
                        </span>
                        
                        {/* Rating stars */}
                        <StarRating rating={review.rating} size={15} />

                        {review.favorite && (
                          <Heart size={14} fill="#ef4444" stroke="#ef4444" />
                        )}
                      </div>
                    </div>

                    {/* Edit button if own review */}
                    {isOwnReview && (
                      <button
                        onClick={() => handleEditReview(review)}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-light)',
                          color: 'var(--text-muted)',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.8rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Edit2 size={12} /> Editar
                      </button>
                    )}
                  </div>

                  {/* Review Text */}
                  <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', margin: '1rem 0 0.75rem', lineHeight: '1.5' }}>
                    {review.comment ? (
                      review.comment
                    ) : (
                      <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Sem comentário registrado.</span>
                    )}
                  </p>

                  {/* Review Meta Info */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '0.75rem',
                    marginTop: '0.75rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                  }}>
                    {/* User profile that wrote this */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img 
                        src={review.userAvatar} 
                        alt={review.userDisplayName}
                        style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span>Avaliado por <strong>{review.userDisplayName}</strong></span>
                    </div>

                    {/* Date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} />
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Watched;
