<script setup lang="ts">
const { t } = useI18n()
const selectedProject = ref(null)

// 24 ta loyiha generatori
const projects = computed(() => {
  return Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    title: t(`projects.items[${i}].title`),
    tag: t(`projects.items[${i}].tag`),
    participants: t(`projects.items[${i}].participants`),
    location: t(`projects.items[${i}].location`),
    year: '2024',
    image: `https://picsum.photos/seed/${i + 70}/400/400`,
    color: ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][i % 5],
  }))
})

const openProject = (p: any) => {
  selectedProject.value = p
  document.body.style.overflow = 'hidden'
}

const closeProject = () => {
  selectedProject.value = null
  document.body.style.overflow = ''
}
</script>

<template>
  <section class="min-h-screen py-16 px-4 bg-[#02040a] relative overflow-hidden font-sans">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.1),transparent_40%)] pointer-events-none" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.1),transparent_40%)] pointer-events-none" />

    <div class="max-w-[1200px] mx-auto relative z-10">
      <div class="flex items-center justify-between mb-20 border-b border-white/5 pb-8">
        <h2 class="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
          {{ t('projects.title') }}
        </h2>
        <div class="flex gap-2">
          <div v-for="c in ['bg-cyan-500','bg-purple-500','bg-emerald-500']" :key="c" :class="['w-2 h-2 rounded-full animate-pulse', c]" />
        </div>
      </div>

      <div class="honeycomb-wrapper">
        <div class="hb-grid">
          <div
            v-for="project in projects"
            :key="project.id"
            @click="openProject(project)"
            class="hb-item group"
            :style="{ '--hb-color': project.color }"
          >
            <div class="hb-hex">
              <div class="hb-inner">
                <img :src="project.image" class="hb-img" loading="lazy" />
                <div class="hb-overlay" />
                
                <div class="hb-text">
                  <span class="hb-tag text-cyan-400">{{ project.tag }}</span>
                  <h3 class="hb-title">{{ project.title }}</h3>
                </div>
              </div>
              <div class="hb-border" />
            </div>
            <div class="hb-glow" />
          </div>
        </div>
      </div>
    </div>

    <Transition name="hex-modal">
      <div
        v-if="selectedProject"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#02040a]/80 backdrop-blur-xl"
        @click.self="closeProject"
      >
        <div
          class="relative bg-white/[0.03] border border-white/10 
                 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.7)]
                 w-full max-w-2xl rounded-[2.5rem] overflow-hidden
                 flex flex-col md:flex-row h-auto md:min-h-[450px]"
        >
          <div class="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
            <img :src="selectedProject.image" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent to-[#0a0f1a]" />
            <div class="absolute top-6 left-6 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white border border-white/20 backdrop-blur-md" :style="{ backgroundColor: selectedProject.color + '40' }">
              #{{ selectedProject.id }}
            </div>
          </div>

          <div class="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative">
            <button @click="closeProject" class="absolute top-6 right-6 text-white/30 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div class="space-y-6">
              <div>
                <span class="inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 border" :style="{ color: selectedProject.color, borderColor: selectedProject.color + '40', backgroundColor: selectedProject.color + '10' }">
                  {{ selectedProject.tag }}
                </span>
                <h3 class="text-3xl font-black text-white leading-tight uppercase italic tracking-tighter">
                  {{ selectedProject.title }}
                </h3>
              </div>

              <div class="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                <div class="space-y-1">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Participants</span>
                  <p class="text-white text-sm font-semibold">{{ selectedProject.participants }}</p>
                </div>
                <div class="space-y-1">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Location</span>
                  <p class="text-white text-sm font-semibold">{{ selectedProject.location }}</p>
                </div>
              </div>

              <button class="group flex items-center justify-between w-full p-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest transition-transform hover:scale-[0.98]">
                <span>Explore Project</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
/* ── HONEYCOMB GRID LOGIC ── */
.honeycomb-wrapper {
  --size: 140px; 
  --gap: 10px;    
  display: flex;
  justify-content: center;
  padding-bottom: 80px;
}

.hb-grid {
  display: grid;
  grid-template-columns: repeat(6, var(--size));
  grid-auto-rows: calc(var(--size) * 0.75 + var(--gap));
  gap: var(--gap);
  justify-content: center;
}

.hb-item {
  position: relative;
  width: var(--size);
  height: var(--size);
  cursor: pointer;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Har ikkinchi qatorni (7-12, 19-24...) o'ngga surish */
.hb-item:nth-child(12n+7),
.hb-item:nth-child(12n+8),
.hb-item:nth-child(12n+9),
.hb-item:nth-child(12n+10),
.hb-item:nth-child(12n+11),
.hb-item:nth-child(12n+12) {
  transform: translateX(calc(var(--size) / 2 + var(--gap) / 2));
}

.hb-item:hover {
  transform: scale(1.15) translateY(-10px) translateX(var(--extra-translate, 0));
  z-index: 50;
}

/* Hoverda translateX qiymatini saqlab qolish */
.hb-item:nth-child(12n+7):hover,
.hb-item:nth-child(12n+8):hover,
.hb-item:nth-child(12n+9):hover,
.hb-item:nth-child(12n+10):hover,
.hb-item:nth-child(12n+11):hover,
.hb-item:nth-child(12n+12):hover {
  --extra-translate: calc(var(--size) / 2 + var(--gap) / 2);
}

.hb-hex {
  width: 100%;
  height: 100%;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  position: relative;
  background: rgba(255,255,255,0.05);
}

.hb-inner {
  position: absolute;
  inset: 2px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background: #050810;
  overflow: hidden;
  z-index: 2;
}

.hb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) brightness(0.4);
  transition: all 0.7s ease;
  transform: scale(1.2);
}

