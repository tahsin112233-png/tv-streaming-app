import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import styles from '../styles/Player.module.css';

export default function Player() {
  const router = useRouter();
  const { name, url, logo } = router.query;
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [retries, setRetries] = useState(0);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        try {
          hlsRef.current.destroy();
        } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    if (playing && url && videoRef.current) {
      loadStream();
    }
  }, [playing, url, retries]);

  const loadStream = async () => {
    try {
      setError('');

      if (url.includes('.m3u8')) {
        // HLS Stream
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
        script.async = true;
        script.onload = () => {
          if (window.Hls?.isSupported()) {
            if (hlsRef.current) {
              try {
                hlsRef.current.destroy();
              } catch (e) {}
            }

            const hls = new window.Hls({
              maxMaxBufferLength: 30,
              maxBufferLength: 10
            });

            hlsRef.current = hls;
            hls.loadSource(url);
            hls.attachMedia(videoRef.current);

            hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
              videoRef.current.play().catch(() => {
                setError('Tap to play');
              });
            });

            hls.on(window.Hls.Events.ERROR, (event, data) => {
              if (data.fatal) {
                if (retries < 2) {
                  setTimeout(() => setRetries(r => r + 1), 2000);
                } else {
                  setError('Stream unavailable');
                }
              }
            });
          } else {
            videoRef.current.src = url;
            videoRef.current.play().catch(() => {});
          }
        };
        document.head.appendChild(script);
      } else {
        // Direct stream
        videoRef.current.src = url;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePlay = () => {
    setLoading(true);
    setRetries(0);
    setTimeout(() => {
      setPlaying(true);
      setLoading(false);
    }, 500);
  };

  if (!name || !url) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/channels">
          <a className={styles.backBtn}>← Back</a>
        </Link>
      </div>

      {/* Player */}
      <div className={styles.playerWrapper}>
        {!playing ? (
          <div className={styles.playerPlaceholder}>
            {logo && logo !== '' && (
              <img 
                src={logo} 
                alt="logo"
                className={styles.channelLogo}
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <button 
              className={styles.playBtn}
              onClick={handlePlay}
              disabled={loading}
            >
              {loading ? '⏳ Loading...' : '▶️ Play'}
            </button>
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
          />
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h2>📺 {decodeURIComponent(name)}</h2>

        {error && (
          <div className={styles.error}>
            ⚠️ {error}
            {retries < 2 && (
              <button className={styles.retryBtn} onClick={() => setRetries(r => r + 1)}>
                🔄 Retry ({retries}/2)
              </button>
            )}
          </div>
        )}

        {playing && !error && (
          <div className={styles.stats}>
            <p>✅ Stream Playing</p>
            <p>📡 Connected</p>
          </div>
        )}

        {playing && (
          <button 
            className={styles.stopBtn}
            onClick={() => {
              setPlaying(false);
              if (videoRef.current) videoRef.current.src = '';
              if (hlsRef.current) {
                try {
                  hlsRef.current.destroy();
                } catch (e) {}
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
