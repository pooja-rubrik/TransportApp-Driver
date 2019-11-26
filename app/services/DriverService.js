import ApiService from './ApiService';
import api from './API';
import STRCONSTANT from '../services/StringConstants';

class DriverService {

    constructor(){ }

    getDriverDataByVehicleNo = async (vehicleNo) => { //get all emp constants
        apiURL = `${api.get_driver}/${vehicleNo}`;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }

    getDriverEmpListByDate = async (empData) => { //get all emp list assigned to driver
        apiURL = `${api.driver_emp_list}/${empData.vehicleNo}/${empData.tripDate}/${empData.tripTime}`;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }

    driverLoginWithOTP = async (vehicleNo, otp) => { //driver login with otp 
        apiURL = `${api.driver_login_otp}/${vehicleNo}/${otp}`;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }

    driverLoginSendOTP = async (vehicleNo) => { //send otp in driver's phone
        apiURL = `${api.driver_login_send_otp}/${vehicleNo}`;
        const res = await ApiService.apiCall(apiURL, 'GET');
        ApiService.handleCommonError(res);
        return res.body;
    }

    empTripAction = async (action, param) => { //send otp in driver's phone
        console.log('param>>', param)
        apiURL = (action == STRCONSTANT.DRIVER_START_TRIP) ? `${api.driver_start_trip}`: `${api.driver_end_trip}`;
        const res = await ApiService.apiCall(apiURL, 'POST', param);
        ApiService.handleCommonError(res);
        return res.body;
    }
}

export default new DriverService();