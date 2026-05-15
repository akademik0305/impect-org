<template>
  <header class="sticky top-0 z-50 border-b border-gray-200/80 bg-white/75 shadow-sm backdrop-blur-md">
    <div class="border-b border-gray-200/60 bg-transparent text-brand-dark-gray">
      <div class="container flex flex-wrap items-center justify-between gap-2 py-2 text-xs sm:text-sm">
        <time :datetime="isoToday" class="text-brand-gray">{{ formatToday }}</time>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <NuxtLink to="/about" class="font-medium hover:text-brand-navy">
            Subscribe
          </NuxtLink>
          <span class="hidden text-gray-300 sm:inline" aria-hidden="true">|</span>
          <NuxtLink to="/research" class="font-medium hover:text-brand-navy">
            News
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="border-b border-gray-200/60 bg-transparent">
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
            Home
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium"
            :class="{ 'text-brand-navy': $route.path === '/about' && $route.hash !== '#contact' }"
          >
            About us
          </NuxtLink>
          <NuxtLink 
            to="/projects" 
            class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium"
            :class="{ 'text-brand-navy': $route.path.startsWith('/projects') }"
          >
            Projects
          </NuxtLink>
          <NuxtLink 
            to="/publications" 
            class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium"
            :class="{ 'text-brand-navy': $route.path.startsWith('/publications') }"
          >
            Activities
          </NuxtLink>
          <NuxtLink 
            to="/volunteer" 
            class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium"
            :class="{ 'text-brand-navy': $route.path === '/volunteer' }"
          >
            Become a Volunteer
          </NuxtLink>
          <NuxtLink 
            to="/about#contact" 
            class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium"
            :class="{ 'text-brand-navy': $route.path === '/about' && $route.hash === '#contact' }"
          >
            Contact us
          </NuxtLink>
        </nav>

        <button
          @click="toggleMobileMenu"
          class="lg:hidden p-2 text-brand-dark-gray hover:text-brand-navy transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" />
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-show="mobileMenuOpen" class="lg:hidden fixed left-0 right-0 top-[5.75rem] z-50 border-t border-gray-200 bg-white/95 py-4 shadow-lg backdrop-blur-md sm:top-[6.25rem]">
        <div class="container">
          <nav class="flex flex-col space-y-3" aria-label="Mobile">
            <NuxtLink 
              to="/" 
              class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              Home
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              About us
            </NuxtLink>
            <NuxtLink 
              to="/projects" 
              class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              Projects
            </NuxtLink>
            <NuxtLink 
              to="/publications" 
              class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              Activities
            </NuxtLink>
            <NuxtLink 
              to="/volunteer" 
              class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              Become a Volunteer
            </NuxtLink>
            <NuxtLink 
              to="/about#contact" 
              class="text-brand-dark-gray hover:text-brand-navy transition-colors font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              Contact us
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>
    </div>
  </header>
</template>

<script setup>
const isoToday = computed(() => new Date().toISOString().slice(0, 10))

const formatToday = computed(() =>
  new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date()),
)

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

watch(() => useRoute().path, () => {
  mobileMenuOpen.value = false
})
</script>
