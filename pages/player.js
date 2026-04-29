import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Player.module.css';

export default function Player() {
  const router = useRouter();
  const { channelName, streamUrl, logo, category } = router.query;
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying && streamUrl && videoRef.current) {
      loadStream();
    }
  }, [isPlaying, streamUrl, retryCount]);

  const loadStream = async () => {
    try {
      setError('');

      // For HLS streams
      if (streamUrl.includes('.m3u8')) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
        script.async = true;
        script.onload = () => {
          if (window.Hls && window.Hls.isSupported()) {
            if (hlsRef.current) hlsRef.current.destroy();

            const hls = new window.Hls({
              maxMaxBufferLength: 30,
              maxBufferLength: 10,
              fragLoadingTimeOut: 20000
            });
            
            hlsRef.current = hls;
            hls.loadSource(streamUrl);
            hls.attachMedia(videoRef.current);

            hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
              videoRef.current.play().catch(e => {
                setError('Tap to play');
              });
            });

            hls.on(window.Hls.Events.ERROR, (event, data) => {
              if (data.fatal) {
                if (retryCount < 3) {
                  setRetryCount(retryCount + 1);
                  setTimeout(() => loadStream(), 2000);
                } else {
                  setError('Stream offline - try another channel');
                }
              }
            });
          } else {
            videoRef.current.src = streamUrl;
            videoRef.current.play();
          }
        };
        document.head.appendChild(script);
      } else {
        videoRef.current.src = streamUrl;
        videoRef.current.play();
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  const handlePlay = () => {
    setLoading(true);
    setRetryCount(0);
    setTimeout(() => {
      setIsPlaying(true);
      setLoading(false);
    }, 500);
  };

  if (!channelName || !streamUrl) {
    return <p className={styles.loading}>Loading...</p>;
  }

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
        {!isPlaying ? (
          <div className={styles.playerPlaceholder}>
            {logo && logo !== '' && (
              <img 
                src={logo} 
                alt="channel" 
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
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000'
            }}
            onClick={() => videoRef.current?.play()}
          >
            Your browser doesn't support video.
          </video>
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h2>📺 {decodeURIComponent(channelName)}</h2>
        {category && <p>Category: <strong>{decodeURIComponent(category)}</strong></p>}
        <p className={styles.streamInfo}>
          <small>
            Stream: {streamUrl.includes('github') ? '✅ GitHub' : '✅ Direct'}
          </small>
        </p>

        {error && (
          <div className={styles.error}>
            ⚠️ {error}
            {retryCount < 3 && (
              <button 
                className={styles.retryBtn}
                onClick={() => setRetryCount(retryCount + 1)}
              >
                🔄 Retry ({retryCount}/3)
              </button>
            )}
          </div>
        )}

        {isPlaying && !error && (
          <div className={styles.stats}>
            <p>✅ Stream Playing</p>
            <p>📡 Connected (Mrgify BDIX)</p>
          </div>
        )}

        {isPlaying && (
          <button 
            className={styles.stopBtn}
            onClick={() => {
              setIsPlaying(false);
              setRetryCount(0);
              if (videoRef.current) {
                videoRef.current.src = '';
              }
              if (hlsRef.current) {
                hlsRef.current.destroy();
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
