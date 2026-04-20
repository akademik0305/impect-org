export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session && to.path.startsWith('/admin') && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }
})