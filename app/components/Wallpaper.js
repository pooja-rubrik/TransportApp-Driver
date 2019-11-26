import React, { Component } from "react";
import { StyleSheet} from "react-native";
import { View } from "react-native-animatable";
import COLOR from '../services/AppColor';

export default class Wallpaper extends Component {
  render() {
    return (
      // <Fragment>
        // <SafeAreaView>
          // <ImageBackground style={styles.picture} source={bgSrc}>
          //     {this.props.children}
          // </ImageBackground>
          <View style={styles.picture}>
             {this.props.children}
          </View>
        // </SafeAreaView>
        
      // </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    flex: 1,
    // width: null,
    // height: null,
    // resizeMode: "cover"
    backgroundColor: COLOR.ROOT_BG_COLOR
  }
});
