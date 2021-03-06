import React, { Component } from "react";
import {
    View, StyleSheet, Image, Platform,
    Text, TouchableOpacity, TextInput, Alert
} from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RaisedTextButton } from 'react-native-material-buttons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Wallpapers from "../components/Wallpaper";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import avtarImg from '../assets/icons/userlogo.png'
import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';

import license from '../assets/icons/badge.png';
import vehicleNum from '../assets/icons/car.png'
import phoneNum from '../assets/icons/phone.png'
import location from '../assets/icons/location.png'
import  deviceInfo  from '../stylesheets/AppDimensions';
const platform = Platform.OS;
const screenHgt = deviceInfo.DEVICE_HEIGHT;
const hightVariation = deviceInfo.HEIGHT_VARIATION

class DriverProfile extends Component {
    constructor(props) {
        super(props);
        this.usersStore = this.props.rootStore.usersStore;
        this.driverStore = this.props.rootStore.driverStore;
        this.driverData = this.driverStore.driverData
        // console.log(toJS(this.driverData))
        this.state = {
            isVehicleVisible: true,
            isContactVisible: true,
            isAddrVisible: true,
            updateBtnVisible: false,
            vehicleNo: this.driverData.vehicleNumber ? this.driverData.vehicleNumber : '',
            contact: this.driverData.driverPhone ? this.driverData.driverPhone : '',
            address: this.driverData.driverAddress ? this.driverData.driverAddress : '',
        }

    }

    static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
        return {
            headerLeft: <Ionicons 
                            name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
                            name={'ios-arrow-back'} 
                            size={24} 
                            color="#fff"
                            style={styles.icon}
                            onPress={ () => { params.goBack() }} 
                        />,
        }
			
	};
    
    componentDidMount() {
        this.props.navigation.setParams({
			goBack: this.goBack,
        });
    }

    goBack = () => {
        this.props.navigation.goBack()
        this.props.navigation.state.params.callHomeData();
    };
  

    updateProfile = () => {
        driverParam = {};
        driverParam.firstName = this.driverData.driverName;
        driverParam.phoneNo = this.state.contact
        driverParam.vehicleNo = this.state.vehicleNo;
        driverParam.license = this.driverData.licenseNumber
        driverParam.address = this.state.address;
        this.usersStore.registerDriver(driverParam).then( () => {
            // console.log(this.usersStore.users.driverDetail);
            if(this.usersStore.users.driverDetail.code == 200 || 201 ){
                this.setState({ isContactVisible: true, isAddrVisible: true, isVehicleVisible: true, updateBtnVisible: false })
                this.driverStore.setDriverData(driverParam.vehicleNo).then(() => {
                    Alert.alert('Driver profile has been updated.')
                })
                
            }
        } )
        
    }

    EditProfile = (editType) => {
        this.setState({ updateBtnVisible: true })
        this.setState((editType == 'Phone') ? { isContactVisible: false } : (editType == 'Vehicle') ? { isVehicleVisible: false } :  { isAddrVisible: false });
    }

    render() {
        console.disableYellowBox = true;
        let { isContactVisible, contact, isAddrVisible, address, updateBtnVisible, vehicleNo, isVehicleVisible } = this.state
        return (
            <Wallpapers>
                <View style={styles.userContainer}>
                    <Image style={styles.avtarStyle} source={avtarImg} />
                    <Text style={styles.fullName}>{this.driverData.driverName}</Text>
                </View>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={false}
                >
                    <View style={styles.contentSec}>

                        <View style={styles.menuContainer}>
                           
                            <Image style={styles.menuTextLeft} source={license} />
                           
                            <Text style={styles.menuTextRight}>
                                {this.driverData.licenseNumber}
                            </Text>

                        </View>
                        <View style={styles.menuContainer}>
                           
                            <Image style={styles.menuTextLeft} source={vehicleNum} />
                           
                            {

                            (isVehicleVisible) ?
                                <View style={styles.rightView}>
                                    <Text style={styles.menuTextRight}>
                                        {vehicleNo}
                                    </Text>
                                </View>

                                :
                                <View style={styles.rightView}>
                                    <TextInput
                                        label=''
                                        value={`${vehicleNo}`}
                                        onChangeText={(vehicleNo) => this.setState({ vehicleNo })}
                                        style={styles.textFieldStylesOwn}
                                        labelFontSize={18}
                                        autoFocus={true}
                                        lineWidth={0}
                                        activeLineWidth={0}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                    />
                                </View>
                                
                            }

                        </View>
                        <View style={styles.menuContainer}>
                            <Image style={styles.menuTextLeft} source={phoneNum} />
                            
                            {

                                (isContactVisible) ?
                                    <View style={styles.rightView}>
                                        <Text style={styles.menuTextRight}>
                                            {contact}
                                        </Text>
                                        <TouchableOpacity onPress={() => this.EditProfile('Phone')}>
                                            <View style={styles.iconView}>
                                                <MaterialIcons name="edit" size={19} color="#333" />
                                            </View>

                                        </TouchableOpacity>
                                    </View>

                                    :
                                    <TextInput
                                        label=''
                                        value={`${contact}`}
                                        onChangeText={(contact) => this.setState({ contact })}
                                        style={styles.textFieldStylesOwn}
                                        labelFontSize={18}
                                        autoFocus={true}
                                        lineWidth={0}
                                        activeLineWidth={0}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                    />
                            }



                        </View>
                        <View style={styles.menuContainerAddr}>
                            <Image style={styles.menuTextLeft} source={location} />
                            {
                                (isAddrVisible) ?
                                    <View style={styles.rightView}>
                                        <Text style={styles.menuTextRight}>
                                            {address}
                                        </Text>
                                        <TouchableOpacity onPress={() => this.EditProfile('Address')}>
                                            <View style={styles.iconView}>
                                                <MaterialIcons name="edit" size={19} color="#333" />
                                            </View>

                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <TextInput
                                        label=''
                                        value={`${address}`}
                                        onChangeText={(address) => this.setState({ address })}
                                        style={styles.textAreaStyles}
                                        labelFontSize={18}
                                        autoFocus={true}
                                        multiline={true}
                                        numberOfLines={3}
                                    />
                            }

                        </View>
                        <View style={styles.buttonSec}>
                            {
                                (updateBtnVisible) ?
                                    <RaisedTextButton
                                        title={STRCONSTANT.UPDATE}
                                        color={COLOR.BUTTON_COLOR_DRIVER}
                                        titleColor={COLOR.BUTTON_FONT_COLOR}
                                        onPress={this.updateProfile}
                                        style={styles.updateBtn}
                                        disabled = {false}
                                        titleStyle = {styles.titleStyle}
                                    />
                                    :
                                    <RaisedTextButton
                                        title={STRCONSTANT.UPDATE}
                                        color={COLOR.BUTTON_COLOR_DRIVER}
                                        titleColor={COLOR.BUTTON_FONT_COLOR}
                                        onPress={this.updateProfile}
                                        style={styles.updateBtn}
                                        disabled = {true}
                                        titleStyle = {styles.titleStyle}
                                    />
                            }
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </Wallpapers>
        );


    }
    
};

