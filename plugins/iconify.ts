import { defineNuxtPlugin } from '#app'
import { Icon} from '@iconify/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VIcon', Icon)
})
