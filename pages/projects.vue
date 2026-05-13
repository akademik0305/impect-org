<script setup>
import { projects } from '~/data/siteContent'

const categories = [
  'Barchasi',
  'Iqtisodiy rivojlanish',
  "Ta'lim",
  'Atrof-muhit',
  "Sog'liqni saqlash",
  "Qishloq xo'jaligi",
  'Bandlik',
  'Madaniyat',
  'Energetika',
]

const statuses = [
  { value: 'all', label: 'Barchasi' },
  { value: 'active', label: 'Faol' },
  { value: 'completed', label: 'Tugallangan' },
  { value: 'planning', label: 'Rejalashtirilmoqda' },
]

const selectedCategory = ref('Barchasi')
const selectedStatus = ref('all')
const searchQuery = ref('')

const filteredProjects = computed(() => {
  let list = projects
  if (selectedCategory.value !== 'Barchasi') {
    list = list.filter((p) => p.category === selectedCategory.value)
  }
  if (selectedStatus.value !== 'all') {
    list = list.filter((p) => p.status === selectedStatus.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q)
        || p.description.toLowerCase().includes(q)
        || p.region.toLowerCase().includes(q),
    )
  }
  return list
})

const statusLabel = (s) => {
  const m = { active: 'Faol', completed: 'Tugallangan', planning: 'Rejalashtirilmoqda' }
  return m[s] || s
}
</script>

<template>
  <div>
    <header class="border-b border-neutral-200/90 bg-white/95 py-12 sm:py-16">
      <div class="container max-w-2xl">
        <h1 class="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          Loyihalar
        </h1>
        <p class="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
          Faol dasturlar, hamkorlar va natijalar — qisqa, aniq kartochkalar.
        </p>
      </div>
    </header>

    <section class="border-b border-neutral-200/80 py-8">
      <div class="container">
        <div class="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Qidirish..."
            class="min-h-10 w-full border border-neutral-200 bg-white px-3 text-sm focus:border-neutral-900 focus:outline-none lg:max-w-xs"
          >
          <select
            v-model="selectedCategory"
            class="min-h-10 w-full border border-neutral-200 bg-white px-3 text-sm focus:border-neutral-900 focus:outline-none lg:w-48"
          >
            <option v-for="c in categories" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
          <select
            v-model="selectedStatus"
            class="min-h-10 w-full border border-neutral-200 bg-white px-3 text-sm focus:border-neutral-900 focus:outline-none lg:w-48"
          >
            <option v-for="s in statuses" :key="s.value" :value="s.value">
              {{ s.label }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <section class="py-12 sm:py-16">
      <div class="container">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="project in filteredProjects"
            :key="project.id"
            class="flex flex-col border border-neutral-200/90 bg-white"
          >
            <div class="relative aspect-[16/10] overflow-hidden">
              <img
                :src="project.image"
                :alt="project.title"
                class="h-full w-full object-cover"
                width="900"
                height="560"
              >
              <span class="absolute right-3 top-3 bg-white/95 px-2 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-neutral-800">
                {{ statusLabel(project.status) }}
              </span>
            </div>
            <div class="flex flex-1 flex-col p-5">
              <div class="flex items-center justify-between gap-2 text-xs text-neutral-500">
                <span>{{ project.category }}</span>
                <span>{{ project.budget }}</span>
              </div>
              <h2 class="mt-2 text-base font-medium text-neutral-900">
                {{ project.title }}
              </h2>
              <p class="mt-2 line-clamp-3 flex-1 text-sm text-neutral-600">
                {{ project.description }}
              </p>
              <div class="mt-4 h-px w-full bg-neutral-100">
                <div class="h-px bg-neutral-900" :style="{ width: `${project.progress}%` }" />
              </div>
              <p class="mt-2 text-xs text-neutral-500">
                {{ project.progress }}% bajarildi
              </p>
              <NuxtLink
                :to="`/projects/${project.slug}`"
                class="mt-4 inline-flex min-h-10 items-center justify-center border border-neutral-900 px-4 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
              >
                Batafsil
              </NuxtLink>
            </div>
          </article>
        </div>
        <p v-if="filteredProjects.length === 0" class="mt-12 text-center text-sm text-neutral-500">
          Loyiha topilmadi.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
