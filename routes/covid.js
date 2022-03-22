import { verifyToken } from '../utils/helpers.js';
import express from 'express';
import covidController from '../controllers/covid.js';

const router = express.Router();

router.get('/updates/:countryName', verifyToken, covidController.getUpdates);
router.post('/updates/:countryName', verifyToken, covidController.postUpdates);
router.put('/updates/:countryName', verifyToken, covidController.putUpdates);
router.delete('/updates/:countryName/:date', verifyToken, covidController.deleteUpdates);

export default router;