import { Router } from 'express';
import completeAnime from '../controllers/complete/completeController.js';

const route = Router();

// routing
route.get('/', completeAnime.getCompleteAnime);
route.get('/?page=:page', completeAnime.getCompleteAnime);

export default route;
