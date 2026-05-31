import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BookGuideStoryboard, StoryboardScene} from '@/lib/types';
import {ClosingScene} from './components/ClosingScene';
import {PointScene} from './components/PointScene';
import {TitleScene} from './components/TitleScene';

type Props = {
  storyboard: BookGuideStoryboard;
};

const resolvePublicPath = (src: string) => staticFile(src.replace(/^\//, ''));

const Background: React.FC<{coverImage?: string}> = ({coverImage}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 300], [0, -26], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: '#10151d', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(145deg, #111820 0%, #26313a 34%, #e2d2ac 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.23,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          transform: `translateY(${drift}px)`,
        }}
      />
      {coverImage ? (
        <div
          style={{
            position: 'absolute',
            right: 72,
            top: 138,
            width: 238,
            height: 332,
            padding: 10,
            borderRadius: 18,
            background: 'rgba(246, 248, 246, .9)',
            boxShadow: '0 30px 80px rgba(0,0,0,.38)',
            opacity: 0.72,
            overflow: 'hidden',
          }}
        >
          <Img
            src={resolvePublicPath(coverImage)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 12,
            }}
          />
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 24% 14%, rgba(255,255,255,.18), transparent 28%), linear-gradient(180deg, rgba(7,10,15,.14), rgba(7,10,15,.7))',
        }}
      />
    </AbsoluteFill>
  );
};

const SceneSwitch: React.FC<{scene: StoryboardScene; index: number; total: number}> = ({
  scene,
  index,
  total,
}) => {
  if (scene.type === 'title') return <TitleScene scene={scene} />;
  if (scene.type === 'closing') return <ClosingScene scene={scene} />;
  return <PointScene scene={scene} index={index} total={total} />;
};

export const BookGuideVideo: React.FC<Props> = ({storyboard}) => {
  const {fps} = useVideoConfig();
  let from = 0;

  return (
    <AbsoluteFill>
      <Background coverImage={storyboard.coverImage} />
      {storyboard.audio?.src ? <Audio src={resolvePublicPath(storyboard.audio.src)} volume={0.68} /> : null}
      {storyboard.scenes.map((scene, index) => {
        const durationInFrames = Math.ceil(scene.durationSec * fps);
        const start = from;
        from += durationInFrames;

        return (
          <Sequence key={scene.id} from={start} durationInFrames={durationInFrames}>
            <SceneSwitch scene={scene} index={index} total={storyboard.scenes.length} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
