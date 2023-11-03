'use strict';
// routes/routes_countries.js

import express from 'express';
import dbService from '../../services/db/dbService.js';
import {fetchCountriesByLetter, fetchCountryByName} from './countryService.js';

const router = express.Router();
router.use((req, res, next) => {
    console.log('Time:', Date.now(), 'Request Type:', req.method, 'Request Path:', req.originalUrl);
    next();
});


router.get('/all', async (request, response) => {
    try {
        const result = await dbService.listCountries({ include_docs: true });
        response.json(result);
    } catch (err) {
        console.error("Ein Fehler ist aufgetreten:", err);
        response.status(500).json({ error: err.message });
    }
});

router.get('/:letter', (req, res) => {
    console.log(req.params)
    fetchCountriesByLetter(req.params.letter)
        .then(countries => res.status(200).json(countries))
        .catch(err => res.status(500).json({ error: err.message }));
});

// In deinem Router
router.get('/detail/:name', async (req, res) => {
    try {
        const countryName = req.params.name;
        const countryDetail = await fetchCountryByName(countryName);
        res.status(200).json(countryDetail);
    } catch (err) {
        console.error("Ein Fehler ist aufgetreten:", err);
        res.status(500).json({ error: err.message });
    }
});




export default router;
