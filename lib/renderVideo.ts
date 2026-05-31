import path from 'node:path';
import {execFile} from 'node:child_process';
import {access, mkdir, readFile, writeFile} from 'node:fs/promises';
import {promisify} from 'node:util';
import {BookGuideStoryboard} from './types';

const execFileAsync = promisify(execFile);
const CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FONT_FILE = '/System/Library/Fonts/PingFang.ttc';
const FFMPEG_CANDIDATES = [
  process.env.FFMPEG_PATH,
  '/opt/homebrew/bin/ffmpeg',
  '/usr/local/bin/ffmpeg',
].filter(Boolean) as string[];
const RSVG_CANDIDATES = [
  process.env.RSVG_CONVERT_PATH,
  '/opt/homebrew/bin/rsvg-convert',
  '/usr/local/bin/rsvg-convert',
].filter(Boolean) as string[];

export async function renderBookGuideVideo(storyboard: BookGuideStoryboard) {
  const entryPoint = path.join('remotion', 'index.ts');
  const outputDir = path.join(process.cwd(), 'public', 'renders');
  const tempDir = path.join(process.cwd(), '.tmp');
  await mkdir(outputDir, {recursive: true});
  await mkdir(tempDir, {recursive: true});

  const outputName = `book-guide-${Date.now()}.mp4`;
  const outputLocation = path.join(outputDir, outputName);
  const propsPath = path.join(tempDir, `${outputName}.json`);
  await writeFile(propsPath, JSON.stringify({storyboard}, null, 2), 'utf8');

  if (process.env.RENDER_ENGINE === 'remotion') {
    const remotionBin = path.join(process.cwd(), 'node_modules', '.bin', 'remotion');
    await execFileAsync(
      remotionBin,
      [
        'render',
        entryPoint,
        'BookGuideVideo',
        outputLocation,
        '--props',
        propsPath,
        '--overwrite',
        '--hardware-acceleration=disable',
        ...(await fileExists(CHROME_EXECUTABLE)
          ? ['--browser-executable', CHROME_EXECUTABLE]
          : []),
      ],
      {
        cwd: process.cwd(),
        maxBuffer: 1024 * 1024 * 20,
      },
    );
  } else {
    await renderFallbackWithFfmpeg(storyboard, outputLocation, tempDir);
  }

  return {
    fileName: outputName,
    publicUrl: `/renders/${outputName}`,
    outputLocation,
  };
}

async function fileExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function wrapChineseText(text: string, lineLength: number, maxLines: number) {
  const clean = text.replace(/\s+/g, ' ').trim();
  const lines: string[] = [];

  for (let index = 0; index < clean.length && lines.length < maxLines; index += lineLength) {
    lines.push(clean.slice(index, index + lineLength));
  }

  return lines.join('\n');
}

async function writeTextFile(tempDir: string, name: string, text: string) {
  const filePath = path.join(tempDir, name);
  await writeFile(filePath, text, 'utf8');
  return filePath;
}

function quoteFilterPath(filePath: string) {
  return `'${filePath.replace(/'/g, "'\\\\''")}'`;
}

function between(start: number, end: number) {
  return `between(t\\,${start.toFixed(3)}\\,${end.toFixed(3)})`;
}

function escapeXml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function svgTextLines(text: string, x: number, y: number, fontSize: number, color: string) {
  return text
    .split('\n')
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * Math.round(fontSize * 1.25)}" font-size="${fontSize}" fill="${color}" font-weight="800" font-family="PingFang SC, Hiragino Sans GB, Arial">${escapeXml(line)}</text>`,
    )
    .join('\n');
}

