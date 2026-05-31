import {execFile} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {promisify} from 'node:util';

const execFileAsync = promisify(execFile);
const root = process.cwd();
const outDir = path.join(root, 'public', 'renders');
const workDir = path.join(root, '.tmp', 'motion-sample');
const ffmpeg = '/opt/homebrew/bin/ffmpeg';
const rsvg = '/opt/homebrew/bin/rsvg-convert';
const fps = 30;
const sceneDuration = 6.6;
const transition = 0.9;
const output = path.join(outDir, `motion-sample-${Date.now()}.mp4`);

const scenes = [
  {
    kicker: 'SERVICE SYSTEM',
    lines: ['真正高级的服务，', '来自清晰规则'],
    accent: 'CLARITY',
  },
  {
    kicker: 'OPERATING LOGIC',
    lines: ['很多问题，', '并不是人不努力，', '而是规则没对齐'],
    accent: 'ALIGNMENT',
  },
  {
    kicker: 'MANAGEMENT PRINCIPLE',
    lines: ['管理的本质，', '是提前定义边界'],
    accent: 'BOUNDARY',
  },
  {
    kicker: 'COLLABORATION',
    lines: ['规则清晰，', '协作才会发生'],
    accent: 'FLOW',
  },
];

const escapeXml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const textBlock = (lines, x, y, size, color, weight = 700, gap = 1.22) =>
  lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * Math.round(size * gap)}" font-size="${size}" fill="${color}" font-weight="${weight}" font-family="PingFang SC, Hiragino Sans GB, Arial, sans-serif" letter-spacing="0">${escapeXml(line)}</text>`,
    )
    .join('\n');

const sceneSvg = (scene, index) => {
  const shift = index % 2 === 0 ? 0 : 38;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#070b10"/>
      <stop offset="50%" stop-color="#151d26"/>
      <stop offset="100%" stop-color="#2a2f30"/>
    </linearGradient>
    <radialGradient id="light" cx="28%" cy="18%" r="72%">
      <stop offset="0%" stop-color="#f4d58a" stop-opacity="0.22"/>
      <stop offset="42%" stop-color="#6fa8d8" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#eac46d" stop-opacity="0"/>
      <stop offset="44%" stop-color="#eac46d" stop-opacity="0.78"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <filter id="blurLarge">
      <feGaussianBlur stdDeviation="26"/>
    </filter>
    <filter id="blurSoft">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
  </defs>

  <rect width="1080" height="1920" fill="url(#bg)"/>
  <rect width="1080" height="1920" fill="url(#light)"/>
  <circle cx="${840 - shift}" cy="${290 + shift}" r="180" fill="#ffffff" opacity="0.045" filter="url(#blurLarge)"/>
  <circle cx="${190 + shift}" cy="1510" r="240" fill="#eac46d" opacity="0.065" filter="url(#blurLarge)"/>
  <path d="M-120 ${560 + shift} C180 ${420 + shift} 520 ${460 - shift} 1200 ${260 + shift} L1200 ${640 + shift} C720 ${750 + shift} 260 ${710 - shift} -120 ${900 + shift} Z" fill="#ffffff" opacity="0.048" filter="url(#blurSoft)"/>
  <path d="M-80 ${1340 - shift} C220 ${1250 + shift} 590 ${1280 - shift} 1160 ${1120 + shift}" stroke="#ffffff" stroke-width="2" opacity="0.12" fill="none"/>
  <path d="M96 274 H436" stroke="url(#line)" stroke-width="2"/>

  <text x="96" y="244" font-size="24" fill="#eac46d" font-weight="800" opacity="0.86" font-family="Inter, PingFang SC, Arial" letter-spacing="4">${scene.kicker}</text>
  <text x="96" y="690" font-size="118" fill="#ffffff" opacity="0.035" font-weight="900" font-family="Inter, PingFang SC, Arial" letter-spacing="2">${scene.accent}</text>
  ${textBlock(scene.lines, 96, scene.lines.length === 3 ? 825 : 880, scene.lines.length === 3 ? 64 : 74, '#f7f4ec', 800, 1.22)}
  <text x="96" y="1290" font-size="28" fill="#ffffff" opacity="0.46" font-weight="600" font-family="PingFang SC, Hiragino Sans GB, Arial">Rules create calm. Calm creates quality.</text>
  <rect x="96" y="1510" width="150" height="3" rx="1.5" fill="#eac46d" opacity="0.72"/>
  <rect x="96" y="1542" width="${220 + index * 80}" height="2" rx="1" fill="#ffffff" opacity="0.20"/>
</svg>`;
};

await mkdir(outDir, {recursive: true});
await mkdir(workDir, {recursive: true});

const pngs = [];
for (const [index, scene] of scenes.entries()) {
  const svgPath = path.join(workDir, `scene-${index + 1}.svg`);
  const pngPath = path.join(workDir, `scene-${index + 1}.png`);
  await writeFile(svgPath, sceneSvg(scene, index), 'utf8');
  await execFileAsync(rsvg, ['-w', '1080', '-h', '1920', '-o', pngPath, svgPath]);
  pngs.push(pngPath);
}

const inputs = pngs.flatMap((png) => ['-loop', '1', '-t', String(sceneDuration), '-i', png]);

const sceneFilters = pngs.map((_, index) => {
  const frames = Math.round(sceneDuration * fps);
  const zoom = index % 2 === 0 ? 'min(zoom+0.00050,1.080)' : 'min(zoom+0.00042,1.068)';
  const x =
    index % 2 === 0
      ? 'iw/2-(iw/zoom/2)+sin(on/88)*14'
      : 'iw/2-(iw/zoom/2)-sin(on/92)*14';
  const y =
    index % 2 === 0
      ? 'ih/2-(ih/zoom/2)-cos(on/105)*18'
      : 'ih/2-(ih/zoom/2)+cos(on/112)*18';
  return `[${index}:v]scale=1224:2176,zoompan=z='${zoom}':x='${x}':y='${y}':d=${frames}:s=1080x1920:fps=${fps},fade=t=in:st=0:d=0.42,fade=t=out:st=${(sceneDuration - 0.48).toFixed(2)}:d=0.48,format=yuv420p[s${index}]`;
});

let label = '[s0]';
const transitions = [];
let offset = sceneDuration - transition;
for (let index = 1; index < scenes.length; index++) {
  const next = `[v${index}]`;
  transitions.push(`${label}[s${index}]xfade=transition=fade:duration=${transition}:offset=${offset.toFixed(2)}${next}`);
  label = next;
  offset += sceneDuration - transition;
}

await execFileAsync(
  ffmpeg,
  [
    '-y',
    ...inputs,
    '-filter_complex',
    [...sceneFilters, ...transitions].join(';'),
    '-map',
    label,
    '-t',
    String(sceneDuration * scenes.length - transition * (scenes.length - 1)),
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    output,
  ],
  {maxBuffer: 1024 * 1024 * 20},
);

console.log(output);
