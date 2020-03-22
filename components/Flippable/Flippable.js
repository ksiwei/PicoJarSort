import React, { useState, memo } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { PanGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';

import { runTiming } from '../../animationUtil';
import Animated, { Easing } from 'react-native-reanimated';

import Card from './FlippableCard';
import { getTimingConfig, resetAndStartTiming, stopTiming } from '../../animationUtil/runTiming';

const { Value, block, cond, eq, set, debug, Clock, clockRunning, timing, not, event } = Animated;
const { width } = Dimensions.get('window');

const front = function() {
  return <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'red' }]}></View>;
};

const back = function() {
  return <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'yellow' }]}></View>;
};

export default class Flippable extends React.Component {
  x = new Value(0);

  state = {
    card: null,
  };

  flipped = new Value(0);
  faceUp = new Value(1);

  render() {
    const { x, flipped } = this;
    let { frontElem = front, backElem = back } = this.props;

    return (
      <Animated.View style={styles.container}>
        <TapGestureHandler
          onHandlerStateChange={({ nativeEvent }) => {
            this.flipped.setValue(nativeEvent.state);
          }}
        >
          <View style={styles.container}>
            <Animated.Code>
              {() => {
                const clock = new Clock();

                const toggleFaceUp = cond(
                  eq(this.faceUp, 0),
                  set(this.faceUp, 1),
                  set(this.faceUp, 0),
                );

                const { config, state } = getTimingConfig(200);

                const runTiming = cond(
                  eq(this.faceUp, 0),
                  resetAndStartTiming(clock, 0, width, state, config),
                  resetAndStartTiming(clock, width, 0, state, config),
                );

                return block([
                  cond(eq(this.flipped, State.BEGAN), [
                    cond(not(clockRunning(clock)), toggleFaceUp),
                    runTiming,
                  ]),
                  timing(clock, state, config),
                  stopTiming(clock, state),
                  set(this.x, state.position),
                ]);
              }}
            </Animated.Code>

            <Card front={frontElem()} back={backElem()} {...{ x }} />
            <Animated.ScrollView
              style={StyleSheet.absoluteFillObject}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ width: width * 2 }}
              scrollEventThrottle={1}
              onScroll={Animated.event([
                {
                  nativeEvent: {
                    contentOffset: { x },
                  },
                },
              ])}
              horizontal
            />
          </View>
        </TapGestureHandler>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
});
