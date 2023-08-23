import { Response, Request } from 'express';
import { BASE_URL } from '../../config/app.config.js';
import * as cherioo from 'cheerio';
import { animeDownloadProps } from '../../types/download.js';
import { splitString } from '../../utils/index.util.js';

const getEpisodeDetail = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const response = await fetch(BASE_URL + '/episode/' + slug);
    const content = await response.text();

    const $ = cherioo.load(content);

    const downloadData: animeDownloadProps[] = [];
    const $downloadContainer = $('.download');
    $downloadContainer.find('ul').each((idx, el) => {
      const ul = $(el);

      const donwloadLinks = ul
        .find('li')
        .map((idl, edl) => {
          const format = $(edl).find('strong').text();
          const links = $(edl)
            .find('a')
            .map((lidx, element) => {
              const url = $(element).attr('href');
              const serverName = $(element).text();
              return { url, serverName };
            })
            .get();
          return { format, links };
        })
        .get();

      donwloadLinks.forEach((item) => {
        downloadData.push({
          resolution: item.format,
          data: item.links.map((item) => {
            return { link: item.url, serverName: item.serverName };
          }),
        });
      });
    });

    const title = $('.posttl').text();

    if (!title) return res.status(404).json('Result not found');

    const $containerinfo = $('.infozingle');

    const dataList: any = {};
    $containerinfo.find('p span b').each((idx, el) => {
      const key = $(el).text().trim();
      const value = $(el)
        .parent()
        .text()
        .replace(key + ':', '')
        .trim();
      const keyLower = key.toLowerCase();
      dataList[keyLower] = value;
    });

    const episodelist: { name?: string; slug?: string }[] = [];
    const $episodeContainer = $('.keyingpost');
    $episodeContainer.find('li a').each((idx, el) => {
      const name = $(el).text();
      const url = $(el).attr('href');
      episodelist.push({ name, slug: splitString(url, 2, '/') });
    });

    // get stream links
    const streamLink = $('.player-embed .responsive-embed-stream iframe').attr(
      'src'
    );

    const data = {
      title,
      ...dataList,
      streamLink,
      episodes: episodelist,
      downloadLinks: downloadData,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

const episodeController = {
  getEpisodeDetail,
};

export default episodeController;
