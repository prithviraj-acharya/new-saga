import React from 'react';
import {
    Text,
    TouchableOpacity
} from 'react-native';

import normalise from '../utils/helpers/normalize';
import PropTypes from 'prop-types';
import { Colors, Fonts } from '../themes/Themes'

export default function Button(props) {

    function onPress() {
        if (props.onPress) {
            props.onPress()
        }
    }

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            style={{
                height: props.height, width: props.width, borderRadius: props.borderRadius,
                backgroundColor: props.backgroundColor,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: props.alignSelf, marginTop: props.marginTop, marginBottom: props.marginBottom,
                marginHorizontal: props.marginHorizontal, borderWidth: props.borderWidth,
                borderColor: props.borderColor, opacity: props.opacity
            }} onPress={() => { onPress() }}>
            {
                props.children && props.children != "" ?
                    props.children
                    :
                    <Text style={{
                        color: props.textColor,
                        fontSize: props.fontSize,
                        fontFamily: props.fontFamily,
                        marginTop: props.textMarginTop,
                        lineHeight: props.fontSize+normalise(2),
                        textAlign: 'center',
                    }} numberOfLines={2}>{props.title}</Text>
            }


        </TouchableOpacity>

    )
};

Button.propTypes = {
    height: PropTypes.number,
    width: PropTypes.any,
    backgroundColor: PropTypes.string,
    borderRadius: PropTypes.number,
    textColor: PropTypes.string,
    fontSize: PropTypes.number,
    title: PropTypes.string,
    onPress: PropTypes.func,
    alignSelf: PropTypes.string,
    marginTop: PropTypes.number,
    marginBottom: PropTypes.number,
    marginHorizontal: PropTypes.number,
    borderColor: PropTypes.string,
    borderWidth: PropTypes.number,
    fontFamily: PropTypes.string,
    opacity: PropTypes.number
};


Button.defaultProps = {
    height: normalise(40),
    backgroundColor: Colors.pink,
    borderRadius: normalise(5),
    textColor: Colors.white,
    fontSize: normalise(14),
    title: "",
    onPress: null,
    alignSelf: null,
    marginTop: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    width: "100%",
    borderColor: '',
    borderWidth: 0,
    fontFamily: Fonts.Montserrat_SemiBold,
    opacity: 1
}