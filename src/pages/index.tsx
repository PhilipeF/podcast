import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDuratinToTimeString';

import styles from './home.module.scss';
import Episode from './episodes/[slug]';
import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  url: string;
};

type HomeProps = {
  latesEpisodes: Episode[];
  allEpisodes: Episode[];
};

export default function Home({ latesEpisodes, allEpisodes }: HomeProps) {
  const { play } = useContext(PlayerContext);

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2> Tocando agora </h2>
        <ul>
          {latesEpisodes.map((episode) => {
            return (
              <li key={episode.id}>
                <Image
                  width={130}
                  height={130}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit='cover'
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type='button' onClick={() => play(episode)}>
                  <img src='/play-green.svg' alt='Tocar Episódio' />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((epsiode) => {
              return (
                <tr key={epsiode.id}>
                  <td style={{ width: 100 }}>
                    <Image
                      width={120}
                      height={120}
                      src={epsiode.thumbnail}
                      alt={epsiode.title}
                      objectFit='cover'
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${epsiode.id}`}>
                      <a>{epsiode.title}</a>
                    </Link>
                  </td>
                  <td>{epsiode.members}</td>
                  <td style={{ width: 100 }}>{epsiode.publishedAt}</td>
                  <td>{epsiode.durationAsString}</td>
                  <td>
                    <button type='button'>
                      <img src='/play-green.svg' alt='Tocar episódio' />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBR,
      }),
      thumbnail: episode.thumbnail,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      url: episode.file.url,
    };
  });

  const latesEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      episodes,
      latesEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
