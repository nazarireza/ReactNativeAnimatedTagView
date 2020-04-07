import React, {useState} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';

import {data} from './data';
import TagView from './TagView';

export default () => {
  const [sampleData, setSampleData] = useState(data);
  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <TagView
          data={sampleData}
          onRemove={(item, index) =>
            setSampleData([
              ...sampleData.slice(0, index),
              ...sampleData.slice(index + 1),
            ])
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    paddingTop: 150,
    backgroundColor: '#3e1e59',
  },
});
