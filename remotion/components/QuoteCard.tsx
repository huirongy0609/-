import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export const QuoteCard: React.FC<{quote: string}> = ({quote}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [8, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(frame, [8, 22], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        right: 72,
        top: 1090,
        opacity,
        transform: `translateY(${y}px)`,
        padding: '30px 36px',
        borderRadius: 18,
        background: 'rgba(244, 231, 196, .94)',
        color: '#1d2732',
        boxShadow: '0 24px 80px rgba(0,0,0,.28)',
      }}
    >
      <div style={{fontSize: 28, fontWeight: 800, marginBottom: 12, color: '#8b6d2c'}}>金句卡片</div>
      <div style={{fontSize: 40, lineHeight: 1.28, fontWeight: 900}}>{quote}</div>
    </div>
  );
};
