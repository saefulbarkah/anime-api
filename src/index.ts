import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import {
  animeRoute,
  genreRoute,
  ongoingRoute,
  scheduleRoute,
} from './routes/index.js';

dotenv.config();
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'OTAKUDESU API',
    routes: {
      ongoing: '/ongoing-anime',
      show_detail_anime: '/anime/:title',
      release_schedule: '/release-schedule',
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
