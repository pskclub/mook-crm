import { type AxiosRequestConfig } from 'axios'
import { useRuntimeConfig } from '#app'
import { SITE } from '~/constants/site'
import { useSupabaseSession } from '#build/imports'

export const useRequestOptions = () => {
  const config = useRuntimeConfig()

  const getMock = (): Omit<AxiosRequestConfig, 'baseURL'> & { baseURL: string } => {
    return {
      baseURL: config.public.baseAPIMock,
    }
  }

  const getDefault = (): Omit<AxiosRequestConfig, 'baseURL'> & { baseURL: string } => {
    const session = useSupabaseSession()

    return {
      baseURL: config.public.baseAPI,
      headers: {
        Apikey: SITE.API_KEY,
        Authorization: `Bearer ${session.value?.access_token}`,
      },
    }
  }

  return { getDefault, getMock }
}
