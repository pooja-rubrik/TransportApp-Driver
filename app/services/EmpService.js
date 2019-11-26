import ApiService from './ApiService';
import api from './API';
class EmpService {
    constructor(){ }
    getEmpConstant = async () => { //get all emp constants
        apiURL = api.utility;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }

    empTimeSubmit = async (params, changeType) => { //emp Pick submit and cancel
        apiURL = (changeType == 'pick') ? api.pick_submit: api.drop_submit;
        const res = await ApiService.apiCall(apiURL, 'POST', params);
        ApiService.handleCommonError(res);
        return res.body;
    }

    getDailyLogin = async (empid) => { //get daily login data of an employee
        apiURL = `${api.daily_login}/${empid}`;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }

    getDailyLogout = async (empid) => { //get daily logout data of an employee
        apiURL = `${api.daily_logout}/${empid}`;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }

    getDefaultLogin = async (empid) => { //get default login data
        apiURL = `${api.default_login}/${empid}`;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }

    getDefaultLogout = async (empid) => { //get default logout data
        apiURL = `${api.default_logout}/${empid}`;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }


    updateRoster = async (empid, updateType, params) => { //get default login data
        apiURL = (updateType == 'pick') ? `${api.reschedule_roster_pick}/${empid}`: `${api.reschedule_roster_drop}/${empid}`;
        const res = await ApiService.apiCall(apiURL, 'POST', params);
        ApiService.handleCommonError(res);
        return res.body;
    }
    
    cancelRoster = async (empid, updateType, params) => { //get default login data
        console.log('cancel params>>', params);
        apiURL = (updateType == 'pick') ? `${api.cancel_roster_pick}/${empid}`: `${api.cancel_roster_drop}/${empid}`;
        const res = await ApiService.apiCall(apiURL, 'POST', params);
        ApiService.handleCommonError(res);
        return res.body;
    }

    setDefaultTime  = async (loginParam, logoutParam) => { //get default login data
        apiURLPick = `${api.default_login}`;
        apiURLDrop = `${api.default_logout}`;
        const resPick = await ApiService.apiCall(apiURLPick, 'POST', loginParam);
        ApiService.handleCommonError(resPick);
        const resDrop = await ApiService.apiCall(apiURLDrop, 'POST', logoutParam);
        ApiService.handleCommonError(resDrop);
        return {...resPick.body, ...resDrop.body};
    }

}

export default new EmpService();