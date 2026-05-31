import {BookGuideStoryboard, StoryboardPoint, StoryboardScene} from './types';

const DEFAULT_CLOSING = '关注我，带你读懂更多管理好书。';

const normalizeText = (text: string) =>
  text
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const splitSentences = (text: string) =>
  normalizeText(text)
    .split(/(?<=[。！？!?；;])\s*/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

const stripMarkdown = (text: string) =>
  text
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/[*_`>-]/g, '')
    .replace(/\[[^\]]+\]\([^)]+\)/g, '')
    .trim();

const pickTitle = (article: string) => {
  const heading = article.match(/^#{1,3}\s*(.+)$/m)?.[1];
  if (heading) return heading.slice(0, 28);

  const firstLine = normalizeText(article)
    .split('\n')
    .find((line) => line.trim().length > 4);

  return (firstLine || '一本好书的核心启发').replace(/[。！？].*$/, '').slice(0, 28);
};

const inferBookTitle = (title: string, article: string) => {
  const bookMatch =
    article.match(/[《「『]([^》」』]{2,24})[》」』]/)?.[1] ||
    title.match(/[《「『]([^》」』]{2,24})[》」』]/)?.[1];

  return bookMatch || title.replace(/^导读[:：]?\s*/, '').slice(0, 18);
};

const summarizeForScreen = (text: string, fallback: string) => {
  const clean = stripMarkdown(text).replace(/[，。！？；：、,.!?;:]/g, ' ');
  const words = clean.split(/\s+/).filter(Boolean);
  const joined = words.join('');
  return (joined || fallback).slice(0, 18);
};

const buildVoiceover = (title: string, sentences: string[]) => {
  const body = sentences.join('');
  if (body.length >= 80) return body.slice(0, 230);
  return `${title}。${body}`.slice(0, 230);
};

const distributeSentences = (sentences: string[], groups: number) => {
  const buckets = Array.from({length: groups}, () => [] as string[]);
  sentences.forEach((sentence, index) => {
    buckets[index % groups].push(sentence);
  });
  return buckets;
};

export function generateBookGuideStoryboard(articleInput: string): BookGuideStoryboard {
  const article = normalizeText(articleInput);

  if (article.length < 20) {
    throw new Error('文章内容太短，请至少输入一段完整导读。');
  }

  const title = pickTitle(article);
  const bookTitle = inferBookTitle(title, article);
  const sentences = splitSentences(stripMarkdown(article));
  const pointCount = Math.min(5, Math.max(3, Math.ceil(sentences.length / 5)));
  const buckets = distributeSentences(sentences.slice(1), pointCount);

  const hook =
    sentences[0]?.slice(0, 90) ||
    `如果你只用几分钟读懂《${bookTitle}》，最该带走的是这几个判断。`;

  const points: StoryboardPoint[] = buckets.map((bucket, index) => {
    const lead = bucket[0] || sentences[index + 1] || hook;
    const pointTitle = `观点 ${index + 1}：${summarizeForScreen(lead, `核心启发 ${index + 1}`)}`;
    const voiceover = buildVoiceover(pointTitle, bucket.length ? bucket : [lead]);

    return {
      id: `point-${index + 1}`,
      order: index + 1,
      title: pointTitle,
      voiceover,
      screenText: summarizeForScreen(lead, pointTitle),
      quote: lead.replace(/[。！？!?]$/, '').slice(0, 42),
      durationSec: Math.max(32, Math.min(58, Math.ceil(voiceover.length / 4.2))),
    };
  });

  const scenes: StoryboardScene[] = [
    {
      id: 'title',
      type: 'title',
      title,
      subtitle: `《${bookTitle}》导读`,
      voiceover: hook,
      screenText: '一本书，一个关键判断',
      quote: hook.slice(0, 42),
      durationSec: Math.max(18, Math.min(32, Math.ceil(hook.length / 4))),
    },
    ...points.map<StoryboardScene>((point) => ({
      id: point.id,
      type: 'point',
      title: point.title,
      subtitle: `核心观点 ${point.order}`,
      voiceover: point.voiceover,
      screenText: point.screenText,
      quote: point.quote,
      durationSec: point.durationSec,
    })),
    {
      id: 'closing',
      type: 'closing',
      title: '读书不是记住内容',
      subtitle: '而是带走一个可执行的判断',
      voiceover: DEFAULT_CLOSING,
      screenText: DEFAULT_CLOSING,
      durationSec: 18,
    },
  ];

  const durationSec = scenes.reduce((sum, scene) => sum + scene.durationSec, 0);

  return {
    title,
    bookTitle,
    hook,
    coverImage: '/cover.jpg',
    audio: {
      mode: 'mock',
      src: '/audio.mp3',
      voiceId: process.env.ELEVENLABS_VOICE_ID,
    },
    avatar: {
      mode: 'none',
      avatarId: process.env.HEYGEN_AVATAR_ID,
    },
    points,
    closing: DEFAULT_CLOSING,
    scenes,
    meta: {
      fps: 30,
      width: 1080,
      height: 1920,
      durationSec,
      style: 'premium-business-vertical',
      createdAt: new Date().toISOString(),
    },
  };
}
