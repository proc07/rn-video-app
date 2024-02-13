import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  useColorScheme,
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

type FilmHitsType = Array<{
  id: number;
  src: string;
  name: string;
  rate: string;
}>;

type HomeScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}): JSX.Element => {
  const [value, onChangeText] = useState('');
  const isDarkMode = useColorScheme() === 'dark';
  const [recentFilmHits, setRecentFilmHits] = useState<FilmHitsType>([]);
  const [recentSeriesHits, setRecenttSeriesHits] = useState<FilmHitsType>([]);

  useEffect(() => {
    fetch(
      'https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&page_limit=20&page_start=0',
    )
      .then(response => response.json())
      .then(res => {
        const subjects: FilmHitsType = res.subjects.map((item: any) => {
          return {
            id: item.id,
            src: item.cover,
            rate: item.rate,
            name: item.title,
          };
        });
        setRecentFilmHits(subjects);
      })
      .catch(err => {
        console.log(err);
      });

    fetch(
      'https://movie.douban.com/j/search_subjects?type=tv&tag=%E7%83%AD%E9%97%A8&page_limit=20&page_start=0',
    )
      .then(response => response.json())
      .then(res => {
        const subjects: FilmHitsType = res.subjects.map((item: any) => {
          return {
            id: item.id,
            src: item.cover,
            rate: item.rate,
            name: item.title,
          };
        });
        setRecenttSeriesHits(subjects);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        directionalLockEnabled={true}
        alwaysBounceVertical={false}>
        <View style={styles.HomeContainer}>
          <View style={styles.SearchContainer}>
            <TextInput
              placeholder="请输入影片名称，演职人员"
              style={styles.SearchInput}
              onChangeText={text => onChangeText(text)}
              value={value}
            />
            <View style={styles.SearchButton}>
              <Button color="#2196f3" title="Search" onPress={() => {}} />
            </View>
          </View>
          <View>
            <Text style={styles.SubTitle}>最近热门电影</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              directionalLockEnabled={true}
              alwaysBounceVertical={false}
              style={styles.RecentFilmHits}>
              <FlatList
                numColumns={10}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={recentFilmHits}
                directionalLockEnabled={true}
                alwaysBounceVertical={false}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Search', {
                          id: item.id,
                          name: item.name,
                          src: item.src,
                        });
                      }}>
                      <View style={styles.RecentFilmHitsItem}>
                        <Image
                          style={styles.RecentFilmHitsImage}
                          source={{
                            cache: 'force-cache',
                            uri: item.src,
                          }}
                          resizeMode={'cover'}
                        />
                        <Text>{item.name}</Text>
                        <Text style={styles.rate}>
                          豆瓣{item.rate || '暂无'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </ScrollView>
          </View>
          <View style={styles.mt15}>
            <Text style={styles.SubTitle}>最近热门电视剧</Text>
            <ScrollView
              horizontal={true}
              contentInsetAdjustmentBehavior="automatic"
              style={styles.RecentFilmHits}>
              {recentSeriesHits.map(item => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Search', {
                      id: item.id,
                      name: item.name,
                      src: item.src,
                    });
                  }}>
                  <View key={item.id} style={styles.RecentFilmHitsItem}>
                    <Image
                      style={styles.RecentFilmHitsImage}
                      source={{
                        cache: 'force-cache',
                        uri: item.src,
                      }}
                      resizeMode={'cover'}
                    />
                    <Text>{item.name}</Text>
                    <Text style={styles.rate}>豆瓣{item.rate || '暂无'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  HomeContainer: {},
  SearchContainer: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  SearchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f2f2f2',
    textAlignVertical: 'top',
    // fontSize: 14,
    padding: 20,
  },
  SearchButton: {
    width: 80,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  SubTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    paddingTop: 15,
    paddingLeft: 15,
    backgroundColor: '#fff',
  },
  RecentFilmHits: {
    padding: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderBottomColor: '#ccc',
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#fff',
    overflow: 'hidden',
  },
  RecentFilmHitsItem: {
    marginHorizontal: 15,
    marginRight: 15,
  },
  RecentFilmHitsImage: {
    width: 115,
    height: 161,
    marginBottom: 5,
  },
  mt15: {
    marginTop: 15,
  },
  rate: {
    color: '#e09015',
  },
});

export default HomeScreen;
