import axios from 'axios';
// import { isAuthenticated, refreshTokens } from '@okta/okta-react-native';
import api from './API';
import StorageService from '../services/StorageService';
import Constants from '../services/Constants';
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
     * @param {string|boolean} apiAction  - authentication apiAction for get token
     * @param {object|null} params - params payload
     */
    apiCall = async ( url, method = 'GET', params = null, apiAction ) => {
        console.log('call URL>>>', `${base_url.API_URL}${url}`, apiAction);
        try {
            if(apiAction == 'login'){
                await this.buildHeaders();
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
            if(error.response.data.error == 'invalid_token') {
                (async () => {
                    await this.buildHeaders();
                    console.log('second call>>>')
                    await this.apiCall(url, method, params )
                })();
                   
            } else {
                const status = error.response.status;
                const body = error.response.data;
                return { status, body };
            }
        }
        
        
    }

    
    buildHeaders = async (  ) => {
        // console.log(token)
        return new Promise((resolve, reject) => {
            this.getTokenFromAPI().then( (data) => {
                console.log('get token res>>>', data.body.access_token)
                if(data.status == 200 && data.body.access_token) {
                    StorageService.storeData('oAuthHeader', data.body.access_token);
                    this.addHeader(data.body.access_token)
                    console.log('header add check>>');
                    resolve(true);
                }
            }, error => {
                reject(false);
                console.log('error getting token');
            });
            
        })
       
    }

    getTokenFromAPI = async () => {
        tokenAPIURL = `${api.token_generate_url}`;
        param = Constants.AUTH;
                // oktaToken
        console.log( 'token url>>>>>>>>', tokenAPIURL );
        try {
            const res  = await axios({
                method: 'POST',
                url: tokenAPIURL,
                data: param
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

    addHeader = async ( token ) => {
        console.log('add header>>', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // axios.defaults.headers.common['oktaToken'] = oktaToken;
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