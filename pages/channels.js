import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Channels.module.css';

export default function Channels() {
  const router = useRouter();
  const { source, playlistId, playlistUrl, name } = router.query;
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (source === 'mrgify' || playlistId || playlistUrl) {
      fetchChannels();
    }
  }, [source, playlistId, playlistUrl]);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      setError('');

      let url = '';
      
      if (source === 'mrgify') {
        url = '/api/fetchMrgify';
      } else if (playlistId) {
        url = `/api/fetchPlaylist?playlistId=${playlistId}`;
      } else if (playlistUrl) {
        url = `/api/fetchPlaylist?playlistUrl=${encodeURIComponent(playlistUrl)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.channels.length > 0) {
        setChannels(data.channels);
        
        // Extract unique categories
        const cats = ['All', ...new Set(data.channels.map(ch => ch.category || ch.group).filter(Boolean))];
        setCategories(cats);
      } else {
        setError(data.error || 'No channels found');
      }
    } catch (err) {
      setError('Failed to load: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredChannels = channels.filter(ch => {
    const matchSearch = ch.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'All' || 
                         (ch.category === selectedCategory) || 
                         (ch.group === selectedCategory);
    return matchSearch && matchCategory;
  });

  if (!source && !playlistId && !playlistUrl) {
    return <p className={styles.loading}>Loading...</p>;
  }

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
          <p>🔄 Loading channels...</p>
          <p className={styles.subtext}>This may take 10-20 seconds</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.error}>
          ⚠️ {error}
          <button onClick={fetchChannels} className={styles.retryBtn}>
            🔄 Retry
          </button>
        </div>
      )}

      {!loading && channels.length > 0 && (
        <>
          {/* Search & Filter */}
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <p className={styles.count}>
              Found: {filteredChannels.length}/{channels.length} channels
            </p>
          </div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className={styles.categoryFilter}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Channels Grid */}
          <div className={styles.channelGrid}>
            {filteredChannels.map((channel, index) => (
              <Link 
                key={index} 
                href={`/player?channelName=${encodeURIComponent(channel.name)}&streamUrl=${encodeURIComponent(channel.url)}&logo=${encodeURIComponent(channel.logo || '')}&category=${encodeURIComponent(channel.category || '')}`}
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
                  {channel.category && <small className={styles.group}>{channel.category}</small>}
                  {channel.quality && <small className={styles.quality}>{channel.quality}</small>}
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
