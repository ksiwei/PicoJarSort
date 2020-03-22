import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { COL_NUM, SIZE, GUTTER, DEFAULT_DATA, PULLER_HEIGHT } from './JarListConfig';

const centerStyle = {
  justifyContent: 'center',
  alignItems: 'center',
};

class JarItemView extends Component {
  ref = React.createRef();

  measure = async () =>
    new Promise(resolve =>
      this.ref.current.measureInWindow((x, y, width, height) =>
        resolve({
          x,
          y,
          width,
          height,
        }),
      ),
    );

  render() {
    const { ref } = this;

    const { item, onPress } = this.props;
    return (
      <TouchableOpacity
        onPress={async () => {
          const { x, y, width, height } = await this.measure();
          onPress({ x, y, width, height });
        }}
      >
        <View
          {...{ ref }}
          style={{
            ...SIZE,
            ...centerStyle,
            backgroundColor: 'white',
            marginLeft: GUTTER,
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <Text>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
export default class ScrollableList extends Component {
  render() {
    return (
      <>
        <View style={{ height: PULLER_HEIGHT }}></View>
        <FlatList
          data={DEFAULT_DATA}
          renderItem={({ item, index }) => <JarItemView item={item} {...this.props} />}
          keyExtractor={item => item}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: GUTTER, height: GUTTER }} />}
          numColumns={COL_NUM}
        />
      </>
    );
  }
}
