<template>
  <Modal v-model="isShowViewModal" size="lg" :title="item.name">
    <div v-if="item.detail" class="mb-4">
      <p class="break-words text-xs text-gray-600 dark:text-gray-400">
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
      <div v-if="item.product_files?.length">
        <hr class="my-6" />
        <p class="mb-4 text-lg font-bold">รายการแนบไฟล์</p>
        <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
          <li
            v-for="file in item.product_files"
            :key="file.id"
            class="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6"
          >
            <div class="flex w-0 flex-1 items-center">
              <icon name="ph:file" class="size-5 shrink-0 text-gray-400" aria-hidden="true" />
              <div class="ml-4 flex min-w-0 flex-1 gap-2">
                <span class="truncate font-medium">{{ file.name }}</span>
              </div>
            </div>
            <div class="ml-4 shrink-0">
              <a
                target="_blank"
                :href="`https://crmur.10bitdevelopment.com/select2services/files/DownloadFile/${file.path}`"
                class="text-primary-600 hover:text-primary-500 font-medium"
              >
                ดาวน์โหลด
              </a>
            </div>
          </li>
        </ul>
      </div>
      <UpdateForm :item="item" @done="isShowViewModal = false" />
    </div>

    <!-- Creation Date -->
    <div class="text-right">
      <span class="text-xs text-gray-500 dark:text-gray-400">
        สร้างเมื่อ {{ TimeHelper.displayDateTime(item.created_at) }}
      </span>
    </div>
  </Modal>
  <div class="flex items-center space-x-3">
    <Button icon="ph:eye" square color="white" @click="isShowViewModal = true" />
  </div>
</template>
<script lang="ts" setup>
import { type IProductItem } from '~/loaders/product'
import UpdateForm from '~/features/Home/UpdateForm.vue'

defineProps<{
  item: IProductItem
}>()

const isShowViewModal = ref(false)
</script>
