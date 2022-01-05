import React from 'react';
import {View, Image} from 'react-native';
import MyStatusBar from '../../utils/MyStatusBar';
import normalise from '../../utils/helpers/dimen';
import {Images, Colors} from '../../themes/Themes';

export default function Splash(props) {
  return (
    <View style={{flex: 1}}>
      <MyStatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />

      <View
        source={Images.bg1}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        resizeMode="stretch">
        <Image
          source={Images.Logo}
          style={{
            height: normalize(150),
            width: normalise(150),
            alignSelf: 'center',
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
