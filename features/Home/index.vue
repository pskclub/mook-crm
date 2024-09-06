<template>
  <Log :data-items="[tracker.items.value, tracker.status.value]" />
  <Loader :is-loading="tracker.status.value.isLoading">
    <div class="grid grid-cols-1 gap-4">
      <div
        v-for="(item, index) in tracker.items.value"
        :key="index"
        class="flex items-center justify-between"
      >
        <span class="text-lg font-semibold">{{ item.created_by }}</span>
        <span class="text-lg font-semibold">{{ item.detail }}</span>
      </div>
    </div>
  </Loader>
</template>
<script lang="ts" setup>
import { useTracker } from '~/loaders/tracker'

const tracker = useTracker()

onMounted(() => {
  tracker.fetch()
})
</script>
