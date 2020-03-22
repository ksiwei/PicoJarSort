import { theme } from '../constants';
import Animated, { Easing } from 'react-native-reanimated';

const { Value } = Animated;

const DEFAULT_DATA = [...new Array(20).keys()];

const COL_NUM = 4;
const ROW_NUM = Math.ceil(DEFAULT_DATA.length / COL_NUM);
const GUTTER = 12;
const SIZE = theme.getSizeForColumns(COL_NUM, GUTTER, 1.2);
const PULLER_HEIGHT = 48;
const INITIAL_HEIGHT = SIZE.height + GUTTER + PULLER_HEIGHT; //1 row
const WIDGET_BOTTOM = 48; //arbitrary to prevent showing bottom of widget on spring
const INITIAL_WIDGET_TOP = theme.height - INITIAL_HEIGHT;
const WIDGET_HEIGHT =
  Math.min((SIZE.height + GUTTER) * ROW_NUM, (theme.height / 5) * 3) +
  WIDGET_BOTTOM +
  PULLER_HEIGHT;

const POSITION_DATA = DEFAULT_DATA.map((num, index) => {
  return {
    x: GUTTER + (index % COL_NUM) * (GUTTER + SIZE.width),
    y: theme.height - WIDGET_HEIGHT + Math.floor(index / COL_NUM) * (GUTTER + SIZE.height),
    width: SIZE.width,
    height: SIZE.height,
  };
});

const POSITION_ANIMATED_VALUES = DEFAULT_DATA.map((num, index) => {
  return {
    x: new Value(GUTTER + (index % COL_NUM) * (GUTTER + SIZE.width)),
    y: new Value(Math.floor(index / COL_NUM) * (GUTTER + SIZE.height)),
  };
});

const TAB_SIZE = {
  width: GUTTER + SIZE.width,
  height: SIZE.height,
};
export {
  DEFAULT_DATA,
  COL_NUM,
  ROW_NUM,
  GUTTER,
  SIZE,
  WIDGET_HEIGHT,
  INITIAL_HEIGHT,
  POSITION_DATA,
  POSITION_ANIMATED_VALUES,
  TAB_SIZE,
  INITIAL_WIDGET_TOP,
  WIDGET_BOTTOM,
  PULLER_HEIGHT,
};