.group:hover .hb-img {
  filter: grayscale(0%) brightness(0.8);
  transform: scale(1);
}

.hb-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 15%, transparent 70%);
}

.hb-border {
  position: absolute;
  inset: 0;
  background: var(--hb-color);
  opacity: 0.15;
  z-index: 1;
  transition: opacity 0.3s;
}

.group:hover .hb-border {
  opacity: 1;
}

.hb-text {
  position: absolute;
  bottom: 15%;
  left: 0;
  right: 0;
  text-align: center;
  padding: 0 8px;
  transform: translateY(10px);
  opacity: 0;
  transition: all 0.4s ease;
}

.group:hover .hb-text {
  transform: translateY(0);
  opacity: 1;
}

.hb-tag {
  display: block;
  font-size: 7px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 2px;
}

.hb-title {
  color: white;
  font-size: 9px;
  font-weight: 700;
  line-height: 1.2;
}

.hb-glow {
  position: absolute;
  inset: 15%;
  background: var(--hb-color);
  filter: blur(25px);
  opacity: 0;
  transition: opacity 0.4s;
  z-index: -1;
}

.group:hover .hb-glow {
  opacity: 0.5;
}

/* ── MODAL ANIMATIONS ── */
.hex-modal-enter-active { transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.hex-modal-leave-active { transition: all 0.3s ease-in; }
.hex-modal-enter-from { opacity: 0; }
.hex-modal-enter-from > div { transform: scale(0.8) translateY(40px); opacity: 0; }
.hex-modal-leave-to { opacity: 0; }
.hex-modal-leave-to > div { transform: scale(0.95) translateY(20px); opacity: 0; }

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .hb-grid { grid-template-columns: repeat(4, var(--size)); }
  .hb-item:nth-child(n) { transform: none !important; margin: 0; }
  .hb-item:nth-child(8n+5), .hb-item:nth-child(8n+6), .hb-item:nth-child(8n+7), .hb-item:nth-child(8n+8) {
    transform: translateX(calc(var(--size) / 2 + var(--gap) / 2)) !important;
  }
}

@media (max-width: 640px) {
  .honeycomb-wrapper { --size: 100px; }
  .hb-grid { grid-template-columns: repeat(2, var(--size)); grid-auto-rows: auto; gap: 20px; }
  .hb-item:nth-child(n) { transform: none !important; }
  .hb-hex, .hb-inner { clip-path: none; border-radius: 20px; }
  .hb-title { font-size: 11px; }
}
</style>