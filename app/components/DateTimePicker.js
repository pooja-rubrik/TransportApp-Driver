import React from "react";
import DatePicker from 'react-native-datepicker';
import {StyleSheet} from 'react-native';
import moment from 'moment';
import calImg from '../assets/icons/calendar.png'
import clockImg from '../assets/icons/clock.png'

export default class DateTime extends React.PureComponent {

    constructor(props){
        super(props);
        this.currentDate = moment().add(this.props.dayAhead, 'days').toDate() ;
        if(this.props.futureDate){
            this.futureDate = moment().add(this.props.futureDate, 'days').toDate() ;
        } else {
            this.futureDate = moment(this.currentDate).add(1, 'Y').toDate();
        }
        

    }

    changeDate = (date) => {
        console.log('change', date)
        this.props.changeDate(date);
    }

	render() {
        return (
            (this.props.mode == 'date')?
            <DatePicker
                // style={{width: 200}}
                date={this.props.date}
                mode={this.props.datePickerMode}
                placeholder={this.props.placeholder}
                format={this.props.format}
                minDate= {this.currentDate}
                maxDate={this.futureDate} 
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                dateIcon: {
                    position: 'absolute',
                    right: 0,
                    // top: 4,
                    marginLeft: 0,
                    ...this.props.iconStyle
                },
                dateInput: {
                    marginLeft: 16,
                    borderColor: '#6a6a6a',
                    ...this.props.inputStyle
                },
                placeholderText: {
                    color: '#6a6a6a',
                    ...this.props.placeholderTextStyle
                },
                dateText: {
                    ...this.props.dateTextStyle
                }
                // ... You can check the source to find the other keys.
                }}
                onDateChange={this.changeDate}
                style = {[styles.dateView, {...this.props.style}]}
                iconSource = {calImg}
            />
            :
            <DatePicker
                // style={{width: 200}}
                date={this.props.date}
                mode='time'
                placeholder={this.props.placeholder}
                format={this.props.format}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                is24Hour = {true}
                customStyles={{
                dateIcon: {
                    position: 'absolute',
                    right: 0,
                    //  top: 4,
                    marginLeft: 0,
                    
                    ...this.props.iconStyle
                },
                dateInput: {
                    // marginLeft: 16,
                    borderColor: '#6a6a6a',
                    color: '#6a6a6a',
                    ...this.props.inputStyle
                },
                placeholderText: {
                    color: '#6a6a6a',
                    ...this.props.placeholderTextStyle
                },
                dateText: {
                    ...this.props.dateTextStyle
                }
                // ... You can check the source to find the other keys.
                }}
                onDateChange={this.changeDate}
                style ={[styles.dateView, {...this.props.style}]}
                locale={"SV"}
                minDate = {this.props.minDate}
                maxDate = {this.props.maxDate}
                minuteInterval={this.props.minuteInterval}
                hourInterval = {this.props.hourInterval}
                iconSource = {clockImg}
            />
        
	  );
	}
}
const styles = StyleSheet.create({
    dateView: {
        // height: 10,
        // width: 160,
        //color: '#6a6a6a',
        
    }
})
