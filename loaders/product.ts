import { usePageLoader } from '#imports'
import { createSupabaseAdapter } from '~/loaders/adapter'

export interface IProductItem {
  id: number
  created_at: string
  name: string
  code: string
  detail?: string
  price: number
  price_plus: number
  qty: number
  product_categories: {
    id: number
    name: string
  }
  product_files: Array<{
    id: number
    name: string
    path: string
  }>
}

export interface IProductOriginItem {
  RID: number
  ItemNo: string
  ModelName: string
  ItemDetail: string
  BrandNameTH: string
  OrgItemNo: any
  Price: Array<{ Price: number }>
  Cost: Array<{ QTY: number }>
  Group: {
    RID: number
    GroupName: string
  }
  Type: {
    RID: number
    TypeName: string
  }
}

export const useProductPageLoader = () => {
  return usePageLoader<IProductItem>({
    baseURL: '/products',
    getBaseRequestOptions: () => {
      return {
        params: {
          select: '*,product_categories(*),product_files(*)',
          order: 'created_at.desc',
        },
        adapter: createSupabaseAdapter(['name', 'code']),
      }
    },
  })
}

export const useProductCategoryListLoader = defineStore('product_categories', () => {
  return usePageLoader<IProductItem>({
    baseURL: '/product_categories',
    getBaseRequestOptions: () => {
      return {
        params: {
          select: '*',
          order: 'created_at.desc',
        },
        adapter: createSupabaseAdapter(['name']),
      }
    },
  })
})

export const useProductOriginLoader = () => {
  return useObjectLoader<IProductOriginItem[]>({
    url: 'https://crmur.10bitdevelopment.com/Accountting/Inventory/SearchProduct',
    method: 'POST',
  })
}
