import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import { PanGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { Easing } from 'react-native-reanimated';

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

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 300,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), debug('running clock', state.position), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position,
  ]);
}

const colors = {
  gray: '#333',
};
const jarListData = [
  { name: 'Blockchain', type: 'Research', color: '#f9eb9b' },
  { name: 'Beautiful Beaches', type: 'Bucket List', color: '#C8E8E5' },
  { name: 'TODO List', type: 'TODO', color: '#F3E5F5' },
  { name: "Man's Search for Meaning", type: 'Reading', color: '#f9eb9b' },
];
const shadow = {
  shadowColor: '#CBF3B5',
  shadowOffset: {
    width: 2,
    height: 4,
  },
  shadowOpacity: 0.8,
  shadowRadius: 12.35,
};

class PicoView extends React.Component {
  constructor(props) {
    super(props);
    this.flipped = new Value(0);
    this.sorted = new Value(0);
    this.translateX = new Value(0);
    this.translateY = new Value(0);

    this.left = new Value(0);
    this.top = new Value(0);
    this.opacity = new Value(1);

    this.rotateY = new Value(0);

    this.nativeGestureEvent = event([
      {
        nativeEvent: {
          translationX: this.translateX,
          translationY: this.translateY,
        },
      },
    ]);
  }

  componentDidUpdate(prevProps) {
    const { targetPoint } = this.props;
    const { targetPoint: prevPoint } = prevProps;
    console.log(' target Point ', targetPoint);
    if (!prevPoint || targetPoint.translateX !== prevPoint.translateX) {
      this.sorted.setValue(1);
      console.log(' this.sorted ');
    } else {
      this.sorted.setValue(0);
      console.log(' this.not sorted ');
    }
  }
  onTapped({ nativeEvent }) {
    if (nativeEvent.state === State.ACTIVE) {
      console.log(' on Tap state ', nativeEvent.state === State.ACTIVE);
      this.flipped.setValue(1);
    }
  }
  onPanned({ nativeEvent }) {
    console.log(' on Panned state ', nativeEvent.state === State.ACTIVE);
  }
  render() {
    const { targetPoint } = this.props;
    console.log(' targetPoint translate ', targetPoint.translateX);
    return (
      <TapGestureHandler
        onHandlerStateChange={arg => {
          this.onTapped(arg);
        }}
      >
        <Animated.View>
          <Animated.Code key={targetPoint.translateX}>
            {() =>
              block([
                cond(eq(this.flipped, 1), [
                  debug('flipped anim', this.flipped),
                  set(this.rotateY, runTiming(new Clock(), 0, 180)),
                ]),
                cond(eq(this.sorted, 1), [
                  set(this.left, runTiming(new Clock(), 0, targetPoint.translateX)),
                  set(this.top, runTiming(new Clock(), 0, targetPoint.translateY)),
                  set(this.opacity, runTiming(new Clock(), 1, 0)),
                ]),
              ])
            }
          </Animated.Code>
          <PanGestureHandler
            onHandlerStateChange={this.onPanned}
            onGestureEvent={this.nativeGestureEvent}
          >
            <Animated.View
              style={[
                styles.picoView,
                {
                  left: divide(this.left, 3),
                  top: this.top,
                  opacity: this.opacity,

                  transform: [
                    { translateY: this.translateY },
                    { rotateY: concat(this.rotateY, 'deg') },
                    { scale: this.opacity },
                  ],
                },
              ]}
            />
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    );
  }
}

class Jar extends React.Component {
  onJarSelected({ nativeEvent }) {
    const { state, absoluteX, absoluteY } = nativeEvent;
    if (state === State.ACTIVE) {
      this.props.triggerSort(this.props.name, {
        translateX: absoluteX,
        translateY: absoluteY,
      });
    }
  }
  render() {
    return (
      <TapGestureHandler
        onHandlerStateChange={arg => {
          this.onJarSelected(arg);
        }}
      >
        <Animated.View style={[styles.jarView, { backgroundColor: this.props.color }]}>
          <Text style={styles.jarText}>{this.props.name}</Text>
        </Animated.View>
      </TapGestureHandler>
    );
  }
}

class JarList extends React.Component {
  render() {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 12 }}
      >
        {jarListData.map(props => {
          return <Jar key={props.name} {...props} triggerSort={this.props.triggerSort}></Jar>;
        })}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  picoView: {
    width: width * 0.7,
    height: height * 0.6,
    borderRadius: 12,
    backgroundColor: '#CBF3B5',
    ...shadow,
  },
  jarView: {
    height: 80,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    padding: 12,
  },
  jarText: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: 12,
  },
});

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      targetJar: null,
      targetPoint: { translateX: 0, translateY: 0 },
    };
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ justifyContent: 'flex-start' }}>
          <PicoView targetPoint={this.state.targetPoint} />
        </View>
        <View style={{ height: 96 }}>
          <JarList
            triggerSort={(name, point) => {
              console.log(' Sorted! ', name, point);
              this.setState({ targetJar: name, targetPoint: point });
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
