import Animated, { Easing } from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const {
  set,
  cond,
  startClock,
  stopClock,
  clockRunning,
  block,
  timing,
  debug,
  Value,
  Clock,
  event,
  concat,
  divide,
  eq,
} = Animated;

const { height, width } = Dimensions.get('window');

function runTiming(clock, value, dest, duration = 200) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: duration || 200,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
}

export const resetAndStartTiming = (clock, start, end, state, config) => [
  [
    set(state.finished, 0),
    set(state.time, 0),
    set(state.position, start),
    set(state.frameTime, 0),
    set(config.toValue, end),
    startClock(clock),
  ],
];

export const getTimingConfig = (duration = 200) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: duration || 200,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };
  return { state, config };
};

export const stopTiming = (clock, state) => {
  return [cond(state.finished, stopClock(clock)), state.position];
};

export default runTiming;
