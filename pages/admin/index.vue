<script setup>
definePageMeta({ middleware: "admin-auth" })

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// ── STATE ─────────────────────────────────────────────────
const tasks = ref([])
const dbLoading = ref(true)
const dbError = ref(null)

// ── COMPUTED ──────────────────────────────────────────────
const stats = computed(() => ({
	total: tasks.value.length,
	published: tasks.value.filter(t => t.status === "published").length,
	draft: tasks.value.filter(t => t.status === "draft").length,
	langs: 3,
}))

const recentTasks = computed(() => [...tasks.value].slice(0, 4))

// function formatDate(d) {
// 	return new Date(d).toLocaleDateString("uz-UZ", {
// 		day: "2-digit",
// 		month: "short",
// 		year: "numeric",
// 	})
// }

// ── SUPABASE: YUKLASH ─────────────────────────────────────
onMounted(async () => {
	const { data, error } = await supabase
		.from("tasks")
		.select("slug, status, uz, updated_at")
		.order("updated_at", { ascending: false })

	if (error) {
		dbError.value = error.message
	} else {
		tasks.value = (data ?? []).map(t => ({
			slug: t.slug,
			uz: t.uz?.title ?? t.slug,
			status: t.status,
			updatedAt: t.updated_at,
		}))
	}
	dbLoading.value = false
})

// ── LOGOUT ────────────────────────────────────────────────
async function logout() {
	await supabase.auth.signOut()
	await navigateTo("/")
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
					<div class="user-avatar">
						{{ user?.email?.[0]?.toUpperCase() ?? "A" }}
					</div>
					<span class="user-name">{{ user?.email ?? "Admin" }}</span>
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
					<NuxtLink to="/admin" class="nav-item active">
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
					<NuxtLink to="/admin/tasks" class="nav-item">
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
				<!-- Loading skeleton -->
				<template v-if="dbLoading">
					<div class="skeleton-header" />
					<div class="stats-row">
						<div v-for="n in 4" :key="n" class="skeleton-card" />
					</div>
					<div class="bottom-grid">
						<div class="skeleton-widget" />
						<div class="skeleton-widget" />
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
						<p class="db-error-title">Supabase ga ulanishda xato</p>
						<p class="db-error-msg">{{ dbError }}</p>
					</div>
				</div>

				<!-- Asosiy kontent -->
				<template v-else>
					<div class="page-header">
						<div>
							<p class="page-eyebrow">Xush kelibsiz 👋</p>
							<h1 class="page-title">Dashboard</h1>
						</div>
						<NuxtLink to="/admin/tasks" class="goto-tasks-btn">
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
							Tasklarni boshqarish
						</NuxtLink>
					</div>

					<!-- Stats -->
					<div class="stats-row">
						<div class="stat-card">
							<div class="stat-icon blue">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
									/>
								</svg>
							</div>
							<div>
								<div class="stat-num">{{ stats.total }}</div>
								<div class="stat-lbl">Jami task</div>
							</div>
						</div>
						<div class="stat-card">
							<div class="stat-icon green">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							</div>
							<div>
								<div class="stat-num">{{ stats.published }}</div>
								<div class="stat-lbl">Nashr qilingan</div>
							</div>
						</div>
						<div class="stat-card">
							<div class="stat-icon amber">
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
							</div>
							<div>
								<div class="stat-num">{{ stats.draft }}</div>
								<div class="stat-lbl">Qoralama</div>
							</div>
						</div>
						<div class="stat-card">
							<div class="stat-icon purple">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<circle cx="12" cy="12" r="10" />
									<polyline points="12 6 12 12 16 14" />
								</svg>
							</div>
							<div>
								<div class="stat-num">{{ stats.langs }}</div>
								<div class="stat-lbl">Faol til</div>
							</div>
						</div>
					</div>

					<!-- Two column grid -->
					<div class="bottom-grid">
						<!-- Oxirgi tasklar -->
						<div class="widget-card">
							<div class="widget-header">
								<h2 class="widget-title">Oxirgi tasklar</h2>
								<NuxtLink to="/admin/tasks" class="widget-link">
									Barchasini ko'rish
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
									>
										<path d="M5 12h14M12 5l7 7-7 7" />
									</svg>
								</NuxtLink>
							</div>
							<div class="recent-list">
								<div v-if="recentTasks.length === 0" class="recent-empty">
									Hali task qo'shilmagan
								</div>
								<div
									v-for="task in recentTasks"
									:key="task.slug"
									class="recent-row"
								>
									<div class="recent-info">
										<div class="recent-title">{{ task.uz }}</div>
										<div class="recent-slug">{{ task.slug }}</div>
									</div>
									<div class="recent-right">
										<span :class="['status-badge', task.status]">
											{{ task.status === "published" ? "Nashr" : "Qoralama" }}
										</span>
										<NuxtLink
											:to="`/admin/tasks/${task.slug}`"
											class="recent-edit"
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
										</NuxtLink>
									</div>
								</div>
							</div>
						</div>

						<!-- Tezkor harakatlar -->
						<div class="widget-card">
							<div class="widget-header">
								<h2 class="widget-title">Tezkor harakatlar</h2>
							</div>
							<div class="quick-actions">
								<NuxtLink to="/admin/tasks" class="qa-item">
									<div class="qa-icon blue">
										<svg
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<line x1="12" y1="5" x2="12" y2="19" />
											<line x1="5" y1="12" x2="19" y2="12" />
										</svg>
									</div>
									<div>
										<div class="qa-title">Yangi task qo'shish</div>
										<div class="qa-sub">3 tilda kontent yaratish</div>
									</div>
									<svg
										class="qa-arrow"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path d="M5 12h14M12 5l7 7-7 7" />
									</svg>
								</NuxtLink>
								<NuxtLink to="/admin/tasks" class="qa-item">
									<div class="qa-icon green">
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
									</div>
									<div>
										<div class="qa-title">Tasklarni tahrirlash</div>
										<div class="qa-sub">{{ stats.total }} ta task mavjud</div>
									</div>
									<svg
										class="qa-arrow"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path d="M5 12h14M12 5l7 7-7 7" />
									</svg>
								</NuxtLink>
								<a href="/" target="_blank" class="qa-item">
									<div class="qa-icon purple">
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
									</div>
									<div>
										<div class="qa-title">Saytni ko'rish</div>
										<div class="qa-sub">Joriy holat</div>
									</div>
									<svg
										class="qa-arrow"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path d="M5 12h14M12 5l7 7-7 7" />
									</svg>
								</a>
							</div>

							<div class="progress-block">
								<div class="progress-header">
									<span class="progress-label">Nashr qilinganlar</span>
									<span class="progress-pct">
										{{
											stats.total > 0
												? Math.round((stats.published / stats.total) * 100)
												: 0
										}}%
									</span>
								</div>
								<div class="progress-bar">
									<div
										class="progress-fill"
										:style="{
											width:
												stats.total > 0
													? (stats.published / stats.total) * 100 + '%'
													: '0%',
										}"
									/>
								</div>
								<div class="progress-sub">
									{{ stats.published }} / {{ stats.total }} task nashr qilingan
								</div>
							</div>
						</div>
					</div>
				</template>
			</main>
		</div>
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
	max-width: 180px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
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
}
.dot-ok {
	background: #22c55e;
}
.dot-error {
	background: #ef4444;
}

