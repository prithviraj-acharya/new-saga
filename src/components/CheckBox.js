import React from 'react';
import {
    Image,
    TouchableOpacity
} from 'react-native';

import normalize from '../utils/helpers/normalize';
import PropTypes from 'prop-types';
import { Colors, Icons } from '../themes/Themes'

export default function CheckBox(props) {
    return (
        <TouchableOpacity onPress={() => props.onChange(!props.active)}
            activeOpacity={0.6}
            style={[{
                backgroundColor: Colors.white,
                borderColor: '#DDDDDD',
                borderWidth: normalize(1),
                borderRadius: normalize(3),
                width: normalize(20),
                height: normalize(20),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            },props.style]}
        >{
                props.active ?
                    <Image source={Icons.tick} style={{
                        height: normalize(14),
                        width: normalize(14),
                        marginTop: -normalize(2)
                    }} resizeMode="contain"></Image>
                    : null
            }
        </TouchableOpacity >

    )
};

CheckBox.propTypes = {
    onChange: PropTypes.func,
    active: PropTypes.bool,
    style:PropTypes.any
};


CheckBox.defaultProps = {
    onChange: () => { },
    active: false,
    style:null
}