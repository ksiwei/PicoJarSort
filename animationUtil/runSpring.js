import Animated, { Easing } from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const {
  set,
  cond,
  startClock,
  stopClock,
  spring,
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

function runSpring(value, dest) {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = {
    damping: 20,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0),
  };

  return [
    cond(clockRunning(clock), 0, [
      debug('start ', state.position),
      set(state.finished, 0),
      set(state.velocity, 20),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ];
}

export default runSpring;
