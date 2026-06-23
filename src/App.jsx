import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Layout from './components/Layout';
import ReviewModal from './components/ReviewModal';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Watched from './pages/Watched';
import Watchlist from './pages/Watchlist';
import Settings from './pages/Settings';

const AppContent = () => {
  const { user } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Review Modal Global Handler
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleReviewMovie = (movie) => {
    setSelectedMovie(movie);
    setIsReviewOpen(true);
  };

  // If user is not authenticated, show the Login page
  if (!user) {
    return <Login />;
  }

  // Simple Router based on active state page ID
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onReviewMovie={handleReviewMovie} />;
      case 'profile':
        return <Profile onReviewMovie={handleReviewMovie} />;
      case 'favorites':
        return <Favorites onReviewMovie={handleReviewMovie} />;
      case 'watched':
        return <Watched onReviewMovie={handleReviewMovie} />;
      case 'watchlist':
        return <Watchlist onReviewMovie={handleReviewMovie} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onReviewMovie={handleReviewMovie} />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage}
      onReviewMovie={handleReviewMovie}
    >
      {renderPage()}
      
      {/* Global Review/Rate Modal */}
      <ReviewModal 
        movie={selectedMovie}
        isOpen={isReviewOpen}
        onClose={() => {
          setIsReviewOpen(false);
          setSelectedMovie(null);
        }}
      />
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
