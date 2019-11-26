import { Dimensions } from "react-native";
import { Platform } from "react-native";

//var deviceHeight = Dimensions.get("window").height;
//var deviceWidth = Dimensions.get("window").width;
//const { width, height } = Dimensions.get("window");

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const platform = Platform.OS;

const isAndroid = platform !== "ios";

// Use iPhone6 as base size which is 375 x 667
const baseWidth = 375;
const baseHeight = 667;

// const baseWidth = deviceWidth;
// const baseHeight = deviceHeight;


const scaleWidth = deviceWidth / baseWidth;
const scaleHeight = deviceHeight / baseHeight;
const scale = Math.min(scaleWidth, scaleHeight);
export const aspectRatio = deviceHeight/deviceWidth;

//export const aspectRatio;
export const deviceType = (aspectRatio>1.6) ? 'iphone': 'ipad';

export const scaledSize = size => Math.ceil(size * scale);

export default {
  //LOGIN DIMENSIONS//
  // current_platform: isAndroid,
  // device_platform: "ios",

  current_platform: isAndroid,
  device_platform: platform.OS,

  LOGO_HEIGHT: scaledSize(80),
  LOGO_WIDTH: deviceWidth * 0.4,
  CONTAINER_LOGIN_MARGINLEFT: deviceWidth * 0.15,
  CONTAINER_LOGIN_MARGINRIGHT: deviceWidth * 0.15,

  //FONT SIZES//
  font_username: scaledSize(15),
  font_animated: scaledSize(12),

  BUTTON_WIDTH: deviceWidth * 0.82,
  BUTTON_FONT_SIZE: scaledSize(20),
  DEVICE_HEIGHT: deviceHeight,
  DEVICE_WIDTH: deviceWidth
};
