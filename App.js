import React, { Component } from "react";
// import { createAppContainer } from 'react-navigation';
import {
  StatusBar
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
// import Geocoder from 'react-native-geocoding';

import RootStore, { Provider } from './app/mobx/store';
import RootNavigator from './app/RootNavigator';

const rootStore = new RootStore();

// const AppContainer = createAppContainer(RootNavigator);

class App extends Component {

	async componentDidMount() {
		console.log('component mounted>>>>API', rootStore.mapStore.mapData.currentAPIKey );
    SplashScreen.hide();
    // Geocoder.init(rootStore.mapStore.mapData.currentAPIKey);
     await rootStore.usersStore.getAllEmployee();
     await rootStore.usersStore.getUtility();
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