import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Channels.module.css';

export default function Channels() {
  const router = useRouter();
  const { playlistUrl, name } = router.query;
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (playlistUrl) {
      fetchChannels(playlistUrl);
    }
  }, [playlistUrl]);

  const fetchChannels = async (url) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/parseM3U?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (data.success && data.channels.length > 0) {
        // Filter only sports-related channels
        const sportsChannels = data.channels.filter(ch => 
          ch.name.toLowerCase().includes('sport') ||
          ch.name.toLowerCase().includes('star') ||
          ch.name.toLowerCase().includes('cricket') ||
          ch.name.toLowerCase().includes('football') ||
          ch.name.toLowerCase().includes('tennis') ||
          ch.name.toLowerCase().includes('hockey') ||
          ch.name.toLowerCase().includes('nba') ||
          ch.name.toLowerCase().includes('nfl') ||
          ch.name.toLowerCase().includes('premier') ||
          ch.name.toLowerCase().includes('bundesliga') ||
          ch.name.toLowerCase().includes('la liga') ||
          ch.name.toLowerCase().includes('bein') ||
          ch.name.toLowerCase().includes('espn') ||
          ch.name.toLowerCase().includes('sony') ||
          ch.name.toLowerCase().includes('t sports') ||
          ch.name.toLowerCase().includes('gazi')
        );

        setChannels(sportsChannels.length > 0 ? sportsChannels : data.channels);
      } else {
        setError('No channels found in this M3U');
      }
    } catch (err) {
      setError('Failed to load M3U: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredChannels = channels.filter(ch =>
    ch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!playlistUrl) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/">
          <a className={styles.backBtn}>← Back</a>
        </Link>
        <h2>📺 {name || 'Sports Channels'}</h2>
      </div>

      {loading && <p className={styles.loading}>🔄 Loading channels...</p>}

      {error && <p className={styles.error}>⚠️ {error}</p>}

      {!loading && channels.length > 0 && (
        <>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <p className={styles.count}>Found: {filteredChannels.length} channels</p>
          </div>

          <div className={styles.channelGrid}>
            {filteredChannels.map((channel, index) => (
              <Link 
                key={index} 
                href={`/player?channelName=${encodeURIComponent(channel.name)}&streamUrl=${encodeURIComponent(channel.url)}`}
              >
                <a className={styles.channelCard}>
                  <div className={styles.logo}>
                    {channel.logo ? (
                      <img src={channel.logo} alt={channel.name} onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                      <div className={styles.placeholder}>📺</div>
                    )}
                  </div>
                  <p className={styles.name}>{channel.name}</p>
                  <span className={styles.live}>🔴 LIVE</span>
                </a>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
