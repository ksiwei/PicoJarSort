import React, { Component } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
const { Value, Clock } = Animated;
import { verticalSwipeToggle } from '../animationUtil/toggleSpring';
import { theme } from '../constants';
import { WIDGET_HEIGHT, INITIAL_WIDGET_TOP, INITIAL_HEIGHT } from './JarListConfig';

export default class Expandable extends Component {
  constructor() {
    super();
    this.topY = new Value(INITIAL_WIDGET_TOP);
    this.clock = new Clock();
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { movingState, children, velocityY } = this.props;
    this.topY = verticalSwipeToggle(movingState, velocityY, 0, -(WIDGET_HEIGHT - INITIAL_HEIGHT));

    return (
      <View
        style={{
          height: WIDGET_HEIGHT,
          position: 'absolute',
          top: INITIAL_WIDGET_TOP,
          width: theme.width,
        }}
      >
        <Animated.View
          style={{
            top: this.topY,
            flex: 1,
            backgroundColor: 'yellow',
          }}
        >
          {children}
        </Animated.View>
      </View>
    );
  }
}
