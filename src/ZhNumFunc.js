/**
 * @abstract: 
 * @version: 请写项目版本
 * @author: @Haxif
 * @Date: 2021-11-24 09:01:35
 * @LastEditors: @Haxif
 * @LastEditTime: 2021-11-27 00:32:40
 */
import { TypeFunc } from "./TypeFunc.js";
import has from 'has'

export class ZhNumFunc extends TypeFunc {
  constructor() {
    super('中文数值转化')
  }

  static check(zh) {
    return isZhNum(zh)
  }

  static trans(zh) {
    return zhToNum(zh)
  }
}

export const zhMap = {
  '零': '0',
  '一': '1',
  '二': '2',
  '两': '2',
  '三': '3',
  '四': '4',
  '五': '5',
  '六': '6',
  '七': '7',
  '八': '8',
  '九': '9',
  '十': 'E+01',
  '百': 'E+02',
  '千': 'E+03',
  '万': 'E+04',
  '亿': 'E+08',
  '兆': 'E+12',
  '京': 'E+16',
  '垓': 'E+20',
  '秭': 'E+24',
  '壤': 'E+28',
  '沟': 'E+32',
  '涧': 'E+36',
  '正': 'E+40',
  '载': 'E+44'
}

/*======================================*
* ZhMap 基础方法
**=======================================*/
//判断是中文数字（整个字符串）
export function isZhNum(zh) {
  if (zh.length === 0)
    return false;
  for (let i = 0; i < zh.length; i++) {
    if (!has(zhMap, zh[i])) {
      return false
    }
  }
  return true
}
export function isZhBaseNum(zh) {
  if (isZhNum(zh) && !isUnit(zh))
    return true
  return false
}
export function isUnit(k) {
  let units = getUnits();
  for (let i = 0; i < units.length; i++) {
    if (k === units[i]) {
      return true
    }
  }
  return false
}
// 获取右侧有效中文数字（截至非中文数字）
export function rightContinuousNums(zh) {
  let zhNum = '';
  for (let i = zh.length - 1; i >= 0; i--) {
    const element = zh[i];
    if (!isZhNum(element)) {
      break;
    }
    zhNum = element + zhNum;
  }
  return zhNum
}
// 检查字符串中含有的中文数字数量
export function checkZhNum(zh) {
  let isNums = 0;
  for (let i = 0; i < zh.length; i++) {
    if (has(zhMap, zh[i])) {
      isNums++;
    }
  }
  return isNums
}
// 获取中文映射Map的所有顺序key
export function getZhNumList() {
  return Object.keys(zhMap)
}
// 获取单位数组
export function getUnits() {

  let keys = Object.keys(zhMap).join('')
  const index = keys.indexOf('十')
  keys = keys.substr(index)
    .split('')
  return keys
}
// 获取单位索引值
export function getUnitIndex(unit) {
  if (!isUnit(unit)) {
    return null
  }

  let units = getUnits();
  for (let i = 0; i < units.length; i++) {
    if (unit === units[i]) {
      return i
    }
  }

  return null
}
// 获取 数字/单位 对应map映射
export function getForMap(item) {
  return zhMap[item]
}

//获取 单位 对应map映射
export function getUnitForMap(unit) {
  if (!getUnits().some(item => { return unit == item }))
    return null;

  return zhMap[unit]

}

