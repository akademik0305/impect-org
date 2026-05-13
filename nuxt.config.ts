// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	colorMode: {
		preference: "light",
	},

	ssr: false,

	modules: ["@nuxt/ui", "@nuxtjs/i18n"],

	vite: {
		plugins: [tailwindcss()],
	},
	css: ["~/assets/css/main.css"],

	i18n: {
		defaultLocale: "uz",
		langDir: "locales",
		bundle: {
			optimizeTranslationDirective: false,
		},
		locales: [
			{ code: "uz", file: "uz.json", name: "O'zbek" },
			{ code: "ru", file: "ru.json", name: "Русский" },
			{ code: "en", file: "en.json", name: "English" },
		],
		detectBrowserLanguage: false,
	},
})
