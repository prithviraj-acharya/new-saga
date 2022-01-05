import React, {useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
} from 'react-native';
import {Icons, Images, Colors, Fonts} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';
import PropTypes from 'prop-types';

export default function Header(props) {
  return (
    <>
      <View style={[style.headerContainer]}>
        <View
          style={{
            width: normalize(30),
          }}>
          {props.back ? (
            <TouchableOpacity
              style={{}}
              onPress={() =>
                props.backPress ? props.backPress() : props.navigation.goBack()
              }>
              <Image
                style={{height: normalize(15)}}
                source={Icons.left_arrow}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
          {props.close ? (
            <TouchableOpacity
              style={{marginLeft: normalize(10)}}
              onPress={() => props.navigation.goBack()}>
              <Image
                style={{height: normalize(15), width: normalize(15)}}
                source={Icons.close}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={props.center == true ? {flex: 1} : null}>
          {props.logo == false ? (
            <Text
              style={[
                {
                  fontFamily: Fonts.Montserrat_Bold,
                  fontSize:
                    props.center == true ? normalize(12) : normalize(15),
                  lineHeight: normalize(15),
                  color: Colors.black,
                  textTransform: 'uppercase',
                  textAlign: props.center == true ? 'center' : 'left',
                },
                props.center == true ? {flex: 1,paddingRight:normalize(5)} : null,
              ]}
              numberOfLines={2}>
              {props.title}
            </Text>
          ) : (
            <Image
              style={{height: normalize(40), width: normalize(100)}}
              source={Images.Logo}
              resizeMode="contain"
            />
          )}
        </View>
        <View
          style={{
            width: normalize(30),
            height: normalize(20),
          }}>
          {props.query ? (
            <TouchableOpacity
              onPress={props.queryPress}
              activeOpacity={0.8}
              style={{width: normalize(30)}}>
              <Image
                style={{height: normalize(20), width: normalize(20)}}
                source={Icons.query}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
          {props.add ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{width: normalize(30)}}
              onPress={props.addPress}>
              <Image
                style={{height: normalize(18), width: normalize(18)}}
                source={Icons.plus}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
          {props.download ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{width: normalize(30)}}
              onPress={props.downloadPress}>
              <Image
                style={{height: normalize(16), width: normalize(16)}}
                source={Icons.download}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
          {props.down ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{width: normalize(30)}}
              onPress={props.downPress}>
              <Image
                style={{height: normalize(16), width: normalize(16)}}
                source={Icons.down_arrow}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  query: PropTypes.bool,
  back: PropTypes.bool,
  logo: PropTypes.bool,
  add: PropTypes.bool,
  close: PropTypes.bool,
  download: PropTypes.bool,
  down: PropTypes.bool,
  center: PropTypes.bool,
  queryPress: PropTypes.func,
  addPress: PropTypes.func,
  backPress: PropTypes.func,
  downloadPress: PropTypes.func,
  downPress: PropTypes.func,
};
Header.defaultProps = {
  title: '',
  query: false,
  back: false,
  logo: false,
  add: false,
  close: false,
  download: false,
  down: false,
  center: false,
  queryPress: () => {},
  addPress: () => {},
  downloadPress: () => {},
  downPress: () => {},
  backPress: null,
};

const style = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(10),
    height: normalize(50),
    paddingTop: normalize(10),
    backgroundColor: Colors.white,
    borderBottomWidth: normalize(1),
    borderBottomColor: '#DADADA',
  },
});
