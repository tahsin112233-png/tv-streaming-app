export default async function handler(req, res) {
  try {
    // Fetch both the M3U and JSON data
    const [m3uResponse, jsonResponse] = await Promise.all([
      fetch('https://github.com/abusaeeidx/Mrgify-BDIX-IPTV/raw/main/playlist.m3u'),
      fetch('https://github.com/abusaeeidx/Mrgify-BDIX-IPTV/raw/main/Channels_data.json')
    ]);

    if (!m3uResponse.ok || !jsonResponse.ok) {
      throw new Error('Failed to fetch Mrgify data');
    }

    const m3uText = await m3uResponse.text();
    const channelsData = await jsonResponse.json();

    // Parse M3U
    const channels = parseM3U(m3uText);

    // Enhance with JSON data
    const enhancedChannels = channels.map(ch => {
      const jsonData = channelsData.find(j => 
        j.name && ch.name && 
        j.name.toLowerCase() === ch.name.toLowerCase()
      );

      return {
        ...ch,
        category: jsonData?.category || ch.group || 'Other',
        tvgId: jsonData?.tvgId || '',
        tvgName: jsonData?.tvgName || ch.name,
        description: jsonData?.description || '',
        quality: jsonData?.quality || 'HD'
      };
    });

    res.status(200).json({
      success: true,
      channels: enhancedChannels,
      total: enhancedChannels.length,
      source: 'Mrgify BDIX IPTV',
      lastUpdate: new Date().toISOString(),
      updateFrequency: 'Every 10 minutes'
    });

  } catch (error) {
    console.error('Mrgify fetch error:', error);
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
      const nameMatch = line.match(/,(.*)$/);
      const name = nameMatch ? nameMatch[1].trim() : 'Unknown';
      
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      const logo = logoMatch ? logoMatch[1] : null;

      const groupMatch = line.match(/group-title="([^"]*)"/);
      const group = groupMatch ? groupMatch[1] : null;

      currentChannel = {
        name: name,
        logo: logo,
        group: group,
        url: null
      };
    } else if (line && !line.startsWith('#') && currentChannel) {
      if (line.startsWith('http')) {
        currentChannel.url = line;
        channels.push(currentChannel);
        currentChannel = null;
      }
    }
  }

  return channels.filter(ch => ch.url && ch.url.length > 0);
}
