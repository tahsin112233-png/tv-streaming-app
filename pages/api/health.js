import { SERVER_URLS } from './config';
import axios from 'axios';

export default async function handler(req, res) {
  const serverStatus = {};

  for (const [id, url] of Object.entries(SERVER_URLS)) {
    try {
      await axios.head(url, { timeout: 3000 });
      serverStatus[id] = { online: true };
    } catch {
      serverStatus[id] = { online: false };
    }
  }

  res.status(200).json(serverStatus);
}
