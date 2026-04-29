// Real server URLs (hidden from users)
export const SERVER_URLS = {
  1: 'http://172.31.100.110:8080',
  2: 'http://100.64.32.2:8080',
  3: 'http://172.19.178.180:8080',
  4: 'http://10.99.99.2:8080',
  5: 'http://tv.basnetbd.com',
  6: 'http://172.16.215.142:8080',
  7: 'http://tv.elaach.com',
  8: 'https://toffeelive.com'
};

// Channel streaming paths
export const CHANNEL_PATHS = {
  1: '/live/ch1.m3u8',
  2: '/live/sports.m3u8',
  3: '/stream/channel3.m3u8',
  4: '/live/hd4.m3u8',
  5: '/channels/ch5.m3u8',
  6: '/live/channel6.m3u8',
  7: '/stream/ch7.m3u8',
  8: '/live/ch8.m3u8',
  9: '/channels/sports.m3u8',
  10: '/live/main.m3u8'
};

// M3U8 playlist streams (backup if servers down)
export const PLAYLIST_URLS = {
  1: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/bd.m3u',
  2: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/in.m3u',
  3: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/us.m3u',
  4: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/uk.m3u',
  5: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/pk.m3u',
  6: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/au.m3u',
  7: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/ca.m3u',
  8: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/nz.m3u'
};

// HLS test streams (working backup)
export const TEST_STREAMS = {
  1: 'https://test-streams.mux.dev/x36xhzz/x3uskqabc.m3u8',
  2: 'https://test-streams.mux.dev/x36xhzz/x3uskqabc.m3u8',
  3: 'https://test-streams.mux.dev/x36xhzz/x3uskqabc.m3u8',
  4: 'https://test-streams.mux.dev/x36xhzz/x3uskqabc.m3u8',
  5: 'https://test-streams.mux.dev/x36xhzz/x3uskqabc.m3u8',
  6: 'https://test-streams.mux.dev/x36xhzz/x3uskqabc.m3u8',
  7: 'https://test-streams.mux.dev/x36xhzz/x3uskqabc.m3u8',
  8: 'https://test-streams.mux.dev/x36xhzz/x3uskqabc.m3u8'
};
