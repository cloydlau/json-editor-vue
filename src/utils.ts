import { isPlainObject, merge, cloneDeepWith } from 'lodash-es'
import Vue from 'vue'

// cloneDeep不支持Vue实例
function customizer (value: any) {
  if (value instanceof Vue) {
    return value
  }
}

/**
 * 参数有全局参数、实例参数和默认值之分 取哪个取决于用户传了哪个：
 *   1. 怎么判断用户传没传？ —— 以该参数是否全等于undefined作为标识
 *   2. 如果传了多个，权重顺序是怎样的？ —— 实例＞全局＞默认
 *
 * @param {any} prop - 实例参数
 * @param {any} globalProps - 全局参数（可以有多个）
 * @param {any} defaultValue - 默认值
 * @return {any} 最终值
 */
export function getFinalProp () {
  const defaultValue = arguments[arguments.length - 1]
  let result = defaultValue
  console.log('传参：', arguments)
  for (let i = 0; i < arguments.length - 1; i++) {
    const prop = arguments[i]
    if (prop !== undefined) {
      if (i === 0 && typeof (defaultValue) === 'boolean') {
        result = ['', true].includes(prop) ? true : prop
      } else if (isPlainObject(prop)) { // todo: 无法判断Vue实例
        result = merge(undefined, ...cloneDeepWith(Array.from(arguments).reverse(), customizer)) // 会改变原对象
        //result = merge(...cloneDeepWith(Array.from(arguments).reverse(), customizer)) // 会改变原对象 // todo: ts报错
        break
      } else {
        result = prop
      }
      break
    }
  }
  console.log('生效：', result)
  return result
}
