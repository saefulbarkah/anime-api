import { Request, Response } from 'express';
import { BASE_URL } from '../../config/CONST.js';
import * as cheerio from 'cheerio';
import { animeProps } from '../../types/anime.js';

export const findAnimeByTitle = async (req: Request, res: Response) => {
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

    const episodeLists = $('.episodelist ul li span')
      .map((idx, element) => {
        return $(element).text();
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
    let tempEpisodes: { title?: string; date?: string } = {};

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

    const data: Partial<animeProps> = {
      thumbnail,
      ...renamedDataObject,
      episodeLists: episodesResults,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
