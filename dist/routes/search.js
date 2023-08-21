import { Router } from 'express';
import { searchAnime } from '../controllers/search/searchController.js';
const route = Router();
route.get('/', searchAnime);
export default route;
