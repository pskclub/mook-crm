import { useAPIList } from '~/composables/api'

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
  return useAPIList<ITrackerItem>({
    endpoint: 'trackers',
    sort: {
      column: 'created_at',
      ascending: true,
    },
  })
}
