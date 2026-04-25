<script setup>
const { t, locale } = useI18n()
const route = useRoute()
const slug = route.params.slug
const supabase = useSupabaseClient()

const task = ref(null)
const allSlugs = ref([])
const dbLoading = ref(true)

// ── Barcha published sluglar ──────────────────────────────
const { data: slugsData } = await useAsyncData("task-slugs", async () => {
	const { data } = await supabase
		.from("tasks")
		.select("slug")
		.eq("status", "published")
		.order("updated_at", { ascending: false })
	return data ?? []
})

allSlugs.value = (slugsData.value ?? []).map(s => s.slug)
const index = allSlugs.value.indexOf(slug)

if (index === -1) {
	throw createError({ statusCode: 404, statusMessage: "Sahifa topilmadi" })
}

// ── Joriy task (image_url ham) ────────────────────────────
const { data: taskData } = await useAsyncData(`task-${slug}`, async () => {
	const { data, error } = await supabase
		.from("tasks")
		.select("slug, status, uz, ru, en, updated_at, image_url")
		.eq("slug", slug)
		.eq("status", "published")
		.single()

	if (error || !data) return null
	return data
})

if (!taskData.value) {
	throw createError({ statusCode: 404, statusMessage: "Sahifa topilmadi" })
}

task.value = taskData.value
dbLoading.value = false

// ── Til bo'yicha ma'lumot ─────────────────────────────────
const currentLangData = computed(() => {
	const lang = locale.value
	return task.value?.[lang] ?? task.value?.uz ?? null
})

// ── Prev / Next ───────────────────────────────────────────
const prevSlug = computed(() => (index > 0 ? allSlugs.value[index - 1] : null))
const nextSlug = computed(() => (index < allSlugs.value.length - 1 ? allSlugs.value[index + 1] : null))

const { data: neighborData } = await useAsyncData(`task-neighbors-${slug}`, async () => {
	const neighborSlugs = [prevSlug.value, nextSlug.value].filter(Boolean)
	if (!neighborSlugs.length) return {}
	const { data } = await supabase
		.from("tasks")
		.select("slug, uz, ru, en")
		.in("slug", neighborSlugs)
	const result = {}
	for (const item of data ?? []) result[item.slug] = item
	return result
})

function getNeighborTitle(neighborSlug) {
	if (!neighborSlug) return neighborSlug
	const item = neighborData.value?.[neighborSlug]
	if (!item) return neighborSlug
	return item[locale.value]?.title ?? item.uz?.title ?? neighborSlug
}

// ── Hero rasm: avval bazadan, bo'lmasa fallback ───────────
const fallbackImages = [
	"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600",
	"https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=1600",
	"https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1600",
	"https://images.unsplash.com/photo-1573161158365-59b7033d749d?auto=format&fit=crop&q=80&w=1600",
	"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1600",
	"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600",
]
const heroImage = computed(
	() => task.value?.image_url || fallbackImages[index % fallbackImages.length]
)

// ── Scroll ────────────────────────────────────────────────
const isScrolled = ref(false)
const scrollProgress = ref(0)

function onScroll() {
	const scrollY = window.scrollY
	const maxScroll = document.body.scrollHeight - window.innerHeight
	isScrolled.value = scrollY > 60
	scrollProgress.value = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0
}

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
})

onUnmounted(() => {
	window.removeEventListener("scroll", onScroll)
})

// ── SEO ───────────────────────────────────────────────────
useSeoMeta({
	title: () =>
		currentLangData.value ? `${currentLangData.value.title} — TARAQQIYOT` : "TARAQQIYOT",
	description: () => currentLangData.value?.desc ?? "",
	ogImage: () => task.value?.image_url ?? fallbackImages[index % fallbackImages.length],
})
</script>

