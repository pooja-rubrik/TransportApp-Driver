import React from "react";
import {
    Text, StyleSheet, TouchableOpacity,
    View, Image, Platform
} from "react-native";
import {toJS} from 'mobx';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview'
import { RaisedTextButton } from 'react-native-material-buttons';

import statusIconBook from '../assets/icons/cabbooked.png'
import statusIconNotBook from '../assets/icons/cabnotbooked.png'
import STRCONSTANT from '../services/StringConstants';
import COLOR from '../services/AppColor';
import EnterOTP from "./EnterOTP";
import  deviceInfo  from '../stylesheets/AppDimensions';

const platform = Platform.OS;
const screenHgt = deviceInfo.DEVICE_HEIGHT;
const hightVariation = deviceInfo.HEIGHT_VARIATION


export default class DriverEmpList extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isExpand: false,
            isBooked: true,
            otpModalVisible: false,
            currOpenId: '',
            currIndex: 0,
            currEndTripEmp: 0,
        }
    }

    componentDidMount() {
       // console.log(this.props)
    }

    componentWillReceiveProps() {
        // console.log('empdata>>',toJS(this.props.empData), this.props.assignType)
    }

    tripAction = (action, empID, isOTPOpen) => {
        if (action == STRCONSTANT.DRIVER_START_TRIP) {
            this.props.tripAction(action, empID);
        } else {
            if (isOTPOpen == true) {
                this.setState({ otpModalVisible: true, currEndTripEmp: empID })
            }
        }

    }

    submitOTP = (otpData) => {
        //console.log(otpData)
        this.setState({ otpModalVisible: false })
        this.props.tripAction(STRCONSTANT.DRIVER_END_TRIP, this.state.currEndTripEmp, otpData.enterOTP);
    }

    componentWillUnmount() {
        console.log('unmount called>>>>>')
    }


    render() {
        let { otpModalVisible } = this.state;
        let { empData, assignType } = this.props;
        empList = []
        empData.map((employee, index)=>{
            employee.show = 0;
            // console.log(assignType, employee.type)
            if (assignType == employee.type) {
                empList.push(<DriverEmployee employee={employee} tripAction={this.tripAction} key={index} />)    
            }
        })

        return (
            <View>

                {/* {(empList == null || empList[0] == null)? >>>>>do check */}
                {(empList.length == 0)? 
                    <CardView
                        cardElevation={4}
                        cardMaxElevation={4}
                        cornerRadius={5}
                        style={styles.cardView}>
                        <View style={styles.cardHead}>
                            <Text style={platform == "ios" ? styles.headTextIOS: styles.headText}>
                                No Employee!
                            </Text>
                        </View>
                    </CardView>:
                    empList
                }
                
                <EnterOTP otpModalVisible={otpModalVisible} closeModalFunc={this.closeModalFunc} submitOTP={this.submitOTP} />
             </View>

        )
    }
}


