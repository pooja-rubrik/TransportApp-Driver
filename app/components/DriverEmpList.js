import React from "react";
import {
    Text, StyleSheet,
    View, Image, ScrollView
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview'
import { RaisedTextButton } from 'react-native-material-buttons';
import { Dimensions } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";

import statusIconBook from '../assets/icons/cabbooked.png'
import statusIconNotBook from '../assets/icons/cabnotbooked.png'
import STRCONSTANT from '../services/StringConstants';
import COLOR from '../services/AppColor';
import EnterOTP from "./EnterOTP";
// const { height } = Dimensions.get('window');

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
            // contentInsetBottom: 320
        }
    }

    componentDidMount() {
        console.log(this.props)
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
        console.log(otpData)
        this.setState({ otpModalVisible: false })
        this.props.tripAction(STRCONSTANT.DRIVER_END_TRIP, this.state.currEndTripEmp, otpData.enterOTP);
    }

    // onContentSizeChange = (contentWidth, contentHeight) => {
    //     // Save the content height in state
    //     this.setState({ screenHeight: contentHeight });
    // };


    render() {
        let { otpModalVisible } = this.state;
        let { empData, assignType } = this.props;
        
        empList = empData.length != 0 ?
            empData.map((employee, index) => {
            employee.show = 0;
                return (
                    (assignType == employee.type) ?
                        <DriverEmployee employee={employee} tripAction={this.tripAction} key={index} />
                        // <Text style = {{height: hp('25%')}}>{employee.empName}</Text>
                        :
                        null
                )
            }) :
           null
            // console.log(empList)
        return (
            <View>
                {/* <ScrollView
                    // style = {{flex: 1,}}
                    // contentInset={{top:0, bottom: this.state.contentInsetBottom }}
                    // automaticallyAdjustContentInsets={false}
                > */}
                    {(empList == null || empList[0] == null)? 
                    <CardView
                        cardElevation={4}
                        cardMaxElevation={4}
                        cornerRadius={5}
                        style={styles.cardView}>
                        <View style={styles.cardHead}>
                            <Text style={styles.headText}>
                                No Employee!
                            </Text>
                        </View>
                    </CardView>:
                    empList
                   }
                {/* </ScrollView> */}
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
        console.log(this.props)
    }

    expandCard = (isExpand, currId) => {
        console.log('>>>>>>', isExpand, currId)
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
        }
        this.setState({ buttonLabel: STRCONSTANT.DRIVER_END_TRIP })
        console.log('call parent from child>>>')
        this.props.tripAction(action, empID, isOTPOpen);
    }

    render() {
        let { isExpand, currOpenId, buttonLabel } = this.state;
        let { employee } = this.props;
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
                        <Text style={styles.headText}>
                            {employee.empName}
                        </Text>
                        {(employee.empBookStatus == 'ASSIGN' || employee.empBookStatus == 'INPROGRESS')?
                            <View style={styles.iconView}>
                                <Image style={styles.statusIcon} source={statusIconNotBook} />
                            </View>
                            : (employee.empBookStatus == 'COMPLETED')?
                            <View style={styles.iconView}>
                                <Image style={styles.statusIcon} source={statusIconBook} />
                            </View> 
                            : null
                        }
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
                                        {employee.empPhoneNumber}
                                    </Text>
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        CHECK-IN: {employee.tripTime}
                                    </Text>
                                    <Text style={[styles.cardText, styles.textPadTop]}>
                                        PICK:          {employee.tripTime}
                                    </Text>
                                </View>
                                <View style={styles.rightSec}>
                                    {
                                       (employee.empBookStatus == 'ASSIGN') ?
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
        backgroundColor: '#94EBC5',
        width: wp('98%'),
        height: hp('5%'),
        alignSelf: 'center',
        marginTop: 5,
        borderRadius: 10
    },
    cardViewChange: {
        backgroundColor: '#94EBC5',
        width: wp('98%'),
        // height: hp('15%'),
        alignSelf: 'center',
        marginTop: 5,
        paddingBottom: 5,
        
    },
    cardHead: {
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    statusIcon: {
        height: 28,
        width: 30,
        right: 0,
    },
    iconView: {
        right: 10,
        paddingTop: 7,

    },
    headText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#375346',
        paddingTop: 10
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

    },
    cardText: {
        color: '#406353'
    },
    leftSec: {
        flexDirection: 'column',
        paddingTop: 2
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
        marginTop: 15,
        width: wp('48%'),
        marginLeft: 60
    },
    rightSec: {
        // justifyContent: 'space-between'
    },
    fontAddr: {
        fontSize: 14
    },
    // scrollview: {
    //     flexGrow: 1,
    // }
})
