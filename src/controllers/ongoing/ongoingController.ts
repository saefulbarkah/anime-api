import { Request, Response } from 'express';
import * as cheerio from 'cheerio';
import { BASE_URL } from '../../config/CONST.js';

export const getOngoing = async (req: Request, res: Response) => {
  const { page } = req.query;
  let url;
  if (page) {
    url = BASE_URL + `/ongoing-anime/page/${page}`;
  } else {
    url = BASE_URL + '/ongoing-anime';
  }
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const thumb = $('.wp-post-image')
    .map((index, element) => {
      return $(element).attr('src');
    })
    .get();
  const title = $('.jdlflm')
    .map((index, element) => {
      return $(element).text();
    })
    .get();
  const release = $('.epztipe')
    .map((index, element) => {
      return $(element).text().trim();
    })
    .get();
  const episode = $('.epz')
    .map((index, element) => {
      return $(element).text().trim();
    })
    .get();

  const pageTotal = $('.page-numbers').map((index, element) => {
    return $(element).text().trim();
  });

  const data = [];
  for (let i = 0; i < thumb.length; i++) {
    const item = {
      title: title[i],
      thumbnail: thumb[i],
      releaseSchedule: release[i],
      episode: episode[i],
    };
    data.push(item);
  }

  res.status(200).json({
    message: 'ongoing anime',
    collection: {
      page,
      data,
    },
  });
};
