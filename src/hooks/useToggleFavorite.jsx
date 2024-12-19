// useToggleFavorite.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../components/client/AuthContext';
import { toggleFavoriteStatus } from '../api/clientApi';

const useToggleFavorite = (initialFavoriteStatus, productId, title, outOfStock) => {
  const [isFavorited, setIsFavorited] = useState(initialFavoriteStatus);
  const navigate = useNavigate();
  const { isLoggedIn, userId } = useAuth(); // Now we have access to userId

  const toggleFavorite = async () => {
    if (outOfStock) {
      toast.error(`${title} is out of stock!`);
    } else if (!isLoggedIn) {
      navigate('/signin');
    } else {
      try {
        const newFavoriteStatus = !isFavorited;

        // Call the API with the userId, productId, and favoriteStatus
        await toggleFavoriteStatus(userId, productId, newFavoriteStatus);

        // Update the local state after successful API call
        setIsFavorited(newFavoriteStatus);

        // Show toast based on the action
        newFavoriteStatus
          ? toast.success(`${title} added to favorites!`)
          : toast.error(`${title} removed from favorites!`);
      } catch (error) {
        toast.error('Failed to update favorite status. Please try again.');
      }
    }
  };

  return { isFavorited, toggleFavorite };
};

export default useToggleFavorite;
