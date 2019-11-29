import React, { Component } from "react";
import {
	ScrollView, StyleSheet,
	Platform, View, Image,
	TouchableOpacity
} from "react-native";
import { observer, inject } from "mobx-react";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import CardView from 'react-native-cardview';
// import { RaisedTextButton } from 'react-native-material-buttons';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
// import ModalDropdown from 'react-native-modal-dropdown';
import { toJS, action } from 'mobx';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

import STRCONSTANT from '../services/StringConstants';
import { PaperMenu2 } from '../components/HeaderDropdowniOS';
import { HeaderMenu, Item } from '../components/HeaderDropdownAndroid';
import { deviceType } from '../stylesheets/AppDimensions';
import DateTime from '../components/DateTimePicker';
import CheckInTab from '../components/CheckInTabs';
import StorageService from '../services/StorageService';
import { AppAlert } from '../components/Alert';
import DriverEmpList from '../components/DriverEmpList';
import cancelTime from '../assets/icons/cancel.png'

const platform = Platform.OS;
const timeout = 2000;
let animationTimeout;

class Home extends Component {
    constructor(props) {
		super(props);
		this.usersStore =  this.props.rootStore.usersStore;
		this.utilities  = this.usersStore.utilities;
		this.driverStore = this.props.rootStore.driverStore;
		this.vehicleNo = this.driverStore.driverData.vehicleNumber
		this.mapStore = this.props.rootStore.mapStore;
		this.mapRef = null;
		// console.log(toJS(this.usersStore.users.filterEmployees));
		// this.assignType = this.props.navigation.getParam('assignType', 'LOGIN')
		// this.markerArr = ["Evon Technologies, IT Park, Dehradun", "MPS, IT park, dehradun", "Touchwood school, sahastradhara road, dehradun", "clock tower, dehradun", "ISBT, dehradun"]
		this.markerArr = [];
		// this.usersStore.users.filterEmployees.forEach(emp => {
		// 	if(emp.type == this.assignType) {
		// 		console.log('found>>')
		// 		this.markerArr.push(emp.empHomeAddress)
		// 	}
			
		// })
		// console.log(this.markerArr);
		this.state = {
			accessToken: '',
			pickDateValue: moment().format('YYYY-MM-DD'),
			// pickDateValue: '',
			dropTimeValue: '',
			pickTimeValue: '',
			// dropDateValue: '',
			// dropDateValue: moment().format('YYYY-MM-DD'),
			datePickerMode: 'date',
			datePlaceHolder: 'select Date',
			timePlaceHolder: 'Select Time',
			format: 'YYYY-MM-DD',
			formatTime: 'HH:mm',
			loginMinTime: this.utilities.loginTime.split('-')[0],
			loginMaxTime: this.utilities.loginTime.split('-')[1],
			// logoutMinTime: this.utilities.logoutTime.split('-')[0],
			// logoutMaxTime: this.utilities.logoutTime.split('-')[1],
			loginMin: 30,
			showAlertError: false,
			showAlertLoader: false,
			errorText: '',
			alertTitle: 'Oops!',
			showConfirm: false,
            showCancel: true,
			checkInTabVisible: true,
			assignType: 'LOGIN',
			empList: [],
			empOTP: '',
			confirmAction: 'logout'
		};
    }

