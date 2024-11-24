<template>
  <Form @submit.prevent="onSubmit">
    <FormFields :form="form" :options="formFields" class="mt-3" />
    <div class="mt-4 flex flex-col justify-end space-y-4">
      <Button
        color="warning"
        type="button"
        block
        :loading="sync.status.value.isLoading"
        @click="onSync"
        >Sync
      </Button>
      <Button type="submit" block>บันทึก</Button>
    </div>
  </Form>
</template>
<script lang="ts" setup>
import * as z from 'zod'
import {
  type IProductItem,
  useProductCategoryListLoader,
  useProductPageLoader,
} from '~/loaders/product'
import { INPUT_TYPES } from '#core/components/Form/types'
import { useProductSyncLoader } from '~/loaders/import'

const emits = defineEmits(['done'])
const props = defineProps<{
  item: IProductItem
}>()

const product = useProductPageLoader()
const sync = useProductSyncLoader()
const category = useProductCategoryListLoader()
const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(1, 'กรุณากรอกชื่อ'),
      detail: z.string().min(1, 'กรุณากรอกรายละเอียด'),
      code: z.string().min(1, 'กรุณากรอกรหัสสินค้า'),
      price: z.number().optional(),
      price_plus: z.number().optional(),
      qty: z.number().optional(),
      category_id: z.number().optional().nullable(),
    })
  ),
  initialValues: props.item,
})

const formFields = createFormFields(() => [
  {
    type: INPUT_TYPES.SELECT,
    props: {
      name: 'category_id',
      label: 'หมวดหมู่',
      options: category.fetchItems.map((item) => ({
        label: item.name,
        value: item.id,
      })),
      clearable: true,
    },
  },
])

const onSubmit = form.handleSubmit(async (values) => {
  product.update(props.item.id as any, values)
})

const dialog = useDialog()

useWatchTrue(
  () => product.updateStatus.value.isSuccess,
  () => {
    dialog.success({
      title: 'แก้ไขสำเร็จ',
      description: 'แก้ไขสินค้าสำเร็จ',
    })

    product.fetch()
    emits('done')
  }
)

useWatchTrue(
  () => product.updateStatus.value.isError,
  () => {
    dialog.error({
      title: 'เกิดข้อผิดพลาด',
      description: StringHelper.getError(product.updateStatus.value.errorData),
    })
  }
)

const onSync = async () => {
  sync.run({
    id: props.item.id,
  })
}

useWatchTrue(
  () => sync.status.value.isSuccess,
  () => {
    dialog
      .success({
        title: 'Sync สำเร็จ',
        description: 'Sync สำเร็จ',
      })
      .then(() => {
        emits('done')
      })
  }
)

useWatchTrue(
  () => sync.status.value.isError,
  () => {
    dialog.error({
      title: 'เกิดข้อผิดพลาด',
      description: StringHelper.getError(sync.status.value.errorData),
    })
  }
)
</script>
