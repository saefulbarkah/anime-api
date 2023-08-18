import { Request, Response } from 'express';
import * as cheerio from 'cheerio';
import { BASE_URL } from '../../config/CONST.js';

export const GenreLists = async (req: Request, res: Response) => {
  try {
    const response = await fetch(BASE_URL + '/genre-list');
    const html = await response.text();
    const $ = cheerio.load(html);

    const genres = $('.genres li a')
      .map((idx, element) => {
        return $(element).text();
      })
      .get();

    const results: { name: string }[] = [];

    for (let i = 0; i < genres.length; i++) {
      const data = {
        name: genres[i],
      };
      results.push(data);
    }
    res.json(results);
  } catch (error) {
    res.json(error);
  }
};
