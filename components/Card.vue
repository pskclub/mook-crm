<template>
  <div
    :class="[
      'w-full rounded-lg bg-white',
      {
        'p-0': size === 'none',
        'p-3': size === 'xs',
        'p-6': size === 'sm',
        'p-8': size === 'md',
        'p-10': size === 'lg',
        'p-12': size === 'xl',
      },
    ]"
  >
    <h2 v-if="title" class="text-xl font-semibold">{{ title }}</h2>
    <slot />
  </div>
</template>
<script lang="ts" setup>
defineProps({
  title: {
    type: String,
  },
  size: {
    type: String,
    default: 'md',
    validator(value: unknown): boolean {
      return ['none', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value as string)
    },
  },
})
</script>
