type ElevenLabsResponse = {
  audioUrl: string;
  provider: 'mock' | 'elevenlabs';
};

export async function generateVoiceoverAudio(text: string): Promise<ElevenLabsResponse> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    return {
      audioUrl: '/audio.mp3',
      provider: 'mock',
    };
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'content-type': 'application/json',
      accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs 生成失败：${response.status} ${response.statusText}`);
  }

  return {
    audioUrl: '/audio.mp3',
    provider: 'elevenlabs',
  };
}
