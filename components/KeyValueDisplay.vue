<template>
  <div class="flex items-center justify-between">
    <span class="text-sm text-gray-500 dark:text-gray-400">{{ label }}</span>
    <slot name="value">
      <span v-if="!isBadge" class="font-medium text-gray-900 dark:text-white" :class="valueClass">
        {{ formattedValue }}
      </span>
      <Badge v-else :color="badgeColor">
        {{ formattedValue }}
      </Badge>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import type { BadgeColors } from '#ui/types'
import { StringHelper } from '#imports'

const props = withDefaults(
  defineProps<{
    label: string
    value: string | number
    isBadge?: boolean
    badgeColor?: BadgeColors
    valueClass?: string
    formatType?: 'fixed' | 'comma' | 'none'
    suffix?: string
  }>(),
  {
    isBadge: false,
    badgeColor: 'primary',
    valueClass: '',
    formatType: 'none',
    suffix: '',
  }
)

const formattedValue = computed(() => {
  let formatted = props.value

  if (typeof formatted === 'number') {
    switch (props.formatType) {
      case 'fixed':
        formatted = StringHelper.withFixed(formatted)

        break
      case 'comma':
        formatted = StringHelper.withComma(formatted)

        break
    }
  }

  return props.suffix ? `${formatted} ${props.suffix}` : formatted
})
</script>
