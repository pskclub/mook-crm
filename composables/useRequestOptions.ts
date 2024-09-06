import { type AxiosRequestConfig } from 'axios'
import { useRuntimeConfig } from '#app'

export const useRequestOptions = () => {
  const config = useRuntimeConfig()

  const getMock = (): Omit<AxiosRequestConfig, 'baseURL'> & { baseURL: string } => {
    return {
      baseURL: config.public.baseAPIMock,
    }
  }

  const getDefault = (): Omit<AxiosRequestConfig, 'baseURL'> & { baseURL: string } => {
    return {
      baseURL: config.public.baseAPI,
    }
  }

  return { getDefault, getMock }
}
