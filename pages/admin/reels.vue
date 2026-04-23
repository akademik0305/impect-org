<script setup>
definePageMeta({ middleware: 'admin-auth' })

const supabase = useSupabaseClient()
const { locale } = useI18n()

// ── STATE ─────────────────────────────────────────────────
const reels = ref([])
const dbLoading = ref(true)
const dbError = ref(null)
const saving = ref(false)

// ── SUPABASE: YUKLASH ─────────────────────────────────────
onMounted(async () => {
  const { data, error } = await supabase
    .from('reels')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    dbError.value = error.message
  } else {
    reels.value = data ?? []
  }
  dbLoading.value = false
})

// ── LOGOUT ────────────────────────────────────────────────
const user = useSupabaseUser()

async function logout() {
  await supabase.auth.signOut()
  await navigateTo('/admin/login')
}

// ── YANGI REEL QO'SHISH ───────────────────────────────────
const showAddModal = ref(false)
const addLoading = ref(false)
const addError = ref('')
const addForm = ref({
  video_id: '',
  title_uz: '',
  title_ru: '',
  title_en: '',
  active: true,
})

function openAddModal() {
  addForm.value = { video_id: '', title_uz: '', title_ru: '', title_en: '', active: true }
  addError.value = ''
  showAddModal.value = true
}
function closeAddModal() { showAddModal.value = false }

// YouTube URL dan video ID ajratib olish
// watch?v=ID | youtu.be/ID | shorts/ID | live/ID | embed/ID | to'g'ri ID
function extractVideoId(input) {
  if (!input) return ''
  const s = input.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s
  const pattern = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const m = s.match(pattern)
  return m ? m[1] : s
}

// Debounce: foydalanuvchi URL yozishni tugatgandan keyin ID ajrat
let extractTimer = null
watch(() => addForm.value.video_id, (val) => {
  clearTimeout(extractTimer)
  if (val && (val.includes('/') || val.includes('youtube') || val.includes('youtu.be'))) {
    extractTimer = setTimeout(() => {
      const extracted = extractVideoId(val)
      if (extracted !== val) {
        addForm.value.video_id = extracted
      }
    }, 400)
  }
})

async function handleAdd() {
  if (!addForm.value.video_id) {
    addError.value = 'YouTube video ID majburiy'
    return
  }
  if (!addForm.value.title_uz) {
    addError.value = 'UZ sarlavha majburiy'
    return
  }
  addLoading.value = true

  const newOrder = reels.value.length

  const { data, error } = await supabase
    .from('reels')
    .insert({
      video_id: addForm.value.video_id,
      title_uz: addForm.value.title_uz,
      title_ru: addForm.value.title_ru,
      title_en: addForm.value.title_en,
      active: addForm.value.active,
      order_index: newOrder,
    })
    .select()
    .single()

  if (error) {
    addError.value = error.message
    addLoading.value = false
    return
  }

  reels.value.push(data)
  addLoading.value = false
  closeAddModal()
}

// ── TAHRIRLASH (inline) ────────────────────────────────────
const editingId = ref(null)
const editForm = ref({})

function startEdit(reel) {
  editingId.value = reel.id
  editForm.value = { ...reel }
}
function cancelEdit() {
  editingId.value = null
  editForm.value = {}
}

async function saveEdit() {
  saving.value = true
  const { error } = await supabase
    .from('reels')
    .update({
      video_id: editForm.value.video_id,
      title_uz: editForm.value.title_uz,
      title_ru: editForm.value.title_ru,
      title_en: editForm.value.title_en,
      active: editForm.value.active,
    })
    .eq('id', editingId.value)

  if (!error) {
    const idx = reels.value.findIndex(r => r.id === editingId.value)
    if (idx !== -1) reels.value[idx] = { ...reels.value[idx], ...editForm.value }
    cancelEdit()
  }
  saving.value = false
}

// ── AKTIV/NOFAOL TOGGLE ────────────────────────────────────
async function toggleActive(reel) {
  const newVal = !reel.active
  const { error } = await supabase
    .from('reels')
    .update({ active: newVal })
    .eq('id', reel.id)

  if (!error) {
    const idx = reels.value.findIndex(r => r.id === reel.id)
    if (idx !== -1) reels.value[idx].active = newVal
  }
}

// ── O'CHIRISH ─────────────────────────────────────────────
const deleteTarget = ref(null)
const deleteLoading = ref(false)