.dash-main {
	flex: 1;
	padding: 2rem;
	overflow-y: auto;
}

/* SKELETON */
.skeleton-header {
	height: 56px;
	background: #e2e8f0;
	border-radius: 12px;
	margin-bottom: 2rem;
	animation: skpulse 1.5s ease-in-out infinite;
}
.skeleton-card {
	height: 90px;
	background: #e2e8f0;
	border-radius: 18px;
	animation: skpulse 1.5s ease-in-out infinite;
}
.skeleton-widget {
	height: 280px;
	background: #e2e8f0;
	border-radius: 24px;
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

/* ERROR */
.db-error {
	display: flex;
	align-items: flex-start;
	gap: 1rem;
	background: #fef2f2;
	border: 1px solid #fecaca;
	border-radius: 16px;
	padding: 1.5rem;
}
.db-error svg {
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
}

.page-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 2rem;
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
.goto-tasks-btn {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background: linear-gradient(135deg, #1a56db, #1e40af);
	color: #fff;
	padding: 0.65rem 1.25rem;
	border-radius: 12px;
	text-decoration: none;
	font-size: 0.78rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	box-shadow: 0 4px 16px rgba(26, 86, 219, 0.3);
	transition: all 0.2s;
}
.goto-tasks-btn svg {
	width: 14px;
	height: 14px;
}
.goto-tasks-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 24px rgba(26, 86, 219, 0.4);
}

.stats-row {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 1rem;
	margin-bottom: 1.5rem;
}
.stat-card {
	background: #fff;
	border: 1px solid #f1f5f9;
	border-radius: 18px;
	padding: 1.25rem;
	display: flex;
	align-items: center;
	gap: 1rem;
	transition:
		transform 0.2s,
		box-shadow 0.2s;
}
.stat-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.stat-icon {
	width: 44px;
	height: 44px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.stat-icon svg {
	width: 18px;
	height: 18px;
}
.stat-icon.blue {
	background: #eff6ff;
	color: #1a56db;
}
.stat-icon.green {
	background: #f0fdf4;
	color: #16a34a;
}
.stat-icon.amber {
	background: #fffbeb;
	color: #d97706;
}
.stat-icon.purple {
	background: #faf5ff;
	color: #7c3aed;
}
.stat-num {
	font-size: 1.5rem;
	font-weight: 900;
	color: #0f172a;
	letter-spacing: -0.03em;
	line-height: 1;
}
.stat-lbl {
	font-size: 0.7rem;
	font-weight: 700;
	color: #94a3b8;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	margin-top: 0.25rem;
}

.bottom-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.5rem;
}
.widget-card {
	background: #fff;
	border: 1px solid #f1f5f9;
	border-radius: 24px;
	overflow: hidden;
}
.widget-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1.25rem 1.5rem;
	border-bottom: 1px solid #f1f5f9;
}
.widget-title {
	font-size: 0.9rem;
	font-weight: 900;
	color: #0f172a;
}
.widget-link {
	display: flex;
	align-items: center;
	gap: 0.35rem;
	font-size: 0.72rem;
	font-weight: 700;
	color: #1a56db;
	text-decoration: none;
	transition: gap 0.2s;
}
.widget-link svg {
	width: 12px;
	height: 12px;
}
.widget-link:hover {
	gap: 0.55rem;
}

