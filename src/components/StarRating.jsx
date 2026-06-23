import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onChange, interactive = false, size = 24 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (value) => {
    if (interactive && onChange) {
      // Toggle off if clicking the same rating
      if (rating === value) {
        onChange(0);
      } else {
        onChange(value);
      }
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="star-rating" onMouseLeave={handleMouseLeave} style={{ display: 'inline-flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isFilled = starValue <= activeRating;
        return (
          <button
            key={starValue}
            type="button"
            className={`star-btn ${isFilled ? 'filled' : ''}`}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: interactive ? 'pointer' : 'default',
              padding: 0,
              color: isFilled ? '#ffb800' : '#4b5563', // gold vs gray-600
              transition: interactive ? 'transform 0.1s ease' : 'none',
              outline: 'none'
            }}
          >
            <Star
              size={size}
              fill={isFilled ? '#ffb800' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
