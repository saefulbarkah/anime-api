import { BASE_URL } from '../../config/app.config.js';
import * as cheerio from 'cheerio';
import { splitString } from '../../utils/index.util.js';
const findAnimeByTitle = async (req, res) => {
    const { slug } = req.params;
    try {
        const response = await fetch(BASE_URL + '/anime/' + slug);
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
        const keyCollection = {};
        info.forEach((el, idx) => {
            const [key, value] = el.split(':').map((item) => item.trim());
            keyCollection[key] = value;
        });
        const genres = keyCollection['Genre']
            .split(',')
            .map((genre) => genre.trim());
        const dataUpdated = {
            ...keyCollection,
            Genre: genres,
        };
        const renamedCollectionKey = {
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
        const renamedDataObject = {};
        for (const key in dataUpdated) {
            const newKey = renamedCollectionKey[key] || key;
            renamedDataObject[newKey] = dataUpdated[key];
        }
        const episodesResults = [];
        let tempEpisodes = {};
        for (let i = 0; i < episodeLists.length; i++) {
            if (i % 2 === 0) {
                tempEpisodes.title = episodeLists[i];
            }
            else {
                tempEpisodes.date = episodeLists[i];
                episodesResults.push(tempEpisodes);
                tempEpisodes = {};
            }
        }
        const episodes = episodesResults.map((item, idx) => {
            return { ...item, slug: episodeSlug[idx] };
        });
        const data = {
            thumbnail,
            ...renamedDataObject,
            episodeLists: episodes,
        };
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
const getAnimeLists = async (req, res) => {
    try {
        const response = await fetch(BASE_URL + 'anime-list');
        const html = await response.text();
        const $ = cheerio.load(html);
        const $container = $('.jdlbar');
        const data = [];
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
        if (!data.length)
            return res.status(404).json('data not found');
        res.status(200).json(data);
    }
    catch (error) {
        res.status(403).json(error);
    }
};
const animeController = {
    findAnimeByTitle,
    getAnimeLists,
};
export default animeController;
