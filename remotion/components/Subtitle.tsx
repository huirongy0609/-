import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export const Subtitle: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        right: 72,
        bottom: 120,
        opacity,
        padding: '24px 32px',
        borderRadius: 18,
        background: 'rgba(13, 18, 25, .72)',
        color: '#fff',
        fontSize: 38,
        lineHeight: 1.35,
        fontWeight: 700,
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,.22)',
      }}
    >
      {text}
    </div>
  );
};
