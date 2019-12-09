import React from "react";
import {
	Text, StyleSheet,
	View, TouchableOpacity
} from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default class CheckInTab extends React.PureComponent {

    constructor(props){
        super(props);
    }
    tabSwitch = (type) => {
        console.log('switch>>>', type)
        this.props.tabSwitch(type);
    }

    render() {
        let {checkInTabVisible} = this.props
        return (
            <View style={styles.checkinTab}>
                <TouchableOpacity onPress= {() => this.tabSwitch('checkin')}>
                    <View style={checkInTabVisible ? [styles.singleTab, styles.activeTab]: [styles.singleTab, styles.inActiveTab]}>
                        
                        <Text style={checkInTabVisible ? [styles.tabTextStyle, styles.activeTextStyle]: [styles.tabTextStyle]}>
                            CHECK-IN
                        </Text> 
                    </View>
                </TouchableOpacity>
                
                <TouchableOpacity onPress= {() => this.tabSwitch('checkout')}>
                    <View style={!checkInTabVisible ? [styles.singleTab, styles.activeTab]: [styles.singleTab, styles.inActiveTab]}>
                        
                        <Text style={!checkInTabVisible ? [styles.tabTextStyle, styles.activeTextStyle]: [styles.tabTextStyle]}>
                            CHECK-OUT
                        </Text>
                    
                    </View>
                </TouchableOpacity>
                
                        
                
            </View>
        )
    }
}
const styles = StyleSheet.create({
    checkinTab:{
        // flex: 1
        flexDirection: 'row',
        height: hp('4.3%'),
        backgroundColor: '#F9F9F9'
    },
    
    singleTab: {
        width: wp('50%'),
        alignItems: 'center',
        paddingTop: 8,
        height: hp('4.3%'),
        // textDecorationLine: 'underline'
    },
    activeTab: {
        borderBottomWidth: 1, 
        borderBottomColor: '#CA0B52',
    },
    tabTextStyle : {
        fontSize: 13,
        color: '#676767'
    },
    activeTextStyle: {
        color: '#333',
        fontWeight: 'bold'
    },
    inActiveTab: {
        borderBottomWidth: 0 ,
        borderBottomColor: '#fff'
    }

})