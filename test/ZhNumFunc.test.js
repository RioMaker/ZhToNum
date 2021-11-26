/**
 * @abstract: 
 * @version: 请写项目版本
 * @author: @Haxif
 * @Date: 2021-11-27 00:30:54
 * @LastEditors: @Haxif
 * @LastEditTime: 2021-11-27 00:32:20
 */
import { ZhNumFunc, zhMap } from "../src/ZhNumFunc";


describe('ZhNumFunc', () => {
  it('check', () => {
    for (const key in zhMap) {
      expect(ZhNumFunc.check(key)).toBe(true)
    }
    const key1 = '任意'
    expect(ZhNumFunc.check(key1)).toBe(false)
  })
  it('trans zh to num', () => {
    expect(ZhNumFunc.trans('')).toBe('')
    expect(ZhNumFunc.trans('零')).toBe('0')
    expect(ZhNumFunc.trans('一')).toBe('1')
    expect(ZhNumFunc.trans('二')).toBe('2')
    expect(ZhNumFunc.trans('三')).toBe('3')
    expect(ZhNumFunc.trans('四')).toBe('4')
    expect(ZhNumFunc.trans('五')).toBe('5')
    expect(ZhNumFunc.trans('六')).toBe('6')
    expect(ZhNumFunc.trans('七')).toBe('7')
    expect(ZhNumFunc.trans('八')).toBe('8')
    expect(ZhNumFunc.trans('九')).toBe('9')
    expect(ZhNumFunc.trans('十')).toBe('10')
    expect(ZhNumFunc.trans('百')).toBe('100')
    expect(ZhNumFunc.trans('千')).toBe('1000')
    expect(ZhNumFunc.trans('万')).toBe('10000')
    expect(ZhNumFunc.trans('亿')).toBe('100000000')
    expect(ZhNumFunc.trans('兆')).toBe('1000000000000')
    expect(ZhNumFunc.trans('京')).toBe('10000000000000000')
    expect(ZhNumFunc.trans('垓')).toBe('100000000000000000000')
    expect(ZhNumFunc.trans('秭')).toBe('1000000000000000000000000')
    expect(ZhNumFunc.trans('壤')).toBe('10000000000000000000000000000')
    expect(ZhNumFunc.trans('沟')).toBe('100000000000000000000000000000000')
    expect(ZhNumFunc.trans('涧')).toBe('1000000000000000000000000000000000000')
    expect(ZhNumFunc.trans('正')).toBe('10000000000000000000000000000000000000000')
    expect(ZhNumFunc.trans('载')).toBe('100000000000000000000000000000000000000000000')
    expect(ZhNumFunc.trans('十一')).toBe('11')
    expect(ZhNumFunc.trans('二十一')).toBe('21')
    expect(ZhNumFunc.trans('十一百')).toBe('1100')
    expect(ZhNumFunc.trans('十一百千')).toBe('1100000')
    expect(ZhNumFunc.trans('十一百千万')).toBe('11000000000')
    expect(ZhNumFunc.trans('三百四十五京')).toBe('3450000000000000000')
    expect(ZhNumFunc.trans('三百四十五京六十八亿')).toBe('3450000006800000000')
    expect(ZhNumFunc.trans('三十四')).toBe('34')
    expect(ZhNumFunc.trans('六十八')).toBe('68')
    expect(ZhNumFunc.trans('七十五')).toBe('75')
    expect(ZhNumFunc.trans('三百九十八')).toBe('398')
    expect(ZhNumFunc.trans('六千九百五十四')).toBe('6954')
    expect(ZhNumFunc.trans('九万五千三百')).toBe('95300')
    expect(ZhNumFunc.trans('一一亿亿')).toBe('10000000000000000')
  })
})