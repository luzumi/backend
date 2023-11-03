// services/passportConfig.js
'use strict';

import passport from 'passport';
import dbService from './db/dbService.js';  // Importiere deinen dbService

// Passport serialize und deserialize Methoden
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    console.log("Deserialize User ID:", id);
    dbService.getUserProfile(id).then((user) => {
        console.log("Deserialized User:", user);
        done(null, user);
    }).catch((err) => {
        console.error("Deserialize Error:", err);
        done(err, null);
    });
});


export default passport;
