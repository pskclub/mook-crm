<template>
  <Categories />
</template>
<script lang="ts" setup>
import { useApp } from '#imports'
import { routes } from '~/constants/routes'
import Categories from '~/features/Categories/index.vue'

useApp().defineSEO({
  title: routes.categories.name,
  description: routes.categories.name,
})

useApp().definePage({
  title: routes.categories.name,
})
</script>
