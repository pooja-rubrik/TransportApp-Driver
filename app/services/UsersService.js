import ApiService from './ApiService';
import api from './API';
class UsersService {
    constructor(){
       
    }
    registerUser = async (user_from_okta, loginName, accessToken) => { //register user
        console.log('users param>>>',user_from_okta)
        apiURL = (loginName == "Employee Login") ? api.employee : api.register_admin;
        const res = await ApiService.apiCall(apiURL, 'POST', user_from_okta, accessToken);
        ApiService.handleCommonError(res);
        return res.body;
    }

    loginUser = async (empid, loginName, accessToken) => {
        // console.log('userservice>>', empid, `${api.employee}/${empid}`)
        apiURL = (loginName == "Employee Login") ? `${api.employee}/${empid}` : `${api.register_admin}/${empid}`;
        const res = await ApiService.apiCall(apiURL, 'GET', null, accessToken);
        ApiService.handleCommonError(res);
        console.log('res loginUser>>>>', res)
        return res.body;
    }

    registerDriver = async (driverParam) => {
        console.log('param>>', driverParam)
        apiURL = api.get_driver;
        const res = await ApiService.apiCall(apiURL, 'POST', driverParam);
        ApiService.handleCommonError(res);
        console.log('res registerDriver>>>>', res)
        return res.body;
    }

    getAllEmployee = async () => {
        apiURL = api.employee;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        console.log('res all employees>>>>', res)
        return res.body;
    }
    
}

export default new UsersService();