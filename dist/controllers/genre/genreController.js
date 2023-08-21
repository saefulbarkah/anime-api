import * as cheerio from 'cheerio';
import { BASE_URL } from '../../config/app.config.js';
export const GenreLists = async (req, res) => {
    try {
        const response = await fetch(BASE_URL + '/genre-list');
        const html = await response.text();
        const $ = cheerio.load(html);
        const genres = $('.genres li a')
            .map((idx, element) => {
            return $(element).text();
        })
            .get();
        const results = [];
        for (let i = 0; i < genres.length; i++) {
            const data = {
                name: genres[i],
            };
            results.push(data);
        }
        res.json(results);
    }
    catch (error) {
        res.json(error);
    }
};
