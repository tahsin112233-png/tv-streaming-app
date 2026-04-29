import { SERVER_URLS, CHANNEL_PATHS } from './config';

export default function handler(req, res) {
  const { serverId, channelId } = req.query;

  try {
    // Validate inputs
    if (!serverId || !channelId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing serverId or channelId' 
      });
    }

    // Get server URL
    const serverUrl = SERVER_URLS[serverId];
    if (!serverUrl) {
      return res.status(404).json({ 
        success: false, 
        error: 'Server not found' 
      });
    }

    // Get channel path
    const channelPath = CHANNEL_PATHS[channelId];
    if (!channelPath) {
      return res.status(404).json({ 
        success: false, 
        error: 'Channel not found' 
      });
    }

    // Construct stream URL
    const streamUrl = `${serverUrl}${channelPath}`;

    res.status(200).json({
      success: true,
      streamUrl: streamUrl,
      server: `TV Server ${serverId}`,
      channel: `Channel ${channelId}`
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
