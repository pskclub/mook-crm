<template>
  <Form @submit="onSubmit">
    <FormFields :options="fields" />

    <div class="mt-6 flex items-center gap-4">
      <Button
        type="submit"
        :loading="product.status.value.isLoading"
        color="primary"
        leading-icon="ph:upload"
        block
      >
        นำเข้าข้อมูล
      </Button>
    </div>
  </Form>
</template>

<script lang="ts" setup>
import { createFormFields, toTypedSchema, useForm } from '#imports'
import { INPUT_TYPES } from '#core/components/Form/types'
import * as z from 'zod'
import { useProductOriginLoader } from '~/loaders/product'

const emits = defineEmits<(e: 'done') => void>()

const product = useProductOriginLoader()
const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      search: z.string().min(1, 'กรุณากรอกคำค้นหา'),
    })
  ),
  initialValues: {
    search: '',
  },
})

const fields = createFormFields(() => [
  {
    type: INPUT_TYPES.TEXT,
    props: {
      label: 'คำค้นหา',
      name: 'search',
      placeholder: 'ABT',
    },
  },
])

const onSubmit = form.handleSubmit(async (values) => {
  product.run({
    KW: values.search,
  })
})
</script>
