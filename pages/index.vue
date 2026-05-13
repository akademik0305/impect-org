<script setup>
import { publications, events, fakeImg } from '~/data/siteContent'

const { t } = useI18n()

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

const stats = computed(() => [
  { number: '150+', label: t('home.stats.publications') },
  { number: '50+', label: t('home.stats.projects') },
  { number: '25+', label: t('home.stats.partners') },
  { number: '10+', label: t('home.stats.years') },
])

const expertBriefs = [
  {
    date: '2026-05-13',
    title: "Mintaqaviy hamkorlik: yangi siyosat dasturi",
    excerpt: "Qisqa tahlil — savdolashuv va investitsiya muhitini yaxshilash bo'yicha amaliy choralalar.",
    views: 428,
  },
  {
    date: '2026-05-10',
    title: 'Raqamli xizmatlar va ishonchlilik',
    excerpt: "Fuqarolar uchun xizmat sifatini oshirishda ma'lumot standartlari va shaffoflik.",
    views: 912,
  },
  {
    date: '2026-05-07',
    title: "Barqaror energiya va iqtisodiy o'sish",
    excerpt: "Energiya samaradorligi choralari va ularning iqtisodiyotga ta'siri haqida qisqa sharh.",
    views: 653,
  },
]

const videoSpotlights = [
  {
    title: 'Iqtisodiy forumdan lavha: panel muhokama',
    duration: '42:18',
    thumb: fakeImg('vid-panel', 640, 360),
    href: 'https://www.youtube.com/results?search_query=think+tank+panel',
  },
  {
    title: "Siyosat tahlili: barqaror rivojlanish",
    duration: '28:05',
    thumb: fakeImg('vid-policy', 640, 360),
    href: 'https://www.youtube.com/results?search_query=policy+research+sustainability',
  },
  {
    title: "Tadqiqot natijalarini targ'ib qilish",
    duration: '19:44',
    thumb: fakeImg('vid-research', 640, 360),
    href: 'https://www.youtube.com/results?search_query=research+communication',
  },
]

const teamMembers = [
  {
    name: 'Dr. Aziz Karimov',
    role: 'Bosh tadqiqotchi',
    bio: "Iqtisodiy siyosat va rivojlanish iqtisodiyoti bo'yicha 15 yillik tajriba",
    img: fakeImg('team-aziz', 400, 400),
  },
  {
    name: 'Dilnoza Rahimova',
    role: 'Loyihalar menejeri',
    bio: "Xalqaro loyihalarni boshqarish va monitoring bo'yicha mutaxassis",
    img: fakeImg('team-dilnoza', 400, 400),
  },
  {
    name: 'Bobur Alimov',
    role: 'Data tahlilchisi',
    bio: "Katta ma'lumotlar tahlili va statistik modellashtirish bo'yicha ekspert",
    img: fakeImg('team-bobur', 400, 400),
  },
  {
    name: 'Malika Tashmatova',
    role: 'Kommunikatsiya menejeri',
    bio: "Ommaviy aloqolar va media strategiyasi bo'yicha 10 yillik tajriba",
    img: fakeImg('team-malika', 400, 400),
  },
]

