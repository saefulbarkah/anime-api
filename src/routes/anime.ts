import express from 'express';
import animeController from '../controllers/anime/animeController.js';

const router = express.Router();

// routes
router.get('/lists', animeController.getAnimeLists);
router.get('/:slug', animeController.findAnimeByTitle);

export default router;
