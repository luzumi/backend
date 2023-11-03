'use strict';
// routes/seasons/seasonService.js

import dbService from "../../services/db/dbService.js";
import apiFootballService from "../../services/apiFootballService.js";

// const isValidJSON = (obj) => {
//     try {
//         JSON.parse(JSON.stringify(obj));
//         return true;
//     } catch (e) {
//         return false;
//     }
// };
// const fetchAndStoreSeasons = () => {
//     apiFootballService.fetchFootballData("leagues/seasons")
//         .then(data => {
//             console.log("Data from API:", data);
//             if (data) {
//                 let seasonsArray = data.response;
//                 if(!isValidJSON(data)) {
//                     seasonsArray = data.response.map(season => {
//                         return {season: season};
//                     });
//                 }
//                 // Speichere die transformierten Daten in der Datenbank
//                 return dbService.insertData('seasons', seasonsArray);
//             }
//
//         })
//         .catch(err => {
//             console.log(err);
//         });
// };

// export default fetchAndStoreSeasons;