/*======================================*
* 中文转化数字（字符串） 
**=======================================*/
export function zhToNum(zh) {
  let sp_zh = rightContinuousNums(zh);
  if (!isZhNum(sp_zh)) {
    return zh
  }
  if (getForMap(sp_zh) === '0') {
    return '0'
  }

  // 初步分组  [ [ '一', '百' ], [ '三', '十' ], [ '五', '万' ] ]
  let group = [[]]
  sp_zh = sp_zh.split('');
  for (let i = 0; i < sp_zh.length; i++) {
    const element = sp_zh[i];
    if (isZhBaseNum(element)) {
      const len = group[group.length - 1].length
      if (len === 0) {
        group[group.length - 1].push(element)
      } else {
        group.push([element])
      }
    } else if (isUnit(element)) {
      const len = group[group.length - 1].length
      if (len > 1) {
        group.push(['$', element])
      } else if (len === 0) {
        group[group.length - 1].push('$')
        group[group.length - 1].push(element)
      } else {
        group[group.length - 1].push(element)
      }
    }
  }

  // 分元（梯度下降组）
  let groupSum = [], index = 0, flag_enable = false;
  for (let i = 0; i < group.length; i++) {
    const element = group[i];
    let num, unit;
    if (element.length === 1) {
      num = element[0];
      unit = 0;
    } else {
      num = element[0];
      unit = getUnitIndex(element[1]) + 1;
    }

    if (unit >= index && !flag_enable) {
      groupSum.push([element])
      if (i !== 0) {
        flag_enable = true;
      }
    } else if (flag_enable) {
      groupSum.push([element])
      flag_enable = false;
    } else {
      groupSum[groupSum.length - 1].push(element)
    }
    if (!(Number(getForMap(num)) === 0))
      index = unit
  }


  // 求元内数字
  let groupSim = []
  for (let i = 0; i < groupSum.length; i++) {
    const groupItems = groupSum[i];
    let sum = '';
    for (let j = 0; j < groupItems.length; j++) {
      const element = groupItems[j];
      if (element.length === 0) {
        continue;
      }
      let numBase, unitE;
      if (element[0] === '$') {
        if (j === 0 && i !== 0) {
          numBase = '0'
        } else {
          numBase = '1'
        }
      } else {
        numBase = getForMap(element[0])
      }
      if (element.length > 1) {
        unitE = getUnitForMap(element[1])
      } else {
        unitE = 'E+00';
      }

      const ESize = Number(unitE.match(/E\+(.*)/)[1]);
      let localAns = numBase;
      if (typeof (localAns) == 'number')
        localAns = localAns.toString()
      for (let e = 0; e < ESize; e++) {
        localAns += '0'
      }

      if (!(localAns.length === 1 && Number(localAns) === 0)) {
        sum = NumMerge(sum, localAns)
      } else if (j === 0) {
        sum = localAns
      }
    }
    // answer = answer.substr(0, answer.length - 1) + sum
    groupSim.push(sum)

  }


  // 梯度求和(1) 基础合并
  let gradientSum = []
  for (let i = 0; i < groupSim.length; i++) {
    const element = groupSim[i];
    if (gradientSum.length === 0) {
      gradientSum.push(element)
      continue;
    }
    let lastItem = gradientSum.pop()
    if (element.length >= lastItem.length || element[0] === '0') {
      const sum = lastItem.substr(0, lastItem.length - 1) + element
      gradientSum.push(sum)
    } else {
      gradientSum.push(lastItem)
      gradientSum.push(element)
    }
  }


  // 梯度求和(2) 完全合并
  let answer = '';
  for (let i = 0; i < gradientSum.length; i++) {
    const element = gradientSum[i];
    answer = NumSum(answer, element)
  }


  return answer

}



/*======================================*
* 数字处理
**=======================================*/
//合并两个字符串数字（防止大数字超限）最大位数字冲突时(2)数字优先覆盖(1)
function NumMerge(num1, num2) {
  let num_1 = num1, num_2 = num2;
  if (typeof (num_1) === 'number') {
    num_1 = num_1.toString()
  }
  if (typeof (num_2) === 'number') {
    num_2 = num_2.toString()
  }
  let len1 = num_1.length, len2 = num_2.length;
  let ans = '';
  if (len1 > len2) {
    const len_diff = len1 - len2;
    ans = num_1.substr(0, len_diff) + num_2
  } else if (len1 < len2) {
    const len_diff = len2 - len1;
    ans = num_2.substr(0, len_diff) + num_1
  } else {
    ans = num_2;
  }
  return ans
}
//求和 字符类型
function NumSum(a, b) {
  if (!a)
    return b;
  if (!b)
    return a;
  const _a = a || '', _b = b || ''
  const len1 = _a.length, len2 = _b.length;
  const diff = Math.abs(len1 - len2);
  if (len1 > len2) {
    let _arr = _a.split('')
    for (let i = 0; i < _b.length; i++) {
      const element = _b[i];
      _arr[diff + i] = Number(element) + Number(_arr[diff + i]);
    }
    return _arr.join('')
  } else if (len1 < len2) {
    let _arr = _b.split('')
    for (let i = 0; i < _a.length; i++) {
      const element = _a[i];
      _arr[diff + i] = Number(element) + Number(_arr[diff + i]);
    }
    return _arr.join('')
  } else {
    let _arr = _a.split('')
    for (let i = 0; i < _b.length; i++) {
      const element = _b[i];
      _arr[i] = Number(element) + Number(_arr[i]);
    }
    return _arr.join('')
  }


}