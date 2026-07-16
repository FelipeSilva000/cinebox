import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import StarRating from '../components/StarRating';
import { Film, Tv, Award, Heart, Edit } from 'lucide-react';

const Profile = ({ onReviewMovie }) => {
  const { user, reviews } = useContext(AppContext);

  if (!user) return null;

  // Filter reviews for this profile
  const userReviews = reviews.filter((r) => r.username === user.username);
  
  // Calculate Stats
  const moviesReviews = userReviews.filter((r) => r.type === 'movie' && r.rating > 0);
  const seriesReviews = userReviews.filter((r) => r.type === 'series' && r.rating > 0);
  const favoriteReviews = userReviews.filter((r) => r.favorite === true);
  
  const ratedReviews = userReviews.filter((r) => r.rating > 0);
  const averageRating = ratedReviews.length > 0
    ? (ratedReviews.reduce((sum, r) => sum + r.rating, 0) / ratedReviews.length).toFixed(1)
    : '0.0';

  // Rating distribution counts (1 to 5 stars)
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratedReviews.forEach((r) => {
    const roundedRating = Math.round(r.rating);
    if (ratingDistribution[roundedRating] !== undefined) {
      ratingDistribution[roundedRating]++;
    }
  });

  const maxDistributionCount = Math.max(...Object.values(ratingDistribution), 1);

  const handleEditReview = (review) => {
    // Format review object to match the parameter expected by ReviewModal
    onReviewMovie({
      id: review.movieId,
      title: review.title,
      poster_path: review.poster,
      type: review.type
    });
  };

  return (
    <div style={{ padding: '0 2rem' }}>
      {/* Profile Info Header */}
      <div className="glass-panel profile-header" style={{ border: '1px solid var(--border-light)' }}>
        <img 
          src={user.avatar} 
          alt={user.name} 
          style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid var(--accent-orange)', objectFit: 'cover' }}
        />
        <div style={{ flex: 1, textAlign: 'left' }}>
          <h1 style={{ margin: '0 0 0.25rem 0', fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800 }}>
            {user.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            @{user.username} {user.isGoogle ? '• Conta Google' : ''}
          </p>

          {/* Quick Stats Grid */}
          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">{moviesReviews.length}</div>
              <div className="stat-label">Filmes</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{seriesReviews.length}</div>
              <div className="stat-label">Séries</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{averageRating}</div>
              <div className="stat-label">Média</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{favoriteReviews.length}</div>
              <div className="stat-label">Favoritos</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem', marginTop: '2rem' }}>
        
        {/* Left Column: Recent Reviews Activity */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'left' }}>
            Seu Diário de Avaliações
          </h2>
          
          {userReviews.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Você ainda não avaliou nenhum filme ou série. Use a barra de busca no topo ou explore os carrosséis na página inicial para começar seu registro!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {userReviews.map((review) => (
                <div key={review.id} className="glass-panel review-log-card" style={{ position: 'relative', border: '1px solid var(--border-light)' }}>
                  <img
                    src={review.poster}
                    alt={review.title}
                    style={{ width: '80px', height: '120px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.25rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {review.title}
                      </h3>
                      <button
                        onClick={() => handleEditReview(review)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', outline: 'none' }}
                        title="Editar avaliação"
                      >
                        <Edit size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.25rem 0' }}>
                      {review.rating > 0 ? (
                        <StarRating rating={review.rating} size={15} />
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Apenas Favoritado</span>
                      )}
                      <span className="badge-tag" style={{ fontSize: '0.7rem' }}>
                        {review.type === 'movie' ? 'Filme' : 'Série'}
                      </span>
                      {review.favorite && (
                        <Heart size={14} fill="#ef4444" stroke="#ef4444" />
                      )}
                    </div>

                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.4'
                    }}>
                      {review.comment || <em>Sem comentário escrito.</em>}
                    </p>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      Avaliado em: {review.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Custom CSS Stats Charts */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'left' }}>
            Distribuição de Notas
          </h2>

          <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-light)' }}>
            {ratedReviews.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0', fontSize: '0.85rem' }}>
                Avalie títulos para ver o gráfico de notas.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingDistribution[stars];
                  const percentage = (count / maxDistributionCount) * 100;
                  return (
                    <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                      <div style={{ width: '50px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)' }}>
                        {stars} ★
                      </div>
                      <div style={{ flex: 1, height: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--accent-neon-green) 0%, #00b0ff 100%)',
                          boxShadow: '0 0 8px rgba(0, 224, 84, 0.4)',
                          borderRadius: '10px',
                          transition: 'width 0.5s ease-out'
                        }}></div>
                      </div>
                      <div style={{ width: '30px', fontWeight: 'bold', color: '#fff', textAlign: 'left' }}>
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, margin: '2rem 0 1rem', textAlign: 'left' }}>
            Visão Geral
          </h2>
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-light)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(0, 224, 84, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--accent-neon-green)' }}>
                <Film size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Categoria Favorita</div>
                <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.95rem' }}>
                  {moviesReviews.length >= seriesReviews.length ? 'Filmes de Cinema' : 'Séries de TV'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255, 128, 0, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--accent-neon-orange)' }}>
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gasto de Tempo Estimado</div>
                <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.95rem' }}>
                  {moviesReviews.length * 2 + seriesReviews.length * 6} Horas de Tela
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
