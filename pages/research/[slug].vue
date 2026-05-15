<script setup lang="ts">
import { getPublicationBySlug } from '~/data/siteContent'

const route = useRoute()
const slug = String(route.params.slug || '')
const publication = getPublicationBySlug(slug)
if (!publication) {
  throw createError({ statusCode: 404, statusMessage: 'Publication not found' })
}

useHead({
  title: `${publication.title} · Impect`,
})
</script>

<template>
  <article class="page-detail">
    <header class="border-b border-neutral-200/80 bg-transparent py-10 sm:py-14">
      <div class="container max-w-3xl">
        <p class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-neutral-500">
          {{ publication.category }} · {{ publication.date }}
        </p>
        <h1 class="mt-3 text-balance text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
          {{ publication.title }}
        </h1>
        <p class="mt-4 text-sm text-neutral-600 sm:text-base">
          {{ publication.authors.join(' · ') }}
        </p>
        <div class="mt-6 flex flex-wrap gap-2">
          <span
            v-for="tag in publication.tags"
            :key="tag"
            class="border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-600"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </header>

    <div class="container max-w-3xl py-10 sm:py-12">
      <figure class="overflow-hidden border border-neutral-200/90">
        <img
          :src="publication.image"
          :alt="publication.title"
          class="aspect-[16/9] w-full object-cover"
          width="1200"
          height="675"
        >
      </figure>

      <p class="mt-10 text-lg leading-relaxed text-neutral-700">
        {{ publication.abstract }}
      </p>

      <div class="prose-custom mt-10 space-y-6 text-neutral-700">
        <p v-for="(para, i) in publication.body" :key="i" class="text-base leading-relaxed">
          {{ para }}
        </p>
      </div>

      <div class="mt-12 flex flex-col gap-3 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <NuxtLink to="/research" class="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline">
          ← All publications
        </NuxtLink>
        <a
          :href="publication.downloadUrl"
          class="inline-flex min-h-10 items-center justify-center border border-neutral-900 px-5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
        >
          PDF (demo)
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.page-detail {
  min-height: 60vh;
}
</style>
