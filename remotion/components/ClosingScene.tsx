import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {StoryboardScene} from '@/lib/types';
import {Subtitle} from './Subtitle';

export const ClosingScene: React.FC<{scene: StoryboardScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 24], [0.94, 1], {extrapolateRight: 'clamp'});
  const opacity = interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: 80}}>
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <div style={{fontSize: 76, lineHeight: 1.12, fontWeight: 950}}>{scene.title}</div>
        <div style={{marginTop: 28, color: '#f4e2b7', fontSize: 42, fontWeight: 800}}>
          {scene.subtitle}
        </div>
        <div
          style={{
            margin: '72px auto 0',
            width: 560,
            padding: '28px 36px',
            borderRadius: 999,
            background: '#f1ca75',
            color: '#1c2732',
            fontSize: 38,
            fontWeight: 950,
          }}
        >
          {scene.screenText}
        </div>
      </div>
      <Subtitle text={scene.voiceover} />
    </AbsoluteFill>
  );
};
