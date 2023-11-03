import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

const sessionConfig = session({
    secret: process.env.SECRET_KEY || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // `secure: true` bei HTTPS Verbindungen
});

export default sessionConfig;
