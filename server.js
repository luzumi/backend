import express from 'express';
import dotenv from 'dotenv';
import 'dotenv/config';
import initializeDatabases from './database/initializeDatabases.js';
import sessionConfig from './config/sessionConfig.js';
import passport from './config/passportConfig.js';
import cors from 'cors';
import corsJsonConfig from './config/corsJsonConfig.js';
// import debugMiddleware from './middlewares/debugMiddleware.js';
import apiRoutes from './services/apiRoutes.js';


dotenv.config();

const server = express();
const PORT = process.env.SERVER_PORT || 3001;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors(corsJsonConfig));
server.use(sessionConfig);
server.use(passport.initialize());
server.use(passport.session());
server.use(apiRoutes);
// server.use(debugMiddleware);

initializeDatabases()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to initialize databases:', err);
    });
