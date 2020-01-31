import { observable, action, runInAction, toJS } from 'mobx';
import DriverService from '../services/DriverService';
import StorageService from '../services/StorageService';

class DriverStore {
    @observable isLoading = false
    @observable isFailure = false
    @observable driverData = {}

    constructor() {
        StorageService.retrieveData('driver_data').then( data => {
            this.driverData = data ? JSON.parse(data) : {}; 
        });
    }

    @action async driverLoginWithOTP(vehicleNo, otp) {
        try {
            this.isLoading = true;
            // console.log('vehicleNo>>', vehicleNo, otp);
            this.driverData = {}
            data = await DriverService.driverLoginWithOTP(vehicleNo, otp)
            runInAction(() => {
                this.isLoading = false;
                // console.log('is driver login>>', data)
                this.driverData = data;
                StorageService.storeData('driver_data', toJS(this.driverData));
            })

        } catch (e) {
            console.log('error driver data', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async driverLoginSendOTP(vehicleNo) {
        try {
            this.isLoading = true;
            // console.log('vehicleNo>>', vehicleNo);
            data = await DriverService.driverLoginSendOTP(vehicleNo, 'login')
            runInAction(() => {
                this.isLoading = false;
                console.log('is driver otp sent>>', data)
                this.driverData.otpStatus = data;
            })

        } catch (e) {
            // console.log('error driver data', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async setDriverData(vehicleNo) {
        try {
            this.isLoading = true;
            // console.log('vehicleNo>>', vehicleNo);
            data = await DriverService.getDriverDataByVehicleNo(vehicleNo)
            runInAction(() => {
                this.isLoading = false;
                // console.log('is driver data>>', data)
                this.driverData = data;
                StorageService.storeData('driver_data', toJS(this.driverData));
            })

        } catch (e) {
            console.log('error driver data', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async getDriverEmp(empParam) {
        try {
            this.isLoading = true;
            // console.log('empParam>>', empParam);
            data = await DriverService.getDriverEmpListByDate(empParam)
            runInAction(() => {
                this.isLoading = false;
                // console.log('driver emp data>>', JSON.stringify(data))
                this.driverData.empList = data;
                // this.driverData.empList = [
                //     {
                //         "licenseNumber": null,
                //         "vehicleNumber": "vehicle-1",
                //         "driver_id": "vehicle-1_12:00:00_2019-10-31",
                //         "driverDetails": {
                //             "driverName": "demo1",
                //             "driverPhone": "9898989898",
                //             "vehicleNumber": "vehicle-1",
                //             "licenseNumber": "lc1",
                //             "driverAddress": "Addr1",
                //             "code": 200
                //         },
                //         "countOfEmployees": 1,
                //         "empID": "102006",
                //         "tripTime": "12:00:00",
                //         "tripDay": "2019-10-31",
                //         "code": 200,
                //         "status": "AVAILABLE",
                //         "type": "LOGOUT",
                //         "empBookStatus": false
                //     },
                //     {
                //         "licenseNumber": null,
                //         "vehicleNumber": "vehicle-1",
                //         "driver_id": "vehicle-1_12:00:00_2019-10-31",
                //         "driverDetails": {
                //             "driverName": "demo1",
                //             "driverPhone": "9898989898",
                //             "vehicleNumber": "vehicle-1",
                //             "licenseNumber": "lc1",
                //             "driverAddress": "Addr1",
                //             "code": 200
                //         },
                //         "countOfEmployees": 1,
                //         "empID": "102565",
                //         "tripTime": "10:00:00",
                //         "tripDay": "2019-10-31",
                //         "code": 200,
                //         "status": "AVAILABLE",
                //         "type": "LOGIN",
                //         "empBookStatus": false
                //     }
                // ]
            })

        } catch (e) {
            console.log('error driver data', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async getEmpIDs() {
        this.driverData.empIds = [];
        this.driverData.empList.forEach(emp => {
            if (emp.empID.split(',').length > 1) {
                emp.empID.split(',').forEach(empid => {
                    this.driverData.empIds = this.driverData.empIds.concat({empId: empid, tripTime: emp.tripTime, type: emp.type, empBookStatus: emp.tripStatus, pickupTime: emp.pickupTime});
                })
                
            } else {
                this.driverData.empIds.push({empId: emp.empID, tripTime: emp.tripTime, type: emp.type, empBookStatus: emp.tripStatus, pickupTime: emp.pickupTime});
            }
        });
    }

    @action async empTripAction(action, param) {
        try {
            this.isLoading = true;
            // console.log('action>>', action);
            this.driverData.empTripStatus = {};
            data = await DriverService.empTripAction(action, param)
            runInAction(() => {
                this.isLoading = false;
                // console.log('is employee otp sent>>', data)
                this.driverData.empTripStatus = data;
            })

        } catch (e) {
            console.log('error driver data', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }
}

export default DriverStore
