export function get_tks(current_id: string, e_token: string) {
  // var current_id = '831502';
  // var e_token = 'koa2da05d1ojhc76c0addw155a7d2dzvo175a99c2';

  // 如果元素不存在或者值为空，则直接返回
  if (!current_id || !e_token) {
    return;
  }

  // 截取子字符串并按指定规则处理
  var _0x3882a3 = current_id.length;
  var _0x52a097 = current_id.substring(_0x3882a3 - 4, _0x3882a3);
  var _0x2d9d1b = [];

  for (let _0x570711 = 0; _0x570711 < _0x52a097.length; _0x570711++) {
    var _0x23e537 = parseInt(_0x52a097[_0x570711]);
    var _0x48b93d = (_0x23e537 % 3) + 1;

    _0x2d9d1b[_0x570711] = e_token.substring(_0x48b93d, _0x48b93d + 8);
    e_token = e_token.substring(_0x48b93d + 8, e_token.length);
  }

  // 将处理后的值连接成一个字符串返回
  return _0x2d9d1b.join('');
}

export function mergeArrays<T>(...arrays: T[][]): T[] {
  // 将所有数组合并成一个新数组
  const mergedArray: T[] = [].concat(...arrays);

  // 使用 Set 来过滤重复值，并将其转换为数组返回
  return Array.from(new Set<T>(mergedArray));
}
