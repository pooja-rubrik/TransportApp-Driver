import React from "react";
import Modal from "react-native-modal";
import { View, Text, TouchableOpacity, StyleSheet, TextInput} from "react-native";
import { RaisedTextButton } from 'react-native-material-buttons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CodeInput from 'react-native-confirmation-code-input';

import COLOR from '../services/AppColor';
import STRCONSTANT from '../services/StringConstants';

export default class EnterOTP extends React.PureComponent {
    
    state = {
        enterOTP: '',
        disableSubmit: true,
    }
    
    closeModalFunc = (visible) => {
        console.log(visible)
		this.props.closeModalFunc(visible);
	}

    submitRequest = () => {
        this.props.submitOTP(this.state);
    }

    onFinishCheckingOTP = (code) => {
        console.log(code)
        this.setState({enterOTP: code, disableSubmit: false})
    }


	render() {
        let {disableSubmit} = this.state;
	    return (
		<Modal
            animationType='slide'
            visible={this.props.otpModalVisible}
        >
            <View>
                <View style={styles.modalView} >
                    {/* <TouchableOpacity
                        onPress={this.closeModalFunc}
                    >
                        <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity> */}
                    <View>
                        <View style={styles.TextInputView}>
                            <View>
                                <Text style={styles.headText}>
                                   ENTER OTP
                                </Text>
                                {/* <TextInput
                                    label=''
                                    value={`${enterOTP}`}
                                    style={styles.textInputStyles}
                                    labelFontSize={0}
                                    onChangeText={(enterOTP) => this.setState({ enterOTP })}
                                    placeholder='- - - - - -'
                                    lineWidth={0}
                                    activeLineWidth={0}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    placeholderTextColor={COLOR.PLACEHOLDER}
                                /> */}
                                <CodeInput
                                    ref="codeInputRef2"
                                    keyboardType="numeric"
                                    codeLength={6}
                                    className={'border-b'}
                                    autoFocus={true}
                                    space={10}
                                    size={15}
                                    onFulfill={(isValid, code) => this.onFinishCheckingOTP(isValid, code)}
                                    containerStyle={{ marginBottom: 20 }}
                                    codeInputStyle={{ paddingTop: 0 }}
                                    />
                           
                            </View>
                            <View style={styles.ButtonSubmit}>
                                <RaisedTextButton
                                    title={STRCONSTANT.SUBMIT}
                                    color={COLOR.BUTTON_COLOR_OTP}
                                    titleColor={COLOR.BUTTON_FONT_COLOR}
                                    onPress={this.submitRequest}
                                    style={styles.buttonEmail}
                                    titleStyle = {styles.titleStyle}
                                    disabled = {disableSubmit}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
	  );
	}
}

const styles = StyleSheet.create({
    modalView: {
		backgroundColor: COLOR.OTP_BG_COLOR,
		padding: 20,
		borderRadius: 5,
        height: hp('15%'),
        borderColor: COLOR.HEADER_BG_COLOR,
        borderWidth: .2,
        width: wp('45%'),
        alignSelf: 'center',
        opacity: .95
	},
	// closeText: {
	// 	backgroundColor: COLOR.APP_BG_COLOR,
	// 	color: COLOR.HEADER_BG_COLOR,
	// 	borderRadius: 17,
	// 	width: 32,
	// 	padding: 6,
	// 	alignSelf: 'flex-end',
	// 	textAlign: 'center',
	// 	borderWidth: 1,
	// 	borderColor: COLOR.HEADER_BG_COLOR,
	// 	marginRight: 0,
	// 	marginTop: 0
	// },
	ButtonSubmit: {
		alignSelf: 'center'
	},
	buttonEmail: {
		borderRadius: 20,
		width: wp('42%'),
        height: hp('2.5%'),
        marginTop: 10
    },
	headText:{
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    titleStyle:{
		fontSize: 10
	}
})