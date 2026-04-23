<script setup>
// definePageMeta({ middleware: 'admin-auth', layout: 'admin' })

const tasks = ref([
	{
		slug: "xaritalash",
		uz: "Xaritalash va tahlil",
		ru: "Картирование",
		en: "Mapping & Analysis",
		updatedAt: "2025-01-15",
		status: "published",
	},
	{
		slug: "hamkorlik",
		uz: "Hamkorlik tarmog'i",
		ru: "Сеть партнёрств",
		en: "Partnership Network",
		updatedAt: "2025-01-14",
		status: "published",
	},
	{
		slug: "salohiyat",
		uz: "Salohiyatni oshirish",
		ru: "Повышение потенциала",
		en: "Capacity Building",
		updatedAt: "2025-01-10",
		status: "published",
	},
	{
		slug: "advokatsiya",
		uz: "Advokatsiya",
		ru: "Адвокатирование",
		en: "Advocacy",
		updatedAt: "2025-01-08",
		status: "draft",
	},
	{
		slug: "toolkit",
		uz: "Toolkit ishlab chiqish",
		ru: "Разработка инструментов",
		en: "Toolkit Development",
		updatedAt: "2025-01-05",
		status: "published",
	},
	{
		slug: "rivojlanish",
		uz: "Barqaror rivojlanish",
		ru: "Устойчивое развитие",
		en: "Sustainable Development",
		updatedAt: "2024-12-28",
		status: "published",
	},
])

// Filter
const filterStatus = ref("all") // all | published | draft
const searchQuery = ref("")

const filteredTasks = computed(() => {
	return tasks.value.filter(t => {
		const matchStatus =
			filterStatus.value === "all" || t.status === filterStatus.value
		const q = searchQuery.value.toLowerCase()
		const matchSearch =
			!q ||
			t.uz.toLowerCase().includes(q) ||
			t.slug.includes(q) ||
			(t.ru && t.ru.toLowerCase().includes(q))
		return matchStatus && matchSearch
	})
})

function formatDate(d) {
	return new Date(d).toLocaleDateString("uz-UZ", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	})
}

async function logout() {
	navigateTo("/admin/login")
}

// ── YANGI TASK ───────────────────────────────────────────
const showAddModal = ref(false)
const addLoading = ref(false)
const addForm = ref({ slug: "", uz: "", ru: "", en: "", status: "draft" })
const addError = ref("")

function openAddModal() {
	addForm.value = { slug: "", uz: "", ru: "", en: "", status: "draft" }
	addError.value = ""
	showAddModal.value = true
}
function closeAddModal() {
	showAddModal.value = false
}

watch(
	() => addForm.value.uz,
	val => {
		addForm.value.slug = val
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "")
			.slice(0, 40)
	},
)

async function handleAdd() {
	if (!addForm.value.slug || !addForm.value.uz) {
		addError.value = "Slug va UZ sarlavha majburiy"
		return
	}
	if (tasks.value.find(t => t.slug === addForm.value.slug)) {
		addError.value = "Bu slug allaqachon mavjud"
		return
	}
	addLoading.value = true
	// TODO: await supabase.from('tasks').insert({...})
	await new Promise(r => setTimeout(r, 800))
	tasks.value.unshift({
		slug: addForm.value.slug,
		uz: addForm.value.uz,
		ru: addForm.value.ru,
		en: addForm.value.en,
		status: addForm.value.status,
		updatedAt: new Date().toISOString(),
	})
	addLoading.value = false
	closeAddModal()
	navigateTo(`/admin/tasks/${addForm.value.slug}`)
}

// ── O'CHIRISH ────────────────────────────────────────────
const deleteTarget = ref(null)
const deleteLoading = ref(false)

function openDeleteModal(task) {
	deleteTarget.value = task
}
function closeDeleteModal() {
	deleteTarget.value = null
}

async function handleDelete() {
	if (!deleteTarget.value) return
	deleteLoading.value = true
	// TODO: await supabase.from('tasks').delete().eq('slug', deleteTarget.value.slug)
	await new Promise(r => setTimeout(r, 700))
	tasks.value = tasks.value.filter(t => t.slug !== deleteTarget.value.slug)
	deleteLoading.value = false
	closeDeleteModal()
}
</script>

