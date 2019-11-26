import React, { Component } from "react";
import {
	View, StyleSheet,
	Image, TextInput,
} from "react-native";
import { RaisedTextButton } from 'react-native-material-buttons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { Alert } from 'react-native';
import { observer, inject } from "mobx-react";

import { AppAlert } from '../components/Alert';
import Wallpapers from "../components/Wallpaper";
import logo from '../assets/icons/logorubrik.png';
import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';
import { deviceType } from '../stylesheets/AppDimensions';


class Login extends Component {
	constructor(props) {
		super(props);
		this.driverStore = this.props.rootStore.driverStore;
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
					this.setState({ showOTPInput: true, signupText: STRCONSTANT.DRIVER_LOGIN_AFTER_OTP })
				})
				
			} else {
				this.setState({ errorText: 'Please Enter Vehicle Number!'})
				this.showAlert('error')
			}
			
			//sms will be send to user
			
		} else {
			if (this.state.vehicleNo.trim() != '' && this.state.enterOTP.trim() != '') {
				
				this.showAlert('loader')
				this.driverStore.driverLoginWithOTP(this.state.vehicleNo, this.state.enterOTP).then(()=>{
					this.hideAlert('loader')
					console.log('login data',this.driverStore.driverData)
					if( this.driverStore.driverData.code == 200 ) {
						// this.setState({vehicleNo: '', enterOTP: '', showOTPInput: false}, () =>
							this.props.navigation.navigate('HomeScreen')
						// )
						
						
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
	
	
	render() {
		console.disableYellowBox = true;
		let { showAlertError, showAlertLoader, vehicleNo, signupText, errorText } = this.state;

		return (
			<Wallpapers>
				<Image style={styles.logoStyles} source={logo} />
				<View style={styles.TextInputView}>
					<TextInput
						label=''
						value={`${vehicleNo}`}
						onChangeText={(vehicleNo) => this.setState({ vehicleNo })}
						style={styles.textFieldStylesOwn}
						labelFontSize={0}
						autoFocus={true}
						placeholder={STRCONSTANT.VEHICLEINPUT}
						placeholderTextColor={COLOR.PLACEHOLDER}
						lineWidth={0}
						activeLineWidth={0}
						autoCapitalize='none'
						autoCorrect={false}
					/>
					{this.renderOTPInput()}
					
					<RaisedTextButton
						title={signupText}
						color={COLOR.BUTTON_COLOR}
						titleColor={COLOR.BUTTON_FONT_COLOR}
						onPress={this.driverSignIn}
						style={styles.buttonHelp}
						titleStyle = {styles.titleStyle}
					/>
					<RaisedTextButton
						title={STRCONSTANT.DRIVER_REG_TITLE}
						color={COLOR.BUTTON_COLOR}
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
					cancelButtonColor="rgb(29,115,99)"
					onCancelPressed={() => {
						this.hideAlert('error');
					}}

				/>
				<AppAlert
					show={showAlertLoader}
					showProgress={true}
					title="Loading.."
					closeOnTouchOutside={false}
					closeOnHardwareBackPress={false}
				/>
			</Wallpapers>
		);
	}
	
};

const styles = StyleSheet.create({

	logoStyles: {
		alignSelf: 'center',
		width: wp('45%'),
		height: hp('34%')
	},
	textFieldStylesOwn: {
		backgroundColor: 'white',
		paddingLeft: 10,
		height: hp('5%'),
		borderRadius: 20,
		marginTop: 10,
		borderWidth: 0,
		fontSize: 18
	},
	TextInputView: {
		width: wp('95%'),
		// height: hp('20%'),
		alignSelf: 'center',
		marginTop: -20
	},
	buttonHelp: {
		borderRadius: 20,
		// marginBottom: 20,
		height: (deviceType == 'iphone') ? 38 : 50,
		marginTop: 10,
		fontSize: 18
	},
	titleStyle:{
		fontSize: 18
	}

})

export default inject("rootStore")(observer(Login));