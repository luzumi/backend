'use strict';

// routes/countries/countryService.js
import db from '../../database/db.js';
import dbService from '../../services/db/dbService.js';

export const fetchCountriesByLetter = (letter) => {
    return new Promise((resolve, reject) => {
        const dbInstance = db.getDatabase('countries');
        dbInstance.view('countries', `ByLetter${letter.toUpperCase()}`, (err, body) => {
            if (err) {
                return reject(err);
            }
            resolve(body.rows.map(row => row.value));
        });
    });
};

// Methode, um ein Land anhand des Namens abzurufen
export const fetchCountryByName = (name) => {
    return new Promise((resolve, reject) => {
        const dbInstance = db.getDatabase('countries');
        dbInstance.view('countries', 'ByName', { "key": name }, (err, body) => {
            if (err) {
                return reject(err);
            }
            resolve(body.rows.length > 0 ? body.rows[0].value : null);
        });
    });
};

