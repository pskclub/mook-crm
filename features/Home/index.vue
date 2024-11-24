<template>
  <div>
    <Modal v-model="isShowImportModal" title="นำเข้าข้อมูล">
      <Import @done="onImportSuccess" />
    </Modal>
    <Form class="my-6 flex items-center justify-between">
      <FormFields
        :form="filterForm"
        :options="filterFields"
        class="grid grid-cols-2 gap-4 md:grid-cols-4"
      />
      <Button icon="ph:upload" @click="isShowImportModal = true"> นำเข้าข้อมูล </Button>
    </Form>
    <Table :options="tableOptions" @page-change="product.fetch">
      <template #action-data="{ row }">
        <ColumnAction :item="row" />
      </template>
    </Table>
  </div>
</template>
<script lang="ts" setup>
import { useProductCategoryListLoader, useProductPageLoader } from '~/loaders/product'
import { COLUMN_TYPES } from '#core/components/Table/types'
import ColumnAction from '~/features/Home/ColumnAction.vue'
import Import from '~/features/Home/Import.vue'
import * as z from 'zod'
import { INPUT_TYPES } from '#core/components/Form/types'

const product = useProductPageLoader()
const category = useProductCategoryListLoader()
const isShowImportModal = ref(false)

category.setFetchLoading()
product.setFetchLoading()
onMounted(() => {
  product.fetch()
  category.fetch()
})

const filterForm = useForm({
  validationSchema: toTypedSchema(
    z.object({
      category_id: z.any().optional(),
      q: z.string().optional(),
    })
  ),
  initialValues: {
    q: '',
    category_id: '',
  },
})

const filterFields = createFormFields(() => [
  {
    type: INPUT_TYPES.TEXT,
    class: 'col-span-2',
    props: {
      name: 'q',
      placeholder: 'ค้นหาชื่อรายการ',
      trailingIcon: 'i-heroicons:magnifying-glass',
    },
  },
  {
    type: INPUT_TYPES.SELECT,
    class: 'col-span-2',
    props: {
      label: '',
      name: 'category_id',
      placeholder: 'เลือกหมวดหมู่',
      options: ArrayHelper.toOptions(category.fetchItems, 'id', 'name'),
      clearable: true,
      isLoading: category.fetchStatus.isLoading,
    },
  },
])

const tableOptions = useTable({
  repo: product,
  columns: () => [
    {
      label: 'รหัส',
      key: 'code',
      sortable: true,
    },
    {
      label: 'ชื่อ',
      key: 'name',
      sortable: true,
      props: {
        max: '60',
      },
    },
    {
      label: 'หมวดหมู่',
      key: 'product_categories.name',
      transform: (value, item) => item.product_categories?.name,
    },
    {
      label: 'ราคา',
      key: 'price',
      sortable: true,
      type: COLUMN_TYPES.NUMBER,
    },
    {
      label: 'จำนวน',
      key: 'qty',
      sortable: true,
      type: COLUMN_TYPES.NUMBER,
    },
    {
      key: 'action',
    },
  ],
})

watch(
  () => filterForm.values,
  _debounce((value) => {
    product.search(value.search, {
      params: {
        q: value.q,
        search: {
          category_id: value.category_id,
        },
      },
    })
  }, 500),
  { deep: true }
)

const onImportSuccess = () => {
  product.fetch()
  isShowImportModal.value = false
}
</script>
