// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	colorMode: {
		preference: "light",
	},

	ssr: false,
	// SEO va meta
	// experimental: {
	// 	payloadExtraction: false,
	// },

	runtimeConfig: {
		public: {
			// apiBaseUrl: process.env.API_BASE_URL,
		},
	},

	modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxtjs/i18n", "@pinia/nuxt"],

	vite: {
		plugins: [tailwindcss()],
	},
	css: ["~/assets/css/main.css"],

	i18n: {
		defaultLocale: "uz",
		langDir: "./locales/",
		bundle: {
			optimizeTranslationDirective: false,
		},
		locales: [
			{
				code: "uz",
				name: "uz",
				file: "uz.json",
			},
			{
				code: "ru",
				name: "ru",
				file: "ru.json",
			},
			{
				code: "en",
				name: "en",
				file: "en.json",
			},
		],
		detectBrowserLanguage: false,
	},
})
