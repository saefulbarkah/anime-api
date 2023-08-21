import { Router } from 'express';
import { GenreLists } from '../controllers/genre/genreController.js';
const route = Router();
route.get('/', GenreLists);
export default route;
