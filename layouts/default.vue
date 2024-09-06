<template>
  <div class="min-h-full">
    <nav class="border-b border-gray-200 bg-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex">
            <div class="flex shrink-0 items-center">
              <img class="block h-8 w-auto lg:hidden" src="/images/logo.png" alt="Your Company" />
              <img class="hidden h-8 w-auto lg:block" src="/images/logo.png" alt="Your Company" />
            </div>
            <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <ULink
                v-for="item in navbarItems"
                :to="item.to"
                class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                active-class="border-primary text-gray-900"
                inactive-class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                {{ item.name }}
              </ULink>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <Dropdown :items="userItems" :popper="{ placement: 'bottom-end' }">
              <div class="flex items-center">
                <p>{{ user?.email }}</p>
                <Icon name="ph:caret-down-light" class="ml-2" />
              </div>
            </Dropdown>
          </div>
          <div class="-mr-2 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <button
              type="button"
              class="focus:ring-primary relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span class="absolute -inset-0.5" />
              <span class="sr-only">Open main menu</span>
              <!-- Menu open: "hidden", Menu closed: "block" -->
              <svg
                class="block size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <!-- Menu open: "block", Menu closed: "hidden" -->
              <svg
                class="hidden size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state. -->
      <div id="mobile-menu" class="sm:hidden">
        <div class="space-y-1 pb-3 pt-2">
          <ULink
            v-for="item in navbarItems"
            :to="item.to"
            class="block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
            active-class="border-primary bg-primary-50 text-primary-700"
            inactive-class="border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
          >
            {{ item.name }}
          </ULink>
        </div>
        <div class="border-t border-gray-200 pb-3 pt-4">
          <div class="flex items-center px-4">
            <div class="shrink-0">
              <UAvatar :alt="user?.email" size="lg" />
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ user?.email }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <a
              href="#"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >Your Profile</a
            >
            <a
              href="#"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >Settings</a
            >
            <a
              href="#"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >Sign out</a
            >
          </div>
        </div>
      </div>
    </nav>

    <div class="py-10">
      <main>
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useSupabaseUser } from '#imports'
import { routes } from '~/constants/routes'
import { type DropdownItem } from '#ui/types'

const app = useApp()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()

const navbarItems = [routes.home]

const userItems: DropdownItem[][] = [
  [
    {
      label: 'ออกจากระบบ',
      click: () => {
        supabase.auth.signOut().finally(() => {
          router.push(routes.login.to)
        })
      },
    },
  ],
]
</script>
