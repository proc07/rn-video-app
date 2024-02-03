import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  useColorScheme,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
const cheerio = require('cheerio');

type FilmHitsType = Array<{
  id: number;
  src: string;
  name: string;
  rate: string;
}>;

const HomeScreen = (): JSX.Element => {
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
      <View style={styles.HomeContainer}>
        <View style={styles.SearchContainer}>
          <TextInput
            placeholder="请输入影片名称，演职人员"
            style={styles.SearchInput}
            onChangeText={text => onChangeText(text)}
            value={value}
          />
        </View>
        <View>
          <Text style={styles.SubTitle}>最近热门电影</Text>
          <ScrollView
            horizontal={true}
            contentInsetAdjustmentBehavior="automatic"
            style={styles.RecentFilmHits}>
            {recentFilmHits.map(item => (
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
                <Text style={styles.rate}>{item.rate}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.mt15}>
          <Text style={styles.SubTitle}>最近热门电视剧</Text>
          <ScrollView
            horizontal={true}
            contentInsetAdjustmentBehavior="automatic"
            style={styles.RecentFilmHits}>
            {recentSeriesHits.map(item => (
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
                <Text style={styles.rate}>{item.rate}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  HomeContainer: {
    display: 'flex',
  },
  SearchContainer: {
    marginBottom: 10,
  },
  SearchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f2f2f2',
    textAlignVertical: 'top',
    // fontSize: 14,
    padding: 20,
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
  },
  RecentFilmHitsItem: {
    flex: 1,
    display: 'flex',
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
