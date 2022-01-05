import React from 'react';
import {View} from 'react-native';
import normalise from '../utils/helpers/normalize';
import PropTypes from 'prop-types';
import {Colors, Icons} from '../themes/Themes';
export default function Line(props) {
  return (
    <View
      style={{
        height: normalise(1),
        width: '100%',
        backgroundColor: props.color,
        marginTop: props.marginTop,
        alignSelf: 'center',
      }}></View>
  );
}
Line.propTypes = {
  marginTop: PropTypes.number,
  color: PropTypes.string,
};

Line.defaultProps = {
  marginTop: 0,
  color: '#C4C4C4',
};
