'use strict';
// services/dbService.js

import db from '../../database/db.js';
import {hashPassword} from "../passwordService.js";
import {initializeUser} from "../userServiceHelpers.js";
import apiFootballService from "../apiFootballService.js";
import debugToFile from "../../middlewares/degugToFile.js";

const isDataStored = (dbName) => {
    return new Promise((resolve, reject) => {
        db.find(dbName, {selector: {}})  // leerer Selector für alle Dokumente
            .then(result => resolve(result && result.length > 0))
            .catch(err => {
                console.error(err);
                reject(false);
            });
    });
};

const isArrayofObjects = (arr) => {
    return Array.isArray(arr) && arr.every(item => typeof item === 'object' && item !== null);
};

const insertData = (dbName, data) => {
    let transformedArray = data.response;
    if (!isArrayofObjects(transformedArray)) {
        transformedArray = transformedArray.map(season => {
            return {season: season};
        });
    }

    return new Promise((resolve, reject) => {
        db.insertMany(dbName, transformedArray)
            .then(() => resolve())
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
};


const listCountries = () => {
    return new Promise((resolve, reject) => {
        const dbInstance = db.getDatabase('countries');
        dbInstance.find({
            selector: {},
            fields: ["_id", "_rev", "name", "code", "flag"],
            limit: 1000,
        })
            .then(result => {
                resolve(result.docs);
            })
            .catch(err => {
                console.error("Fehler in der list-Methode:", err);
                reject(err);
            });
    });
};

const listLeagues = () => {
    return new Promise((resolve, reject) => {
        const dbInstance = db.getDatabase('leagues');
        dbInstance.find({
            selector: {},
        })
            .then(result => {
                resolve(result.docs);
            })
            .catch(err => {
                console.error("Fehler in der listLeagues-Methode:", err);
                reject(err);
            });
    });
};


const createUser = (user) => {
    return hashPassword(user.password)
        .then(hashedPassword => {
            const initializedUser = initializeUser(user, hashedPassword);
            return db.insert('user', initializedUser);
        })
        .then(() => {
            return user;
        })
        .catch(error => {
            console.error(`Error during user creation: ${error}`);
            throw error;
        });
};

const getUserProfile = (userId) => {
    return new Promise((resolve, reject) => {
        const dbInstance = db.getDatabase('user');
        dbInstance.get(userId)
            .then(userProfile => {
                resolve(userProfile);
            })
            .catch(error => {
                reject(error);
            });
    });
};

// In Ihrem dbService.js

const findUserByIdentifier = (identifier) => {
    return new Promise((resolve, reject) => {
        const query = {
            selector: {
                $or: [
                    {email: identifier},
                    {username: identifier}
                ]
            },
            limit: 1
        };
        console.log("Query:", JSON.stringify(query));

        db.find('user', query)
            .then(result => {
                if (Array.isArray(result) && result.length > 0) {
                    console.log("User found:", result[0]);
                    resolve(result[0]);  // Erster Treffer
                } else {
                    console.log("User not found");
                    reject('Kein Benutzer mit diesem Identifier gefunden');
                }
            })
            .catch(error => {
                reject('Ein Fehler ist aufgetreten: ' + error.message);
            });

    });
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const updateCountriesWithLeagues = async () => {
    try {
        const countries = await listCountries();
        const results = [];

        for (const country of countries) {
            if (!country.leagues || country.leagues.length === 0) {
                const result = await updateCountryAddLeague(country.name)
                    .catch(err => Promise.reject(err));
                results.push({status: 'fulfilled', value: result});
                await delay(10); // Verzögerung des nächsten API-Aufrufs
            }
        }

        const failed = results.filter(result => result.status === 'rejected');
        if (failed.length > 0) {
            console.error(`Fehler bei updateCountriesWithLeagues: ${failed[0].reason.message}`);
            return Promise.reject(failed[0].reason);
        }
        return true;
    } catch (err) {
        console.error(`Fehler bei updateCountriesWithLeagues: ${err.message}`);
        return Promise.reject(err);
    }
};


const updateCountryAddLeague = (countryName) => {
    // API-Endpunkt für Ligen anpassen
    return apiFootballService.fetchFootballData(`leagues?country=${countryName}`)
        .then(leaguesData => {
            const query = {
                selector: {name: countryName},
                limit: 1
            };
            return db.find('countries', query).then(countryDocs => [countryDocs, leaguesData]);
        })
        .then(([countryDocs, leaguesData]) => {
            if (countryDocs.length === 0) {
                console.error(`Land ${countryName} nicht gefunden`);
                return Promise.reject(new Error(`Land ${countryName} nicht gefunden`));
            }

            debugToFile(leaguesData, 'leagues_debug.json'); // Speichert die Ligen-Daten zur Überprüfung in einer Datei
            const countryDoc = countryDocs[0];
            if (leaguesData && leaguesData.response && Array.isArray(leaguesData.response) && leaguesData.response.length > 0) {
                countryDoc.leagues = leaguesData.response;
            } else {
                console.error('Unerwartete Struktur von leaguesData:', leaguesData);
            }

            return db.insert('countries', countryDoc); // Land-Dokument mit den neuen Ligen aktualisieren
        })
        .then(() => true)
        .catch(err => {
            console.error(`Fehler bei updateCountryAddLeague für ${countryName}: ${err.message}`);
            return Promise.reject(err);
        });
};


const updateCountriesWithVenues = async () => {
    try {
        const countries = await listCountries();
        const results = [];
        for (const country of countries) {
            if (!country.venues || country.venues.length === 0) {
                const result = await updateCountryAddVenue(country.name).catch(err => Promise.reject(err));
                results.push({status: 'fulfilled', value: result});
            } else {
                results.push({status: 'fulfilled', value: null});
            }
            await delay(10);  // Verzögert den nächsten API-Aufruf um 1 Sekunde
        }

        const failed = results.filter(result => result.status === 'rejected');
        if (failed.length > 0) {
            console.error(`Fehler bei updateCountriesWithVenues: ${failed[0].reason.message}`);
            return Promise.reject(failed[0].reason);
        }
        return true;
    } catch (err) {
        console.error(`Fehler bei updateCountriesWithVenues: ${err.message}`);
        return Promise.reject(err);
    }
};


const updateCountryAddVenue = (countryName) => {
    // return apiFootballService.fetchFootballData(`venues?country=${countryName}`)
    return apiFootballService.fetchFootballData(`venues?country=${countryName}`)
        .then(venuesData => {
            const query = {
                selector: {name: countryName},
                limit: 1
            };
            return db.find('countries', query).then(countryDocs => [countryDocs, venuesData]);
        })
        .then(([countryDocs, venuesData]) => {
            if (countryDocs.length === 0) {
                console.error(`Land ${countryName} nicht gefunden`);
                return Promise.reject(new Error(`Land ${countryName} nicht gefunden`));
            }

            debugToFile(venuesData, 'venues_debug.json');
            const countryDoc = countryDocs[0];
            if (venuesData && venuesData.response && Array.isArray(venuesData.response) && venuesData.response.length > 0) {
                countryDoc.venues = venuesData.response;
            } else {
                console.error('Unerwartete Struktur von venuesData:', venuesData);
            }

            return db.insert('countries', countryDoc);  // Dokument aktualisieren
        })
        .then(() => {
            return true;
        })
        .catch(err => {
            console.error(`Fehler bei updateCountryWithVenue für ${countryName}: ${err.message}`);
            return Promise.reject(err);
        });
};


export default {
    isDataStored,
    insertData,
    listCountries,
    getUserProfile,
    createUser,
    findUserByIdentifier,
    updateCountriesWithLeagues,
    updateCountriesWithVenues,
};