function openDeleteModal(reel) { deleteTarget.value = reel }
function closeDeleteModal() { deleteTarget.value = null }

async function handleDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true

  const { error } = await supabase
    .from('reels')
    .delete()
    .eq('id', deleteTarget.value.id)

  if (!error) {
    reels.value = reels.value.filter(r => r.id !== deleteTarget.value.id)
    // order_index ni qayta tartibla
    reels.value.forEach((r, i) => r.order_index = i)
  }
  deleteLoading.value = false
  closeDeleteModal()
}

// ── TARTIB O'ZGARTIRISH (up/down) ─────────────────────────
async function moveUp(index) {
  if (index === 0) return
  const arr = [...reels.value]
  ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
  arr.forEach((r, i) => r.order_index = i)
  reels.value = arr
  await syncOrder()
}

async function moveDown(index) {
  if (index === reels.value.length - 1) return
  const arr = [...reels.value]
  ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
  arr.forEach((r, i) => r.order_index = i)
  reels.value = arr
  await syncOrder()
}

async function syncOrder() {
  // Har bir reelning yangi tartibini Supabase ga yuborish
  const updates = reels.value.map(r =>
    supabase.from('reels').update({ order_index: r.order_index }).eq('id', r.id)
  )
  await Promise.all(updates)
}

// ── YOUTUBE PREVIEW URL ───────────────────────────────────
function thumbUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
}

function embedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`
}

// Aktiv reellar soni
const activeCount = computed(() => reels.value.filter(r => r.active).length)

// Lokalizatsiya
function getTitle(reel) {
  return reel[`title_${locale.value}`] || reel.title_uz || reel.video_id
}
</script>

<template>
  <div class="dash">

    <!-- TOPBAR -->
    <header class="topbar">
      <div class="topbar-left">
        <div class="topbar-logo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <span class="topbar-title">TARAQQIYOT</span>
          <span class="topbar-badge">Admin</span>
        </div>
      </div>
      <div class="topbar-right">
        <div class="topbar-user">
          <div class="user-avatar">{{ user?.email?.[0]?.toUpperCase() ?? 'A' }}</div>
          <span class="user-name">{{ user?.email ?? 'Admin' }}</span>
        </div>
        <button class="logout-btn" @click="logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </NuxtLink>
          <NuxtLink to="/admin/tasks" class="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Tasklar
          </NuxtLink>
          <NuxtLink to="/admin/reels" class="nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            Reels
          </NuxtLink>
        </nav>
        <div class="sidebar-info">
          <span class="info-dot" :class="dbError ? 'dot-error' : 'dot-ok'" />
          <span>{{ dbError ? 'Ulanishda xato' : 'Supabase ulangan' }}</span>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="dash-main">

        <!-- Loading -->
        <template v-if="dbLoading">
          <div class="skeleton-header" />
          <div class="reels-grid">
            <div v-for="n in 4" :key="n" class="skeleton-reel" />
          </div>
        </template>

        <!-- Error -->
        <div v-else-if="dbError" class="db-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <p class="db-error-title">Supabase ga ulanishda xato</p>
            <p class="db-error-msg">{{ dbError }}</p>
          </div>
        </div>

        <!-- Content -->
        <template v-else>

          <!-- Page header -->
          <div class="page-header">
            <div>
              <p class="page-eyebrow">Kontent boshqaruvi</p>
              <h1 class="page-title">Reels</h1>
            </div>
            <button class="new-btn" @click="openAddModal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Yangi reel
            </button>
          </div>

          <!-- Stats strip -->
          <div class="stats-strip">
            <div class="strip-item">
              <span class="strip-num">{{ reels.length }}</span>
              <span class="strip-lbl">Jami</span>
            </div>
            <div class="strip-divider" />
            <div class="strip-item">
              <span class="strip-num green">{{ activeCount }}</span>
              <span class="strip-lbl">Aktiv</span>
            </div>
            <div class="strip-divider" />
            <div class="strip-item">
              <span class="strip-num amber">{{ reels.length - activeCount }}</span>
              <span class="strip-lbl">Nofaol</span>
            </div>
            <div class="strip-divider" />
            <div class="strip-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;color:#94a3b8">
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
              <span class="strip-lbl">Yuqori/quyi tugma bilan tartibni o'zgartiring</span>
            </div>
          </div>

          <!-- Reels list -->
          <div v-if="reels.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
            <p class="empty-title">Hali reel qo'shilmagan</p>
            <p class="empty-sub">YouTube video ID si bilan yangi reel qo'shing</p>
            <button class="empty-btn" @click="openAddModal">Reel qo'shish</button>
          </div>

          <div v-else class="reel-list">
            <TransitionGroup name="tl">
              <div
                v-for="(reel, i) in reels"
                :key="reel.id"
                class="reel-row"
                :class="{ inactive: !reel.active, editing: editingId === reel.id }"
              >

                <!-- Thumbnail -->
                <div class="reel-thumb">
                  <img :src="thumbUrl(reel.video_id)" :alt="getTitle(reel)" loading="lazy" />
                  <div v-if="!reel.active" class="thumb-inactive">Nofaol</div>
                </div>

                <!-- Normal view -->
                <template v-if="editingId !== reel.id">
                  <div class="reel-info">
                    <div class="reel-titles">
                      <div class="reel-title-main">
                        <span class="ldot uz">UZ</span>
                        {{ reel.title_uz || '—' }}
                      </div>
                      <div class="reel-title-sub">
                        <span class="ldot ru">RU</span>
                        {{ reel.title_ru || '—' }}
                      </div>
                      <div class="reel-title-sub">
                        <span class="ldot en">EN</span>
                        {{ reel.title_en || '—' }}
                      </div>
                    </div>
                  </div>

                  <div class="reel-vid-id">
                    <svg viewBox="0 0 24 24" fill="currentColor" style="width:12px;height:12px;color:#ef4444">
                      <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                    </svg>
                    <code>{{ reel.video_id }}</code>
                    <a :href="`https://youtu.be/${reel.video_id}`" target="_blank" class="yt-link">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                      </svg>
                    </a>
                  </div>

                  <div class="reel-order">
                    <span class="order-num">{{ String(i + 1).padStart(2, '0') }}</span>
                    <div class="order-btns">
                      <button class="order-btn" :disabled="i === 0" @click="moveUp(i)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="18 15 12 9 6 15"/>
                        </svg>
                      </button>
                      <button class="order-btn" :disabled="i === reels.length - 1" @click="moveDown(i)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="reel-actions">
                    <!-- Active toggle -->
                    <button
                      class="toggle-btn"
                      :class="reel.active ? 'toggle-on' : 'toggle-off'"
                      @click="toggleActive(reel)"
                    >
                      <span class="toggle-track">
                        <span class="toggle-thumb" />
                      </span>
                      {{ reel.active ? 'Aktiv' : 'Nofaol' }}
                    </button>

                    <button class="act-btn edit" @click="startEdit(reel)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Tahrirlash
                    </button>
                    <button class="act-btn delete" @click="openDeleteModal(reel)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                      </svg>
                      O'chirish
                    </button>
                  </div>
                </template>

                <!-- Inline edit view -->
                <template v-else>
                  <div class="edit-inline">
                    <!-- Video ID -->
                    <div class="edit-field">
                      <label class="edit-label">
                        <svg viewBox="0 0 24 24" fill="currentColor" style="width:11px;height:11px;color:#ef4444">
                          <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                        </svg>
                        Video ID
                      </label>
                      <input v-model="editForm.video_id" type="text" class="edit-input mono" placeholder="dQw4w9WgXcQ" />
                    </div>
                    <!-- Sarlavhalar -->
                    <div class="edit-field">
                      <label class="edit-label"><span class="ldot uz">UZ</span></label>
                      <input v-model="editForm.title_uz" type="text" class="edit-input" placeholder="O'zbekcha sarlavha" />
                    </div>
                    <div class="edit-field">
                      <label class="edit-label"><span class="ldot ru">RU</span></label>
                      <input v-model="editForm.title_ru" type="text" class="edit-input" placeholder="Ruscha sarlavha" />
                    </div>
                    <div class="edit-field">
                      <label class="edit-label"><span class="ldot en">EN</span></label>
                      <input v-model="editForm.title_en" type="text" class="edit-input" placeholder="English title" />
                    </div>
                  </div>

                  <div class="edit-actions">
                    <button class="act-btn cancel" @click="cancelEdit">Bekor</button>
                    <button class="act-btn save" :disabled="saving" @click="saveEdit">
                      <span v-if="!saving">Saqlash</span>
                      <span v-else class="spinner" />
                    </button>
                  </div>
                </template>

              </div>
            </TransitionGroup>
          </div>

        </template>
      </main>
    </div>

    <!-- ══ YANGI REEL MODAL ══ -->
    <Transition name="overlay">
      <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
        <Transition name="mscale">
          <div v-if="showAddModal" class="modal">
            <div class="modal-header">
              <div>
                <h3 class="modal-title">Yangi reel qo'shish</h3>
                <p class="modal-sub">YouTube video ID yoki URL kiriting</p>
              </div>
              <button class="modal-close" @click="closeAddModal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="modal-body">
              <!-- Video ID / URL -->
              <div class="mfield">
                <label class="mfield-label">
                  <svg viewBox="0 0 24 24" fill="currentColor" style="width:13px;height:13px;color:#ef4444">
                    <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                  </svg>
                  YouTube URL yoki Video ID <span class="req">*</span>
                </label>
                <input
                  v-model="addForm.video_id"
                  type="text"
                  class="mfield-input mono"
                  placeholder="https://youtu.be/dQw4w9WgXcQ yoki dQw4w9WgXcQ"
                  autofocus
                />
                <p class="mfield-hint">URL kiritsangiz, ID avtomatik ajratib olinadi</p>

                <!-- Preview -->
                <div v-if="addForm.video_id" class="video-preview">
                  <img :src="thumbUrl(addForm.video_id)" alt="preview" class="preview-thumb" />
                  <div class="preview-info">
                    <code class="preview-id">{{ addForm.video_id }}</code>
                    <a :href="`https://youtu.be/${addForm.video_id}`" target="_blank" class="preview-link">
                      YouTube da ochish →
                    </a>
                  </div>
                </div>
              </div>

              <!-- UZ sarlavha -->
              <div class="mfield">
                <label class="mfield-label"><span class="ldot uz">UZ</span> O'zbekcha sarlavha <span class="req">*</span></label>
                <input v-model="addForm.title_uz" type="text" class="mfield-input" placeholder="Masalan: Loyiha taqdimoti" />
              </div>

              <!-- RU sarlavha -->
              <div class="mfield">
                <label class="mfield-label"><span class="ldot ru">RU</span> Ruscha sarlavha</label>
                <input v-model="addForm.title_ru" type="text" class="mfield-input" placeholder="Масален: Презентация проекта" />
              </div>

              <!-- EN sarlavha -->
              <div class="mfield">
                <label class="mfield-label"><span class="ldot en">EN</span> Inglizcha sarlavha</label>
                <input v-model="addForm.title_en" type="text" class="mfield-input" placeholder="Masalan: Project Presentation" />
              </div>

              <!-- Holat -->
              <div class="mfield">
                <label class="mfield-label">Holat</label>
                <div class="stoggle">
                  <button class="stoggle-btn" :class="{ active: addForm.active }" @click="addForm.active = true">
                    <span class="sdot green" /> Aktiv (saytda ko'rinadi)
                  </button>
                  <button class="stoggle-btn" :class="{ active: !addForm.active }" @click="addForm.active = false">
                    <span class="sdot amber" /> Nofaol (yashirin)
                  </button>
                </div>
              </div>

              <Transition name="err">
                <div v-if="addError" class="merror">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {{ addError }}
                </div>
              </Transition>
            </div>

            <div class="modal-footer">
              <button class="btn-cancel" @click="closeAddModal">Bekor qilish</button>
              <button class="btn-submit" :disabled="addLoading" @click="handleAdd">
                <span v-if="!addLoading" style="display:flex;align-items:center;gap:.4rem">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:13px;height:13px">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Qo'shish
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
      <div v-if="deleteTarget" class="modal-overlay" @click.self="closeDeleteModal">
        <Transition name="mscale">
          <div v-if="deleteTarget" class="modal modal-sm">
            <div class="modal-header">
              <div class="del-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
              </div>
              <button class="modal-close" @click="closeDeleteModal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <h3 class="del-title">Reelni o'chirishni tasdiqlang</h3>
              <p class="del-desc">
                <strong>{{ deleteTarget.title_uz || deleteTarget.video_id }}</strong> nomli reel
                o'chiriladi. Bu amalni qaytarib bo'lmaydi.
              </p>
              <div class="del-thumb">
                <img :src="thumbUrl(deleteTarget.video_id)" alt="" />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" @click="closeDeleteModal">Bekor qilish</button>
              <button class="btn-delete" :disabled="deleteLoading" @click="handleDelete">
                <span v-if="!deleteLoading" style="display:flex;align-items:center;gap:.4rem">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:13px;height:13px">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
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
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;900&display=swap');
*{box-sizing:border-box}
.dash{font-family:'DM Sans',sans-serif;min-height:100vh;background:#f8fafc;display:flex;flex-direction:column}

.topbar{height:60px;background:#05080f;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;position:sticky;top:0;z-index:100}
.topbar-left{display:flex;align-items:center;gap:.75rem}
.topbar-logo{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#1a56db,#7c3aed);display:flex;align-items:center;justify-content:center}
.topbar-title{color:#fff;font-weight:900;font-size:.95rem;letter-spacing:.03em}
.topbar-badge{background:rgba(26,86,219,.25);color:#60a5fa;font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.15em;padding:.2rem .6rem;border-radius:20px;margin-left:.5rem;border:1px solid rgba(26,86,219,.3)}
.topbar-right{display:flex;align-items:center;gap:1rem}
.topbar-user{display:flex;align-items:center;gap:.5rem}
.user-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#1a56db,#7c3aed);display:flex;align-items:center;justify-content:center;color:#fff;font-size:.7rem;font-weight:900}
.user-name{color:#94a3b8;font-size:.8rem;font-weight:600;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.logout-btn{display:flex;align-items:center;gap:.4rem;background:none;border:1px solid rgba(255,255,255,.1);color:#64748b;padding:.4rem .9rem;border-radius:8px;cursor:pointer;font-size:.75rem;font-weight:700;font-family:inherit;transition:all .2s}
.logout-btn svg{width:14px;height:14px}
.logout-btn:hover{color:#fff;border-color:rgba(255,255,255,.2)}

.dash-body{display:flex;flex:1;min-height:calc(100vh - 60px)}

.sidebar{width:220px;background:#05080f;border-right:1px solid rgba(255,255,255,.06);display:flex;flex-direction:column;justify-content:space-between;padding:1.5rem 1rem;position:sticky;top:60px;height:calc(100vh - 60px)}
.sidebar-nav{display:flex;flex-direction:column;gap:.25rem}
.nav-item{display:flex;align-items:center;gap:.75rem;padding:.7rem 1rem;border-radius:12px;color:#475569;font-size:.8rem;font-weight:700;text-decoration:none;transition:all .2s}
.nav-item svg{width:16px;height:16px}
.nav-item:hover{background:rgba(255,255,255,.05);color:#94a3b8}
.nav-item.active{background:rgba(26,86,219,.15);color:#60a5fa;border:1px solid rgba(26,86,219,.2)}
.sidebar-info{display:flex;align-items:center;gap:.5rem;font-size:.65rem;color:#1e3a5f;font-weight:700}
.info-dot{width:6px;height:6px;border-radius:50%}
.dot-ok{background:#22c55e}
.dot-error{background:#ef4444}

.dash-main{flex:1;padding:2rem;overflow-y:auto}

/* SKELETON */
.skeleton-header{height:56px;background:#e2e8f0;border-radius:12px;margin-bottom:1.5rem;animation:skpulse 1.5s ease-in-out infinite}
.reels-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
.skeleton-reel{height:200px;background:#e2e8f0;border-radius:18px;animation:skpulse 1.5s ease-in-out infinite}
@keyframes skpulse{0%,100%{opacity:1}50%{opacity:.4}}

/* ERROR */
.db-error{display:flex;align-items:flex-start;gap:1rem;background:#fef2f2;border:1px solid #fecaca;border-radius:16px;padding:1.5rem}
.db-error svg{width:22px;height:22px;color:#ef4444;flex-shrink:0;margin-top:2px}
.db-error-title{font-size:.9rem;font-weight:800;color:#dc2626;margin-bottom:.25rem}
.db-error-msg{font-size:.78rem;color:#ef4444;font-family:monospace}

/* PAGE HEADER */
.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem}
.page-eyebrow{font-size:.72rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:.3rem}
.page-title{font-size:1.75rem;font-weight:900;color:#0f172a;letter-spacing:-.03em}
.new-btn{display:flex;align-items:center;gap:.5rem;background:linear-gradient(135deg,#1a56db,#1e40af);color:#fff;padding:.65rem 1.25rem;border-radius:12px;border:none;cursor:pointer;font-size:.78rem;font-weight:800;font-family:inherit;text-transform:uppercase;letter-spacing:.08em;box-shadow:0 4px 16px rgba(26,86,219,.3);transition:all .2s}
.new-btn svg{width:14px;height:14px}
.new-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(26,86,219,.4)}

/* STATS STRIP */
.stats-strip{display:flex;align-items:center;gap:1.25rem;background:#fff;border:1px solid #f1f5f9;border-radius:16px;padding:.9rem 1.25rem;margin-bottom:1.5rem}
.strip-item{display:flex;align-items:center;gap:.5rem}
.strip-num{font-size:1.1rem;font-weight:900;color:#0f172a;line-height:1}
.strip-num.green{color:#16a34a}
.strip-num.amber{color:#d97706}
.strip-lbl{font-size:.72rem;font-weight:600;color:#94a3b8}
.strip-divider{width:1px;height:20px;background:#f1f5f9}

/* REEL LIST */
.reel-list{display:flex;flex-direction:column;gap:.75rem}
.reel-row{background:#fff;border:1px solid #f1f5f9;border-radius:18px;padding:1rem 1.25rem;display:flex;align-items:center;gap:1.25rem;transition:all .2s}
.reel-row:hover{box-shadow:0 4px 16px rgba(0,0,0,.05)}
.reel-row.inactive{opacity:.6;background:#fafafa}
.reel-row.editing{border-color:#1a56db;background:#eff6ff}

/* THUMBNAIL */
.reel-thumb{width:80px;height:52px;border-radius:10px;overflow:hidden;flex-shrink:0;position:relative;background:#f1f5f9}
.reel-thumb img{width:100%;height:100%;object-fit:cover}
.thumb-inactive{position:absolute;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:.08em}

/* REEL INFO */
.reel-info{flex:1;min-width:0}
.reel-titles{display:flex;flex-direction:column;gap:.2rem}
.reel-title-main{display:flex;align-items:center;gap:.4rem;font-size:.88rem;font-weight:700;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.reel-title-sub{display:flex;align-items:center;gap:.4rem;font-size:.75rem;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* VIDEO ID */
.reel-vid-id{display:flex;align-items:center;gap:.4rem;flex-shrink:0}
.reel-vid-id code{font-size:.72rem;font-family:monospace;color:#475569;background:#f8fafc;padding:.2rem .5rem;border-radius:5px}
.yt-link{width:22px;height:22px;border-radius:6px;background:#f8fafc;display:flex;align-items:center;justify-content:center;color:#94a3b8;transition:all .2s}
.yt-link svg{width:11px;height:11px}
.yt-link:hover{background:#fee2e2;color:#ef4444}

/* ORDER */
.reel-order{display:flex;align-items:center;gap:.5rem;flex-shrink:0}
.order-num{font-size:.75rem;font-weight:900;color:#cbd5e1;letter-spacing:.05em;min-width:22px}
.order-btns{display:flex;flex-direction:column;gap:2px}
.order-btn{width:22px;height:18px;border-radius:5px;border:1px solid #f1f5f9;background:#f8fafc;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#94a3b8;transition:all .2s;padding:0}
.order-btn svg{width:10px;height:10px}
.order-btn:hover:not(:disabled){background:#05080f;color:#60a5fa;border-color:#05080f}
.order-btn:disabled{opacity:.3;cursor:not-allowed}

/* ACTIONS */
.reel-actions{display:flex;align-items:center;gap:.5rem;flex-shrink:0}

/* TOGGLE */
.toggle-btn{display:flex;align-items:center;gap:.5rem;padding:.35rem .7rem;border-radius:20px;border:none;cursor:pointer;font-size:.68rem;font-weight:800;font-family:inherit;text-transform:uppercase;letter-spacing:.06em;transition:all .2s}
.toggle-track{width:28px;height:16px;border-radius:8px;position:relative;transition:background .2s;flex-shrink:0}
.toggle-thumb{position:absolute;top:2px;width:12px;height:12px;border-radius:50%;background:#fff;transition:left .2s;left:2px}
.toggle-on{background:#f0fdf4;color:#16a34a}
.toggle-on .toggle-track{background:#16a34a}
.toggle-on .toggle-thumb{left:14px}
.toggle-off{background:#fffbeb;color:#d97706}
.toggle-off .toggle-track{background:#d97706}

.act-btn{display:flex;align-items:center;gap:.3rem;padding:.4rem .75rem;border-radius:9px;font-size:.68rem;font-weight:800;text-decoration:none;text-transform:uppercase;letter-spacing:.04em;transition:all .2s;border:none;cursor:pointer;font-family:inherit}
.act-btn svg{width:11px;height:11px}
.act-btn.edit{background:#05080f;color:#60a5fa}
.act-btn.edit:hover{background:#1a56db;color:#fff}
.act-btn.delete{background:#fff0f0;color:#ef4444}
.act-btn.delete:hover{background:#ef4444;color:#fff}
.act-btn.cancel{background:#f1f5f9;color:#64748b}
.act-btn.cancel:hover{background:#e2e8f0}
.act-btn.save{background:linear-gradient(135deg,#1a56db,#1e40af);color:#fff;box-shadow:0 2px 8px rgba(26,86,219,.3)}
.act-btn.save:disabled{opacity:.7;cursor:not-allowed}

/* INLINE EDIT */
.edit-inline{display:flex;align-items:center;gap:.75rem;flex:1;flex-wrap:wrap}
.edit-field{display:flex;align-items:center;gap:.4rem}
.edit-label{display:flex;align-items:center;gap:.3rem;flex-shrink:0}
.edit-input{background:#fff;border:1.5px solid #e2e8f0;border-radius:8px;padding:.4rem .7rem;font-size:.82rem;font-family:inherit;color:#0f172a;outline:none;transition:border-color .2s;width:160px}
.edit-input.mono{font-family:monospace;width:130px}
.edit-input:focus{border-color:#1a56db}
.edit-actions{display:flex;gap:.5rem;flex-shrink:0}

/* LANG DOTS */
.ldot{display:inline-flex;align-items:center;justify-content:center;width:20px;height:14px;border-radius:3px;font-size:.55rem;font-weight:900;text-transform:uppercase;flex-shrink:0}
.ldot.uz{background:#eff6ff;color:#1a56db}
.ldot.ru{background:#fef3c7;color:#d97706}
.ldot.en{background:#f0fdf4;color:#16a34a}

/* EMPTY */
.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem 2rem;text-align:center;background:#fff;border-radius:24px;border:1px solid #f1f5f9}
.empty-icon{width:56px;height:56px;border-radius:16px;background:#f8fafc;border:1px solid #f1f5f9;display:flex;align-items:center;justify-content:center;margin-bottom:1rem}
.empty-icon svg{width:24px;height:24px;color:#cbd5e1}
.empty-title{font-size:1rem;font-weight:800;color:#334155;margin-bottom:.5rem}
.empty-sub{font-size:.82rem;color:#94a3b8;margin-bottom:1.5rem}
.empty-btn{background:#05080f;color:#60a5fa;padding:.6rem 1.5rem;border-radius:10px;border:none;cursor:pointer;font-size:.78rem;font-weight:800;font-family:inherit;text-transform:uppercase;letter-spacing:.08em;transition:all .2s}
.empty-btn:hover{background:#1a56db;color:#fff}

/* VIDEO PREVIEW */
.video-preview{display:flex;align-items:center;gap:.75rem;background:#f8fafc;border:1px solid #f1f5f9;border-radius:10px;padding:.6rem .75rem;margin-top:.5rem}
.preview-thumb{width:64px;height:40px;border-radius:6px;object-fit:cover;background:#e2e8f0;flex-shrink:0}
.preview-id{font-size:.75rem;font-family:monospace;color:#475569;display:block;margin-bottom:.2rem}
.preview-link{font-size:.72rem;color:#1a56db;font-weight:600;text-decoration:none}
.preview-link:hover{text-decoration:underline}

/* MODALS */
.modal-overlay{position:fixed;inset:0;background:rgba(5,8,15,.75);backdrop-filter:blur(8px);z-index:500;display:flex;align-items:center;justify-content:center;padding:1.5rem}
.modal{background:#fff;border-radius:24px;width:100%;max-width:520px;box-shadow:0 40px 100px rgba(0,0,0,.25);overflow:hidden}
.modal-sm{max-width:420px}
.modal-header{display:flex;align-items:flex-start;justify-content:space-between;padding:1.75rem 1.75rem 0;gap:1rem}
.modal-title{font-size:1.15rem;font-weight:900;color:#0f172a;margin-bottom:.3rem}
.modal-sub{font-size:.78rem;color:#94a3b8;font-weight:500;line-height:1.5}
.modal-close{width:32px;height:32px;border-radius:8px;border:none;background:#f8fafc;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#94a3b8;transition:all .2s;flex-shrink:0}
.modal-close svg{width:14px;height:14px}
.modal-close:hover{background:#f1f5f9;color:#334155}
.modal-body{padding:1.5rem 1.75rem;display:flex;flex-direction:column;gap:1rem}
.modal-footer{display:flex;gap:.75rem;padding:1.25rem 1.75rem;background:#f8fafc;border-top:1px solid #f1f5f9}

.mfield{display:flex;flex-direction:column;gap:.45rem}
.mfield-label{display:flex;align-items:center;gap:.4rem;font-size:.7rem;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.12em}
.req{color:#ef4444}
.mfield-input{width:100%;background:#f8fafc;border:1.5px solid #f1f5f9;border-radius:12px;padding:.75rem 1rem;font-size:.9rem;font-family:inherit;color:#0f172a;outline:none;transition:border-color .2s,background .2s}
.mfield-input.mono{font-family:monospace}
.mfield-input:focus{border-color:#1a56db;background:#fff}
.mfield-input::placeholder{color:#cbd5e1}
.mfield-hint{font-size:.7rem;color:#94a3b8;font-weight:500}

.stoggle{display:flex;gap:.5rem}
.stoggle-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.6rem;border-radius:10px;border:1.5px solid #f1f5f9;background:#f8fafc;cursor:pointer;font-size:.78rem;font-weight:700;font-family:inherit;color:#94a3b8;transition:all .2s}
.stoggle-btn.active{border-color:#1a56db;background:#eff6ff;color:#1a56db}
.sdot{width:8px;height:8px;border-radius:50%}
.sdot.amber{background:#f59e0b}
.sdot.green{background:#22c55e}
.merror{display:flex;align-items:center;gap:.5rem;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:.65rem .9rem;color:#dc2626;font-size:.78rem;font-weight:600}
.merror svg{width:14px;height:14px;flex-shrink:0}
.err-enter-active,.err-leave-active{transition:all .25s}
.err-enter-from,.err-leave-to{opacity:0;transform:translateY(-6px)}

.btn-cancel{flex:1;padding:.7rem;border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;color:#64748b;font-size:.78rem;font-weight:700;font-family:inherit;cursor:pointer;transition:all .2s}
.btn-cancel:hover{border-color:#cbd5e1;color:#334155}
.btn-submit{flex:2;display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.7rem;border-radius:10px;border:none;background:linear-gradient(135deg,#1a56db,#1e40af);color:#fff;font-size:.78rem;font-weight:800;font-family:inherit;cursor:pointer;box-shadow:0 4px 16px rgba(26,86,219,.3);transition:all .2s}
.btn-submit:hover:not(:disabled){transform:translateY(-1px)}
.btn-submit:disabled{opacity:.7;cursor:not-allowed}
.btn-delete{flex:1;display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.7rem;border-radius:10px;border:none;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;font-size:.78rem;font-weight:800;font-family:inherit;cursor:pointer;box-shadow:0 4px 16px rgba(220,38,38,.25);transition:all .2s}
.btn-delete:hover:not(:disabled){transform:translateY(-1px)}
.btn-delete:disabled{opacity:.7;cursor:not-allowed}
.spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

.del-icon{width:48px;height:48px;border-radius:14px;background:#fef2f2;display:flex;align-items:center;justify-content:center;color:#ef4444}
.del-icon svg{width:22px;height:22px}
.del-title{font-size:1.05rem;font-weight:900;color:#0f172a;margin-bottom:.75rem}
.del-desc{font-size:.85rem;color:#64748b;line-height:1.6;margin-bottom:.75rem}
.del-desc strong{color:#0f172a}
.del-thumb{width:100%;height:80px;border-radius:10px;overflow:hidden;background:#f1f5f9}
.del-thumb img{width:100%;height:100%;object-fit:cover}

.tl-enter-active{transition:all .35s ease}.tl-leave-active{transition:all .3s ease}
.tl-enter-from{opacity:0;transform:translateY(-10px)}.tl-leave-to{opacity:0;transform:translateX(20px)}
.overlay-enter-active,.overlay-leave-active{transition:opacity .25s}
.overlay-enter-from,.overlay-leave-to{opacity:0}
.mscale-enter-active,.mscale-leave-active{transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .25s}
.mscale-enter-from,.mscale-leave-to{transform:scale(.92);opacity:0}

@media(max-width:1024px){
  .reel-row{flex-wrap:wrap}
  .edit-inline{flex-direction:column;align-items:flex-start}
  .edit-input{width:100%}
}
</style>