import React, {useState, useRef} from 'react';
import {StyleSheet} from 'react-native';

import TagViewItem from './TagViewItem';
import Animated, {useCode, block, set} from 'react-native-reanimated';
import {timing} from 'react-native-redash';

export default ({data, itemPadding = 10, onRemove}) => {
  const [containerIsRendered, setContainerIsRendered] = useState(false);
  const [itemsAreRendered, setItemsAreRendered] = useState(false);
  const [recalculatedFlag, setRecalculatedFlag] = useState(false);
  const renderedItemsCount = useRef(0);
  const containerLayout = useRef({width: 0, height: new Animated.Value(50)});
  const itemsLayout = useRef(
    data.map((_) => ({
      width: 0,
      height: 0,
      x: new Animated.Value(0),
      y: new Animated.Value(0),
    })),
  );
  const calculatedItemsPosition = useRef(
    data.map((_) => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
    })),
  );

  const onLayout = ({
    nativeEvent: {
      layout: {width, height},
    },
  }) => {
    containerLayout.current.width = width;
    setContainerIsRendered(true);
  };
  const onLayoutItem = (
    {
      nativeEvent: {
        layout: {width, height},
      },
    },
    index,
  ) => {
    renderedItemsCount.current += 1;
    itemsLayout.current[index].width = width;
    itemsLayout.current[index].height = height;

    if (renderedItemsCount.current === data.length) {
      setItemsAreRendered(true);
      setRecalculatedFlag((prev) => !prev);
    }
  };
  useCode(() => {
    let x = 0;
    let y = 0;
    let setBlock = [];
    for (let i = 0; i < itemsLayout.current.length; i++) {
      let xp = x + itemsLayout.current[i].width;
      if (xp >= containerLayout.current.width) {
        x = 0;
        y += itemsLayout.current[i].height + itemPadding;
      }
      setBlock[i] = block([
        set(calculatedItemsPosition.current[i].x, x),
        set(calculatedItemsPosition.current[i].y, y),
      ]);
      x += itemsLayout.current[i].width + itemPadding;
    }

    return block([
      setBlock,
      set(
        containerLayout.current.height,
        timing({
          duration: 300,
          from: containerLayout.current.height,
          to: y + (itemsLayout.current[0] ? itemsLayout.current[0].height : 0),
        }),
      ),
      calculatedItemsPosition.current.map((item, index) => {
        return block([
          set(
            itemsLayout.current[index].x,
            timing({
              duration: 300,
              from: itemsLayout.current[index].x,
              to: item.x,
            }),
          ),
          set(
            itemsLayout.current[index].y,
            timing({
              duration: 300,
              from: itemsLayout.current[index].y,
              to: item.y,
            }),
          ),
        ]);
      }),
    ]);
  }, [recalculatedFlag]);

  return (
    <>
      <Animated.View
        style={[styles.container, {height: containerLayout.current.height}]}
        {...(!containerIsRendered && {onLayout})}>
        {data.map((item, index) => (
          <TagViewItem
            key={`${index}`}
            {...item}
            {...{index}}
            {...itemsLayout.current[index]}
            onPress={() => {
              onRemove && onRemove(item, index);

              itemsLayout.current = [
                ...itemsLayout.current.slice(0, index),
                ...itemsLayout.current.slice(index + 1),
              ];
              calculatedItemsPosition.current = [
                ...calculatedItemsPosition.current.slice(0, index),
                ...calculatedItemsPosition.current.slice(index + 1),
              ];

              setRecalculatedFlag((prev) => !prev);
            }}
            {...(!itemsAreRendered && {
              onLayoutItem: (e) => onLayoutItem(e, index),
            })}
          />
        ))}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // backgroundColor: 'rgba(255,255,255,.03)',
  },
});
