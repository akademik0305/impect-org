<template>
  <header class="sticky top-0 z-50 bg-white shadow-sm">
    <div class="border-b border-gray-200 bg-[#f4f6f8] text-brand-dark-gray">
      <div class="container flex flex-wrap items-center justify-between gap-2 py-2 text-xs sm:text-sm">
        <time :datetime="isoToday" class="text-brand-gray">{{ formatToday }}</time>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <NuxtLink to="/about" class="font-medium hover:text-brand-navy">
            {{ $t('navigation.subscribe') }}
          </NuxtLink>
          <span class="hidden text-gray-300 sm:inline" aria-hidden="true">|</span>
          <NuxtLink to="/research" class="font-medium hover:text-brand-navy">
            {{ $t('navigation.news') }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="border-b border-gray-200 bg-white">
    <div class="container">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-brand-navy rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">I</span>
            </div>
            <span class="text-xl font-semibold text-brand-dark-gray">Impect</span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-8" aria-label="Main">
          <NuxtLink 
            to="/" 
            class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium"
            :class="{ 'text-brand-navy': $route.path === '/' }"
          >
            {{ $t('navigation.home') }}
          </NuxtLink>
          <NuxtLink 
            to="/research" 
            class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium"
          >
            {{ $t('navigation.research') }}
          </NuxtLink>
          <NuxtLink 
            to="/projects" 
            class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium"
          >
            {{ $t('navigation.projects') }}
          </NuxtLink>
          <NuxtLink 
            to="/publications" 
            class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium"
          >
            {{ $t('navigation.publications') }}
          </NuxtLink>
          <NuxtLink 
            to="/events" 
            class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium"
          >
            {{ $t('navigation.events') }}
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium"
          >
            {{ $t('navigation.about') }}
          </NuxtLink>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center space-x-4">
          <!-- Language switcher -->
          <div class="hidden md:flex items-center space-x-2">
            <button
              v-for="lang in ['uz', 'ru', 'en']"
              :key="lang"
              @click="switchLanguage(lang)"
              :class="[
                'px-2 py-1 text-sm rounded transition-colors',
                $i18n.locale === lang 
                  ? 'bg-brand-navy text-white' 
                  : 'text-gray-600 hover:text-brand-navy'
              ]"
            >
              {{ lang.toUpperCase() }}
            </button>
          </div>

          <!-- Mobile menu button -->
          <button
            @click="toggleMobileMenu"
            class="lg:hidden p-2 text-brand-dark-gray hover:text-brand-navy transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-show="mobileMenuOpen" class="lg:hidden fixed left-0 right-0 top-[5.75rem] z-50 border-t border-gray-200 bg-white py-4 shadow-lg sm:top-[6.25rem]">
        <div class="container">
          <nav class="flex flex-col space-y-3" aria-label="Mobile">
            <NuxtLink 
              to="/" 
              class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              {{ $t('navigation.home') }}
            </NuxtLink>
            <NuxtLink 
              to="/research" 
              class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              {{ $t('navigation.research') }}
            </NuxtLink>
            <NuxtLink 
              to="/projects" 
              class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              {{ $t('navigation.projects') }}
            </NuxtLink>
            <NuxtLink 
              to="/publications" 
              class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              {{ $t('navigation.publications') }}
            </NuxtLink>
            <NuxtLink 
              to="/events" 
              class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              {{ $t('navigation.events') }}
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              {{ $t('navigation.about') }}
            </NuxtLink>
            
            <!-- Mobile language switcher -->
            <div class="flex items-center space-x-2 pt-3 border-t border-gray-200">
              <button
                v-for="lang in ['uz', 'ru', 'en']"
                :key="lang"
                @click="switchLanguage(lang)"
                :class="[
                  'px-2 py-1 text-sm rounded transition-colors',
                  $i18n.locale === lang 
                    ? 'bg-brand-navy text-white' 
                    : 'text-gray-600 hover:text-brand-navy'
                ]"
              >
                {{ lang.toUpperCase() }}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
    </div>
  </header>
</template>

<script setup>
const { $i18n } = useNuxtApp()
const { locale } = useI18n()

const isoToday = computed(() => new Date().toISOString().slice(0, 10))

const localeTag = computed(() => {
  const l = locale.value
  if (l === 'uz') return 'uz-UZ'
  if (l === 'ru') return 'ru-RU'
  return 'en-GB'
})

const formatToday = computed(() =>
  new Intl.DateTimeFormat(localeTag.value, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date()),
)

const mobileMenuOpen = ref(false)

const switchLanguage = (lang) => {
  $i18n.setLocale(lang)
  mobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Close mobile menu when route changes
watch(() => useRoute().path, () => {
  mobileMenuOpen.value = false
})
</script>
