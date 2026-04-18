<script setup lang="js">

const { t, locale, locales, setLocale } = useI18n()

//===============================-< 
// imports >-===============================
// const localePath = useLocalePath()
// const { locale, setLocale } = useI18n()
const navLinks = computed(() => [
	["#hero", t("nav.project")],
	["#tasks", t("nav.activity")],
	["#impact", t("nav.impact")],
	["#team", t("nav.team")],
])

const mobileNavOpen = ref(false)
// ── MODAL ───────────────────────────────────────────────
function openModal(type, data = null) {
	modal.value = { open: true, type, data }
	document.body.style.overflow = "hidden"
}
function openModalAndCloseMobile() {
	openModal("contact")
	mobileNavOpen.value = false
}
</script>

<template>
	<!-- SCROLL PROGRESS -->
	<div
		class="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-600 to-violet-500 z-[1001] transition-all duration-100"
		:style="{ width: scrollProgress + '%' }"
	/>

	<!-- ══════════════════════════════════  HEADER ══════════════════════════════════ -->
	<header
		class="fixed top-0 w-full z-[900] px-6 lg:px-10 py-5 flex justify-between items-center transition-all duration-300"
		:class="
			isScrolled
				? 'bg-white/90 backdrop-blur-xl border-b border-black/8 shadow-sm'
				: 'bg-transparent'
		"
	>
		<div class="flex items-center gap-4">
			<div
				class="w-11 h-11 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg"
			>
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_Democracy_Fund_Logo.png"
					alt="UNDEF"
					class="object-contain w-full"
				/>
			</div>
			<div>
				<h1
					class="font-black text-lg tracking-tight leading-none transition-colors duration-300"
					:class="isScrolled ? 'text-slate-900' : 'text-white'"
				>
					TARAQQIYOT
				</h1>
				<p
					class="text-[9px] uppercase tracking-[0.25em] font-bold text-blue-400"
				>
					{{ $t("nav.orgSubtitle") }}
				</p>
			</div>
		</div>

		<!-- Desktop nav -->
		<nav class="hidden lg:flex items-center gap-8">
			<a
				v-for="[href, label] in navLinks"
				:key="href"
				:href="href"
				class="text-[11px] font-bold uppercase tracking-widest relative pb-0.5 transition-colors duration-200 group"
				:class="
					isScrolled
						? 'text-slate-500 hover:text-slate-900'
						: 'text-white/90 hover:text-white'
				"
			>
				{{ label }}
				<span
					class="absolute bottom-0 left-0 h-[1.5px] bg-blue-600 transition-all duration-300"
					:class="
						activeSection === href.replace('#', '')
							? 'w-full'
							: 'w-0 group-hover:w-full'
					"
				/>
			</a>

			<!-- Lang switcher -->
			<div
				class="flex items-center gap-1 border border-white/20 rounded-full px-1 py-1"
				:class="isScrolled ? 'border-slate-200' : 'border-white/20'"
			>
				<button
					v-for="lang in locales"
					:key="lang"
					class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-200"
					:class="
						locale === lang.code
							? 'bg-blue-600 text-white shadow'
							: isScrolled
								? 'text-slate-500 hover:text-slate-900'
								: 'text-white/70 hover:text-white'
					"
					@click="setLocale(lang.code)"
				>
					{{ lang.code }}
				</button>
			</div>

			<button
				class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-200 shadow-lg shadow-blue-600/30 hover:-translate-y-0.5"
				@click="openModal('contact')"
			>
				{{ t("nav.contact") }}
			</button>
		</nav>

		<!-- Hamburger -->
		<button
			class="lg:hidden flex flex-col gap-[5px] p-1"
			@click="mobileNavOpen = !mobileNavOpen"
		>
			<span
				v-for="n in 3"
				:key="n"
				class="block w-6 h-0.5 rounded transition-all duration-300"
				:class="[
					isScrolled ? 'bg-slate-900' : 'bg-white',
					mobileNavOpen && n === 1 ? 'translate-y-[7px] rotate-45' : '',
					mobileNavOpen && n === 2 ? 'opacity-0' : '',
					mobileNavOpen && n === 3 ? '-translate-y-[7px] -rotate-45' : '',
				]"
			/>
		</button>
	</header>

	<!-- MOBILE NAV -->
	<Transition name="slide-right">
		<div
			v-if="mobileNavOpen"
			class="fixed inset-y-0 right-0 w-72 bg-white z-[800] shadow-2xl pt-24 px-8"
		>
			<ul class="space-y-1">
				<li
					v-for="[href, label] in navLinks"
					:key="href"
					class="border-b border-slate-100"
				>
					<a
						:href="href"
						class="block py-4 text-base font-bold uppercase tracking-widest text-slate-800 hover:text-blue-600 transition-colors"
						@click="mobileNavOpen = false"
						>{{ label }}</a
					>
				</li>
				<!-- Lang switcher mobile -->
				<li class="pt-4 pb-2">
					<div class="flex gap-2">
						<button
							v-for="lang in locales"
							:key="lang"
							class="flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 border"
							:class="
								locale === lang.code
									? 'bg-blue-600 text-white border-blue-600'
									: 'text-slate-500 border-slate-200 hover:border-blue-300'
							"
							@click="setLocale(lang.code)"
						>
							{{ lang.code }}
						</button>
					</div>
				</li>
				<li class="pt-2">
					<button
						class="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold uppercase tracking-widest"
						@click="openModalAndCloseMobil"
					>
						{{ t("nav.contact") }}
					</button>
				</li>
			</ul>
		</div>
	</Transition>
	<Transition name="fade">
		<div
			v-if="mobileNavOpen"
			class="fixed inset-0 bg-black/50 z-[700]"
			@click="mobileNavOpen = false"
		/>
	</Transition>
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
