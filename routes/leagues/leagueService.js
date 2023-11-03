'use strict';

// routes/leagues/leagueService.js

import dbService from "../../services/db/dbService.js";
import apiFootballService from "../../services/apiFootballService.js";
import db from "../../database/db.js";

const fetchAndStoreLeagues = () => {
    apiFootballService.fetchFootballData('leagues')
        .then(data => {
            if (data) {
                // Speichere die Daten in der Datenbank
                return dbService.insertData('leagues', data);
            }
        })
        .catch(err => {
            console.log(err);
        });
};

const fetchLeagueByCountryName = (name) => {
    return new Promise((resolve, reject) => {
        const dbInstance = db.getDatabase('leagues');
        dbInstance.view('leagues', 'AllByCountryName', {"key": name}, (err, body) => {
            if (err) {
                return reject(err);
            }
            // Hier wird geprüft, ob body.rows Einträge enthält und gibt alle Einträge zurück.
            resolve(body.rows.length > 0 ? body.rows.map(row => row.value) : []);
        });
    });
};


export const fetchLeagueByLeagueID = (id) => {
    return new Promise((resolve, reject) => {
        const dbInstance = db.getDatabase('leagues');

        dbInstance.view('leagues', 'AllByLeagueId', {"key": id}, (err, body) => {
            if (err) {
                console.error('Fehler bei der Datenbankabfrage:', err);
                return reject(err);
            }
            if (body.rows.length > 0) {
                // Nehme nur das erste Objekt aus der rows-Liste
                const league = body.rows[0].value;
                console.log('Gefundene Liga:', league);
                resolve(league);
            } else {
                console.log('Keine Ligen gefunden für ID:', id);
                resolve(null);
            }
        });
    });
};

export {
    fetchAndStoreLeagues,
    fetchLeagueByCountryName
};
