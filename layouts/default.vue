<template>
  <div class="min-h-full">
    <Log :data="user" />
    <nav class="bg-primary-400 border-b border-gray-200">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex">
            <div class="flex shrink-0 items-center">
              <img
                class="block h-8 w-auto rounded-full lg:hidden"
                src="/images/logo.jpg"
                alt="Your Company"
              />
              <img
                class="hidden h-8 w-auto rounded-full lg:block"
                src="/images/logo.jpg"
                alt="Your Company"
              />
            </div>
            <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <ULink
                v-for="item in navbarItems"
                :to="item.to"
                class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                active-class="border-primary text-primary-800"
                inactive-class="border-transparent text-white hover:border-primary-800 hover:text-primary-800"
              >
                {{ item.name }}
              </ULink>
            </div>
          </div>
          <div class="ml-6 flex items-center">
            <Dropdown
              v-if="session?.access_token"
              :items="userItems"
              :popper="{ placement: 'bottom-end' }"
            >
              <div class="flex items-center">
                <p class="text-white">
                  {{ user?.email }}
                </p>
                <Icon name="ph:caret-down-light" class="ml-2" />
              </div>
            </Dropdown>
            <div v-else>
              <ULink
                :to="routes.login.to"
                inactive-class="border-transparent text-white hover:border-primary-800 hover:text-primary-800"
              >
                เข้าสู่ระบบ
              </ULink>
            </div>
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

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const session = useSupabaseSession()
const router = useRouter()

const navbarItems = [routes.home, routes.categories, routes.brands, routes.groups, routes.types]

const userItems: DropdownItem[][] = [
  [
    {
      label: 'ออกจากระบบ',
      click: () => {
        supabase.auth.signOut().finally(() => {
          router.push(routes.home.to)
        })
      },
    },
  ],
]
</script>
