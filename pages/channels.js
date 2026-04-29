import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Channels.module.css';

export default function Channels() {
  const router = useRouter();
  const { m3uUrl, name } = router.query;
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (m3uUrl) {
      loadM3U();
    }
  }, [m3uUrl]);

  const loadM3U = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch M3U file
      const response = await fetch(m3uUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const text = await response.text();
      const parsed = parseM3U(text);

      if (parsed.length === 0) {
        throw new Error('No channels found in M3U file');
      }

      setChannels(parsed);
    } catch (err) {
      setError(err.message);
      console.error('M3U Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseM3U = (content) => {
    const channels = [];
    const lines = content.split('\n');
    let currentInfo = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('#EXTINF:')) {
        const nameMatch = line.match(/,(.*)$/);
        const channelName = nameMatch ? nameMatch[1].trim() : 'Unknown';
        const logoMatch = line.match(/tvg-logo="([^"]*)"/);
        const logo = logoMatch ? logoMatch[1] : null;
        const groupMatch = line.match(/group-title="([^"]*)"/);
        const group = groupMatch ? groupMatch[1] : null;

        currentInfo = { name: channelName, logo, group };
      } else if (line && !line.startsWith('#') && currentInfo) {
        if (line.startsWith('http')) {
          channels.push({
            ...currentInfo,
            url: line
          });
          currentInfo = null;
        }
      }
    }

    return channels;
  };

  const filteredChannels = channels.filter(ch =>
    ch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!m3uUrl) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/">
          <a className={styles.backBtn}>← Back</a>
        </Link>
        <h2>📺 {name || 'Channels'}</h2>
      </div>

      {loading && (
        <div className={styles.loadingBox}>
          <p>🔄 Loading M3U...</p>
          <p className={styles.subtext}>Please wait, parsing channels...</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.error}>
          ⚠️ Error: {error}
          <button onClick={loadM3U} className={styles.retryBtn}>
            🔄 Retry
          </button>
        </div>
      )}

      {!loading && channels.length > 0 && (
        <>
          {/* Search */}
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="🔍 Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <p className={styles.count}>
              Found: {filteredChannels.length}/{channels.length} channels
            </p>
          </div>

          {/* Channels Grid */}
          <div className={styles.channelGrid}>
            {filteredChannels.map((channel, idx) => (
              <Link 
                key={idx}
                href={`/player?name=${encodeURIComponent(channel.name)}&url=${encodeURIComponent(channel.url)}&logo=${encodeURIComponent(channel.logo || '')}`}
              >
                <a className={styles.channelCard}>
                  <div className={styles.logo}>
                    {channel.logo ? (
                      <img 
                        src={channel.logo} 
                        alt={channel.name}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    ) : (
                      <div className={styles.placeholder}>📺</div>
                    )}
                  </div>
                  <p className={styles.name}>{channel.name}</p>
                  <span className={styles.live}>● LIVE</span>
                </a>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
