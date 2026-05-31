import type {Config} from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#0B1110',
        governance: '#0E1A17',
        charcoal: '#151C1A',
        civic: {
          DEFAULT: '#4FBDA8',
          muted: '#6FAFA2',
          dark: '#1F6F63',
        },
        data: {
          white: '#F3F6F4',
          soft: '#B8C4BF',
          muted: '#7E8D88',
          divider: '#2A3431',
        },
        signal: {
          amber: '#B88945',
          amberSoft: '#D6B06B',
          red: '#A85D55',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
        mono: ['IBM Plex Mono', 'SFMono-Regular', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '8px',
        panel: '10px',
      },
      boxShadow: {
        panel: '0 18px 48px rgba(0, 0, 0, 0.24)',
        subtle: '0 8px 24px rgba(0, 0, 0, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
