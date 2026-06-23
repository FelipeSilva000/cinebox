import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Bookmark, Eye, Trash2, Users, User } from 'lucide-react';

const Watchlist = ({ onReviewMovie }) => {
  const { user, watchlist, removeFromWatchlist, users } = useContext(AppContext);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'mine' | 'partner'

  if (!user) return null;

  // Identify partner (if any)
  const partner = users.find(u => u.username !== user.username);

  // Apply filters
  let displayList = [...watchlist];
  if (filterTab === 'mine') {
    displayList = displayList.filter(w => w.addedBy === user.username);
  } else if (filterTab === 'partner' && partner) {
    displayList = displayList.filter(w => w.addedBy === partner.username);
  }

  const handleMarkAsWatched = (movie) => {
    // Open review modal with this movie
    onReviewMovie({
      id: movie.movieId,
      title: movie.title,
      poster_path: movie.poster,
      type: movie.type
    });
  };

  const handleRemove = (e, movieId) => {
    e.stopPropagation();
    if (window.confirm('Deseja remover este título da sua lista?')) {
      removeFromWatchlist(movieId);
    }
  };

  return (
    <div style={{ padding: '0 2rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
        <Bookmark size={24} className="text-neon" fill="var(--accent-neon-green)" />
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800 }}>
          Quero Assistir (Watchlist)
        </h1>
      </div>

      {/* Tabs / Filters for couple list splitting */}
      {partner && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setFilterTab('all')}
            className={`btn ${filterTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          >
            <Users size={14} /> Lista Conjunta ({watchlist.length})
          </button>
          
          <button 
            onClick={() => setFilterTab('mine')}
            className={`btn ${filterTab === 'mine' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          >
            <User size={14} /> Adicionados por Mim ({watchlist.filter(w => w.addedBy === user.username).length})
          </button>

          <button 
            onClick={() => setFilterTab('partner')}
            className={`btn ${filterTab === 'partner' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          >
            <User size={14} /> Adicionados por {partner.name} ({watchlist.filter(w => w.addedBy === partner.username).length})
          </button>
        </div>
      )}

      {/* Watchlist Grid */}
      {displayList.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Nenhum título encontrado na lista.
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Explore o catálogo e adicione filmes para assistir mais tarde clicando no ícone de marcador nos pôsteres!
          </p>
        </div>
      ) : (
        <div className="movie-grid" style={{ padding: 0 }}>
          {displayList.map((item) => {
            const isAddedByMe = item.addedBy === user.username;
            return (
              <div 
                key={`${item.movieId}_${item.addedBy}`}
                className="movie-card" 
                style={{ position: 'relative' }}
              >
                <img 
                  src={item.poster || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80'} 
                  alt={item.title} 
                  className="movie-card-poster"
                />

                {/* Badge showing who added it */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'rgba(19, 21, 32, 0.85)',
                  border: '1px solid var(--border-light)',
                  padding: '2px 6px',
                  borderRadius: '12px',
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  color: 'var(--text-main)',
                  zIndex: 4
                }}>
                  {item.addedByName}
                </div>

                {/* Quick actions inside card info overlay */}
                <div className="movie-card-info" style={{ height: '80%' }}>
                  <h3 className="movie-title-card" style={{ fontSize: '0.85rem' }}>{item.title}</h3>
                  <div className="movie-year-card" style={{ fontSize: '0.7rem' }}>
                    {item.type === 'movie' ? 'Filme' : 'Série'}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 'auto' }}>
                    {/* Mark as Watched button */}
                    <button 
                      onClick={() => handleMarkAsWatched(item)}
                      className="btn btn-primary"
                      style={{ 
                        width: '100%', 
                        padding: '4px', 
                        fontSize: '0.75rem', 
                        justifyContent: 'center',
                        borderRadius: '4px'
                      }}
                    >
                      <Eye size={12} /> Assistido
                    </button>

                    {/* Delete from Watchlist button */}
                    {isAddedByMe && (
                      <button 
                        onClick={(e) => handleRemove(e, item.movieId)}
                        className="btn btn-secondary"
                        style={{ 
                          width: '100%', 
                          padding: '4px', 
                          fontSize: '0.75rem', 
                          justifyContent: 'center',
                          borderRadius: '4px',
                          color: '#ef4444',
                          borderColor: 'rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        <Trash2 size={12} /> Remover
                      </button>
                    )}
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

export default Watchlist;
