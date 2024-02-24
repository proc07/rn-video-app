import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

const cheerio = require('cheerio');

type SearchScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const SearchScreen: React.FC<SearchScreenProps> = ({
  navigation,
}): JSX.Element => {
  const route = useRoute();
  const {name, src, rate} = route.params as {
    name: string;
    src: string;
    rate: string;
  };
  const [routeList, setRouteList] = useState<
    Array<{
      link: string;
      titleText: string;
      label: string;
      small: string;
      actors: string;
    }>
  >([]);

  useEffect(() => {
    fetch(`https://v.ikanbot.com/search?q=${name}`)
      .then(response => response.text())
      .then(res => {
        const $ = cheerio.load(res);
        const mediaBody = $('.media');
        const data: any[] = [];
        mediaBody.each((i: number, item: any) => {
          const link = $(item).find('.cover-link').attr('href');
          const titleText = $(item).find('.title-text').text();
          const label = $(item).find('.label').text();
          const small = $(item).find('.small').eq(0).text();
          const actors = $(item).find('.small').eq(1).text();
          data[i] = {
            link,
            titleText,
            label,
            small,
            actors,
          };
        });
        setRouteList(data);
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
        <View>
          {src && (
            <View style={styles.RecentFilmHitsItem}>
              <Image
                style={styles.RecentFilmHitsImage}
                source={{
                  cache: 'force-cache',
                  uri: src,
                }}
                resizeMode={'cover'}
              />
              <View>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.rate}>豆瓣{rate || '暂无'}</Text>
              </View>
            </View>
          )}
          {routeList.map((routeItem, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  navigation.navigate('PlayVideo', {
                    id: routeItem.link.replace('/play/', ''),
                    name: routeItem.titleText,
                  });
                }}>
                <View style={styles.RouteItem}>
                  <View style={styles.RouteWarpper}>
                    <Text style={styles.RouteTitleText}>
                      {routeItem.titleText}
                    </Text>
                    <Text style={styles.RouteLabel}>{routeItem.label}</Text>
                  </View>
                  <Text style={styles.RouteSmall}>{routeItem.small}</Text>
                  <Text style={styles.RouteActors}>{routeItem.actors}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  RecentFilmHitsItem: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  RecentFilmHitsImage: {
    width: 115,
    height: 161,
    marginRight: 20,
  },
  name: {
    fontSize: 18,
    marginTop: 10,
  },
  rate: {
    color: '#e09015',
    marginTop: 10,
  },
  RouteItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  RouteWarpper: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  RouteTitleText: {
    color: '#337ab7',
    fontSize: 16,
    marginRight: 5,
  },
  RouteLabel: {
    color: '#00ad3f',
    fontSize: 14,
  },
  RouteSmall: {
    color: '#333',
    marginBottom: 5,
  },
  RouteActors: {
    color: '#333',
  },
});

export default SearchScreen;