<template>
	<main class="min-h-screen bg-white font-sans overflow-x-hidden">

		<!-- SCROLL PROGRESS -->
		<div
			class="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-600 to-violet-500 z-[1001] transition-all duration-100"
			:style="{ width: scrollProgress + '%' }"
		/>

		<!-- ══ HEADER ══ -->
		<header
			class="fixed top-0 w-full z-[900] px-6 lg:px-10 py-5 flex justify-between items-center transition-all duration-300"
			:class="isScrolled ? 'bg-white/90 backdrop-blur-xl border-b border-black/[0.08] shadow-sm' : 'bg-transparent'"
		>
			<NuxtLink to="/" class="flex items-center gap-3 group">
				<div class="w-32 h-auto max-h-12 rounded-xl flex items-center justify-center p-1.5">
					<img src="~/assets/images/logo/logo.png" alt="TARAQQIYOT" class="object-contain w-full" />
				</div>
			</NuxtLink>

			<NuxtLink
				to="/"
				class="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-colors duration-200"
				:class="isScrolled ? 'text-slate-500 hover:text-slate-900' : 'text-white/80 hover:text-white'"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
					<path d="M19 12H5M12 5l-7 7 7 7" />
				</svg>
				{{ t("detail.back") }}
			</NuxtLink>
		</header>

		<!-- ══ HERO ══ -->
		<section class="relative min-h-[75vh] flex items-end overflow-hidden bg-[#05080f]">

			<!-- Fon rasmi -->
			<div class="absolute inset-0 z-0">
				<img
					:src="heroImage"
					:alt="currentLangData?.title ?? slug"
					class="w-full h-full object-cover transition-opacity duration-700"
					:class="task?.image_url ? 'opacity-60' : 'opacity-40'"
				/>
				<!-- Mesh overlay -->
				<div
					class="absolute inset-0"
					:style="{
						background: `
							radial-gradient(ellipse 80% 60% at 20% 40%, rgba(26,86,219,0.3) 0%, transparent 60%),
							radial-gradient(ellipse 60% 80% at 80% 60%, rgba(99,102,241,0.15) 0%, transparent 60%)
						`
					}"
				/>
				<!-- Grid -->
				<div
					class="absolute inset-0 opacity-30"
					:style="{
						backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
						backgroundSize: '60px 60px'
					}"
				/>
				<!-- Gradient overlay pastdan -->
				<div class="absolute inset-0 bg-gradient-to-t from-[#05080f] via-[#05080f]/50 to-transparent" />
				<!-- Gradient overlay tepadan (header uchun) -->
				<div class="absolute inset-0 bg-gradient-to-b from-[#05080f]/40 via-transparent to-transparent" />
			</div>

			<!-- Kontent -->
			<div class="relative z-10 w-full max-w-6xl mx-auto px-6 pb-24 pt-40">

				<!-- Badge -->
				<div class="inline-flex items-center gap-2 bg-blue-600/15 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6 from-top">
					<span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
					<span class="text-blue-300 text-[10px] font-black uppercase tracking-[0.3em]">
						{{ t("detail.taskLabel") }} {{ index + 1 }} / {{ allSlugs.length }}
					</span>
				</div>

				<h1 class="text-white font-black text-5xl xl:text-7xl leading-[1.02] tracking-tight mb-6 from-top max-w-4xl">
					{{ currentLangData?.title ?? slug }}
				</h1>
				<p class="text-slate-300 text-lg leading-relaxed max-w-2xl from-top">
					{{ currentLangData?.desc }}
				</p>

				<!-- Rasm manbai badge (agar o'z rasm bo'lsa) -->
				<div v-if="task?.image_url" class="mt-6 from-top">
					<span class="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold text-white/70 uppercase tracking-wider">
						<svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<polyline points="21 15 16 10 5 21" />
						</svg>
						Loyiha rasmi
					</span>
				</div>
			</div>

			<!-- Scroll indicator -->
			<div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
				<div class="w-5 h-5 border-r-2 border-b-2 border-white/30 rotate-45" />
			</div>
		</section>

		<!-- ══ CONTENT ══ -->
		<section class="py-24 px-6 bg-white">
			<div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">

				<!-- Chap: bo'limlar -->
				<div class="lg:col-span-2 space-y-16">
					<div
						v-for="(section, i) in currentLangData?.sections"
						:key="section.heading"
						class="from-bottom"
						:style="{ animationDelay: `${i * 80}ms` }"
					>
						<div class="flex items-start gap-4 mb-5">
							<div class="w-1 h-8 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
							<h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
								{{ section.heading }}
							</h2>
						</div>

						<p v-if="section.text" class="text-slate-500 leading-relaxed text-base mb-5 ml-5">
							{{ section.text }}
						</p>

						<ul v-if="section.list?.length" class="space-y-3 ml-5">
							<li
								v-for="item in section.list"
								:key="item"
								class="flex items-start gap-3 text-slate-600 text-sm leading-relaxed"
							>
								<span class="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
								{{ item }}
							</li>
						</ul>
					</div>

					<div v-if="!currentLangData?.sections?.length" class="text-slate-300 text-sm italic">
						Kontent hali qo'shilmagan.
					</div>
				</div>

				<!-- O'ng: sidebar -->
				<aside class="from-right space-y-6">

					<!-- Rasm kartasi (agar mavjud bo'lsa) -->
					<div v-if="task?.image_url" class="rounded-3xl overflow-hidden shadow-xl">
						<img
							:src="task.image_url"
							:alt="currentLangData?.title"
							class="w-full aspect-video object-cover"
						/>
					</div>

					<!-- Natijalar -->
					<div
						v-if="currentLangData?.results?.length"
						class="bg-slate-900 text-white rounded-3xl p-7 sticky top-28"
					>
						<p class="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
							{{ t("detail.resultsLabel") ?? "Natijalar" }}
						</p>
						<ul class="space-y-4">
							<li
								v-for="(result, i) in currentLangData.results"
								:key="i"
								class="flex items-start gap-3 text-sm text-slate-300 leading-relaxed border-b border-white/[0.08] pb-4 last:border-0 last:pb-0"
							>
								<span class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
									{{ i + 1 }}
								</span>
								{{ result }}
							</li>
						</ul>
					</div>

					<!-- Tartib raqami -->
					<div class="border border-slate-100 rounded-3xl p-6 text-center">
						<div class="text-6xl font-black text-slate-100 tracking-tight leading-none mb-1">
							{{ String(index + 1).padStart(2, "0") }}
						</div>
						<p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
							{{ t("detail.taskLabel") }}
						</p>
					</div>
				</aside>
			</div>
		</section>

		<!-- ══ PREV / NEXT ══ -->
		<section class="py-16 bg-slate-50 border-t border-slate-100 px-6">
			<div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-4">

				<NuxtLink
					v-if="prevSlug"
					:to="`/projects/${prevSlug}`"
					class="group flex items-center gap-4 bg-white border border-slate-100 hover:border-blue-200 rounded-2xl px-7 py-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex-1"
				>
					<div class="w-10 h-10 rounded-full border border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-600 flex items-center justify-center transition-all duration-300 flex-shrink-0">
						<svg class="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
							<path d="M19 12H5M12 5l-7 7 7 7" />
						</svg>
					</div>
					<div>
						<p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
							{{ t("detail.prev") ?? "Oldingi" }}
						</p>
						<p class="text-sm font-black text-slate-900">{{ getNeighborTitle(prevSlug) }}</p>
					</div>
				</NuxtLink>

				<div v-else class="flex-1" />

				<NuxtLink
					v-if="nextSlug"
					:to="`/projects/${nextSlug}`"
					class="group flex items-center justify-end gap-4 bg-white border border-slate-100 hover:border-blue-200 rounded-2xl px-7 py-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex-1 text-right"
				>
					<div>
						<p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
							{{ t("detail.next") ?? "Keyingi" }}
						</p>
						<p class="text-sm font-black text-slate-900">{{ getNeighborTitle(nextSlug) }}</p>
					</div>
					<div class="w-10 h-10 rounded-full border border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-600 flex items-center justify-center transition-all duration-300 flex-shrink-0">
						<svg class="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</div>
				</NuxtLink>
			</div>
		</section>

		<!-- ══ FOOTER ══ -->
		<footer class="bg-slate-950 text-white py-10 px-6">
			<div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
				<h2 class="font-black text-2xl tracking-tight text-blue-500">TARAQQIYOT.</h2>
				<p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
					{{ t("footer.copy") }}
				</p>
			</div>
		</footer>
	</main>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap");

/* IntersectionObserver .anim-in qo'shadi — JS bilan ishlaydi */
.from-top {
	opacity: 0;
	transform: translateY(-40px);
	transition: opacity 0.7s ease, transform 0.7s ease;
}
.from-bottom {
	opacity: 0;
	transform: translateY(50px);
	transition: opacity 0.7s ease, transform 0.7s ease;
}
.from-left {
	opacity: 0;
	transform: translateX(-50px);
	transition: opacity 0.8s ease, transform 0.8s ease;
}
.from-right {
	opacity: 0;
	transform: translateX(50px);
	transition: opacity 0.8s ease, transform 0.8s ease;
}
.from-top.anim-in,
.from-bottom.anim-in,
.from-left.anim-in,
.from-right.anim-in {
	opacity: 1;
	transform: translate(0, 0);
}
</style>