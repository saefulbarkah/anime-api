import { Request, Response } from 'express';
import { BASE_URL } from '../../config/app.config.js';
import * as cheerio from 'cheerio';
import { animeProps } from '../../types/anime.js';
import { splitString } from '../../utils/index.util.js';

const findAnimeByTitle = async (req: Request, res: Response) => {
  const { title } = req.params;
  try {
    const response = await fetch(BASE_URL + '/anime/' + title);
    const html = await response.text();
    const $ = cheerio.load(html);
    const thumbnail = $('.wp-post-image').attr('src');
    const info = $('.infozingle p span')
      .map((index, element) => {
        return $(element).text();
      })
      .get();

    if (!info.length)
      return res.status(404).json({ response: 'result not found' });

    const episodeLists = $('.episodelist ul li span')
      .map((idx, element) => {
        return $(element).text();
      })
      .get();

    const episodeSlug = $('.episodelist ul li span a')
      .map((idx, element) => {
        const value = $(element).attr('href');
        const results = splitString(value, 2, '/');
        return results;
      })
      .get();

    const keyCollection: any = {};

    // assign information to object
    info.forEach((el, idx) => {
      const [key, value] = el.split(':').map((item) => item.trim());
      keyCollection[key] = value;
    });

    // split value genre into array
    const genres = keyCollection['Genre']
      .split(',')
      .map((genre: string) => genre.trim());

    // updated object
    const dataUpdated = {
      ...keyCollection,
      Genre: genres,
    };

    // rename key data collection
    const renamedCollectionKey: { [key: string]: string } = {
      Judul: 'title',
      Japanese: 'japanese',
      Skor: 'score',
      Produser: 'producer',
      Tipe: 'type',
      Status: 'status',
      'Total Episode': 'episodes',
      Durasi: 'duration',
      'Tanggal Rilis': 'releaseDate',
      Studio: 'studio',
      Genre: 'genres',
    };

    // result for renamed key object
    const renamedDataObject: { [key: string]: string } = {};

    // proccess renaming keys
    for (const key in dataUpdated) {
      const newKey = renamedCollectionKey[key] || key;
      renamedDataObject[newKey] = dataUpdated[key];
    }

    const episodesResults = [];
    let tempEpisodes: { title?: string; date?: string; slug?: string } = {};

    // get data episode lists
    for (let i = 0; i < episodeLists.length; i++) {
      if (i % 2 === 0) {
        tempEpisodes.title = episodeLists[i];
      } else {
        tempEpisodes.date = episodeLists[i];
        episodesResults.push(tempEpisodes);
        tempEpisodes = {};
      }
    }

    // add slug object to episode lists
    const episodes = episodesResults.map((item, idx) => {
      return { ...item, slug: episodeSlug[idx] };
    });

    const data: Partial<animeProps> = {
      thumbnail,
      ...renamedDataObject,
      episodeLists: episodes,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAnimeLists = async (req: Request, res: Response) => {
  try {
    const response = await fetch(BASE_URL + 'anime-list');
    const html = await response.text();
    const $ = cheerio.load(html);

    const $container = $('.jdlbar');

    const data: Partial<animeProps>[] = [];
    $container.find('ul').each((idx, el) => {
      const ul = $(el);
      const items = ul
        .find('li')
        .map((index, element) => {
          const title = $(element).find('a').text();
          const slug = $(element).find('a').attr('href');
          return { title, slug: splitString(slug, 2, '/') };
        })
        .get();

      items.map((item, idx) => {
        data.push({
          title: item.title,
          slug: item.slug,
        });
      });
    });

    if (!data.length) return res.status(404).json('data not found');

    res.status(200).json(data);
  } catch (error) {
    res.status(403).json(error);
  }
};

const animeController = {
  findAnimeByTitle,
  getAnimeLists,
};

export default animeController;
