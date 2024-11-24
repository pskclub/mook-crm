<template>
  <Groups />
</template>
<script lang="ts" setup>
import { useApp } from '#imports'
import { routes } from '~/constants/routes'
import Groups from '~/features/Groups/index.vue'

definePageMeta({
  middleware: 'auth',
})

useApp().defineSEO({
  title: routes.groups.name,
  description: routes.groups.name,
})

useApp().definePage({
  title: routes.groups.name,
})
</script>
