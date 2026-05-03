<script setup>
definePageMeta({ middleware: "admin-auth" })

const route = useRoute()
const slug = route.params.slug
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// ── HOLAT ─────────────────────────────────────────────────
const dbLoading = ref(true)
const dbError = ref(null)
const saving = ref(false)
const saved = ref(false)
const saveError = ref(null)

const activeLang = ref("uz")
const taskStatus = ref("draft")
const taskUpdatedAt = ref(null)

// Rasm
const imageUrl = ref(null)
const imageUploading = ref(false)
const imageError = ref(null)
const fileInput = ref(null)
const dragOver = ref(false)

const LANGS = [
	{ code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
	{ code: "ru", label: "Русский", flag: "🇷🇺" },
	{ code: "en", label: "English", flag: "🇬🇧" },
]

const formData = ref({
	uz: { title: "", desc: "", sections: [], results: [] },
	ru: { title: "", desc: "", sections: [], results: [] },
	en: { title: "", desc: "", sections: [], results: [] },
})

const currentData = computed(() => formData.value[activeLang.value])

// ── SUPABASE: YUKLASH ─────────────────────────────────────
async function fetchTask() {
	dbLoading.value = true
	dbError.value = null

	const { data, error } = await supabase
		.from("tasks")
		.select("*")
		.eq("slug", slug)
		.single()

	if (error) {
		dbError.value = error.message
	} else if (data) {
		formData.value.uz = data.uz ?? {
			title: "",
			desc: "",
			sections: [],
			results: [],
		}
		formData.value.ru = data.ru ?? {
			title: "",
			desc: "",
			sections: [],
			results: [],
		}
		formData.value.en = data.en ?? {
			title: "",
			desc: "",
			sections: [],
			results: [],
		}
		taskStatus.value = data.status ?? "draft"
		taskUpdatedAt.value = data.updated_at
		imageUrl.value = data.image_url ?? null
	}

	dbLoading.value = false
}

onMounted(fetchTask)

// ── RASM YUKLASH ──────────────────────────────────────────
async function uploadImage(file) {
	if (!file) return
	if (!file.type.startsWith("image/")) {
		imageError.value = "Faqat rasm fayllari qabul qilinadi (JPG, PNG, WebP)"
		setTimeout(() => (imageError.value = null), 4000)
		return
	}
	if (file.size > 5 * 1024 * 1024) {
		imageError.value = "Fayl hajmi 5 MB dan oshmasligi kerak"
		setTimeout(() => (imageError.value = null), 4000)
		return
	}

	imageUploading.value = true
	imageError.value = null

	// Avvalgi rasmni o'chirish
	if (imageUrl.value) {
		const oldPath = imageUrl.value.split("/task-images/")[1]
		if (oldPath) await supabase.storage.from("task-images").remove([oldPath])
	}

	const ext = file.name.split(".").pop()
	const fileName = `${slug}-${Date.now()}.${ext}`

	const { error: uploadError } = await supabase.storage
		.from("task-images")
		.upload(fileName, file, { upsert: true, contentType: file.type })

	if (uploadError) {
		imageError.value = uploadError.message
		imageUploading.value = false
		return
	}

	const { data: urlData } = supabase.storage
		.from("task-images")
		.getPublicUrl(fileName)

	imageUrl.value = urlData.publicUrl

	// Bazaga yozish
	await supabase
		.from("tasks")
		.update({ image_url: imageUrl.value })
		.eq("slug", slug)

	imageUploading.value = false
}

async function removeImage() {
	if (!imageUrl.value) return
	const path = imageUrl.value.split("/task-images/")[1]
	if (path) await supabase.storage.from("task-images").remove([path])
	await supabase.from("tasks").update({ image_url: null }).eq("slug", slug)
	imageUrl.value = null
}

function onFileChange(e) {
	uploadImage(e.target.files[0])
	e.target.value = ""
}

function onDrop(e) {
	dragOver.value = false
	uploadImage(e.dataTransfer.files[0])
}

// ── SAQLASH ───────────────────────────────────────────────
async function handleSave() {
	saving.value = true
	saveError.value = null

	const { error } = await supabase.from("tasks").upsert(
		{
			slug,
			status: taskStatus.value,
			uz: formData.value.uz,
			ru: formData.value.ru,
			en: formData.value.en,
			image_url: imageUrl.value,
			updated_at: new Date().toISOString(),
		},
		{ onConflict: "slug" },
	)

	saving.value = false

	if (error) {
		saveError.value = error.message
		setTimeout(() => (saveError.value = null), 5000)
		return
	}

	taskUpdatedAt.value = new Date().toISOString()
	saved.value = true
	setTimeout(() => (saved.value = false), 3000)
}

function formatDate(d) {
	if (!d) return "—"
	return new Date(d).toLocaleDateString("uz-UZ", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	})
}

