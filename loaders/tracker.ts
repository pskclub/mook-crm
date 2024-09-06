import { useSupabaseClient } from '#imports'
import { type IStatus } from '#core/types/lib'

export interface ITrackerItem {
  id: string
  created_at: string
  tracker_date: string
  tracker_type: string
  project_id: string
  timing: number
  detail: string
  created_by: string
}

export const useTracker = () => {
  const supabase = useSupabaseClient()
  const items = ref<ITrackerItem[]>([])
  const status = ref<IStatus>(ObjectHelper.createStatus())

  const run = async () => {
    status.value = ObjectHelper.toLoadingStatus(status.value)
    const res = await supabase
      .from('trackers')
      .select('*')
      .order('created_at', { ascending: false })

    if (res.error) {
      status.value = ObjectHelper.toErrorStatus(status.value, res.error)
    } else {
      items.value = res.data
      status.value = ObjectHelper.toSuccessStatus(status.value)
    }

    status.value = ObjectHelper.toCompleteStatus(status.value)
  }

  return { items, status, run }
}
