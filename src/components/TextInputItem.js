import React from 'react';
import {View, Image, TextInput} from 'react-native';
import normalise from '../utils/helpers/normalize';
import PropTypes from 'prop-types';

import {Colors, Fonts} from '../themes/Themes';

export default function TextInputItem(props) {
  function onChangeText(text) {
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  }

  function onFocus() {
    if (props.onFocus) {
      props.onFocus();
    }
  }

  function onBlur() {
    if (props.onBlur) {
      props.onBlur();
    }
  }

  return (
    <View
      style={[
        {
          height: props.multiline == true ? props.height : normalise(42),
          borderColor: props.borderColor,
          borderWidth: normalize(1),
          borderRadius: props.borderRadius,
          marginTop: props.marginTop,
          position: 'relative',
          backgroundColor: '#FDFCFC',
        },
        props.flex ? {flex: props.flex} : {width: '100%'},
        props?.marginRight!=0?{marginRight:props.marginRight}:null
      ]}>
      <TextInput
        style={[
          {
            paddingLeft: props.paddingLeft,
            paddingRight: props.paddingRight,
            marginLeft: props.marginLeft,
            flex: 1,
            textAlign: props.textAlign,
            letterSpacing: normalise(props.letterSpacing),
            color: props.color,
            fontFamily: Fonts.Montserrat_SemiBold,
            fontSize: normalise(props.fontSize),
          },
          props.icon ? {paddingRight: normalise(40)} : null,
          props.multiline == true
            ? {paddingTop: props.paddingTop, textAlignVertical: 'top'}
            : null,
        ]}
        caretHidden={props.caretHidden}
        maxLength={props.maxLength}
        secureTextEntry={props.isSecure}
        multiline={props.multiline}
        autoCapitalize={props.autoCapitalize}
        placeholder={props.placeholder}
        editable={props.editable}
        placeholderTextColor={props.placeholderTextColor}
        keyboardType={props.keyboardType}
        value={props.value}
        onChangeText={text => {
          onChangeText(text);
        }}
      />
      {props.icon ? (
        <Image
          source={props.icon}
          style={{
            height: normalise(22),
            width: normalise(22),
            position: 'absolute',
            right: normalise(12),
            top: normalise(8),
          }}
          resizeMode="contain"
        />
      ) : null}
    </View>
  );
}

TextInputItem.propTypes = {
  marginTop: PropTypes.number,
  marginRight: PropTypes.number,
  maxLength: PropTypes.number,
  isSecure: PropTypes.bool,
  multiline: PropTypes.bool,
  autoCapitalize: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  keyboardType: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  color: PropTypes.string,
  letterSpacing: PropTypes.number,
  fontSize: PropTypes.number,
  editable: PropTypes.bool,
  borderColor: PropTypes.string,
  fontWeight: PropTypes.string,
  textAlign: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  caretHidden: PropTypes.bool,
  borderRadius: PropTypes.any,
  icon: PropTypes.any,
  height: PropTypes.number,
  flex: PropTypes.number,
  paddingLeft:PropTypes.any,
  paddingRight:PropTypes.any,
  marginLeft:PropTypes.any,
  paddingTop: PropTypes.any,
};

TextInputItem.defaultProps = {
  marginTop: 0,
  marginRight: 0,
  maxLength: 40,
  isSecure: false,
  multiline: false,
  autoCapitalize: 'none',
  placeholder: '',
  placeholderTextColor: '#999999',
  keyboardType: 'default',
  value: '',
  onChangeText: null,
  color: Colors.black,
  editable: true,
  borderColor: '#DDDDDD',
  onFocus: null,
  onBlur: null,
  letterSpacing: 0,
  fontSize: 12,
  textAlign: 'left',
  caretHidden: false,
  borderRadius: normalise(10),
  icon: null,
  height: normalise(100),
  flex: null,
  paddingLeft: normalise(3),
  paddingRight: normalise(14),
  marginLeft: normalise(10),
  paddingTop: normalise(10)
};
