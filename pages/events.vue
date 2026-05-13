<script setup>
import { events } from '~/data/siteContent'

const categories = [
  'Barchasi',
  'Iqtisodiyot',
  'Texnologiya',
  "Ta'lim",
  'Atrof-muhit',
  "Sog'liq",
  "Qishloq xo'jaligi",
  'Ijtimoiy siyosat',
]

const types = [
  'Barchasi',
  'Konferensiya',
  'Seminar',
  'Uchrashuv',
  'Ustalar sinfi',
  'Sammit',
  'Panel muhokamasi',
  'Davra suhbati',
]

const selectedCategory = ref('Barchasi')
const selectedType = ref('Barchasi')
const searchQuery = ref('')

const filteredEvents = computed(() => {
  let list = events
  if (selectedCategory.value !== 'Barchasi') {
    list = list.filter((e) => e.category === selectedCategory.value)
  }
  if (selectedType.value !== 'Barchasi') {
    list = list.filter((e) => e.type === selectedType.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (e) =>
        e.title.toLowerCase().includes(q)
        || e.description.toLowerCase().includes(q)
        || e.location.toLowerCase().includes(q)
        || e.speakers.some((s) => s.toLowerCase().includes(q)),
    )
  }
  return [...list].sort((a, b) => new Date(a.date) - new Date(b.date))
})

const featuredEvents = computed(() => events.filter((e) => e.featured))

const upcomingEvents = computed(() =>
  filteredEvents.value.filter((e) => new Date(e.date) >= new Date()),
)

const pastEvents = computed(() =>
  filteredEvents.value.filter((e) => new Date(e.date) < new Date()),
)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const regTone = (event) => {
  const pct = (event.registered / event.capacity) * 100
  if (pct >= 90) return 'text-red-600'
  if (pct >= 70) return 'text-amber-600'
  return 'text-emerald-700'
}
</script>

<template>
  <div>
    <header class="border-b border-neutral-200/90 bg-white/95 py-12 sm:py-16">
      <div class="container max-w-2xl">
        <h1 class="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          Tadbirlar
        </h1>
        <p class="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
          Forumlar, seminarlar va uchrashuvlar — batafsil sahifada dastur va spikerlar.
        </p>
      </div>
    </header>

    <section class="py-12 sm:py-16">
      <div class="container">
        <h2 class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Tanlangan
        </h2>
        <div class="mt-6 grid gap-6 md:grid-cols-2">
          <article
            v-for="event in featuredEvents"
            :key="event.id"
            class="border border-neutral-200/90 bg-white"
          >
            <div class="aspect-[2/1] overflow-hidden md:aspect-[16/9]">
              <img
                :src="event.image"
                :alt="event.title"
                class="h-full w-full object-cover"
                width="900"
                height="450"
              >
            </div>
            <div class="p-5">
              <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span class="text-neutral-500">{{ event.category }}</span>
                <span :class="regTone(event)">{{ event.registered }}/{{ event.capacity }}</span>
              </div>
              <h3 class="mt-2 text-lg font-medium text-neutral-900">
                {{ event.title }}
              </h3>
              <p class="mt-2 line-clamp-2 text-sm text-neutral-600">
                {{ event.description }}
              </p>
              <p class="mt-3 text-xs text-neutral-500">
                {{ formatDate(event.date) }}, {{ event.time }} · {{ event.location }}
              </p>
              <div class="mt-4 flex flex-wrap gap-2">
                <NuxtLink
                  :to="`/events/${event.slug}`"
                  class="inline-flex min-h-10 flex-1 items-center justify-center bg-neutral-900 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 sm:flex-none"
                >
                  Batafsil
                </NuxtLink>
                <NuxtLink
                  :to="`/events/${event.slug}`"
                  class="inline-flex min-h-10 flex-1 items-center justify-center border border-neutral-200 px-4 text-sm font-medium text-neutral-900 transition hover:border-neutral-900 sm:flex-none"
                >
                  Ro'yxatdan o'tish
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="border-t border-neutral-200/80 py-8">
      <div class="container">
        <div class="flex flex-col gap-3 lg:flex-row lg:flex-wrap">
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
            v-model="selectedType"
            class="min-h-10 w-full border border-neutral-200 bg-white px-3 text-sm focus:border-neutral-900 focus:outline-none lg:w-48"
          >
            <option v-for="t in types" :key="t" :value="t">
              {{ t }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <section class="py-12 sm:py-16">
      <div class="container">
        <h2 class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Kelayotganlar
        </h2>
        <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="event in upcomingEvents"
            :key="event.id"
            class="flex flex-col border border-neutral-200/90 bg-white"
          >
            <div class="aspect-[16/10] overflow-hidden">
              <img
                :src="event.image"
                :alt="event.title"
                class="h-full w-full object-cover"
                width="640"
                height="400"
              >
            </div>
            <div class="flex flex-1 flex-col p-5">
              <div class="flex justify-between text-xs text-neutral-500">
                <span>{{ event.category }}</span>
                <span>{{ event.type }}</span>
              </div>
              <h3 class="mt-2 text-base font-medium text-neutral-900">
                {{ event.title }}
              </h3>
              <p class="mt-2 line-clamp-2 flex-1 text-sm text-neutral-600">
                {{ event.description }}
              </p>
              <p class="mt-3 text-xs text-neutral-500">
                {{ formatDate(event.date) }} · {{ event.location }}
              </p>
              <NuxtLink
                :to="`/events/${event.slug}`"
                class="mt-4 inline-flex min-h-10 items-center justify-center border border-neutral-900 px-4 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
              >
                Batafsil
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section v-if="pastEvents.length" class="border-t border-neutral-200/80 py-12 sm:py-16">
      <div class="container">
        <h2 class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          O'tganlar
        </h2>
        <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="event in pastEvents"
            :key="event.id"
            class="border border-neutral-200/60 bg-neutral-50/80"
          >
            <div class="aspect-[16/10] overflow-hidden opacity-90">
              <img
                :src="event.image"
                :alt="event.title"
                class="h-full w-full object-cover grayscale"
                width="640"
                height="400"
              >
            </div>
            <div class="p-5">
              <h3 class="text-base font-medium text-neutral-800">
                {{ event.title }}
              </h3>
              <p class="mt-2 text-xs text-neutral-500">
                {{ formatDate(event.date) }}
              </p>
              <NuxtLink
                :to="`/events/${event.slug}`"
                class="mt-4 inline-block text-sm font-medium text-neutral-800 underline-offset-4 hover:underline"
              >
                Materiallar
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
