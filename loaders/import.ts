import { useRequestOptions } from '#imports'
import { type IProductItem } from '~/loaders/product'

export const useProductImportLoader = () => {
  const config = useRequestOptions()

  return useObjectLoader<{
    total: number
    batches: number
    items: IProductItem[]
    success: boolean
  }>({
    url: '/functions/v1/import',
    method: 'POST',
    getRequestOptions: config.getDefault,
  })
}

export const useProductSyncLoader = () => {
  const config = useRequestOptions()

  return useObjectLoader<{
    total: number
    item: IProductItem
    success: boolean
  }>({
    url: '/functions/v1/sync',
    method: 'POST',
    getRequestOptions: config.getDefault,
  })
}
