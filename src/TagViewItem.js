import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Animated from 'react-native-reanimated';
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
  TouchableOpacity,
);

import Close from './assets/close.svg';

export default ({
  id,
  value,
  index,
  onPress,
  onLayoutItem,
  x,
  y,
  width,
  height,
}) => {
  const onLayout = (e) => onLayoutItem && onLayoutItem(e);
  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.7}
      {...{onPress, onLayout}}
      style={[
        styles.container,
        {transform: [{translateX: x}, {translateY: y}]},
      ]}>
      <Close />
      <View style={styles.sizedBox} />
      <Text style={styles.valueText}>{value}</Text>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#3e1e59',
    borderColor: '#56297d',
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    position: 'absolute',
  },
  sizedBox: {
    width: 5,
  },
  valueText: {
    fontSize: 12,
    color: '#bd9dd9',
  },
});
