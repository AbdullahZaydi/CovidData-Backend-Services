import { verifyToken } from '../utils/helpers.js';
import express from 'express';
import covidController from '../controllers/covid.js';

const router = express.Router();

router.get('/updates/:countryName', covidController.getUpdates);
router.post('/updates/:countryName', covidController.postUpdates);
router.put('/updates/:countryName', covidController.putUpdates);
router.delete('/updates/:countryName/:date', covidController.deleteUpdates);

export default router;