import React, { useState, useContext, useEffect } from 'react';
import { X, Heart, Trash2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import StarRating from './StarRating';

const ReviewModal = ({ movie, isOpen, onClose }) => {
  const { user, reviews, addReview, deleteReview } = useContext(AppContext);
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [type, setType] = useState('movie');

  // Load existing review if it exists
  useEffect(() => {
    if (isOpen && movie && user) {
      const reviewId = `${user.username}_${movie.id}`;
      const existingReview = reviews.find((r) => r.id === reviewId);
      
      if (existingReview) {
        setRating(existingReview.rating);
        setComment(existingReview.comment);
        setFavorite(existingReview.favorite || false);
        setType(existingReview.type || 'movie');
      } else {
        // Reset to defaults
        setRating(0);
        setComment('');
        setFavorite(false);
        setType(movie.type || 'movie');
      }
    }
  }, [isOpen, movie, user, reviews]);

  if (!isOpen || !movie) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    addReview({
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster_path || movie.poster || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80',
      rating,
      comment,
      favorite,
      type
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza de que deseja excluir sua avaliação?')) {
      deleteReview(movie.id);
      onClose();
    }
  };

  const reviewId = user ? `${user.username}_${movie.id}` : '';
  const hasExistingReview = reviews.some((r) => r.id === reviewId);

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ padding: '2rem', maxWidth: '550px' }}>
        <button onClick={onClose} className="modal-close">
          <X size={20} />
        </button>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <img
            src={movie.poster_path || movie.poster || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80'}
            alt={movie.title}
            style={{ width: '110px', height: '165px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-light)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              {movie.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              Ano: {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge-tag" style={{ textTransform: 'capitalize' }}>
                {type === 'movie' ? 'Filme' : 'Série'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Sua Avaliação</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <StarRating rating={rating} onChange={setRating} interactive={true} size={30} />
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: rating > 0 ? '#ffb800' : 'var(--text-muted)' }}>
                {rating > 0 ? `${rating} / 5` : 'Sem nota'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Comentário / Crítica</label>
              <button
                type="button"
                onClick={() => setFavorite(!favorite)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: favorite ? '#ef4444' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Heart size={18} fill={favorite ? '#ef4444' : 'none'} />
                {favorite ? 'Favoritado' : 'Favoritar'}
              </button>
            </div>
            <textarea
              className="form-input"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escreva sua opinião sobre este título... (Opcional)"
              style={{ resize: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Tipo</label>
              <select
                className="select-filter"
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ width: '100%', padding: '0.65rem' }}
              >
                <option value="movie">Filme</option>
                <option value="series">Série</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '0.75rem' }}>
            <div>
              {hasExistingReview && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-danger"
                  style={{ padding: '0.6rem 1rem' }}
                  title="Excluir Avaliação"
                >
                  <Trash2 size={16} /> Excluir
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Salvar Avaliação
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
