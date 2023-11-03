'use strict';
// routes/user/routes_user.js

import express from 'express';
import dbService from "../../services/db/dbService.js";
import userService from "./userService.js";
import passport from 'passport';


const router = express.Router();


router.get('/profil/:id',
    (req, res) => {
        const userId = req.params.id;  // Extrahiert die User-ID aus dem URL-Pfad
        console.log('User ID:', userId);
        if (!userId) {
            return res.status(400).json({error: 'User ID is missing'});
        }
        dbService.getUserProfile(userId)
            .then(userProfile => {
                res.status(200).json(userProfile);
            })
            .catch(error => {
                console.error(`Error fetching user profile: ${error}`);
                res.status(500).send('Internal Server Error');
            });
    }
);



router.post('/register', (req, res) => {
    const {email, username, password} = req.body;  // username hinzugefügt

    userService.registerUser(email, username, password)  // username hinzugefügt
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            console.error(`Error during user registration: ${error}`);
            if (error.message === 'Email, username and password are required') {
                res.status(400).json({error: error.message});
            } else {
                res.status(500).send('Internal Server Error');
            }
        });
});

router.post('/login', (
    req,
    res,
    next
) => {
    const {identifier, password} = req.body; // Extrahiere Daten aus dem Request Body
    if (!identifier || !password) {
        return res.status(400).json({message: 'Identifier und Passwort sind erforderlich.'});
    }

    userService.loginUser(identifier, password)
        .then(user => {
            req.login(user, function (err) {
                if (err) {
                    console.error("Login Error:", err);
                    return next(err);
                }
                // Speichere user._id in der Session
                req.session.userId = user._id;
                req.session.save(err => {
                    if (err) {
                        console.error("Session Save Error:", err);
                        return next(err);
                    }
                    // Senden des Benutzers an den Client
                    res.status(200).json({message: 'Erfolgreich eingeloggt', user});
                });
            });
        })
        .catch(error => {
            console.error('Fehler beim Login:', error);
            res.status(401).json({message: 'Authentifizierung fehlgeschlagen'});
        });

});

// In routes_user.js
router.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({message: 'Could not log out, try again'});
        }
        res.status(200).json({message: 'Logged out'});
    });
    req.session.cookies = null;
});


export default router;