async function imageToDataUri(filePath: string) {
  const bytes = await readFile(filePath);
  const mime = filePath.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${bytes.toString('base64')}`;
}

async function writeSceneSvg(
  storyboard: BookGuideStoryboard,
  sceneIndex: number,
  tempDir: string,
) {
  const scene = storyboard.scenes[sceneIndex];
  const total = storyboard.scenes.length;
  const progress = Math.round(((sceneIndex + 1) / total) * 100);
  const progressWidth = Math.round(760 * ((sceneIndex + 1) / total));
  const coverPath = path.join(process.cwd(), 'public', storyboard.coverImage.replace(/^\//, ''));
  const coverUri = (await fileExists(coverPath)) ? await imageToDataUri(coverPath) : '';
  const filePath = path.join(tempDir, `scene-${sceneIndex}.svg`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#111820"/>
      <stop offset="52%" stop-color="#26313a"/>
      <stop offset="100%" stop-color="#7d7256"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#bg)"/>
  <rect width="1080" height="1920" fill="#e8c46e" opacity="0.10"/>
  <rect x="70" y="76" width="940" height="1.5" fill="#ffffff" opacity="0.22"/>
  <text x="70" y="132" font-size="30" fill="#f4dfad" font-weight="800" font-family="PingFang SC, Hiragino Sans GB, Arial">BOOK GUIDE</text>
  <text x="720" y="132" font-size="28" fill="#ffffff" opacity="0.72" font-weight="700" font-family="PingFang SC, Hiragino Sans GB, Arial">SCENE ${sceneIndex + 1}/${total}</text>
  ${coverUri ? `<rect x="760" y="118" width="248" height="352" rx="20" fill="#f4f3ed" opacity="0.86"/><image href="${coverUri}" x="774" y="134" width="220" height="320" preserveAspectRatio="xMidYMid meet" opacity="0.88"/>` : ''}
  ${svgTextLines(scene.subtitle || storyboard.bookTitle, 78, 256, 34, '#eac46d')}
  ${svgTextLines(wrapChineseText(scene.title, 13, 3), 78, 370, 68, '#ffffff')}
  <rect x="78" y="550" width="760" height="10" rx="5" fill="#ffffff" opacity="0.18"/>
  <rect x="78" y="550" width="${progressWidth}" height="10" rx="5" fill="#eac46d"/>
  <text x="858" y="562" font-size="24" fill="#ffffff" opacity="0.72" font-weight="700" font-family="PingFang SC, Hiragino Sans GB, Arial">${progress}%</text>
  <rect x="70" y="610" width="820" height="220" rx="20" fill="#ffffff" opacity="0.13"/>
  ${svgTextLines(wrapChineseText(scene.screenText, 12, 2), 110, 716, 56, '#ffffff')}
  <rect x="70" y="1050" width="940" height="310" rx="18" fill="#f2dfae" opacity="0.94"/>
  <text x="104" y="1128" font-size="28" fill="#8b6d2c" font-weight="800" font-family="PingFang SC, Hiragino Sans GB, Arial">金句卡片</text>
  ${svgTextLines(wrapChineseText(scene.quote || scene.voiceover, 17, 3), 104, 1210, 40, '#17202a')}
  <rect x="70" y="1578" width="940" height="228" rx="18" fill="#05080c" opacity="0.68"/>
  ${svgTextLines(wrapChineseText(scene.voiceover, 24, 3), 104, 1670, 34, '#ffffff')}
  <text x="70" y="1852" font-size="28" fill="#ffffff" opacity="0.52" font-weight="700" font-family="PingFang SC, Hiragino Sans GB, Arial">关注我，带你读懂更多管理好书</text>
</svg>`;

  await writeFile(filePath, svg, 'utf8');
  return filePath;
}

async function findFfmpeg() {
  for (const candidate of FFMPEG_CANDIDATES) {
    if (await fileExists(candidate)) return candidate;
  }

  throw new Error(
    [
      '导出 MP4 需要本机 FFmpeg。',
      '当前 Chrome/Remotion 浏览器在这台 Mac 上会崩溃，所以系统会改用 FFmpeg 兜底导出。',
      '请先安装 FFmpeg：复制下面命令到终端执行：brew install ffmpeg',
      '如果 Homebrew 提示没有权限，请先执行它给出的 sudo chown 修复命令，再重新执行 brew install ffmpeg。',
    ].join('\n'),
  );
}

async function findRsvgConvert() {
  for (const candidate of RSVG_CANDIDATES) {
    if (await fileExists(candidate)) return candidate;
  }

  throw new Error(
    [
      '还需要安装 SVG 转图片工具 librsvg。',
      '请复制下面命令到终端执行：brew install librsvg',
      '如果 Homebrew 提示没有权限，请先执行它给出的 sudo chown 修复命令，再重新执行 brew install librsvg。',
    ].join('\n'),
  );
}

async function renderFallbackWithFfmpeg(
  storyboard: BookGuideStoryboard,
  outputLocation: string,
  tempDir: string,
) {
  const ffmpegBin = await findFfmpeg();
  const rsvgBin = await findRsvgConvert();
  const duration = storyboard.scenes.reduce((sum, scene) => sum + scene.durationSec, 0);
  const audioPath = path.join(process.cwd(), 'public', storyboard.audio.src.replace(/^\//, ''));
  const hasAudio = await fileExists(audioPath);
  const concatFile = path.join(tempDir, `concat-${Date.now()}.txt`);
  const concatLines: string[] = [];

  for (const [index, scene] of storyboard.scenes.entries()) {
    const svgPath = await writeSceneSvg(storyboard, index, tempDir);
    const pngPath = path.join(tempDir, `scene-${index}.png`);
    await execFileAsync(rsvgBin, ['-w', '1080', '-h', '1920', '-o', pngPath, svgPath], {
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 20,
    });
    concatLines.push(`file '${pngPath.replace(/'/g, "'\\''")}'`);
    concatLines.push(`duration ${scene.durationSec}`);
  }
  const lastSvgPath = await writeSceneSvg(storyboard, storyboard.scenes.length - 1, tempDir);
  const lastPngPath = path.join(tempDir, `scene-${storyboard.scenes.length - 1}-last.png`);
  await execFileAsync(rsvgBin, ['-w', '1080', '-h', '1920', '-o', lastPngPath, lastSvgPath], {
    cwd: process.cwd(),
    maxBuffer: 1024 * 1024 * 20,
  });
  concatLines.push(`file '${lastPngPath.replace(/'/g, "'\\''")}'`);
  await writeFile(concatFile, concatLines.join('\n'), 'utf8');

  const args = [
    '-y',
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    concatFile,
    ...(hasAudio ? ['-stream_loop', '-1', '-i', audioPath] : []),
  ];

  args.push(
    '-t',
    String(duration),
    '-c:v',
    'libx264',
    ...(hasAudio ? ['-c:a', 'aac', '-b:a', '128k'] : []),
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    outputLocation,
  );

  await execFileAsync(ffmpegBin, args, {
    cwd: process.cwd(),
    maxBuffer: 1024 * 1024 * 20,
    timeout: 1000 * 60 * 5,
  });
}
