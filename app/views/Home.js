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
// import Icon from 'react-native-vector-icons/FontAwesome';
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
import COLOR from '../services/AppColor';

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
		// this.markerArr = ["Evon Technologies, IT Park, Dehradun", "MPS, IT park, dehradun", "Touchwood school, sahastradhara road, dehradun", "clock tower, dehradun", "ISBT, dehradun"]
		this.markerArr = [];
		
		this.state = {
			accessToken: '',
			pickDateValue: moment().format('YYYY-MM-DD'),
			pickTimeValue: '',
			datePickerMode: 'date',
			datePlaceHolder: 'select Date',
			timePlaceHolder: 'Select Time',
			format: 'YYYY-MM-DD',
			formatTime: 'HH:mm',
			loginMinTime: this.utilities.loginTime ? this.utilities.loginTime.split('-')[0] : 6,
			loginMaxTime: this.utilities.loginTime ? this.utilities.loginTime.split('-')[1] : 12,
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
			confirmAction: 'logout',
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
						<Item title="Profile" show="never" onPress={() => params.handleMenu('DriverProfileScreen')} />
						<Item title="Sign Out" show="never" onPress={() => params.logout()} />
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
		console.log('marker leng>>', this.markerArr.length)
		if(this.markerArr.length == 0){
			this.mapStore.locateMap(null, 'driver', null);
		}
		animationTimeout = setTimeout(() => {
			console.log('zoom marker arr>>>', this.markerArr)
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
					if(emp.type == type) {
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

	confirmBtnAlert = (action) => {
		console.log('action>>', action)
		this.hideAlert('confirm');
	}
	
    render() {
		console.disableYellowBox = true;
		let {pickDateValue, timePlaceHolder, formatTime, format,
			datePickerMode, datePlaceHolder, pickTimeValue, 
			loginMinTime, loginMaxTime, loginMin,
			showAlertError, showAlertLoader, errorText, alertTitle, showCancel, 
			showConfirm, checkInTabVisible, assignType, empList, confirmAction } = this.state;
            
        var startPoints = toJS(this.mapStore.driverMarkers) ? 
		toJS(this.mapStore.driverMarkers).map((item, index)=>{
		return <MapView.Marker 
				coordinate={item.coordinates} 
				key={index} 
				identifier={item.title}
				title = {item.title}
            />
        }) : <View></View>;
		
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
							loadingEnabled={true}
							// cacheEnabled={false}
						>
						{startPoints}
						</MapView>
					</View>
					
					<View style={styles.contentSection}>
						
						<View style={styles.filterSection}>
							<DateTime 
								date = {pickDateValue} 
								mode={datePickerMode} 
								changeDate = { (pickDateValue) => { this.filterByDate(pickDateValue) } } 
								placeholder = {datePlaceHolder}
								format = {format}
								inputStyle = {styles.dateinputStyle}
								futureDate = {1}
								style = {styles.dateStyle}
								iconStyle = {{left:5, height: 25, width: 25}}
								placeholderTextStyle = {{color: COLOR.CARD_TXT_COLOR}}
                            	dateTextStyle = {{color: COLOR.CARD_TXT_COLOR}}
							/>
							<DateTime 
								date = {pickTimeValue} 
								changeDate = { (pickTimeValue) => { this.filterByTime(pickTimeValue) }} 
								placeholder = {timePlaceHolder}
								format = {formatTime}
								inputStyle = {styles.timeinputStyle}
								iconStyle = {{left:5, height: 25, width: 25}}
								style = {styles.timeStyle}
								minDate = {loginMinTime}
								maxDate = {loginMaxTime}
								minuteInterval={loginMin}
								placeholderTextStyle = {{color: COLOR.CARD_TXT_COLOR}}
                            	dateTextStyle = {{color: COLOR.CARD_TXT_COLOR}}
							/>
							<View style={(platform == "ios") ? styles.iconOuterIOS: styles.iconOuter}>
								
								<TouchableOpacity onPress={() => this.removeTime()}>
									<Image style={styles.iconCancel} source={cancelTime} />
								</TouchableOpacity>
								
							</View>
							
							
							
						</View>
						<View style = {styles.checkInContainer}>
							<CheckInTab checkInTabVisible = {checkInTabVisible} tabSwitch = {this.tabSwitch}/>
						</View>
						
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
					cancelButtonColor="#1A3E50"
                    confirmButtonColor = "#FFFFFF"
                    contentContainerStyle = {{backgroundColor: COLOR.HEADER_BG_COLOR}}
                    cancelButtonTextStyle = {{color: '#fff', fontSize: 15}}
                    cancelButtonStyle = {{borderWidth: .5, borderColor: '#fff', width: wp('20%'), alignItems: 'center'}}
                    messageStyle = {{color: '#fff'}}
                    titleStyle = {{color: '#fff'}}
                    confirmButtonStyle = {{borderWidth: .5, borderColor: '#165155', width: wp('20%'), alignItems: 'center'}}
					confirmButtonTextStyle = {{color: '#165155', fontSize: 15}}
					onCancelPressed={() => {
						this.hideAlert('error');
                    }}
                    onConfirmPressed={(data) => { this.confirmBtnAlert(confirmAction)}}
					
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
		backgroundColor: COLOR.HEADER_BG_COLOR,
		// width: wp('97%'),
    },
	mapContainer: {
		marginTop: 10,
        width: wp('97%'),
		alignSelf: 'center',
		borderRadius: 10,
		height: hp('20%'),
		overflow: 'hidden',
		marginBottom: 5
	},
	map: {
		height: hp('20%'),
	},
    filterSection: {
        // flex:1,
        flexDirection:'row',
        
        backgroundColor: COLOR.HEADER_BG_COLOR,
        height: hp('5.3%')
    },
    dateinputStyle: {
        marginLeft:0, 
        backgroundColor: COLOR.TAB_BG_COLOR, 
        paddingRight:20, 
        borderWidth: 0, 
        borderTopLeftRadius: 10, 
	},
	timeinputStyle: {
		marginLeft:0, 
        backgroundColor: COLOR.TAB_BG_COLOR, 
		paddingRight:0, 
		paddingLeft: 10,
        borderWidth: 0, 
	},
    dateStyle:{ 
		flex:1,
        'width': wp('49%'), 
	},
	timeStyle:{ 
        'width': wp('40%'), 
        marginLeft:3, 
    },
    contentSection: {
		flex : 1,
		width: wp('97%'),
		alignSelf: 'center'
        // top: hp('20%'),
	}, 
	
	
	iconOuter: {
		backgroundColor: COLOR.TAB_BG_COLOR,
		// borderBottomWidth: 1, 
		// borderBottomColor: '#333',
		// height: hp('5.3%'),
		width: wp('9%'),
		padding:7,
		paddingTop:9,
		borderTopRightRadius: 10
	}, 
	iconOuterIOS: {
		backgroundColor: COLOR.TAB_BG_COLOR,
		height: hp('4.93%'),
		// height: hp('4.93%'),
		width: wp('9%'),
		padding:7,
        paddingTop:9,
        borderTopRightRadius: 10
	}, 
	
	iconCancel: {
		height: 22,
		width: wp('5.5%')
	},
	checkInContainer: {
		height: hp('5%'), 
		backgroundColor: COLOR.TAB_BG_COLOR,
		borderBottomLeftRadius: 10, 
		borderBottomRightRadius: 10,
		// marginTop: 5
	}
})
export default inject("rootStore")(observer(Home));