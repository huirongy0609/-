export const colorSystem = {
  background: {
    deepSpace: '#070C0B',
    primary: '#0B1110',
    secondary: '#0E1A17',
    elevated: '#151C1A',
    overlay: 'rgba(11, 17, 16, 0.78)',
  },
  surface: {
    glass: 'rgba(21, 28, 26, 0.50)',
    glassStrong: 'rgba(21, 28, 26, 0.68)',
    subtle: '#111715',
    tealTint: 'rgba(79, 189, 168, 0.08)',
    amberTint: 'rgba(184, 137, 69, 0.10)',
  },
  brand: {
    civicTeal: '#4FBDA8',
    mutedTeal: '#6FAFA2',
    darkTeal: '#1F6F63',
    neuralGlow: 'rgba(79, 189, 168, 0.42)',
  },
  text: {
    primary: '#F3F6F4',
    secondary: '#B8C4BF',
    tertiary: '#7E8D88',
    inverse: '#0B1110',
  },
  signal: {
    success: '#4FBDA8',
    info: '#6FAFA2',
    riskLow: '#D6B06B',
    riskMedium: '#B88945',
    riskHigh: '#A85D55',
  },
  border: {
    subtle: 'rgba(184, 196, 191, 0.10)',
    active: 'rgba(79, 189, 168, 0.34)',
    warning: 'rgba(184, 137, 69, 0.34)',
  },
  map: {
    provinceLine: 'rgba(184, 196, 191, 0.18)',
    cityLine: 'rgba(184, 196, 191, 0.12)',
    nodeActive: '#4FBDA8',
    nodePending: 'rgba(126, 141, 136, 0.46)',
    dataFlow: 'rgba(79, 189, 168, 0.42)',
    riskHeat: 'rgba(184, 137, 69, 0.16)',
  },
} as const;

export const lightFieldSystem = {
  ambientTeal: 'rgba(79, 189, 168, 0.12)',
  ambientAmber: 'rgba(184, 137, 69, 0.09)',
  glassHighlight: 'rgba(255, 255, 255, 0.055)',
  neuralPulse: 'rgba(79, 189, 168, 0.28)',
  scanLine: 'rgba(79, 189, 168, 0.08)',
} as const;

export const motionSystem = {
  duration: {
    hover: 0.18,
    panelEnter: 0.62,
    scan: 7.5,
    nodePulse: 7.2,
    dataFlow: 9.5,
    ambientBreath: 12,
  },
  easing: {
    standard: [0.2, 0, 0.2, 1],
    cinematicOut: [0.16, 1, 0.3, 1],
    slowInOut: [0.65, 0, 0.35, 1],
  },
} as const;

export type ColorSystem = typeof colorSystem;