.recent-empty {
	padding: 2rem 1.5rem;
	text-align: center;
	font-size: 0.82rem;
	color: #94a3b8;
}
.recent-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 1.5rem;
	border-bottom: 1px solid #f8fafc;
	transition: background 0.15s;
}
.recent-row:last-child {
	border-bottom: none;
}
.recent-row:hover {
	background: #f8fafc;
}
.recent-title {
	font-size: 0.85rem;
	font-weight: 700;
	color: #0f172a;
	margin-bottom: 0.2rem;
}
.recent-slug {
	font-size: 0.7rem;
	color: #94a3b8;
	font-family: monospace;
}
.recent-right {
	display: flex;
	align-items: center;
	gap: 0.6rem;
}
.status-badge {
	padding: 0.25rem 0.65rem;
	border-radius: 20px;
	font-size: 0.62rem;
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
.recent-edit {
	width: 28px;
	height: 28px;
	border-radius: 8px;
	background: #f8fafc;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #94a3b8;
	text-decoration: none;
	transition: all 0.2s;
	flex-shrink: 0;
}
.recent-edit svg {
	width: 13px;
	height: 13px;
}
.recent-edit:hover {
	background: #05080f;
	color: #60a5fa;
}

.quick-actions {
	border-bottom: 1px solid #f1f5f9;
}
.qa-item {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem 1.5rem;
	text-decoration: none;
	transition: background 0.15s;
	border-bottom: 1px solid #f8fafc;
}
.qa-item:last-child {
	border-bottom: none;
}
.qa-item:hover {
	background: #f8fafc;
}
.qa-icon {
	width: 36px;
	height: 36px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.qa-icon svg {
	width: 16px;
	height: 16px;
}
.qa-icon.blue {
	background: #eff6ff;
	color: #1a56db;
}
.qa-icon.green {
	background: #f0fdf4;
	color: #16a34a;
}
.qa-icon.purple {
	background: #faf5ff;
	color: #7c3aed;
}
.qa-title {
	font-size: 0.85rem;
	font-weight: 700;
	color: #0f172a;
	margin-bottom: 0.15rem;
}
.qa-sub {
	font-size: 0.72rem;
	color: #94a3b8;
	font-weight: 500;
}
.qa-arrow {
	width: 14px;
	height: 14px;
	color: #cbd5e1;
	margin-left: auto;
	flex-shrink: 0;
	transition: transform 0.2s;
}
.qa-item:hover .qa-arrow {
	transform: translateX(3px);
	color: #1a56db;
}

.progress-block {
	padding: 1.25rem 1.5rem;
}
.progress-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 0.6rem;
}
.progress-label {
	font-size: 0.72rem;
	font-weight: 700;
	color: #64748b;
	text-transform: uppercase;
	letter-spacing: 0.08em;
}
.progress-pct {
	font-size: 0.72rem;
	font-weight: 800;
	color: #1a56db;
}
.progress-bar {
	height: 6px;
	background: #f1f5f9;
	border-radius: 4px;
	overflow: hidden;
	margin-bottom: 0.5rem;
}
.progress-fill {
	height: 100%;
	background: linear-gradient(90deg, #1a56db, #7c3aed);
	border-radius: 4px;
	transition: width 0.8s ease;
}
.progress-sub {
	font-size: 0.7rem;
	color: #94a3b8;
	font-weight: 500;
}

@media (max-width: 1024px) {
	.stats-row {
		grid-template-columns: repeat(2, 1fr);
	}
	.bottom-grid {
		grid-template-columns: 1fr;
	}
}
</style>
