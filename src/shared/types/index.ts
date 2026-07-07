/**
 * 全局通用类型
 */

/** API 统一响应格式 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** 分页参数 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** 分页响应 */
export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** 下拉选项 */
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

/** 表格排序 */
export interface SortParams {
  field: string
  order: 'asc' | 'desc'
}
