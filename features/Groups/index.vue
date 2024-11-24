<template>
  <div>
    <Modal v-model="isShowCreateModal" title="สร้างกลุ่มสินค้า">
      <Form @submit.prevent="onSubmit">
        <FormFields :form="form" :options="formFields" />
        <div class="mt-4 flex justify-end">
          <Button type="submit" block>สร้าง</Button>
        </div>
      </Form>
    </Modal>
    <div class="flex items-center justify-end">
      <Button :loading="group.addStatus.isLoading" @click="isShowCreateModal = true">
        สร้าง
      </Button>
    </div>
    <Table :options="tableOptions" @page-change="group.fetch" @search="group.search">
      <template #action-data="{ row }">
        <ColumnAction :item="row" />
      </template>
    </Table>
  </div>
</template>
<script lang="ts" setup>
import { useProductGroupListLoader } from '~/loaders/product'
import ColumnAction from '~/features/Categories/ColumnAction.vue'
import * as z from 'zod'
import { INPUT_TYPES } from '#core/components/Form/types'

const group = useProductGroupListLoader()
const dialog = useDialog()
const isShowCreateModal = ref(false)

group.setFetchLoading()
onMounted(() => {
  group.fetch()
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
  group.add(values)
})

useWatchTrue(
  () => group.addStatus.isSuccess,
  () => {
    dialog.success({
      title: 'สร้างสำเร็จ',
      description: 'สร้างกลุ่มสินค้าสำเร็จ',
    })

    group.fetch()
    isShowCreateModal.value = false
  }
)

useWatchTrue(
  () => group.addStatus.isError,
  () => {
    dialog.error({
      title: 'เกิดข้อผิดพลาด',
      description: StringHelper.getError(group.addStatus.errorData),
    })
  }
)

const tableOptions = useTable({
  repo: group,
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
