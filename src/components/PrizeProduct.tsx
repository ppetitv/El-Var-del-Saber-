import React from 'react';

interface PrizeProductProps {
  variant?: 'hero' | 'banner' | 'result' | 'modal';
}

export default function PrizeProduct({ variant = 'hero' }: PrizeProductProps) {
  return (
    <div className={`prize-product prize-product-${variant}`} role="img" aria-label="PlayStation 5">
      <div className="prize-product-glow" />
      <div className="prize-product-console prize-product-console-left" />
      <div className="prize-product-console prize-product-console-core" />
      <div className="prize-product-console prize-product-console-right" />
      <div className="prize-product-controller">
        <span />
        <span />
      </div>
      <div className="prize-product-label">
        <strong>PS5</strong>
        <span>Premio semanal</span>
      </div>
    </div>
  );
}
