<script setup>
import { tasksData } from '~/data/tasks'

const { t, locale } = useI18n()
const route = useRoute()
const slug = route.params.slug

const slugs = ['xaritalash', 'hamkorlik', 'salohiyat', 'advokatsiya', 'toolkit', 'rivojlanish']
const index = slugs.indexOf(slug)

if (index === -1) {
  throw createError({ statusCode: 404, statusMessage: 'Sahifa topilmadi' })
}

const heroImages = [
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1573161158365-59b7033d749d?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600',
]

const heroImage = heroImages[index]

const taskData = computed(() => {
  const lang = locale.value
  return tasksData[lang]?.find(item => item.slug === slug)
})

// Prev / Next navigation
const prevSlug = index > 0 ? slugs[index - 1] : null
const nextSlug = index < slugs.length - 1 ? slugs[index + 1] : null

// Scroll state for sticky header
const isScrolled = ref(false)
const scrollProgress = ref(0)

function onScroll() {
  const scrollY = window.scrollY
  const maxScroll = document.body.scrollHeight - window.innerHeight
  isScrolled.value = scrollY > 60
  scrollProgress.value = (scrollY / maxScroll) * 100
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-in')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )
  document.querySelectorAll('.from-top, .from-bottom, .from-left, .from-right').forEach(el => observer.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

useSeoMeta({
  title: () => taskData.value ? `${taskData.value.title} — TARAQQIYOT` : 'TARAQQIYOT',
  description: () => taskData.value?.desc ?? '',
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
      :class="isScrolled
        ? 'bg-white/90 backdrop-blur-xl border-b border-black/8 shadow-sm'
        : 'bg-transparent'"
    >
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <div class="w-32 h-auto max-h-12 rounded-xl flex items-center justify-center p-1.5">
          <img src="~/assets/images/logo/logo.png" alt="TARAQQIYOT" class="object-contain w-full" />
        </div>
      </NuxtLink>

      <!-- Back link -->
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-colors duration-200"
        :class="isScrolled ? 'text-slate-500 hover:text-slate-900' : 'text-white/80 hover:text-white'"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        {{ t('detail.back') }}
      </NuxtLink>
    </header>

    <!-- ══ HERO ══ -->
    <section class="relative min-h-[70vh] flex items-end overflow-hidden bg-[#05080f]">
      <!-- Background image -->
      <div class="absolute inset-0 z-0">
        <img
          :src="heroImage"
          :alt="taskData?.title ?? slug"
          class="w-full h-full object-cover opacity-50"
        />
        <!-- mesh overlay matching main page -->
        <div class="hero-mesh" />
        <div class="hero-grid" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#05080f] via-[#05080f]/40 to-transparent" />
      </div>

      <!-- Content -->
      <div class="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20 pt-40">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 bg-blue-600/15 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6 from-top">
          <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span class="text-blue-300 text-[10px] font-black uppercase tracking-[0.3em]">
            {{ t('detail.taskLabel') }} {{ index + 1 }} / {{ slugs.length }}
          </span>
        </div>

        <h1 class="text-white font-black text-5xl xl:text-7xl leading-[1.02] tracking-tight mb-6 from-top max-w-4xl">
          {{ taskData?.title ?? slug }}
        </h1>
        <p class="text-slate-400 text-lg leading-relaxed max-w-2xl from-top">
          {{ taskData?.desc }}
        </p>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
        <div class="w-5 h-5 border-r-2 border-b-2 border-white/30 rotate-45" />
      </div>
    </section>

    <!-- ══ CONTENT ══ -->
    <section class="py-24 px-6 bg-white">
      <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">

        <!-- Left: main sections -->
        <div class="lg:col-span-2 space-y-16">
          <div
            v-for="(section, i) in taskData?.sections"
            :key="section.heading"
            class="from-bottom"
            :style="{ animationDelay: `${i * 80}ms` }"
          >
            <!-- Heading with blue accent -->
            <div class="flex items-start gap-4 mb-5">
              <div class="w-1 h-8 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
              <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {{ section.heading }}
              </h2>
            </div>

            <p v-if="section.text" class="text-slate-500 leading-relaxed text-base mb-5 ml-5">
              {{ section.text }}
            </p>

            <ul v-if="section.list" class="space-y-3 ml-5">
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
        </div>

        <!-- Right: results sidebar -->
        <aside class="from-right space-y-6">
          <!-- Results card -->
          <div
            v-if="taskData?.results?.length"
            class="bg-slate-900 text-white rounded-3xl p-7 sticky top-28"
          >
            <p class="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
              {{ t('detail.resultsLabel') ?? 'Natijalar' }}
            </p>
            <ul class="space-y-4">
              <li
                v-for="(result, i) in taskData.results"
                :key="i"
                class="flex items-start gap-3 text-sm text-slate-300 leading-relaxed border-b border-white/8 pb-4 last:border-0 last:pb-0"
              >
                <span class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                  {{ i + 1 }}
                </span>
                {{ result }}
              </li>
            </ul>
          </div>

          <!-- Task number badge -->
          <div class="border border-slate-100 rounded-3xl p-6 text-center">
            <div class="text-6xl font-black text-slate-100 tracking-tight leading-none mb-1">
              {{ String(index + 1).padStart(2, '0') }}
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              {{ t('detail.taskLabel') }}
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
          <div class="w-10 h-10 rounded-full border border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-600 flex items-center justify-center transition-all duration-300">
            <svg class="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{{ t('detail.prev') ?? 'Oldingi' }}</p>
            <p class="text-sm font-black text-slate-900">{{ tasksData[locale]?.find(x => x.slug === prevSlug)?.title ?? prevSlug }}</p>
          </div>
        </NuxtLink>

        <div v-else class="flex-1" />

        <NuxtLink
          v-if="nextSlug"
          :to="`/projects/${nextSlug}`"
          class="group flex items-center justify-end gap-4 bg-white border border-slate-100 hover:border-blue-200 rounded-2xl px-7 py-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex-1 text-right"
        >
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{{ t('detail.next') ?? 'Keyingi' }}</p>
            <p class="text-sm font-black text-slate-900">{{ tasksData[locale]?.find(x => x.slug === nextSlug)?.title ?? nextSlug }}</p>
          </div>
          <div class="w-10 h-10 rounded-full border border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-600 flex items-center justify-center transition-all duration-300">
            <svg class="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </NuxtLink>

      </div>
    </section>

    <!-- ══ FOOTER (minimal) ══ -->
    <footer class="bg-slate-950 text-white py-10 px-6">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        <h2 class="font-black text-2xl tracking-tight text-blue-500">TARAQQIYOT.</h2>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
          {{ t('footer.copy') }}
        </p>
      </div>
    </footer>

  </main>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap");
body {
  font-family: "DM Sans", sans-serif;
}

/* ── HERO MESH (asosiy sahifa bilan bir xil) ── */
.hero-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 40%, rgba(26,86,219,0.35) 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 80% 60%, rgba(99,102,241,0.2) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 60% 20%, rgba(96,165,250,0.15) 0%, transparent 50%);
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ── SCROLL ANIMATSIYALAR ── */
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

/* ── VUE TRANSITIONS ── */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>