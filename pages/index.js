import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  const servers = [
    { id: 1, name: 'TV Server 1' },
    { id: 2, name: 'TV Server 2' },
    { id: 3, name: 'TV Server 3' },
    { id: 4, name: 'TV Server 4' },
    { id: 5, name: 'TV Server 5' },
    { id: 6, name: 'TV Server 6' },
    { id: 7, name: 'TV Server 7' },
    { id: 8, name: 'TV Server 8' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📺 TV Streaming</h1>
        <p>Watch anywhere! No WiFi needed</p>
      </div>

      <div className={styles.grid}>
        {servers.map((server) => (
          <Link key={server.id} href={`/channels?serverId=${server.id}`}>
            <a className={styles.card}>
              <div className={styles.icon}>📡</div>
              <h2>{server.name}</h2>
              <p>Tap to watch →</p>
            </a>
          </Link>
        ))}
      </div>

      <div className={styles.footer}>
        <p>✨ 8 Live TV Servers</p>
      </div>
    </div>
  );
}