<template>
	<div class="dash">
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
					<div class="user-avatar">A</div>
					<span class="user-name">Admin</span>
				</div>
				<button class="logout-btn" @click="logout">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
						/>
					</svg>
					Chiqish
				</button>
			</div>
		</header>

		<div class="dash-body">
			<!-- SIDEBAR -->
			<aside class="sidebar">
				<nav class="sidebar-nav">
					<NuxtLink to="/admin" class="nav-item">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect x="3" y="3" width="7" height="7" />
							<rect x="14" y="3" width="7" height="7" />
							<rect x="14" y="14" width="7" height="7" />
							<rect x="3" y="14" width="7" height="7" />
						</svg>
						Dashboard
					</NuxtLink>
					<NuxtLink to="/admin/tasks" class="nav-item active">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
							<polyline points="14 2 14 8 20 8" />
							<line x1="16" y1="13" x2="8" y2="13" />
							<line x1="16" y1="17" x2="8" y2="17" />
						</svg>
						Tasklar
					</NuxtLink>
					<NuxtLink to="/admin/reels" class="nav-item">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<polygon points="23 7 16 12 23 17 23 7" />
							<rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
						</svg>
						Reels
					</NuxtLink>
				</nav>
				<div class="sidebar-info">
					<span class="info-dot" :class="dbError ? 'dot-error' : 'dot-ok'" />
					<span>{{ dbError ? "Ulanishda xato" : "Supabase ulangan" }}</span>
				</div>
			</aside>

			<!-- MAIN -->
			<main class="dash-main">
				<div class="page-header">
					<div>
						<p class="page-eyebrow">Kontent boshqaruvi</p>
						<h1 class="page-title">Tasklar</h1>
					</div>
					<button class="new-task-btn" @click="openAddModal">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
						>
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
						Yangi task
					</button>
				</div>

				<!-- Toolbar: search + filter -->
				<div class="toolbar">
					<div class="search-wrap">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="11" cy="11" r="8" />
							<line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
						<input
							v-model="searchQuery"
							type="text"
							class="search-input"
							placeholder="Task nomi yoki slug bo'yicha qidirish..."
						/>
						<button
							v-if="searchQuery"
							class="search-clear"
							@click="searchQuery = ''"
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

					<div class="filter-tabs">
						<button
							v-for="f in [
								{ key: 'all', label: 'Barchasi' },
								{ key: 'published', label: 'Nashr' },
								{ key: 'draft', label: 'Qoralama' },
							]"
							:key="f.key"
							class="filter-tab"
							:class="{ active: filterStatus === f.key }"
							@click="filterStatus = f.key"
						>
							{{ f.label }}
							<span class="filter-count">
								{{
									f.key === "all"
										? tasks.length
										: tasks.filter(t => t.status === f.key).length
								}}
							</span>
						</button>
					</div>
				</div>

				<!-- Table -->
				<div class="table-card">
					<div class="task-list">
						<TransitionGroup name="tl">
							<div
								v-for="(task, i) in filteredTasks"
								:key="task.slug"
								class="task-row"
								:style="{ animationDelay: `${i * 50}ms` }"
							>
								<div class="task-num">{{ String(i + 1).padStart(2, "0") }}</div>

								<div class="task-info">
									<div class="task-title-uz">{{ task.uz }}</div>
									<div class="task-langs">
										<span class="tlang"
											><span class="ldot ru">RU</span>
											{{ task.ru || "—" }}</span
										>
										<span class="tlang"
											><span class="ldot en">EN</span>
											{{ task.en || "—" }}</span
										>
									</div>
								</div>

								<div class="task-slug">{{ task.slug }}</div>
								<div class="task-date">{{ formatDate(task.updatedAt) }}</div>

								<div class="task-status">
									<span :class="['status-badge', task.status]">
										{{ task.status === "published" ? "Nashr" : "Qoralama" }}
									</span>
								</div>

								<div class="task-actions">
									<NuxtLink
										:to="`/admin/tasks/${task.slug}`"
										class="act-btn edit"
									>
										<svg
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
											/>
											<path
												d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
											/>
										</svg>
										Tahrirlash
									</NuxtLink>
									<NuxtLink
										:to="`/projects/${task.slug}`"
										target="_blank"
										class="act-btn view"
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
										Ko'rish
									</NuxtLink>
									<button class="act-btn delete" @click="openDeleteModal(task)">
										<svg
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<polyline points="3 6 5 6 21 6" />
											<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
											<path d="M10 11v6M14 11v6" />
										</svg>
										O'chirish
									</button>
								</div>
							</div>
						</TransitionGroup>

						<!-- Qidiruv natijasi bo'sh -->
						<div v-if="filteredTasks.length === 0" class="empty-state">
							<div class="empty-icon">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
								>
									<circle cx="11" cy="11" r="8" />
									<line x1="21" y1="21" x2="16.65" y2="16.65" />
								</svg>
							</div>
							<p class="empty-title">
								{{ searchQuery ? `"${searchQuery}" topilmadi` : "Task yo'q" }}
							</p>
							<p class="empty-sub">
								{{
									searchQuery
										? "Boshqa kalit so'z bilan qidiring"
										: "Yangi task qo'shish uchun tugmani bosing"
								}}
							</p>
							<button
								v-if="!searchQuery"
								class="empty-btn"
								@click="openAddModal"
							>
								Task qo'shish
							</button>
							<button v-else class="empty-btn" @click="searchQuery = ''">
								Tozalash
							</button>
						</div>
					</div>

					<!-- Table footer -->
					<div v-if="filteredTasks.length > 0" class="table-footer">
						<span>{{ filteredTasks.length }} ta task ko'rsatilmoqda</span>
						<div class="lang-pills">
							<span class="lang-pill active">UZ</span>
							<span class="lang-pill">RU</span>
							<span class="lang-pill">EN</span>
						</div>
					</div>
				</div>
			</main>
		</div>

		<!-- ══ YANGI TASK MODAL ══ -->
		<Transition name="overlay">
			<div
				v-if="showAddModal"
				class="modal-overlay"
				@click.self="closeAddModal"
			>
				<Transition name="mscale">
					<div v-if="showAddModal" class="modal">
						<div class="modal-header">
							<div>
								<h3 class="modal-title">Yangi task qo'shish</h3>
								<p class="modal-sub">
									Asosiy ma'lumotlarni kiriting, qolganini keyinchalik
									to'ldirish mumkin
								</p>
							</div>
							<button class="modal-close" @click="closeAddModal">
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

						<div class="modal-body">
							<div class="mfield">
								<label class="mfield-label"
									><span class="ldot uz">UZ</span> O'zbekcha sarlavha
									<span class="req">*</span></label
								>
								<input
									v-model="addForm.uz"
									type="text"
									class="mfield-input"
									placeholder="Masalan: Xaritalash va tahlil"
									autofocus
								/>
							</div>

							<div class="mfield">
								<label class="mfield-label">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										style="width: 13px; height: 13px"
									>
										<path
											d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
										/>
										<path
											d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
										/>
									</svg>
									Slug <span class="req">*</span>
								</label>
								<div class="slug-wrap">
									<span class="slug-prefix">/projects/</span>
									<input
										v-model="addForm.slug"
										type="text"
										class="slug-input"
										placeholder="xaritalash"
									/>
								</div>
								<p class="mfield-hint">
									Avtomatik to'ldiriladi. Faqat kichik harf, raqam, tire.
								</p>
							</div>

							<div class="mfield">
								<label class="mfield-label"
									><span class="ldot ru">RU</span> Ruscha sarlavha</label
								>
								<input
									v-model="addForm.ru"
									type="text"
									class="mfield-input"
									placeholder="Масален: Картирование"
								/>
							</div>

							<div class="mfield">
								<label class="mfield-label"
									><span class="ldot en">EN</span> Inglizcha sarlavha</label
								>
								<input
									v-model="addForm.en"
									type="text"
									class="mfield-input"
									placeholder="Masalan: Mapping & Analysis"
								/>
							</div>

							<div class="mfield">
								<label class="mfield-label">Holat</label>
								<div class="stoggle">
									<button
										class="stoggle-btn"
										:class="{ active: addForm.status === 'draft' }"
										@click="addForm.status = 'draft'"
									>
										<span class="sdot amber" /> Qoralama
									</button>
									<button
										class="stoggle-btn"
										:class="{ active: addForm.status === 'published' }"
										@click="addForm.status = 'published'"
									>
										<span class="sdot green" /> Nashr
									</button>
								</div>
							</div>

							<Transition name="err">
								<div v-if="addError" class="merror">
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
									{{ addError }}
								</div>
							</Transition>
						</div>

						<div class="modal-footer">
							<button class="btn-cancel" @click="closeAddModal">
								Bekor qilish
							</button>
							<button
								class="btn-submit"
								:disabled="addLoading"
								@click="handleAdd"
							>
								<span
									v-if="!addLoading"
									style="display: flex; align-items: center; gap: 0.4rem"
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										style="width: 13px; height: 13px"
									>
										<line x1="12" y1="5" x2="12" y2="19" />
										<line x1="5" y1="12" x2="19" y2="12" />
									</svg>
									Yaratish va tahrirlashga o'tish
								</span>
								<span v-else class="spinner" />
							</button>
						</div>
					</div>
				</Transition>
			</div>
		</Transition>

		<!-- ══ O'CHIRISH MODAL ══ -->
		<Transition name="overlay">
			<div
				v-if="deleteTarget"
				class="modal-overlay"
				@click.self="closeDeleteModal"
			>
				<Transition name="mscale">
					<div v-if="deleteTarget" class="modal modal-sm">
						<div class="modal-header">
							<div class="del-icon">
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
							</div>
							<button class="modal-close" @click="closeDeleteModal">
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
						<div class="modal-body">
							<h3 class="del-title">Taskni o'chirishni tasdiqlang</h3>
							<p class="del-desc">
								<strong>{{ deleteTarget.uz }}</strong> va uning barcha
								tarjimalari (<code>{{ deleteTarget.slug }}</code
								>) o'chiriladi. Bu amalni qaytarib bo'lmaydi.
							</p>
						</div>
						<div class="modal-footer">
							<button class="btn-cancel" @click="closeDeleteModal">
								Bekor qilish
							</button>
							<button
								class="btn-delete"
								:disabled="deleteLoading"
								@click="handleDelete"
							>
								<span
									v-if="!deleteLoading"
									style="display: flex; align-items: center; gap: 0.4rem"
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										style="width: 13px; height: 13px"
									>
										<polyline points="3 6 5 6 21 6" />
										<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
									</svg>
									Ha, o'chirish
								</span>
								<span v-else class="spinner" />
							</button>
						</div>
					</div>
				</Transition>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;900&display=swap");
