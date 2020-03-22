# Task

This task is not trivial, so don't panic if you get stuck or have to google a lot. To complete this task you will need to understand:

1. [react-native](https://github.com/facebook/react-native)
2. [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)

I learned how to use react-native-reanimated is this youtube series with source code: https://github.com/wcandillon/can-it-be-done-in-react-native

A few things to note:

1. Feel free to ask me any question at any time! react-native-reanimated is hard, it took me a long time to learn it.
2. The source code is not holy grail, you can change anything.
3. Update your progress on the task every day or every other day if you can, just like how we will work together.
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

WHEN a user drags the screenshot up
THEN the screenshot becomes full screen.

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FKsOGvQvLZLH9FMkrtCwEk3%2FPicoJarV1%3Fnode-id%3D59%253A491%26scaling%3Dmin-zoom" allowfullscreen></iframe>

### Step 2:

WHEN a user drags the screenshot down
AND the user release the drag
IF the bottom-left corner of screenshot is within a Jar,
THEN the screenshot takes over the space of the Jar.

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FKsOGvQvLZLH9FMkrtCwEk3%2FPicoJarV1%3Fnode-id%3D59%253A612%26scaling%3Dmin-zoom" allowfullscreen></iframe>

### Step 3:

WHEN a user drags the screenshot down,
AND the user release the drag
IF the bottom-left corner of screenshot is outside of a Jar,
THEN the screenshot becomes a new Jar and push the rest of Jars forward and downward.

<iframe style="border: none;" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FKsOGvQvLZLH9FMkrtCwEk3%2FPicoJarV1%3Fnode-id%3D59%253A655%26scaling%3Dmin-zoom" allowfullscreen></iframe>
