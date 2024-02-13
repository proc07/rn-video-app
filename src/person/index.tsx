import React from 'react';
import {SafeAreaView, Text, View, StyleSheet} from 'react-native';

const PersonScreen = (): JSX.Element => (
  <SafeAreaView>
    <View style={styles.PersonContainer}>
      <Text>Person Screen</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  PersonContainer: {},
});

export default PersonScreen;
