import { Router } from 'express';
import { releaseSchedule } from '../controllers/schedule/scheduleController.js';
const route = Router();
route.get('/', releaseSchedule);
export default route;
