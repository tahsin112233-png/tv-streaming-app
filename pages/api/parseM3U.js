export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ 
      success: false, 
      error: 'URL required' 
    });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch M3U: ${response.statusText}`);
    }

    const text = await response.text();
    const channels = parseM3U(text);

    res.status(200).json({
      success: true,
      channels: channels,
      total: channels.length
    });

  } catch (error) {
    console.error('M3U parse error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

function parseM3U(content) {
  const channels = [];
  const lines = content.split('\n');

  let currentChannel = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      // Parse channel info
      const nameMatch = line.match(/,(.*)$/);
      const name = nameMatch ? nameMatch[1].trim() : 'Unknown';
      
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      const logo = logoMatch ? logoMatch[1] : null;

      currentChannel = {
        name: name,
        logo: logo,
        url: null
      };
    } else if (line && !line.startsWith('#') && currentChannel) {
      // This is the stream URL
      if (line.startsWith('http')) {
        currentChannel.url = line;
        channels.push(currentChannel);
        currentChannel = null;
      }
    }
  }

  return channels.filter(ch => ch.url && ch.url.length > 0);
}
