import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {StoryboardScene} from '@/lib/types';
import {QuoteCard} from './QuoteCard';
import {Subtitle} from './Subtitle';

export const TitleScene: React.FC<{scene: StoryboardScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp'});
  const y = interpolate(frame, [0, 24], [70, 0], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{padding: '620px 72px 0'}}>
      <div style={{opacity, transform: `translateY(${y}px)`}}>
        <div style={{fontSize: 34, color: '#f4e2b7', fontWeight: 800, marginBottom: 28}}>
          {scene.subtitle}
        </div>
        <div
          style={{
            color: '#fff',
            fontSize: 82,
            lineHeight: 1.08,
            fontWeight: 950,
            letterSpacing: 0,
            maxWidth: 820,
            textShadow: '0 16px 44px rgba(0,0,0,.28)',
          }}
        >
          {scene.title}
        </div>
        <div
          style={{
            marginTop: 34,
            width: 168,
            height: 8,
            borderRadius: 8,
            background: '#f1ca75',
          }}
        />
      </div>
      {scene.quote ? <QuoteCard quote={scene.quote} /> : null}
      <Subtitle text={scene.voiceover} />
    </AbsoluteFill>
  );
};
