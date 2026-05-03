<script setup>
const { t, locale } = useI18n()
const route = useRoute()
const slug = route.params.slug
const supabase = useSupabaseClient()
const localePath = useLocalePath()

const task = ref(null)
const allSlugs = ref([])
const dbLoading = ref(true)

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

const currentLangData = computed(() => {
	const lang = locale.value
	return task.value?.[lang] ?? task.value?.uz ?? null
})

const prevSlug = computed(() => (index > 0 ? allSlugs.value[index - 1] : null))
const nextSlug = computed(() =>
	index < allSlugs.value.length - 1 ? allSlugs.value[index + 1] : null,
)

const { data: neighborData } = await useAsyncData(
	`task-neighbors-${slug}`,
	async () => {
		const neighborSlugs = [prevSlug.value, nextSlug.value].filter(Boolean)
		if (!neighborSlugs.length) return {}
		const { data } = await supabase
			.from("tasks")
			.select("slug, uz, ru, en")
			.in("slug", neighborSlugs)
		const result = {}
		for (const item of data ?? []) result[item.slug] = item
		return result
	},
)

function getNeighborTitle(neighborSlug) {
	if (!neighborSlug) return neighborSlug
	const item = neighborData.value?.[neighborSlug]
	if (!item) return neighborSlug
	return item[locale.value]?.title ?? item.uz?.title ?? neighborSlug
}

const fallbackImages = [
	"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600",
	"https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=1600",
	"https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1600",
	"https://images.unsplash.com/photo-1573161158365-59b7033d749d?auto=format&fit=crop&q=80&w=1600",
	"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1600",
	"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600",
]
const heroImage = computed(
	() => task.value?.image_url || fallbackImages[index % fallbackImages.length],
)

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

onUnmounted(() => window.removeEventListener("scroll", onScroll))

useSeoMeta({
	title: () =>
		currentLangData.value
			? `${currentLangData.value.title} — WeEmpower`
			: "WeEmpower",
	description: () => currentLangData.value?.desc ?? "",
	ogImage: () =>
		task.value?.image_url ?? fallbackImages[index % fallbackImages.length],
})
</script>

