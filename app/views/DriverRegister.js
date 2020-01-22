import React, { Component } from "react";
import {
	View, StyleSheet, 
    Image, TextInput, 
    Platform,
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import { TextField } from 'react-native-material-textfield';
import { RaisedTextButton } from 'react-native-material-buttons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { observer, inject } from "mobx-react";
import { AppAlert } from '../components/Alert';
import Wallpapers from "../components/Wallpaper";
import logo from '../assets/icons/logorubrik.png';
// import Constants from '../services/Constants';
import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';
import { deviceType } from '../stylesheets/AppDimensions';
import  deviceInfo  from '../stylesheets/AppDimensions';

const platform = Platform.OS;
const screenHgt = deviceInfo.DEVICE_HEIGHT;
const hightVariation = deviceInfo.HEIGHT_VARIATION

class DriverRegister extends Component {
	constructor(props) {
        super(props);
        this.usersStore = this.props.rootStore.usersStore;
        this.driverStore = this.props.rootStore.driverStore;
    }
    
    
    state = {
		firstName: '',
        phoneNo: '',
        vehicleNo: '',
        license: '',
        address: '',
        showAlertError: false,
        showAlertLoader: false,
        errorText: '',
        alertTitle: 'Oops!',
        showConfirm: false,
        showCancel: true
    };

    componentDidMount () {
       
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
        } else if(type == 'success') { 
            this.setState({
				showAlertError: false
            });
            this.props.navigation.navigate('HomeScreen');
        } else {
			this.setState({
				showAlertLoader: false
			});
		}
	};

    registerDriver = () => {
        if( !this.state.firstName.trim() ) {
            this.setState({ errorText: 'Please enter first name.'})
            this.showAlert('error')
        } else if( !this.state.license.trim() ) {
            this.setState({ errorText: 'Please enter license number.'})
            this.showAlert('error')
        } else if( !this.state.vehicleNo.trim() ) {
            this.setState({ errorText: 'Please enter vehicle number.'})
            this.showAlert('error')
        } else if( !this.state.phoneNo.trim() ) {
            this.setState({ errorText: 'Please enter phone number.'})
            this.showAlert('error')
        } else if( !this.state.address.trim() ) {
            this.setState({ errorText: 'Please enter address.'})
            this.showAlert('error')
        } else {
            this.setState({
                address: this.state.address.replace(/\n/g, " ")
            })
            this.showAlert('loader')
            this.usersStore.registerDriver(this.state).then( () => {
                this.hideAlert('loader')
                console.log(this.usersStore.users.driverDetail);
                if(this.usersStore.users.driverDetail.code == 200 || this.usersStore.users.driverDetail.code == 201 ){
                    this.driverStore.setDriverData(this.state.vehicleNo).then(() => {
                        this.setState({ 
                            errorText: 'Driver has registered successfully.', 
                            alertTitle: 'Success!', 
                            showCancel: false, 
                            showConfirm: true
                        })
                        this.showAlert('error')
                    })
                    
                    // Alert.alert('Driver has registered successfully.')
                } else {
                    if(this.usersStore.users.driverDetail.message){
                        this.setState({ 
                            errorText: this.usersStore.users.driverDetail.message, 
                            alertTitle: 'Success!', 
                            showCancel: false, 
                            showConfirm: true
                        })
                        this.showAlert('error')
                    }
                }
            } )
        }
    }

    
    render() {
        console.disableYellowBox = true;
        let { firstName, phoneNo, license, vehicleNo, address, showAlertError, 
            showAlertLoader, errorText, alertTitle, showCancel, showConfirm } = this.state;
        return (
            <Wallpapers>
                <KeyboardAwareScrollView>
                    <Image style={styles.logoStyles} source={logo} />
                    <View style={styles.TextInputView}>
                        <TextInput
                            label=''
                            value={`${firstName}`}
                            onChangeText={(firstName) => this.setState({ firstName })}
                            style={styles.textFieldStylesOwn}
                            labelFontSize={18}
                            autoFocus={true}
                            placeholder={STRCONSTANT.DRIVER_NAME}
                            placeholderTextColor={COLOR.PLACEHOLDER}
                            lineWidth={0}
                            activeLineWidth={0}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <TextInput
                            label=''
                            value={`${license}`}
                            onChangeText={(license) => this.setState({ license })}
                            style={styles.textFieldStylesOwn}
                            labelFontSize={18}
                            autoFocus={true}
                            placeholder={STRCONSTANT.DRIVER_LICENSE}
                            placeholderTextColor={COLOR.PLACEHOLDER}
                            lineWidth={0}
                            activeLineWidth={0}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <TextInput
                            label=''
                            value={`${vehicleNo}`}
                            onChangeText={(vehicleNo) => this.setState({ vehicleNo })}
                            style={styles.textFieldStylesOwn}
                            labelFontSize={18}
                            autoFocus={true}
                            placeholder={STRCONSTANT.DRIVER_VEHICLE}
                            placeholderTextColor={COLOR.PLACEHOLDER}
                            lineWidth={0}
                            activeLineWidth={0}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <TextInput
                            label=''
                            value={`${phoneNo}`}
                            onChangeText={(phoneNo) => this.setState({ phoneNo })}
                            style={styles.textFieldStylesOwn}
                            labelFontSize={18}
                            autoFocus={true}
                            placeholder={STRCONSTANT.DRIVER_PHONE}
                            placeholderTextColor={COLOR.PLACEHOLDER}
                            lineWidth={0}
                            activeLineWidth={0}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        
                        
                        <TextInput
                            label=''
                            value={`${address}`}
                            onChangeText={ (address) => this.setState({ address }) }
                            style={styles.textAreaStyles}
                            labelFontSize = {18}
                            autoFocus={true}
                            multiline={true}
                            numberOfLines={6}
                            placeholder={ STRCONSTANT.DRIVER_ADDRESS }
                            placeholderTextColor={COLOR.PLACEHOLDER}
                        />
                        <RaisedTextButton 
                            title={ STRCONSTANT.REG_BTN_TITLE } 
                            color={COLOR.BUTTON_COLOR_DRIVER}
                            titleColor = { COLOR.BUTTON_FONT_COLOR }
                            onPress = { () => this.registerDriver() }
                            style = { styles.buttonHelp }
                            titleStyle = {styles.titleStyle}
                        />
                    </View>
                </KeyboardAwareScrollView>
                
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
					// cancelButtonColor="rgb(29,115,99)"
					onCancelPressed={() => {
						this.hideAlert('error');
                    }}
                    onConfirmPressed={() => {
                        this.hideAlert('success');
                    }}
                    cancelButtonColor="#1A3E50"
                    confirmButtonColor = "#FFFFFF"
                    contentContainerStyle = {{backgroundColor: COLOR.HEADER_BG_COLOR}}
                    cancelButtonTextStyle = {{color: '#fff', fontSize: 15}}
                    cancelButtonStyle = {{borderWidth: .5, borderColor: '#fff', width: wp('20%'), alignItems: 'center'}}
                    messageStyle = {{color: '#fff'}}
                    titleStyle = {{color: '#fff'}}
                    confirmButtonStyle = {{borderWidth: .5, borderColor: '#165155', width: wp('20%'), alignItems: 'center'}}
					confirmButtonTextStyle = {{color: '#165155', fontSize: 15}}
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
};

const styles = StyleSheet.create({

	logoStyles: {
		alignSelf: 'center',
		width: wp('38%'),
		height: wp('38%')
	},
	textFieldStylesOwn: {
		backgroundColor: 'white',
		paddingLeft: 10,
		height: platform == 'ios'? hp('5%'): screenHgt >= hightVariation ? hp('5.5%') : hp('5.9%'),
		borderRadius: 20,
		marginTop: 5,
        borderWidth: 0,
        fontSize: platform == 'ios'?18: screenHgt >= hightVariation ? 14: 12

	},
	TextInputView: {
		width: wp('95%'),
        alignSelf: 'center',
        marginTop: platform == 'ios'?-30 : 0
	},
	buttonHelp: {
		borderRadius: 20,
		height: (deviceType == 'iphone') ? 40 : 50,
        marginTop: platform == 'ios' ? 25 : 15,
        bottom: platform == 'ios' ? 0 : 10,
        fontSize: 18
	},
    textAreaStyles: {
        borderRadius : 20,
        backgroundColor: 'white',
        marginTop  :5,	
        paddingLeft: 10,
        paddingTop: 10,
        height: 150,
        fontSize: platform == 'ios'?18: 14
    },
	titleStyle:{
		fontSize: 18
	}

})
export default inject("rootStore")(observer(DriverRegister));
