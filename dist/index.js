import express from 'express';
import * as route from './routes/index.js';
import { host, port } from './config/app.config.js';
import cors from 'cors';
export const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.status(200).send('Otakudesu API Unofficial');
});
app.use('/ongoing-anime', route.ongoingRoute);
app.use('/anime', route.animeRoute);
app.use('/genres', route.genreRoute);
app.use('/release-schedule', route.scheduleRoute);
app.use('/search', route.searchRoute);
app.use('/complete-anime', route.completeRoute);
app.use('/episode', route.episodeRoute);
app.listen(port, () => {
    console.log(`Server running on  ${host}:${port}`);
});