    static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		if (platform == 'ios' && deviceType == 'ipad') {
			return {
				header: <PaperMenu2 onPressProfile={() => params.handleMenu()} navigation={navigation} />,
				headerLeft: null,
				title: 'Driver Home'
			};
		} else {
			return {
				headerRight: (
					<HeaderMenu>
						<Item title="PROFILE" show="never" onPress={() => params.handleMenu('DriverProfileScreen')} />
						<Item title="SIGNOUT" show="never" onPress={() => params.logout()} />
					</HeaderMenu>
				),
				
			};
		}

    };


    componentDidMount() {
        this.props.navigation.setParams({
			handleMenu: this.navigateMenu,
			logout: this.logoutProfile
        });
        
        this.callHomeData();
		
		// console.log(toJS(this.usersStore.users))
    }

    componentWillUnmount() {
        if (animationTimeout) {
          clearTimeout(animationTimeout);
        }
	}

	callHomeData = () => {
		this.empPageAction('LOGIN', this.state.pickDateValue );
	}

	getMarkerLatLong() {
		Geocoder.init(this.mapStore.mapData.currentAPIKey);
        this.markerArr.map(address => {
            //console.log(address)
            Geocoder.from(address)
			.then(json => {
				var location = json.results[0].geometry.location;
				console.log('location>>>', json,location)
				//console.log(location);
                this.mapStore.locateMap(location, 'driver', address);
                // console.log(toJS(this.mapStore.driverMarkers))
                
			})
			.catch(error => console.warn(error));
		})
		animationTimeout = setTimeout(() => {
			this.mapRef.fitToSuppliedMarkers(
				this.markerArr,
				{ 
					edgePadding: {
						top: 50,
						right: 50,
						bottom: 50,
						left: 50
					}
				}
			)
            // this.mapRef.fitToSuppliedMarkers(
            //     this.markerArr,
            //     true, // not animated
            // );
		}, timeout);
	}
	
	empPageAction = (type, changeDate = '', changeTime = '') => {
		empParam = changeTime != '' ? {vehicleNo: this.vehicleNo, tripDate: changeDate, tripTime:  `${changeTime}:00`} :
										{vehicleNo: this.vehicleNo, tripDate: changeDate, tripTime: ''};
		
		this.markerArr = [];
		;(async () => {
			await this.driverStore.getDriverEmp(empParam);
			if(this.driverStore.driverData.empList.length > 0) {
				await this.driverStore.getEmpIDs();
				console.log(toJS(this.driverStore.driverData.empIds))
				await this.usersStore.filterEmployee(this.driverStore.driverData.empIds);
				this.setState({
					assignType: type, 
					empList: this.usersStore.users.filterEmployees,
					
				})
				
				console.log(toJS(this.usersStore.users.filterEmployees))
				this.usersStore.users.filterEmployees.forEach(emp => {
					if(emp.type == this.state.assignType) {
						console.log('found>>', emp.empHomeAddress)
						this.markerArr.push(emp.empHomeAddress)
					}
					
				})
				console.log(this.markerArr);
				this.getMarkerLatLong();
				
			} else {
				this.setState({
					assignType: type, 
					empList: [],
					
				})
				// Alert.alert('No employee assigned.')
			}
			
		})();
		
	}

    navigateMenu = (pageName) => {
		this.props.navigation.navigate(pageName, {callHomeData: this.callHomeData});
	}

	logoutProfile = () => {
		this.setState({confirmAction: 'logout'})
		this.showAlert('confirm');
	}

	showAlert = (type) => {
		if (type == 'error') {
			this.setState({
				showAlertError: true
			});
		} else if(type == 'confirm') {
			this.setState({
				showAlertError: true,
				showConfirm: true,
				errorText: 'Do you want to logout?', 
				alertTitle: 'Confirm!'
			});
			
	 	} else {
			this.setState({
				showAlertLoader: true
			});
		}

	};

	hideAlert = (type) => {
		if (type == 'error') {
			this.setState({
				showAlertError: false
			});
        } else if(type == 'confirm') { 
            this.setState({
				showAlertError: false
			});
			//logic of logout
			if(this.state.confirmAction == 'logout') {
				StorageService.removeData('driver_data').then(data => {
					this.props.navigation.navigate('LoginScreen');
				})
			} 
            
        } else {
			this.setState({
				showAlertLoader: false
			});
		}
    };
    
    tabSwitch = (tab) => {
		this.setState({
			checkInTabVisible: (tab=='checkin') ? true : false,
			loginMinTime: (tab=='checkin') ? this.utilities.loginTime.split('-')[0] : this.utilities.logoutTime.split('-')[0],
			loginMaxTime: (tab=='checkin') ? this.utilities.loginTime.split('-')[1] : this.utilities.logoutTime.split('-')[1]
		})
		if(tab == 'checkin'){
			this.empPageAction('LOGIN', this.state.pickDateValue, this.state.pickTimeValue);
		} else {
			this.empPageAction('LOGOUT', this.state.pickDateValue, this.state.pickTimeValue);
		}
	}
	
	filterByDate = (selectDate) => {
		this.setState({pickDateValue: selectDate});
		this.empPageAction(this.state.assignType, selectDate, this.state.pickTimeValue);
	}

	filterByTime = (selectTime) => {
		if(this.state.selectDate != '') {
			this.setState({pickTimeValue: selectTime});
			this.empPageAction(this.state.assignType, this.state.pickDateValue, selectTime);
		}
	}

	tripAction = (action, empID, otp = 0) => {
		console.log('parent>>>',action, empID);
		let param = (action == STRCONSTANT.DRIVER_START_TRIP) ? {empId: empID, type: this.state.assignType, vehicleNumber: this.vehicleNo}:
										{empId: empID, type: this.state.assignType, vehicleNumber: this.vehicleNo, otp: otp }

		this.driverStore.empTripAction(action, param).then(() => {
			console.log(this.driverStore.driverData.empTripStatus);
			if(this.driverStore.driverData.empTripStatus.code == 200 ) {
				// this.setState({})
				
				if(action == STRCONSTANT.DRIVER_END_TRIP) {
					this.setState({ 
						errorText: 'Employee trip has been ended.', 
						alertTitle: 'Success!', 
						showCancel: false, 
						showConfirm: true,
						confirmAction: 'end_trip'
					})
					this.showAlert('error')
					this.setState({
						empList: [],
					})
					this.empPageAction(this.state.assignType, this.state.pickDateValue, this.state.pickTimeValue);
				}
				
				
			} else {
				this.setState({
					empList: [],
				})
				this.empPageAction(this.state.assignType, this.state.pickDateValue, this.state.pickTimeValue);
				if(this.driverStore.driverData.empTripStatus.message) {
					this.setState({ errorText: this.driverStore.driverData.empTripStatus.message})
					this.showAlert('error')
				} else {
					this.setState({ errorText: 'Something went wrong!'})
					this.showAlert('error')
				}
				
				
			}
			// 
		})
	}

	removeTime = () => {
		this.setState({pickTimeValue: ''})
		this.empPageAction(this.state.assignType, this.state.pickDateValue, '');
	}

	confirmBtnAlert = () => {
		console.log('data>>', data)
		this.hideAlert('confirm');
	}
	
    render() {
		// return (
		// 	<View/>
		// );
		console.disableYellowBox = true;
		// const myIcon = <Icon name="remove" size={14} color="#fff" raised onPress={() => this.removeTime()}/>;
        let {pickDateValue, timePlaceHolder, formatTime, format,
			datePickerMode, datePlaceHolder, pickTimeValue, 
			loginMinTime, loginMaxTime, loginMin,
			showAlertError, showAlertLoader, errorText, alertTitle, showCancel, 
			showConfirm, checkInTabVisible, assignType, empList, confirmAction } = this.state;
            
        var startPoints = toJS(this.mapStore.driverMarkers) ? 
		toJS(this.mapStore.driverMarkers).map((item, index)=>{
        return <MapView.Marker coordinate={item.coordinates} key={index} identifier={item.title}
                title = {item.title}
            />
        }) : null;
       
        return (
            <View style={styles.mainContainer}>
				{/* <CheckInTab checkInTabVisible = {checkInTabVisible} tabSwitch = {this.tabSwitch}/> */}
				<ScrollView>
				<View style={styles.mapContainer}>
						<MapView
							provider={PROVIDER_GOOGLE}
							style={styles.map}
							showsUserLocation={true}
							showsMyLocationButton={true}
							scrollEnabled={true}
							followsUserLocation={true}
							zoomEnabled={true}
							pitchEnabled={true}
							rotateEnabled={true}
							ref={(ref) => { this.mapRef = ref }}
							region={toJS(this.mapStore.mapData.region)}
							
						>
						{startPoints}
						</MapView>
					</View>
					
					<View style={styles.contentSection}>
						
						<View style={styles.filterSection}>
							<DateTime 
								date = {pickDateValue} 
								mode={datePickerMode} 
								// changeDate = {(pickDateValue) => {this.setState({pickDateValue: pickDateValue})}} 
								changeDate = { (pickDateValue) => { this.filterByDate(pickDateValue) } } 
								placeholder = {datePlaceHolder}
								format = {format}
								// inputStyle = {styles.dateinputStyle}
								futureDate = {1}
								style = {styles.dateStyle}
								iconStyle = {{left:5, height: 25, width: 25}}

							/>
							<DateTime 
								date = {pickTimeValue} 
								// changeDate = {(pickTimeValue) => {this.setState({pickTimeValue: pickTimeValue})}} 
								changeDate = { (pickTimeValue) => { this.filterByTime(pickTimeValue) }} 
								placeholder = {timePlaceHolder}
								format = {formatTime}
								inputStyle = {styles.timeinputStyle}
								iconStyle = {{left:5, height: 25, width: 25}}
								style = {styles.timeStyle}
								minDate = {loginMinTime}
								maxDate = {loginMaxTime}
								minuteInterval={loginMin}
							/>
							<View style={styles.iconOuter}>
								
								<TouchableOpacity onPress={() => this.removeTime()}>
									<Image style={styles.iconCancel} source={cancelTime} />
								</TouchableOpacity>
								
							</View>
							
							
							
						</View>
						<CheckInTab checkInTabVisible = {checkInTabVisible} tabSwitch = {this.tabSwitch}/>
						<DriverEmpList empData = {empList} assignType = {assignType} tripAction = {this.tripAction}/>
					</View>
					
				</ScrollView>
				
                <AppAlert
					show={showAlertError}
					showProgress={false}
					title={alertTitle}
					message={errorText}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={true}
                    showCancelButton={showCancel}
                    showConfirmButton={showConfirm}
                    cancelText="Cancel"
                    confirmText="Okay"
					cancelButtonColor="red"
					confirmButtonColor = "#59997E"
					onCancelPressed={() => {
						this.hideAlert('error');
                    }}
                    onConfirmPressed={(data) => { this.confirmBtnAlert(confirmAction)}}
					contentContainerStyle = {{backgroundColor: '#317770'}}
					messageStyle = {{color: '#fff'}}
					titleStyle = {{color: '#fff'}}
				/>
				<AppAlert
					show={showAlertLoader}
					showProgress={true}
					title="Loading.."
					closeOnTouchOutside={false}
					closeOnHardwareBackPress={false}
				/> 
            </View>
        )
    }
}
const styles = StyleSheet.create({
    mainContainer: {
        flex:1,
        // flexDirection: 'row'
    },
	mapContainer: {
		// ...StyleSheet.absoluteFillObject,
        // justifyContent: 'flex-end',
        width: wp('100%'),
		alignSelf: 'center',
	},
	map: {
		height: hp('20%'),
		// top: 10
        // marginBottom: 10
        // ...StyleSheet.absoluteFillObject,
    },
    filterSection: {
        // flex:1,
        flexDirection:'row',
        
        backgroundColor:'#d2d2d2',
        height: hp('5.3%')
    },
    dateinputStyle: {
        marginLeft:0, 
        backgroundColor: '#fff', 
        paddingRight:20, 
        borderWidth: 0, 
        borderBottomWidth: 1, 
        borderBottomColor: '#333',
        borderRightWidth:1, 
        borderRightColor: '#333' 
	},
	timeinputStyle: {
		marginLeft:0, 
        backgroundColor: '#fff', 
		paddingRight:0, 
		paddingLeft: 10,
        borderWidth: 0, 
        borderBottomWidth: 1, 
        borderBottomColor: '#333',
        // borderRightWidth:1, 
        // borderRightColor: '#333' 
	},
	datePadding: {
		paddingRight:0
	},
    dateStyle:{ 
		// justifyContent : 'space-around',
		// alignContent : 'space-around',
		flex:1,
        // 'width': wp('49%'), 
		// marginLeft:3, 
		height: "100%",
		margin : 0,
		padding:0,
		backgroundColor:"green"

	},
	timeStyle:{ 
        'width': wp('40%'), 
        marginLeft:3, 
    },
    contentSection: {
		flex : 1
        // top: hp('20%'),
	}, 
	
	iconView: {
		backgroundColor: '#F10005',
		width: wp('6.5%'),
		height: 24,
		alignItems: 'center',
		// paddingTop: 5,
		borderWidth: 1,
		borderColor: '#F10005',
		borderRadius: 18,
		padding:3.5,
		paddingLeft: 4,
		paddingRight:4,
		marginTop:9,
		marginLeft:3
	},
	iconOuter: {
		backgroundColor: '#fff',
		borderBottomWidth: 1, 
		borderBottomColor: '#333',
		height: hp('5%'),
		width: wp('9%'),
		padding:7,
		paddingTop:9
	}, 
	iconCancel: {
		height: 22,
		width: wp('5.5%')
	}
})
export default inject("rootStore")(observer(Home));