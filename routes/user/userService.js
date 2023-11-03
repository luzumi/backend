// backend/routes/user/userService.js
'use strict';

import dbService from '../../services/db/dbService.js';
import bcrypt from 'bcrypt';



class UserService {
    registerUser(email, username, password) {
        return new Promise((resolve, reject) => {
            if (!email || !username || !password) {
                reject(new Error('Email, username and password are required'));
            } else {
                const user = {
                    email,
                    username,
                    password,
                };

                dbService.createUser(user)
                    .then(createdUser => {
                        resolve(createdUser);
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        });
    }

    loginUser = (identifier, password) => {
        return new Promise((resolve, reject) => {
            dbService.findUserByIdentifier(identifier)
                .then(user => {
                    console.log('User found:', JSON.stringify(user))
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (err) {
                            console.error('Fehler bei der Passwortüberprüfung:', err);
                            reject(new Error('Fehler bei der Passwortüberprüfung'));
                        } else if (result) {
                            console.log('Passwortüberprüfung erfolgreich');
                            resolve(user);  // Authentifizierung erfolgreich
                        } else {
                            console.log('Ungültiges Passwort');
                            reject(new Error('Ungültiges Passwort'));
                        }
                    });
                })
                .catch(error => {
                    console.error('Benutzer nicht gefunden:', error);
                    reject(new Error('Benutzer nicht gefunden'));
                });
        });
    };

    // Weitere Methoden ...
}


export default new UserService();
