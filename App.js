import React from 'react';
import { View } from 'react-native';
import { Background, Expandable } from './components/';
import { PanGestureHandler } from 'react-native-gesture-handler';

import Animated, { Transition, Transitioning } from 'react-native-reanimated';
import { theme } from './constants';
import ScrollableList from './components/ScrollableList';
import { WIDGET_HEIGHT } from './components/JarListConfig';
import { verticalSwipeToggle } from './animationUtil/toggleSpring';

const { Value, event } = Animated;

const cardWidth = theme.width * 0.7;
const cardHeight = (theme.height - 28) * 0.7; //TODO use modal height instead
const initialCardX = theme.width / 2 - cardWidth / 2;
const initialCardY = theme.height / 2 - cardHeight / 2 - 48;

const transition = <Transition.Change durationMs={200} interpolation="easeInOut" />;

const ROOT_REF = React.createRef();

function springTransition() {
  ROOT_REF.current.animateNextTransition();
}

class Screenshot extends React.Component {
  endHeight = theme.height - WIDGET_HEIGHT - 120;
  endWidth = this.endHeight * (theme.width / theme.height);
  endX = initialCardX + (cardWidth - this.endWidth) / 2;
  constructor() {
    super();
    this.animatedHeight = new Value(cardHeight);
    this.animatedWidth = new Value(cardWidth);
    this.animatedX = new Value(initialCardX);
  }
  render() {
    const { movingState, position, velocityY, jarSelected } = this.props;
    const { width, height, x, y } = position;
    this.animatedHeight = verticalSwipeToggle(movingState, velocityY, cardHeight, this.endHeight);
    this.animatedWidth = verticalSwipeToggle(movingState, velocityY, cardWidth, this.endWidth);
    this.animatedX = verticalSwipeToggle(movingState, velocityY, initialCardX, this.endX);

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            width: jarSelected ? width : this.animatedWidth,
            height: jarSelected ? height : this.animatedHeight,
            backgroundColor: 'red',
            left: jarSelected ? x : this.animatedX,
            top: y,
          }}
        ></Animated.View>
      </View>
    );
  }
}

class JarList extends React.Component {
  state = {
    position: { width: cardWidth, height: cardHeight, x: initialCardX, y: initialCardY },
    jarSelected: false,
  };
  constructor() {
    super();
    this.gestureState = new Value(-1);
    this.velocityY = new Value(0);

    this.onGestureEvent = event(
      [
        {
          nativeEvent: {
            translationX: this.gestureTransX,
            translationY: this.gestureTransY,
            velocityY: this.velocityY,
            state: this.gestureState,
          },
        },
      ],
      { useNativeDriver: true },
    );
  }

  updateScreenshotPosition(position) {
    springTransition();
    this.setState({ position, jarSelected: true });
  }

  render() {
    const { onGestureEvent, state } = this;
    return (
      <Transitioning.View ref={ROOT_REF} transition={transition}>
        <Screenshot
          position={state.position}
          velocityY={this.velocityY}
          movingState={this.gestureState}
          jarSelected={state.jarSelected}
        />
        <PanGestureHandler
          minDeltaY={10}
          onHandlerStateChange={onGestureEvent}
          {...{ onGestureEvent }}
        >
          <Animated.View>
            <Expandable movingState={this.gestureState} velocityY={this.velocityY}>
              <ScrollableList onPress={position => this.updateScreenshotPosition(position)} />
            </Expandable>
          </Animated.View>
        </PanGestureHandler>
      </Transitioning.View>
    );
  }
}

export default class App extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <Background>
        <JarList />
      </Background>
    );
  }
}
