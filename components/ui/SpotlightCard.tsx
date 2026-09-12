"use client";

import React from 'react';
import './SpotlightCard.css';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

const SpotlightCard = ({ children, className = '' }: SpotlightCardProps) => {
  return (
    <div className={`card-spotlight ${className}`}>
      {children}
    </div>
  );
};

export default SpotlightCard;
