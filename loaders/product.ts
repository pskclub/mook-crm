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
  category_id: number
  product_categories: {
    id: number
    name: string
  }
  product_files: Array<{
    id: number
    name: string
    path: string
  }>
  brand_id: number
  product_brands: {
    id: number
    name: string
  }
  type_id: number
  product_types: {
    id: number
    name: string
  }
  group_id: number
  product_groups: {
    id: number
    name: string
  }
  sub_group_id: number
  product_sub_groups: {
    id: number
    name: string
  }
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

export interface IProductBrandItem {
  id: number
  name: string
}

export interface IProductTypeItem {
  id: number
  name: string
}

export interface IProductGroupItem {
  id: number
  name: string
}

export const useProductPageLoader = () => {
  return usePageLoader<IProductItem>({
    baseURL: '/products',
    getBaseRequestOptions: () => {
      return {
        params: {
          select:
            '*,product_categories(*),product_files(*),product_brands(*),product_types(*),product_groups(*),product_sub_groups(*)',
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
          order: 'id.asc',
        },
        adapter: createSupabaseAdapter(['name']),
      }
    },
  })
})

export const useProductBrandListLoader = defineStore('product_brands', () => {
  return usePageLoader<IProductBrandItem>({
    baseURL: '/product_brands',
    getBaseRequestOptions: () => {
      return {
        params: {
          select: '*',
          order: 'id.asc',
        },
        adapter: createSupabaseAdapter(['name']),
      }
    },
  })
})

export const useProductTypeListLoader = defineStore('product_types', () => {
  return usePageLoader<IProductTypeItem>({
    baseURL: '/product_types',
    getBaseRequestOptions: () => {
      return {
        params: {
          select: '*',
          order: 'id.asc',
        },
        adapter: createSupabaseAdapter(['name']),
      }
    },
  })
})

export const useProductGroupListLoader = defineStore('product_groups', () => {
  return usePageLoader<IProductGroupItem>({
    baseURL: '/product_groups',
    getBaseRequestOptions: () => {
      return {
        params: {
          select: '*',
          order: 'id.asc',
        },
        adapter: createSupabaseAdapter(['name']),
      }
    },
  })
})

export const useProductSubGroupListLoader = defineStore('product_sub_groups', () => {
  return usePageLoader<IProductGroupItem>({
    baseURL: '/product_sub_groups',
    getBaseRequestOptions: () => {
      return {
        params: {
          select: '*',
          order: 'id.asc',
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
