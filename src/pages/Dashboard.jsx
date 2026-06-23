import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { fetchHighlights, fetchMoviesByCategory } from '../services/tmdb';
import MovieCarousel from '../components/MovieCarousel';
import { Star, Play, Plus, Info, AlertTriangle, Key } from 'lucide-react';

const Dashboard = ({ onReviewMovie }) => {
  const { tmdbKey, user, watchlist, addToWatchlist, removeFromWatchlist } = useContext(AppContext);
  const [highlights, setHighlights] = useState([]);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);
  const [actionMovies, setActionMovies] = useState([]);
  const [suspenseMovies, setSuspenseMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [scifiMovies, setScifiMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [highs, action, suspense, drama, scifi] = await Promise.all([
          fetchHighlights(tmdbKey),
          fetchMoviesByCategory('action', tmdbKey),
          fetchMoviesByCategory('suspense', tmdbKey),
          fetchMoviesByCategory('drama', tmdbKey),
          fetchMoviesByCategory('scifi', tmdbKey)
        ]);

        setHighlights(highs);
        setActionMovies(action);
        setSuspenseMovies(suspense);
        setDramaMovies(drama);
        setScifiMovies(scifi);
      } catch (error) {
        console.error("Erro ao carregar dados do painel:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [tmdbKey]);

  const activeHighlight = highlights[activeHighlightIndex];
  
  const inWatchlist = (movie) => {
    if (!user || !movie) return false;
    return watchlist.some(w => w.movieId === movie.id && w.addedBy === user.username);
  };

  const handleWatchlistToggle = (movie) => {
    if (!user || !movie) return;
    if (inWatchlist(movie)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist({
        movieId: movie.id,
        title: movie.title,
        poster: movie.poster_path || movie.poster,
        type: 'movie'
      });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(255, 255, 255, 0.05)',
          borderTopColor: 'var(--accent-neon-green)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Preparando seu catálogo de cinema...</div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      
      {/* TMDB Key Alert Banner if not configured */}
      {!tmdbKey && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, rgba(255, 128, 0, 0.15) 0%, rgba(255, 128, 0, 0.05) 100%)',
          border: '1px solid rgba(255, 128, 0, 0.25)',
          borderRadius: '10px',
          padding: '0.75rem 1.5rem',
          margin: '0 2rem 1.5rem',
          fontSize: '0.85rem',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-neon-orange)' }}>
            <AlertTriangle size={16} />
            <span>
              <strong>Modo Demonstrativo Local:</strong> Você está vendo títulos de demonstração de 2026. Configure sua chave gratuita do TMDB nas Configurações para obter dados reais de milhões de títulos e pôsteres online!
            </span>
          </div>
        </div>
      )}

      {/* Hero Banner (Destaques 2026) */}
      {activeHighlight && (
        <div 
          className="hero-banner"
          style={{ backgroundImage: `url(${activeHighlight.backdrop_path})` }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-tag">Destaques 2026</div>
            <h1 className="hero-title">{activeHighlight.title}</h1>
            <p className="hero-overview">{activeHighlight.overview}</p>
            
            <div className="hero-meta">
              <span>
                <Star size={16} fill="#ffb800" stroke="#ffb800" />
                {activeHighlight.vote_average ? activeHighlight.vote_average.toFixed(1) : 'N/A'} (TMDB)
              </span>
              <span>
                Estreia: {activeHighlight.release_date ? new Date(activeHighlight.release_date).toLocaleDateString('pt-BR') : '2026'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => onReviewMovie(activeHighlight)}
                className="btn btn-primary"
              >
                <Play size={16} fill="var(--bg-primary)" /> Avaliar e Comentar
              </button>
              
              {user && (
                <button 
                  onClick={() => handleWatchlistToggle(activeHighlight)}
                  className="btn btn-secondary"
                  style={{ borderColor: inWatchlist(activeHighlight) ? 'var(--accent-neon-orange)' : 'var(--border-light)' }}
                >
                  <Plus size={16} style={{ color: inWatchlist(activeHighlight) ? 'var(--accent-neon-orange)' : '#fff' }} /> 
                  {inWatchlist(activeHighlight) ? 'Remover da Lista' : 'Salvar na Lista'}
                </button>
              )}
            </div>
          </div>

          {/* Banner Selector Dots */}
          {highlights.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '24px',
              right: '32px',
              display: 'flex',
              gap: '8px',
              zIndex: 10
            }}>
              {highlights.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveHighlightIndex(idx)}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: 'none',
                    background: idx === activeHighlightIndex ? 'var(--accent-neon-green)' : 'rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    transition: 'background 0.25s'
                  }}
                  title={`Destaque ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Movie Carousels */}
      <section className="category-section">
        <h2 className="category-title">
          <span>Ação e Aventura</span>
        </h2>
        <MovieCarousel movies={actionMovies} onReviewClick={onReviewMovie} />
      </section>

      <section className="category-section">
        <h2 className="category-title">
          <span>Suspense e Mistério</span>
        </h2>
        <MovieCarousel movies={suspenseMovies} onReviewClick={onReviewMovie} />
      </section>

      <section className="category-section">
        <h2 className="category-title">
          <span>Drama</span>
        </h2>
        <MovieCarousel movies={dramaMovies} onReviewClick={onReviewMovie} />
      </section>

      <section className="category-section">
        <h2 className="category-title">
          <span>Ficção Científica e Fantasia</span>
        </h2>
        <MovieCarousel movies={scifiMovies} onReviewClick={onReviewMovie} />
      </section>

    </div>
  );
};

export default Dashboard;
