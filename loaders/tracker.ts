import { useAPIList, useAPIRemove, useAPIUpdate } from '~/composables/api'

export interface ITrackerItem {
  id: string
  created_at: string
  tracker_date: string
  tracker_type: string
  project_id: string
  timing: number
  detail: string
  created_by: string
  projects: IProjectItem
  profiles: {
    id: string
    team: string
    display_name: string
  }
}

export interface IProjectItem {
  id: string
  code: string
  name: string
  created_at: string
}

export interface IProfileItem {
  id: string
  created_at: string
  name: string
  code: string
}

export const useTracker = () => {
  return useAPIList<ITrackerItem>({
    endpoint: 'trackers',
    select: '*,projects(*),profiles(*)',
    sort: {
      column: 'created_at',
      ascending: false,
    },
  })
}

export const useTrackerCreate = () => {
  return useAPICreate({
    endpoint: 'trackers',
  })
}

export const useTrackerUpdate = () => {
  return useAPIUpdate({
    endpoint: 'trackers',
  })
}

export const useTrackerRemove = () => {
  return useAPIRemove({
    endpoint: 'trackers',
  })
}

export const useProject = defineStore('project', () => {
  return useAPIList<IProfileItem>({
    endpoint: 'projects',
    select: '*',
    sort: {
      column: 'created_at',
      ascending: false,
    },
  })
})
