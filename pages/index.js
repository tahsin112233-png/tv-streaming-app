import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [customUrl, setCustomUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [mrgifyStats, setMrgifyStats] = useState(null);

  useEffect(() => {
    // Fetch Mrgify stats
    fetchMrgifyStats();
  }, []);

  const fetchMrgifyStats = async () => {
    try {
      const res = await fetch('/api/fetchMrgify');
      const data = await res.json();
      if (data.success) {
        setMrgifyStats(data);
      }
    } catch (err) {
      console.log('Could not fetch Mrgify stats');
    }
  };

  const playlists = [
    {
      id: 'mrgify',
      name: '🇧🇩 Mrgify BDIX IPTV',
      description: 'Best BDIX channels (Auto-updates every 10 min)',
      icon: '⚡',
      channels: mrgifyStats?.total || '...'
    },
    {
      id: 'sports',
      name: '⚽ Global Sports',
      description: 'International sports channels',
      icon: '🏟️',
      channels: '500+'
    },
    {
      id: 'india',
      name: '🇮🇳 India Channels',
      description: 'Star Sports, Cricket HD, Sony',
      icon: '🎬',
      channels: '300+'
    },
    {
      id: 'bd',
      name: '🇧🇩 Bangladesh',
      description: 'Local BD channels',
      icon: '📺',
      channels: '100+'
    }
  ];

  const handleCustom = async () => {
    if (!customUrl.trim()) return;
    
    setLoading(true);
    try {
      new URL(customUrl);
      window.location.href = `/channels?playlistUrl=${encodeURIComponent(customUrl)}&name=Custom%20Playlist`;
    } catch (err) {
      alert('Invalid URL!');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>⚽📺</div>
        <h1>Sports TV Hub</h1>
        <p>Watch live sports + BDIX channels worldwide</p>
      </div>

      {/* Featured: Mrgify */}
      <Link href="/channels?source=mrgify&name=Mrgify%20BDIX%20IPTV">
        <a className={styles.featuredCard}>
          <div className={styles.badge}>⚡ RECOMMENDED</div>
          <h2>🇧🇩 Mrgify BDIX IPTV</h2>
          <p>Best BDIX channels + Sports</p>
          <span className={styles.update}>
            {mrgifyStats ? `${mrgifyStats.total} Channels` : 'Loading...'} • Auto-updates every 10 min
          </span>
          <span className={styles.status}>✅ Online & Stable</span>
        </a>
      </Link>

      {/* Other Playlists */}
      <h3 className={styles.sectionTitle}>Other Playlists</h3>
      <div className={styles.grid}>
        {playlists.slice(1).map((playlist) => (
          <Link key={playlist.id} href={`/channels?playlistId=${playlist.id}&name=${encodeURIComponent(playlist.name)}`}>
            <a className={styles.card}>
              <div className={styles.icon}>{playlist.icon}</div>
              <h3>{playlist.name}</h3>
              <p>{playlist.description}</p>
              <small className={styles.channelCount}>{playlist.channels} channels</small>
            </a>
          </Link>
        ))}
      </div>

      {/* Custom URL */}
      <div className={styles.customSection}>
        <h2>➕ Add Custom M3U Playlist</h2>
        <div className={styles.inputGroup}>
          <input
            type="url"
            placeholder="Paste M3U URL here..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className={styles.input}
            disabled={loading}
          />
          <button 
            onClick={handleCustom}
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? '⏳' : '➕'} Add
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p>💡 Powered by Mrgify BDIX IPTV Project</p>
        <small>Works on 4G/5G - No WiFi needed!</small>
      </div>
    </div>
  );
}
