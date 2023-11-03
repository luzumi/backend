// services/sessionConfig.js

'use strict';

import session from 'express-session';

// Session-Konfiguration
const sessionConfig = session({
    secret: process.env.SECRET_KEY || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // `secure: true` bei HTTPS Verbindungen
});

export default sessionConfig;
