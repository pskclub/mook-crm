<template>
  <Home />
</template>
<script lang="ts" setup>
import { useApp } from '#imports'
import { routes } from '~/constants/routes'
import Home from '~/features/Home/index.vue'

definePageMeta({
  middleware: '',
})

useApp().defineSEO({
  title: routes.home.name,
  description: routes.home.name,
})

useApp().definePage({
  title: routes.home.name,
})
</script>
