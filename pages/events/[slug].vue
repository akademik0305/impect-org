<script setup lang="ts">
import { getEventBySlug } from '~/data/siteContent'

const route = useRoute()
const slug = String(route.params.slug || '')
const event = getEventBySlug(slug)
if (!event) {
  throw createError({ statusCode: 404, statusMessage: 'Tadbir topilmadi' })
}

const formatDate = (d: string) => {
  return new Date(d).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const full = event.registered >= event.capacity

useHead({
  title: `${event.title} · Impect`,
})
</script>

<template>
  <article class="page-detail min-h-[60vh]">
    <header class="border-b border-neutral-200/80 bg-white/90 py-10 sm:py-14">
      <div class="container max-w-3xl">
        <p class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-neutral-500">
          {{ event.type }} · {{ event.category }}
        </p>
        <h1 class="mt-3 text-balance text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
          {{ event.title }}
        </h1>
        <p class="mt-4 text-base leading-relaxed text-neutral-600">
          {{ event.description }}
        </p>
        <ul class="mt-6 space-y-2 text-sm text-neutral-600">
          <li>{{ formatDate(event.date) }}, {{ event.time }}</li>
          <li>{{ event.location }}</li>
          <li>
            Ro'yxatdan o'tgan: {{ event.registered }} / {{ event.capacity }}
          </li>
        </ul>
      </div>
    </header>

    <div class="container max-w-3xl py-10 sm:py-12">
      <figure class="overflow-hidden border border-neutral-200/90">
        <img
          :src="event.image"
          :alt="event.title"
          class="aspect-[16/9] w-full object-cover"
          width="1200"
          height="675"
        >
      </figure>

      <div class="mt-10 space-y-6 text-base leading-relaxed text-neutral-700">
        <p v-for="(para, i) in event.body" :key="i">
          {{ para }}
        </p>
      </div>

      <div v-if="event.speakers.length" class="mt-10">
        <h2 class="text-sm font-semibold uppercase tracking-widest text-neutral-500">
          Spikerlar
        </h2>
        <ul class="mt-3 list-inside list-disc text-neutral-700">
          <li v-for="s in event.speakers" :key="s">
            {{ s }}
          </li>
        </ul>
      </div>

      <div v-if="event.agenda.length" class="mt-10 border border-neutral-200/90 bg-white">
        <h2 class="border-b border-neutral-200 px-5 py-3 text-sm font-semibold uppercase tracking-widest text-neutral-500">
          Dastur
        </h2>
        <ul class="divide-y divide-neutral-100">
          <li v-for="(row, i) in event.agenda" :key="i" class="flex gap-4 px-5 py-3 text-sm">
            <span class="shrink-0 font-medium text-neutral-900">{{ row.time }}</span>
            <span class="text-neutral-600">{{ row.title }}</span>
          </li>
        </ul>
      </div>

      <div class="mt-12 flex flex-col gap-3 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <NuxtLink to="/events" class="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline">
          ← Barcha tadbirlar
        </NuxtLink>
        <a
          :href="event.registrationUrl"
          class="inline-flex min-h-10 items-center justify-center bg-neutral-900 px-6 text-sm font-medium text-white opacity-100 transition hover:bg-neutral-800"
          :class="{ 'pointer-events-none opacity-40': full }"
        >
          {{ full ? 'Joylar tugagan' : "Ro'yxatdan o'tish" }}
        </a>
      </div>
    </div>
  </article>
</template>
