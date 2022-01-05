import React from 'react';
import {Text, TouchableOpacity, Image, View} from 'react-native';

import normalize from '../utils/helpers/normalize';
import PropTypes from 'prop-types';
import {Colors, Fonts} from '../themes/Themes';

export default function Nav_Link(props) {
  return (
    <TouchableOpacity
      activeOpacity={props.opacity}
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
          borderBottomColor: '#C4C4C4',
          borderBottomWidth: normalize(1),
          paddingVertical: normalize(12),
          alignItems: 'center',
          position: 'relative',
        },
        props.border == false ? {borderBottomWidth: 0} : null,
      ]}
      onPress={props.onPress}>
      <Image
        source={props.icon}
        style={{
          height: normalize(25),
          width: normalize(25),
          marginRight: normalize(15),
        }}
        resizeMode="contain"></Image>
      <Text
        style={{
          fontFamily: Fonts.Montserrat_Regular,
          color: Colors.black,
          fontSize: normalize(15),
          lineHeight: normalize(15),
        }}>
        {props.title}
      </Text>
      {props.lang ? (
        <View
          style={{
            position: 'absolute',
            width: normalize(60),
            borderColor: Colors.red,
            borderWidth: normalize(1),
            height: normalize(30),
            right: 0,
            top: normalize(10),
            backgroundColor: Colors.red,
            borderRadius: normalize(5),
            display: 'flex',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => props.onLanguageChange(1)}
            style={[
              {
                width: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
              props.isEng == true
                ? {
                    backgroundColor: Colors.white,
                    borderTopLeftRadius: normalize(5),
                    borderBottomLeftRadius: normalize(5),
                  }
                : null,
            ]}
            activeOpacity={1}>
            <Text
              style={[
                {
                  fontFamily: Fonts.Montserrat_Bold,
                  fontSize: normalize(14),
                  lineHeight: normalize(16),
                  color: Colors.white,
                },
                props.isEng == true ? {color: '#C4C4C4'} : null,
              ]}>
              Fr
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.onLanguageChange(2)}
            activeOpacity={1}
            style={[
              {
                width: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
              props.isEng == false
                ? {
                    backgroundColor: Colors.white,
                    borderTopRightRadius: normalize(5),
                    borderBottomRightRadius: normalize(5),
                  }
                : null,
            ]}>
            <Text
              style={[
                {
                  fontFamily: Fonts.Montserrat_Bold,
                  fontSize: normalize(14),
                  lineHeight: normalize(16),
                  color: Colors.white,
                },
                props.isEng == false ? {color: '#C4C4C4'} : null,
              ]}>
              En
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

Nav_Link.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.string,
  onPress: PropTypes.func,
  border: PropTypes.bool,
  isEng: PropTypes.bool,
  lang: PropTypes.bool,
  onLanguageChange: PropTypes.func,
  opacity: PropTypes.number,
};

Nav_Link.defaultProps = {
  icon: null,
  title: '',
  onPress: () => {},
  onLanguageChange: () => {},
  border: true,
  isEng: false,
  lang: false,
  opacity: 0.8,
};
