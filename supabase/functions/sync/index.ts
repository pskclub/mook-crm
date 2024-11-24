// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import axios from 'https://deno.land/x/axiod/mod.ts'
import { corsHeaders } from '../_shared/cors.ts'
import {
  SUPABASE_URL,
  SUPABASE_KEY,
  SOURCE_API_BY_ID,
  SOURCE_FILE_API,
  type IProductFileResponse,
  type IProductOriginItem,
  type IProductItem,
} from '../_shared/config.ts'

console.log('Hello from Functions!')
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
    const response = await axios.post(SOURCE_API_BY_ID, {
      RID: q, // Add any required parameters
    })

    const sourceProducts: IProductOriginItem = response.data

    // 2. Transform and prepare data
    console.log('Transforming data...')
    const transformedProducts = transformProduct(sourceProducts)

    // 3. Batch insert into Supabase
    console.log('Inserting data into Supabase...')
    const results = []

    const { data, error } = await supabase.from('products').upsert(transformedProducts)

    if (error) {
      console.error('Error', error)
      throw error
    }

    results.push(data)

    try {
      const { data } = await axios.post<IProductFileResponse[]>(SOURCE_FILE_API, {
        RID: transformedProducts.id, // Add any required parameters
      })

      await supabase.from('product_files').upsert(
        data.map(
          (file) => ({
            name: file.File.FileName,
            path: file.File.RID,
            product_id: transformedProducts.id,
          }),
          {
            onConflict: 'path', // Assuming code is unique
            ignoreDuplicates: true,
          }
        )
      )
    } catch (e) {
      console.error(`Error ${transformedProducts.id}:`, e)
    }

    // 4. Return summary
    return {
      total: 1,
      item: transformedProducts,
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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { id } = await req.json()

    const result = await runImport(id)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/import' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