* {
	box-sizing: border-box;
}
.dash {
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
	gap: 1rem;
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
}
.logout-btn {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	background: none;
	border: 1px solid rgba(255, 255, 255, 0.1);
	color: #64748b;
	padding: 0.4rem 0.9rem;
	border-radius: 8px;
	cursor: pointer;
	font-size: 0.75rem;
	font-weight: 700;
	font-family: inherit;
	transition: all 0.2s;
}
.logout-btn svg {
	width: 14px;
	height: 14px;
}
.logout-btn:hover {
	color: #fff;
	border-color: rgba(255, 255, 255, 0.2);
}

.dash-body {
	display: flex;
	flex: 1;
	min-height: calc(100vh - 60px);
}

.sidebar {
	width: 220px;
	background: #05080f;
	border-right: 1px solid rgba(255, 255, 255, 0.06);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 1.5rem 1rem;
	position: sticky;
	top: 60px;
	height: calc(100vh - 60px);
}
.sidebar-nav {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}
.nav-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.7rem 1rem;
	border-radius: 12px;
	color: #475569;
	font-size: 0.8rem;
	font-weight: 700;
	text-decoration: none;
	transition: all 0.2s;
}
.nav-item svg {
	width: 16px;
	height: 16px;
}
.nav-item:hover {
	background: rgba(255, 255, 255, 0.05);
	color: #94a3b8;
}
.nav-item.active {
	background: rgba(26, 86, 219, 0.15);
	color: #60a5fa;
	border: 1px solid rgba(26, 86, 219, 0.2);
}
.sidebar-info {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.65rem;
	color: #1e3a5f;
	font-weight: 700;
}
.info-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: #1e3a5f;
}

