'use strict';

import db from './db.js';
import dbService from '../services/db/dbService.js';
import apiFootballService from '../services/apiFootballService.js';

const databasesToInitialize = ['countries', 'user', 'leagues', 'seasons'];
const endpointMapping = {
    'countries': 'countries',
    'user': 'user',
    'leagues': 'leagues',
    'seasons': 'leagues/seasons',
};

const getApiEndpoint = (dbName) => {
    return endpointMapping[dbName] || dbName;
};
const initializeDatabase = (dbName) => {
    return dbService.isDataStored(dbName)
        .then(stored => {
            if (!stored) {
                return apiFootballService.fetchFootballData(getApiEndpoint(dbName));
            }
            return null;
        })
        .then(data => {
            if (data) {
                return dbService.insertData(dbName, data);
            }
            return null;
        })
        .catch(err => {
            console.error(`Fehler beim Initialisieren der Datenbank ${dbName}: ${err.message}`);
        });
};

const initializeAllDatabases = () => {
    const initPromises = databasesToInitialize.map(dbName => initializeDatabase(dbName));
    return Promise.all(initPromises)
        .then(() => dbService.updateCountriesWithLeagues())
        // .then(() => dbService.updateCountriesWithVenues())
        .catch(err => {
            console.error('Fehler während der Datenbankinitialisierung oder Aktualisierung:', err);
        });

};


const initializeDatabases = () => {
    return db.createDatabase(databasesToInitialize)
        .then(messages => {
            messages.forEach(msg => console.log(msg));
            return initializeAllDatabases();
        })
        .catch(err => console.log(`Some databases could not be created: ${err.message}`));
};

export default initializeDatabases;
