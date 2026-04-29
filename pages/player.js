import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/Player.module.css';

export default function Player() {
  const router = useRouter();
  const { serverId, channelId, name } = router.query;
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamData, setStreamData] = useState(null);
  const [error, setError] = useState('');

  const handlePlay = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch actual stream URL from backend
      const response = await fetch(
        `/api/getStream?serverId=${serverId}&channelId=${channelId}`
      );
      const data = await response.json();

      if (data.success) {
        setStreamData(data.streamUrl);
        setIsPlaying(true);
      } else {
        setError('Stream not available right now');
      }
    } catch (err) {
      setError('Failed to load stream');
    } finally {
      setLoading(false);
    }
  };

  if (!serverId) return <p>Loading...</p>;

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
          </div>
        ) : (
          <div className={styles.videoContainer}>
            <iframe
              src={streamData}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '8px'
              }}
              allowFullScreen
              title="Stream"
            ></iframe>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h2>📺 {name}</h2>
        <p>Server: <strong>TV Server {serverId}</strong></p>
        <p>Channel: <strong>Channel {channelId}</strong></p>

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
            onClick={() => setIsPlaying(false)}
          >
            ⏹️ Stop Stream
          </button>
        )}
      </div>
    </div>
  );
}
