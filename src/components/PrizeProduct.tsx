import React from 'react';
import ps5Image from '../assets/prizes/ps5-prize.png';

interface PrizeProductProps {
  variant?: 'hero' | 'banner' | 'result' | 'modal';
  hideLabel?: boolean;
}

export default function PrizeProduct({ variant = 'hero', hideLabel = false }: PrizeProductProps) {
  return (
    <div className={`prize-product prize-product-${variant}`} role="img" aria-label="PlayStation 5">
      <div className="prize-product-glow" />
      <img 
        src={ps5Image} 
        alt="PlayStation 5" 
        className="prize-product-image"
      />
      {!hideLabel && (
        <div className="prize-product-label">
          <strong>PS5</strong>
          <span>Premio semanal</span>
        </div>
      )}
    </div>
  );
}
