import express from 'express';
import { findAnimeByTitle } from '../controllers/anime/animeController.js';

const router = express.Router();

// routes
router.get('/:title', findAnimeByTitle);

export default router;
