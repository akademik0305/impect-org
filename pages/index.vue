<script setup>
const { t, locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()
const supabase = useSupabaseClient()

// ── SUPABASE: TASKLAR ─────────────────────────────────────
const { data: tasksRaw } = await useAsyncData("tasks-home", async () => {
	const { data } = await supabase
		.from("tasks")
		.select("slug, uz, ru, en, image_url, status")
		.eq("status", "published")
		.order("updated_at", { ascending: false })
	return data ?? []
})

const fallbackImages = [
	"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
	"https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=800",
	"https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
	"https://images.unsplash.com/photo-1573161158365-59b7033d749d?auto=format&fit=crop&q=80&w=800",
	"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
	"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
]

const projectTasks = computed(() => {
	return (tasksRaw.value ?? []).map((task, i) => {
		const lang = locale.value
		const d = task[lang] ?? task.uz ?? {}
		return {
			slug: task.slug,
			title: d.title ?? task.slug,
			desc: d.desc ?? "",
			img: task.image_url || fallbackImages[i % fallbackImages.length],
		}
	})
})

// ── REELS ─────────────────────────────────────────────────
const { data: reelsData } = await useAsyncData("reels", async () => {
	const { data } = await supabase
		.from("reels")
		.select("id, video_id, title_uz, title_ru, title_en")
		.eq("active", true)
		.order("order_index", { ascending: true })
	return data ?? []
})

const reels = computed(() => {
	return (reelsData.value ?? []).map(r => ({
		id: r.video_id,
		title: r[`title_${locale.value}`] || r.title_uz || r.video_id,
	}))
})

// ── TEAM ─────────────────────────────────────────────────
const team = computed(() => [
	{
		name: t("team.members[0].name"),
		role: t("team.members[0].role"),
		bio: t("team.members[0].bio"),
		img: "./feruza.jpg",
	},
	{
		name: t("team.members[1].name"),
		role: t("team.members[1].role"),
		bio: t("team.members[1].bio"),
		img: "nargiza.png",
	},
	{
		name: t("team.members[2].name"),
		role: t("team.members[2].role"),
		bio: t("team.members[2].bio"),
		img: "zafar.jpg",
	},
	{
		name: t("team.members[3].name"),
		role: t("team.members[3].role"),
		bio: t("team.members[3].bio"),
		img: "saida.jpg",
	},
	{
		name: t("team.members[4].name"),
		role: t("team.members[4].role"),
		bio: t("team.members[4].bio"),
		img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
	},
])

// ── I18N ─────────────────────────────────────────────────
const navLinks = computed(() => [
	["#hero", t("nav.project")],
	["#tasks", t("nav.activity")],
	["#impact", t("nav.impact")],
	["#team", t("nav.team")],
])

const tickerItems = computed(() => [
	t("ticker[0]"),
	t("ticker[1]"),
	t("ticker[2]"),
	t("ticker[3]"),
	t("ticker[4]"),
	t("ticker[5]"),
])

const heroStats = computed(() => [
	["40+", t("hero.stat.ngo")],
	["2", t("hero.stat.region")],
	[t("hero.stat.yearsVal"), t("hero.stat.years")],
])

const footerContacts = computed(() => [
	["📞", "+998558141040"],
	["✉️", "weempoweruzbekistan@gmail.com"],
	["📍", t("footer.address")],
])

const counters = ref([
	{ value: 0, target: 40, suffix: "+", labelKey: "impact.stat1" },
	{ value: 0, target: 6, suffix: " ta", labelKey: "impact.stat2" },
	{ value: 0, target: 3, suffix: "", labelKey: "impact.stat3" },
])

// ── STATE ────────────────────────────────────────────────
const isScrolled = ref(false)
const scrollProgress = ref(0)
const showBackTop = ref(false)
const mobileNavOpen = ref(false)
const activeSection = ref("hero")
const counted = ref(false)

const modal = ref({ open: false, type: null, data: null })
const form = ref({ name: "", email: "", message: "" })
const formSent = ref(false)

// ── SCROLL ───────────────────────────────────────────────
function onScroll() {
	const scrollY = window.scrollY
	const maxScroll = document.body.scrollHeight - window.innerHeight
	isScrolled.value = scrollY > 60
	scrollProgress.value = (scrollY / maxScroll) * 100
	showBackTop.value = scrollY > 400

	for (const id of ["hero", "tasks", "reels", "impact", "team"]) {
		const el = document.getElementById(id)
		if (el && el.offsetTop <= scrollY + 120) activeSection.value = id
	}

	if (!counted.value) {
		const el = document.getElementById("impact")
		if (el && el.getBoundingClientRect().top < window.innerHeight - 100) {
			counted.value = true
			counters.value.forEach((c, i) => {
				const step = c.target / 40
				const timer = setInterval(() => {
					counters.value[i].value = Math.min(
						counters.value[i].value + step,
						c.target,
					)
					if (counters.value[i].value >= c.target) clearInterval(timer)
				}, 30)
			})
		}
	}
}

// ── MODAL ────────────────────────────────────────────────
function openModal(type, data = null) {
	modal.value = { open: true, type, data }
	document.body.style.overflow = "hidden"
}
function closeModal() {
	modal.value = { open: false, type: null, data: null }
	document.body.style.overflow = ""
	formSent.value = false
}
function submitForm() {
	formSent.value = true
	form.value = { name: "", email: "", message: "" }
}
function openModalCloseNavbar() {
	openModal("contact")
	mobileNavOpen.value = false
}

// ── LIFECYCLE ────────────────────────────────────────────
onMounted(() => {
	window.addEventListener("scroll", onScroll, { passive: true })

	const observer = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add("anim-in")
					observer.unobserve(entry.target)
				}
			})
		},
		{ threshold: 0.1 },
	)

	document
		.querySelectorAll(".from-top, .from-bottom, .from-left, .from-right")
		.forEach(el => observer.observe(el))

	onScroll()
})

