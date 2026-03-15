import React, { createContext, useState, useEffect, useContext } from 'react';
import { promotionApi } from '../apis/flowerApi';

const PromotionContext = createContext(null);

export const usePromotion = () => useContext(PromotionContext);

export const PromotionProvider = ({ children }) => {
  const [activePromotion, setActivePromotion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivePromotion = async () => {
      setLoading(true);
      try {
        const response = await promotionApi.getActive();
        setActivePromotion(response?.data || response);
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          console.error('Error fetching active promotion:', error);
        }
        setActivePromotion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchActivePromotion();
  }, []);

  const value = { activePromotion, loading };

  return (
    <PromotionContext.Provider value={value}>
      {children}
    </PromotionContext.Provider>
  );
};
