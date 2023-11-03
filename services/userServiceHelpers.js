// userServiceHelpers.js
'use strict';

export const initializeUser = (user, hashedPassword) => {
    user.password = hashedPassword;
    user.ownImages = [];
    user.favoriteTeams = [];
    user.visitedGames = [];
    return user;
};
