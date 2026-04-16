<script setup lang="ts">
//===============================-< imports >-===============================
// import { useI18n } from "vue-i18n"
// const localePath = useLocalePath()
// const { locale, setLocale } = useI18n()

// Sana funksiyasi
const today = computed(() => {
	return new Date().toLocaleDateString("uz-UZ", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	})
})
</script>

<template>
	<header class="bg-[#1a1410] text-white">
		<div class="container mx-auto px-4 md:px-8">
			<div
				class="flex justify-between items-center py-3 border-b border-white/10 text-[11px] tracking-widest opacity-60 uppercase"
			>
				<span>{{ today }}</span>
				<span class="hidden md:block">Haqiqat — Tezkor — Ishonchli</span>
				<div class="flex gap-4">
					<a href="#" class="hover:text-red-500 transition-colors">Telegram</a>
					<a href="#" class="hover:text-red-500 transition-colors">YouTube</a>
				</div>
			</div>

			<div class="py-10 text-center border-b-2 border-red-700">
				<h1
					class="font-['Playfair_Display'] text-6xl md:text-8xl font-black tracking-tighter"
				>
					Uz<span class="text-red-600">News</span>
				</h1>
				<p
					class="text-[10px] uppercase tracking-[0.4em] opacity-40 mt-3 font-medium"
				>
					O'zbekiston yangiliklar portali
				</p>
			</div>

			<nav class="flex justify-center overflow-x-auto no-scrollbar py-1">
				<ul
					class="flex gap-1 text-[12px] uppercase tracking-widest font-medium"
				>
					<li
						v-for="menu in [
							'Bosh sahifa',
							'Siyosat',
							'Iqtisodiyot',
							'Jamiyat',
							'Sport',
							'Texno',
							'Dunyo',
						]"
						:key="menu"
					>
						<a
							href="#"
							class="px-5 py-4 block hover:text-red-500 transition-all border-b-2 border-transparent hover:border-red-600"
							>{{ menu }}</a
						>
					</li>
				</ul>
			</nav>
		</div>
	</header>
</template>
<style scoped>
/* Container responsiveness */
.container {
	max-width: 1400px;
	margin: 0 auto;
	width: 100%;
}

/* Desktop Navigation Link Effects */
.nav-link {
	position: relative;
}

.nav-link::after {
	content: "";
	position: absolute;
	bottom: -4px;
	left: 0;
	width: 0;
	height: 1px;
	background-color: currentColor;
	transition: width 0.4s ease;
}

.nav-link:hover::after {
	width: 100%;
}

/* Mobile Menu Animation */
@keyframes slideInFromTop {
	from {
		opacity: 0;
		transform: translateY(-20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.mobile-menu-item {
	animation: slideInFromTop 0.5s ease forwards;
	opacity: 0;
}

/* Responsive Typography */
@media (max-width: 640px) {
	.nav-link {
		font-size: 0.75rem;
	}
}

/* Tablet adjustments */
@media (min-width: 768px) and (max-width: 1023px) {
	.nav-link {
		font-size: 0.8rem;
	}
}

/* Theme Colors */
.hotel-theme {
	--primary: #c5a059;
	--secondary: #1a1a1a;
	--background: #fdfcf9;
}
@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateX(-20px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.mobile-menu-item {
	animation: slideIn 0.5s ease-out forwards;
	opacity: 0;
}
</style>
