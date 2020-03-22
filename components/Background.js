import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function(props) {
  const style = {
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    locations: [0.1, 0.9],
    opacity: 0.8,
  };

  const { children } = props;
  return (
    <LinearGradient
      start={style.start}
      end={style.end}
      style={{ flex: 1 }}
      locations={style.locations}
      colors={['#5B6384', '#2F344D']}
    >
      {children}
    </LinearGradient>
  );
}
