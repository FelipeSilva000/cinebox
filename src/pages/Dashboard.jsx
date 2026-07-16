import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { fetchHighlights, fetchMoviesByCategory } from '../services/tmdb';
import MovieCarousel from '../components/MovieCarousel';
import MovieCard from '../components/MovieCard';
import { Star, Play, Plus, AlertTriangle, ChevronRight } from 'lucide-react';

const Dashboard = ({ onReviewMovie }) => {
  const { tmdbKey, user, watchlist, addToWatchlist, removeFromWatchlist } = useContext(AppContext);
  const [highlights, setHighlights] = useState([]);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);
  const [actionMovies, setActionMovies] = useState([]);
  const [suspenseMovies, setSuspenseMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [scifiMovies, setScifiMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recomended'); // 'recomended' | 'movies' | 'series' | 'infantil'

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

  const continueWatchingList = [
    {
      id: 'cw-1',
      title: 'Safe',
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80',
      type: 'series',
      release_date: '2018',
      vote_average: 7.8,
      progress: 65,
      episodeInfo: 'S1 - E4'
    },
    {
      id: 'cw-2',
      title: 'Vis a vis',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80',
      type: 'series',
      release_date: '2019',
      vote_average: 8.2,
      progress: 80,
      episodeInfo: 'S4 - E7'
    },
    {
      id: 'cw-3',
      title: 'Vis a vis',
      poster: 'https://images.unsplash.com/photo-1478720143022-10d000285563?auto=format&fit=crop&w=500&q=80',
      type: 'series',
      release_date: '2018',
      vote_average: 8.2,
      progress: 10,
      episodeInfo: 'S3 - E4'
    }
  ];

  const infantilMovies = [
    { 
      id: 'kid-1', 
      title: 'Moana 2', 
      poster_path: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80', 
      release_date: '2026-11-27', 
      vote_average: 8.4,
      type: 'movie'
    },
    { 
      id: 'kid-2', 
      title: 'Toy Story 5', 
      poster_path: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80', 
      release_date: '2026-06-19', 
      vote_average: 8.1,
      type: 'movie'
    },
    { 
      id: 'kid-3', 
      title: 'Divertida Mente 2', 
      poster_path: 'https://images.unsplash.com/photo-1478720143022-10d000285563?auto=format&fit=crop&w=500&q=80', 
      release_date: '2024-06-14', 
      vote_average: 8.6,
      type: 'movie'
    },
    { 
      id: 'kid-4', 
      title: 'Meu Malvado Favorito 4', 
      poster_path: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80', 
      release_date: '2024-07-03', 
      vote_average: 7.9,
      type: 'movie'
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(255, 255, 255, 0.05)',
          borderTopColor: 'var(--accent-orange)',
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
        }} className="tmdb-warning-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-orange)' }}>
            <AlertTriangle size={16} />
            <span>
              <strong>Modo Demonstrativo:</strong> Configure sua chave do TMDB em Configurações para obter dados reais de milhões de títulos e pôsteres online!
            </span>
          </div>
        </div>
      )}

      {/* Top Tab Bar Navigation (YouCine Style) */}
      <div className="top-tab-bar">
        <button 
          className={`top-tab-item ${activeTab === 'recomended' ? 'active' : ''}`}
          onClick={() => setActiveTab('recomended')}
        >
          Recomendações
        </button>
        <button 
          className={`top-tab-item ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          Filmes
        </button>
        <button 
          className={`top-tab-item ${activeTab === 'series' ? 'active' : ''}`}
          onClick={() => setActiveTab('series')}
        >
          Séries
        </button>
        <button 
          className={`top-tab-item ${activeTab === 'infantil' ? 'active' : ''}`}
          onClick={() => setActiveTab('infantil')}
        >
          Infantil
        </button>
      </div>

      {/* Hero Banner (Destaques 2026) - Hidden on mobile */}
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
                <Play size={16} fill="#000" /> Avaliar e Comentar
              </button>
              
              {user && (
                <button 
                  onClick={() => handleWatchlistToggle(activeHighlight)}
                  className="btn btn-secondary"
                  style={{ borderColor: inWatchlist(activeHighlight) ? 'var(--accent-orange)' : 'var(--border-light)' }}
                >
                  <Plus size={16} style={{ color: inWatchlist(activeHighlight) ? 'var(--accent-orange)' : '#fff' }} /> 
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
                    background: idx === activeHighlightIndex ? 'var(--accent-orange)' : 'rgba(255,255,255,0.3)',
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

      {/* CONTINUAR ASSISTINDO (Only under Recomendações tab) */}
      {activeTab === 'recomended' && (
        <section className="category-section">
          <div className="category-title-container">
            <h2 className="category-title">Continuar Assistindo</h2>
            <ChevronRight size={22} className="category-chevron" />
          </div>
          <div className="carousel-container">
            <div className="carousel-track">
              {continueWatchingList.map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onReviewClick={onReviewMovie} 
                  progress={movie.progress}
                  episodeInfo={movie.episodeInfo}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES FILTERED BY TAB */}
      
      {/* 1. Aventura Sem Fim / Ação (Shown in Recomendações & Filmes) */}
      {(activeTab === 'recomended' || activeTab === 'movies') && (
        <section className="category-section">
          <div className="category-title-container">
            <h2 className="category-title">{activeTab === 'movies' ? 'Ação' : 'Aventura Sem Fim'}</h2>
            <ChevronRight size={22} className="category-chevron" />
          </div>
          <MovieCarousel movies={actionMovies} onReviewClick={onReviewMovie} />
        </section>
      )}

      {/* 2. Suspense e Mistério (Shown in Recomendações & Séries) */}
      {(activeTab === 'recomended' || activeTab === 'series') && (
        <section className="category-section">
          <div className="category-title-container">
            <h2 className="category-title">Suspense e Mistério</h2>
            <ChevronRight size={22} className="category-chevron" />
          </div>
          <MovieCarousel movies={suspenseMovies} onReviewClick={onReviewMovie} />
        </section>
      )}

      {/* 3. Filmes em Alta / Drama (Shown in Recomendações & Filmes) */}
      {(activeTab === 'recomended' || activeTab === 'movies') && (
        <section className="category-section">
          <div className="category-title-container">
            <h2 className="category-title">Filmes em Alta</h2>
            <ChevronRight size={22} className="category-chevron" />
          </div>
          <MovieCarousel movies={dramaMovies} onReviewClick={onReviewMovie} />
        </section>
      )}

      {/* 4. Ficção Científica / Séries (Shown in Recomendações & Séries) */}
      {(activeTab === 'recomended' || activeTab === 'series') && (
        <section className="category-section">
          <div className="category-title-container">
            <h2 className="category-title">Ficção Científica e Fantasia</h2>
            <ChevronRight size={22} className="category-chevron" />
          </div>
          <MovieCarousel movies={scifiMovies} onReviewClick={onReviewMovie} />
        </section>
      )}

      {/* 5. Infantil / Animação (Shown only in Infantil tab) */}
      {activeTab === 'infantil' && (
        <section className="category-section">
          <div className="category-title-container">
            <h2 className="category-title">Infantil e Animação</h2>
            <ChevronRight size={22} className="category-chevron" />
          </div>
          <MovieCarousel movies={infantilMovies} onReviewClick={onReviewMovie} />
        </section>
      )}

    </div>
  );
};

export default Dashboard;
