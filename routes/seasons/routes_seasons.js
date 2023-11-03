'use strict';

// routes/seasons/routes_seasons.js
import express from "express";

// Routes
const router = express.Router();

router.use((req, res, next) => {
    console.log('Time:', Date.now(), 'Request Type:', req.method, 'Request Path:', req.originalUrl);
    next();
});


export default router;