import express, { Request, Response } from 'express';
import * as route from './routes/index.js';
import { host, port } from './config/app.config.js';
import cors from 'cors';

export const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'OTAKUDESU API',
    routes: {
      ongoing: '/ongoing-anime',
      show_detail_anime: '/anime/:title',
      release_schedule: '/release-schedule',
      genre_list: '/genres',
      complete_anime: '/complete-anime',
      search_anime: '/anime?q=:title',
      anime_lists: '/anime/lists',
    },
  });
});

app.use('/ongoing-anime', route.ongoingRoute);
app.use('/anime', route.animeRoute);
app.use('/genres', route.genreRoute);
app.use('/release-schedule', route.scheduleRoute);
app.use('/search', route.searchRoute);
app.use('/complete-anime', route.completeRoute);

app.listen(port, () => {
  console.log(`Server running on  ${host}:${port}`);
});
