<script setup>
// definePageMeta({ middleware: 'admin-auth', layout: 'admin' })

const route = useRoute()
const slug = route.params.slug

const saving = ref(false)
const saved = ref(false)
const activeLang = ref("uz")

const LANGS = [
	{ code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
	{ code: "ru", label: "Русский", flag: "🇷🇺" },
	{ code: "en", label: "English", flag: "🇬🇧" },
]

// 3 tildagi ma'lumotlar — keyinchalik Supabase dan keladi
const formData = ref({
	uz: {
		title: "Xaritalash va tahlil",
		desc: "Fergana va Surxondaryo viloyatlarida NNT va ayollar guruhlari faoliyatini xaritalash.",
		sections: [
			{
				heading: "Maqsad",
				text: "Viloyatlardagi NNTlarni aniqlash va faoliyatlarini tahlil qilish.",
				list: [],
			},
			{
				heading: "Jarayon",
				text: "",
				list: [
					"Dala tadqiqotlari o'tkazish",
					"Ma'lumotlar bazasini yaratish",
					"Xaritalar tuzish",
				],
			},
		],
		results: [
			"40+ NNT aniqlandi",
			"2 ta viloyat qamrab olindi",
			"Ma'lumotlar bazasi yaratildi",
		],
	},
	ru: {
		title: "Картирование и анализ",
		desc: "Картирование деятельности НПО и женских групп в Ферганской и Сурхандарьинской областях.",
		sections: [
			{
				heading: "Цель",
				text: "Выявление НПО и анализ их деятельности в регионах.",
				list: [],
			},
			{
				heading: "Процесс",
				text: "",
				list: [
					"Проведение полевых исследований",
					"Создание базы данных",
					"Составление карт",
				],
			},
		],
		results: ["Выявлено 40+ НПО", "Охвачено 2 области", "Создана база данных"],
	},
	en: {
		title: "Mapping & Analysis",
		desc: "Mapping NGO and women's group activities in Fergana and Surkhandarya regions.",
		sections: [
			{
				heading: "Objective",
				text: "Identifying NGOs and analyzing their activities in the regions.",
				list: [],
			},
			{
				heading: "Process",
				text: "",
				list: [
					"Conducting field research",
					"Creating a database",
					"Drawing maps",
				],
			},
		],
		results: ["40+ NGOs identified", "2 regions covered", "Database created"],
	},
})

const currentData = computed(() => formData.value[activeLang.value])

// Section helpers
function addSection(lang) {
	formData.value[lang].sections.push({ heading: "", text: "", list: [] })
}
function removeSection(lang, i) {
	formData.value[lang].sections.splice(i, 1)
}
function addListItem(lang, si) {
	formData.value[lang].sections[si].list.push("")
}
function removeListItem(lang, si, li) {
	formData.value[lang].sections[si].list.splice(li, 1)
}
function addResult(lang) {
	formData.value[lang].results.push("")
}
function removeResult(lang, i) {
	formData.value[lang].results.splice(i, 1)
}

// Completion check per lang
function langCompletion(lang) {
	const d = formData.value[lang]
	const filled = [
		d.title,
		d.desc,
		...d.results,
		...d.sections.map(s => s.heading),
	].filter(Boolean).length
	const total = 2 + d.results.length + d.sections.length
	return Math.round((filled / total) * 100)
}

const supabase = useSupabaseClient()

// Yuklash
onMounted(async () => {
	const { data } = await supabase
		.from("tasks")
		.select("*")
		.eq("slug", slug)
		.single()

	if (data) {
		formData.value.uz = data.uz
		formData.value.ru = data.ru
		formData.value.en = data.en
	}
})

// Saqlash
async function handleSave() {
	saving.value = true

	const { error } = await supabase.from("tasks").upsert(
		{
			slug,
			uz: formData.value.uz,
			ru: formData.value.ru,
			en: formData.value.en,
		},
		{ onConflict: "slug" },
	)

	saving.value = false

	if (error) {
		alert("Xatolik: " + error.message)
		return
	}

	saved.value = true
	setTimeout(() => (saved.value = false), 3000)
}
</script>

<template>
	<div class="edit-root">
		<!-- TOPBAR -->
		<header class="topbar">
			<div class="topbar-left">
				<div class="topbar-logo">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="white">
						<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
					</svg>
				</div>
				<div>
					<span class="topbar-title">TARAQQIYOT</span>
					<span class="topbar-badge">Admin</span>
				</div>
			</div>
			<div class="topbar-right">
				<NuxtLink to="/admin" class="back-link">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M19 12H5M12 5l-7 7 7 7" />
					</svg>
					Dashboard
				</NuxtLink>
				<button
					class="save-btn"
					:class="{ saving, saved }"
					:disabled="saving"
					@click="handleSave"
				>
					<template v-if="saving">
						<span class="btn-spinner" />
						Saqlanmoqda...
					</template>
					<template v-else-if="saved">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
						Saqlandi!
					</template>
					<template v-else>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
							/>
							<polyline points="17 21 17 13 7 13 7 21" />
							<polyline points="7 3 7 8 15 8" />
						</svg>
						Saqlash
					</template>
				</button>
			</div>
		</header>

		<div class="edit-body">
			<!-- LEFT: form -->
			<div class="edit-main">
				<!-- Page title -->
				<div class="edit-page-header">
					<div class="edit-slug-badge">{{ slug }}</div>
					<h1 class="edit-page-title">Taskni tahrirlash</h1>
					<p class="edit-page-sub">3 tilda kontent kiritish</p>
				</div>

				<!-- Lang tabs -->
				<div class="lang-tabs">
					<button
						v-for="lang in LANGS"
						:key="lang.code"
						class="lang-tab"
						:class="{ active: activeLang === lang.code }"
						@click="activeLang = lang.code"
					>
						<span class="lang-flag">{{ lang.flag }}</span>
						<span class="lang-label">{{ lang.label }}</span>
						<span
							class="lang-progress"
							:style="{ '--p': langCompletion(lang.code) + '%' }"
						>
							{{ langCompletion(lang.code) }}%
						</span>
					</button>
				</div>

				<!-- Form panels — transition on lang switch -->
				<Transition name="panel" mode="out-in">
					<div :key="activeLang" class="form-panel">
						<!-- Title -->
						<div class="form-group">
							<label class="form-label">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path d="M4 6h16M4 12h8M4 18h16" />
								</svg>
								Sarlavha
							</label>
							<input
								v-model="formData[activeLang].title"
								type="text"
								class="form-input"
								:placeholder="`Sarlavha (${activeLang.toUpperCase()})`"
							/>
						</div>

						<!-- Desc -->
						<div class="form-group">
							<label class="form-label">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
									/>
								</svg>
								Qisqacha tavsif
							</label>
							<textarea
								v-model="formData[activeLang].desc"
								rows="3"
								class="form-input form-textarea"
								:placeholder="`Qisqacha tavsif (${activeLang.toUpperCase()})`"
							/>
						</div>

						<!-- Sections -->
						<div class="form-group">
							<div class="group-header">
								<label class="form-label">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
										/>
										<polyline points="14 2 14 8 20 8" />
									</svg>
									Bo'limlar
								</label>
								<button class="add-btn" @click="addSection(activeLang)">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
									>
										<line x1="12" y1="5" x2="12" y2="19" />
										<line x1="5" y1="12" x2="19" y2="12" />
									</svg>
									Bo'lim qo'shish
								</button>
							</div>

							<div class="sections-list">
								<div
									v-for="(section, si) in formData[activeLang].sections"
									:key="si"
									class="section-block"
								>
									<div class="section-header">
										<span class="section-num">{{ si + 1 }}</span>
										<input
											v-model="section.heading"
											type="text"
											class="section-heading-input"
											placeholder="Bo'lim sarlavhasi..."
										/>
										<button
											class="remove-btn"
											@click="removeSection(activeLang, si)"
										>
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
											>
												<polyline points="3 6 5 6 21 6" />
												<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
												<path
													d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"
												/>
											</svg>
										</button>
									</div>

									<textarea
										v-model="section.text"
										rows="2"
										class="form-input form-textarea section-text"
										placeholder="Matn (ixtiyoriy)..."
									/>

									<!-- List items -->
									<div class="list-items">
										<div
											v-for="(item, li) in section.list"
											:key="li"
											class="list-item-row"
										>
											<span class="list-dot" />
											<input
												v-model="section.list[li]"
												type="text"
												class="list-input"
												placeholder="Ro'yxat elementi..."
											/>
											<button
												class="icon-btn red"
												@click="removeListItem(activeLang, si, li)"
											>
												<svg
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
												>
													<line x1="18" y1="6" x2="6" y2="18" />
													<line x1="6" y1="6" x2="18" y2="18" />
												</svg>
											</button>
										</div>
										<button
											class="add-list-btn"
											@click="addListItem(activeLang, si)"
										>
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
											>
												<line x1="12" y1="5" x2="12" y2="19" />
												<line x1="5" y1="12" x2="19" y2="12" />
											</svg>
											Element qo'shish
										</button>
									</div>
								</div>

								<div
									v-if="!formData[activeLang].sections.length"
									class="empty-sections"
								>
									<p>Bo'lim yo'q. "Bo'lim qo'shish" tugmasini bosing.</p>
								</div>
							</div>
						</div>

						<!-- Results -->
						<div class="form-group">
							<div class="group-header">
								<label class="form-label">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
									</svg>
									Natijalar (sidebar)
								</label>
								<button class="add-btn" @click="addResult(activeLang)">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
									>
										<line x1="12" y1="5" x2="12" y2="19" />
										<line x1="5" y1="12" x2="19" y2="12" />
									</svg>
									Natija qo'shish
								</button>
							</div>

							<div class="results-list">
								<div
									v-for="(result, ri) in formData[activeLang].results"
									:key="ri"
									class="result-row"
								>
									<span class="result-num">{{ ri + 1 }}</span>
									<input
										v-model="formData[activeLang].results[ri]"
										type="text"
										class="list-input"
										placeholder="Natija matni..."
									/>
									<button
										class="icon-btn red"
										@click="removeResult(activeLang, ri)"
									>
										<svg
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<line x1="18" y1="6" x2="6" y2="18" />
											<line x1="6" y1="6" x2="18" y2="18" />
										</svg>
									</button>
								</div>
								<div
									v-if="!formData[activeLang].results.length"
									class="empty-sections"
								>
									<p>Natija yo'q.</p>
								</div>
							</div>
						</div>
					</div>
				</Transition>
			</div>

			<!-- RIGHT: preview sidebar -->
			<aside class="edit-sidebar">
				<div class="preview-card">
					<div class="preview-header">
						<span class="preview-label">Ko'rinish</span>
						<NuxtLink
							:to="`/projects/${slug}`"
							target="_blank"
							class="preview-link"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
								/>
							</svg>
							Ochish
						</NuxtLink>
					</div>

					<div class="preview-body">
						<div class="preview-title">{{ currentData.title || "—" }}</div>
						<p class="preview-desc">
							{{ currentData.desc || "Tavsif yo'q..." }}
						</p>

						<div v-if="currentData.results.length" class="preview-results">
							<p class="preview-results-label">Natijalar:</p>
							<div
								v-for="(r, i) in currentData.results"
								:key="i"
								class="preview-result"
							>
								<span class="pr-num">{{ i + 1 }}</span>
								<span>{{ r || "..." }}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- All langs completion -->
				<div class="completion-card">
					<p class="completion-title">Toʻldirilganlik</p>
					<div v-for="lang in LANGS" :key="lang.code" class="completion-row">
						<span class="completion-flag">{{ lang.flag }}</span>
						<div class="completion-bar-wrap">
							<div class="completion-bar">
								<div
									class="completion-fill"
									:style="{ width: langCompletion(lang.code) + '%' }"
								/>
							</div>
						</div>
						<span class="completion-pct">{{ langCompletion(lang.code) }}%</span>
					</div>
				</div>

				<!-- Slug info -->
				<div class="meta-card">
					<div class="meta-row">
						<span class="meta-key">Slug</span>
						<code class="meta-val">{{ slug }}</code>
					</div>
					<div class="meta-row">
						<span class="meta-key">Holat</span>
						<span class="status-badge published">Nashr</span>
					</div>
					<div class="meta-row">
						<span class="meta-key">Tillar</span>
						<span class="meta-val">UZ · RU · EN</span>
					</div>
				</div>
			</aside>
		</div>
	</div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;900&display=swap");
* {
	box-sizing: border-box;
}
.edit-root {
	font-family: "DM Sans", sans-serif;
	min-height: 100vh;
	background: #f8fafc;
	display: flex;
	flex-direction: column;
}

/* TOPBAR */
.topbar {
	height: 60px;
	background: #05080f;
	border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 1.5rem;
	position: sticky;
	top: 0;
	z-index: 100;
}
.topbar-left {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}
.topbar-logo {
	width: 34px;
	height: 34px;
	border-radius: 10px;
	background: linear-gradient(135deg, #1a56db, #7c3aed);
	display: flex;
	align-items: center;
	justify-content: center;
}
.topbar-title {
	color: #fff;
	font-weight: 900;
	font-size: 0.95rem;
	letter-spacing: 0.03em;
}
.topbar-badge {
	background: rgba(26, 86, 219, 0.25);
	color: #60a5fa;
	font-size: 0.6rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	padding: 0.2rem 0.6rem;
	border-radius: 20px;
	margin-left: 0.5rem;
	border: 1px solid rgba(26, 86, 219, 0.3);
}
.topbar-right {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}
.back-link {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	background: none;
	border: 1px solid rgba(255, 255, 255, 0.1);
	color: #64748b;
	padding: 0.4rem 0.9rem;
	border-radius: 8px;
	text-decoration: none;
	font-size: 0.75rem;
	font-weight: 700;
	transition: all 0.2s;
}
.back-link svg {
	width: 14px;
	height: 14px;
}
.back-link:hover {
	color: #94a3b8;
	border-color: rgba(255, 255, 255, 0.2);
}

.save-btn {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1.25rem;
	border-radius: 10px;
	border: none;
	cursor: pointer;
	font-size: 0.78rem;
	font-weight: 800;
	font-family: inherit;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	transition: all 0.2s;
	min-width: 130px;
	justify-content: center;
	background: linear-gradient(135deg, #1a56db, #1e40af);
	color: #fff;
	box-shadow: 0 4px 16px rgba(26, 86, 219, 0.35);
}
.save-btn:hover:not(:disabled) {
	transform: translateY(-1px);
	box-shadow: 0 8px 24px rgba(26, 86, 219, 0.45);
}
.save-btn:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}
.save-btn.saved {
	background: linear-gradient(135deg, #16a34a, #15803d);
	box-shadow: 0 4px 16px rgba(22, 163, 74, 0.3);
}
.save-btn svg {
	width: 14px;
	height: 14px;
}
.btn-spinner {
	width: 14px;
	height: 14px;
	border: 2px solid rgba(255, 255, 255, 0.3);
	border-top-color: #fff;
	border-radius: 50%;
	animation: spin 0.7s linear infinite;
}
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

/* BODY */
.edit-body {
	display: flex;
	flex: 1;
	min-height: calc(100vh - 60px);
	gap: 0;
}

/* MAIN */
.edit-main {
	flex: 1;
	padding: 2rem;
	overflow-y: auto;
	min-width: 0;
}

.edit-page-header {
	margin-bottom: 2rem;
}
.edit-slug-badge {
	display: inline-block;
	background: #05080f;
	color: #60a5fa;
	font-size: 0.65rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	padding: 0.3rem 0.8rem;
	border-radius: 20px;
	margin-bottom: 0.75rem;
	font-family: monospace;
}
.edit-page-title {
	font-size: 1.75rem;
	font-weight: 900;
	color: #0f172a;
	letter-spacing: -0.03em;
	margin-bottom: 0.25rem;
}
.edit-page-sub {
	color: #94a3b8;
	font-size: 0.8rem;
	font-weight: 600;
}

/* LANG TABS */
.lang-tabs {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 1.75rem;
	background: #fff;
	border: 1px solid #f1f5f9;
	border-radius: 16px;
	padding: 0.5rem;
}
.lang-tab {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.65rem 1rem;
	border-radius: 12px;
	border: none;
	cursor: pointer;
	font-family: inherit;
	font-size: 0.78rem;
	font-weight: 700;
	background: transparent;
	color: #94a3b8;
	transition: all 0.2s;
}
.lang-tab:hover {
	background: #f8fafc;
	color: #64748b;
}
.lang-tab.active {
	background: #05080f;
	color: #fff;
}
.lang-flag {
	font-size: 1rem;
}
.lang-label {
}
.lang-progress {
	font-size: 0.65rem;
	font-weight: 800;
	padding: 0.15rem 0.5rem;
	border-radius: 10px;
	background: rgba(26, 86, 219, 0.1);
	color: #1a56db;
}
.lang-tab.active .lang-progress {
	background: rgba(96, 165, 250, 0.2);
	color: #60a5fa;
}

/* PANEL TRANSITION */
.panel-enter-active,
.panel-leave-active {
	transition: all 0.25s ease;
}
.panel-enter-from {
	opacity: 0;
	transform: translateX(16px);
}
.panel-leave-to {
	opacity: 0;
	transform: translateX(-16px);
}

/* FORM */
.form-panel {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}
.form-group {
	background: #fff;
	border: 1px solid #f1f5f9;
	border-radius: 20px;
	padding: 1.5rem;
}
.group-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1rem;
}
.form-label {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.7rem;
	font-weight: 800;
	color: #64748b;
	text-transform: uppercase;
	letter-spacing: 0.12em;
	margin-bottom: 0.75rem;
}
.form-label svg {
	width: 14px;
	height: 14px;
}
.group-header .form-label {
	margin-bottom: 0;
}

.form-input {
	width: 100%;
	background: #f8fafc;
	border: 1.5px solid #f1f5f9;
	border-radius: 12px;
	padding: 0.8rem 1rem;
	font-size: 0.9rem;
	font-family: inherit;
	color: #0f172a;
	outline: none;
	transition:
		border-color 0.2s,
		background 0.2s;
}
.form-input:focus {
	border-color: #1a56db;
	background: #fff;
}
.form-input::placeholder {
	color: #cbd5e1;
}
.form-textarea {
	resize: vertical;
	min-height: 80px;
	line-height: 1.6;
}

/* SECTIONS */
.sections-list {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
.section-block {
	background: #f8fafc;
	border: 1px solid #f1f5f9;
	border-radius: 16px;
	padding: 1.25rem;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}
.section-header {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}
.section-num {
	width: 26px;
	height: 26px;
	border-radius: 8px;
	background: #05080f;
	color: #60a5fa;
	font-size: 0.7rem;
	font-weight: 900;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.section-heading-input {
	flex: 1;
	background: #fff;
	border: 1.5px solid #e2e8f0;
	border-radius: 10px;
	padding: 0.6rem 0.9rem;
	font-size: 0.85rem;
	font-family: inherit;
	font-weight: 700;
	color: #0f172a;
	outline: none;
	transition: border-color 0.2s;
}
.section-heading-input:focus {
	border-color: #1a56db;
}
.remove-btn {
	width: 32px;
	height: 32px;
	border-radius: 8px;
	border: none;
	background: none;
	cursor: pointer;
	color: #cbd5e1;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
	flex-shrink: 0;
}
.remove-btn svg {
	width: 15px;
	height: 15px;
}
.remove-btn:hover {
	background: #fee2e2;
	color: #ef4444;
}
.section-text {
	font-size: 0.85rem;
	min-height: 64px;
}

/* LIST */
.list-items {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding-left: 0.25rem;
}
.list-item-row {
	display: flex;
	align-items: center;
	gap: 0.6rem;
}
.list-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: #1a56db;
	flex-shrink: 0;
}
.list-input {
	flex: 1;
	background: #fff;
	border: 1.5px solid #e2e8f0;
	border-radius: 8px;
	padding: 0.5rem 0.75rem;
	font-size: 0.82rem;
	font-family: inherit;
	color: #0f172a;
	outline: none;
	transition: border-color 0.2s;
}
.list-input:focus {
	border-color: #1a56db;
}
.icon-btn {
	width: 28px;
	height: 28px;
	border-radius: 7px;
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
	flex-shrink: 0;
	background: none;
}
.icon-btn svg {
	width: 13px;
	height: 13px;
}
.icon-btn.red {
	color: #cbd5e1;
}
.icon-btn.red:hover {
	background: #fee2e2;
	color: #ef4444;
}

.add-list-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.4rem;
	background: none;
	border: 1.5px dashed #e2e8f0;
	color: #94a3b8;
	padding: 0.45rem 0.9rem;
	border-radius: 8px;
	cursor: pointer;
	font-size: 0.72rem;
	font-weight: 700;
	font-family: inherit;
	transition: all 0.2s;
	margin-top: 0.25rem;
}
.add-list-btn svg {
	width: 12px;
	height: 12px;
}
.add-list-btn:hover {
	border-color: #1a56db;
	color: #1a56db;
	background: #eff6ff;
}

.add-btn {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	background: #05080f;
	color: #60a5fa;
	padding: 0.45rem 1rem;
	border-radius: 10px;
	border: none;
	cursor: pointer;
	font-size: 0.72rem;
	font-weight: 800;
	font-family: inherit;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	transition: all 0.2s;
}
.add-btn svg {
	width: 12px;
	height: 12px;
}
.add-btn:hover {
	background: #1a56db;
	color: #fff;
}

/* RESULTS */
.results-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
.result-row {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}
.result-num {
	width: 26px;
	height: 26px;
	border-radius: 8px;
	background: #eff6ff;
	color: #1a56db;
	font-size: 0.7rem;
	font-weight: 900;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.empty-sections {
	padding: 1.5rem;
	text-align: center;
	color: #cbd5e1;
	font-size: 0.82rem;
	border: 2px dashed #f1f5f9;
	border-radius: 12px;
}

/* SIDEBAR */
.edit-sidebar {
	width: 320px;
	padding: 2rem 1.5rem 2rem 0;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	overflow-y: auto;
	position: sticky;
	top: 60px;
	height: calc(100vh - 60px);
}

.preview-card {
	background: #05080f;
	border-radius: 24px;
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.06);
}
.preview-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 1.25rem;
	border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.preview-label {
	color: #334155;
	font-size: 0.65rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.15em;
}
.preview-link {
	display: flex;
	align-items: center;
	gap: 0.3rem;
	color: #1a56db;
	font-size: 0.7rem;
	font-weight: 700;
	text-decoration: none;
	transition: color 0.2s;
}
.preview-link svg {
	width: 12px;
	height: 12px;
}
.preview-link:hover {
	color: #60a5fa;
}
.preview-body {
	padding: 1.25rem;
}
.preview-title {
	color: #fff;
	font-weight: 900;
	font-size: 1rem;
	margin-bottom: 0.5rem;
	letter-spacing: -0.01em;
}
.preview-desc {
	color: #475569;
	font-size: 0.78rem;
	line-height: 1.6;
	margin-bottom: 1rem;
}
.preview-results-label {
	color: #334155;
	font-size: 0.6rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	margin-bottom: 0.5rem;
}
.preview-result {
	display: flex;
	align-items: center;
	gap: 0.6rem;
	margin-bottom: 0.4rem;
}
.pr-num {
	width: 20px;
	height: 20px;
	border-radius: 6px;
	background: #1a56db;
	color: #fff;
	font-size: 0.6rem;
	font-weight: 900;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.preview-result span:last-child {
	color: #94a3b8;
	font-size: 0.75rem;
}

.completion-card {
	background: #fff;
	border: 1px solid #f1f5f9;
	border-radius: 18px;
	padding: 1.25rem;
}
.completion-title {
	font-size: 0.7rem;
	font-weight: 800;
	color: #94a3b8;
	text-transform: uppercase;
	letter-spacing: 0.12em;
	margin-bottom: 1rem;
}
.completion-row {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-bottom: 0.75rem;
}
.completion-row:last-child {
	margin-bottom: 0;
}
.completion-flag {
	font-size: 0.9rem;
}
.completion-bar-wrap {
	flex: 1;
}
.completion-bar {
	height: 5px;
	background: #f1f5f9;
	border-radius: 3px;
	overflow: hidden;
}
.completion-fill {
	height: 100%;
	background: linear-gradient(90deg, #1a56db, #7c3aed);
	border-radius: 3px;
	transition: width 0.5s ease;
}
.completion-pct {
	font-size: 0.7rem;
	font-weight: 800;
	color: #94a3b8;
	min-width: 32px;
	text-align: right;
}

.meta-card {
	background: #fff;
	border: 1px solid #f1f5f9;
	border-radius: 18px;
	padding: 1.25rem;
}
.meta-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.6rem 0;
	border-bottom: 1px solid #f8fafc;
}
.meta-row:last-child {
	border-bottom: none;
}
.meta-key {
	font-size: 0.7rem;
	font-weight: 700;
	color: #94a3b8;
	text-transform: uppercase;
	letter-spacing: 0.08em;
}
.meta-val {
	font-size: 0.78rem;
	font-weight: 700;
	color: #334155;
	font-family: monospace;
}
.status-badge {
	padding: 0.25rem 0.65rem;
	border-radius: 20px;
	font-size: 0.65rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.08em;
}
.status-badge.published {
	background: #f0fdf4;
	color: #16a34a;
}

@media (max-width: 1100px) {
	.edit-sidebar {
		display: none;
	}
}
</style>
