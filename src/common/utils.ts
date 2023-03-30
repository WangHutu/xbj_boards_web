import { ref, customRef } from 'vue'


export class LocalVue {
  static getLocal = (name: any) => {
    return localStorage.getItem(name)
  }

  static setLocal = (name: any, value: any) => {
    localStorage.setItem(name, JSON.stringify(value))
  }

  static removeLocal = (name: any) => {
    localStorage.removeItem(name)
  }

  static clearLocal = () => {
    localStorage.clear()
  }
}

export class DebounceAndthrottle {
  static debounceRef = (data: any, delay = 1000) => {
    // 创建定时器
    let timer: any = null
    // 对 delay 进行判断，如果传递的是 null 则不需要使用 防抖方案，直接返回使用 ref 创建的。
    return delay == null
      ? // 返回 ref 创建的
        ref(data)
      : // customRef 中会返回两个函数参数。一个是：track 在获取数据时收集依赖的；一个是：trigger 在修改数据时进行通知派发更新的。
        customRef((track, trigger) => {
          return {
            get() {
              // 收集依赖
              track()
              // 返回当前数据的值
              return data
            },
            set(value) {
              // 清除定时器
              if (timer != null) {
                clearTimeout(timer)
                timer = null
              }
              // 创建定时器
              timer = setTimeout(() => {
                // 修改数据
                data = value
                // 派发更新
                trigger()
              }, delay)
            }
          }
        })
  }

  // data 为创建时的数据
  // delay 为节流时间
  static throttleRef = (data: any, delay = 1000) => {
    // 创建定时器
    let timer:any = null
    // 对 delay 进行判断，如果传递的是 null 则不需要使用 节流方案，直接返回使用 ref 创建的。
    return delay == null
      ? // 返回 ref 创建的
        ref(data)
      : // customRef 中会返回两个函数参数。一个是：track 在获取数据时收集依赖的；一个是：trigger 在修改数据时进行通知派发更新的。
        customRef((track, trigger) => {
          return {
            get() {
              // 收集依赖
              track()
              // 返回当前数据的值
              return data
            },
            set(value) {
              // 清除定时器
              if (timer != null) {
                clearTimeout(timer)
                timer = null
              }
              // 创建定时器
              timer = setTimeout(() => {
                // 修改数据
                data = value
                // 派发更新
                trigger()
              }, delay)
            }
          }
        })
  }
}
