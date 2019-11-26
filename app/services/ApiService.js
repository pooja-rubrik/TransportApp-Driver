import axios from 'axios';
import { isAuthenticated, refreshTokens } from '@okta/okta-react-native';

import {base_url} from './API'

/**
 * Service to abstract api calls to one file - to be used in middleware
 */
class ApiService {

    constructor() {
        console.log('apiservice',base_url.API_URL)
        axios.defaults.baseURL = `${base_url.API_URL}`;
    }

    /**
     * Service function to avoid repetition of fetch everywhere
     * @param {string} url - url to fetch
     * @param {string} method - method get or post
     * @param {string|boolean} token  - authentication token
     * @param {object|null} params - params payload
     */
    apiCall = async ( url, method = 'GET', params = null, token ) => {
        console.log('call URL>>>', `${base_url.API_URL}${url}`, token);
        try {
            if(token){
                this.buildHeaders(token);
            }
            
            const res  = await axios({
                method: method,
                url: url,
                data: params
            })
            console.log(res)
            const status = res.status;
            const body = res.data;
            return { status, body };
        } catch(error) {
            console.log('error>>>', error)
            console.log( error.response)
            const status = error.response.status;
            const body = error.response.data;
            return { status, body };
        }
        
        
    }

    
    buildHeaders = ( token = false ) => {
        isAuthenticated().then( (auth) => {
            if( auth.authenticated ) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } else {
                refreshTokens().then( (token) => {
                    console.log('refreshed token', token)
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token.access_token}`;
                })
            }
        
        })
    }

    removeHeader = () => {
        axios.defaults.headers.common['Authorization'] = null;
    }
    
    /**
     * Throw common error on not successful status
     * @param {object} response 
     * @param {bool} auth - check for unauth error or not
     */
    handleCommonError = (response, auth = false) => {
        console.log('response>>', response)
        if(response.status === 401 && auth) {
            // StorageService.removeToken()
            //window.location(api.login)
        }
        if (response.status !== 200 && response.status !== 201 && response.status !== 404) {
            throw new Error(response.status)
        }
        return;
    }   


}

export default new ApiService();