import * as React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
  Dimensions,
  Platform,
  Text,
} from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';
const { Value, concat, interpolate, cond, and, greaterOrEq, lessThan } = Animated;
const { width, height } = Dimensions.get('window');
const perspective = Platform.OS === 'ios' ? 1000 : undefined;

export default class Card extends React.PureComponent {
  render() {
    const { front, back, x } = this.props;
    const rotateYAsDeg = interpolate(x, {
      inputRange: [0, width],
      outputRange: [0, 180],
    });
    const rotateY = concat(rotateYAsDeg, 'deg');
    const opacity =
      Platform.OS === 'android'
        ? cond(and(greaterOrEq(rotateYAsDeg, -90), lessThan(rotateYAsDeg, 90)), 1, 0)
        : 1;
    const backOpacity = Platform.OS === 'android' ? cond(opacity, 0, 1) : 1;
    /*
     */
    return (
      <>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: backOpacity,
            backfaceVisibility: 'hidden',
            transform: [{ perspective }, { rotateY: '180deg' }, { rotateY }],
          }}
        >
          {back}
        </Animated.View>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            opacity,
            backfaceVisibility: 'hidden',
            transform: [{ perspective }, { rotateY }],
          }}
        >
          {front}
        </Animated.View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
});
