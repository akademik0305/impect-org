<script setup lang="ts">
import { publications, events, fakeImg } from '~/data/siteContent'

const pubTypeLabels = {
  policy_contribution: 'Policy contribution',
  report: 'Report',
  policy_brief: 'Policy brief',
  study: 'Study',
  analysis: 'Analysis',
  working_paper: 'Working paper',
}

const featuredProjects = computed(() =>
  publications.slice(0, 6).map((p) => ({
    slug: p.slug,
    title: p.title,
    desc: p.abstract,
    img: p.image,
    date: p.date,
    category: p.category,
    pubType: p.pubType,
  })),
)

const upcomingFromSite = computed(() => {
  const u = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  return u.slice(0, 3).map((e) => ({
    slug: e.slug,
    title: e.title,
    date: e.date,
    time: e.time,
    location: e.location,
    type: e.type,
    speakers: e.speakers,
    image: e.image,
  }))
})

const featuredEvent = computed(() => upcomingFromSite.value[0])
const moreEvents = computed(() => upcomingFromSite.value.slice(1))

const projectSupporters = [
  { name: 'Interreg CENTRAL EUROPE', logo: '/partners/interreg.png' },
  { name: 'Horizon Europe', logo: '/partners/commission.png' },
  { name: 'Erasmus+', logo: '/partners/erasmus.png' },
  { name: 'European Solidarity Corps', logo: '/partners/corps.png' },
  { name: 'Freistaat Thüringen', logo: '/partners/freistaat.png.webp' },
  { name: 'Auswärtiges Amt', logo: '/partners/auswartigen-amt.png' },
]

const expertBriefs = [
  {
    date: '2026-05-13',
    title: 'Regional cooperation: a new policy agenda',
    excerpt: 'A brief analysis of practical steps to improve negotiations and the investment climate.',
    views: 428,
  },
  {
    date: '2026-05-10',
    title: 'Digital services and trust',
    excerpt: 'Data standards and transparency in improving service quality for citizens.',
    views: 912,
  },
  {
    date: '2026-05-07',
    title: 'Sustainable energy and economic growth',
    excerpt: 'A short commentary on energy efficiency measures and their impact on the economy.',
    views: 653,
  },
]

const videoSpotlights = [
  {
    title: 'From the economic forum: panel discussion',
    duration: '42:18',
    thumb: fakeImg('vid-panel', 640, 360),
    href: 'https://www.youtube.com/results?search_query=think+tank+panel',
  },
  {
    title: 'Policy analysis: sustainable development',
    duration: '28:05',
    thumb: fakeImg('vid-policy', 640, 360),
    href: 'https://www.youtube.com/results?search_query=policy+research+sustainability',
  },
  {
    title: 'Communicating research findings',
    duration: '19:44',
    thumb: fakeImg('vid-research', 640, 360),
    href: 'https://www.youtube.com/results?search_query=research+communication',
  },
]

const teamMembers = [
  {
    name: 'Dr. Aziz Karimov',
    role: 'Lead Researcher',
    bio: '15 years of experience in economic policy and development economics',
    img: fakeImg('team-aziz', 400, 400),
  },
  {
    name: 'Dilnoza Rahimova',
    role: 'Project Manager',
    bio: 'Specialist in managing and monitoring international projects',
    img: fakeImg('team-dilnoza', 400, 400),
  },
  {
    name: 'Bobur Alimov',
    role: 'Data Analyst',
    bio: 'Expert in big data analysis and statistical modelling',
    img: fakeImg('team-bobur', 400, 400),
  },
  {
    name: 'Malika Tashmatova',
    role: 'Communications Manager',
    bio: "Ommaviy aloqolar va media strategiyasi bo'yicha 10 yillik tajriba",
    img: fakeImg('team-malika', 400, 400),
  },
]