.dash-main {
	flex: 1;
	padding: 2rem;
	overflow-y: auto;
}

.page-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1.5rem;
}
.page-eyebrow {
	font-size: 0.72rem;
	font-weight: 700;
	color: #94a3b8;
	text-transform: uppercase;
	letter-spacing: 0.12em;
	margin-bottom: 0.3rem;
}
.page-title {
	font-size: 1.75rem;
	font-weight: 900;
	color: #0f172a;
	letter-spacing: -0.03em;
}
.new-task-btn {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background: linear-gradient(135deg, #1a56db, #1e40af);
	color: #fff;
	padding: 0.65rem 1.25rem;
	border-radius: 12px;
	border: none;
	cursor: pointer;
	font-size: 0.78rem;
	font-weight: 800;
	font-family: inherit;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	box-shadow: 0 4px 16px rgba(26, 86, 219, 0.3);
	transition: all 0.2s;
}
.new-task-btn svg {
	width: 14px;
	height: 14px;
}
.new-task-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 24px rgba(26, 86, 219, 0.4);
}

/* TOOLBAR */
.toolbar {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1.25rem;
	flex-wrap: wrap;
}
.search-wrap {
	flex: 1;
	min-width: 240px;
	position: relative;
	display: flex;
	align-items: center;
}
.search-wrap > svg {
	position: absolute;
	left: 12px;
	width: 15px;
	height: 15px;
	color: #94a3b8;
	pointer-events: none;
}
.search-input {
	width: 100%;
	background: #fff;
	border: 1.5px solid #f1f5f9;
	border-radius: 12px;
	padding: 0.65rem 2.5rem 0.65rem 2.5rem;
	font-size: 0.85rem;
	font-family: inherit;
	color: #0f172a;
	outline: none;
	transition: border-color 0.2s;
}
.search-input:focus {
	border-color: #1a56db;
}
.search-input::placeholder {
	color: #cbd5e1;
}
.search-clear {
	position: absolute;
	right: 10px;
	background: none;
	border: none;
	cursor: pointer;
	color: #94a3b8;
	display: flex;
	align-items: center;
	padding: 4px;
	border-radius: 4px;
	transition: color 0.2s;
}
.search-clear svg {
	width: 13px;
	height: 13px;
}
.search-clear:hover {
	color: #334155;
}