async function logout() {
	await supabase.auth.signOut()
	await navigateTo("/admin/login")
}

// ── SECTION HELPERS ───────────────────────────────────────
function addSection(lang) {
  const data = formData.value[lang]
  if (!data) return  // ❌ lang yo'q — chiqib ket

  if (!Array.isArray(data.sections)) {
    data.sections = []  // sections yo'q bo'lsa — yaratib ol
  }

  data.sections.push({ heading: '', text: '', list: [] })
}
function removeSection(lang, i) {
	formData.value[lang].sections.splice(i, 1)
}
function addListItem(lang, si) {
  const section = formData.value[lang]?.sections?.[si]
  if (!section) return

  section.list ??= []
  section.list.push('')
}
function removeListItem(lang, si, li) {
	formData.value[lang].sections[si].list.splice(li, 1)
}
function addResult(lang) {
  const data = formData.value[lang]
  if (!data) return

  data.results ??= []
  data.results.push('')
}
function removeResult(lang, i) {
	formData.value[lang].results.splice(i, 1)
}

function langCompletion(lang) {
  const d = formData.value[lang]
  if (!d) return 0

  const results  = Array.isArray(d.results)  ? d.results  : []
  const sections = Array.isArray(d.sections) ? d.sections : []

  const notEmpty = (v) => typeof v === 'string' ? v.trim().length > 0 : Boolean(v)

  const filled = [
    d.title,
    d.desc,
    ...results,
    ...sections.map(s => s.heading),
  ].filter(notEmpty).length

  const total = 2 + results.length + sections.length

  return total <= 2 && filled === 0 ? 0 : Math.round((filled / total) * 100)
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
				<div class="topbar-user">
					<div class="user-avatar">
						{{ user?.email?.[0]?.toUpperCase() ?? "A" }}
					</div>
					<span class="user-name">{{ user?.email ?? "Admin" }}</span>
				</div>
				<NuxtLink to="/admin/tasks" class="back-link">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M19 12H5M12 5l-7 7 7 7" />
					</svg>
					Tasklar
				</NuxtLink>
				<Transition name="err">
					<div v-if="saveError" class="save-error-toast">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
						{{ saveError }}
					</div>
				</Transition>
				<button
					class="save-btn"
					:class="{ saving, saved }"
					:disabled="saving || dbLoading"
					@click="handleSave"
				>
					<template v-if="saving"
						><span class="btn-spinner" /> Saqlanmoqda...</template
					>
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
			<div class="edit-main">
				<!-- Loading -->
				<template v-if="dbLoading">
					<div class="skeleton-title" />
					<div class="skeleton-image" />
					<div class="skeleton-tabs" />
					<div class="skeleton-panel">
						<div v-for="n in 3" :key="n" class="skeleton-block" />
					</div>
				</template>

				<!-- DB xato -->
				<div v-else-if="dbError" class="db-error">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
					<div>
						<p class="db-error-title">Taskni yuklashda xato</p>
						<p class="db-error-msg">{{ dbError }}</p>
						<button class="retry-btn" @click="fetchTask">Qayta urinish</button>
					</div>
				</div>

				<template v-else>
					<!-- Page header -->
					<div class="edit-page-header">
						<div class="edit-slug-badge">{{ slug }}</div>
						<h1 class="edit-page-title">Taskni tahrirlash</h1>
						<p class="edit-page-sub">3 tilda kontent kiritish</p>
					</div>

					<!-- ══ RASM YUKLASH ══ -->
					<div class="form-group">
						<div class="group-header">
							<label class="form-label">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" />
									<circle cx="8.5" cy="8.5" r="1.5" />
									<polyline points="21 15 16 10 5 21" />
								</svg>
								Asosiy rasm
							</label>
							<span class="img-hint"
								>JPG · PNG · WebP &nbsp;·&nbsp; max 5 MB</span
							>
						</div>

						<!-- Rasm bor -->
						<div v-if="imageUrl" class="img-preview-wrap">
							<img :src="imageUrl" class="img-preview" alt="Task rasmi" />
							<!-- Overlay tugmalar -->
							<div class="img-overlay">
								<button class="img-btn replace" @click="fileInput.click()">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
										<polyline points="17 8 12 3 7 8" />
										<line x1="12" y1="3" x2="12" y2="15" />
									</svg>
									Almashtirish
								</button>
								<button class="img-btn del" @click="removeImage">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<polyline points="3 6 5 6 21 6" />
										<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
									</svg>
									O'chirish
								</button>
							</div>
							<!-- Yuklash overlay -->
							<div v-if="imageUploading" class="img-uploading">
								<span class="spin-lg" />
								<span>Yuklanmoqda...</span>
							</div>
						</div>

						<!-- Rasm yo'q — drag zone -->
						<div
							v-else
							class="upload-zone"
							:class="{ 'dz-over': dragOver, 'dz-loading': imageUploading }"
							@click="!imageUploading && fileInput.click()"
							@dragover.prevent="dragOver = true"
							@dragleave.prevent="dragOver = false"
							@drop.prevent="onDrop"
						>
							<template v-if="!imageUploading">
								<div class="uz-icon">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
									>
										<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
										<polyline points="17 8 12 3 7 8" />
										<line x1="12" y1="3" x2="12" y2="15" />
									</svg>
								</div>
								<p class="uz-title">Rasm yuklash</p>
								<p class="uz-sub">Bosing yoki bu yerga sudrab tashlang</p>
							</template>
							<template v-else>
								<span class="spin-lg" />
								<p class="uz-title">Yuklanmoqda...</p>
							</template>
						</div>

						<input
							ref="fileInput"
							type="file"
							accept="image/*"
							style="display: none"
							@change="onFileChange"
						/>

						<Transition name="err">
							<div v-if="imageError" class="img-err">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<circle cx="12" cy="12" r="10" />
									<line x1="12" y1="8" x2="12" y2="12" />
									<line x1="12" y1="16" x2="12.01" y2="16" />
								</svg>
								{{ imageError }}
							</div>
						</Transition>
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
							<span>{{ lang.label }}</span>
							<span class="lang-pct">{{ langCompletion(lang.code) }}%</span>
						</button>
					</div>

					<!-- Form panels -->
					<Transition name="panel" mode="out-in">
						<div :key="activeLang" class="form-panel">
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
													<path
														d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
													/>
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
										v-if="!formData[activeLang].sections?.length"
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
										v-if="!formData[activeLang].results?.length"
										class="empty-sections"
									>
										<p>Natija yo'q.</p>
									</div>
								</div>
							</div>
						</div>
					</Transition>
				</template>
			</div>

			<!-- SIDEBAR -->
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

					<!-- Rasm thumbnail -->
					<div class="sidebar-img-wrap">
						<img
							v-if="imageUrl"
							:src="imageUrl"
							class="sidebar-img"
							alt="preview"
						/>
						<div v-else class="sidebar-img-empty">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<rect x="3" y="3" width="18" height="18" rx="2" />
								<circle cx="8.5" cy="8.5" r="1.5" />
								<polyline points="21 15 16 10 5 21" />
							</svg>
							<span>Rasm yuklanmagan</span>
						</div>
					</div>

					<div v-if="!dbLoading" class="preview-body">
						<div class="preview-title">{{ currentData.title || "—" }}</div>
						<p class="preview-desc">
							{{ currentData.desc || "Tavsif yo'q..." }}
						</p>
						<div v-if="currentData.results?.length" class="preview-results">
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

				<div class="completion-card">
					<p class="completion-title">To'ldirilganlik</p>
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

				<div class="meta-card">
					<div class="meta-row">
						<span class="meta-key">Slug</span>
						<code class="meta-val">{{ slug }}</code>
					</div>
					<div class="meta-row">
						<span class="meta-key">Rasm</span>
						<span
							class="meta-val"
							:style="{ color: imageUrl ? '#16a34a' : '#94a3b8' }"
						>
							{{ imageUrl ? "Yuklangan ✓" : "Yuklanmagan" }}
						</span>
					</div>
					<div class="meta-row">
						<span class="meta-key">Holat</span>
						<div class="status-toggle">
							<button
								class="stoggle-btn"
								:class="{ active: taskStatus === 'draft' }"
								:disabled="dbLoading"
								@click="taskStatus = 'draft'"
							>
								<span class="sdot amber" /> Qoralama
							</button>
							<button
								class="stoggle-btn"
								:class="{ active: taskStatus === 'published' }"
								:disabled="dbLoading"
								@click="taskStatus = 'published'"
							>
								<span class="sdot green" /> Nashr
							</button>
						</div>
					</div>
					<div class="meta-row">
						<span class="meta-key">Tillar</span>
						<span class="meta-val">UZ · RU · EN</span>
					</div>
					<div class="meta-row">
						<span class="meta-key">Yangilangan</span>
						<span class="meta-val">{{ formatDate(taskUpdatedAt) }}</span>
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
.topbar-user {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}
.user-avatar {
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background: linear-gradient(135deg, #1a56db, #7c3aed);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 0.7rem;
	font-weight: 900;
}
.user-name {
	color: #94a3b8;
	font-size: 0.8rem;
	font-weight: 600;
	max-width: 160px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
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
.save-error-toast {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	background: #fef2f2;
	border: 1px solid #fecaca;
	color: #dc2626;
	padding: 0.45rem 0.85rem;
	border-radius: 8px;
	font-size: 0.72rem;
	font-weight: 700;
	max-width: 280px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.save-error-toast svg {
	width: 13px;
	height: 13px;
	flex-shrink: 0;
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

.edit-body {
	display: flex;
	flex: 1;
	min-height: calc(100vh - 60px);
}
.edit-main {
	flex: 1;
	padding: 2rem;
	overflow-y: auto;
	min-width: 0;
}

/* SKELETON */
.skeleton-title {
	height: 80px;
	background: #e2e8f0;
	border-radius: 12px;
	margin-bottom: 1.5rem;
	animation: skpulse 1.5s ease-in-out infinite;
}
.skeleton-image {
	height: 200px;
	background: #e2e8f0;
	border-radius: 20px;
	margin-bottom: 1.5rem;
	animation: skpulse 1.5s ease-in-out infinite;
}
.skeleton-tabs {
	height: 56px;
	background: #e2e8f0;
	border-radius: 16px;
	margin-bottom: 1.75rem;
	animation: skpulse 1.5s ease-in-out infinite;
}
.skeleton-panel {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}
.skeleton-block {
	height: 120px;
	background: #e2e8f0;
	border-radius: 20px;
	animation: skpulse 1.5s ease-in-out infinite;
}
@keyframes skpulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.4;
	}
}

.db-error {
	display: flex;
	align-items: flex-start;
	gap: 1rem;
	background: #fef2f2;
	border: 1px solid #fecaca;
	border-radius: 16px;
	padding: 1.5rem;
}
.db-error > svg {
	width: 22px;
	height: 22px;
	color: #ef4444;
	flex-shrink: 0;
	margin-top: 2px;
}
.db-error-title {
	font-size: 0.9rem;
	font-weight: 800;
	color: #dc2626;
	margin-bottom: 0.25rem;
}
.db-error-msg {
	font-size: 0.78rem;
	color: #ef4444;
	font-family: monospace;
	margin-bottom: 0.75rem;
}
.retry-btn {
	background: #dc2626;
	color: #fff;
	border: none;
	padding: 0.45rem 1rem;
	border-radius: 8px;
	font-size: 0.75rem;
	font-weight: 700;
	font-family: inherit;
	cursor: pointer;
	transition: background 0.2s;
}
.retry-btn:hover {
	background: #b91c1c;
}

.edit-page-header {
	margin-bottom: 1.75rem;
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

/* ── RASM ── */
.img-hint {
	font-size: 0.68rem;
	color: #94a3b8;
	font-weight: 600;
}

.upload-zone {
	border: 2px dashed #e2e8f0;
	border-radius: 16px;
	padding: 2.5rem 1.5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	cursor: pointer;
	transition: all 0.2s;
	background: #f8fafc;
	min-height: 168px;
}
.upload-zone:hover,
.upload-zone.dz-over {
	border-color: #1a56db;
	background: #eff6ff;
}
.upload-zone.dz-loading {
	pointer-events: none;
	cursor: default;
}
.uz-icon {
	width: 52px;
	height: 52px;
	border-radius: 16px;
	background: #fff;
	border: 1px solid #f1f5f9;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #94a3b8;
}
.uz-icon svg {
	width: 24px;
	height: 24px;
}
.uz-title {
	font-size: 0.9rem;
	font-weight: 800;
	color: #334155;
}
.uz-sub {
	font-size: 0.75rem;
	color: #94a3b8;
}
.spin-lg {
	width: 32px;
	height: 32px;
	border: 3px solid rgba(26, 86, 219, 0.2);
	border-top-color: #1a56db;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

.img-preview-wrap {
	position: relative;
	border-radius: 14px;
	overflow: hidden;
	background: #f1f5f9;
}
.img-preview {
	width: 100%;
	max-height: 280px;
	object-fit: cover;
	display: block;
}
.img-overlay {
	position: absolute;
	inset: 0;
	background: rgba(5, 8, 15, 0.65);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	opacity: 0;
	transition: opacity 0.2s;
}
.img-preview-wrap:hover .img-overlay {
	opacity: 1;
}
.img-btn {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.55rem 1rem;
	border-radius: 10px;
	border: none;
	cursor: pointer;
	font-size: 0.72rem;
	font-weight: 800;
	font-family: inherit;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	transition: all 0.2s;
}
.img-btn svg {
	width: 13px;
	height: 13px;
}
.img-btn.replace {
	background: #fff;
	color: #0f172a;
}
.img-btn.replace:hover {
	background: #eff6ff;
	color: #1a56db;
}
.img-btn.del {
	background: #fee2e2;
	color: #dc2626;
}
.img-btn.del:hover {
	background: #dc2626;
	color: #fff;
}
.img-uploading {
	position: absolute;
	inset: 0;
	background: rgba(5, 8, 15, 0.75);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	color: #fff;
	font-size: 0.82rem;
	font-weight: 700;
}

.img-err {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background: #fef2f2;
	border: 1px solid #fecaca;
	border-radius: 10px;
	padding: 0.65rem 0.9rem;
	color: #dc2626;
	font-size: 0.78rem;
	font-weight: 600;
	margin-top: 0.75rem;
}
.img-err svg {
	width: 14px;
	height: 14px;
	flex-shrink: 0;
}

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
.lang-pct {
	font-size: 0.65rem;
	font-weight: 800;
	padding: 0.15rem 0.5rem;
	border-radius: 10px;
	background: rgba(26, 86, 219, 0.1);
	color: #1a56db;
}
.lang-tab.active .lang-pct {
	background: rgba(96, 165, 250, 0.2);
	color: #60a5fa;
}

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

.sidebar-img-wrap {
	width: 100%;
	aspect-ratio: 16/9;
	overflow: hidden;
	background: #0c1220;
	display: flex;
	align-items: center;
	justify-content: center;
}
.sidebar-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}
.sidebar-img-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	color: #1e293b;
}
.sidebar-img-empty svg {
	width: 28px;
	height: 28px;
}
.sidebar-img-empty span {
	font-size: 0.68rem;
	font-weight: 700;
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
	padding: 0.65rem 0;
	border-bottom: 1px solid #f8fafc;
	gap: 0.5rem;
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
	flex-shrink: 0;
}
.meta-val {
	font-size: 0.78rem;
	font-weight: 700;
	color: #334155;
	font-family: monospace;
	text-align: right;
}
.status-toggle {
	display: flex;
	gap: 0.35rem;
}
.stoggle-btn {
	display: flex;
	align-items: center;
	gap: 0.35rem;
	padding: 0.3rem 0.65rem;
	border-radius: 8px;
	border: 1.5px solid #f1f5f9;
	background: #f8fafc;
	cursor: pointer;
	font-size: 0.65rem;
	font-weight: 700;
	font-family: inherit;
	color: #94a3b8;
	transition: all 0.2s;
}
.stoggle-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}
.stoggle-btn.active {
	border-color: #1a56db;
	background: #eff6ff;
	color: #1a56db;
}
.sdot {
	width: 7px;
	height: 7px;
	border-radius: 50%;
}
.sdot.amber {
	background: #f59e0b;
}
.sdot.green {
	background: #22c55e;
}

.err-enter-active,
.err-leave-active {
	transition: all 0.25s;
}
.err-enter-from,
.err-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}

@media (max-width: 1100px) {
	.edit-sidebar {
		display: none;
	}
	.user-name {
		display: none;
	}
}
</style>
