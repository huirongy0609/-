type HeyGenVideoRequest = {
  script: string;
  title: string;
};

type HeyGenVideoResponse = {
  provider: 'mock' | 'heygen';
  videoId?: string;
  videoUrl?: string;
};

export async function createAvatarVideo({
  script,
  title,
}: HeyGenVideoRequest): Promise<HeyGenVideoResponse> {
  const apiKey = process.env.HEYGEN_API_KEY;
  const avatarId = process.env.HEYGEN_AVATAR_ID;

  if (!apiKey || !avatarId) {
    return {
      provider: 'mock',
    };
  }

  const response = await fetch('https://api.heygen.com/v2/video/generate', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      title,
      video_inputs: [
        {
          character: {
            type: 'avatar',
            avatar_id: avatarId,
          },
          voice: {
            type: 'text',
            input_text: script,
          },
        },
      ],
      dimension: {
        width: 1080,
        height: 1920,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`HeyGen 创建数字人视频失败：${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as {data?: {video_id?: string; video_url?: string}};

  return {
    provider: 'heygen',
    videoId: data.data?.video_id,
    videoUrl: data.data?.video_url,
  };
}
