<template>
  <Brands />
</template>
<script lang="ts" setup>
import { useApp } from '#imports'
import { routes } from '~/constants/routes'
import Brands from '~/features/Brands/index.vue'

definePageMeta({
  middleware: 'auth',
})

useApp().defineSEO({
  title: routes.brands.name,
  description: routes.brands.name,
})

useApp().definePage({
  title: routes.brands.name,
})
</script>
