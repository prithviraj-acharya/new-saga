import React, {useState} from 'react';
import {View,TouchableOpacity, Image, ActivityIndicator, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

export default function ImageLoader(props){
  const [load, setLoad] = useState(true);
  const style = StyleSheet.create({
    container: {
      width: props.width,
      height: props.height,
      position: 'relative',
      borderColor: props.loaderBorderColor,
      borderWidth: load ? 1 : 0,
      borderRadius: props.borderRadius,
      marginLeft: props.marginLeft,
      marginRight: props.marginRight,
      marginTop: props.marginTop,
      marginBottom: props.marginBottom
    },
    image: {
      width: props.width,
      height: props.height,
      borderRadius: props.borderRadius,
    },
  });

  return (
    <TouchableOpacity style={[style.container, props.imageContainerStyle]} activeOpacity={.9} onPress={props.onPress}>
      <Image
        source={props.source}
        resizeMode={props.resizeMode}
        style={[style.image, props.imageStyle]}
        onLoadStart={() => setLoad(true)}
        onLoadEnd={() => setLoad(false)}
      />
      {load ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: props.backgroundColor,
          }}>
          <ActivityIndicator
            size={props.loaderSize}
            color={props.loaderColor}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              margin: 'auto',
            }}
          />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};


ImageLoader.propTypes = {
  width:PropTypes.any,
  height:PropTypes.any,
  loaderBorderColor:PropTypes.string,
  borderRadius:PropTypes.any,
  marginLeft:PropTypes.any,
  marginRight:PropTypes.any,
  marginTop:PropTypes.any,
  marginBottom:PropTypes.any,
  imageContainerStyle:PropTypes.any,
  imageStyle:PropTypes.any,
  source:PropTypes.any,
  resizeMode:PropTypes.string,
  loaderSize:PropTypes.any,
  loaderColor:PropTypes.string,
  onPress:PropTypes.func,
  backgroundColor:PropTypes.string,
};

ImageLoader.defaultProps = {
  width:0,
  height:0,
  loaderBorderColor:"#000000",
  borderRadius:0,
  marginLeft:0,
  marginRight:0,
  marginTop:0,
  marginBottom:0,
  imageContainerStyle:null,
  imageStyle:null,
  source:null,
  resizeMode:"cover",
  loaderSize:5,
  loaderColor:"#000000",
  onPress:()=>{},
  backgroundColor:"rgba(255,255,255,.3)"
}
