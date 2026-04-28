<script setup>
definePageMeta({ middleware: 'admin-auth' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// ── STATE ─────────────────────────────────────────────────
const tasks = ref([])
const dbLoading = ref(true)
const dbError = ref(null)

// ── COMPUTED ──────────────────────────────────────────────
const stats = computed(() => ({
  total: tasks.value.length,
  published: tasks.value.filter(t => t.status === 'published').length,
  draft: tasks.value.filter(t => t.status === 'draft').length,
  langs: 3,
}))

const recentTasks = computed(() => [...tasks.value].slice(0, 4))

function formatDate(d) {
  return new Date(d).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── SUPABASE: YUKLASH ─────────────────────────────────────
onMounted(async () => {
  const [tasksRes, settingsRes] = await Promise.all([
    supabase
      .from('tasks')
      .select('slug, status, uz, updated_at')
      .order('updated_at', { ascending: false }),
    supabase
      .from('settings')
      .select('value')
      .eq('key', 'active_stage')
      .single(),
  ])

  if (tasksRes.error) {
    dbError.value = tasksRes.error.message
  } else {
    tasks.value = (tasksRes.data ?? []).map(t => ({
      slug: t.slug,
      uz: t.uz?.title ?? t.slug,
      status: t.status,
      updatedAt: t.updated_at,
    }))
  }

  if (settingsRes.data?.value) {
    activeStage.value = Number(settingsRes.data.value)
  }

  dbLoading.value = false
})

// ── LOGOUT ────────────────────────────────────────────────
async function logout() {
  await supabase.auth.signOut()
  await navigateTo('/admin/login')
}

// ── AKTIV BOSQICH ─────────────────────────────────────────
const stages = [
  { id: 1, label: 'Natija 1', sub: 'Salohiyatni mustahkamlash', color: '#6c5ce7' },
  { id: 2, label: 'Natija 2', sub: "Bilim va ko'nikmalarni oshirish", color: '#a29bfe' },
  { id: 3, label: 'II-Davra suhbati', sub: 'Natijalar taqdimoti', color: '#ff758f' },
  { id: 4, label: 'Natija 3', sub: 'Barqaror hamkorlik', color: '#fab1a0' },
]

const activeStage = ref(2)
const stageLoading = ref(false)
const stageSaved = ref(false)

async function saveActiveStage(id) {
  if (activeStage.value === id) return
  stageLoading.value = true
  activeStage.value = id

  await supabase
    .from('settings')
    .upsert({ key: 'active_stage', value: String(id) }, { onConflict: 'key' })

  stageLoading.value = false
  stageSaved.value = true
  setTimeout(() => stageSaved.value = false, 2500)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">

    <!-- TOPBAR -->
    <header class="h-[60px] bg-[#05080f] border-b border-white/[0.06] flex items-center justify-between px-6 sticky top-0 z-[100]">
      <div class="flex items-center gap-3">
        <div class="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <span class="text-white font-black text-[0.95rem] tracking-[0.03em]">TARAQQIYOT</span>
          <span class="bg-blue-600/25 text-blue-400 text-[0.6rem] font-black uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full ml-2 border border-blue-600/30">Admin</span>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-[0.7rem] font-black">
            {{ user?.email?.[0]?.toUpperCase() ?? 'A' }}
          </div>
          <span class="text-slate-400 text-[0.8rem] font-semibold max-w-[180px] truncate hidden sm:block">
            {{ user?.email ?? 'Admin' }}
          </span>
        </div>
        <button
          class="flex items-center gap-1.5 border border-white/10 text-slate-500 hover:text-white hover:border-white/20 px-3.5 py-1.5 rounded-lg text-[0.75rem] font-bold transition-all duration-200"
          @click="logout"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Chiqish
        </button>
      </div>
    </header>

    <div class="flex flex-1 min-h-[calc(100vh-60px)]">

      <!-- SIDEBAR -->
      <aside class="w-[220px] bg-[#05080f] border-r border-white/[0.06] flex flex-col justify-between px-4 py-6 sticky top-[60px] h-[calc(100vh-60px)]">
        <nav class="flex flex-col gap-1">
          <NuxtLink
            to="/admin"
            class="flex items-center gap-3 px-4 py-[0.7rem] rounded-xl text-[0.8rem] font-bold text-blue-400 bg-blue-600/15 border border-blue-600/20 transition-all duration-200"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/admin/tasks"
            class="flex items-center gap-3 px-4 py-[0.7rem] rounded-xl text-[0.8rem] font-bold text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Tasklar
          </NuxtLink>
          <NuxtLink
            to="/admin/reels"
            class="flex items-center gap-3 px-4 py-[0.7rem] rounded-xl text-[0.8rem] font-bold text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            Reels
          </NuxtLink>
        </nav>
        <div class="flex items-center gap-2 text-[0.65rem] font-bold text-[#1e3a5f]">
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="dbError ? 'bg-red-500' : 'bg-green-500'"
          />
          {{ dbError ? 'Ulanishda xato' : 'Supabase ulangan' }}
        </div>
      </aside>

      <!-- MAIN -->
      <main class="flex-1 p-8 overflow-y-auto">

        <!-- Loading skeleton -->
        <template v-if="dbLoading">
          <div class="h-14 bg-slate-200 rounded-xl mb-8 animate-pulse" />
          <div class="grid grid-cols-4 gap-4 mb-6">
            <div v-for="n in 4" :key="n" class="h-[90px] bg-slate-200 rounded-[18px] animate-pulse" />
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div class="h-[280px] bg-slate-200 rounded-3xl animate-pulse" />
            <div class="h-[280px] bg-slate-200 rounded-3xl animate-pulse" />
          </div>
        </template>

        <!-- DB xato -->
        <div v-else-if="dbError" class="flex items-start gap-4 bg-red-50 border border-red-200 rounded-2xl p-6">
          <svg class="w-[22px] h-[22px] text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <p class="text-[0.9rem] font-black text-red-600 mb-1">Supabase ga ulanishda xato</p>
            <p class="text-[0.78rem] text-red-500 font-mono">{{ dbError }}</p>
          </div>
        </div>

        <!-- Asosiy kontent -->
        <template v-else>

          <!-- Page header -->
          <div class="flex items-center justify-between mb-8">
            <div>
              <p class="text-[0.72rem] font-bold text-slate-400 uppercase tracking-[0.12em] mb-1">Xush kelibsiz 👋</p>
              <h1 class="text-[1.75rem] font-black text-slate-900 tracking-tight">Dashboard</h1>
            </div>
            <NuxtLink
              to="/admin/tasks"
              class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl text-[0.78rem] font-black uppercase tracking-[0.08em] shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 hover:shadow-blue-600/40 transition-all duration-200"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Tasklarni boshqarish
            </NuxtLink>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div
              v-for="(s, i) in [
                { num: stats.total, lbl: 'Jami task', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', cls: 'bg-blue-50 text-blue-600' },
                { num: stats.published, lbl: 'Nashr qilingan', icon: 'M20 6L9 17l-5-5', cls: 'bg-green-50 text-green-600' },
                { num: stats.draft, lbl: 'Qoralama', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10', cls: 'bg-amber-50 text-amber-600' },
                { num: stats.langs, lbl: 'Faol til', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z', cls: 'bg-violet-50 text-violet-600' },
              ]"
              :key="i"
              class="bg-white border border-slate-100 rounded-[18px] p-5 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
            >
              <div :class="['w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', s.cls]">
                <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path :d="s.icon"/>
                </svg>
              </div>
              <div>
                <div class="text-2xl font-black text-slate-900 tracking-tight leading-none">{{ s.num }}</div>
                <div class="text-[0.7rem] font-bold text-slate-400 uppercase tracking-[0.1em] mt-1">{{ s.lbl }}</div>
              </div>
            </div>
          </div>

          <!-- Two column grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            <!-- Oxirgi tasklar -->
            <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden">
              <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <h2 class="text-[0.9rem] font-black text-slate-900">Oxirgi tasklar</h2>
                <NuxtLink
                  to="/admin/tasks"
                  class="flex items-center gap-1.5 text-[0.72rem] font-bold text-blue-600 hover:gap-2.5 transition-all duration-200"
                >
                  Barchasini ko'rish
                  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </NuxtLink>
              </div>
              <div>
                <div v-if="recentTasks.length === 0" class="px-6 py-8 text-center text-[0.82rem] text-slate-400">
                  Hali task qo'shilmagan
                </div>
                <div
                  v-for="task in recentTasks"
                  :key="task.slug"
                  class="flex items-center justify-between px-6 py-4 border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors duration-150"
                >
                  <div>
                    <div class="text-[0.85rem] font-bold text-slate-900 mb-0.5">{{ task.uz }}</div>
                    <div class="text-[0.7rem] text-slate-400 font-mono">{{ task.slug }}</div>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span
                      class="px-2.5 py-1 rounded-full text-[0.62rem] font-black uppercase tracking-[0.08em]"
                      :class="task.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'"
                    >
                      {{ task.status === 'published' ? 'Nashr' : 'Qoralama' }}
                    </span>
                    <NuxtLink
                      :to="`/admin/tasks/${task.slug}`"
                      class="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#05080f] hover:text-blue-400 transition-all duration-200"
                    >
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tezkor harakatlar -->
            <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden">
              <div class="px-6 py-5 border-b border-slate-100">
                <h2 class="text-[0.9rem] font-black text-slate-900">Tezkor harakatlar</h2>
              </div>

              <div class="border-b border-slate-100">
                <NuxtLink
                  v-for="item in [
                    { to: '/admin/tasks', icon: 'M12 5v14M5 12h14', title: 'Yangi task qo\'shish', sub: '3 tilda kontent yaratish', cls: 'bg-blue-50 text-blue-600' },
                    { to: '/admin/tasks', icon: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z', title: 'Tasklarni tahrirlash', sub: `${stats.total} ta task mavjud`, cls: 'bg-green-50 text-green-600' },
                    { to: '/', icon: 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3', title: 'Saytni ko\'rish', sub: 'Joriy holat', cls: 'bg-violet-50 text-violet-600', blank: true },
                  ]"
                  :key="item.title"
                  :to="item.to"
                  :target="item.blank ? '_blank' : undefined"
                  class="flex items-center gap-4 px-6 py-4 border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors duration-150"
                >
                  <div :class="['w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0', item.cls]">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path :d="item.icon"/>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-[0.85rem] font-bold text-slate-900 mb-0.5">{{ item.title }}</div>
                    <div class="text-[0.72rem] text-slate-400 font-medium">{{ item.sub }}</div>
                  </div>
                  <svg class="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </NuxtLink>
              </div>

              <!-- Progress -->
              <div class="px-6 py-5">
                <div class="flex justify-between mb-2">
                  <span class="text-[0.72rem] font-bold text-slate-500 uppercase tracking-[0.08em]">Nashr qilinganlar</span>
                  <span class="text-[0.72rem] font-black text-blue-600">
                    {{ stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0 }}%
                  </span>
                </div>
                <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div
                    class="h-full bg-gradient-to-r from-blue-600 to-violet-500 rounded-full transition-all duration-700"
                    :style="{ width: stats.total > 0 ? (stats.published / stats.total * 100) + '%' : '0%' }"
                  />
                </div>
                <p class="text-[0.7rem] text-slate-400 font-medium">
                  {{ stats.published }} / {{ stats.total }} task nashr qilingan
                </p>
              </div>
            </div>

          </div>

          <!-- AKTIV BOSQICH WIDGET -->
          <div class="bg-white border border-slate-100 rounded-3xl p-6">
            <div class="flex items-start justify-between mb-5 gap-4">
              <div>
                <h2 class="text-[0.9rem] font-black text-slate-900 mb-1">Aktiv bosqich</h2>
                <p class="text-[0.75rem] text-slate-400 font-medium">
                  Saytda qaysi bosqich "HOZIRGI BOSQICH" ko'rinishida ajralib turadi
                </p>
              </div>
              <Transition name="saved">
                <div
                  v-if="stageSaved"
                  class="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-600 text-[0.75rem] font-bold px-3.5 py-1.5 rounded-[10px] flex-shrink-0"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Saqlandi
                </div>
              </Transition>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                v-for="s in stages"
                :key="s.id"
                class="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border-[1.5px] text-left transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5 hover:enabled:shadow-md"
                :class="activeStage === s.id
                  ? 'shadow-md'
                  : 'border-slate-100 bg-slate-50 hover:enabled:border-slate-200 hover:enabled:bg-white'"
                :style="activeStage === s.id ? {
                  borderColor: s.color,
                  background: s.color + '12',
                } : {}"
                :disabled="stageLoading"
                @click="saveActiveStage(s.id)"
              >
                <!-- Dot -->
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  :style="{ background: activeStage === s.id ? s.color : '#e2e8f0' }"
                >
                  <svg v-if="activeStage === s.id" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>

                <!-- Text -->
                <div class="flex-1 min-w-0">
                  <div
                    class="text-[0.82rem] font-black truncate transition-colors duration-200"
                    :style="activeStage === s.id ? { color: s.color } : { color: '#0f172a' }"
                  >
                    {{ s.label }}
                  </div>
                  <div class="text-[0.7rem] text-slate-400 font-medium truncate mt-0.5">{{ s.sub }}</div>
                </div>

                <!-- Active badge -->
                <span
                  v-if="activeStage === s.id"
                  class="text-[0.58rem] font-black uppercase tracking-[0.1em] text-white px-2 py-0.5 rounded-full flex-shrink-0"
                  :style="{ background: s.color }"
                >
                  Aktiv
                </span>
              </button>
            </div>

            <p class="flex items-center gap-1.5 text-[0.72rem] text-slate-400 font-medium">
              <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Bosqichni bosganingizda avtomatik saqlanadi va saytda darhol yangilanadi
            </p>
          </div>

        </template>
      </main>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;900&display=swap');

.font-sans { font-family: 'DM Sans', sans-serif; }

.saved-enter-active, .saved-leave-active { transition: all 0.3s ease; }
.saved-enter-from, .saved-leave-to { opacity: 0; transform: translateY(-6px); }
</style>