import { SERVER_URLS, CHANNEL_PATHS, TEST_STREAMS } from './config';
import axios from 'axios';

export default async function handler(req, res) {
  const { serverId, channelId } = req.query;

  try {
    // Validate
    if (!serverId || !channelId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing serverId or channelId',
        streamUrl: TEST_STREAMS[serverId] // Fallback to test stream
      });
    }

    // Get URLs
    const serverUrl = SERVER_URLS[serverId];
    const channelPath = CHANNEL_PATHS[channelId];
    const testStream = TEST_STREAMS[serverId];

    if (!serverUrl || !channelPath) {
      return res.status(404).json({ 
        success: false, 
        error: 'Server or channel not found',
        streamUrl: testStream // Use test stream as fallback
      });
    }

    // Try to build stream URL
    const streamUrl = `${serverUrl}${channelPath}`;

    // Try to verify stream is accessible
    try {
      const response = await axios.head(streamUrl, { 
        timeout: 3000,
        validateStatus: () => true
      });

      if (response.status === 200 || response.status === 206) {
        return res.status(200).json({
          success: true,
          streamUrl: streamUrl,
          server: `TV Server ${serverId}`,
          channel: `Channel ${channelId}`,
          type: 'hls'
        });
      }
    } catch (error) {
      console.log('Stream verification failed, using test stream');
    }

    // If main stream fails, use test stream
    return res.status(200).json({
      success: true,
      streamUrl: testStream,
      server: `TV Server ${serverId}`,
      channel: `Channel ${channelId}`,
      type: 'hls',
      note: 'Using backup stream'
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      streamUrl: TEST_STREAMS[serverId]
    });
  }
}
