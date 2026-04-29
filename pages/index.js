import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [customUrl, setCustomUrl] = useState('');
  const [showInput, setShowInput] = useState(false);

  const playlists = [
    {
      id: 1,
      name: '🌍 Global Sports M3U',
      url: 'https://raw.githubusercontent.com/iptv-org/iptv/master/categories/sports.m3u',
      description: 'International sports channels'
    },
    {
      id: 2,
      name: '🏏 India Sports',
      url: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/in.m3u',
      description: 'Star Sports, Cricket HD'
    },
    {
      id: 3,
      name: '🇧🇩 Bangladesh Sports',
      url: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/bd.m3u',
      description: 'Local BD channels'
    },
    {
      id: 4,
      name: '⚽ European Sports',
      url: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/de.m3u',
      description: 'European football leagues'
    },
    {
      id: 5,
      name: '🏈 USA Sports',
      url: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/us.m3u',
      description: 'NBA, NFL, MLB'
    },
    {
      id: 6,
      name: '🎾 Mixed Sports',
      url: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/pk.m3u',
      description: 'Mixed sport channels'
    }
  ];

  const handleCustom = (url) => {
    if (customUrl.trim()) {
      window.location.href = `/channels?playlistUrl=${encodeURIComponent(customUrl)}`;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>⚽ Sports TV Hub</h1>
        <p>Watch Live Sports Worldwide</p>
      </div>

      <div className={styles.grid}>
        {playlists.map((playlist) => (
          <Link key={playlist.id} href={`/channels?playlistUrl=${encodeURIComponent(playlist.url)}&name=${playlist.name}`}>
            <a className={styles.card}>
              <div className={styles.icon}>{playlist.name.split(' ')[0]}</div>
              <h3>{playlist.name}</h3>
              <p>{playlist.description}</p>
              <span className={styles.tag}>M3U</span>
            </a>
          </Link>
        ))}
      </div>

      <div className={styles.customSection}>
        <h2>📋 Add Custom M3U URL</h2>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Paste M3U URL here..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className={styles.input}
          />
          <button 
            onClick={() => handleCustom(customUrl)}
            className={styles.submitBtn}
          >
            ➕ Add
          </button>
        </div>
        <small style={{ color: '#999', marginTop: '8px', display: 'block' }}>
          Paste any M3U playlist URL (sports channels)
        </small>
      </div>

      <div className={styles.footer}>
        <p>💡 Click any playlist to browse channels</p>
      </div>
    </div>
  );
}
