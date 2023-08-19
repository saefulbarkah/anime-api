import express, { Request, Response } from 'express';
import {
  animeRoute,
  genreRoute,
  ongoingRoute,
  scheduleRoute,
} from './routes/index.js';
import { host, port } from './config/app.config.js';
export const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'OTAKUDESU API',
    routes: {
      ongoing: '/ongoing-anime',
      show_detail_anime: '/anime/:title',
      release_schedule: '/release-schedule',
      genre_list: '/genres',
    },
  });
});

app.use('/ongoing-anime', ongoingRoute);
app.use('/anime', animeRoute);
app.use('/genres', genreRoute);
app.use('/release-schedule', scheduleRoute);

app.listen(port, () => {
  console.log(`Server running on  ${host}:${port}`);
});
