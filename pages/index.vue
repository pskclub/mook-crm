<template>
  <div>
    {{ useSupabaseSession().value }}
  </div>
</template>
<script lang="ts" setup>
import { useApp, useSupabaseSession } from '#imports'
import { routes } from '~/constants/routes'

definePageMeta({
  layout: 'default',
})

useApp().defineSEO({
  title: routes.home.name,
  description: routes.home.name,
})

useApp().definePage({
  title: routes.home.name,
})
</script>
wwwwwwwww
