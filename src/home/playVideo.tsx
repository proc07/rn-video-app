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
import {useRoute, useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import {get_tks} from '../util';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
const cheerio = require('cheerio');

const PlayVideoScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id} = route.params as {
    id: string;
  };
  const [routeList, setRouteList] = useState<
    Array<{
      flag: string;
      url: Array<string>;
    }>
  >([]);

  const fetcVideoList = useCallback(
    (e_token: string) => {
      console.log('===22============', id);
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
                  const aKey = a.split('$')[0];
                  const bKey = b.split('$')[0];
                  // 使用 localeCompare 方法进行排序
                  return aKey.localeCompare(bKey);
                }),
              };
            });
            // console.log(newData);
            setRouteList(newData);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    [id],
  );

  useEffect(() => {
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
        console.log(err);
      });

    return () => {
      setSourceUri('');
    };
  }, []);

  const videoRef = useRef<any>(null);
  const [lockToLands, setlockToLand] = useState(false);
  const [sourceUri, setSourceUri] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const handleProgress = data => {
    // console.log(data);
    setCurrentTime(data.currentTime); // 更新当前播放时间
  };
  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.seek(time); // 跳转到指定的时间点
    }
  };
  useEffect(() => {
    Orientation.lockToPortrait(); // 锁定竖屏模式
    return () => {
      Orientation.unlockAllOrientations(); // 解锁屏幕方向
    };
  }, []);

  const handleFullScreen = () => {
    setlockToLand(true);
    // 在组件加载时隐藏标题栏
    navigation.setOptions({
      headerShown: false,
    });
    // Orientation.lockToLandscapeLeft(); // 切换到横屏模式
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

  return (
    <SafeAreaView>
      <View style={styles.VideoWrapper}>
        <Video
          ref={videoRef}
          key={sourceUri}
          source={{
            uri: sourceUri,
          }}
          style={
            lockToLands
              ? {
                  left: -left,
                  top: -top - insets.top,
                  ...styles.videoRotate,
                }
              : styles.video
          }
          onProgress={handleProgress}
          controls
          onError={err => {
            console.error(err);
          }}
        />
        <ScrollView
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
          <Button title="全屏" onPress={handleFullScreen} />
          <View style={styles.VideoDetails}>
            <Text style={styles.VideoDetailsName}>xxxx</Text>
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
                    const [name, url] = item.split('$');
                    return (
                      name && (
                        <TouchableOpacity
                          key={name}
                          onPress={() => {
                            console.log(url);
                            setSourceUri(url);
                          }}>
                          <Text style={styles.RouteItemName}>{name}</Text>
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
    backgroundColor: '#fff',
    border: '#e5e9ef',
  },
});

export default PlayVideoScreen;
