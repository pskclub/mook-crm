export default defineNuxtRouteMiddleware(async (to, _from) => {
  const session = useSupabaseSession()

  if (!session.value) {
    return navigateTo('/login')
  }
})
