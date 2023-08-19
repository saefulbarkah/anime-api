import { Response, Request } from 'express';
import { BASE_URL } from '../../config/app.config.js';
import * as cheerio from 'cheerio';

export const releaseSchedule = async (req: Request, res: Response) => {
  try {
    const response = await fetch(BASE_URL + '/jadwal-rilis');
    const html = await response.text();
    const $ = cheerio.load(html);

    const scheduleDate = $('.kglist321')
      .map((idx, el) => {
        return $(el).children('ul').children('li').text();
      })
      .get();

    const daysOfWeek = [
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
      'Minggu',
      'Random',
    ];

    const animeList = $('.kglist321 ul li a')
      .map((idx, el) => {
        return $(el).text().trim();
      })
      .get();

    res.json({ scheduleDate });
  } catch (error) {
    res.json(error);
  }
};