const heroSide = fakeImg('hero-side', 900, 600)
const aboutGridA = fakeImg('about-grid-a', 500, 500)
const aboutGridB = fakeImg('about-grid-b', 500, 500)
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero — minimalist -->
    <section class="border-b border-neutral-200/90">
      <div class="relative container py-14 sm:py-20 lg:py-24">
        <p class="section-eyebrow mb-3 text-neutral-500">
          Policy research · Events · Publications
        </p>
        <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div class="space-y-6 lg:col-span-7 sm:space-y-8">
            <div class="space-y-4">
              <h1 class="text-balance text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
                Thinking ahead for Uzbekistan
              </h1>
              <p class="max-w-xl text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">
                We are a leading think tank dedicated to research, analysis, and policy recommendations for sustainable development.
              </p>
            </div>
            <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <NuxtLink
                to="/research"
                class="inline-flex min-h-11 items-center justify-center bg-neutral-900 px-6 py-2.5 text-center text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Explore Research
              </NuxtLink>
              <NuxtLink
                to="/about"
                class="inline-flex min-h-11 items-center justify-center border border-neutral-300 bg-transparent px-6 py-2.5 text-center text-sm font-medium text-neutral-900 transition hover:border-neutral-900"
              >
                Learn More
              </NuxtLink>
            </div>
          </div>
          <div class="lg:col-span-5">
            <div class="overflow-hidden border border-neutral-200/90 bg-neutral-50">
              <img
                :src="heroSide"
                alt=""
                class="aspect-[4/3] w-full object-cover sm:aspect-video"
                width="900"
                height="600"
              >
              <div class="flex items-center justify-between border-t border-neutral-200 px-4 py-3 text-xs text-neutral-500">
                <span>Year of Impact</span>
                <span class="font-medium text-neutral-900">2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Project supporters -->
    <section class="border-b border-gray-200 bg-white py-8 sm:py-10 lg:py-12">
      <div class="container">
        <h2 class="mb-6 text-balance px-2 text-center text-base font-bold text-neutral-900 sm:mb-8 sm:text-lg lg:mb-10 lg:text-xl">
          Our Projects Are Supported By:
        </h2>
        <ul
          class="supporters-grid grid grid-cols-2 items-center justify-items-center gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-6 lg:gap-x-5 lg:gap-y-0 xl:gap-x-8"
        >
          <li
            v-for="supporter in projectSupporters"
            :key="supporter.logo"
            class="flex w-full max-w-[9.5rem] items-center justify-center sm:max-w-[10.5rem] lg:max-w-[11.75rem]"
          >
            <img
              :src="supporter.logo"
              :alt="supporter.name"
              class="h-9 w-full max-h-28 object-contain object-center sm:h-11 md:h-12 lg:h-14 xl:h-[4.5rem]"
              width="188"
              height="72"
              loading="lazy"
              decoding="async"
            >
          </li>
        </ul>
      </div>
    </section>

    <!-- Featured research + expert briefs -->
    <section class="py-14 sm:py-16 lg:py-20">
      <div class="container space-y-12 lg:space-y-16">
        <div class="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <aside class="lg:col-span-4 lg:border-r lg:border-gray-200 lg:pr-10">
            <p class="section-eyebrow mb-2">
              Our research
            </p>
            <h2 class="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
              Featured Projects
            </h2>
            <p class="mt-2 text-sm font-semibold text-neutral-900">
              150+ items in our publications database
            </p>
            <p class="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              Explore our latest research findings and policy recommendations.
            </p>
            <NuxtLink
              to="/research"
              class="mt-6 inline-flex min-h-11 items-center justify-center bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              View All Research
            </NuxtLink>
          </aside>
          <div class="lg:col-span-8">
            <div class="grid gap-6 sm:grid-cols-2">
              <article
                v-for="project in featuredProjects"
                :key="project.slug"
                class="group flex h-full flex-col border border-gray-200 bg-white transition hover:border-neutral-900/30 hover:shadow-md"
              >
                <div class="relative aspect-[16/10] overflow-hidden">
                  <img
                    :src="project.img"
                    :alt="project.title"
                    class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    width="600"
                    height="375"
                  >
                </div>
                <div class="flex flex-1 flex-col p-4 sm:p-5">
                  <div class="mb-2 flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                    <span class="section-eyebrow text-[0.625rem] text-neutral-500">{{ pubTypeLabels[project.pubType] }}</span>
                    <span class="hidden sm:inline" aria-hidden="true">·</span>
                    <span>{{ project.date }}</span>
                  </div>
                  <h3 class="text-lg font-semibold leading-snug text-neutral-900 sm:text-xl">
                    {{ project.title }}
                  </h3>
                  <p class="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">
                    {{ project.desc }}
                  </p>
                  <NuxtLink
                    :to="`/research/${project.slug}`"
                    class="mt-4 inline-flex items-center text-sm font-semibold text-neutral-900 hover:text-neutral-600"
                  >
                    Read More
                    <svg class="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </NuxtLink>
                </div>
              </article>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-12 lg:pt-14">
          <div class="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="section-eyebrow mb-1">
                Expert opinion
              </p>
              <h3 class="text-xl font-bold text-neutral-900 sm:text-2xl">
                Commentary in brief
              </h3>
            </div>
            <NuxtLink to="/research" class="text-sm font-semibold text-neutral-900 hover:text-neutral-600">
              More in brief →
            </NuxtLink>
          </div>
          <div class="grid gap-4 md:grid-cols-3">
            <article
              v-for="(brief, idx) in expertBriefs"
              :key="idx"
              class="flex flex-col border border-gray-200 p-4 sm:p-5 transition hover:border-neutral-900/25"
            >
              <time class="text-xs font-medium text-neutral-600">{{ brief.date }}</time>
              <h4 class="mt-2 text-base font-semibold leading-snug text-neutral-900 sm:text-lg">
                {{ brief.title }}
              </h4>
              <p class="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">
                {{ brief.excerpt }}
              </p>
              <p class="mt-3 text-xs text-neutral-600">
                {{ brief.views }} views
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- Events + videos -->
    <section class="border-t border-gray-200 bg-neutral-50 py-14 sm:py-16 lg:py-20">
      <div class="container space-y-12">
        <div class="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <p class="section-eyebrow mb-2">
            Discussions and exchanges
          </p>
          <h2 class="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl">
            Upcoming events
          </h2>
          <p class="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
            Join our events for the latest trends and research insights.
          </p>
        </div>

        <div v-if="featuredEvent" class="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <article class="border border-neutral-200/90 bg-white lg:col-span-7">
            <div class="aspect-[21/9] max-h-48 w-full overflow-hidden sm:max-h-none sm:aspect-[2/1] lg:aspect-[16/9]">
              <img
                :src="featuredEvent.image"
                alt=""
                class="h-full w-full object-cover"
                width="1200"
                height="675"
              >
            </div>
            <div class="space-y-4 p-5 sm:p-6 lg:p-8">
              <span class="inline-block bg-neutral-50 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-700">
                {{ featuredEvent.type }}
              </span>
              <h3 class="text-xl font-semibold leading-snug text-neutral-900 sm:text-2xl">
                {{ featuredEvent.title }}
              </h3>
              <dl class="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt class="font-semibold text-neutral-900">
                    When
                  </dt>
                  <dd class="mt-0.5 text-neutral-600">
                    {{ featuredEvent.date }} · {{ featuredEvent.time }}
                  </dd>
                </div>
                <div>
                  <dt class="font-semibold text-neutral-900">
                    Where
                  </dt>
                  <dd class="mt-0.5 text-neutral-600">
                    {{ featuredEvent.location }}
                  </dd>
                </div>
              </dl>
              <div v-if="featuredEvent.speakers?.length">
                <p class="text-sm font-semibold text-neutral-900">
                  Speakers
                </p>
                <ul class="mt-2 list-inside list-disc text-sm text-neutral-600">
                  <li v-for="s in featuredEvent.speakers" :key="s">
                    {{ s }}
                  </li>
                </ul>
              </div>
              <NuxtLink
                :to="`/events/${featuredEvent.slug}`"
                class="inline-flex w-full min-h-11 items-center justify-center border border-neutral-900 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 sm:w-auto"
              >
                Register now
              </NuxtLink>
            </div>
          </article>

          <div class="flex flex-col gap-4 lg:col-span-5">
            <article
              v-for="event in moreEvents"
              :key="event.slug"
              class="flex flex-1 flex-col border border-neutral-200/90 bg-white p-4 sm:p-5"
            >
              <div class="flex items-start justify-between gap-3">
                <h4 class="text-base font-semibold leading-snug text-neutral-900 sm:text-lg">
                  {{ event.title }}
                </h4>
                <span class="shrink-0 text-xs font-semibold uppercase tracking-wide text-neutral-500">{{ event.type }}</span>
              </div>
              <p class="mt-2 text-sm text-neutral-600">
                {{ event.date }} · {{ event.time }}
              </p>
              <p class="mt-1 text-sm text-neutral-600">
                {{ event.location }}
              </p>
              <NuxtLink
                :to="`/events/${event.slug}`"
                class="mt-4 inline-flex min-h-10 w-full items-center justify-center border border-neutral-900 px-3 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white sm:mt-auto sm:w-auto"
              >
                Register now
              </NuxtLink>
            </article>
          </div>
        </div>
      
        <!-- <div class="text-center lg:text-left">
          <NuxtLink
            to="/events"
            class="inline-flex min-h-11 items-center justify-center bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            View all events
          </NuxtLink>
        </div> -->
      </div>
    </section>

    <!-- Team -->
    <!-- <section class="py-14 sm:py-16 lg:py-20">
      <div class="container">
        <div class="mx-auto mb-10 max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <p class="section-eyebrow mb-2">
            Our people
          </p>
          <h2 class="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl">
            Our team
          </h2>
          <p class="mt-3 text-sm text-neutral-600 sm:text-base">
            Researchers and specialists driving evidence-based policy.
          </p>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="member in teamMembers"
            :key="member.name"
            class="border border-gray-200 bg-white p-5 text-center transition hover:border-neutral-900/25"
          >
            <img
              :src="member.img"
              :alt="member.name"
              class="mx-auto h-28 w-28 object-cover sm:h-32 sm:w-32"
              width="128"
              height="128"
            >
            <h3 class="mt-4 text-base font-semibold text-neutral-900 sm:text-lg">
              {{ member.name }}
            </h3>
            <p class="mt-1 text-center text-[0.625rem] font-semibold uppercase tracking-widest text-neutral-900">
              {{ member.role }}
            </p>
            <p class="mt-3 text-sm leading-relaxed text-neutral-600">
              {{ member.bio }}
            </p>
          </div>
        </div>
      </div>
    </section> -->

    <!-- About -->
    <section class="border-t border-gray-200 bg-neutral-50 py-14 sm:py-16 lg:py-20">
      <div class="container">
        <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div class="space-y-5">
            <p class="section-eyebrow">
              About
            </p>
            <h2 class="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl">
              Who We Are
            </h2>
            <div class="space-y-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              <p>We are a team of dedicated researchers, analysts, and policy experts committed to driving positive change in Uzbekistan through evidence-based research and strategic recommendations.</p>
              <p>Our work spans across various sectors including economic development, social policy, governance, and environmental sustainability.</p>
            </div>
            <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <NuxtLink
                to="/about"
                class="inline-flex min-h-11 items-center justify-center bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Learn More About Us
              </NuxtLink>
              <NuxtLink
                to="/about"
                class="inline-flex min-h-11 items-center justify-center border border-neutral-900 px-6 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
              >
                Contact Us
              </NuxtLink>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <img
              :src="aboutGridA"
              alt=""
              class="aspect-square w-full object-cover sm:aspect-[4/5]"
              width="500"
              height="500"
            >
            <img
              :src="aboutGridB"
              alt=""
              class="aspect-square w-full translate-y-4 object-cover sm:aspect-[4/5] sm:translate-y-8"
              width="500"
              height="500"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="border-t border-neutral-900 bg-neutral-900 py-14 text-white sm:py-16">
      <div class="container text-center">
        <h2 class="text-2xl font-bold sm:text-3xl lg:text-4xl">
          Get Involved in Our Mission
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-white/85 sm:text-base">
          Join us in shaping the future of Uzbekistan through collaborative research and impactful policy initiatives.
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <NuxtLink
            to="/about"
            class="inline-flex min-h-11 w-full min-w-[200px] items-center justify-center bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-gray-100 sm:w-auto"
          >
            Partner With Us
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="inline-flex min-h-11 w-full min-w-[200px] items-center justify-center border border-white px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            Support Our Work
          </NuxtLink>
        </div>
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
