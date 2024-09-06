import { type IStatus } from '#core/types/lib'

export const useAPIList = <T>(options: {
  endpoint: string
  sort?: { column: string; ascending: boolean }
}) => {
  const supabase = useSupabaseClient()
  const items = ref<T[]>([])
  const status = ref<IStatus>(ObjectHelper.createStatus())

  const fetch = async () => {
    status.value = ObjectHelper.toLoadingStatus(status.value)
    const query = supabase.from(options.endpoint).select('*')

    if (options.sort) {
      query.order(options.sort.column, { ascending: options.sort.ascending })
    }

    const res = await query

    if (res.error) {
      status.value = ObjectHelper.toErrorStatus(status.value, res.error)
    } else {
      items.value = res.data
      status.value = ObjectHelper.toSuccessStatus(status.value)
    }

    status.value = ObjectHelper.toCompleteStatus(status.value)
  }

  return { items, status, fetch }
}
