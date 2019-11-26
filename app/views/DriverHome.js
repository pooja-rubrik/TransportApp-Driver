import React, { Component } from "react";
import {
	Text, StyleSheet,
	Platform, View, Alert
} from "react-native";
import { observer, inject } from "mobx-react";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview';
import { RaisedTextButton } from 'react-native-material-buttons';
import moment from 'moment';
// import ModalDropdown from 'react-native-modal-dropdown';
import { toJS } from 'mobx';

import { PaperMenu2 } from '../components/HeaderDropdowniOS';
import { HeaderMenu, Item } from '../components/HeaderDropdownAndroid';
import Wallpapers from "../components/Wallpaper";
import { deviceType } from '../stylesheets/AppDimensions';
import DateTime from '../components/DateTimePicker';
import STRCONSTANT from '../services/StringConstants';
import COLOR from '../services/AppColor';
import StorageService from '../services/StorageService';
import { AppAlert } from '../components/Alert';


const platform = Platform.OS;
class DriverHome extends Component {
    constructor(props) {
		super(props);
		this.usersStore =  this.props.rootStore.usersStore;
		this.utilities  = this.usersStore.utilities;
		console.log('utilities in driver home', toJS(this.utilities))
		this.driverStore = this.props.rootStore.driverStore;
		this.vehicleNo = this.driverStore.driverData.vehicleNumber
		this.state = {
			accessToken: '',
			pickDateValue: moment().format('YYYY-MM-DD'),
			// pickDateValue: '',
			dropTimeValue: '',
			pickTimeValue: '',
			// dropDateValue: '',
			dropDateValue: moment().format('YYYY-MM-DD'),
			datePickerMode: 'date',
			datePlaceHolder: 'select Date',
			timePlaceHolder: 'Select Time',
			format: 'YYYY-MM-DD',
			formatTime: 'HH:mm:ss',
			loginMinTime: this.utilities.loginTime.split('-')[0],
			loginMaxTime: this.utilities.loginTime.split('-')[1],
			logoutMinTime: this.utilities.logoutTime.split('-')[0],
			logoutMaxTime: this.utilities.logoutTime.split('-')[1],
			loginMin: 30,
			showAlertError: false,
			showAlertLoader: false,
			errorText: '',
			alertTitle: 'Oops!',
			showConfirm: false,
			showCancel: true
		};
		
		
        // this.dateList = ["Today", "Tomorrow"]
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
				// headerLeft: null,
				// title: 'Driver Home'
			};
		}

    };
    componentDidMount() {
		this.props.navigation.setParams({
			handleMenu: this.navigateMenu,
			logout: this.logoutProfile
        });
		this.driverStore.setDriverData( this.vehicleNo );
		// console.log('all>>>>>>', this.usersStore.users.allemps)
    }
    navigateMenu = (pageName) => {
		this.props.navigation.navigate(pageName);
	}

	logoutProfile = () => {
		this.showAlert('confirm');
		// StorageService.removeData('driver_data').then(data => {
        //     this.props.navigation.navigate('LoginScreen');
        // })
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
            StorageService.removeData('driver_data').then(data => {
				this.props.navigation.navigate('LoginScreen');
			})
        } else {
			this.setState({
				showAlertLoader: false
			});
		}
	};

	empPageAction = (type) => {
		empParam = (type == 'pick') ? {vehicleNo: this.vehicleNo, tripDate: this.state.pickDateValue, tripTime: this.state.pickTimeValue}
									: {vehicleNo: this.vehicleNo, tripDate: this.state.dropDateValue, tripTime: this.state.dropTimeValue};
		
		;(async () => {
			await this.driverStore.getDriverEmp(empParam);
			if(this.driverStore.driverData.empList.length > 0) {
				await this.driverStore.getEmpIDs();
				// console.log(toJS(this.driverStore.driverData.empIds))
				await this.usersStore.filterEmployee(this.driverStore.driverData.empIds);
				let currType =  (type == 'pick') ? 'LOGIN': 'LOGOUT';
				let checkEmpty = this.usersStore.users.filterEmployees.filter(emp => { return (emp.type == currType) });

				if(checkEmpty && checkEmpty.length == 0){
					Alert.alert('No employee assigned.')
				} else {
					this.props.navigation.navigate('DriverViewEmployeeScreen', {assignType: currType});
				}
				
			} else {
				Alert.alert('No employee assigned.')
			}
			
		})();
		
	}

    render() {
		let {pickDateValue, dropTimeValue, timePlaceHolder, formatTime, format,
			datePickerMode, datePlaceHolder, pickTimeValue, dropDateValue, 
			loginMinTime, loginMaxTime, logoutMinTime, logoutMaxTime, loginMin,
			showAlertError, showAlertLoader, errorText, alertTitle, showCancel, showConfirm } = this.state;
        return(
            <Wallpapers>
                <CardView
					cardElevation={4}
					cardMaxElevation={4}
					cornerRadius={5}
					style={styles.cardView}>
					<Text style={styles.cardHead}>
						Pickup
					</Text>
					<View style={styles.cardContent}>
						<View style={styles.leftView}>
							{/* <ModalDropdown 
								options={dateList}
								style={styles.driverDrop}
								textStyle={styles.dropTextVisible}
								dropdownStyle={styles.dropdownStyle}
								defaultValue = {dateList[0]}
								dropdownTextStyle={styles.dropdownText}
							/> */}

								<DateTime 
									date = {pickDateValue} 
									mode={datePickerMode} 
									changeDate = {(pickDateValue) => {this.setState({pickDateValue: pickDateValue})}} 
									placeholder = {datePlaceHolder}
									format = {format}
									inputStyle = {{marginLeft:0, backgroundColor: '#fff', paddingRight:40}}
									futureDate = {1}
								/>
								<DateTime 
									date = {pickTimeValue} 
									changeDate = {(pickTimeValue) => {this.setState({pickTimeValue: pickTimeValue})}} 
									placeholder = {timePlaceHolder}
									format = {formatTime}
									inputStyle = {{backgroundColor: '#fff', marginLeft: 0, marginTop: 30, paddingRight:40}}
									iconStyle = {{top: 18}}
									style = {{ 'marginTop': 20}}
									minDate = {loginMinTime}
									maxDate = {loginMaxTime}
									minuteInterval={loginMin}
								/>
							
						</View>
						<View style={styles.rightView}>
							<RaisedTextButton
								title={STRCONSTANT.EMP_BTN}
								color={COLOR.BUTTON_COLOR}
								titleColor={COLOR.BUTTON_FONT_COLOR}
								onPress={ () => this.empPageAction('pick') }
								style={styles.assignStyle}
							/>
						</View>
						
					</View>
				</CardView>
				<CardView
					cardElevation={4}
					cardMaxElevation={4}
					cornerRadius={5}
					style={styles.cardView}>
					<Text style={styles.cardHead}>
						Drop
					</Text>
					<View style={styles.cardContent}>
						<View style={styles.leftView}>
							
							<DateTime 
								date = {dropDateValue} 
								mode={datePickerMode} 
								changeDate = {(dropDateValue) => {this.setState({dropDateValue: dropDateValue})}} 
								placeholder = {datePlaceHolder}
								format = {format}
								inputStyle = {{marginLeft:0, backgroundColor: '#fff', paddingRight:40}}
								futureDate = {1}
								
							/>
							<DateTime 
								date = {dropTimeValue} 
								changeDate = {(dropTimeValue) => {this.setState({dropTimeValue: dropTimeValue})}} 
								placeholder = {timePlaceHolder}
								format = {formatTime}
								inputStyle = {{backgroundColor: '#fff', marginLeft: 0, marginTop: 30, paddingRight:40}}
								iconStyle = {{top: 18}}
								style = {{ 'marginTop': 20}}
								minDate = {logoutMinTime}
								maxDate = {logoutMaxTime}
								minuteInterval={loginMin}
							/>
						</View>
						<View style={styles.rightView}>
							<RaisedTextButton
								title={STRCONSTANT.EMP_BTN}
								color={COLOR.BUTTON_COLOR}
								titleColor={COLOR.BUTTON_FONT_COLOR}
								onPress={ () => this.empPageAction('drop') }
								style={styles.assignStyle}
							/>
						</View>
						
					</View>
				</CardView>
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
                    onConfirmPressed={() => {
                        this.hideAlert('confirm');
					}}
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
			</Wallpapers>
        )
    }
}
const styles = StyleSheet.create({
	cardView: {
		backgroundColor: 'white',
		width: wp('90%'),
		height: hp('25%'),
		alignSelf: 'center',
		marginTop: 10,
		paddingTop: 10
	},
	cardText: {
		fontSize: 15,
		marginLeft: 10,
		marginBottom: 5,
		marginRight: 15
	},	
	dropTextVisible: {
        color: '#5b5a5a', 
        fontSize: 16, 
		fontWeight: 'bold',
		width: wp('40%'),
		textAlign: 'center'
	},
	dropdownStyle: {
        width: wp('40%'),
        alignItems: 'center',
        borderWidth: 2,
		backgroundColor: '#EFEEEE',
		height: hp('9%')
	},
	driverDrop: {
        borderColor: '#5b5a5a', 
        borderWidth:.5,
        width: wp('40%'),
        height: hp('4%'),
        alignItems: 'center',
		paddingTop: 5,
		backgroundColor: '#fff'
	},
	dropdownText:{
		width: wp('40%'),
		textAlign: 'center',
		color: '#5b5a5a', 
        fontSize: 13, 
		fontWeight: 'bold',
	},
	cardHead: {
		fontWeight: 'bold',
		fontSize: 16,
		marginLeft:10,
		marginBottom: 10
	},
	cardContent: {
		width: wp('85%'),
		borderColor: '#6a6a6a',
		borderWidth: .5,
		alignSelf: 'center',
		backgroundColor:'#e9e9e9',
		paddingLeft: 10,
		borderRadius: 5,
		height:hp('18%'),
		// flex: 1,
		flexDirection: "row",
	},
	assignStyle:{
		width: wp('29%'),
	},
	leftView: {
		width: wp('50%'),
		paddingTop: 30,
		// alignSelf: 'center'
	},
	rightView:{
		width: wp('50%'),
		alignSelf: 'center',
		// paddingRight: 15
	}
})


export default inject("rootStore")(observer(DriverHome));