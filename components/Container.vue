<template>
  <div
    :class="[
      'mx-auto w-full px-6',
      {
        'max-w-screen-2xl': size === 'lg',
        'max-w-7xl': size === 'md',
        'max-w-5xl': size === 'sm',
        'max-w-lg': size === 'xs',
      },
    ]"
  >
    <slot />
  </div>
</template>
<script lang="ts" setup>
defineProps({
  size: {
    default: 'md',
    validator(value: unknown): boolean {
      return ['xs', 'sm', 'md', 'lg'].includes(value as string)
    },
  },
})
</script>
