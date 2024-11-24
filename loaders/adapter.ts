import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios'

interface SupabaseAdapterConfig extends AxiosRequestConfig {
  params?: {
    select?: string
    order?: string
    page?: number
    limit?: number
    q?: string
    search?: Record<string, any>
    [key: string]: any
  }
}

interface IQueryResult {
  data: any[] | null
  error: any
  count: number | null
}

/**
 * Creates a Supabase adapter for Axios that handles pagination and search
 * @param searchColumns - Array of column names to search in when using the 'q' parameter
 * @returns AxiosAdapter
 */
export const createSupabaseAdapter = (
  searchColumns: string[] = ['name', 'description']
): AxiosAdapter => {
  return async (config: SupabaseAdapterConfig): Promise<AxiosResponse> => {
    const supabase = useSupabaseClient()
    const { url = '', params = {}, method = 'GET', data } = config

    // Extract table name from URL
    const tableName = url.split('/').pop() as string

    // Initialize query with select statement
    let query = supabase.from(tableName).select(params.select || '*', { count: 'exact' })

    // Handle search query (q parameter)
    if (params.q) {
      const searchQuery = params.q.trim()

      if (searchQuery) {
        const searchConditions = searchColumns
          .map((column) => `${column}.ilike.%${searchQuery}%`)
          .join(',')

        query = query.or(searchConditions)
      }
    }

    // Handle advanced search (search parameter)
    if (params.search) {
      Object.entries(params.search).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Handle array values (e.g., multiple values for a column)
          query = query.in(key, value)
        } else if (typeof value === 'string') {
          // Handle partial match for strings
          if (value) {
            query = query.ilike(key, `%${value}%`)
          }
        } else {
          // Handle exact match for other types
          if (value !== undefined) {
            query = query.eq(key, value)
          }
        }
      })
    }

    // Apply filters (excluding special parameters)
    Object.entries(params).forEach(([key, value]) => {
      if (!['select', 'order', 'page', 'limit', 'q', 'search'].includes(key)) {
        query = query.eq(key, value)
      }
    })

    // Apply ordering if specified
    if (params.order) {
      const [column, direction] = params.order.split('.')

      query = query.order(column, { ascending: direction === 'asc' })
    }

    let result: IQueryResult = {
      data: null,
      error: null,
      count: null,
    }

    // Handle different loader types based on method and parameters
    if (method.toLowerCase() === 'get') {
      if (params.page && params.limit) {
        // PageLoader case
        const page = params.page || 1
        const limit = params.limit || 10
        const offset = (page - 1) * limit

        result = await query.range(offset, offset + limit - 1)

        return {
          data: {
            items: result.data || [],
            total: result.count || 0,
            limit,
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
      }

      // ListLoader case
      result = await query

      return {
        data: result.data || [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }
    } else if (method.toLowerCase() === 'post') {
      // ObjectLoader case for POST
      result = await supabase.from(tableName).insert(JSON.parse(data)).select()

      return {
        data: result.data?.[0] || null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }
    } else if (method.toLowerCase() === 'put') {
      // ObjectLoader case for PUT
      result = await supabase
        .from(url.split('/')[1])
        .update(JSON.parse(data))
        .eq('id', tableName)
        .select()

      return {
        data: result.data?.[0] || null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }
    } else if (method.toLowerCase() === 'delete') {
      // ObjectLoader case for PUT
      result = await supabase.from(url.split('/')[1]).delete().eq('id', tableName)

      return {
        data: result.data?.[0] || null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }
    }

    throw new Error(`Unsupported method: ${method}`)
  }
}
