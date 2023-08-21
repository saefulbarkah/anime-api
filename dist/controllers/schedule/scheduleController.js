import { BASE_URL } from '../../config/app.config.js';
import * as cheerio from 'cheerio';
import { splitString } from '../../utils/index.util.js';
export const releaseSchedule = async (req, res) => {
    try {
        const response = await fetch(BASE_URL + '/jadwal-rilis');
        const html = await response.text();
        const $ = cheerio.load(html);
        const dayOfWeek = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
            'Random',
        ];
        const $container = $('.kglist321');
        const dataArray = [];
        $container.find('ul').each(function (idx) {
            const $ul = $(this);
            const titlesArray = $ul
                .find('li a')
                .map(function () {
                const title = $(this).text().trim();
                const slug = $(this).attr('href');
                return { slug, title };
            })
                .get();
            dataArray.push({
                day: dayOfWeek[idx],
                data: titlesArray.map((itm) => {
                    return { title: itm.title, slug: splitString(itm.slug, 2, '/') };
                }),
            });
        });
        res.json(dataArray);
    }
    catch (error) {
        res.json(error);
    }
};
