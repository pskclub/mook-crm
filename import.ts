import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import { SITE } from '~/constants/site'
import { type IProductItem, type IProductOriginItem } from '~/loaders/product'

export interface IProductFileResponse {
  CreateBy: any
  File: {
    FileName: string
    Detail: string | null
    Path: string
    Extension: string
    Status: number
    Size: number
    LocalFileName: string
    FullPath: string
    RID: number
    CreateDate: string
    UpdateDate: string
    UpdateBy_RID: number
    CreateBy_RID: number
  }
  RID: number
  CreateDate: string
  UpdateDate: string
}

// Configuration
const SOURCE_API = 'https://crmur.10bitdevelopment.com/Accountting/Inventory/SearchProduct'
const SOURCE_FILE_API =
  'https://crmur.10bitdevelopment.com/Warehouse/Inventory/LoadHisInventoryFile'

const SUPABASE_URL = SITE.BASE_API
const SUPABASE_KEY = SITE.API_KEY
const KWValue = 'dt'

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Transform function
const transformProduct = (origin: IProductOriginItem): Omit<IProductItem, 'created_at'> => {
  // Get first price and price_plus from Price array
  const basePrice = origin.Price?.[0]?.Price || 0
  const plusPrice = origin.Price?.[1]?.Price || 0

  // Calculate total quantity from Cost array
  const totalQty = origin.Cost?.reduce((sum, item) => sum + (item.QTY || 0), 0) || 0

  return {
    id: origin.RID,
    name: origin.ModelName,
    code: origin.ItemNo,
    detail: `${
      origin.ItemDetail || ''
    }\nBrand: ${origin.BrandNameTH}\nGroup: ${origin.Group?.GroupName}\nType: ${origin.Type?.TypeName}`,
    price: basePrice,
    price_plus: plusPrice,
    qty: totalQty,
  }
}

// Main import function
const importProducts = async () => {
  try {
    // 1. Fetch data from source
    console.log('Fetching data from source...')
    const response = await axios.post(SOURCE_API, {
      KW: KWValue, // Add any required parameters
    })

    const sourceProducts: IProductOriginItem[] = response.data

    // 2. Transform and prepare data
    console.log('Transforming data...')
    const transformedProducts = sourceProducts.map(transformProduct)

    // 3. Batch insert into Supabase
    console.log('Inserting data into Supabase...')
    const BATCH_SIZE = 100
    const results = []

    for (let i = 0; i < transformedProducts.length; i += BATCH_SIZE) {
      const batch = transformedProducts.slice(i, i + BATCH_SIZE)

      const { data, error } = await supabase.from('products').upsert(batch, {
        onConflict: 'code', // Assuming code is unique
        ignoreDuplicates: true,
      })

      if (error) {
        console.log(batch)

        console.error(`Error in batch ${i / BATCH_SIZE + 1}:`, error)
        throw error
      }

      results.push(data)
      console.log(
        `Processed batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
          transformedProducts.length / BATCH_SIZE
        )}`
      )
    }

    for (const product of transformedProducts) {
      try {
        const { data } = await axios.post<IProductFileResponse[]>(SOURCE_FILE_API, {
          RID: product.id, // Add any required parameters
        })

        await supabase.from('product_files').insert(
          data.map((file) => ({
            name: file.File.FileName,
            path: file.File.RID,
            product_id: product.id,
          }))
        )
      } catch (e) {
        console.error(`Error in batch ${product.id / BATCH_SIZE + 1}:`, e)
      }
    }

    // 4. Return summary
    return {
      total: transformedProducts.length,
      batches: Math.ceil(transformedProducts.length / BATCH_SIZE),
      success: true,
    }
  } catch (error) {
    console.error('Import failed:', error)
    throw error
  }
}

// Create a function to run the import with retry logic
export const runImportWithRetry = async (maxRetries = 3) => {
  let attempts = 0

  while (attempts < maxRetries) {
    try {
      const result = await importProducts()

      console.log('Import completed successfully:', result)

      return result
    } catch (error) {
      attempts++
      console.error(`Import attempt ${attempts} failed:`, error)

      if (attempts === maxRetries) {
        throw new Error(`Import failed after ${maxRetries} attempts`)
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 1000))
    }
  }
}

// Example usage with logging
const runImport = async () => {
  console.time('Import Duration')

  try {
    const result = await runImportWithRetry()

    console.log('Final import result:', result)
  } catch (error) {
    console.error('Import failed completely:', error)
  }

  console.timeEnd('Import Duration')
}

runImport()
