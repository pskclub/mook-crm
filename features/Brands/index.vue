<template>
  <div>
    <Modal v-model="isShowCreateModal" title="สร้างแบรนด์">
      <Form @submit.prevent="onSubmit">
        <FormFields :form="form" :options="formFields" />
        <div class="mt-4 flex justify-end">
          <Button type="submit" block>สร้าง</Button>
        </div>
      </Form>
    </Modal>
    <div class="flex items-center justify-end">
      <Button :loading="brand.addStatus.isLoading" @click="isShowCreateModal = true">
        สร้าง
      </Button>
    </div>
    <Table :options="tableOptions" @page-change="brand.fetch" @search="brand.search">
      <template #action-data="{ row }">
        <ColumnAction :item="row" />
      </template>
    </Table>
  </div>
</template>
<script lang="ts" setup>
import { useProductBrandListLoader } from '~/loaders/product'
import ColumnAction from '~/features/Categories/ColumnAction.vue'
import * as z from 'zod'
import { INPUT_TYPES } from '#core/components/Form/types'

const brand = useProductBrandListLoader()
const dialog = useDialog()
const isShowCreateModal = ref(false)

brand.setFetchLoading()
onMounted(() => {
  brand.fetch()
})

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      id: z.number().min(1, 'กรุณากรอกไอดี'),
      name: z.string().min(1, 'กรุณากรอกชื่อ'),
    })
  ),
  initialValues: {
    name: '',
  },
})

const formFields = createFormFields(() => [
  {
    type: INPUT_TYPES.NUMBER,
    props: {
      name: 'id',
      label: 'ไอดี',
    },
  },
  {
    type: INPUT_TYPES.TEXT,
    props: {
      name: 'name',
      label: 'ชื่อ',
    },
  },
])

const onSubmit = form.handleSubmit(async (values) => {
  brand.add(values)
})

useWatchTrue(
  () => brand.addStatus.isSuccess,
  () => {
    dialog.success({
      title: 'สร้างสำเร็จ',
      description: 'สร้างแบรนด์สำเร็จ',
    })

    brand.fetch()
    isShowCreateModal.value = false
  }
)

useWatchTrue(
  () => brand.addStatus.isError,
  () => {
    dialog.error({
      title: 'เกิดข้อผิดพลาด',
      description: StringHelper.getError(brand.addStatus.errorData),
    })
  }
)

const tableOptions = useTable({
  repo: brand,
  columns: () => [
    {
      label: 'ไอดี',
      key: 'id',
      sortable: true,
    },
    {
      label: 'ชื่อ',
      key: 'name',
      sortable: true,
    },
  ],
  options: {
    isEnabledSearch: false,
  },
})
</script>
