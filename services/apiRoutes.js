// services/apiRoutes.js
'use strict';

import express from 'express';
import countryRoutes from '../routes/countries/routes_countries.js';
import leagueRoutes from '../routes/leagues/routes_leagues.js';
import userRoutes from '../routes/user/routes_user.js';

const apiRoutes = express.Router();

apiRoutes.use('/api/countries', countryRoutes);
apiRoutes.use('/api/leagues', leagueRoutes);
apiRoutes.use('/api/user', userRoutes);


export default apiRoutes;
