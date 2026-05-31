import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {StoryboardScene} from '@/lib/types';
import {QuoteCard} from './QuoteCard';
import {Subtitle} from './Subtitle';

export const PointScene: React.FC<{scene: StoryboardScene; index: number; total: number}> = ({
  scene,
  index,
  total,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = Math.round(((index + 1) / total) * 100);
  const opacity = interpolate(frame, [0, 14, durationInFrames - 12, durationInFrames], [0, 1, 1, 0]);
  const x = interpolate(frame, [0, 22], [80, 0], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{padding: '500px 72px 0', opacity}}>
      <div
        style={{
          color: '#f1ca75',
          fontSize: 32,
          fontWeight: 900,
          marginBottom: 28,
          transform: `translateX(${x}px)`,
        }}
      >
        {scene.subtitle}
      </div>
      <div
        style={{
          color: '#fff',
          fontSize: 70,
          lineHeight: 1.12,
          fontWeight: 950,
          maxWidth: 760,
          transform: `translateX(${x}px)`,
        }}
      >
        {scene.title}
      </div>
      <div
        style={{
          marginTop: 42,
          width: 760,
          height: 10,
          borderRadius: 999,
          background: 'rgba(255,255,255,.18)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#f1ca75',
          }}
        />
      </div>
      <div
        style={{
          marginTop: 64,
          width: 780,
          padding: '44px 46px',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,.18)',
          background: 'rgba(255,255,255,.12)',
          color: '#fff',
          fontSize: 62,
          lineHeight: 1.16,
          fontWeight: 950,
          boxShadow: '0 30px 90px rgba(0,0,0,.2)',
        }}
      >
        {scene.screenText}
      </div>
      {scene.quote ? <QuoteCard quote={scene.quote} /> : null}
      <Subtitle text={scene.voiceover} />
    </AbsoluteFill>
  );
};
