import { type IStatus } from '#core/types/lib'

export interface IFetchOptions {
  filters?: [
    {
      column: string
      operator: string
      value: any
    },
  ]
  sort?: { column: string; ascending: boolean }
}

export const useAPIList = <T>(options: {
  endpoint: string
  select?: string
  filters?: [
    {
      column: string
      operator: string
      value: any
    },
  ]
  sort?: { column: string; ascending: boolean }
}) => {
  const supabase = useSupabaseClient()
  const items = ref<T[]>([])
  const status = ref<IStatus>(ObjectHelper.createStatus())

  const fetch = async (fetchOptions = {} as IFetchOptions) => {
    status.value = ObjectHelper.toLoadingStatus(status.value)
    const query = supabase.from(options.endpoint).select(options.select ?? '*')

    const mergedFilterOptions = [...(options.filters || []), ...(fetchOptions.filters || [])]

    for (const filter of mergedFilterOptions) {
      query.filter(filter.column, filter.operator, filter.value)
    }

    if (options.sort) {
      query.order(options.sort.column, { ascending: options.sort.ascending })
    }

    const res = await query

    if (res.error) {
      status.value = ObjectHelper.toErrorStatus(status.value, res.error)
    } else {
      items.value = res.data as T[]
      status.value = ObjectHelper.toSuccessStatus(status.value)
    }

    status.value = ObjectHelper.toCompleteStatus(status.value)
  }

  return { items, status, fetch }
}

export const useAPICreate = (options: { endpoint: string }) => {
  const supabase = useSupabaseClient()
  const status = ref<IStatus>(ObjectHelper.createStatus())

  const create = async (data: any) => {
    status.value = ObjectHelper.toLoadingStatus(status.value)
    const res = await supabase.from(options.endpoint).insert(data)

    if (res.error) {
      status.value = ObjectHelper.toErrorStatus(status.value, res.error)
    } else {
      status.value = ObjectHelper.toSuccessStatus(status.value)
    }

    status.value = ObjectHelper.toCompleteStatus(status.value)
  }

  return { status, create }
}

export const useAPIUpdate = (options: { endpoint: string }) => {
  const supabase = useSupabaseClient()
  const status = ref<IStatus>(ObjectHelper.createStatus())

  const update = async (id: string, data: any) => {
    status.value = ObjectHelper.toLoadingStatus(status.value)
    const res = await supabase
      .from(options.endpoint)
      .update(data as never)
      .eq('id', id)

    if (res.error) {
      status.value = ObjectHelper.toErrorStatus(status.value, res.error)
    } else {
      status.value = ObjectHelper.toSuccessStatus(status.value)
    }

    status.value = ObjectHelper.toCompleteStatus(status.value)
  }

  return { status, update }
}

export const useAPIRemove = (options: { endpoint: string }) => {
  const supabase = useSupabaseClient()
  const status = ref<IStatus>(ObjectHelper.createStatus())

  const remove = async (id: string) => {
    status.value = ObjectHelper.toLoadingStatus(status.value)
    const res = await supabase.from(options.endpoint).delete().eq('id', id)

    if (res.error) {
      status.value = ObjectHelper.toErrorStatus(status.value, res.error)
    } else {
      status.value = ObjectHelper.toSuccessStatus(status.value)
    }

    status.value = ObjectHelper.toCompleteStatus(status.value)
  }

  return { status, remove }
}
