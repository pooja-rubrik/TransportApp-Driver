import {observable, action, runInAction, toJS} from 'mobx';
import UsersService from '../services/UsersService';
import StorageService from '../services/StorageService';
import EmpService from '../services/EmpService';

import moment from 'moment';

class ObservableUsersStore {
	@observable isLoading = false
	@observable isFailure = false
    @observable users = {}
    @observable utilities = {}
    
	constructor(rootStore){
        this.rootStore = rootStore;
        this.users.oktaDetail = {};
        StorageService.retrieveData('okta_data').then( data => {
            this.users.oktaDetail = data ? JSON.parse(data) : {}; 
        });
        StorageService.retrieveData('emp_data').then( data => {
            this.users.empDetail = data ? JSON.parse(data) : {}; 
        });
        StorageService.retrieveData('utilities').then( data => {
            this.utilities = data ? JSON.parse(data) : {}; 
        });
	}  

    @action async addOktaDetail(user) {
        this.users.oktaDetail = user;
    }

    @action async getAllEmployee() { 
        try {
            this.isLoading = true;
            data = await UsersService.getAllEmployee()
            runInAction( () => {
                this.users.allemps = data;
            } )
        } catch (e) {
            console.log('error all emps', e)
            runInAction(() => {
                this.isLoading = false;
            } )
        }
    }

	@action async registerUser(loginName, regData) { 
        try {
            if(this.users.oktaDetail){
                console.log(this.users.oktaDetail);
                this.isLoading = true;
                let regParam = ( loginName == "Employee Login" ) ? 
                    { empID: this.users.oktaDetail.empid, empHomeAddress:regData.homeAddress, empName: this.users.oktaDetail.name, empPhoneNumber: regData.contact, empEmail:this.users.oktaDetail.preferred_username  }
                    : { admID: this.users.oktaDetail.empid, admPhoneNumber:regData.contact, admName: this.users.oktaDetail.name  }
                data = await UsersService.registerUser( regParam, loginName, this.users.oktaDetail.accessToken )
                runInAction( () => {
                    this.isLoading = false;
                    console.log('is register>>', data)
                    this.users.empDetail = data;
                    // StorageService.storeData('okta_data', toJS(this.users.oktaDetail));
                    this.getEmployee(loginName);
                    // StorageService.storeData('emp_data', toJS(this.users.empDetail));
                } )
            }
        } catch (e) {
            console.log('error reg', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }
    
    @action async getEmployee(loginName) { 
        try {
            if(this.users.oktaDetail){
                this.isLoading = true; 
                data = await UsersService.loginUser(this.users.oktaDetail.empid, loginName, this.users.oktaDetail.accessToken)
                // data = await UsersService.loginUser(10225, loginName, this.users.oktaDetail.accessToken)
                runInAction(() => {
                    this.isLoading = false;
                    this.users.empDetail = data;
                    console.log('login>>', data)
                    StorageService.storeData('okta_data', toJS(this.users.oktaDetail));
                    StorageService.storeData('emp_data', toJS(this.users.empDetail));
                })
            }
        } catch (e) {
            console.log('error login', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async getUtility() { 
        try {
            
            this.isLoading = true;
            data = await EmpService.getEmpConstant()
            runInAction(() => {
                this.isLoading = false;
                this.utilities = data;
                console.log('utilities>>', data)
                StorageService.storeData('utilities', toJS(this.utilities));
            })
            
        } catch (e) {
            console.log('error login', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async registerDriver(regData) { 
        try {
        
            this.isLoading = true;
            let regParam = { driverAddress: regData.address, driverName:regData.firstName, driverPhone: regData.phoneNo, licenseNumber: regData.license, vehicleNumber: regData.vehicleNo  }
            data = await UsersService.registerDriver( regParam )
            runInAction( () => {
                this.isLoading = false;
                console.log('driver register>>', data)
                this.users.driverDetail = data;
                
            } )
        } catch (e) {
            console.log('error reg', e)
            runInAction(() => {
                this.isLoading = false;
            })
        }
    }

    @action async filterEmployee(empIDs) { 
        this.users.filterEmployees = [], empTempArr = [];
        // console.log('ids array>>', toJS(empIDs))
        empIDs.forEach(empid => {
            let employee = this.users.allemps.filter(emp => { return (emp.empID == empid.empId) });
            console.log('single>>',toJS(empid),toJS(employee[0]) );
            let empTemp = {};
            empTemp.tripTime = empid.tripTime? moment(empid.tripTime, 'HH:mm:ss').format('HH:mm') : '';
            empTemp.pickupTime = empid.pickupTime? moment(empid.pickupTime, 'HH:mm:ss').format('HH:mm') : ''
            empTemp.type = empid.type;
            empTemp.empBookStatus = empid.empBookStatus;
            empTemp.empName = employee[0].empName;
            empTemp.empPhoneNumber = employee[0].empPhoneNumber
            empTemp.empHomeAddress = employee[0].empHomeAddress;
            empTemp.empID = employee[0].empID;
            // empTemp.pickupTime = empid.pickupTime;
            empTempArr.push(empTemp)
            
            // console.log('emps>>>>', toJS(this.users.filterEmployees))
        })
        this.users.filterEmployees = empTempArr;
        
    }

    // @action async filterEmployeeForAssign(empIDs) {
    //     this.users.filterEmployees = [];
    //     empIDs.forEach(empid => {
    //         let employee = this.users.allemps.filter(emp => { return (emp.empID == empid.empid) });
            
    //         employee[0].status = empid.status;
    //         employee[0].tripTime = empid.loginTime ? empid.loginTime : empid.logoutTime;
    //         // console.log('single>>',toJS(empid),toJS(employee[0]) );
    //         this.users.filterEmployees = this.users.filterEmployees.concat(employee)
    //     })
    // }

    // @action async filterEmployeeForLogin(empIDs) {
    //     this.users.filterEmployees = [], empTempArr = [];
    //     // console.log(toJS(this.users.allemps))
    //     this.users.allemps.forEach(empid => {
    //         let employee = empIDs.filter(emp => { return (empid.empID == emp.empid) });
    //         // console.log(employee, toJS(empid))
    //         let empTemp = {};
    //         if (employee.length > 0 && !employee[0].empDetail){
    //             empTemp.empDetail = {
    //                 empID: empid.empID,
    //                 empName: empid.empName,
    //                 empPhoneNumber: empid.empPhoneNumber,
    //                 empHomeAddress: empid.empHomeAddress
    //             }
    //             empTemp.login = {
    //                 loginTime: employee[0].loginTime,
    //                 vehicleNo: employee[0].vehicleNumber,
    //                 status: employee[0].status
    //             }
    //             empTempArr.push(empTemp)
    //         }
            
            
    //     })
    //     this.users.filterEmployees = empTempArr
    // }

    // @action async filterEmployeeForLogout(empIDs) {
    //     this.users.filterEmployees.forEach(empid => {
    //         let employee = empIDs.filter(emp => { return (empid.empDetail.empID == emp.empid) });
    //         if(employee.length > 0) {
    //             empid.logout = {
    //                 logoutTime: employee[0].logoutTime,
    //                 vehicleNo: employee[0].vehicleNumber,
    //                 status: employee[0].status
    //             }
    //         }
           
    //     })
        
    // }
}

export default ObservableUsersStore
                        