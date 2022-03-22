import { verifyToken } from '../utils/helpers.js';
import express from 'express';
import countryController from '../controllers/countries.js';

const router = express.Router();

router.get('/', verifyToken, countryController.getCountries);
router.post('/:countryName', verifyToken, countryController.postCountry);
router.put('/:countryName', verifyToken, countryController.putCountry);
router.delete('/:countryName', verifyToken, countryController.deleteCountry);

export default router;