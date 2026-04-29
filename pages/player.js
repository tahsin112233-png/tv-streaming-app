import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Player.module.css';

export default function Player() {
  const router = useRouter();
  const { channelName, streamUrl } = router.query;
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    if (isPlaying && streamUrl && videoRef.current) {
      try {
        // Load HLS.js for M3U8 support
        if (streamUrl.includes('.m3u8')) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
          script.async = true;
          script.onload = () => {
            if (window.Hls && window.Hls.isSupported()) {
              const hls = new window.Hls();
              hls.loadSource(streamUrl);
              hls.attachMedia(videoRef.current);
              hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
                videoRef.current.play().catch(err => {
                  setError('Autoplay blocked: ' + err.message);
                });
              });
              hls.on(window.Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                  setError('Stream error');
                }
              });
            } else {
              videoRef.current.src = streamUrl;
            }
          };
          document.head.appendChild(script);
        } else {
          videoRef.current.src = streamUrl;
        }
      } catch (err) {
        setError('Player error: ' + err.message);
      }
    }
  }, [isPlaying, streamUrl]);

  const handlePlay = () => {
    if (streamUrl) {
      setLoading(true);
      setError('');
      setTimeout(() => {
        setIsPlaying(true);
        setLoading(false);
      }, 500);
    }
  };

  if (!channelName || !streamUrl) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/channels">
          <a className={styles.backBtn}>← Back</a>
        </Link>
      </div>

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
              setError('Playback error - stream may be offline');
            }}
          >
            Your browser doesn't support video playback.
          </video>
        )}
      </div>

      <div className={styles.info}>
        <h2>📺 {decodeURIComponent(channelName)}</h2>
        <p>Stream: <small style={{ wordBreak: 'break-all' }}>{streamUrl.substring(0, 60)}...</small></p>

        {error && (
          <div className={styles.error}>
            ⚠️ {error}
          </div>
        )}

        {isPlaying && !error && (
          <div className={styles.stats}>
            <p>✅ Stream Active</p>
            <p>📡 Connected</p>
            <p>⚽ Playing Live...</p>
          </div>
        )}

        {isPlaying && (
          <button 
            className={styles.stopBtn}
            onClick={() => {
              setIsPlaying(false);
              if (videoRef.current) {
                videoRef.current.src = '';
              }
            }}
          >
            ⏹️ Stop
          </button>
        )}
      </div>
    </div>
  );
}