<template>
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
			<NuxtLink :to="localePath('/')" class="flex items-center gap-3 group">
				<div
					class="w-32 h-auto max-h-12 rounded-xl flex items-center justify-center p-1.5"
				>
					<img
						src="~/assets/images/logo/logo.png"
						alt="WeEmpower"
						class="object-contain w-full"
					/>
				</div>
			</NuxtLink>

			<NuxtLink
				:to="localePath('/')"
				class="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-200"
				:style="isScrolled ? 'color:#212121' : 'color:rgba(255,255,255,0.85)'"
				@mouseover="
					isScrolled && ($event.currentTarget.style.color = '#E24C4B')
				"
				@mouseout="isScrolled && ($event.currentTarget.style.color = '#212121')"
			>
				<svg
					class="w-4 h-4"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					viewBox="0 0 24 24"
				>
					<path d="M19 12H5M12 5l-7 7 7 7" />
				</svg>
				{{ t("detail.back") }}
			</NuxtLink>
		</header>

		<!-- ══ HERO ══ -->
		<section
			class="relative min-h-[75vh] flex items-end overflow-hidden"
			style="background: #212121"
		>
			<div class="absolute inset-0 z-0">
				<!-- Rasm -->
				<img
					:src="heroImage"
					:alt="currentLangData?.title ?? slug"
					class="w-full h-full object-cover transition-opacity duration-700"
					:class="task?.image_url ? 'opacity-55' : 'opacity-35'"
				/>

				<!-- Warm mesh overlay — brand ranglarda -->
				<div
					class="absolute inset-0"
					:style="{
						background: `
							radial-gradient(ellipse 80% 60% at 20% 40%, rgba(226,76,75,0.35) 0%, transparent 60%),
							radial-gradient(ellipse 60% 80% at 80% 60%, rgba(245,124,0,0.2) 0%, transparent 60%)
						`,
					}"
				/>

				<!-- Subtle grid -->
				<div
					class="absolute inset-0 opacity-20"
					:style="{
						backgroundImage:
							'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
						backgroundSize: '60px 60px',
					}"
				/>

				<!-- Gradient pastdan -->
				<div
					class="absolute inset-0"
					style="
						background: linear-gradient(
							to top,
							#212121 0%,
							rgba(33, 33, 33, 0.6) 40%,
							transparent 100%
						);
					"
				/>
				<!-- Gradient tepadan (header uchun) -->
				<div
					class="absolute inset-0"
					style="
						background: linear-gradient(
							to bottom,
							rgba(33, 33, 33, 0.45) 0%,
							transparent 35%
						);
					"
				/>
			</div>

			<!-- Kontent -->
			<div class="relative z-10 w-full max-w-6xl mx-auto px-6 pb-24 pt-40">
				<!-- Badge -->
				<div
					class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 from-top"
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
						{{ t("detail.taskLabel") }} {{ index + 1 }} / {{ allSlugs.length }}
					</span>
				</div>

				<h1
					class="text-white font-black text-5xl xl:text-7xl leading-[1.02] tracking-tight mb-6 from-top max-w-4xl"
				>
					{{ currentLangData?.title ?? slug }}
				</h1>
				<p
					class="text-lg leading-relaxed max-w-2xl from-top"
					style="color: rgba(255, 255, 255, 0.65)"
				>
					{{ currentLangData?.desc }}
				</p>

				<!-- Rasm badge -->
				<div v-if="task?.image_url" class="mt-6 from-top">
					<span
						class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
						style="
							background: rgba(255, 255, 255, 0.1);
							border: 1px solid rgba(255, 255, 255, 0.2);
							color: rgba(255, 255, 255, 0.65);
						"
					>
						<svg
							class="w-3 h-3"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<polyline points="21 15 16 10 5 21" />
						</svg>
						Loyiha rasmi
					</span>
				</div>
			</div>

			<!-- Scroll indicator -->
			<div
				class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce"
			>
				<div
					class="w-5 h-5 border-r-2 border-b-2 rotate-45"
					style="border-color: rgba(255, 255, 255, 0.35)"
				/>
			</div>
		</section>

		<!-- ══ CONTENT ══ -->
		<section class="py-24 px-6" style="background: #f7f3ef">
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
							<!-- Brand red accent line -->
							<div
								class="w-1 h-8 rounded-full flex-shrink-0 mt-1"
								style="background: #e24c4b"
							/>
							<h2
								class="text-2xl md:text-3xl font-black tracking-tight leading-tight"
								style="color: #212121"
							>
								{{ section.heading }}
							</h2>
						</div>

						<p
							v-if="section.text"
							class="leading-relaxed text-base mb-5 ml-5"
							style="color: #666"
						>
							{{ section.text }}
						</p>

						<ul v-if="section.list?.length" class="space-y-3 ml-5">
							<li
								v-for="item in section.list"
								:key="item"
								class="flex items-start gap-3 text-sm leading-relaxed"
								style="color: #555"
							>
								<span
									class="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
									style="background: #e24c4b"
								/>
								{{ item }}
							</li>
						</ul>
					</div>

					<div
						v-if="!currentLangData?.sections?.length"
						class="text-sm italic"
						style="color: #bbb"
					>
						Kontent hali qo'shilmagan.
					</div>
				</div>

				<!-- O'ng: sidebar -->
				<aside class="from-right space-y-6">
					<!-- Rasm kartasi -->
					<div
						v-if="task?.image_url"
						class="rounded-3xl overflow-hidden"
						style="box-shadow: 0 8px 32px rgba(33, 33, 33, 0.12)"
					>
						<img
							:src="task.image_url"
							:alt="currentLangData?.title"
							class="w-full aspect-video object-cover"
						/>
					</div>

					<!-- Natijalar -->
					<div
						v-if="currentLangData?.results?.length"
						class="text-white rounded-3xl p-7 sticky top-28"
						style="background: #212121"
					>
						<p
							class="text-[10px] font-black uppercase tracking-[0.4em] mb-4"
							style="color: #f57c00"
						>
							{{ t("detail.resultsLabel") ?? "Natijalar" }}
						</p>
						<ul class="space-y-4">
							<li
								v-for="(result, i) in currentLangData.results"
								:key="i"
								class="flex items-start gap-3 text-sm leading-relaxed pb-4 last:pb-0"
								style="
									color: rgba(255, 255, 255, 0.75);
									border-bottom: 1px solid rgba(255, 255, 255, 0.06);
								"
							>
								<span
									class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5 text-white"
									style="background: #e24c4b"
								>
									{{ i + 1 }}
								</span>
								{{ result }}
							</li>
						</ul>
					</div>

					<!-- Tartib raqami -->
					<div
						class="rounded-3xl p-6 text-center"
						style="border: 1px solid #efeae5; background: #fff"
					>
						<div
							class="text-6xl font-black tracking-tight leading-none mb-1"
							style="color: #efeae5"
						>
							{{ String(index + 1).padStart(2, "0") }}
						</div>
						<p
							class="text-[10px] font-black uppercase tracking-[0.3em]"
							style="color: #bbb"
						>
							{{ t("detail.taskLabel") }}
						</p>
					</div>
				</aside>
			</div>
		</section>

		<!-- ══ PREV / NEXT ══ -->
		<section
			class="py-16 px-6"
			style="background: #efeae5; border-top: 1px solid #e8e3dd"
		>
			<div
				class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-4"
			>
				<NuxtLink
					v-if="prevSlug"
					:to="localePath(`/projects/${prevSlug}`)"
					class="group flex items-center gap-4 rounded-2xl px-7 py-5 transition-all duration-300 hover:-translate-y-0.5 flex-1"
					style="
						background: #fff;
						border: 1px solid #e8e3dd;
						box-shadow: 0 2px 8px rgba(33, 33, 33, 0.04);
					"
					@mouseover="
						$event.currentTarget.style.borderColor = '#E24C4B',
						$event.currentTarget.style.boxShadow =
							'0 8px 24px rgba(226,76,75,0.12)'
					"
					@mouseout="
						$event.currentTarget.style.borderColor = '#E8E3DD',
						$event.currentTarget.style.boxShadow =
							'0 2px 8px rgba(33,33,33,0.04)'
					"
				>
					<div
						class="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 group-hover:text-white"
						style="border-color: #e8e3dd; color: #bbb"
						@mouseover="
							$event.currentTarget.style.background = '#E24C4B',
							$event.currentTarget.style.borderColor = '#E24C4B'
						"
						@mouseout="
							$event.currentTarget.style.background = 'transparent',
							$event.currentTarget.style.borderColor = '#E8E3DD'
						"
					>
						<svg
							class="w-4 h-4"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							viewBox="0 0 24 24"
						>
							<path d="M19 12H5M12 5l-7 7 7 7" />
						</svg>
					</div>
					<div>
						<p
							class="text-[10px] font-black uppercase tracking-widest mb-0.5"
							style="color: #bbb"
						>
							{{ t("detail.prev") ?? "Oldingi" }}
						</p>
						<p class="text-sm font-black" style="color: #212121">
							{{ getNeighborTitle(prevSlug) }}
						</p>
					</div>
				</NuxtLink>

				<div v-else class="flex-1" />

				<NuxtLink
					v-if="nextSlug"
					:to="localePath(`/projects/${nextSlug}`)"
					class="group flex items-center justify-end gap-4 rounded-2xl px-7 py-5 transition-all duration-300 hover:-translate-y-0.5 flex-1 text-right"
					style="
						background: #fff;
						border: 1px solid #e8e3dd;
						box-shadow: 0 2px 8px rgba(33, 33, 33, 0.04);
					"
					@mouseover="
						$event.currentTarget.style.borderColor = '#E24C4B',
						$event.currentTarget.style.boxShadow =
							'0 8px 24px rgba(226,76,75,0.12)'
					"
					@mouseout="
						$event.currentTarget.style.borderColor = '#E8E3DD',
						$event.currentTarget.style.boxShadow =
							'0 2px 8px rgba(33,33,33,0.04)'
					"
				>
					<div>
						<p
							class="text-[10px] font-black uppercase tracking-widest mb-0.5"
							style="color: #bbb"
						>
							{{ t("detail.next") ?? "Keyingi" }}
						</p>
						<p class="text-sm font-black" style="color: #212121">
							{{ getNeighborTitle(nextSlug) }}
						</p>
					</div>
					<div
						class="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0"
						style="border-color: #e8e3dd; color: #bbb"
						@mouseover="
							$event.currentTarget.style.background = '#E24C4B',
							$event.currentTarget.style.borderColor = '#E24C4B',
							$event.currentTarget.style.color = 'white'
						"
						@mouseout="
							$event.currentTarget.style.background = 'transparent',
							$event.currentTarget.style.borderColor = '#E8E3DD',
							$event.currentTarget.style.color = '#BBB'
						"
					>
						<svg
							class="w-4 h-4"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							viewBox="0 0 24 24"
						>
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</div>
				</NuxtLink>
			</div>
		</section>

		<!-- ══ FOOTER ══ -->
		<footer class="py-10 px-6" style="background: #212121">
			<div
				class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3"
			>
				<h2 class="font-black text-2xl tracking-tight" style="color: #e24c4b">
					WeEmpower.
				</h2>
				<p
					class="text-[10px] font-black uppercase tracking-[0.3em]"
					style="color: rgba(255, 255, 255, 0.2)"
				>
					{{ t("footer.copy") }}
				</p>
			</div>
		</footer>
	</main>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap");

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
</style>
