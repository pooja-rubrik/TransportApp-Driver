import React, { Component } from "react";
import {
	Text, StyleSheet,
	Platform, View
} from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CardView from 'react-native-cardview'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

// import { PaperMenu2 } from '../components/HeaderDropdowniOS';
// import { HeaderMenu, Item } from '../components/HeaderDropdownAndroid';
import Wallpapers from "../components/Wallpaper";
import { ScrollView } from "react-native-gesture-handler";
// import { deviceType } from '../stylesheets/AppDimensions';

const platform = Platform.OS;
class DriverViewEmployee extends Component {
    constructor(props) {
		super(props);
		this.usersStore =  this.props.rootStore.usersStore;
		this.mapStore = this.props.rootStore.mapStore;
		
		console.log(toJS(this.usersStore.users.filterEmployees));
		this.assignType = this.props.navigation.getParam('assignType', 'LOGIN')
		// this.markerArr = ["IT Park, Dehradun", "Touch wood school, dehradun"]
		// this.markerArr = this.usersStore.users.filterEmployees.map(emp => emp.empHomeAddress);
		this.markerArr = [];
		this.usersStore.users.filterEmployees.forEach(emp => {
			if(emp.type == this.assignType) {
				console.log('found>>')
				this.markerArr.push(emp.empHomeAddress)
			}
			
		})
		console.log(this.markerArr);
		
    }
    
    static navigationOptions = ({ navigation }) => ({
		title: 'Employee List'
    });
    
    componentDidMount() {
        Geocoder.init(this.mapStore.mapData.currentAPIKey);
        this.markerArr.map(address => {
            //console.log(address)
            Geocoder.from(address)
			.then(json => {
				var location = json.results[0].geometry.location;
				console.log('location>>>', json,location)
				//console.log(location);
				this.mapStore.locateMap(location, 'driver', address);
			})
			.catch(error => console.warn(error));
        })
		// console.log(toJS(this.usersStore.users))
    }
    

    render() {
		var startPoints = toJS(this.mapStore.driverMarkers) ? 
		toJS(this.mapStore.driverMarkers).map((item, index)=>{
        return <MapView.Marker coordinate={item.coordinates} key={index}
                title = {item.title}
            />
		}) : null;
		empList = this.usersStore.users.filterEmployees.length !=0 ?
		this.usersStore.users.filterEmployees.map((employee, index) => (
			(this.assignType == employee.type) ?
			<CardView
				cardElevation={4}
				cardMaxElevation={4}
				cornerRadius={5}
				style={styles.cardView}
				key={index}>
				<Text style={styles.cardText}>
					Name :  {employee.empName}
				</Text>
				<Text style={styles.cardText}>
					Contact : {employee.empPhoneNumber}
				</Text>
				<Text style={styles.cardText}>
					Address : {employee.empHomeAddress}
				</Text>
				<Text style={styles.cardText}>
					Pickup : {employee.tripTime}
				</Text>
			</CardView>
			: 
			null
		)):
		<CardView
			cardElevation={4}
			cardMaxElevation={4}
			cornerRadius={5}
			style={styles.cardViewEmpty}
			>
			<Text style={styles.cardText}>
				No Employee!
			</Text>
		</CardView>
        return(
            <Wallpapers>
				{
					this.usersStore.users.filterEmployees.length !=0 ?
					<View style={styles.rootContainer}>
						<MapView
							provider={PROVIDER_GOOGLE}
							style={styles.map}
							showsUserLocation={true}
							showsMyLocationButton={true}
							scrollEnabled={true}
							followsUserLocation={true}
							zoomEnabled={true}
							pitchEnabled={true}
							rotateEnabled={true}
							region={toJS(this.mapStore.mapData.region)}
						>
						{startPoints}
						</MapView>
					</View>
					: <View></View>
				}
				<ScrollView>
				{ empList }
				</ScrollView>
			
				{/* <CardView
					cardElevation={4}
					cardMaxElevation={4}
					cornerRadius={5}
					style={styles.cardView}>
					<Text style={styles.cardText}>
                        Name :  Employee1
                    </Text>
					<Text style={styles.cardText}>
						Contact : xxxx
					</Text>
					<Text style={styles.cardText}>
						Address : xxxxxxxxx
					</Text>
					<Text style={styles.cardText}>
						Pickup : xxxxxxxxx
					</Text>
				</CardView>
				<CardView
					cardElevation={4}
					cardMaxElevation={4}
					cornerRadius={5}
					style={styles.cardView}>
					<Text style={styles.cardText}>
                        Name :  Employee1
                    </Text>
					<Text style={styles.cardText}>
						Contact : xxxx
					</Text>
					<Text style={styles.cardText}>
						Address : xxxxxxxxx
					</Text>
					<Text style={styles.cardText}>
						Pickup : xxxxxxxxx
					</Text>
				</CardView>
                <CardView
					cardElevation={4}
					cardMaxElevation={4}
					cornerRadius={5}
					style={styles.cardView}>
					<Text style={styles.cardText}>
                        Name :  Employee1
                    </Text>
					<Text style={styles.cardText}>
						Contact : xxxx
					</Text>
					<Text style={styles.cardText}>
						Address : xxxxxxxxx
					</Text>
					<Text style={styles.cardText}>
						Pickup : xxxxxxxxx
					</Text>
				</CardView> */}
			</Wallpapers>
        )
    }
}
const styles = StyleSheet.create({
	rootContainer: {
		width: wp('90%'),
		alignSelf: 'center',
	},
	map: {
		top: 10,
		height: hp('28%'),
		marginBottom: 10
	},
	cardView: {
		backgroundColor: 'white',
		width: wp('90%'),
		height: hp('15%'),
		alignSelf: 'center',
		marginTop: 10,
		paddingTop: 10
	},
	cardViewEmpty: {
		backgroundColor: 'white',
		width: wp('90%'),
		height: hp('5%'),
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
})


export default inject("rootStore")(observer(DriverViewEmployee));