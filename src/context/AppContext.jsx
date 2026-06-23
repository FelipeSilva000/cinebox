import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication states
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cinebox_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('cinebox_registered_users');
    if (savedUsers) return JSON.parse(savedUsers);
    
    // Default mock users for a couple
    return [
      { username: 'felipe', password: '123', name: 'Felipe', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', isGoogle: false },
      { username: 'dupla', password: '123', name: 'Amor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', isGoogle: false }
    ];
  });

  // App Data states
  const [reviews, setReviews] = useState(() => {
    const savedReviews = localStorage.getItem('cinebox_reviews');
    return savedReviews ? JSON.parse(savedReviews) : [];
  });

  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem('cinebox_watchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  const [tmdbKey, setTmdbKey] = useState(() => {
    return localStorage.getItem('cinebox_tmdb_key') || import.meta.env.VITE_TMDB_API_KEY || '';
  });

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('cinebox_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cinebox_current_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cinebox_registered_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cinebox_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('cinebox_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('cinebox_tmdb_key', tmdbKey);
  }, [tmdbKey]);

  // Auth Operations
  const login = (username, password) => {
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, message: 'Usuário ou senha incorretos.' };
  };

  const loginWithGoogleMock = (googleUser) => {
    // googleUser: { email, name, picture }
    const username = googleUser.email.split('@')[0];
    const newGoogleUser = {
      username: username,
      name: googleUser.name,
      avatar: googleUser.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isGoogle: true,
      email: googleUser.email
    };

    // Add to registered users list if not exists
    setUsers(prev => {
      const exists = prev.some(u => u.username === username);
      if (!exists) {
        return [...prev, newGoogleUser];
      }
      return prev;
    });

    setUser(newGoogleUser);
  };

  const register = (username, password, name, avatar) => {
    const cleanUsername = username.trim().toLowerCase();
    const exists = users.some((u) => u.username === cleanUsername);
    if (exists) {
      return { success: false, message: 'Nome de usuário já cadastrado.' };
    }

    const defaultAvatar = avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${cleanUsername}`;
    const newUser = {
      username: cleanUsername,
      password: password,
      name: name.trim(),
      avatar: defaultAvatar,
      isGoogle: false
    };

    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  // Review Operations
  const addReview = (reviewData) => {
    // reviewData: { movieId, title, poster, rating, comment, type }
    if (!user) return;

    const reviewId = `${user.username}_${reviewData.movieId}`;
    
    setReviews((prev) => {
      const existingIndex = prev.findIndex((r) => r.id === reviewId);
      const newReview = {
        id: reviewId,
        username: user.username,
        userDisplayName: user.name,
        userAvatar: user.avatar,
        movieId: reviewData.movieId,
        title: reviewData.title,
        poster: reviewData.poster,
        rating: parseFloat(reviewData.rating),
        comment: reviewData.comment || '',
        type: reviewData.type || 'movie',
        date: new Date().toLocaleDateString('pt-BR'),
        favorite: reviewData.favorite || false,
        timestamp: Date.now()
      };

      if (existingIndex > -1) {
        // Update review but preserve favorite status if not explicitly passed
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...newReview,
          favorite: reviewData.favorite !== undefined ? reviewData.favorite : updated[existingIndex].favorite
        };
        return updated;
      } else {
        return [newReview, ...prev];
      }
    });

    // Automatically remove from watchlist if rated
    removeFromWatchlist(reviewData.movieId);
  };

  const deleteReview = (movieId) => {
    if (!user) return;
    const reviewId = `${user.username}_${movieId}`;
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const toggleFavorite = (movieId, movieTitle, moviePoster, movieType) => {
    if (!user) return;
    const reviewId = `${user.username}_${movieId}`;
    
    setReviews((prev) => {
      const exists = prev.find((r) => r.id === reviewId);
      if (exists) {
        return prev.map((r) => 
          r.id === reviewId ? { ...r, favorite: !r.favorite } : r
        );
      } else {
        // If movie hasn't been reviewed yet, create a quick review with 0 rating to hold favorite status
        const quickReview = {
          id: reviewId,
          username: user.username,
          userDisplayName: user.name,
          userAvatar: user.avatar,
          movieId: movieId,
          title: movieTitle,
          poster: moviePoster,
          rating: 0,
          comment: 'Favoritado (Ainda não avaliado)',
          type: movieType || 'movie',
          date: new Date().toLocaleDateString('pt-BR'),
          favorite: true,
          timestamp: Date.now()
        };
        return [quickReview, ...prev];
      }
    });
  };

  // Watchlist Operations
  const addToWatchlist = (movie) => {
    // movie: { movieId, title, poster, type }
    if (!user) return;
    
    setWatchlist((prev) => {
      const exists = prev.some((w) => w.movieId === movie.movieId && w.addedBy === user.username);
      if (exists) return prev;
      
      const newItem = {
        movieId: movie.movieId,
        title: movie.title,
        poster: movie.poster,
        type: movie.type || 'movie',
        addedBy: user.username,
        addedByName: user.name,
        timestamp: Date.now()
      };
      return [newItem, ...prev];
    });
  };

  const removeFromWatchlist = (movieId) => {
    if (!user) return;
    setWatchlist((prev) => prev.filter((w) => !(w.movieId === movieId && w.addedBy === user.username)));
  };

  // API Config
  const updateTmdbKey = (key) => {
    setTmdbKey(key.trim());
  };

  // Backup and Restore
  const exportData = () => {
    const data = {
      reviews,
      watchlist,
      users,
      tmdbKey
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.reviews) setReviews(parsed.reviews);
      if (parsed.watchlist) setWatchlist(parsed.watchlist);
      if (parsed.users) setUsers(parsed.users);
      if (parsed.tmdbKey !== undefined) setTmdbKey(parsed.tmdbKey);
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Arquivo JSON inválido ou corrompido.' };
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        users,
        reviews,
        watchlist,
        tmdbKey,
        login,
        loginWithGoogleMock,
        register,
        logout,
        addReview,
        deleteReview,
        toggleFavorite,
        addToWatchlist,
        removeFromWatchlist,
        updateTmdbKey,
        exportData,
        importData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
