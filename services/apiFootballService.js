'use strict';
// services/apiFootballService.js

import axios from 'axios';

const fetchFootballData = (endpoint) => {
    console.log('fetchFootballData', endpoint)
    const config = {
        method: 'get',
        url: `https://v3.football.api-sports.io/${endpoint}`,
        headers: {
            'x-rapidapi-key': process.env.API_FOOTBALL_KEY,
            'x-rapidapi-host': 'v3.football.api-sports.io'
        }
    };

    return axios(config)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
            return null;
        });
};

export default {
    fetchFootballData,
};