const heroSide = fakeImg('hero-side', 900, 600)
const aboutGridA = fakeImg('about-grid-a', 500, 500)
const aboutGridB = fakeImg('about-grid-b', 500, 500)
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero — minimalist -->
    <section class="border-b border-neutral-200/90 bg-white">
      <div class="relative container py-14 sm:py-20 lg:py-24">
        <p class="section-eyebrow mb-3 text-neutral-500">
          {{ $t('home.hero_kicker') }}
        </p>
        <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div class="space-y-6 lg:col-span-7 sm:space-y-8">
            <div class="space-y-4">
              <h1 class="text-balance text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
                {{ $t('hero.title') }}
              </h1>
              <p class="max-w-xl text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">
                {{ $t('hero.subtitle') }}
              </p>
            </div>
            <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <NuxtLink
                to="/research"
                class="inline-flex min-h-11 items-center justify-center bg-neutral-900 px-6 py-2.5 text-center text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                {{ $t('hero.explore_research') }}
              </NuxtLink>
              <NuxtLink
                to="/about"
                class="inline-flex min-h-11 items-center justify-center border border-neutral-300 bg-transparent px-6 py-2.5 text-center text-sm font-medium text-neutral-900 transition hover:border-neutral-900"
              >
                {{ $t('hero.learn_more') }}
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
                <span>{{ $t('hero.impact_year') }}</span>
                <span class="font-medium text-neutral-900">2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats — horizontal metrics strip -->
    <section class="border-b border-gray-200 bg-white py-10 sm:py-12">
      <div class="container">
        <div class="grid grid-cols-2 gap-px bg-gray-200 sm:grid-cols-4">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="flex flex-col items-center justify-center bg-white px-3 py-8 text-center sm:px-4"
          >
            <div class="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl">
              {{ stat.number }}
            </div>
            <div class="mt-1 max-w-[12rem] text-xs text-neutral-600 sm:text-sm">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured research + expert briefs -->
    <section class="py-14 sm:py-16 lg:py-20">
      <div class="container space-y-12 lg:space-y-16">
        <div class="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <aside class="lg:col-span-4 lg:border-r lg:border-gray-200 lg:pr-10">
            <p class="section-eyebrow mb-2">
              {{ $t('home.research_eyebrow') }}
            </p>
            <h2 class="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
              {{ $t('research.title') }}
            </h2>
            <p class="mt-2 text-sm font-semibold text-neutral-900">
              {{ $t('home.research_stat') }}
            </p>
            <p class="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              {{ $t('research.subtitle') }}
            </p>
            <NuxtLink
              to="/research"
              class="mt-6 inline-flex min-h-11 items-center justify-center bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              {{ $t('research.view_all') }}
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
                    <span class="section-eyebrow text-[0.625rem] text-neutral-500">{{ $t(`pub_types.${project.pubType}`) }}</span>
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
                    {{ $t('common.read_more') }}
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
                {{ $t('home.expert_eyebrow') }}
              </p>
              <h3 class="text-xl font-bold text-neutral-900 sm:text-2xl">
                {{ $t('home.expert_title') }}
              </h3>
            </div>
            <NuxtLink to="/research" class="text-sm font-semibold text-neutral-900 hover:text-neutral-600">
              {{ $t('home.expert_more') }} →
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
                {{ $t('home.views', { n: brief.views }) }}
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
            {{ $t('home.events_eyebrow') }}
          </p>
          <h2 class="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl">
            {{ $t('home.events_title') }}
          </h2>
          <p class="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
            {{ $t('home.events_subtitle') }}
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
                    {{ $t('home.when') }}
                  </dt>
                  <dd class="mt-0.5 text-neutral-600">
                    {{ featuredEvent.date }} · {{ featuredEvent.time }}
                  </dd>
                </div>
                <div>
                  <dt class="font-semibold text-neutral-900">
                    {{ $t('home.where') }}
                  </dt>
                  <dd class="mt-0.5 text-neutral-600">
                    {{ featuredEvent.location }}
                  </dd>
                </div>
              </dl>
              <div v-if="featuredEvent.speakers?.length">
                <p class="text-sm font-semibold text-neutral-900">
                  {{ $t('home.speakers') }}
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
                {{ $t('home.register') }}
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
                {{ $t('home.register') }}
              </NuxtLink>
            </article>
          </div>
        </div>

        <div>
          <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="section-eyebrow mb-1">
                {{ $t('home.videos_eyebrow') }}
              </p>
              <h3 class="text-xl font-bold text-neutral-900 sm:text-2xl">
                {{ $t('home.videos_title') }}
              </h3>
              <p class="mt-1 text-sm text-neutral-600">
                {{ $t('home.videos_subtitle') }}
              </p>
            </div>
          </div>
          <div class="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
            <a
              v-for="(vid, i) in videoSpotlights"
              :key="i"
              :href="vid.href"
              target="_blank"
              rel="noopener noreferrer"
              class="group w-[min(100%,280px)] shrink-0 border border-gray-200 bg-white transition hover:border-neutral-900/30 sm:w-auto"
            >
              <div class="relative aspect-video overflow-hidden">
                <img
                  :src="vid.thumb"
                  alt=""
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  width="640"
                  height="360"
                >
                <span class="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 text-xs font-medium text-white">{{ vid.duration }}</span>
              </div>
              <div class="p-3 sm:p-4">
                <p class="text-sm font-semibold leading-snug text-neutral-900 group-hover:text-neutral-900">
                  {{ vid.title }}
                </p>
                <span class="mt-2 inline-block text-xs font-semibold text-neutral-900">{{ $t('home.watch') }} →</span>
              </div>
            </a>
          </div>
        </div>

        <div class="text-center lg:text-left">
          <NuxtLink
            to="/events"
            class="inline-flex min-h-11 items-center justify-center bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            {{ $t('home.events_view_all') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="py-14 sm:py-16 lg:py-20">
      <div class="container">
        <div class="mx-auto mb-10 max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <p class="section-eyebrow mb-2">
            {{ $t('home.team_eyebrow') }}
          </p>
          <h2 class="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl">
            {{ $t('home.team_title') }}
          </h2>
          <p class="mt-3 text-sm text-neutral-600 sm:text-base">
            {{ $t('home.team_subtitle') }}
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
    </section>

    <!-- About -->
    <section class="border-t border-gray-200 bg-neutral-50 py-14 sm:py-16 lg:py-20">
      <div class="container">
        <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div class="space-y-5">
            <p class="section-eyebrow">
              {{ $t('navigation.about') }}
            </p>
            <h2 class="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl">
              {{ $t('about.title') }}
            </h2>
            <div class="space-y-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              <p>{{ $t('about.paragraph1') }}</p>
              <p>{{ $t('about.paragraph2') }}</p>
            </div>
            <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <NuxtLink
                to="/about"
                class="inline-flex min-h-11 items-center justify-center bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                {{ $t('about.learn_more') }}
              </NuxtLink>
              <NuxtLink
                to="/about"
                class="inline-flex min-h-11 items-center justify-center border border-neutral-900 px-6 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
              >
                {{ $t('about.contact') }}
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
          {{ $t('cta.title') }}
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-white/85 sm:text-base">
          {{ $t('cta.subtitle') }}
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <NuxtLink
            to="/about"
            class="inline-flex min-h-11 w-full min-w-[200px] items-center justify-center bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-gray-100 sm:w-auto"
          >
            {{ $t('cta.partner') }}
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="inline-flex min-h-11 w-full min-w-[200px] items-center justify-center border border-white px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            {{ $t('cta.support') }}
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
