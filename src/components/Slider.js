import React, {useState, useEffect} from 'react';
import {FlatList, View, StyleSheet,TouchableOpacity} from 'react-native';
import {Colors} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';
import PropTypes from 'prop-types';
let crIndex = 0;
let st = null;
export default function Slider(props) {
  const [activeSlide, setActiveSlide] = useState(0);
  const flatRef = React.useRef();
  const onViewRef = React.useRef(viewableItems => {
    if (viewableItems.viewableItems[0]) {
      setActiveSlide(viewableItems.viewableItems[0].index);
      crIndex = viewableItems.viewableItems[0].index;
      if (props.automatic == true) {
        clearTimeout(st);
        st = setTimeout(() => {
          let dLength = props.data.length - 1;
          if (flatRef && flatRef.current) {
            if (dLength == crIndex) {
              flatRef.current.scrollToIndex({index: 0});
            } else {
              flatRef.current.scrollToIndex({
                index: crIndex ? crIndex + 1 : 1,
              });
            }
          }
        }, 5000);
      }
      props.currnetIndex(viewableItems.viewableItems[0].index);
    }
  });
  const viewConfigRef = React.useRef({
    viewAreaCoveragePercentThreshold: props.scroll,
  });
  return (
    <View style={[style.sliderContainer, props.sliderStyle]}>
      <FlatList
        ref={flatRef}
        horizontal
        pagingEnabled={props.pagination}
        legacyImplementation={false}
        onViewableItemsChanged={onViewRef.current}
        keyExtractor={(_, index) => index.toString()}
        viewabilityConfig={viewConfigRef.current}
        showsHorizontalScrollIndicator={false}
        data={props.data}
        renderItem={({item, index}) => props.renderItem(item, index)}
      />
      {props.paginationShow == true ? (
        <View style={[style.pagination, props.paginationStyle]}>
          {props.data.map((_, index) => (
            <TouchableOpacity activeOpacity={.8} onPress={()=>flatRef.current.scrollToIndex({index: index})}
              key={index}
              style={[
                style.paginationItem,
                activeSlide == index ? style.active : null,
              ]}
            />
          ))}
        </View>
      ) : null}
      {props.afterPagination(activeSlide)}
    </View>
  );
}

Slider.propTypes = {
  data: PropTypes.array,
  renderItem: PropTypes.func,
  pagination: PropTypes.bool,
  paginationShow: PropTypes.bool,
  paginationStyle: PropTypes.object,
  sliderStyle: PropTypes.object,
  currnetIndex: PropTypes.func,
  scroll: PropTypes.number,
  afterPagination: PropTypes.func,
  automatic: PropTypes.bool,
};

Slider.defaultProps = {
  data: [],
  pagination: false,
  paginationShow: false,
  renderItem: () => {},
  paginationStyle: {},
  sliderStyle: {},
  currnetIndex: () => {},
  scroll: 20,
  afterPagination: () => {},
  automatic: false,
};

const style = StyleSheet.create({
  sliderContainer: {
    overflow: 'hidden',
  },
  pagination: {
    height: normalize(30),
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: normalize(20),
  },
  paginationItem: {
    height: normalize(12),
    width: normalize(12),
    backgroundColor: Colors.white,
    marginRight: normalize(10),
    borderWidth: normalize(1),
    borderColor: Colors.red,
    borderRadius: 50,
  },
  active: {
    backgroundColor: Colors.red,
    borderWidth: 0,
  },
});
