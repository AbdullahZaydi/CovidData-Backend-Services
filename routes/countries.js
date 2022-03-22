import { verifyToken } from '../utils/helpers.js';
import express from 'express';
import countryController from '../controllers/countries.js';

const router = express.Router();

router.get('/', countryController.getCountries);
router.post('/:countryName', countryController.postCountry);
router.put('/:countryName', countryController.putCountry);
router.delete('/:countryName', countryController.deleteCountry);

export default router;