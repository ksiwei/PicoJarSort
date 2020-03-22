import { State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
const {
  set,
  cond,
  startClock,
  stopClock,
  clockRunning,
  block,
  debug,
  Value,
  Clock,

  greaterThan,
  lessThan,
  eq,
  not,
  neq,
  and,
  spring,
  or,
} = Animated;

export const verticalSwipeToggle = (gestureState, velocityY, from, to, forcedUp, forcedDown) => {
  const toggleOn = or(and(eq(gestureState, State.ACTIVE), lessThan(velocityY, 0)), eq(forcedUp, 1));
  const toggleOff = or(
    and(eq(gestureState, State.ACTIVE), greaterThan(velocityY, 0)),
    eq(forcedDown, 1),
  );
  return toggleOnOff({ toggleOn, toggleOff, from, to });
};

export const toggleOnOff = ({ toggleOn, toggleOff, from, to }) => {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: new Value(from),
    velocity: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const springConfig = {
    damping: 20,
    mass: 1,
    stiffness: 200,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0),
  };

  const config = springConfig;

  const resetStates = [set(state.finished, 0), set(state.time, 0), set(state.frameTime, 0)];
  //const isEnd = or(eq(gestureState, State.END), eq(gestureState, State.CANCELLED)); TODO: enable if you want it to bounce back

  const updatePostion = spring(clock, state, config);
  const startClockRunning = startClock(clock);
  const stopWhenFinish = cond(state.finished, stopClock(clock));
  const debugging = debug('debug gesture ', state.position);

  return block([
    cond(
      toggleOn,
      cond(or(not(clockRunning(clock)), eq(config.toValue, from)), [
        set(config.toValue, to),
        ...resetStates,
        startClockRunning,
      ]),
    ),
    cond(
      toggleOff,
      cond(or(not(clockRunning(clock)), neq(config.toValue, from)), [
        set(config.toValue, from),
        ...resetStates,
        startClockRunning,
      ]),
    ),
    updatePostion,
    stopWhenFinish,
    state.position,
  ]);
};

export default { verticalSwipeToggle };
