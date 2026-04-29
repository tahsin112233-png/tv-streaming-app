import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [customUrl, setCustomUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-loaded playlists (you add these manually)
  const playlists = [
    {
      id: 1,
      name: '🇧🇩 Mrgify BDIX IPTV',
      url: 'https://github.com/abusaeeidx/Mrgify-BDIX-IPTV/raw/main/playlist.m3u',
      description: 'Best BDIX + Sports Channels'
    },
    {
      id: 2,
      name: '⚽ Global Sports M3U',
      url: 'https://raw.githubusercontent.com/iptv-org/iptv/master/categories/sports.m3u',
      description: 'International Sports'
    },
    {
      id: 3,
      name: '🇮🇳 India Channels',
      url: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/in.m3u',
      description: 'Star Sports, Sony, Cricket'
    },
    {
      id: 4,
      name: '🎬 Entertainment',
      url: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/us.m3u',
      description: 'Movies & Series'
    }
  ];

  const handlePlaylist = (url) => {
    window.location.href = `/channels?m3uUrl=${encodeURIComponent(url)}&name=${encodeURIComponent(playlists.find(p => p.url === url)?.name || 'Playlist')}`;
  };

  const handleCustom = () => {
    if (!customUrl.trim()) {
      alert('Please paste a valid M3U URL');
      return;
    }

    try {
      new URL(customUrl);
      window.location.href = `/channels?m3uUrl=${encodeURIComponent(customUrl)}&name=Custom%20Playlist`;
    } catch (err) {
      alert('Invalid URL! Make sure it starts with http:// or https://');
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>⚽📺</div>
        <h1>Sports TV Hub</h1>
        <p>Watch Live Sports Worldwide</p>
      </div>

      {/* Featured Playlist */}
      <div className={styles.featured}>
        <button 
          className={styles.featuredCard}
          onClick={() => handlePlaylist(playlists[0].url)}
        >
          <div className={styles.badge}>⭐ BEST</div>
          <h2>{playlists[0].name}</h2>
          <p>{playlists[0].description}</p>
          <span className={styles.click}>Tap to Browse →</span>
        </button>
      </div>

      {/* Other Playlists */}
      <h3 className={styles.sectionTitle}>Other Playlists</h3>
      <div className={styles.grid}>
        {playlists.slice(1).map((playlist) => (
          <button
            key={playlist.id}
            className={styles.card}
            onClick={() => handlePlaylist(playlist.url)}
          >
            <div className={styles.icon}>{playlist.name.split(' ')[0]}</div>
            <h3>{playlist.name}</h3>
            <p>{playlist.description}</p>
          </button>
        ))}
      </div>

      {/* Custom M3U Input */}
      <div className={styles.customSection}>
        <h2>🔗 Add Custom M3U URL</h2>
        <p className={styles.customDesc}>
          Paste any M3U playlist URL (like from Mrgify, IPTV, or any other source)
        </p>
        <div className={styles.inputGroup}>
          <input
            type="url"
            placeholder="https://example.com/playlist.m3u"
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
            {loading ? '⏳ Loading...' : 'Load'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p>💡 Just paste M3U URL and start watching!</p>
      </div>
    </div>
  );
}
