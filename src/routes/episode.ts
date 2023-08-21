import { Router } from 'express';
import episodeController from '../controllers/episode/episodeController.js';

const route = Router();

// routing
route.get('/:slug', episodeController.getEpisodeDetail);

export default route;