.filter-tabs {
	display: flex;
	background: #fff;
	border: 1.5px solid #f1f5f9;
	border-radius: 12px;
	overflow: hidden;
}
.filter-tab {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.55rem 1rem;
	border: none;
	background: none;
	cursor: pointer;
	font-size: 0.75rem;
	font-weight: 700;
	font-family: inherit;
	color: #94a3b8;
	transition: all 0.2s;
	white-space: nowrap;
}
.filter-tab.active {
	background: #05080f;
	color: #60a5fa;
}
.filter-tab:not(.active):hover {
	background: #f8fafc;
	color: #334155;
}
.filter-count {
	background: rgba(0, 0, 0, 0.06);
	color: inherit;
	padding: 0.1rem 0.4rem;
	border-radius: 6px;
	font-size: 0.65rem;
	font-weight: 800;
}
.filter-tab.active .filter-count {
	background: rgba(96, 165, 250, 0.15);
	color: #60a5fa;
}

/* TABLE */
.table-card {
	background: #fff;
	border: 1px solid #f1f5f9;
	border-radius: 24px;
	overflow: hidden;
}

.task-row {
	display: grid;
	grid-template-columns: 44px 1fr 110px 110px 100px 250px;
	align-items: center;
	gap: 1rem;
	padding: 1.1rem 1.75rem;
	border-bottom: 1px solid #f8fafc;
	transition: background 0.15s;
	animation: rowIn 0.5s ease both;
}
.task-row:last-child {
	border-bottom: none;
}
.task-row:hover {
	background: #f8fafc;
}
@keyframes rowIn {
	from {
		opacity: 0;
		transform: translateX(-12px);
	}
	to {
		opacity: 1;
		transform: none;
	}
}
.tl-enter-active {
	transition: all 0.35s ease;
}
.tl-leave-active {
	transition: all 0.3s ease;
}
.tl-enter-from {
	opacity: 0;
	transform: translateY(-10px);
}
.tl-leave-to {
	opacity: 0;
	transform: translateX(20px);
}

