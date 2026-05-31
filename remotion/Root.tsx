import React from 'react';
import {CalculateMetadataFunction, Composition} from 'remotion';
import {BookGuideStoryboard} from '@/lib/types';
import sampleStoryboard from '@/data/sample-script.json';
import {BookGuideVideo} from './BookGuideVideo';

type VideoProps = {
  storyboard: BookGuideStoryboard;
};

const fps = 30;

const calculateMetadata: CalculateMetadataFunction<VideoProps> = ({props}) => {
  const storyboard = props.storyboard || (sampleStoryboard as BookGuideStoryboard);
  const durationSec =
    storyboard.scenes?.reduce((sum, scene) => sum + Math.max(1, scene.durationSec), 0) ||
    storyboard.meta.durationSec ||
    210;

  return {
    durationInFrames: Math.ceil(durationSec * fps),
    fps,
    width: 1080,
    height: 1920,
    props: {storyboard},
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BookGuideVideo"
      component={BookGuideVideo}
      durationInFrames={Math.ceil((sampleStoryboard as BookGuideStoryboard).meta.durationSec * fps)}
      fps={fps}
      width={1080}
      height={1920}
      defaultProps={{
        storyboard: sampleStoryboard as BookGuideStoryboard,
      }}
      calculateMetadata={calculateMetadata}
    />
  );
};