onUnmounted(() => {
	window.removeEventListener("scroll", onScroll)
})
</script>

<template>
	<!-- Brand palette:
		Empower Red   #E24C4B  — primary, CTAs, headings
		Energy Orange #F57C00  — secondary accent
		Sunshine Yel  #FFC107  — support accent
		Soft Beige    #F7F3EF  — page background
		Light Neutral #EFEAE5  — card/section bg
		Charcoal      #212121  — text
	-->
	<main
		class="min-h-screen font-sans overflow-x-hidden"
		style="background: #f7f3ef; color: #212121"
	>
		<!-- SCROLL PROGRESS -->
		<div
			class="fixed top-0 left-0 h-[3px] z-[1001] transition-all duration-100"
			style="background: linear-gradient(to right, #e24c4b, #f57c00, #ffc107)"
			:style="{ width: scrollProgress + '%' }"
		/>

		<!-- ══ HEADER ══ -->
		<header
			class="fixed top-0 w-full z-[900] px-6 lg:px-10 py-5 flex justify-between items-center transition-all duration-300"
			:class="isScrolled ? 'shadow-sm border-b' : 'bg-transparent'"
			:style="
				isScrolled
					? 'background:rgba(247,243,239,0.95); backdrop-filter:blur(20px); border-color:#EFEAE5'
					: ''
			"
		>
			<div class="flex items-center gap-4">
				<div
					class="w-32 max-h-12 rounded-xl flex items-center justify-center p-1.5"
				>
					<img
						src="~/assets/images/logo/logo.png"
						alt="WeEmpower"
						class="object-contain w-full"
					/>
				</div>
			</div>

			<!-- Desktop nav -->
			<nav class="hidden lg:flex items-center gap-4">
				<div v-for="[href, label] in navLinks" :key="href">
					<a
						:href="href"
						class="text-[11px] font-bold uppercase tracking-widest relative pb-0.5 transition-colors duration-200 group"
						:class="
							isScrolled
								? 'hover:text-[#E24C4B]'
								: 'text-white/90 hover:text-white'
						"
						:style="isScrolled ? 'color:#212121' : ''"
					>
						{{ label }}
						<span
							class="absolute bottom-0 left-0 h-[2px] transition-all duration-300"
							style="background: #e24c4b"
							:class="
								activeSection === href.replace('#', '')
									? 'w-full'
									: 'w-0 group-hover:w-full'
							"
						/>
					</a>
				</div>

				<!-- Lang switcher -->
				<div
					class="flex items-center gap-1 border rounded-full px-1 py-1"
					:style="
						isScrolled
							? 'border-color:#E24C4B'
							: 'border-color:rgba(255,255,255,0.3)'
					"
				>
					<button
						v-for="lang in locales"
						:key="lang"
						class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-200"
						:style="
							locale === lang.code
								? 'background:#E24C4B; color:#fff'
								: isScrolled
									? 'color:#212121'
									: 'color:rgba(255,255,255,0.8)'
						"
						@click="setLocale(lang.code)"
					>
						{{ lang.code }}
					</button>
				</div>
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
					:style="isScrolled ? 'background:#212121' : 'background:white'"
					:class="[
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
				class="fixed inset-y-0 right-0 w-72 z-[800] shadow-2xl pt-24 px-8"
				style="background: #f7f3ef"
			>
				<ul class="space-y-1">
					<li
						v-for="[href, label] in navLinks"
						:key="href"
						style="border-bottom: 1px solid #efeae5"
					>
						<a
							:href="href"
							class="block py-4 text-base font-bold uppercase tracking-widest transition-colors"
							style="color: #212121"
							@click="mobileNavOpen = false"
							>{{ label }}</a
						>
					</li>
					<li class="pt-4 pb-2">
						<div class="flex gap-2">
							<button
								v-for="lang in locales"
								:key="lang"
								class="flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border"
								:style="
									locale === lang.code
										? 'background:#E24C4B;color:#fff;border-color:#E24C4B'
										: 'color:#212121;border-color:#EFEAE5'
								"
								@click="setLocale(lang.code)"
							>
								{{ lang.code }}
							</button>
						</div>
					</li>
					<li class="pt-2">
						<button
							class="w-full text-white py-3 rounded-xl text-sm font-bold uppercase tracking-widest"
							style="background: #e24c4b"
							@click="openModalCloseNavbar"
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
				class="fixed inset-0 bg-black/40 z-[700]"
				@click="mobileNavOpen = false"
			/>
		</Transition>

		<!-- ══ HERO ══ -->
		<section
			id="hero"
			class="relative min-h-screen flex items-center justify-center overflow-hidden"
			style="background: #212121"
		>
			<div class="absolute inset-0 z-0 pointer-events-none">
				<div class="hero-mesh" />
				<div class="hero-grid" />
				<div class="shape shape-1" />
				<div class="shape shape-2" />
				<div class="shape shape-3" />
				<div class="shape shape-4" />
			</div>

			<div
				class="relative z-10 w-full max-w-6xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
			>
				<div>
					<div
						class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
						style="
							background: rgba(226, 76, 75, 0.15);
							border: 1px solid rgba(226, 76, 75, 0.35);
						"
					>
						<span
							class="w-2 h-2 rounded-full animate-pulse"
							style="background: #ffc107"
						/>
						<span
							class="text-[10px] font-black uppercase tracking-[0.3em]"
							style="color: #ffc107"
						>
							{{ t("hero.badge.label") }}
						</span>
					</div>

					<h2
						class="font-black text-5xl xl:text-6xl leading-[1.05] tracking-tight mb-6"
						style="color: #fff"
					>
						{{ t("hero.title1") }}<br />
						<span class="hero-gradient-text">{{ t("hero.title2") }}</span
						><br />
						{{ t("hero.title3") }}<br />
						{{ t("hero.title4") }}
					</h2>

					<p
						class="text-base leading-relaxed mb-10 max-w-md"
						style="color: rgba(255, 255, 255, 0.6)"
					>
						{{ t("hero.desc") }}
					</p>

					<div
						class="flex gap-8 mt-12 pt-8"
						style="border-top: 1px solid rgba(255, 255, 255, 0.1)"
					>
						<div v-for="[num, lbl] in heroStats" :key="lbl">
							<div
								class="font-black text-2xl tracking-tight"
								style="color: #fff"
							>
								{{ num }}
							</div>
							<div
								class="text-[10px] font-bold uppercase tracking-widest mt-0.5"
								style="color: rgba(255, 255, 255, 0.4)"
							>
								{{ lbl }}
							</div>
						</div>
					</div>
				</div>

				<!-- Hero card -->
				<div class="relative hidden lg:block">
					<div
						class="absolute -top-4 -right-4 w-full h-full rounded-3xl"
						style="
							border: 1px solid rgba(226, 76, 75, 0.25);
							background: rgba(226, 76, 75, 0.06);
						"
					/>
					<div
						class="relative rounded-3xl overflow-hidden"
						style="
							background: rgba(255, 255, 255, 0.06);
							border: 1px solid rgba(255, 255, 255, 0.1);
						"
					>
						<img
							src="~/assets/images/jpg/team.jpg"
							alt="Women Empowerment"
							class="w-full aspect-[4/3] object-cover opacity-85"
						/>
						<div class="p-6">
							<div class="flex items-center gap-3 mb-3">
								<div
									class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
									style="background: #e24c4b"
								>
									<svg class="w-4 h-4 fill-white" viewBox="0 0 24 24">
										<path
											d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
										/>
									</svg>
								</div>
								<div>
									<div class="text-white text-sm font-bold">
										{{ t("hero.card.milestone") }}
									</div>
									<div
										class="text-[11px]"
										style="color: rgba(255, 255, 255, 0.5)"
									>
										{{ t("hero.card.milestoneSub") }}
									</div>
								</div>
							</div>
							<div
								class="h-1.5 rounded-full overflow-hidden"
								style="background: rgba(255, 255, 255, 0.1)"
							>
								<div
									class="h-full w-[78%] rounded-full"
									style="
										background: linear-gradient(to right, #e24c4b, #f57c00);
									"
								/>
							</div>
							<div class="flex justify-between mt-1.5">
								<span
									class="text-[10px] font-bold"
									style="color: rgba(255, 255, 255, 0.4)"
									>{{ t("hero.card.process") }}</span
								>
								<span class="text-[10px] font-black" style="color: #f57c00"
									>78%</span
								>
							</div>
						</div>
					</div>

					<div
						class="absolute -bottom-5 -left-5 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3"
						style="background: #fff"
					>
						<div
							class="w-9 h-9 rounded-xl flex items-center justify-center"
							style="background: #fff3e0"
						>
							<svg class="w-5 h-5" style="fill: #f57c00" viewBox="0 0 24 24">
								<path
									d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
								/>
							</svg>
						</div>
						<div>
							<div class="text-sm font-black" style="color: #212121">
								{{ t("hero.badge.ngo") }}
							</div>
							<div class="text-[10px] font-bold" style="color: #888">
								{{ t("hero.badge.ngoSub") }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce"
			>
				<div
					class="w-5 h-5 border-r-2 border-b-2 rotate-45"
					style="border-color: rgba(255, 255, 255, 0.3)"
				/>
			</div>
		</section>

		<!-- ══ TICKER ══ -->
		<div class="py-3 overflow-hidden" style="background: #212121">
			<div class="ticker-track flex gap-16 whitespace-nowrap">
				<template v-for="_ in 2" :key="_">
					<span
						v-for="item in tickerItems"
						:key="item + _"
						class="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest"
						style="color: rgba(255, 255, 255, 0.8)"
					>
						<span
							class="w-1.5 h-1.5 rounded-full flex-shrink-0"
							style="background: #e24c4b"
						/>
						{{ item }}
					</span>
				</template>
			</div>
		</div>

		<!-- ══ TASKS ══ -->
		<section id="tasks" class="py-28 px-6" style="background: #f7f3ef">
			<div class="max-w-6xl mx-auto">
				<div class="from-top mb-16">
					<span
						class="inline-block text-[11px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-4"
						style="background: rgba(226, 76, 75, 0.1); color: #e24c4b"
					>
						{{ t("tasks.label") }}
					</span>
					<h2
						class="text-4xl md:text-5xl font-black tracking-tight"
						style="color: #212121"
					>
						{{ t("tasks.title") }}
					</h2>
				</div>

				<!-- Loading skeleton -->
				<div
					v-if="!tasksRaw"
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					<div
						v-for="n in 6"
						:key="n"
						class="rounded-3xl overflow-hidden border animate-pulse"
						style="background: #efeae5; border-color: #e8e3dd"
					>
						<div class="h-52" style="background: #e0dad3" />
						<div class="p-7 space-y-3">
							<div class="h-5 rounded w-3/4" style="background: #d8d2cb" />
							<div class="h-4 rounded w-full" style="background: #e0dad3" />
						</div>
					</div>
				</div>

				<!-- Bo'sh holat -->
				<div
					v-else-if="projectTasks.length === 0"
					class="text-center py-16"
					style="color: #888"
				>
					<svg
						class="w-12 h-12 mx-auto mb-4 opacity-30"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						viewBox="0 0 24 24"
					>
						<path
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<p class="font-bold text-sm">Hali nashr qilingan task yo'q</p>
				</div>

				<!-- Tasklar -->
				<div
					v-else
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					<div
						v-for="(task, i) in projectTasks"
						:key="task.slug"
						class="from-bottom group rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
						:style="{
							transitionDelay: `${i * 80}ms`,
							animationDelay: `${i * 80}ms`,
							background: '#fff',
							border: '1px solid #EFEAE5',
							boxShadow: '0 4px 24px rgba(33,33,33,0.07)',
						}"
						style="box-shadow: 0 4px 24px rgba(33, 33, 33, 0.07)"
						@mouseover="
							$event.currentTarget.style.boxShadow =
								'0 16px 48px rgba(226,76,75,0.15)'
						"
						@mouseout="
							$event.currentTarget.style.boxShadow =
								'0 4px 24px rgba(33,33,33,0.07)'
						"
					>
						<div
							class="h-52 overflow-hidden relative"
							style="background: #efeae5"
						>
							<img
								:src="task.img"
								:alt="task.title"
								class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
								loading="lazy"
							/>
							<div
								class="absolute inset-0"
								style="
									background: linear-gradient(
										to top,
										rgba(33, 33, 33, 0.65) 0%,
										transparent 60%
									);
								"
							/>
							<div
								class="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
								style="background: #e24c4b"
							>
								{{ String(i + 1).padStart(2, "00") }}
							</div>
						</div>
						<div class="p-7">
							<h4
								class="text-xl font-black mb-2 line-clamp-2"
								style="color: #212121"
							>
								{{ task.title }}
							</h4>
							<p
								class="text-sm leading-relaxed line-clamp-3"
								style="color: #666"
							>
								{{ task.desc }}
							</p>
							<NuxtLink
								:to="localePath(`/projects/${task.slug}`)"
								class="mt-5 inline-flex items-center gap-2 font-black text-[11px] uppercase tracking-widest group-hover:gap-4 transition-all duration-300"
								style="color: #e24c4b"
							>
								{{ t("tasks.more") }}
								<svg
									class="w-4 h-4 group-hover:translate-x-1 transition-transform"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									viewBox="0 0 24 24"
								>
									<path d="M5 12h14M12 5l7 7-7 7" />
								</svg>
							</NuxtLink>
						</div>
					</div>
				</div>
			</div>
		</section>

		<ProjectStages />

		<!-- ══ REELS ══ -->
		<section
			id="reels"
			class="py-28 px-6 overflow-hidden"
			style="background: #efeae5"
		>
			<div class="max-w-6xl mx-auto">
				<div
					class="from-top flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
				>
					<div>
						<h2
							class="text-4xl md:text-5xl font-black tracking-tight"
							style="color: #212121"
						>
							{{ t("reels.title") }} <span class="reels-gradient">Reels</span>
						</h2>
						<p class="text-sm font-medium mt-2" style="color: #888">
							{{ t("reels.subtitle") }}
						</p>
					</div>
					<a
						href="https://www.instagram.com/weempower_uz"
						target="_blank"
						class="inline-flex items-center gap-2 text-sm font-bold transition-colors"
						style="color: #e24c4b"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
							/>
						</svg>
						@weempower_uz
					</a>
				</div>

				<div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
					<div
						v-for="(reel, i) in reels"
						:key="reel.id"
						class="reel-card from-bottom group"
						:style="{ animationDelay: `${i * 100}ms` }"
					>
						<div class="reel-phone">
							<div class="reel-notch" />
							<div class="reel-video-wrap">
								<iframe
									:src="`https://www.youtube.com/embed/${reel.id}?rel=0&modestbranding=1&controls=1&playsinline=1`"
									:title="reel.title"
									frameborder="0"
									allow="
										accelerometer;
										autoplay;
										clipboard-write;
										encrypted-media;
										gyroscope;
										picture-in-picture;
									"
									allowfullscreen
									class="w-full h-full"
									loading="lazy"
								/>
							</div>
							<div class="reel-label">
								<svg
									class="w-3.5 h-3.5 fill-white opacity-70"
									viewBox="0 0 24 24"
								>
									<path
										d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"
									/>
								</svg>
								<span>{{ t("reels.label") }}</span>
							</div>
						</div>
						<p
							class="text-center text-xs font-bold mt-3 px-1 truncate"
							style="color: #666"
						>
							{{ reel.title }}
						</p>
					</div>
				</div>

				<div class="from-bottom text-center mt-14">
					<a
						href="https://www.youtube.com/@taraqqiyotngo/shorts"
						target="_blank"
						class="inline-flex items-center gap-2 text-white px-7 py-3.5 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5"
						style="
							background: #212121;
							box-shadow: 0 8px 24px rgba(33, 33, 33, 0.2);
						"
					>
						<svg class="w-4 h-4" style="fill: #e24c4b" viewBox="0 0 24 24">
							<path
								d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"
							/>
						</svg>
						{{ t("reels.cta") }}
					</a>
				</div>
			</div>
		</section>

		<!-- ══ IMPACT ══ -->
		<section
			id="impact"
			class="py-28 text-white relative overflow-hidden px-6"
			style="background: #212121"
		>
			<img
				src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000"
				class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
				alt=""
			/>
			<div class="max-w-6xl mx-auto relative z-10">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
					<div class="from-left">
						<p
							class="text-[11px] font-black uppercase tracking-[0.4em] mb-4"
							style="color: #f57c00"
						>
							{{ t("impact.label") }}
						</p>
						<h2
							class="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-8"
						>
							{{ t("impact.title1") }}<br />
							<em class="not-italic" style="color: #e24c4b">{{
								t("impact.title2")
							}}</em>
						</h2>
						<p
							class="text-lg leading-relaxed mb-10"
							style="color: rgba(255, 255, 255, 0.7)"
						>
							{{ t("impact.desc") }}
						</p>
						<div class="flex gap-10 flex-wrap">
							<div
								v-for="c in counters"
								:key="c.labelKey"
								class="border-l-4 pl-5"
								style="border-color: #e24c4b"
							>
								<div class="text-5xl font-black tracking-tight">
									{{ Math.floor(c.value) }}{{ c.suffix }}
								</div>
								<div
									class="text-[10px] uppercase font-bold tracking-[0.2em] mt-1"
									style="color: rgba(255, 255, 255, 0.4)"
								>
									{{ t(c.labelKey) }}
								</div>
							</div>
						</div>
					</div>

					<div
						class="from-right rounded-[2.5rem] p-8 transition-all duration-500"
						style="
							background: rgba(255, 255, 255, 0.06);
							border: 1px solid rgba(255, 255, 255, 0.1);
						"
					>
						<div class="aspect-video rounded-2xl overflow-hidden mb-6">
							<img
								src="~/public/banner.jpg"
								class="w-full h-full object-cover"
								alt="Jamoa"
							/>
						</div>
						<blockquote
							class="text-lg italic leading-relaxed mb-4"
							style="color: rgba(255, 255, 255, 0.85)"
						>
							{{ t("impact.quote") }}
						</blockquote>
						<cite
							class="text-[11px] font-black uppercase tracking-widest not-italic"
							style="color: #f57c00"
						>
							{{ t("impact.cite") }}
						</cite>
					</div>
				</div>
			</div>
		</section>

		<!-- ══ TEAM ══ -->
		<section id="team" class="py-28 px-6" style="background: #f7f3ef">
			<div class="max-w-6xl mx-auto">
				<div class="from-top text-center mb-16">
					<p
						class="text-[11px] font-black uppercase tracking-[0.4em] mb-3"
						style="color: #e24c4b"
					>
						{{ t("team.label") }}
					</p>
					<h2
						class="text-4xl md:text-6xl font-black tracking-tight"
						style="color: #212121"
					>
						{{ t("team.title") }}
					</h2>
				</div>
				<div
					class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10"
				>
					<div
						v-for="(member, i) in team"
						:key="member.name"
						class="from-bottom"
						:style="{ animationDelay: `${i * 100}ms` }"
					>
						<div
							class="aspect-[3/4] rounded-[2rem] overflow-hidden mb-5 relative group cursor-pointer"
							style="box-shadow: 0 8px 32px rgba(33, 33, 33, 0.12)"
							@click="openModal('team', member)"
						>
							<img
								:src="member.img"
								:alt="member.name"
								class="w-full h-full object-cover grayscale-[60%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
							/>
							<div
								class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5"
								style="
									background: linear-gradient(
										to top,
										rgba(226, 76, 75, 0.85),
										transparent
									);
								"
							>
								<span
									class="text-white text-[11px] font-black uppercase tracking-widest"
									>{{ t("team.more") }}</span
								>
							</div>
						</div>
						<h4
							class="text-lg font-black mb-1 tracking-tight"
							style="color: #212121"
						>
							{{ member.name }}
						</h4>
						<p
							class="font-black uppercase tracking-widest text-[10px]"
							style="color: #e24c4b"
						>
							{{ member.bio }}
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- ══ PARTNERS ══ -->
		<section
			class="py-12 px-6"
			style="
				background: #efeae5;
				border-top: 1px solid #e8e3dd;
				border-bottom: 1px solid #e8e3dd;
			"
		>
			<div
				class="from-top max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-80 transition-all duration-500"
			>
				<!-- <img
					src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_Democracy_Fund_Logo.png"
					class="h-14 object-contain"
					alt="UNDEF"
				/> -->
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg"
					class="h-8 object-contain"
					alt="EU"
				/>
				<span class="font-serif italic font-black text-2xl" style="color: #888"
					>USAID</span
				>
				<span class="font-serif italic font-black text-2xl" style="color: #888"
					>JICA</span
				>
				<span class="font-serif italic font-black text-2xl" style="color: #888"
					>EBRD</span
				>
			</div>
		</section>

		<!-- ══ FOOTER ══ -->
		<footer class="text-white py-20 px-6" style="background: #212121">
			<div class="max-w-6xl mx-auto">
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16">
					<div class="from-left">
						<h2
							class="font-black text-4xl tracking-tight mb-4"
							style="color: #e24c4b"
						>
							WeEmpower.
						</h2>
						<p
							class="text-xs font-bold uppercase tracking-widest leading-loose mb-8 whitespace-pre-line"
							style="color: rgba(255, 255, 255, 0.35)"
						>
							{{ t("footer.org") }}
						</p>
						<div class="flex gap-3">
							<a
								v-for="lbl in ['T', 'F', 'I']"
								:key="lbl"
								href="#"
								class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all duration-200 hover:-translate-y-0.5"
								style="
									border: 1px solid rgba(255, 255, 255, 0.15);
									color: rgba(255, 255, 255, 0.6);
								"
								@mouseover="
									$event.currentTarget.style.background = '#E24C4B',
									$event.currentTarget.style.borderColor = '#E24C4B'
								"
								@mouseout="
									$event.currentTarget.style.background = 'transparent',
									$event.currentTarget.style.borderColor =
										'rgba(255,255,255,0.15)'
								"
								>{{ lbl }}</a
							>
						</div>
					</div>

					<div class="from-bottom">
						<h4
							class="text-xs font-black uppercase tracking-[0.3em] mb-6 italic"
							style="color: rgba(255, 255, 255, 0.3)"
						>
							{{ t("footer.contactTitle") }}
						</h4>
						<ul>
							<li
								v-for="[icon, text] in footerContacts"
								:key="icon"
								class="flex gap-3 text-sm py-3"
								style="
									color: rgba(255, 255, 255, 0.5);
									border-bottom: 1px solid rgba(255, 255, 255, 0.06);
								"
							>
								<span>{{ icon }}</span>
								<span>{{ text }}</span>
							</li>
						</ul>
					</div>

					<div class="from-right rounded-3xl p-8" style="background: #e24c4b">
						<h4 class="text-white font-black text-xl mb-3 leading-tight">
							{{ t("footer.ctaTitle") }}
						</h4>
						<p
							class="text-sm mb-6 leading-relaxed"
							style="color: rgba(255, 255, 255, 0.8)"
						>
							{{ t("footer.ctaDesc") }}
						</p>
						<button
							class="w-full font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] hover:shadow-xl transition-all duration-200"
							style="background: #fff; color: #e24c4b"
							@click="openModal('contact')"
						>
							{{ t("footer.ctaBtn") }}
						</button>
					</div>
				</div>

				<div
					class="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]"
					style="
						border-top: 1px solid rgba(255, 255, 255, 0.06);
						color: rgba(255, 255, 255, 0.2);
					"
				>
					<span>{{ t("footer.copy") }}</span>
					<!-- <span>{{ t("footer.undef") }}</span> -->
				</div>
			</div>
		</footer>

		<!-- BACK TO TOP -->
		<Transition name="fade">
			<button
				v-if="showBackTop"
				class="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center z-[500] transition-all duration-200 hover:-translate-y-1"
				style="
					background: #e24c4b;
					box-shadow: 0 8px 24px rgba(226, 76, 75, 0.35);
				"
				@click="window.scrollTo({ top: 0, behavior: 'smooth' })"
			>
				<svg class="w-5 h-5 fill-white" viewBox="0 0 24 24">
					<path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
				</svg>
			</button>
		</Transition>

		<!-- ══ MODAL ══ -->
		<Transition name="fade">
			<div
				v-if="modal.open"
				class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
				style="background: rgba(33, 33, 33, 0.8); backdrop-filter: blur(12px)"
				@click.self="closeModal"
			>
				<Transition name="scale">
					<div
						v-if="modal.open"
						class="rounded-3xl p-8 w-full max-w-md relative shadow-2xl"
						style="background: #fff"
					>
						<button
							class="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
							style="background: #f7f3ef; color: #212121"
							@click="closeModal"
						>
							✕
						</button>

						<!-- Contact -->
						<template v-if="modal.type === 'contact'">
							<h3 class="text-2xl font-black mb-1" style="color: #212121">
								{{ t("modal.contactTitle") }}
							</h3>
							<p
								class="text-[11px] font-black uppercase tracking-widest mb-6"
								style="color: #e24c4b"
							>
								{{ t("modal.contactSubtitle") }}
							</p>
							<div v-if="!formSent" class="flex flex-col gap-3">
								<input
									v-model="form.name"
									type="text"
									:placeholder="t('modal.name')"
									class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
									style="border: 1.5px solid #efeae5; color: #212121"
								/>
								<input
									v-model="form.email"
									type="email"
									:placeholder="t('modal.email')"
									class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
									style="border: 1.5px solid #efeae5; color: #212121"
								/>
								<textarea
									v-model="form.message"
									rows="3"
									:placeholder="t('modal.message')"
									class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors resize-none"
									style="border: 1.5px solid #efeae5; color: #212121"
								/>
								<button
									class="w-full text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:-translate-y-0.5"
									style="
										background: #e24c4b;
										box-shadow: 0 4px 16px rgba(226, 76, 75, 0.3);
									"
									@click="submitForm"
								>
									{{ t("modal.send") }}
								</button>
							</div>
							<div v-else class="text-center py-8">
								<div class="text-5xl mb-4">✅</div>
								<h4 class="text-xl font-black mb-2" style="color: #212121">
									{{ t("modal.sentTitle") }}
								</h4>
								<p class="text-sm" style="color: #888">
									{{ t("modal.sentDesc") }}
								</p>
							</div>
						</template>

						<!-- Video -->
						<template v-else-if="modal.type === 'video'">
							<h3 class="text-xl font-black mb-4" style="color: #212121">
								{{ t("modal.videoTitle") }}
							</h3>
							<div
								class="aspect-video rounded-2xl overflow-hidden"
								style="background: #212121"
							>
								<video controls autoplay class="w-full h-full rounded-2xl">
									<source
										src="https://assets.mixkit.co/videos/preview/mixkit-group-of-people-working-on-a-project-in-an-office-42713-large.mp4"
										type="video/mp4"
									/>
								</video>
							</div>
						</template>

						<!-- Team -->
						<template v-else-if="modal.type === 'team' && modal.data">
							<img
								:src="modal.data.img"
								:alt="modal.data.name"
								class="w-20 h-20 rounded-full object-cover mb-4 border-4"
								style="border-color: #f7f3ef"
							/>
							<h3 class="text-2xl font-black mb-1" style="color: #212121">
								{{ modal.data.name }}
							</h3>
							<p
								class="text-[11px] font-black uppercase tracking-widest mb-4"
								style="color: #e24c4b"
							>
								{{ modal.data.role }}
							</p>
							<p class="text-sm leading-relaxed" style="color: #666">
								{{ modal.data.bio }}
							</p>
						</template>
					</div>
				</Transition>
			</div>
		</Transition>
	</main>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap");

body {
	font-family: "DM Sans", sans-serif;
}

/* Hero background — red/orange mesh instead of blue */
.hero-mesh {
	position: absolute;
	inset: 0;
	background:
		radial-gradient(
			ellipse 80% 60% at 20% 40%,
			rgba(226, 76, 75, 0.3) 0%,
			transparent 60%
		),
		radial-gradient(
			ellipse 60% 80% at 80% 60%,
			rgba(245, 124, 0, 0.18) 0%,
			transparent 60%
		),
		radial-gradient(
			ellipse 40% 40% at 60% 20%,
			rgba(255, 193, 7, 0.12) 0%,
			transparent 50%
		);
}

.hero-grid {
	position: absolute;
	inset: 0;
	background-image:
		linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
		linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
	background-size: 60px 60px;
}

/* Red → Orange gradient text */
.hero-gradient-text {
	background: linear-gradient(135deg, #e24c4b, #f57c00);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

/* Floating shapes — warm tones */
.shape {
	position: absolute;
	border-radius: 50%;
	filter: blur(60px);
	pointer-events: none;
}

.shape-1 {
	width: 400px;
	height: 400px;
	top: -100px;
	left: -100px;
	background: rgba(226, 76, 75, 0.18);
	animation: float1 8s ease-in-out infinite;
}

.shape-2 {
	width: 300px;
	height: 300px;
	top: 30%;
	right: -80px;
	background: rgba(245, 124, 0, 0.14);
	animation: float2 10s ease-in-out infinite;
}

.shape-3 {
	width: 200px;
	height: 200px;
	bottom: 10%;
	left: 30%;
	background: rgba(255, 193, 7, 0.1);
	animation: float1 12s ease-in-out infinite reverse;
}

.shape-4 {
	width: 250px;
	height: 250px;
	bottom: -80px;
	right: 20%;
	background: rgba(226, 76, 75, 0.1);
	animation: float2 9s ease-in-out infinite;
}

@keyframes float1 {
	0%,
	100% {
		transform: translate(0, 0) scale(1);
	}

	50% {
		transform: translate(30px, -30px) scale(1.05);
	}
}

@keyframes float2 {
	0%,
	100% {
		transform: translate(0, 0) scale(1);
	}

	50% {
		transform: translate(-20px, 20px) scale(0.95);
	}
}

/* Scroll animations */
.from-top {
	opacity: 0;
	transform: translateY(-40px);
	transition:
		opacity 0.7s ease,
		transform 0.7s ease;
}

.from-bottom {
	opacity: 0;
	transform: translateY(50px);
	transition:
		opacity 0.7s ease,
		transform 0.7s ease;
}

.from-left {
	opacity: 0;
	transform: translateX(-50px);
	transition:
		opacity 0.8s ease,
		transform 0.8s ease;
}

.from-right {
	opacity: 0;
	transform: translateX(50px);
	transition:
		opacity 0.8s ease,
		transform 0.8s ease;
}

.from-top.anim-in,
.from-bottom.anim-in,
.from-left.anim-in,
.from-right.anim-in {
	opacity: 1;
	transform: translate(0, 0);
}

/* Ticker */
.ticker-track {
	animation: ticker 30s linear infinite;
}

@keyframes ticker {
	from {
		transform: translateX(0);
	}

	to {
		transform: translateX(-50%);
	}
}

/* Vue transitions */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
	transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from,
.slide-right-leave-to {
	transform: translateX(100%);
}

.scale-enter-active,
.scale-leave-active {
	transition:
		transform 0.3s,
		opacity 0.3s;
}

.scale-enter-from,
.scale-leave-to {
	transform: scale(0.92);
	opacity: 0;
}

/* Reels — Instagram gradient stays */
.reels-gradient {
	background: linear-gradient(135deg, #e1306c, #f77737);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.reel-card {
	display: flex;
	flex-direction: column;
}

.reel-phone {
	position: relative;
	background: #1a1d27;
	border-radius: 28px;
	overflow: hidden;
	aspect-ratio: 9/16;
	box-shadow:
		0 0 0 1.5px rgba(255, 255, 255, 0.06),
		0 20px 60px rgba(0, 0, 0, 0.25),
		inset 0 1px 0 rgba(255, 255, 255, 0.04);
	transition:
		transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
		box-shadow 0.4s;
}

.reel-card:hover .reel-phone {
	transform: translateY(-8px) scale(1.02);
	box-shadow:
		0 0 0 1.5px rgba(226, 76, 75, 0.4),
		0 32px 80px rgba(0, 0, 0, 0.3),
		inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.reel-notch {
	position: absolute;
	top: 10px;
	left: 50%;
	transform: translateX(-50%);
	width: 48px;
	height: 5px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 3px;
	z-index: 10;
}

.reel-video-wrap {
	position: absolute;
	inset: 0;
	border-radius: 28px;
	overflow: hidden;
}

.reel-video-wrap iframe {
	width: 100%;
	height: 100%;
	border: none;
}

.reel-label {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 1rem 0.75rem 0.75rem;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
	display: flex;
	align-items: center;
	gap: 0.4rem;
	z-index: 5;
}

.reel-label span {
	color: rgba(255, 255, 255, 0.7);
	font-size: 0.6rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.1em;
}

/* Utility */
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.line-clamp-3 {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