.task-num {
	font-size: 0.75rem;
	font-weight: 900;
	color: #cbd5e1;
	letter-spacing: 0.05em;
}
.task-info {
	min-width: 0;
}
.task-title-uz {
	font-size: 0.9rem;
	font-weight: 800;
	color: #0f172a;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-bottom: 0.25rem;
}
.task-langs {
	display: flex;
	gap: 0.5rem;
}
.tlang {
	display: flex;
	align-items: center;
	gap: 0.3rem;
	font-size: 0.7rem;
	color: #94a3b8;
	font-weight: 500;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 130px;
}
.ldot {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 14px;
	border-radius: 3px;
	font-size: 0.55rem;
	font-weight: 900;
	text-transform: uppercase;
	flex-shrink: 0;
}
.ldot.uz {
	background: #eff6ff;
	color: #1a56db;
}
.ldot.ru {
	background: #fef3c7;
	color: #d97706;
}
.ldot.en {
	background: #f0fdf4;
	color: #16a34a;
}

.task-slug {
	font-size: 0.72rem;
	font-weight: 700;
	color: #94a3b8;
	font-family: monospace;
	background: #f8fafc;
	padding: 0.25rem 0.6rem;
	border-radius: 6px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.task-date {
	font-size: 0.75rem;
	color: #94a3b8;
	font-weight: 600;
	white-space: nowrap;
}
.status-badge {
	padding: 0.3rem 0.75rem;
	border-radius: 20px;
	font-size: 0.65rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	white-space: nowrap;
}
.status-badge.published {
	background: #f0fdf4;
	color: #16a34a;
}
.status-badge.draft {
	background: #fffbeb;
	color: #d97706;
}

.task-actions {
	display: flex;
	gap: 0.4rem;
}
.act-btn {
	display: flex;
	align-items: center;
	gap: 0.3rem;
	padding: 0.4rem 0.75rem;
	border-radius: 9px;
	font-size: 0.68rem;
	font-weight: 800;
	text-decoration: none;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	transition: all 0.2s;
	border: none;
	cursor: pointer;
	font-family: inherit;
	white-space: nowrap;
}
.act-btn svg {
	width: 11px;
	height: 11px;
}
.act-btn.edit {
	background: #05080f;
	color: #60a5fa;
}
.act-btn.edit:hover {
	background: #1a56db;
	color: #fff;
}
.act-btn.view {
	background: #f1f5f9;
	color: #64748b;
}
.act-btn.view:hover {
	background: #e2e8f0;
	color: #334155;
}
.act-btn.delete {
	background: #fff0f0;
	color: #ef4444;
}
.act-btn.delete:hover {
	background: #ef4444;
	color: #fff;
}

.table-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 1.75rem;
	background: #f8fafc;
	border-top: 1px solid #f1f5f9;
	font-size: 0.72rem;
	color: #94a3b8;
	font-weight: 600;
}
.lang-pills {
	display: flex;
	gap: 0.4rem;
}
.lang-pill {
	padding: 0.25rem 0.65rem;
	border-radius: 20px;
	font-size: 0.6rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	border: 1px solid #e2e8f0;
	color: #94a3b8;
}
.lang-pill.active {
	background: #05080f;
	color: #60a5fa;
	border-color: #05080f;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 4rem 2rem;
	text-align: center;
}
.empty-icon {
	width: 56px;
	height: 56px;
	border-radius: 16px;
	background: #f8fafc;
	border: 1px solid #f1f5f9;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 1rem;
}
.empty-icon svg {
	width: 24px;
	height: 24px;
	color: #cbd5e1;
}
.empty-title {
	font-size: 1rem;
	font-weight: 800;
	color: #334155;
	margin-bottom: 0.5rem;
}
.empty-sub {
	font-size: 0.82rem;
	color: #94a3b8;
	margin-bottom: 1.5rem;
}
.empty-btn {
	background: #05080f;
	color: #60a5fa;
	padding: 0.6rem 1.5rem;
	border-radius: 10px;
	border: none;
	cursor: pointer;
	font-size: 0.78rem;
	font-weight: 800;
	font-family: inherit;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	transition: all 0.2s;
}
.empty-btn:hover {
	background: #1a56db;
	color: #fff;
}

