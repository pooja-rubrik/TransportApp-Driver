// import React from "react";
import {observable, action, toJS} from 'mobx';
import Constants from '../services/Constants';
import Dimensions from '../stylesheets/AppDimensions';

class MapStore {
	constructor(){
		console.log(Dimensions)
		this.currentAPIKey =   Dimensions.current_platform? Constants.API_KEY_ANDROID: Constants.API_KEY_IOS;
	}
	
	@observable mapData =  {
		region: {
			  latitude: Constants.LATITUDE,
			  longitude: Constants.LONGITUDE,
			  latitudeDelta: Constants.LATITUDE_DELTA,
			  longitudeDelta: Constants.LONGITUDE_DELTA,
		},
		currentAPIKey: this.currentAPIKey
	};

	@observable driverMarkers =  [];
   
	@action async locateMap(position, from_login, address) {
		try {
			this.mapData.region.latitude = position.lat;
			this.mapData.region.longitude = position.lng;
			if( from_login == "driver" ) {
				this.driverMarkers.push({ coordinates:{ latitude: position.lat, longitude: position.lng}, title: address })
			} 
			
			
        } catch (e) {
			console.log('data users failed>>>', e);
        }
	}
	
	@action emptyMarkers(){
		this.driverMarkers = [];
	}

}

export default MapStore
                        