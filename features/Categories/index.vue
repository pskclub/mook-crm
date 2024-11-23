<template>
  <div>
    <Modal v-model="isShowCreateModal" title="สร้างหมวดหมู่">
      <Form @submit.prevent="onSubmit">
        <FormFields :form="form" :options="formFields" />
        <div class="mt-4 flex justify-end">
          <Button type="submit" block>สร้าง</Button>
        </div>
      </Form>
    </Modal>
    <div class="flex items-center justify-end">
      <Button :loading="category.addStatus.isLoading" @click="isShowCreateModal = true">
        สร้าง
      </Button>
    </div>
    <Table :options="tableOptions" @page-change="category.fetch" @search="category.search">
      <template #action-data="{ row }">
        <ColumnAction :item="row" />
      </template>
    </Table>
  </div>
</template>
<script lang="ts" setup>
import { useProductCategoryListLoader } from '~/loaders/product'
import ColumnAction from '~/features/Categories/ColumnAction.vue'
import * as z from 'zod'
import { INPUT_TYPES } from '#core/components/Form/types'

const category = useProductCategoryListLoader()
const dialog = useDialog()
const isShowCreateModal = ref(false)

category.setFetchLoading()
onMounted(() => {
  category.fetch()
})

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(1, 'กรุณากรอกชื่อ'),
    })
  ),
  initialValues: {
    name: '',
  },
})

const formFields = createFormFields(() => [
  {
    type: INPUT_TYPES.TEXT,
    props: {
      name: 'name',
      label: 'ชื่อ',
    },
  },
])

const onSubmit = form.handleSubmit(async (values) => {
  category.add(values)
})

useWatchTrue(
  () => category.addStatus.isSuccess,
  () => {
    dialog.success({
      title: 'สร้างสำเร็จ',
      description: 'สร้างหมวดหมู่สำเร็จ',
    })

    category.fetch()
    isShowCreateModal.value = false
  }
)

useWatchTrue(
  () => category.addStatus.isError,
  () => {
    dialog.error({
      title: 'เกิดข้อผิดพลาด',
      description: StringHelper.getError(category.addStatus.errorData),
    })
  }
)

const tableOptions = useTable({
  repo: category,
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
