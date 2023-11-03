'use strict';
// routes/leagues/routes_leagues.js

import express from "express";
import { fetchLeagueByCountryName, fetchLeagueByLeagueID } from "./leagueService.js";

// Routes
const router = express.Router();

router.use((req, res, next) => {
    console.log('Time:', Date.now(), 'Request Type:', req.method, 'Request Path:', req.originalUrl);
    next();
});

router.get('/:name', (req, res) => {
    console.log(req.params.name);
    fetchLeagueByCountryName(req.params.name)
        .then(leagues => {
            console.log(leagues);
            res.status(200).json(leagues);
        })
        .catch(err => {
            console.error(err); // Es ist nützlich, den Fehler auch auf der Serverkonsole zu loggen
            res.status(500).json({ error: err.message });
        });
});

router.get('/league/:id', (req, res) => {
    fetchLeagueByLeagueID(+req.params.id)
        .then(leagues => {
            res.status(200).json(leagues);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message });
        });
});

export default router;