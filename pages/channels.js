import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Channels.module.css';

export default function Channels() {
  const router = useRouter();
  const { serverId } = router.query;
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock channels data
  const mockChannels = [
    { id: 1, name: 'Sports Live', emoji: '⚽' },
    { id: 2, name: 'Cricket HD', emoji: '🏏' },
    { id: 3, name: 'Football', emoji: '🏈' },
    { id: 4, name: 'Basketball', emoji: '🏀' },
    { id: 5, name: 'Tennis', emoji: '🎾' },
    { id: 6, name: 'Hockey', emoji: '🏒' },
    { id: 7, name: 'Golf', emoji: '⛳' },
    { id: 8, name: 'Volleyball', emoji: '🏐' },
    { id: 9, name: 'Boxing', emoji: '🥊' },
    { id: 10, name: 'Racing', emoji: '🏎️' },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setChannels(mockChannels);
      setLoading(false);
    }, 500);
  }, [serverId]);

  if (!serverId || loading) return <p className={styles.loading}>Loading channels...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/">
          <a className={styles.backBtn}>← Back</a>
        </Link>
        <h2>TV Server {serverId}</h2>
      </div>

      <div className={styles.channelGrid}>
        {channels.map((channel) => (
          <Link 
            key={channel.id} 
            href={`/player?serverId=${serverId}&channelId=${channel.id}&name=${channel.name}`}
          >
            <a className={styles.channelCard}>
              <div className={styles.emoji}>{channel.emoji}</div>
              <p>{channel.name}</p>
              <span className={styles.live}>🔴 LIVE</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
