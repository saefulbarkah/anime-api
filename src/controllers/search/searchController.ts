import { Request, Response } from 'express';
import { BASE_URL } from '../../config/app.config.js';
import * as cheerio from 'cheerio';
import { animeProps } from '../../types/anime.js';

export const searchAnime = async (req: Request, res: Response) => {
  const { q } = req.query;

  try {
    const response = await fetch(BASE_URL + '?s=' + q + '&post_type=anime');
    const html = await response.text();
    const $ = cheerio.load(html);

    const $container = $('.page');

    const data: Partial<animeProps>[] = [];

    $container.find('ul').each(function () {
      const ul = $(this);
      const searchData = ul
        .find('li')
        .map((idx, el) => {
          const img = $(el).find('img').attr('src');
          const title = $(el).find('h2').text();
          const slugURL = $(el).find('h2 a').attr('href');
          const status = $(el)
            .find('.set:nth-child(4)')
            .contents()
            .filter(function () {
              return this.nodeType === 3;
            })
            .text()
            .trim()
            .toLowerCase()
            .replace(': ', '');
          const rating = $(el)
            .find('.set:contains("Rating")')
            .contents()
            .filter(function () {
              return this.nodeType === 3;
            })
            .text()
            .trim()
            .replace(': ', '');

          const genres = $(el)
            .find('.set a')
            .map((gidx, gel) => {
              return $(gel).text();
            })
            .get();

          return {
            img,
            title,
            genres,
            status,
            rating: parseFloat(rating),
            slug: slugURL,
          };
        })
        .get();
      searchData.map((itm, idx) => {
        const item: Partial<animeProps> = {
          title: itm.title,
          thumbnail: itm.img,
          genres: itm.genres,
          status: itm.status,
          rating: itm.rating,
          slug: itm.slug,
        };
        data.push(item);
      });
    });
    if (data.length === 0) {
      return res.status(400).json({
        response: 'Results not found',
        status: 400,
        data: null,
      });
    }
    return res.status(200).json({
      status: 200,
      response: 'success',
      data: data,
    });
  } catch (error) {
    res.status(200).json(error);
  }
};
