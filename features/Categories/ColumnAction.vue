<template>
  <Modal v-model="isShowViewModal" :title="item.name">
    <div v-if="item.detail" class="mb-4">
      <p class="text-xs text-gray-600 dark:text-gray-400">
        {{ item.detail }}
      </p>
    </div>
    <div class="mb-4 space-y-2">
      <KeyValueDisplay label="รหัส" :value="item.code" />
      <KeyValueDisplay
        v-if="item.product_categories"
        label="หมวดหมู่"
        :value="item.product_categories?.name"
      />
      <KeyValueDisplay label="ราคาขาย" :value="item.price" format-type="fixed" suffix="฿" />

      <KeyValueDisplay
        label="ราคา+ค่าดำเนินการ"
        :value="item.price_plus"
        format-type="fixed"
        suffix="฿"
      />

      <KeyValueDisplay
        label="คงเหลือ"
        :value="item.qty"
        format-type="comma"
        suffix="ชิ้น"
        is-badge
      />
    </div>

    <!-- Creation Date -->
    <div class="text-right">
      <span class="text-xs text-gray-500 dark:text-gray-400">
        สร้างเมื่อ {{ TimeHelper.displayDateTime(item.created_at) }}
      </span>
    </div>
  </Modal>
  <div class="flex items-center space-x-3">
    <Button icon="ph:note-pencil" square color="white" />
    <Button icon="ph:eye" square color="white" @click="isShowViewModal = true" />
  </div>
</template>
<script lang="ts" setup>
import { type IProductItem } from '~/loaders/product'

defineProps<{
  item: IProductItem
}>()

const isShowViewModal = ref(false)
</script>
