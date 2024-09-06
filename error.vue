<template>
  <div class="h-full">
    <div v-if="+error.statusCode === 404" class="flex min-h-full flex-col bg-white pb-12 pt-16">
      <main class="mx-auto flex w-full max-w-7xl grow flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div class="flex shrink-0 justify-center">
          <nuxt-link to="/" class="inline-flex">
            <span class="sr-only">Workflow</span>
            <img class="h-12 w-auto" src="/images/logo.png" alt="" />
          </nuxt-link>
        </div>
        <div class="py-16">
          <div class="text-center">
            <p class="text-primary text-sm font-semibold uppercase tracking-wide">404 error</p>
            <h1 class="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Page not found.
            </h1>
            <p class="mt-2 text-base text-gray-500">
              Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div class="mt-6">
              <nuxt-link to="/" class="text-primary hover:text-primary text-base font-medium">
                Go back home<span aria-hidden="true"> &rarr;</span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </main>
    </div>
    <div
      v-else-if="+error.statusCode === 403"
      class="flex min-h-full flex-col bg-white pb-12 pt-16"
    >
      <main class="mx-auto flex w-full max-w-7xl grow flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div class="flex shrink-0 justify-center">
          <nuxt-link to="/" class="inline-flex">
            <span class="sr-only">Workflow</span>
            <img class="h-12 w-auto" src="/images/logo.png" alt="" />
          </nuxt-link>
        </div>
        <div class="py-16">
          <div class="text-center">
            <p class="text-primary text-sm font-semibold uppercase tracking-wide">403 error</p>
            <h1 class="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Forbidden.
            </h1>
            <p class="mt-2 text-base text-gray-500">
              Sorry, you don't have permission to access this page.
            </p>
            <div class="mt-6">
              <nuxt-link to="/" class="text-primary hover:text-primary text-base font-medium">
                Go back home<span aria-hidden="true"> &rarr;</span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </main>
    </div>
    <div v-else class="flex min-h-full flex-col bg-white pb-12 pt-16">
      <main class="mx-auto flex w-full max-w-7xl grow flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div class="flex shrink-0 justify-center">
          <nuxt-link to="/" class="inline-flex">
            <img class="h-12 w-auto" src="/images/logo.png" alt="" />
          </nuxt-link>
        </div>
        <div class="py-16">
          <div class="text-center">
            <p class="text-primary text-sm font-semibold uppercase tracking-wide">
              {{ error.statusCode }} error
            </p>
            <h1 class="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Something went wrong
            </h1>
            <p class="mt-2 text-base text-gray-500">
              {{ error.message }}
            </p>
            <div class="mt-6">
              <nuxt-link to="/" class="text-primary hover:text-primary text-base font-medium">
                Go back home<span aria-hidden="true"> &rarr;</span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import { type NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>
