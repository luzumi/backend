// config/corsJsonConfig.js
'use strict';

const corsJsonConfig = {
    origin: process.env.CLIENT_URL || "http://localhost:3000",  // Erlaubte Ursprungsdomäne
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Erlaubte Methoden
    credentials: true,  // Erlaubt dem Server, Cookies und Headers zu senden
    optionsSuccessStatus: 204  // Status-Code für erfolgreiche CORS-Preflight-Anfragen
};

export default corsJsonConfig;