/* MODALS */
.modal-overlay {
	position: fixed;
	inset: 0;
	background: rgba(5, 8, 15, 0.75);
	backdrop-filter: blur(8px);
	z-index: 500;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1.5rem;
}
.modal {
	background: #fff;
	border-radius: 24px;
	width: 100%;
	max-width: 520px;
	box-shadow: 0 40px 100px rgba(0, 0, 0, 0.25);
	overflow: hidden;
}
.modal-sm {
	max-width: 420px;
}
.modal-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding: 1.75rem 1.75rem 0;
	gap: 1rem;
}
.modal-title {
	font-size: 1.15rem;
	font-weight: 900;
	color: #0f172a;
	margin-bottom: 0.3rem;
}
.modal-sub {
	font-size: 0.78rem;
	color: #94a3b8;
	font-weight: 500;
	line-height: 1.5;
}
.modal-close {
	width: 32px;
	height: 32px;
	border-radius: 8px;
	border: none;
	background: #f8fafc;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #94a3b8;
	transition: all 0.2s;
	flex-shrink: 0;
}
.modal-close svg {
	width: 14px;
	height: 14px;
}
.modal-close:hover {
	background: #f1f5f9;
	color: #334155;
}
.modal-body {
	padding: 1.5rem 1.75rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
.modal-footer {
	display: flex;
	gap: 0.75rem;
	padding: 1.25rem 1.75rem;
	background: #f8fafc;
	border-top: 1px solid #f1f5f9;
}

.mfield {
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
}
.mfield-label {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	font-size: 0.7rem;
	font-weight: 800;
	color: #64748b;
	text-transform: uppercase;
	letter-spacing: 0.12em;
}
.req {
	color: #ef4444;
}
.mfield-input {
	width: 100%;
	background: #f8fafc;
	border: 1.5px solid #f1f5f9;
	border-radius: 12px;
	padding: 0.75rem 1rem;
	font-size: 0.9rem;
	font-family: inherit;
	color: #0f172a;
	outline: none;
	transition:
		border-color 0.2s,
		background 0.2s;
}
.mfield-input:focus {
	border-color: #1a56db;
	background: #fff;
}
.mfield-input::placeholder {
	color: #cbd5e1;
}
.mfield-hint {
	font-size: 0.7rem;
	color: #94a3b8;
	font-weight: 500;
}
.slug-wrap {
	display: flex;
	align-items: center;
	background: #f8fafc;
	border: 1.5px solid #f1f5f9;
	border-radius: 12px;
	overflow: hidden;
	transition: border-color 0.2s;
}
.slug-wrap:focus-within {
	border-color: #1a56db;
	background: #fff;
}
.slug-prefix {
	padding: 0.75rem 0.5rem 0.75rem 1rem;
	font-size: 0.82rem;
	color: #94a3b8;
	font-weight: 600;
	white-space: nowrap;
	font-family: monospace;
}
.slug-input {
	flex: 1;
	background: transparent;
	border: none;
	padding: 0.75rem 0.75rem 0.75rem 0;
	font-size: 0.9rem;
	font-family: monospace;
	color: #0f172a;
	outline: none;
}
.stoggle {
	display: flex;
	gap: 0.5rem;
}
.stoggle-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.6rem;
	border-radius: 10px;
	border: 1.5px solid #f1f5f9;
	background: #f8fafc;
	cursor: pointer;
	font-size: 0.78rem;
	font-weight: 700;
	font-family: inherit;
	color: #94a3b8;
	transition: all 0.2s;
}
.stoggle-btn.active {
	border-color: #1a56db;
	background: #eff6ff;
	color: #1a56db;
}
.sdot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
}
.sdot.amber {
	background: #f59e0b;
}
.sdot.green {
	background: #22c55e;
}
.merror {
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
}
.merror svg {
	width: 14px;
	height: 14px;
	flex-shrink: 0;
}
.err-enter-active,
.err-leave-active {
	transition: all 0.25s;
}
.err-enter-from,
.err-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}

