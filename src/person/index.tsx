import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import storage from '../storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

function formatSeconds(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(remainingSeconds).padStart(2, '0');

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

type TypeHistoryList = Array<{
  id: string;
  currentTime: number;
  name: string;
  episode: string;
  routeName: string;
  watchTime: number;
}>;
type PersonScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};
const PersonScreen: React.FC<PersonScreenProps> = ({
  navigation,
}): JSX.Element => {
  const [historyList, setHistoryList] = useState<TypeHistoryList>([]);

  useFocusEffect(
    React.useCallback(() => {
      storage.getAllDataForKey('historyList').then((films: TypeHistoryList) => {
        setHistoryList(
          films.sort((a, b) => {
            return (a.watchTime || 0) > (b.watchTime || 0) ? -1 : 1;
          }),
        );
      });

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );

  return (
    <SafeAreaView>
      <View style={styles.PersonContainer}>
        <Text style={styles.PersonTitle}>History List</Text>
        <ScrollView
          style={{
            height: Dimensions.get('screen').height - 260,
          }}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}>
          {historyList.map((item, index) => {
            return (
              <TouchableOpacity
                key={`${item.id}+${index}`}
                onPress={() => {
                  navigation.navigate('PlayVideo', {
                    id: item.id,
                    name: item.name,
                  });
                }}>
                <View style={styles.HistoryItem}>
                  <Text style={styles.HistoryName}>{item.name}</Text>
                  <Text>
                    路线:{item.routeName} - 集数: {item.episode || '暂无'}
                  </Text>
                  <Text>
                    观看至：{formatSeconds(Number(item.currentTime.toFixed(0)))}
                    秒
                  </Text>
                  <Ionicons
                    style={styles.PlayForwardIcon}
                    name="play-forward-circle-sharp"
                    size={30}
                    color="#333"
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  PersonContainer: {
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  PersonTitle: {
    fontSize: 18,
    width: '100%',
    textAlign: 'left',
    fontWeight: 'bold',
    height: 60,
    lineHeight: 60,
    paddingLeft: 20,
  },
  HistoryItem: {
    paddingBottom: 10,
    paddingLeft: 20,
    position: 'relative',
  },
  HistoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  PlayForwardIcon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -15,
  },
});

export default PersonScreen;
