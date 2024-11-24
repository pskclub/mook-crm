// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import axios from 'https://deno.land/x/axiod/mod.ts'

const SITE = {
  TITLE: 'บริษัท อัพไรท์ ซิมมูเลชั่น จำกัด',
  BASE_API: 'https://eaalzoxnmypyexmcvofh.supabase.co',
  API_KEY:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYWx6b3hubXlweWV4bWN2b2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMzU2MDQsImV4cCI6MjA0NzcxMTYwNH0.J7cYCvKnFA05PXI7QZDCWCHW6DczFa8T2G3ocaRKtC8',
}

console.log('Hello from Functions!')

export interface IProductItem {
  id: number
  created_at: string
  name: string
  code: string
  detail?: string
  price: number
  price_plus: number
  qty: number
  product_categories: {
    id: number
    name: string
  }
  product_files: Array<{
    id: number
    name: string
    path: string
  }>
}

export interface IProductOriginItem {
  RID: number
  ItemNo: string
  ModelName: string
  ItemDetail: string
  BrandNameTH: string
  OrgItemNo: any
  Price: Array<{ Price: number }>
  Cost: Array<{ QTY: number }>
  Group: {
    RID: number
    GroupName: string
  }
  Type: {
    RID: number
    TypeName: string
  }
}

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
const importProducts = async (q: string) => {
  try {
    // 1. Fetch data from source
    console.log('Fetching data from source...')
    const response = await axios.post(SOURCE_API, {
      KW: q, // Add any required parameters
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
      items: transformedProducts,
      success: true,
    }
  } catch (error) {
    console.error('Import failed:', error)
    throw error
  }
}

// Create a function to run the import with retry logic
export const runImportWithRetry = async (q: string, maxRetries = 3) => {
  let attempts = 0

  while (attempts < maxRetries) {
    try {
      const result = await importProducts(q)

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
const runImport = async (q: string) => {
  console.time('Import Duration')

  try {
    const result = await runImportWithRetry(q)

    console.log('Final import result:', result)

    return result
  } catch (error) {
    console.error('Import failed completely:', error)
  }

  console.timeEnd('Import Duration')
}

Deno.serve(async (req: Request) => {
  const { q } = await req.json()

  const result = await runImport(q)

  return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/import' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
