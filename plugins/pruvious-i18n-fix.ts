import type { RouteRecordRaw } from 'vue-router'

export default defineNuxtPlugin({
  name: 'pruvious-i18n-fix',
  enforce: 'pre',
  setup() {
    const router = useRouter()
    const config = useRuntimeConfig()
    const localeCodes: string[] = ((config.public as any).i18n?.locales ?? [])
      .map((l: any) => (typeof l === 'string' ? l : l?.code))
      .filter(Boolean)

    if (!localeCodes.length) return

    const variants = (name: string) => localeCodes.map((l) => `${name}___${l}`)
    const isRaw = (name: string) => !name.includes('___')

    const originalRemove = router.removeRoute.bind(router)
    const originalAdd = router.addRoute.bind(router)

    router.removeRoute = ((name: any) => {
      if (typeof name === 'string' && isRaw(name)) {
        for (const v of variants(name)) {
          if (router.hasRoute(v)) originalRemove(v)
        }
      }
      if (router.hasRoute(name)) return originalRemove(name)
    }) as typeof router.removeRoute

    router.addRoute = ((parentOrRoute: any, maybeRoute?: any) => {
      const hasParent = maybeRoute !== undefined
      const route: RouteRecordRaw = hasParent ? maybeRoute : parentOrRoute
      const result = hasParent ? originalAdd(parentOrRoute, route) : originalAdd(route)
      if (
        route &&
        typeof route.name === 'string' &&
        isRaw(route.name) &&
        route.name.startsWith('pruvious-')
      ) {
        for (const v of variants(route.name)) {
          if (!router.hasRoute(v)) {
            const alias = { ...route, name: v } as RouteRecordRaw
            if (hasParent) originalAdd(parentOrRoute, alias)
            else originalAdd(alias)
          }
        }
      }
      return result
    }) as typeof router.addRoute
  },
})
