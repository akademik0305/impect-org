<script setup>
/**
 * Nashrlar ro'yxati — tadqiqotlar sahifasi bilan bir xil ma'lumot manbasi,
 * navigatsiyadagi «Nashrlar» havolasi uchun.
 */
import { publications } from '~/data/siteContent'

const selectedCategory = ref('Barchasi')

const categories = [
  'Barchasi',
  ...[...new Set(publications.map((p) => p.category))],
]

const list = computed(() => {
  if (selectedCategory.value === 'Barchasi') return publications
  return publications.filter((p) => p.category === selectedCategory.value)
})
</script>

<template>
  <div>
    <header class="border-b border-neutral-200/90 bg-white/95 py-12 sm:py-16">
      <div class="container flex max-w-3xl flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Nashrlar
          </h1>
          <p class="mt-3 text-sm text-neutral-600">
            Barcha nashrlar tadqiqotlar bazasidan — batafsil sahifa orqali o'qish.
          </p>
        </div>
        <select
          v-model="selectedCategory"
          class="min-h-10 w-full border border-neutral-200 bg-white px-3 text-sm focus:border-neutral-900 focus:outline-none sm:w-48"
        >
          <option v-for="c in categories" :key="c" :value="c">
            {{ c }}
          </option>
        </select>
      </div>
    </header>

    <section class="py-12 sm:py-16">
      <div class="container">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="p in list"
            :key="p.id"
            :to="`/research/${p.slug}`"
            class="group flex gap-4 border border-neutral-200/90 bg-white p-4 transition hover:border-neutral-300"
          >
            <div class="h-20 w-24 shrink-0 overflow-hidden border border-neutral-100">
              <img :src="p.image" alt="" class="h-full w-full object-cover" width="96" height="80">
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-[0.65rem] font-medium uppercase tracking-wider text-neutral-500">
                {{ p.category }} · {{ p.date }}
              </p>
              <p class="mt-1 line-clamp-2 text-sm font-medium text-neutral-900 group-hover:underline">
                {{ p.title }}
              </p>
            </div>
          </NuxtLink>
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
