# Task

This task is not trivial, so don't panic if you get stuck or have to google a lot. To complete this task you will need to learn:

1. [react-native](https://github.com/facebook/react-native)
2. [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)

I learned how to use react-native-reanimated by watching this youtube series and reading its source code: https://github.com/wcandillon/can-it-be-done-in-react-native

A few things to note:

1. Ask me any question at any time! react-native-reanimated is hard, it took me a long time to learn it.
2. The source code is not holy grail, feel free to can change anything.
3. Give me an update on your progress every day or every other day if you can, just like how we will work together.
4. Any suggestion welcome.

# Setup:

```
yarn install
expo start

```

# Summary

This is the wireframe of PicoJar Sorting screen. The red box is the screenshot and the yellow area is where all the Jars are. Currently, you can sort the screenshot by tapping on a jar.

We want to change that gesture into drag-and-drop as a lot of people confuse tapping on a Jar for opening a Jar.

# Requirements

### Step 1:

WHEN a user drags the screenshot up. 

THEN the screenshot becomes full screen.  

[Mock-up](https://www.figma.com/proto/KsOGvQvLZLH9FMkrtCwEk3/PicoJarV1?node-id=59%3A442&scaling=min-zoom)


### Step 2:

WHEN a user drags the screenshot down.

AND the user release the drag. 

IF the bottom-left corner of screenshot is within a Jar, 

THEN the screenshot takes over the space of the Jar.  

[Mock-up](https://www.figma.com/proto/KsOGvQvLZLH9FMkrtCwEk3/PicoJarV1?node-id=59%3A552&scaling=min-zoom)


### Step 3:

WHEN a user drags the screenshot down,  

AND the user release the drag  

IF the bottom-left corner of screenshot is outside of a Jar,  

THEN the screenshot becomes a new Jar and push the rest of Jars forward and downward.  

[Mock-up](https://www.figma.com/proto/KsOGvQvLZLH9FMkrtCwEk3/PicoJarV1?node-id=59%3A693&scaling=min-zoom)
