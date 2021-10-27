class ItemCache {
  constructor(data, timeout){
    this.data = data
    this.timeout = timeout
    this.cacheTime = (new Date()).getTime()
  }
}

export default class ExpireCache {
  // 创建一个缓存池
  static cacheMap = new Map()

  // 判断数据是否超时
  static isOverTime(name) {
    const data = ExpireCache.cacheMap.get(name)
    if (!data) return true
    const currentTime = (new Date()).getTime()

    const overTime = (currentTime - data.cacheTime) / 1000
    if (Math.abs(overTime) > data.timeout) {
      // 如果超时就删除原来的数据，并且返回true
      ExpireCache.cacheMap.delete(name)
      return true
    }
    return false
  }
  // 当前数据在缓存中是否超时
  static has(name) {
    return !ExpireCache.isOverTime(name)
  }
  static delete(name) {
    return ExpireCache.cacheMap.delete(name)
  }
  static get(name) {
    const isDataOverTime = ExpireCache.isOverTime(name)
    return isDataOverTime ? null : ExpireCache.cacheMap.get(name).data
  }
  // 设置缓存
  static set(name, data, timeout = 1200) {
    const itemCache = new ItemCache(data, timeout)
    ExpireCache.cacheMap.set(name, itemCache)
  }
}