export class DriverEmployee extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            currOpenId: '',
            isExpand: false,
            buttonLabel: STRCONSTANT.DRIVER_START_TRIP,
            // isOTPOpen: false
        }
        //console.log(toJS(this.props.employee))
    }

    expandCard = (isExpand, currId) => {
        //console.log('>>>>>>', isExpand, currId)
        if (this.state.currOpenId == currId) {
            this.setState({
                currOpenId: ''
            });
        } else {
            this.setState(isExpand ? { isExpand: false, currOpenId: currId } : { isExpand: true, currOpenId: currId })
        }
    }

    tripAction = (action, empID) => {
        isOTPOpen = false

        if (this.state.buttonLabel == STRCONSTANT.DRIVER_END_TRIP) {
            isOTPOpen = true;
        } else {
            isOTPOpen = false;
        }
        this.setState({ buttonLabel: STRCONSTANT.DRIVER_END_TRIP })
       // console.log('call parent from child>>>')
        this.props.tripAction(action, empID, isOTPOpen);
    }

    render() {
        let { isExpand, currOpenId, buttonLabel } = this.state;
        let { employee } = this.props;
        if(employee.empBookStatus == 'INPROGRESS') {
            this.setState({buttonLabel: STRCONSTANT.DRIVER_END_TRIP});
        }
        
        return (
            <CardView
                cardElevation={4}
                cardMaxElevation={4}
                cornerRadius={5}
                style={(currOpenId == employee.empID) ? styles.cardViewChange : styles.cardView}
                // style={styles.cardViewChange}
            >
                <TouchableOpacity onPress={() => this.expandCard(isExpand, employee.empID)}>
                    <View style={styles.cardHead}>
                        <Text style={platform == "ios" ? styles.headTextIOS : styles.headText}>
                            {employee.empName}
                        </Text>
                        <View style={platform == "ios" ? styles.iconViewIOS : styles.iconView}>
                            {(employee.empBookStatus == 'ASSIGN' || employee.empBookStatus == 'INPROGRESS')?
                                <Image style={styles.statusIcon} source={statusIconNotBook} />
                                : (employee.empBookStatus == 'COMPLETED')?
                                <Image style={styles.statusIcon} source={statusIconBook} />
                                : null
                            }
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    (currOpenId == employee.empID) ?
                        <View style={styles.cardContent}>
                            <View style={styles.cardTextAddr}>
                                <Text style={[styles.cardText, styles.fontAddr]}>
                                    {employee.empHomeAddress}
                                </Text>
                            </View>
                            <View style={styles.cardAction}>
                                <View style={styles.leftSec}>
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        {employee.empPhoneNumber ? employee.empPhoneNumber : 'No Contact'}
                                    </Text>
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                    {employee.type == 'LOGIN'?'Check-In': 'Check-Out'}: {employee.tripTime ? employee.tripTime : 'No CheckIn'}
                                    </Text>
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        Pick         : {employee.pickupTime ? employee.pickupTime : 'No Pick'}
                                    </Text>
                                </View>
                                <View style={styles.rightSec}>
                                    {
                                       (employee.empBookStatus == 'ASSIGN' || employee.empBookStatus == 'INPROGRESS') ?
                                            <RaisedTextButton
                                                title={buttonLabel}
                                                color={COLOR.BUTTON_COLOR_DRIVER}
                                                titleColor={COLOR.BUTTON_FONT_COLOR_DRIVER}
                                                onPress={() => this.tripAction(buttonLabel, employee.empID)}
                                                style={styles.buttonTrip}
                                                titleStyle={styles.titleStyle}
                                            /> :
                                            null
                                    }

                                </View>
                            </View>
                        </View>
                        :
                        <View></View>
                }
            </CardView>
        )
    }
}

const styles = StyleSheet.create({
    cardView: {
        backgroundColor: COLOR.CARD_BG_COLOR,
        width: wp('97%'),
        height: screenHgt >= hightVariation ? hp('5%') : hp('6%'),
        alignSelf: 'center',
        marginTop: 5,
        borderRadius: 10
    },
    cardViewChange: {
        backgroundColor: COLOR.CARD_BG_COLOR,
        width: wp('97%'),
        // height: hp('15%'),
        alignSelf: 'center',
        marginTop: 5,
        paddingBottom: 5,
        
    },
    cardHead: {
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },
    statusIcon: {
        height: 28,
        width: 34,
        right: 0,
    },
    iconView: {
        right: 10,
        paddingTop: 5,

    },
    iconViewIOS: {
        right: 10,
        paddingTop: 7,

    },
    headTextIOS: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR.HEADER_TXT_COLOR,
        paddingTop: 10,
    },
    headText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR.HEADER_TXT_COLOR,
        paddingTop: 6,
        paddingBottom: 6
    },
    cardContent: {
        // paddingLeft: 10,
        borderTopWidth: .5,
        borderTopColor: '#9A9C9B',
        width: wp('93%'),
        alignSelf: 'center',
        marginTop: 5
    },
    cardTextAddr: {
        borderBottomWidth: .5,
        borderBottomColor: '#9A9C9B',
        paddingTop:5,
        paddingBottom: 5
    },
    cardText: {
        color: COLOR.CARD_TXT_COLOR
    },
    leftSec: {
        flexDirection: 'column',
        paddingTop: 2,
        width: wp('46%')
    },
    textPadTop: {
        paddingTop: 2
    },
    cardAction: {
        flexDirection: 'row'
    },
    titleStyle: {
        fontSize: 12
    },
    buttonTrip: {
        borderRadius: 20,
        // marginBottom: 20,
        height: 18,
        marginTop: 25,
        width: wp('45%'),
        // marginLeft: 60
    },
    rightSec: {
        // justifyContent: 'space-between'
        width: wp('46%')
    },
    fontAddr: {
        fontSize: 14
    },
    // scrollview: {
    //     flexGrow: 1,
    // }
})
