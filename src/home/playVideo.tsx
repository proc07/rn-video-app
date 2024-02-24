import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Button,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRoute, useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import {get_tks} from '../util';
import storage from '../storage';
const cheerio = require('cheerio');

function extractNumbers(str: string) {
  const numberStr = str.replace(/\D/g, ''); // 使用正则表达式替换非数字字符为空字符
  return parseInt(numberStr, 10);
}

const PlayVideoScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const route = useRoute();
  const [errorText, setErrorText] = useState('');
  const [isLoad, setIsLoad] = useState(false);
  const [routeName, setRouteName] = useState(-1);
  const {id, name} = route.params as {
    id: string;
    name: string;
  };
  const [routeList, setRouteList] = useState<
    Array<{
      flag: string;
      url: Array<string>;
    }>
  >([]);

  const fetcVideoList = useCallback(
    (e_token: string) => {
      fetch(
        `https://v.ikanbot.com/api/getResN?videoId=${id}&mtype=1&token=${e_token}`,
      )
        .then(response => response.json())
        .then(res => {
          if (res.data) {
            const newData = res.data.list.map((item: any) => {
              const parseData = JSON.parse(item.resData);
              let flag = '';
              const urlAllData = parseData.map((child: any) => {
                flag = child.flag;
                return child.url.split('#');
              });
              const urlData = urlAllData.reduce(
                (prev: string[], cur: string[]) => {
                  return prev.length < cur.length ? cur : prev;
                },
                [],
              );
              return {
                flag,
                url: urlData.sort((a: string, b: string) => {
                  // 提取 $ 前面的字符进行比较
                  const aKey = extractNumbers(a.split('$')[0]);
                  const bKey = extractNumbers(b.split('$')[0]);
                  // 使用 localeCompare 方法进行排序
                  return aKey > bKey;
                }),
              };
            });
            // console.log(newData);
            setRouteList(newData);
            newData[routeName - 1] &&
              setCurrentIndex(
                newData[routeName - 1].url.indexOf(`${episode}$${sourceUri}`),
              );
          }
        })
        .catch(err => {
          console.log('fetcVideoList:', err);
        });
    },
    [id],
  );

  useEffect(() => {
    storage
      .load({
        key: 'historyList',
        id,
      })
      .then(res => {
        setCurrentTime(res.currentTime);
        setRouteName(res.routeName);
        setSourceUri(res.sourceUri);
        setEpisode(res.episode);
        handleSeek(res.currentTime);
        setPaused(false);
      })
      .catch(err => {
        console.log('storage err: ', err);
      });

    fetch(`https://v.ikanbot.com/play/${id}`)
      .then(response => response.text())
      .then(res => {
        const $ = cheerio.load(res);
        const e_token = $('#e_token').val();
        const current_id = $('#current_id').val();
        const token = get_tks(current_id, e_token);
        token && fetcVideoList(token);
      })
      .catch(err => {
        console.log(`/play/${id}:`, err);
      });

    return () => {
      console.log('page out');
      setPaused(true);
      setSourceUri('');
    };
  }, []);

  const videoRef = useRef<any>(null);
  const [lockToLands, setlockToLand] = useState(false);
  const [sourceUri, setSourceUri] = useState('');
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [episode, setEpisode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleProgress = (data: {
    currentTime: number;
    playableDuration: number;
    seekableDuration: number;
  }) => {
    setCurrentTime(data.currentTime); // 更新当前播放时间
    storage.save({
      key: 'historyList',
      id,
      data: {
        id,
        name,
        routeName,
        episode,
        sourceUri,
        currentTime: data.currentTime,
        watchTime: +new Date(),
      },
    });
  };
  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.seek(time); // 跳转到指定的时间点
    }
  };

  const handleFullScreen = () => {
    setlockToLand(!lockToLands);
    // 在组件加载时隐藏标题栏
    navigation.setOptions({
      headerShown: lockToLands,
    });
  };

  const insets = useSafeAreaInsets();
  // 获取屏幕宽度和高度
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  // 假设元素已经进行了旋转并且宽度和高度已经交换
  const rotatedWidth = screenHeight; // 旋转后的宽度
  const rotatedHeight = screenWidth; // 旋转后的高度
  // 计算 left 和 top 的值
  const left = (rotatedWidth - screenWidth) / 2;
  const top = (rotatedHeight - screenHeight) / 2;

  const isDisplayVideo = isLoad ? undefined : 'none';

  return (
    <SafeAreaView>
      <View style={styles.VideoWrapper}>
        {!isLoad && (
          <Text style={styles.Loading}>
            {sourceUri ? errorText || 'Loading...' : 'Please Select Item.'}
          </Text>
        )}
        {sourceUri && (
          <Video
            ref={videoRef}
            key={sourceUri}
            paused={paused}
            source={{
              uri: sourceUri,
            }}
            ignoreSilentSwitch="ignore"
            style={
              lockToLands
                ? {
                    left: -left,
                    top: -top - insets.top,
                    ...styles.videoRotate,
                  }
                : {
                    ...styles.video,
                    display: isDisplayVideo,
                  }
            }
            onProgress={handleProgress}
            controls
            onLoad={() => {
              setIsLoad(true);
            }}
            onError={err => {
              console.error(err);
              setErrorText('视频路线无法访问，请更换其他路线');
            }}
            onEnd={() => {
              // next play
              if (currentIndex !== -1) {
                setCurrentIndex(currentIndex + 1);
                setSourceUri(routeList[routeName - 1].url[currentIndex + 1]);
              }
            }}
          />
        )}
        <TouchableOpacity
          style={
            lockToLands
              ? styles.FullScreenWarrperRotate
              : styles.FullScreenWarrper
          }
          onPress={() => handleFullScreen()}>
          <Text style={styles.FullScreenBtn}>
            {lockToLands ? '推出' : '全屏'}
          </Text>
        </TouchableOpacity>
        <ScrollView
          style={{
            height: Dimensions.get('screen').height - 300,
          }}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}>
          <Button
            title="跳过 2 分半钟开头片"
            onPress={() => {
              handleSeek(60 * 2);
            }}
          />
          <View style={styles.VideoDetails}>
            <Text style={styles.VideoDetailsName}>{name}</Text>
            <Text>线路选择 （共{routeList.length}条）</Text>
            <Text>
              (线路利用网络爬虫技术获取，各线路提供的版本、清晰度、播放速度等存在差异请自行选择。)
            </Text>
          </View>
          {routeList.map((routeItem, index) => {
            return (
              <View key={index} style={styles.RouteItem}>
                <Text style={styles.RouteItemTitle}>路线{index + 1}</Text>
                <View style={styles.RouteItemWarrper}>
                  {routeItem.url.map(item => {
                    const [_episode, _url]: string[] = item.split('$');
                    return (
                      _episode && (
                        <TouchableOpacity
                          key={_episode}
                          onPress={() => {
                            if (!sourceUri) {
                              setSourceUri(_url);
                            } else if (isLoad) {
                              setIsLoad(false);
                              setSourceUri(_url);
                            }
                            setEpisode(_episode);
                            setRouteName(index + 1);
                            storage.save({
                              key: 'historyList',
                              id,
                              data: {
                                id,
                                name,
                                routeName: index + 1,
                                episode: _episode,
                                sourceUri: _url,
                                currentTime: 0,
                                watchTime: +new Date(),
                              },
                            });
                          }}>
                          <Text
                            // eslint-disable-next-line react-native/no-inline-styles
                            style={{
                              ...styles.RouteItemName,
                              backgroundColor:
                                sourceUri === _url ? '#333' : '#fff',
                              color: sourceUri === _url ? '#fff' : '#333',
                            }}>
                            {_episode}
                          </Text>
                        </TouchableOpacity>
                      )
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  VideoWrapper: {
    backgroundColor: '#fff',
  },
  Loading: {
    width: Dimensions.get('screen').width,
    height: 200,
    lineHeight: 200,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#f4f4f4',
  },
  FullScreenWarrper: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 2,
  },
  FullScreenWarrperRotate: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
    transform: [{rotate: '90deg'}],
  },
  FullScreenBtn: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 8,
  },
  video: {
    width: Dimensions.get('screen').width,
    minHeight: 200,
  },
  videoRotate: {
    width: Dimensions.get('screen').height,
    height: Dimensions.get('screen').width,
    transform: [{rotate: '90deg'}],
    position: 'absolute',
    zIndex: 2,
  },
  VideoDetails: {
    padding: 10,
  },
  VideoDetailsName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  RouteItem: {
    padding: 10,
  },
  RouteItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  RouteItemWarrper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#f4f4f4',
    paddingLeft: 10,
    paddingBottom: 10,
  },
  RouteItemName: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 10,
    height: 40,
    lineHeight: 40,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 1,
    borderColor: '#e5e9ef',
  },
});

export default PlayVideoScreen;
