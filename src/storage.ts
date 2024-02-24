import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 10000,
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,
  defaultExpires: null,
  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,
});

export default storage;
