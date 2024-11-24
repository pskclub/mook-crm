import { useRequestOptions } from '#imports'

export const useProductImportLoader = () => {
  const config = useRequestOptions()

  return useObjectLoader<{
    total: number
    batches: number
    items: any[]
    success: boolean
  }>({
    url: '/functions/v1/import',
    method: 'POST',
    getRequestOptions: config.getDefault,
  })
}
