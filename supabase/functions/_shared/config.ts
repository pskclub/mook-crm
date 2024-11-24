const SITE = {
  TITLE: 'ABT มุกสุดสวย',
  BASE_API: 'https://eaalzoxnmypyexmcvofh.supabase.co',
  API_KEY:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYWx6b3hubXlweWV4bWN2b2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMzU2MDQsImV4cCI6MjA0NzcxMTYwNH0.J7cYCvKnFA05PXI7QZDCWCHW6DczFa8T2G3ocaRKtC8',
}

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
  category_id: number
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

export interface IProductFileResponse {
  CreateBy: any
  File: {
    FileName: string
    Detail: string | null
    Path: string
    Extension: string
    Status: number
    Size: number
    LocalFileName: string
    FullPath: string
    RID: number
    CreateDate: string
    UpdateDate: string
    UpdateBy_RID: number
    CreateBy_RID: number
  }
  RID: number
  CreateDate: string
  UpdateDate: string
}

// Configuration
export const SOURCE_API = 'https://crmur.10bitdevelopment.com/Accountting/Inventory/SearchProduct'

export const SOURCE_API_BY_ID =
  'https://crmur.10bitdevelopment.com/Accountting/Inventory/LoadInventory'

export const SOURCE_FILE_API =
  'https://crmur.10bitdevelopment.com/Warehouse/Inventory/LoadHisInventoryFile'

export const SUPABASE_URL = SITE.BASE_API

export const SUPABASE_KEY = SITE.API_KEY
