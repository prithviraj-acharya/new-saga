import React from 'react';
import { ActivityIndicator, SafeAreaView, Dimensions, Image, View } from 'react-native';
import PropTypes from 'prop-types';
import { Colors, Images } from '../../themes/Themes';
import normalize from './normalize';
import Icons from '../../themes/Icons';

export default function Loader(props) {

    return (
        props.visible ?
            <View
                style={[{
                    position: 'absolute',
                    backgroundColor: 'rgba(1,1,1,.5)', zIndex: 999, top: 0, left: 0,
                    height: Dimensions.get('screen').height, width: '100%', alignItems: 'center',
                    justifyContent: 'center'
                }, props.modal == true ? { height: '133%', width: '116.5%', borderRadius:normalize(15) } : null]}>
                <View style={{
                    backgroundColor: Colors.white,
                    height: normalize(65),
                    width: normalize(80),
                    borderRadius: normalize(10),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:'center',
                    position: 'relative'
                }}>
                    <ActivityIndicator size={60} color={Colors.red} />
                </View>

            </View> : null
    );
}

Loader.propTypes = {

    visible: PropTypes.bool,
    modal: PropTypes.bool,
};

Loader.defaultProps = {
    modal: false,
    visible: false,
};
