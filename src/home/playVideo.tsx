import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';

const HomeScreen = (): JSX.Element => {
  return (
    <SafeAreaView>
      <View>
        <Video
          source={{
            uri: 'https://vip.kuaikan-cdn3.com/20230822/nO7jJd2j/hls/index.m3u8',
          }}
          style={styles.video}
          controls
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  video: {
    width: Dimensions.get('screen').width,
    minHeight: 200,
  },
});

export default HomeScreen;
