// config/passportConfig.js
'use strict';

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import dbService from '../services/db/dbService.js'; // Pfad zu Ihrem dbService
import bcrypt from 'bcrypt';

// Konfiguration der LocalStrategy
passport.use(new LocalStrategy(
    { usernameField: 'identifier' },
    async function (identifier, password, done) {
        try {
            const user = await dbService.findUserByIdentifier(identifier);
            if (!user) {
                return done(null, false, { message: 'Benutzer nicht gefunden' });
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return done(null, false, { message: `Fehler bei der Passwortüberprüfung, ${err}` });
                }
                if (result) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Ungültiges Passwort' });
                }
            });
        } catch (error) {
            return done(null, false, { message: `Fehler bei passport, ${error}` });
        }
    }
));

// Serialisierung und Deserialisierung
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    dbService.getUserProfile(id)
        .then(user => {
            if (user) {
                done(null, user);
            } else {
                done(new Error('User nicht gefunden'));
            }
        })
        .catch(err => {
            done(err);
        });
});

export default passport;
