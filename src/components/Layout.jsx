import React, { useContext, useState, useEffect, useRef } from 'react';
import { 
  Home, 
  User, 
  Heart, 
  Film, 
  Bookmark, 
  Settings, 
  LogOut, 
  Search, 
  Plus,
  Compass
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { searchCatalog } from '../services/tmdb';

const Layout = ({ children, currentPage, setCurrentPage, onReviewMovie }) => {
  const { user, logout, tmdbKey } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        const results = await searchCatalog(searchQuery, tmdbKey);
        setSearchResults(results);
        setIsSearching(false);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, tmdbKey]);

  // Click outside search listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (movie) => {
    onReviewMovie(movie);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleAddManualClick = () => {
    // Open review modal with an empty custom movie structure
    const emptyCustomMovie = {
      id: `custom-${Date.now()}`,
      title: searchQuery || 'Novo Filme Personalizado',
      poster_path: '',
      release_date: new Date().toISOString().split('T')[0],
      overview: '',
      type: 'movie',
      vote_average: 0
    };
    onReviewMovie(emptyCustomMovie);
    setSearchQuery('');
    setShowResults(false);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'favorites', label: 'Favoritos', icon: Heart },
    { id: 'watched', label: 'Assistidos', icon: Film },
    { id: 'watchlist', label: 'Minha Lista', icon: Bookmark },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">
            <Compass size={28} className="text-neon" />
            <span>CineBox</span>
          </div>

          <nav className="sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </nav>
        </div>

        {/* User Profile Info & Logout */}
        {user && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="sidebar-profile">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className={`avatar ${user.isGoogle ? 'google' : ''}`}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  @{user.username}
                </div>
              </div>
            </div>
            
            <button 
              onClick={logout} 
              className="sidebar-item"
              style={{ background: 'transparent', border: 'none', width: '100%', marginTop: '0.25rem' }}
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Container */}
      <div className="main-content">
        {/* Top Header */}
        <header className="header">
          {/* Search Input and Live Dropdown */}
          <div className="search-container" ref={searchRef} style={{ position: 'relative' }}>
            <Search size={18} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar filmes ou séries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length > 1 && setShowResults(true)}
            />

            {showResults && (
              <div className="search-results-overlay">
                {isSearching ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Buscando no catálogo...
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((movie) => (
                      <div
                        key={movie.id}
                        className="search-result-item"
                        onClick={() => handleResultClick(movie)}
                      >
                        <img
                          src={movie.poster_path || movie.poster}
                          alt={movie.title}
                          className="search-result-poster"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=50&q=80'; }}
                        />
                        <div className="search-result-details">
                          <div className="search-result-title">{movie.title}</div>
                          <div className="search-result-meta">
                            {movie.release_date} • {movie.type === 'series' ? 'Série' : 'Filme'}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Option to add custom manual review */}
                    <div
                      className="search-result-item"
                      onClick={handleAddManualClick}
                      style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0, 224, 84, 0.04)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', color: 'var(--accent-neon-green)' }}>
                        <Plus size={16} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                          Não achou? Cadastre "{searchQuery}" manualmente
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                      Nenhum resultado encontrado.
                    </div>
                    <button
                      onClick={handleAddManualClick}
                      className="btn btn-secondary"
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', justifyContent: 'center' }}
                    >
                      <Plus size={14} /> Cadastrar "{searchQuery}" manualmente
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Actions (Responsive) */}
          <div className="header-actions">
            <span className="header-project-title" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ProjetoBox • Diário de Filmes
            </span>
            {user && (
              <div className="header-mobile-profile" style={{ alignItems: 'center', gap: '0.75rem' }}>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className={`avatar ${user.isGoogle ? 'google' : ''}`}
                  style={{ width: '32px', height: '32px', margin: 0 }}
                />
                <button 
                  onClick={logout} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                  title="Sair"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content Injection */}
        <main style={{ padding: '1rem 0' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
