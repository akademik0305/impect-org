<script setup lang="ts">
import { getProjectBySlug } from '~/data/siteContent'

const route = useRoute()
const slug = String(route.params.slug || '')
const project = getProjectBySlug(slug)
if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

const statusLabel: Record<string, string> = {
  active: 'Active',
  completed: 'Completed',
  planning: 'Planning',
}

useHead({
  title: `${project.title} · Impect`,
})
</script>

<template>
  <article class="page-detail min-h-[60vh]">
    <header class="border-b border-neutral-200/80 bg-transparent py-10 sm:py-14">
      <div class="container max-w-3xl">
        <div class="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
          <span class="font-medium text-neutral-800">{{ statusLabel[project.status] }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ project.category }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ project.partner }}</span>
        </div>
        <h1 class="mt-3 text-balance text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
          {{ project.title }}
        </h1>
        <p class="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600">
          {{ project.description }}
        </p>
      </div>
    </header>

    <div class="container max-w-3xl py-10 sm:py-12">
      <figure class="overflow-hidden border border-neutral-200/90">
        <img
          :src="project.image"
          :alt="project.title"
          class="aspect-[16/9] w-full object-cover"
          width="1200"
          height="675"
        >
      </figure>

      <dl class="mt-10 grid gap-4 border border-neutral-200/90 bg-white p-5 text-sm sm:grid-cols-2">
        <div>
          <dt class="text-neutral-500">Duration</dt>
          <dd class="mt-1 font-medium text-neutral-900">{{ project.startDate }} — {{ project.endDate }}</dd>
        </div>
        <div>
          <dt class="text-neutral-500">Region</dt>
          <dd class="mt-1 font-medium text-neutral-900">{{ project.region }}</dd>
        </div>
        <div>
          <dt class="text-neutral-500">Budget</dt>
          <dd class="mt-1 font-medium text-neutral-900">{{ project.budget }}</dd>
        </div>
        <div>
          <dt class="text-neutral-500">Progress</dt>
          <dd class="mt-1 font-medium text-neutral-900">{{ project.progress }}%</dd>
        </div>
      </dl>

      <div class="mt-10 h-1.5 w-full overflow-hidden bg-neutral-100">
        <div class="h-full bg-neutral-900 transition-all" :style="{ width: `${project.progress}%` }" />
      </div>

      <div class="mt-10 space-y-6 text-base leading-relaxed text-neutral-700">
        <p v-for="(para, i) in project.body" :key="i">
          {{ para }}
        </p>
      </div>

      <div class="mt-10">
        <h2 class="text-sm font-semibold uppercase tracking-widest text-neutral-500">
          Key outcomes
        </h2>
        <ul class="mt-4 list-inside list-disc space-y-2 text-neutral-700">
          <li v-for="h in project.highlights" :key="h">
            {{ h }}
          </li>
        </ul>
      </div>

      <div class="mt-12 border-t border-neutral-200 pt-8">
        <NuxtLink to="/projects" class="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline">
          ← All projects
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
