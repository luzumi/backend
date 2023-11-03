// models/schemes.js

'use strict';
import mongoose from 'mongoose';


// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    _id: String,
    _rev: String,
    password: String,
    ownImages: [],
    favoriteTeams: [],
    visitedGames: []
});

// Country Schema
const countrySchema = new mongoose.Schema({
    "_id": String,
    "_rev": String,
    "name": String,
    "code": String,
    "flag": String,
    "leagues": [],
    "venues": []
});

// League Schema
const leagueSchema = new mongoose.Schema({
    league: {
        id: Number,
        name: String,
        type: String,
        logo: String
    },
    country: {
        name: String,
        code: String,
        flag: String
    },
    seasons: [{
        year: Number,
        start: Date,
        end: Date,
        current: Boolean,
        coverage: {
            // Definieren Sie die Struktur für 'coverage'
        }
    }],
    // Felder für Tabellen, Spieltage usw.
});

// Season Schema
const seasonSchema = new mongoose.Schema({

    id: String,
    rev: String,
    league: {
        id: Number,
        name: String,
        type: String,
        logo: String
    },
    country: {
        name: String,
        code: String,
        flag: String
    },
    seasons: []

});

// Standings Schema (falls erforderlich)
const standingsSchema = new mongoose.Schema({
    // Struktur definieren
});

// Modelle erstellen
const User = mongoose.model('User', userSchema);
const Country = mongoose.model('Country', countrySchema);
const League = mongoose.model('League', leagueSchema);
const Season = mongoose.model('Season', seasonSchema);
const Standings = mongoose.model('Standings', standingsSchema);

// Export der Modelle (sofern in separaten Dateien)
export  {
    User,
    Country,
    League,
    Season,
    Standings
}
