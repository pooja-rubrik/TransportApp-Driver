import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

// import pages
import Login from './views/Login';
import DriverRegister from './views/DriverRegister';
import AuthLoadingScreen from './views/AuthLoading';

//import constants
import COLOR from './services/AppColor';
import DriverProfile from './views/DriverProfile';
import Home from './views/Home';

const DriverAppStack = createStackNavigator(
  {
    HomeScreen: {screen: Home},
    DriverProfileScreen: { screen: DriverProfile},
  },
  {
    defaultNavigationOptions: {
      title: 'RUBRIK CAB',
      headerStyle: {
        backgroundColor: COLOR.HEADER_BG_COLOR,
      },
      headerTintColor: COLOR.HEADER_FONT_COLOR,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerBackTitle: null,
    },
  }
)



const AuthStack = createStackNavigator(
  {
    
    LoginScreen: { screen: Login },
    DriverRegisterScreen: { screen: DriverRegister },

    // DriverHomeScreen: { screen: DriverHome },
    // DriverProfileScreen: { screen: DriverProfile },
    // DriverViewEmployeeScreen: { screen: DriverViewEmployee },

  }, {
  defaultNavigationOptions: {
    title: 'RUBRIK CAB',
    headerStyle: {
      backgroundColor: COLOR.HEADER_BG_COLOR,
    },
    headerTintColor: COLOR.HEADER_FONT_COLOR,
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 18
    },
    headerBackTitle: null,
  },
}
)
export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    DriverApp: DriverAppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: "AuthLoading",
  }
));

// export default RootNavigator;