import type {Metadata} from 'next';
import {GoldenStewardWorld} from '@/components/GoldenStewardWorld';

export const metadata: Metadata = {
  title: '金牌管家成长世界',
  description: '从信托制正式冒险者出发，沿五星成长路径成为真正能解决问题的金牌管家。',
};

export default function GoldenStewardWorldPage() {
  return <GoldenStewardWorld />;
}
