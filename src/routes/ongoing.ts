import express from 'express';
import { getOngoing } from '../controllers/ongoing/ongoingController.js';

const router = express.Router();
router.get('/', getOngoing);
router.get('/?page=:count', getOngoing);

export default router;
