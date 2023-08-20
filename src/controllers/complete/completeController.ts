import { Request, Response } from 'express';
import { BASE_URL } from '../../config/app.config.js';
import * as cherioo from 'cheerio';
import { animeProps } from '../../types/anime.js';
import { splitString } from '../../utils/index.util.js';

const getCompleteAnime = async (req: Request, res: Response) => {
  const { page } = req.query;
  try {
    let url = BASE_URL + '/complete-anime';
    if (page) {
      url = BASE_URL + '/complete-anime' + '/page/' + page;
    }
    const response = await fetch(url);
    const html = await response.text();
    const $ = cherioo.load(html);

    const $container = $('.venz');

    const data: Partial<animeProps>[] = [];
    $container.find('ul').each((idx, el) => {
      const list = $(el);
      const animeData = list
        .find('.detpost')
        .map((index, element) => {
          const episode = $(element)
            .find('.epz')
            .text()
            .replace(' Episode', '');

          const title = $(element).find('.thumb .thumbz h2').text();
          const thumbnail = $(element).find('.thumb .thumbz img').attr('src');
          const URL = $(element).find('.thumb a').attr('href');
          const releaseDate = $(element).find('.newnime').text();
          const rating = $(element).find('.epztipe').text().trim();

          const slugURL = splitString(URL, 2, '/');

          return {
            episode: Number(episode),
            title,
            thumbnail,
            slug: slugURL,
            releaseDate,
            rating: parseFloat(rating),
          };
        })
        .get();

      animeData.map((item, idx) => {
        data.push({
          title: item.title,
          thumbnail: item.thumbnail,
          slug: item.slug,
          releaseDate: item.releaseDate,
          episodes: item.episode,
          rating: item.rating,
          status: 'completed',
        });
      });
    });

    if (!data.length)
      return res.send({ response: 'Results not found', status: 400 });

    const pagination = $('.pagenavix .page-numbers')
      .map((idx, el) => {
        return $(el).text();
      })
      .get();
    const paginationCount = pagination.filter((item) => !isNaN(Number(item)));

    const totalPage = Number(paginationCount[paginationCount.length - 1]);

    const prevPage = () => {
      if (!page) return null;
      if (Number(page) >= 2) return Number(page) - 1;
      return null;
    };

    const nextPage = () => {
      if (!page) return 2;
      if (totalPage < Number(page)) return Number(page) + 1;
      return null;
    };

    const currentPage = page ? Number(page) : 1;

    const collection = {
      currentPage,
      totalPage,
      nextPage: nextPage(),
      prevPage: prevPage(),
      data: data,
    };

    res.send({
      response: 'complete anime',
      collection: collection,
    });
  } catch (error) {
    res.send(error);
  }
};

const completeAnime = {
  getCompleteAnime,
};

export default completeAnime;
