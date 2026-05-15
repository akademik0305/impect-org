// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: { lang: "en" },
		},
	},
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	colorMode: {
		preference: "light",
	},

	ssr: false,

	modules: ["@nuxt/ui"],

	vite: {
		plugins: [tailwindcss()],
	},
	css: ["~/assets/css/main.css"],
})
