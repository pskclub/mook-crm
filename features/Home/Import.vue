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
import { useProductImportLoader } from '~/loaders/import'

const emits = defineEmits<(e: 'done') => void>()

const product = useProductImportLoader()
const dialog = useDialog()
const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      q: z.string().min(1, 'กรุณากรอกคำค้นหา'),
    })
  ),
  initialValues: {
    q: '',
  },
})

const fields = createFormFields(() => [
  {
    type: INPUT_TYPES.TEXT,
    props: {
      label: 'คำค้นหา',
      name: 'q',
      placeholder: 'ABT-xxxx',
    },
  },
])

const onSubmit = form.handleSubmit(async (values) => {
  product.run(values)
})

useWatchTrue(
  () => product.status.value.isSuccess,
  () => {
    dialog
      .success({
        title: 'นำเข้าข้อมูลสำเร็จ',
        description: `ข้อมูลถูกนำเข้าเรียบร้อยแล้วจำนวน ${product.data.value?.total} รายการ`,
      })
      .then(() => {
        emits('done')
      })
  }
)

useWatchTrue(
  () => product.status.value.isError,
  () => {
    dialog.error({
      title: 'นำเข้าข้อมูลไม่สำเร็จ',
      description: StringHelper.getError(product.status.value.errorData),
    })
  }
)
</script>
