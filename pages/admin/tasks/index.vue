<script setup>
definePageMeta({ middleware: "admin-auth" })

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// ── HOLAT ─────────────────────────────────────────────────
const tasks = ref([])
const dbLoading = ref(true)
const dbError = ref(null)

// ── SUPABASE: YUKLASH ─────────────────────────────────────
async function fetchTasks() {
	dbLoading.value = true
	dbError.value = null

	const { data, error } = await supabase
		.from("tasks")
		.select("slug, status, uz, ru, en, updated_at")
		.order("updated_at", { ascending: false })

	if (error) {
		dbError.value = error.message
	} else {
		tasks.value = (data ?? []).map(t => ({
			slug: t.slug,
			uz: t.uz?.title ?? t.slug,
			ru: t.ru?.title ?? "",
			en: t.en?.title ?? "",
			status: t.status,
			updatedAt: t.updated_at,
		}))
	}
	dbLoading.value = false
}

onMounted(fetchTasks)

// ── FILTER ────────────────────────────────────────────────
const filterStatus = ref("all")
const searchQuery = ref("")

const filteredTasks = computed(() =>
	tasks.value.filter(t => {
		const matchStatus =
			filterStatus.value === "all" || t.status === filterStatus.value
		const q = searchQuery.value.toLowerCase()
		const matchSearch =
			!q ||
			t.uz.toLowerCase().includes(q) ||
			t.slug.includes(q) ||
			(t.ru && t.ru.toLowerCase().includes(q))
		return matchStatus && matchSearch
	}),
)

function formatDate(d) {
	return new Date(d).toLocaleDateString("uz-UZ", {
		// day: "2-digit",
		// month: "short",
		// year: "numeric",
	})
}

// ── LOGOUT ────────────────────────────────────────────────
async function logout() {
	await supabase.auth.signOut()
	await navigateTo("/admin/login")
}

// ── YANGI TASK ────────────────────────────────────────────
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
	addError.value = ""

	const { error } = await supabase.from("tasks").insert({
		slug: addForm.value.slug,
		status: addForm.value.status,
		uz: { title: addForm.value.uz },
		ru: { title: addForm.value.ru },
		en: { title: addForm.value.en },
	})

	if (error) {
		addError.value = error.message
		addLoading.value = false
		return
	}

	tasks.value.unshift({
		slug: addForm.value.slug,
		uz: addForm.value.uz,
		ru: addForm.value.ru,
		en: addForm.value.en,
		status: addForm.value.status,
		updatedAt: new Date().toISOString(),
	})
	addLoading.value = false
	const slug = addForm.value.slug
	closeAddModal()
	await navigateTo(`/admin/tasks/${slug}`)
}

// ── O'CHIRISH ─────────────────────────────────────────────
const deleteTarget = ref(null)
const deleteLoading = ref(false)
const deleteError = ref("")

function openDeleteModal(task) {
	deleteTarget.value = task
	deleteError.value = ""
}
function closeDeleteModal() {
	deleteTarget.value = null
}

async function handleDelete() {
	if (!deleteTarget.value) return
	deleteLoading.value = true
	deleteError.value = ""

	const { error } = await supabase
		.from("tasks")
		.delete()
		.eq("slug", deleteTarget.value.slug)

	if (error) {
		deleteError.value = error.message
		deleteLoading.value = false
		return
	}

	tasks.value = tasks.value.filter(t => t.slug !== deleteTarget.value.slug)
	deleteLoading.value = false
	closeDeleteModal()
}
</script>

