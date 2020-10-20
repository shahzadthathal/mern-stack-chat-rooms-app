
const os = require('os');

let API_BASE_URL_PARAM = 'https://pwa-movies-listing.herokuapp.com';

if(os.hostname().indexOf("local") > -1)
	API_BASE_URL_PARAM = 'http://localhost:4000';

export const API_BASE_URL = API_BASE_URL_PARAM;
export const ACCESS_TOKEN_NAME = 'login_access_token';
export const THEMOVIEDB_API_URL = 'https://api.themoviedb.org';
export const THEMOVIEDB_API_KEY = '717e71c059310d1e0f6e21f35f0a08a9'