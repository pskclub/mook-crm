<template>
  <Types />
</template>
<script lang="ts" setup>
import { useApp } from '#imports'
import { routes } from '~/constants/routes'
import Types from '~/features/Types/index.vue'

definePageMeta({
  middleware: 'auth',
})

useApp().defineSEO({
  title: routes.types.name,
  description: routes.types.name,
})

useApp().definePage({
  title: routes.types.name,
})
</script>
