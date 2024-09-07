<template>
  <div class="rounded-lg bg-white">
    <div class="border-1 border-gray flex flex-col items-center justify-between">
      <div class="mt-4 w-full px-4">
        <div class="flex items-start justify-between">
          <div class="flex items-center">
            <div class="mr-2">
              <UAvatar size="md" :alt="avatarALT" />
            </div>
            <div>
              <h3 class="text-base font-semibold leading-6 text-gray-900">
                {{ item.profile.display_name }}
              </h3>
              <p class="text-xs uppercase text-gray-500">{{ item.profile.team }}</p>
            </div>
          </div>

          <p class="flex items-center truncate text-sm text-gray-500">
            <Icon name="ph:clock" class="mr-1" />
            ทั้งหมด {{ item.totalTiming }} ชั่วโมง
          </p>
        </div>
      </div>
      <div class="border-1 border-gray divide-y-1 mt-4 w-full divide-y border-t">
        <TrackerGroupChildItem
          v-for="task in item.items"
          :key="task.id"
          :item="task"
          :editable="editable"
          @update="$emit('update', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { type ITrackerGroupByProfileItem } from '~/loaders/tracker'

defineEmits(['update', 'delete'])

const props = defineProps<{
  item: ITrackerGroupByProfileItem
  editable?: boolean
}>()

const avatarALT = computed(() => {
  const searchDotName = props.item.profile.display_name.replace('.co', 'co')

  if (searchDotName.includes('.')) {
    const firstChar = props.item.profile.display_name.charAt(0).toUpperCase()
    const afterDotChar =
      props.item.profile.display_name.split('.')[1]?.charAt(0).toUpperCase() || ''

    return firstChar + ' ' + afterDotChar
  }

  return props.item.profile.display_name.substring(0, 2).split('').join(' ').toUpperCase()
})
</script>