.btn-cancel {
	flex: 1;
	padding: 0.7rem;
	border-radius: 10px;
	border: 1.5px solid #e2e8f0;
	background: #fff;
	color: #64748b;
	font-size: 0.78rem;
	font-weight: 700;
	font-family: inherit;
	cursor: pointer;
	transition: all 0.2s;
}
.btn-cancel:hover {
	border-color: #cbd5e1;
	color: #334155;
}
.btn-submit {
	flex: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.7rem;
	border-radius: 10px;
	border: none;
	background: linear-gradient(135deg, #1a56db, #1e40af);
	color: #fff;
	font-size: 0.78rem;
	font-weight: 800;
	font-family: inherit;
	cursor: pointer;
	box-shadow: 0 4px 16px rgba(26, 86, 219, 0.3);
	transition: all 0.2s;
}
.btn-submit:hover:not(:disabled) {
	transform: translateY(-1px);
	box-shadow: 0 8px 20px rgba(26, 86, 219, 0.4);
}
.btn-submit:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}
.btn-delete {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.7rem;
	border-radius: 10px;
	border: none;
	background: linear-gradient(135deg, #dc2626, #b91c1c);
	color: #fff;
	font-size: 0.78rem;
	font-weight: 800;
	font-family: inherit;
	cursor: pointer;
	box-shadow: 0 4px 16px rgba(220, 38, 38, 0.25);
	transition: all 0.2s;
}
.btn-delete:hover:not(:disabled) {
	transform: translateY(-1px);
	box-shadow: 0 8px 20px rgba(220, 38, 38, 0.35);
}
.btn-delete:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}
.spinner {
	width: 16px;
	height: 16px;
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

.del-icon {
	width: 48px;
	height: 48px;
	border-radius: 14px;
	background: #fef2f2;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ef4444;
}
.del-icon svg {
	width: 22px;
	height: 22px;
}
.del-title {
	font-size: 1.05rem;
	font-weight: 900;
	color: #0f172a;
	margin-bottom: 0.75rem;
}
.del-desc {
	font-size: 0.85rem;
	color: #64748b;
	line-height: 1.6;
}
.del-desc strong {
	color: #0f172a;
}
.del-desc code {
	background: #f1f5f9;
	padding: 0.1rem 0.4rem;
	border-radius: 5px;
	font-size: 0.8rem;
	color: #475569;
}

.overlay-enter-active,
.overlay-leave-active {
	transition: opacity 0.25s;
}
.overlay-enter-from,
.overlay-leave-to {
	opacity: 0;
}
.mscale-enter-active,
.mscale-leave-active {
	transition:
		transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
		opacity 0.25s;
}
.mscale-enter-from,
.mscale-leave-to {
	transform: scale(0.92);
	opacity: 0;
}

@media (max-width: 1100px) {
	.task-row {
		grid-template-columns: 44px 1fr 110px 200px;
	}
	.task-date,
	.task-slug {
		display: none;
	}
}
</style>
