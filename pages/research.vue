<script setup>
import { publications } from '~/data/siteContent'

const categories = [
  'All',
  'Economy',
  'Technology',
  'Environment',
  'Education',
  'Health',
  'Agriculture',
  'Social policy',
  'Urban planning',
]

const selectedCategory = ref('All')
const searchQuery = ref('')

const filteredPublications = computed(() => {
  let list = publications
  if (selectedCategory.value !== 'All') {
    list = list.filter((pub) => pub.category === selectedCategory.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (pub) =>
        pub.title.toLowerCase().includes(q)
        || pub.authors.some((a) => a.toLowerCase().includes(q))
        || pub.abstract.toLowerCase().includes(q),
    )
  }
  return list
})

const featuredPublications = computed(() => publications.filter((p) => p.featured))
</script>

<template>
  <div>
    <header class="border-b border-neutral-200/90 bg-transparent py-12 sm:py-16">
      <div class="container max-w-2xl">
        <h1 class="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          Research & publications
        </h1>
        <p class="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
          Latest analyses, policy recommendations, and analytical materials — all in one place.
        </p>
      </div>
    </header>

    <section class="py-12 sm:py-16">
      <div class="container">
        <h2 class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Featured
        </h2>
        <div class="mt-6 grid gap-6 sm:grid-cols-2">
          <article
            v-for="publication in featuredPublications"
            :key="publication.id"
            class="group border border-neutral-200/90 bg-white transition hover:border-neutral-300"
          >
            <NuxtLink :to="`/research/${publication.slug}`" class="block">
              <div class="aspect-[16/10] overflow-hidden">
                <img
                  :src="publication.image"
                  :alt="publication.title"
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  width="900"
                  height="560"
                >
              </div>
              <div class="p-5">
                <div class="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                  <span>{{ publication.category }}</span>
                  <span aria-hidden="true">·</span>
                  <span>{{ publication.date }}</span>
                </div>
                <h3 class="mt-2 text-lg font-medium text-neutral-900">
                  {{ publication.title }}
                </h3>
                <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">
                  {{ publication.abstract }}
                </p>
                <span class="mt-4 inline-block text-sm font-medium text-neutral-900 underline-offset-4 group-hover:underline">
                  Read more
                </span>
              </div>
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <section class="border-t border-neutral-200/80 py-12 sm:py-16">
      <div class="container">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            All publications
          </h2>
          <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search..."
              class="min-h-10 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none sm:w-56"
            >
            <select
              v-model="selectedCategory"
              class="min-h-10 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none sm:w-44"
            >
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>

        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="publication in filteredPublications"
            :key="publication.id"
            class="group border border-neutral-200/90 bg-white transition hover:border-neutral-300"
          >
            <NuxtLink :to="`/research/${publication.slug}`" class="block">
              <div class="aspect-[16/10] overflow-hidden">
                <img
                  :src="publication.image"
                  :alt="publication.title"
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  width="900"
                  height="560"
                >
              </div>
              <div class="p-5">
                <div class="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                  <span>{{ publication.category }}</span>
                  <span aria-hidden="true">·</span>
                  <span>{{ publication.date }}</span>
                </div>
                <h3 class="mt-2 text-base font-medium text-neutral-900">
                  {{ publication.title }}
                </h3>
                <p class="mt-2 line-clamp-2 text-sm text-neutral-600">
                  {{ publication.abstract }}
                </p>
                <p class="mt-3 text-xs text-neutral-500">
                  {{ publication.authors[0] }}{{ publication.authors.length > 1 ? ' et al.' : '' }}
                </p>
              </div>
            </NuxtLink>
          </article>
        </div>

        <p v-if="filteredPublications.length === 0" class="mt-12 text-center text-sm text-neutral-500">
          No publications found.
        </p>
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
