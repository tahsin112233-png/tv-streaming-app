import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/Player.module.css';

export default function Player() {
  const router = useRouter();
  const { serverId, channelId, name } = router.query;
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);
  const [error, setError] = useState('');
  const [quality, setQuality] = useState('auto');

  const handlePlay = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch stream URL from API
      const response = await fetch(
        `/api/getStream?serverId=${serverId}&channelId=${channelId}`
      );
      const data = await response.json();

      if (data.success && data.streamUrl) {
        setStreamUrl(data.streamUrl);
        setIsPlaying(true);
      } else {
        setError('Stream not available. Try another channel.');
        // Still try to play even if error
        if (data.streamUrl) {
          setStreamUrl(data.streamUrl);
          setIsPlaying(true);
        }
      }
    } catch (err) {
      setError('Failed to load stream: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!serverId) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href={`/channels?serverId=${serverId}`}>
          <a className={styles.backBtn}>← Back</a>
        </Link>
      </div>

      {/* Player */}
      <div className={styles.playerWrapper}>
        {!isPlaying ? (
          <div className={styles.playerPlaceholder}>
            <button 
              className={styles.playBtn}
              onClick={handlePlay}
              disabled={loading}
            >
              {loading ? '⏳ Loading...' : '▶️ Play Stream'}
            </button>
            {error && <p style={{ color: '#ffaaaa', marginTop: '15px' }}>{error}</p>}
          </div>
        ) : streamUrl ? (
          <video
            key={streamUrl}
            controls
            autoPlay
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000'
            }}
            onError={() => setError('Video player error')}
          >
            <source src={streamUrl} type="application/x-mpegURL" />
            <p>Your browser doesn't support HTML5 video.</p>
          </video>
        ) : (
          <div className={styles.playerPlaceholder}>
            <p style={{ color: 'white' }}>Loading stream...</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h2>📺 {name || 'Channel'}</h2>
        <p>Server: <strong>TV Server {serverId}</strong></p>
        <p>Channel: <strong>Channel {channelId}</strong></p>

        {/* Quality Selector */}
        <div style={{ marginTop: '12px' }}>
          <label style={{ marginRight: '8px' }}>Quality:</label>
          <select 
            value={quality} 
            onChange={(e) => setQuality(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <option value="auto">Auto</option>
            <option value="720p">720p</option>
            <option value="480p">480p</option>
            <option value="360p">360p</option>
          </select>
        </div>

        {error && (
          <div className={styles.error}>
            ⚠️ {error}
          </div>
        )}

        {isPlaying && (
          <div className={styles.stats}>
            <p>✅ Stream Active</p>
            <p>📡 Connected</p>
            <p>🎬 Playing...</p>
          </div>
        )}

        {isPlaying && (
          <button 
            className={styles.stopBtn}
            onClick={() => {
              setIsPlaying(false);
              setStreamUrl(null);
            }}
          >
            ⏹️ Stop Stream
          </button>
        )}
      </div>
    </div>
  );
}
