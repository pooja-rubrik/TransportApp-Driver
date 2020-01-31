import React, { Component } from "react";
import {
	View, StyleSheet,
	Image, TextInput, 
	Platform, Text
} from "react-native";
import { RaisedTextButton } from 'react-native-material-buttons';
import { Button } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { Alert } from 'react-native';
import { observer, inject } from "mobx-react";

import { AppAlert } from '../components/Alert';
import Wallpapers from "../components/Wallpaper";
import logo from '../assets/icons/logorubrik.png';
import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';
import { deviceType } from '../stylesheets/AppDimensions';
import  deviceInfo  from '../stylesheets/AppDimensions';

const platform = Platform.OS;
const screenHgt = deviceInfo.DEVICE_HEIGHT;
const hightVariation = deviceInfo.HEIGHT_VARIATION

class Login extends Component {
	constructor(props) {
		super(props);
		this.driverStore = this.props.rootStore.driverStore;
		this.usersStore = this.props.rootStore.usersStore;
	}

	state = {
		empID: '',
		showAlertError: false,
		showAlertLoader: false,
		vehicleNo: '',
		hasLoggedInOnce: false,
		accessToken: '',
		showOTPInput: false,
		enterOTP: '',
		signupModalVisible: false,
		adminModalVisible: false,
		signupText: STRCONSTANT.DRIVER_LOGIN,
		errorText: '',
	};


	componentDidMount() {
		
	}


	driverRegister = () => {
		this.setState({ showOTPInput: false })
		this.props.navigation.navigate('DriverRegisterScreen', {'fromPage': 'driverLogin'});
	}

	driverSignIn = () => {
		if (this.state.showOTPInput == false) {
			if (this.state.vehicleNo != '') {
				// this.showAlert('loader')
				this.driverStore.driverLoginSendOTP(this.state.vehicleNo).then(()=>{
					console.log(this.driverStore.driverData.otpStatus);
					if( this.driverStore.driverData.otpStatus.code == 200 ) {
						this.setState({ showOTPInput: true, signupText: STRCONSTANT.DRIVER_LOGIN_AFTER_OTP })
					} else {
						this.setState({ errorText: this.driverStore.driverData.otpStatus.message? this.driverStore.driverData.otpStatus.message: 'Something went wrong'})
						this.showAlert('error')
					}
					
				})
				
			} else {
				this.setState({ errorText: 'Please Enter Vehicle Number!'})
				this.showAlert('error')
			}
			
			//sms will be send to user
			
		} else {
			if (this.state.vehicleNo.trim() != '' && this.state.enterOTP.trim() != '') {
				
				this.showAlert('loader')
				this.driverStore.driverLoginWithOTP( this.state.vehicleNo, this.state.enterOTP ).then(()=>{
					this.hideAlert('loader')
					console.log('login data',this.driverStore.driverData)
					if( this.driverStore.driverData.code == 200 ) {
						this.usersStore.getAllEmployee().then( () => {
							this.usersStore.getUtility().then( () => {
								this.props.navigation.navigate('HomeScreen')
							});
						});
						
					} else {
						this.setState({ errorText: this.driverStore.driverData.message? this.driverStore.driverData.message: 'Something went wrong'})
						this.showAlert('error')
					}
				})
				
			} else {
				this.setState({ errorText: 'Please Enter OTP Number!'})
				this.showAlert('error')
			}
		}

	}

