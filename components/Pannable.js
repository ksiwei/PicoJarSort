import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import { PanGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { Easing } from 'react-native-reanimated';
import { theme } from '../constants';
import { runTiming, runSpring } from '../animationUtil';
import { getTimingConfig } from '../animationUtil/runTiming';
import { SIZE, WIDGET_HEIGHT, POSITION_DATA, TAB_SIZE } from './JarListConfig';
const {
  set,
  cond,
  startClock,
  stopClock,
  clockRunning,
  block,
  divide,
  timing,
  debug,
  Value,
  Clock,
  event,
  call,
  and,
  add,
  multiply,
  sub,
  neq,
  not,
  eq,
  lessOrEq,
  greaterOrEq,
  round,
} = Animated;

const CardWidth = theme.width * 0.7;
const CardHeight = (theme.height - 28) * 0.7;

const animateOpacity = gestureState => {
  const clock = new Clock();
  const { config, state } = getTimingConfig(200);
  return block([
    cond(and(eq(gestureState, State.ACTIVE), neq(config.toValue, 1)), [
      debug('gesture start ', state.position),
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 1),
      startClock(clock),
    ]),
    cond(and(eq(gestureState, State.END), neq(config.toValue, 0)), [
      debug('gesture end ', config.toValue),
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 0),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
};

const withDrag = (gestureState, inPanel, active, inactive, settled) => {
  const clock = new Clock();
  const { config, state } = getTimingConfig(200);

  //console.log(' inactive ', inactive, active);

  // if it's active, shrink to jar size, if it is end, if didn't activate any jar go back to original size, otherwise shrink again
  return block([
    cond(and(eq(gestureState, State.ACTIVE), not(clockRunning(clock))), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, active),
      set(state.position, active),
      //  startClock(clock),
    ]),
    cond(and(eq(gestureState, State.END), not(clockRunning(clock))), [
      cond(
        inPanel,
        [
          set(state.finished, 0),

          set(state.time, 0),
          set(state.frameTime, 0),
          set(config.toValue, settled), // can calculate settled pos based on absoluet XY
          startClock(clock),
        ],
        [
          set(state.finished, 0),
          set(state.time, 0),
          set(state.frameTime, 0),
          set(config.toValue, inactive),
          startClock(clock),
        ],
      ),
    ]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    cond(eq(state.position, 0), new Value(inactive), state.position),
  ]);
};

const initialCardX = theme.width / 2 - CardWidth / 2;
const initialCardY = theme.height / 2 - CardHeight / 2;
const withOffset = ({ offset, gestureState, value }) => {
  const safeOffset = new Value(0);
  return cond(eq(gestureState, State.ACTIVE), [add(safeOffset, value)], set(safeOffset, offset));
};

export default class Pannable extends React.Component {
  constructor() {
    super();

    this.state = { isMoving: false };

    // this.translateX = new Value(0);
    // this.translateY = new Value(0);
    this.absoluteX = new Value(theme.width / 2);
    this.absoluteY = new Value(theme.height / 2);
    this.velocityX = new Value(0);
    this.velocityY = new Value(0);
    this.jarHeight = new Value(CardHeight);
    this.jarWidth = new Value(CardWidth);
    this.activatedJar = new Value(-1);
    this.destX = new Value(0);
    this.destY = new Value(0);
    this.destWidth = new Value(0);
    this.destHeight = new Value(0);

    this.translateX = new Value(0);
    this.translateY = new Value(0);

    this.movingState = new Value(-1);
    this.clock = new Clock();
    this.nativeGestureEvent = event([
      {
        nativeEvent: {
          absoluteX: this.absoluteX,
          absoluteY: this.absoluteY,
          translationX: this.translateX,
          translationY: this.translateX,

          velocityX: this.velocityX,
          velocityY: this.velocityY,

          translationY: this.translateY,
          state: this.movingState,
        },
      },
    ]);
    this.oZoneOpacity = new Value(0);

    this.oZoneOpacity = animateOpacity(this.movingState);

    const offsetX = withOffset({
      value: this.translateX,
      offset: sub(this.absoluteX, add(initialCardX, new Value(CardWidth / 2))),
      gestureState: this.movingState,
    });
    const offsetY = withOffset({
      value: this.translateY,
      offset: sub(this.absoluteY, add(initialCardY, new Value(CardHeight / 2))),
      gestureState: this.movingState,
    });

    const isInPanel = greaterOrEq(this.absoluteY, theme.height - WIDGET_HEIGHT);
    this.cardWidth = withDrag(this.movingState, isInPanel, SIZE.width, CardWidth, SIZE.width);
    this.cardHeight = withDrag(this.movingState, isInPanel, SIZE.height, CardHeight, SIZE.height);
    this.cardX = withDrag(
      this.movingState,
      isInPanel,
      offsetX,
      0,
      multiply(round(divide(offsetX, TAB_SIZE.width)), TAB_SIZE.width),
    );
    this.cardY = withDrag(
      this.movingState,
      isInPanel,
      offsetY,
      0,
      multiply(round(divide(offsetY, TAB_SIZE.height)), TAB_SIZE.height),
    );
  }

  checkCapturedElement(x, y) {
    const isInBox = (x, y, position) => {
      return (
        x > position.x &&
        x < position.x + position.width &&
        y > position.y &&
        y < position.y + position.height
      );
    };
    let capturedIndex = null;

    POSITION_DATA.forEach((position, index) => {
      if (isInBox(x, y, position)) {
        if (this.lastIndex !== index) {
          this.lastIndex = index;
          console.log(' Got Index ', index); // TODO: doesn't call on every clock tick
          this.activatedJar.setValue(index);

          this.destX.setValue(POSITION_DATA[index].x + POSITION_DATA[index].width / 2);
          this.destY.setValue(POSITION_DATA[index].y + POSITION_DATA[index].height / 2);
          this.destWidth.setValue(POSITION_DATA[index].width);
          this.destHeight.setValue(POSITION_DATA[index].height);
        }
      }
    });
  }

  render() {
    const { children, updatePanning } = this.props;

    return (
      <>
        <Animated.Code>
          {() => {
            return call([this.movingState], updatePanning);
          }}
        </Animated.Code>
        <Animated.View
          style={[{ backgroundColor: theme.colors.gray2, opacity: this.oZoneOpacity }]}
        />
        <PanGestureHandler
          onGestureEvent={this.nativeGestureEvent}
          onHandlerStateChange={this.nativeGestureEvent}
        >
          <Animated.View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Animated.View
              style={{
                position: 'absolute',
                width: CardWidth,
                height: CardHeight,
                backgroundColor: 'red',
                left: initialCardX,
                top: initialCardY,
                transform: [
                  { translateX: this.cardX },
                  { translateY: this.cardY },
                  { scale: divide(this.cardWidth, new Value(CardWidth)) },
                ],
              }}
            >
              {children}
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </>
    );
  }
}
