import React, { Component } from "react";
// import { createAppContainer } from 'react-navigation';
import {
  StatusBar
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
// import Geocoder from 'react-native-geocoding';

import RootStore, { Provider } from './app/mobx/store';
import RootNavigator from './app/RootNavigator';
import ApiService from './app/services/ApiService';
import StorageService from './app/services/StorageService';

const rootStore = new RootStore();

class App extends Component {

	async componentWillMount() {
		console.log('component mounted>>>>API', rootStore.mapStore.mapData.currentAPIKey );
    SplashScreen.hide();
    await StorageService.retrieveData('oAuthHeader').then( data => {
      if(data) {
        console.log('usertoken22>>>>',JSON.parse(data));
        ApiService.addHeader(JSON.parse(data))
        // (async () => {
        //   await rootStore.usersStore.getAllEmployee();
        //   await rootStore.usersStore.getUtility();
        // })();
      }
      
    })
    // Geocoder.init(rootStore.mapStore.mapData.currentAPIKey);
    // await StorageService.retrieveData('driver_data').then( data => {
    //     // console.log('users_dataaaa>>', data);
    //     const vehicleNo = data ? JSON.parse(data).vehicleNumber : '';
      
    //     console.log('vehicleNo>>',vehicleNo);
    //     // This will switch to the App screen or Auth screen and this loading
    //     // screen will be unmounted and thrown away.
    //     if( vehicleNo ) {
          // (async () => {
            await rootStore.usersStore.getAllEmployee();
            await rootStore.usersStore.getUtility();
          // })();
    //     }
    // });
    
	}

  onCLose = () => {
    StatusBar.setHidden(true);
  };

  render() {
      return (
      <Provider 
        rootStore={rootStore}
      >
        <RootNavigator />
      </Provider>
      );
  }
}

export default App