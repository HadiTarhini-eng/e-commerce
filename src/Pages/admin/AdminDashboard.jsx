import React, { useEffect, useState } from 'react';
import GenericCard from '../../components/admin/dashboard/GenericCard';
import { getIconComponent } from '../../utils/getIconComponent';
import { fetchCardData } from '../../api/adminApi';

const AdminDashboard = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const cardResponse = await fetchCardData();
        setCards(cardResponse);
      } catch (error) {
        console.error('Error fetching card data:', error);
      }
    };

    fetchCard();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {cards.map((card, index) => (
        <GenericCard key={index} title={card.title} total={card.total} rate={card.rate} levelUp={card.levelUp} levelDown={card.levelDown}>
          {getIconComponent(card.icon)}
        </GenericCard>
      ))}
    </div>
  );
};

export default AdminDashboard;