const styles = StyleSheet.create({
    userContainer: {
        // flex: 1,
        alignItems: 'center',
        height: hp('28%'),
        backgroundColor: COLOR.CARD_BG_COLOR,
        // marginBottom: screenHgt >= hightVariation ? 0 : 50
    },
    icon: {
        paddingLeft: 10
    },
    avtarStyle: {
        height: wp('35.5%'),
        width: wp('35.8%'),
        marginTop: 10,
        marginBottom: screenHgt >= hightVariation ? 10 : 0,
    },
    contentSec: {
        flex: 1,
        // backgroundColor: 'red'
        // width: wp('100%'),
        // height: hp('64%'),
    },
    fullName: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 22
    },

    menuContainer: {
        height: hp('8%'),
        borderColor: '#333',
        borderBottomWidth: .5,
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('94%'),
        marginLeft:10
    },
    menuContainerAddr:{
        // height: hp('12%'),
        minHeight: hp('12%'),
        borderColor: '#333',
        borderBottomWidth: .5,
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('94%'),
        marginLeft:10
    },
    menuTextLeft: {
        // color: '#5b5a5a',
        // fontWeight: 'bold',
        width: wp('11%'),
        height: wp('11%'),
        marginLeft: 20,
        // marginRight: 20
        // fontSize: 16
    },
    menuTextRight: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
        width: wp('70%'),
        paddingLeft: 50
    },
    rightView: {
        // width: wp('80%'),
        flexDirection: 'row'
    },
    buttonSec: {
        // bottom: 0,
        marginTop: screenHgt >= hightVariation ? 100 : 70,
        alignSelf: 'center',
        // position: 'relative',
        // marginBottom: 0,
        // flex:3
    },
    cancelStyle: {
        borderColor: '#f00',
        borderWidth: 1,
        borderRadius: 20,
        width: wp('95%'),
        height: hp('5.5%')
    },
    updateBtn: {
        borderRadius: 20,
        width: wp('95%'),
        height: hp('5.5%'),
        marginBottom: 10,
    },
    textFieldStylesOwn: {
        backgroundColor: 'white',
        paddingLeft: 10,
        height: platform == 'ios'? hp('5%'): screenHgt >= hightVariation ? hp('5.5%') : hp('5.9%'),
        borderRadius: 20,
        //marginTop: 15,
        borderWidth: 0,
        width: wp('60%'),
        marginLeft: wp('10%'),
        fontSize: platform == 'ios'?18: screenHgt >= hightVariation ? 14: 12
    },
    textAreaStyles: {
        borderRadius: 20,
        backgroundColor: 'white',
        // marginTop  :15,	
        // fontSize: 18,
        paddingLeft: 10,
        paddingTop: 10,
        height: 85,
        width: wp('60%'),
        marginLeft: wp('10%'),
        fontSize: platform == 'ios'?18: screenHgt >= hightVariation ? 14: 12
    },
    iconView: {
        width: wp('5%')
    },
    titleStyle:{
		fontSize: 18,
		textTransform: 'capitalize'
	}
})

export default inject("rootStore")(observer(DriverProfile));