<template>
	<div class="font-[DM_Sans,sans-serif] min-h-screen bg-slate-50 flex flex-col">
		<!-- TOPBAR -->
		<header
			class="h-[60px] bg-[#05080f] border-b border-white/[0.06] flex items-center justify-between px-6 sticky top-0 z-[100]"
		>
			<div class="flex items-center gap-3">
				<div
					class="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="white">
						<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
					</svg>
				</div>
				<div class="flex items-center">
					<span class="text-white font-black text-[0.95rem] tracking-[0.03em]"
						>TARAQQIYOT</span
					>
					<span
						class="ml-2 bg-blue-600/25 text-blue-400 text-[0.6rem] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border border-blue-600/30"
						>Admin</span
					>
				</div>
			</div>
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2">
					<div
						class="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-[0.7rem] font-black"
					>
						{{ user?.email?.[0]?.toUpperCase() ?? "A" }}
					</div>
					<span
						class="text-slate-400 text-[0.8rem] font-semibold max-w-[180px] truncate hidden sm:block"
						>{{ user?.email ?? "Admin" }}</span
					>
				</div>
				<button
					class="flex items-center gap-1.5 bg-transparent border border-white/10 text-slate-500 hover:text-white hover:border-white/20 px-3.5 py-1.5 rounded-lg text-[0.75rem] font-bold transition-all duration-200 cursor-pointer"
					@click="logout"
				>
					<svg
						class="w-3.5 h-3.5"
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

		<div class="flex flex-1 min-h-[calc(100vh-60px)]">
			<!-- SIDEBAR -->
			<aside
				class="w-[220px] bg-[#05080f] border-r border-white/[0.06] flex flex-col justify-between p-6 pb-6 sticky top-[60px] h-[calc(100vh-60px)]"
			>
				<nav class="flex flex-col gap-1">
					<NuxtLink
						to="/admin"
						class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 text-[0.8rem] font-bold no-underline transition-all duration-200 hover:bg-white/5 hover:text-slate-400"
					>
						<svg
							class="w-4 h-4"
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
					<NuxtLink
						to="/admin/tasks"
						class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-blue-400 text-[0.8rem] font-bold no-underline bg-blue-600/15 border border-blue-600/20"
					>
						<svg
							class="w-4 h-4"
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
					<NuxtLink
						to="/admin/reels"
						class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 text-[0.8rem] font-bold no-underline transition-all duration-200 hover:bg-white/5 hover:text-slate-400"
					>
						<svg
							class="w-4 h-4"
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
				<div
					class="flex items-center gap-2 text-[0.65rem] font-bold text-[#1e3a5f]"
				>
					<span
						class="w-1.5 h-1.5 rounded-full"
						:class="dbError ? 'bg-red-500' : 'bg-green-500'"
					/>
					<span>{{ dbError ? "Ulanishda xato" : "Supabase ulangan" }}</span>
				</div>
			</aside>

			<!-- MAIN -->
			<main class="flex-1 p-8 overflow-y-auto">
				<!-- Loading skeleton -->
				<template v-if="dbLoading">
					<div class="h-14 bg-slate-200 rounded-xl mb-6 animate-pulse" />
					<div class="h-12 bg-slate-200 rounded-xl mb-5 animate-pulse" />
					<div
						class="bg-white rounded-3xl border border-slate-100 overflow-hidden"
					>
						<div
							v-for="n in 5"
							:key="n"
							class="h-[72px] bg-slate-100 mx-6 my-3 rounded-xl animate-pulse"
						/>
					</div>
				</template>

				<!-- DB xato -->
				<div
					v-else-if="dbError"
					class="flex items-start gap-4 bg-red-50 border border-red-200 rounded-2xl p-6"
				>
					<svg
						class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
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
						<p class="text-[0.9rem] font-black text-red-700 mb-1">
							Supabase ga ulanishda xato
						</p>
						<p class="text-[0.78rem] text-red-500 font-mono mb-3">
							{{ dbError }}
						</p>
						<button
							class="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-[0.75rem] font-bold transition-colors cursor-pointer border-none"
							@click="fetchTasks"
						>
							Qayta urinish
						</button>
					</div>
				</div>

				<template v-else>
					<!-- Page header -->
					<div class="flex items-center justify-between mb-6">
						<div>
							<p
								class="text-[0.72rem] font-bold text-slate-400 uppercase tracking-[0.12em] mb-1"
							>
								Kontent boshqaruvi
							</p>
							<h1
								class="text-[1.75rem] font-black text-slate-900 tracking-tight leading-none"
							>
								Tasklar
							</h1>
						</div>
						<button
							class="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-blue-800 text-white px-5 py-2.5 rounded-xl border-none cursor-pointer text-[0.78rem] font-black uppercase tracking-[0.08em] shadow-[0_4px_16px_rgba(26,86,219,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(26,86,219,0.4)] transition-all duration-200"
							@click="openAddModal"
						>
							<svg
								class="w-3.5 h-3.5"
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

					<!-- Toolbar -->
					<div class="flex items-center gap-4 mb-5 flex-wrap">
						<!-- Search -->
						<div class="relative flex items-center flex-1 min-w-[240px]">
							<svg
								class="absolute left-3 w-[15px] h-[15px] text-slate-400 pointer-events-none"
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
								placeholder="Task nomi yoki slug bo'yicha qidirish..."
								class="w-full bg-white border-[1.5px] border-slate-100 focus:border-blue-600 rounded-xl py-2.5 pl-10 pr-9 text-[0.85rem] text-slate-900 outline-none placeholder:text-slate-300 transition-colors duration-200"
							/>
							<button
								v-if="searchQuery"
								class="absolute right-2.5 bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
								@click="searchQuery = ''"
							>
								<svg
									class="w-3.5 h-3.5"
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

						<!-- Filter tabs -->
						<div
							class="flex bg-white border-[1.5px] border-slate-100 rounded-xl overflow-hidden"
						>
							<button
								v-for="f in [
									{ key: 'all', label: 'Barchasi' },
									{ key: 'published', label: 'Nashr' },
									{ key: 'draft', label: 'Qoralama' },
								]"
								:key="f.key"
								class="flex items-center gap-1.5 px-4 py-2 border-none cursor-pointer text-[0.75rem] font-bold transition-all duration-200 whitespace-nowrap"
								:class="
									filterStatus === f.key
										? 'bg-[#05080f] text-blue-400'
										: 'bg-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-700'
								"
								@click="filterStatus = f.key"
							>
								{{ f.label }}
								<span
									class="px-1.5 py-0.5 rounded-md text-[0.65rem] font-black"
									:class="
										filterStatus === f.key
											? 'bg-blue-400/15 text-blue-400'
											: 'bg-black/[0.06] text-current'
									"
								>
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
					<div
						class="bg-white border border-slate-100 rounded-3xl overflow-hidden"
					>
						<div>
							<TransitionGroup name="tl">
								<div
									v-for="(task, i) in filteredTasks"
									:key="task.slug"
									class="task-row items-center gap-4 px-7 py-[1.1rem] border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors duration-150"
									:style="{ animationDelay: `${i * 50}ms` }"
								>
									<!-- Tartib raqami -->
									<div
										class="text-[0.75rem] font-black text-slate-300 tracking-[0.05em]"
									>
										{{ String(i + 1).padStart(2, "0") }}
									</div>

									<!-- Info -->
									<div class="min-w-0">
										<div
											class="text-[0.9rem] font-black text-slate-900 truncate mb-1"
										>
											{{ task.uz }}
										</div>
										<div class="flex gap-2">
											<span
												class="flex items-center gap-1 text-[0.7rem] text-slate-400 font-medium truncate max-w-[130px]"
											>
												<span
													class="inline-flex items-center justify-center w-5 h-3.5 rounded-[3px] bg-amber-100 text-amber-600 text-[0.55rem] font-black uppercase flex-shrink-0"
													>RU</span
												>
												{{ task.ru || "—" }}
											</span>
											<span
												class="flex items-center gap-1 text-[0.7rem] text-slate-400 font-medium truncate max-w-[130px]"
											>
												<span
													class="inline-flex items-center justify-center w-5 h-3.5 rounded-[3px] bg-green-100 text-green-700 text-[0.55rem] font-black uppercase flex-shrink-0"
													>EN</span
												>
												{{ task.en || "—" }}
											</span>
										</div>
									</div>

									<!-- Slug -->
									<div
										class="text-[0.72rem] font-bold text-slate-400 font-mono bg-slate-50 px-2.5 py-1 rounded-md truncate"
									>
										{{ task.slug }}
									</div>

									<!-- Sana -->
									<div
										class="text-[0.75rem] text-slate-400 font-semibold whitespace-nowrap"
									>
										{{ formatDate(task.updatedAt) }}
									</div>

									<!-- Status -->
									<div>
										<span
											class="px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-[0.08em] whitespace-nowrap"
											:class="
												task.status === 'published'
													? 'bg-green-50 text-green-600'
													: 'bg-amber-50 text-amber-600'
											"
										>
											{{ task.status === "published" ? "Nashr" : "Qoralama" }}
										</span>
									</div>

									<!-- Amallar -->
									<div class="flex gap-1.5">
										<NuxtLink
											:to="`/admin/tasks/${task.slug}`"
											class="flex items-center gap-1 px-3 py-1.5 rounded-[9px] text-[0.68rem] font-black uppercase tracking-[0.04em] no-underline whitespace-nowrap transition-all duration-200 bg-[#05080f] text-blue-400 hover:bg-blue-600 hover:text-white"
										>
											<svg
												class="w-3 h-3"
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
											class="flex items-center gap-1 px-3 py-1.5 rounded-[9px] text-[0.68rem] font-black uppercase tracking-[0.04em] no-underline whitespace-nowrap transition-all duration-200 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
										>
											<svg
												class="w-3 h-3"
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
										<button
											class="flex items-center gap-1 px-3 py-1.5 rounded-[9px] text-[0.68rem] font-black uppercase tracking-[0.04em] whitespace-nowrap transition-all duration-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border-none cursor-pointer"
											@click="openDeleteModal(task)"
										>
											<svg
												class="w-3 h-3"
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

							<!-- Bo'sh holat -->
							<div
								v-if="filteredTasks.length === 0"
								class="flex flex-col items-center justify-center py-16 text-center px-8"
							>
								<div
									class="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4"
								>
									<svg
										class="w-6 h-6 text-slate-300"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
									>
										<circle cx="11" cy="11" r="8" />
										<line x1="21" y1="21" x2="16.65" y2="16.65" />
									</svg>
								</div>
								<p class="text-[1rem] font-black text-slate-700 mb-1.5">
									{{ searchQuery ? `"${searchQuery}" topilmadi` : "Task yo'q" }}
								</p>
								<p class="text-[0.82rem] text-slate-400 mb-6">
									{{
										searchQuery
											? "Boshqa kalit so'z bilan qidiring"
											: "Yangi task qo'shish uchun tugmani bosing"
									}}
								</p>
								<button
									v-if="!searchQuery"
									class="bg-[#05080f] text-blue-400 hover:bg-blue-600 hover:text-white px-6 py-2.5 rounded-xl border-none cursor-pointer text-[0.78rem] font-black uppercase tracking-[0.08em] transition-all duration-200"
									@click="openAddModal"
								>
									Task qo'shish
								</button>
								<button
									v-else
									class="bg-[#05080f] text-blue-400 hover:bg-blue-600 hover:text-white px-6 py-2.5 rounded-xl border-none cursor-pointer text-[0.78rem] font-black uppercase tracking-[0.08em] transition-all duration-200"
									@click="searchQuery = ''"
								>
									Tozalash
								</button>
							</div>
						</div>

						<!-- Table footer -->
						<div
							v-if="filteredTasks.length > 0"
							class="flex items-center justify-between px-7 py-4 bg-slate-50 border-t border-slate-100 text-[0.72rem] text-slate-400 font-semibold"
						>
							<span>{{ filteredTasks.length }} ta task ko'rsatilmoqda</span>
							<div class="flex gap-1.5">
								<!-- <span
									class="px-2.5 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-[0.1em] bg-[#05080f] text-blue-400 border border-[#05080f]"
									>UZ</span
								>
								<span
									class="px-2.5 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-[0.1em] border border-slate-200 text-slate-400"
									>RU</span
								>
								<span
									class="px-2.5 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-[0.1em] border border-slate-200 text-slate-400"
									>EN</span
								> -->
							</div>
						</div>
					</div>
				</template>
			</main>
		</div>

		<!-- ══ YANGI TASK MODAL ══ -->
		<Transition name="overlay">
			<div
				v-if="showAddModal"
				class="fixed inset-0 bg-[#05080f]/75 backdrop-blur-[8px] z-[500] flex items-center justify-center p-6"
				@click.self="closeAddModal"
			>
				<Transition name="mscale">
					<div
						v-if="showAddModal"
						class="bg-white rounded-3xl w-full max-w-[520px] shadow-[0_40px_100px_rgba(0,0,0,0.25)] overflow-hidden"
					>
						<div class="flex items-start justify-between p-7 pb-0 gap-4">
							<div>
								<h3 class="text-[1.15rem] font-black text-slate-900 mb-1">
									Yangi task qo'shish
								</h3>
								<p
									class="text-[0.78rem] text-slate-400 font-medium leading-relaxed"
								>
									Asosiy ma'lumotlarni kiriting, qolganini keyinchalik
									to'ldirish mumkin
								</p>
							</div>
							<button
								class="w-8 h-8 rounded-lg border-none bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all flex-shrink-0"
								@click="closeAddModal"
							>
								<svg
									class="w-3.5 h-3.5"
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

						<div class="p-7 flex flex-col gap-4">
							<!-- UZ -->
							<div class="flex flex-col gap-1.5">
								<label
									class="flex items-center gap-1.5 text-[0.7rem] font-black text-slate-500 uppercase tracking-[0.12em]"
								>
									<span
										class="inline-flex items-center justify-center w-5 h-3.5 rounded-[3px] bg-blue-100 text-blue-600 text-[0.55rem] font-black"
										>UZ</span
									>
									O'zbekcha sarlavha <span class="text-red-500">*</span>
								</label>
								<input
									v-model="addForm.uz"
									type="text"
									autofocus
									placeholder="Masalan: Xaritalash va tahlil"
									class="w-full bg-slate-50 border-[1.5px] border-slate-100 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-[0.9rem] outline-none placeholder:text-slate-300 transition-all duration-200"
								/>
							</div>

							<!-- Slug -->
							<div class="flex flex-col gap-1.5">
								<label
									class="flex items-center gap-1.5 text-[0.7rem] font-black text-slate-500 uppercase tracking-[0.12em]"
								>
									<svg
										class="w-3 h-3"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
										/>
										<path
											d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
										/>
									</svg>
									Slug <span class="text-red-500">*</span>
								</label>
								<div
									class="flex items-center bg-slate-50 border-[1.5px] border-slate-100 focus-within:border-blue-600 focus-within:bg-white rounded-xl overflow-hidden transition-all duration-200"
								>
									<span
										class="px-4 py-3 text-[0.82rem] text-slate-400 font-semibold whitespace-nowrap font-mono border-r border-slate-100"
										>/projects/</span
									>
									<input
										v-model="addForm.slug"
										type="text"
										placeholder="xaritalash"
										class="flex-1 bg-transparent border-none px-3 py-3 text-[0.9rem] font-mono text-slate-900 outline-none"
									/>
								</div>
								<p class="text-[0.7rem] text-slate-400 font-medium">
									Avtomatik to'ldiriladi. Faqat kichik harf, raqam, tire.
								</p>
							</div>

							<!-- RU -->
							<div class="flex flex-col gap-1.5">
								<label
									class="flex items-center gap-1.5 text-[0.7rem] font-black text-slate-500 uppercase tracking-[0.12em]"
								>
									<span
										class="inline-flex items-center justify-center w-5 h-3.5 rounded-[3px] bg-amber-100 text-amber-600 text-[0.55rem] font-black"
										>RU</span
									>
									Ruscha sarlavha
								</label>
								<input
									v-model="addForm.ru"
									type="text"
									placeholder="Масален: Картирование"
									class="w-full bg-slate-50 border-[1.5px] border-slate-100 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-[0.9rem] outline-none placeholder:text-slate-300 transition-all duration-200"
								/>
							</div>

							<!-- EN -->
							<div class="flex flex-col gap-1.5">
								<label
									class="flex items-center gap-1.5 text-[0.7rem] font-black text-slate-500 uppercase tracking-[0.12em]"
								>
									<span
										class="inline-flex items-center justify-center w-5 h-3.5 rounded-[3px] bg-green-100 text-green-700 text-[0.55rem] font-black"
										>EN</span
									>
									Inglizcha sarlavha
								</label>
								<input
									v-model="addForm.en"
									type="text"
									placeholder="Masalan: Mapping & Analysis"
									class="w-full bg-slate-50 border-[1.5px] border-slate-100 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-[0.9rem] outline-none placeholder:text-slate-300 transition-all duration-200"
								/>
							</div>

							<!-- Status -->
							<div class="flex flex-col gap-1.5">
								<label
									class="text-[0.7rem] font-black text-slate-500 uppercase tracking-[0.12em]"
									>Holat</label
								>
								<div class="flex gap-2">
									<button
										class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-[1.5px] cursor-pointer text-[0.78rem] font-bold transition-all duration-200"
										:class="
											addForm.status === 'draft'
												? 'border-blue-600 bg-blue-50 text-blue-600'
												: 'border-slate-100 bg-slate-50 text-slate-400'
										"
										@click="addForm.status = 'draft'"
									>
										<span class="w-2 h-2 rounded-full bg-amber-400" /> Qoralama
									</button>
									<button
										class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-[1.5px] cursor-pointer text-[0.78rem] font-bold transition-all duration-200"
										:class="
											addForm.status === 'published'
												? 'border-blue-600 bg-blue-50 text-blue-600'
												: 'border-slate-100 bg-slate-50 text-slate-400'
										"
										@click="addForm.status = 'published'"
									>
										<span class="w-2 h-2 rounded-full bg-green-500" /> Nashr
									</button>
								</div>
							</div>

							<!-- Xato -->
							<Transition name="err">
								<div
									v-if="addError"
									class="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-red-700 text-[0.78rem] font-semibold"
								>
									<svg
										class="w-3.5 h-3.5 flex-shrink-0"
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

						<div
							class="flex gap-3 px-7 py-5 bg-slate-50 border-t border-slate-100"
						>
							<button
								class="flex-1 py-2.5 rounded-xl border-[1.5px] border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 text-[0.78rem] font-bold cursor-pointer transition-all duration-200"
								@click="closeAddModal"
							>
								Bekor qilish
							</button>
							<button
								class="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-xl border-none bg-gradient-to-r from-blue-600 to-blue-800 text-white text-[0.78rem] font-black cursor-pointer shadow-[0_4px_16px_rgba(26,86,219,0.3)] hover:shadow-[0_8px_20px_rgba(26,86,219,0.4)] hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
								:disabled="addLoading"
								@click="handleAdd"
							>
								<template v-if="!addLoading">
									<svg
										class="w-3.5 h-3.5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
									>
										<line x1="12" y1="5" x2="12" y2="19" />
										<line x1="5" y1="12" x2="19" y2="12" />
									</svg>
									Yaratish va tahrirlashga o'tish
								</template>
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
				class="fixed inset-0 bg-[#05080f]/75 backdrop-blur-[8px] z-[500] flex items-center justify-center p-6"
				@click.self="closeDeleteModal"
			>
				<Transition name="mscale">
					<div
						v-if="deleteTarget"
						class="bg-white rounded-3xl w-full max-w-[420px] shadow-[0_40px_100px_rgba(0,0,0,0.25)] overflow-hidden"
					>
						<div class="flex items-start justify-between p-7 pb-0 gap-4">
							<div
								class="w-12 h-12 rounded-[14px] bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0"
							>
								<svg
									class="w-5 h-5"
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
							<button
								class="w-8 h-8 rounded-lg border-none bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all flex-shrink-0 ml-auto"
								@click="closeDeleteModal"
							>
								<svg
									class="w-3.5 h-3.5"
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
						<div class="px-7 py-5">
							<h3 class="text-[1.05rem] font-black text-slate-900 mb-3">
								Taskni o'chirishni tasdiqlang
							</h3>
							<p class="text-[0.85rem] text-slate-500 leading-relaxed">
								<strong class="text-slate-900">{{ deleteTarget.uz }}</strong> va
								uning barcha tarjimalari (<code
									class="bg-slate-100 px-1.5 py-0.5 rounded text-[0.8rem] text-slate-600"
									>{{ deleteTarget.slug }}</code
								>) o'chiriladi. Bu amalni qaytarib bo'lmaydi.
							</p>
							<Transition name="err">
								<div
									v-if="deleteError"
									class="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-red-700 text-[0.78rem] font-semibold mt-3"
								>
									<svg
										class="w-3.5 h-3.5 flex-shrink-0"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<circle cx="12" cy="12" r="10" />
										<line x1="12" y1="8" x2="12" y2="12" />
										<line x1="12" y1="16" x2="12.01" y2="16" />
									</svg>
									{{ deleteError }}
								</div>
							</Transition>
						</div>
						<div
							class="flex gap-3 px-7 py-5 bg-slate-50 border-t border-slate-100"
						>
							<button
								class="flex-1 py-2.5 rounded-xl border-[1.5px] border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 text-[0.78rem] font-bold cursor-pointer transition-all duration-200"
								@click="closeDeleteModal"
							>
								Bekor qilish
							</button>
							<button
								class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-none bg-gradient-to-r from-red-600 to-red-700 text-white text-[0.78rem] font-black cursor-pointer shadow-[0_4px_16px_rgba(220,38,38,0.25)] hover:shadow-[0_8px_20px_rgba(220,38,38,0.35)] hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
								:disabled="deleteLoading"
								@click="handleDelete"
							>
								<template v-if="!deleteLoading">
									<svg
										class="w-3.5 h-3.5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
									>
										<polyline points="3 6 5 6 21 6" />
										<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
									</svg>
									Ha, o'chirish
								</template>
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

/* Grid layout — Tailwind arbitrary values bilan murakkab */
.task-row {
	display: grid;
	grid-template-columns: 44px 1fr 110px 110px 100px 300px;
	animation: rowIn 0.5s ease both;
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

/* TransitionGroup animatsiyalar */
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

/* Modal transitions */
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

/* Error transition */
.err-enter-active,
.err-leave-active {
	transition: all 0.25s;
}
.err-enter-from,
.err-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}

/* Spinner */
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

@media (max-width: 1100px) {
	.task-row {
		grid-template-columns: 44px 1fr 110px 200px;
	}
	.task-row > :nth-child(3),
	.task-row > :nth-child(4) {
		display: none;
	}
}
</style>
