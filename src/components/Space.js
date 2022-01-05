import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Colors, Images } from '../themes/Themes';
import normalize from '../utils/helpers/normalize';
import PropTypes from 'prop-types';


export default function Space(props) {
    return (
        <View style={{
            height: props.size,
            width: 10,
        }}>

        </View>
    )
}
Space.propTypes = {
    size: PropTypes.number,
}

Space.defaultProps = {
    size: 0,
}