	showAlert = (type) => {
		if (type == 'error') {
			this.setState({
				showAlertError: true
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
		} else {
			this.setState({
				showAlertLoader: false
			});
		}
	};

	renderOTPInput = () => {
		if (this.state.showOTPInput) {
			
			return (
				<TextInput
					label=''
					value={`${this.state.enterOTP}`}
					onChangeText={(enterOTP) => this.setState({ enterOTP })}
					style={styles.textFieldStylesOwn}
					labelFontSize={18}
					autoFocus={true}
					placeholder={STRCONSTANT.ENTER_OTP}
					placeholderTextColor={COLOR.PLACEHOLDER}
					lineWidth={0}
					activeLineWidth={0}
					autoCapitalize='none'
					autoCorrect={false}
				/>
			);
		}
	}
	
	// componentWillUnmount () {
	// 	console.log('unmount');
	// 	this.setState({vehicleNo: '',enterOTP: '' })
	// }

	vehicleNoRemSpace = (vehicleNo) => {
        this.setState({'vehicleNo': vehicleNo.replace(/\s/g, '')})
    }
	
	render() {
		console.disableYellowBox = true;
		let { showAlertError, showAlertLoader, vehicleNo, signupText, errorText } = this.state;

		return (
			<Wallpapers>
				{/* <View style={{position: 'relative'}}> */}
					<Image style={styles.logoStyles} source={logo} />
					<View style={styles.TextInputView}>
						<TextInput
							label=''
							value={`${vehicleNo}`}
							onChangeText={(vehicleNo) => this.vehicleNoRemSpace(vehicleNo)}
							style={styles.textFieldStylesOwn}
							labelFontSize={0}
							autoFocus={true}
							placeholder={STRCONSTANT.VEHICLEINPUT}
							placeholderTextColor={COLOR.PLACEHOLDER}
							lineWidth={0}
							activeLineWidth={0}
							autoCapitalize='characters'
							autoCorrect={false}
						/>
						{this.renderOTPInput()}
						<Button  
							mode="contained" 
							color={COLOR.BUTTON_COLOR_DRIVER}
							style={styles.buttonHelp}
							uppercase = {false}
							onPress={this.driverSignIn}
						>
							<Text style={{color:"#fff", fontSize: 16}}>{signupText}</Text>
							
						</Button>
						{/* <RaisedTextButton
							title={signupText}
							color={COLOR.BUTTON_COLOR_DRIVER}
							titleColor={COLOR.BUTTON_FONT_COLOR}
							onPress={this.driverSignIn}
							style={styles.buttonHelp}
							titleStyle = {styles.titleStyle}
						/> */}
						<RaisedTextButton
							title={STRCONSTANT.DRIVER_REG_TITLE}
							// title = "signup with OTP"
							color={COLOR.BUTTON_COLOR_DRIVER}
							titleColor={COLOR.BUTTON_FONT_COLOR}
							onPress={this.driverRegister}
							style={styles.buttonHelp}
							titleStyle = {styles.titleStyle}
						/>
							
					</View>
					
					<AppAlert
						show={showAlertError}
						showProgress={false}
						title="Oops!"
						message={errorText}
						closeOnTouchOutside={true}
						closeOnHardwareBackPress={true}
						showCancelButton={true}
						cancelText="Cancel"
						cancelButtonColor="#1A3E50"
						onCancelPressed={() => {
							this.hideAlert('error');
						}}
						alertContainerStyle = {{zIndex: 999, position: 'absolute'}}
						contentContainerStyle = {{backgroundColor: COLOR.HEADER_BG_COLOR, }}
						cancelButtonTextStyle = {{color: '#fff', fontSize: 15}}
						cancelButtonStyle = {{borderWidth: .5, borderColor: '#fff', width: wp('20%'), alignItems: 'center'}}
						messageStyle = {{color: '#fff'}}
						titleStyle = {{color: '#fff'}}
					/>
					<AppAlert
						show={showAlertLoader}
						showProgress={true}
						title="Loading.."
						closeOnTouchOutside={false}
						closeOnHardwareBackPress={false}
						alertContainerStyle = {{zIndex: 999, position: 'absolute'}}
					/>
				{/* </View> */}
				
			</Wallpapers>
		);
	}
	
};

const styles = StyleSheet.create({

	logoStyles: {
		alignSelf: 'center',
		width: wp('38%'),
		height: wp('38%'),
		marginTop: 20
	},
	textFieldStylesOwn: {
		backgroundColor: 'white',
		paddingLeft: 10,
		height: platform == 'ios'? hp('5%'): screenHgt >= hightVariation ? hp('5.5%') : hp('5.9%'),
		borderRadius: 20,
		marginTop: 10,
		borderWidth: 0,
		fontSize: platform == 'ios'?18: screenHgt >= hightVariation ? 14: 12
	},
	TextInputView: {
		width: wp('95%'),
		// height: hp('20%'),
		alignSelf: 'center',
		marginTop: platform == 'ios'?-20 : 0,
		zIndex: 99
	},
	buttonHelp: {
		borderRadius: 20,
		// marginBottom: 20,
		height: (deviceType == 'iphone') ? 38 : 50,
		marginTop: 10,
		fontSize: 18,
		// textTransform: 'none'
		overflow: 'visible',
		//zIndex: 9
	},
	titleStyle:{
		fontSize: 18,
		textTransform: 'capitalize'
	}
	//'none' | 'capitalize' | 'uppercase' | 'lowercase';
})

export default inject("rootStore")(observer(Login));