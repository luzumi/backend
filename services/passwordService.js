// passwordService.js
'use strict';

import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) reject(err);
            else resolve(hash);
        });
    });
};
