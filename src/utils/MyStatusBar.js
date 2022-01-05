//import liraries
import React from "react";
import { View, StatusBar, Platform, StyleSheet, SafeAreaView } from "react-native";
import propTypes from "prop-types";
import normalise from '../utils/helpers/normalize';
import {Colors} from '../themes/Themes'

// const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const MyStatusBar = ({ backgroundColor, barStyle, ...props }) => (
  
  <SafeAreaView style={[styles.statusBar, { backgroundColor }]}>
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        barStyle={barStyle}      
        hidden={false} />
    {/* </SafeAreaView> */}
  </SafeAreaView>
);



export default MyStatusBar;
MyStatusBar.propTypes = {
  backgroundColor: propTypes.string,
  barStyle: propTypes.string,
  height: propTypes.number,
};

MyStatusBar.defaultProps = {
  backgroundColor: Colors.greenBg,
  barStyle: "dark-content",
  height: normalize(20),
};

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});