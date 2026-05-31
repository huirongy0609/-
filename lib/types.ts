export type StoryboardSceneType = 'title' | 'point' | 'closing';

export type StoryboardPoint = {
  id: string;
  order: number;
  title: string;
  voiceover: string;
  screenText: string;
  quote: string;
  durationSec: number;
};

export type StoryboardScene = {
  id: string;
  type: StoryboardSceneType;
  title: string;
  subtitle?: string;
  voiceover: string;
  screenText: string;
  quote?: string;
  durationSec: number;
};

export type BookGuideStoryboard = {
  title: string;
  bookTitle: string;
  hook: string;
  coverImage: string;
  audio: {
    mode: 'mock' | 'elevenlabs';
    src: string;
    voiceId?: string;
  };
  avatar: {
    mode: 'none' | 'heygen';
    avatarId?: string;
    videoUrl?: string;
  };
  points: StoryboardPoint[];
  closing: string;
  scenes: StoryboardScene[];
  meta: {
    fps: number;
    width: number;
    height: number;
    durationSec: number;
    style: string;
    createdAt: string;
  };
};
