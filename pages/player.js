import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Player.module.css';

export default function Player() {
  const router = useRouter();
  const { serverId, channelId, name } = router.query;
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);
  const [error, setError] = useState('');
  const videoRef = useRef(null);

  // HLS player setup
  useEffect(() => {
    if (isPlaying && streamUrl && videoRef.current) {
      try {
        // For HLS streams (.m3u8)
        if (streamUrl.includes('.m3u8')) {
          if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari supports HLS natively
            videoRef.current.src = streamUrl;
          } else {
            // Use HLS.js for other browsers
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
            script.async = true;
            script.onload = () => {
              if (window.Hls && window.Hls.isSupported()) {
                const hls = new window.Hls();
                hls.loadSource(streamUrl);
                hls.attachMedia(videoRef.current);
                hls.on(window.Hls.Events.ERROR, (event, data) => {
                  if (data.fatal) {
                    setError('Stream error: ' + data.response?.statusText || 'Unknown');
                  }
                });
              } else {
                // Fallback: just try to play
                videoRef.current.src = streamUrl;
              }
            };
            document.head.appendChild(script);
          }
        } else {
          // For direct MP4/other streams
          videoRef.current.src = streamUrl;
        }
      } catch (err) {
        setError('Player error: ' + err.message);
      }
    }
  }, [isPlaying, streamUrl]);

  const handlePlay = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/getStream?serverId=${serverId}&channelId=${channelId}`
      );
      const data = await response.json();

      console.log('Stream response:', data);

      if (data.streamUrl) {
        setStreamUrl(data.streamUrl);
        setIsPlaying(true);
      } else {
        setError('No stream URL available');
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
            {error && <p style={{ color: '#ffaaaa', marginTop: '15px', fontSize: '0.9em' }}>{error}</p>}
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%' }}>
            <video
              ref={videoRef}
              controls
              autoPlay
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#000'
              }}
              onError={(e) => {
                console.log('Video error:', e);
                setError('Video playback error');
              }}
            >
              Your browser doesn't support video playback.
            </video>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h2>📺 {name || 'Channel'}</h2>
        <p>Server: <strong>TV Server {serverId}</strong></p>
        <p>Channel: <strong>Channel {channelId}</strong></p>

        <div style={{ marginTop: '12px', marginBottom: '12px' }}>
          <small style={{ color: '#aaa' }}>Stream: {streamUrl ? streamUrl.substring(0, 40) + '...' : 'Not loaded'}</small>
        </div>

        {error && (
          <div className={styles.error}>
            ⚠️ {error}
          </div>
        )}

        {isPlaying && !error && (
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
              if (videoRef.current) {
                videoRef.current.src = '';
              }
            }}
          >
            ⏹️ Stop Stream
          </button>
        )}
      </div>
    </div>
  );
}
