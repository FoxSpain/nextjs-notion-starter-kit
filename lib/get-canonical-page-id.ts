import { type ExtendedRecordMap } from 'notion-types'
import {
  getCanonicalPageId as getCanonicalPageIdImpl,
  parsePageId
} from 'notion-utils'

import { inversePageUrlOverrides } from './config'

export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | undefined {
  const cleanPageId = parsePageId(pageId, { uuid: false })
  if (!cleanPageId) {
    return
  }

  const override = inversePageUrlOverrides[cleanPageId]
  if (override) {
    return override
  } else {
    try {
      // 尝试正常获取漂亮网址
      const canonicalId = getCanonicalPageIdImpl(pageId, recordMap, { uuid })
      return canonicalId || cleanPageId
    } catch (err) {
      // 【核心修复】如果 notion-utils 因为空格子报错 replaceAll，
      // 我们直接拦截错误，返回原始的 ID，保证构建不崩溃。
      console.warn('捕获到属性解析错误，已自动跳过并使用原始ID', err)
      return cleanPageId
    }
  }
}
