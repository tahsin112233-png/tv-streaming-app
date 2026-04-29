import { SERVER_URLS, CHANNEL_PATHS, PUBLIC_STREAMS } from './config';

export default async function handler(req, res) {
  const { serverId, channelId } = req.query;

  try {
    if (!serverId || !channelId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing serverId or channelId'
      });
    }

    // Get public stream (guaranteed to work)
    const publicStream = PUBLIC_STREAMS[serverId];

    if (!publicStream) {
      return res.status(404).json({ 
        success: false, 
        error: 'Stream not found'
      });
    }

    res.status(200).json({
      success: true,
      streamUrl: publicStream,
      server: `TV Server ${serverId}`,
      channel: `Channel ${channelId}`,
      type: 'hls',
      format: publicStream.includes('.m3u8') ? 'HLS' : 'MP4'
    });

  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
}
