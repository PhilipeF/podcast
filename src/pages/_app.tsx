import { Header } from '../components/Header';
import { Player } from '../components/Player';

import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import { PlayerContext } from '../context/PlayerContext';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [episodeList, setepisodeList] = useState([]);
  const [currentEpisodeIndex, setcurrentEpisodeIndex] = useState(0);

  function play(episode) {
    setepisodeList([episode]);
    setcurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play }}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  );
}

export default MyApp;
