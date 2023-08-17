var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as cheerio from 'cheerio';
import { BASE_URL } from '../../config/CONST.js';
export const getOngoing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page } = req.query;
    let url;
    if (page) {
        url = BASE_URL + `/ongoing-anime/page/${page}`;
    }
    else {
        url = BASE_URL + '/ongoing-anime';
    }
    const response = yield fetch(url);
    const html = yield response.text();
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
});
