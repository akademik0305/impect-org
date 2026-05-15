<script setup lang="ts">
useHead({
  title: 'Become a Volunteer · Impect',
})

const form = reactive({
  name: '',
  email: '',
  phone: '',
  interest: '',
  message: '',
})

const interests = [
  'Research & analysis',
  'Events & outreach',
  'Communications',
  'Translation',
  'Project support',
  'Other',
]

const submitted = ref(false)
const submitting = ref(false)

const benefits = [
  {
    title: 'Make a real impact',
    description:
      'Support evidence-based policy work that shapes sustainable development in Uzbekistan and the wider region.',
    icon: 'impact',
  },
  {
    title: 'Grow your skills',
    description:
      'Gain hands-on experience in research, events, communications, and cross-sector collaboration alongside experienced professionals.',
    icon: 'skills',
  },
  {
    title: 'Join a strong network',
    description:
      'Connect with researchers, policymakers, international partners, and fellow volunteers who share your commitment to public good.',
    icon: 'network',
  },
  {
    title: 'Flexible involvement',
    description:
      'Choose how you contribute — from occasional event support to ongoing research assistance, on-site or remotely.',
    icon: 'flexible',
  },
]

const submitForm = async () => {
  submitting.value = true
  // TODO: connect to API or email service
  await new Promise((resolve) => setTimeout(resolve, 600))
  console.log('Volunteer sign-up:', { ...form })
  submitting.value = false
  submitted.value = true
  Object.assign(form, { name: '', email: '', phone: '', interest: '', message: '' })
}
</script>

<template>
  <div>
    <header class="border-b border-neutral-200/90 bg-transparent py-12 sm:py-16">
      <div class="container max-w-2xl">
        <p class="section-eyebrow mb-2">
          Get involved
        </p>
        <h1 class="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          Become a Volunteer
        </h1>
        <p class="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
          Join Impect’s community of volunteers and help advance research, events, and policy dialogue. Sign up below — we’ll be in touch shortly.
        </p>
      </div>
    </header>

    <!-- Sign-up form (top) -->
    <section class="border-b border-neutral-200/80 py-12 sm:py-16">
      <div class="container max-w-xl">
        <h2 class="text-lg font-semibold text-neutral-900 sm:text-xl">
          Volunteer sign-up
        </h2>
        <p class="mt-2 text-sm text-neutral-600">
          Fill in your details and tell us how you’d like to contribute.
        </p>

        <div
          v-if="submitted"
          class="mt-8 border border-neutral-200 bg-neutral-50 p-6 text-center"
          role="status"
        >
          <p class="font-medium text-neutral-900">
            Thank you for signing up!
          </p>
          <p class="mt-2 text-sm text-neutral-600">
            We’ve received your application and will contact you within a few business days.
          </p>
          <button
            type="button"
            class="mt-4 text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
            @click="submitted = false"
          >
            Submit another application
          </button>
        </div>

        <form
          v-else
          class="mt-8 space-y-5"
          @submit.prevent="submitForm"
        >
          <div>
            <label for="vol-name" class="block text-sm font-medium text-neutral-900">
              Full name <span class="text-red-600">*</span>
            </label>
            <input
              id="vol-name"
              v-model="form.name"
              type="text"
              required
              autocomplete="name"
              class="mt-1.5 min-h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              placeholder="Your name"
            >
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="vol-email" class="block text-sm font-medium text-neutral-900">
                Email <span class="text-red-600">*</span>
              </label>
              <input
                id="vol-email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                class="mt-1.5 min-h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                placeholder="you@example.com"
              >
            </div>
            <div>
              <label for="vol-phone" class="block text-sm font-medium text-neutral-900">
                Phone
              </label>
              <input
                id="vol-phone"
                v-model="form.phone"
                type="tel"
                autocomplete="tel"
                class="mt-1.5 min-h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                placeholder="+998 90 000 00 00"
              >
            </div>
          </div>

          <div>
            <label for="vol-interest" class="block text-sm font-medium text-neutral-900">
              Area of interest <span class="text-red-600">*</span>
            </label>
            <select
              id="vol-interest"
              v-model="form.interest"
              required
              class="mt-1.5 min-h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
            >
              <option value="" disabled>
                Select an area
              </option>
              <option v-for="item in interests" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </div>

          <div>
            <label for="vol-message" class="block text-sm font-medium text-neutral-900">
              Why do you want to volunteer?
            </label>
            <textarea
              id="vol-message"
              v-model="form.message"
              rows="4"
              class="mt-1.5 w-full resize-y border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              placeholder="A few sentences about your motivation and availability..."
            />
          </div>

          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex min-h-11 w-full items-center justify-center bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60 sm:w-auto"
          >
            {{ submitting ? 'Sending…' : 'Submit application' }}
          </button>
        </form>
      </div>
    </section>

    <!-- Benefits -->
    <section class="py-14 sm:py-16 lg:py-20">
      <div class="container">
        <div class="max-w-2xl">
          <p class="section-eyebrow mb-2">
            Why volunteer with us
          </p>
          <h2 class="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Benefits of volunteering
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
            Whether you’re a student, professional, or retiree, your time and skills help us deliver stronger research and more inclusive public dialogue.
          </p>
        </div>

        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="benefit in benefits"
            :key="benefit.title"
            class="border border-neutral-200/90 bg-white p-6 transition hover:border-neutral-300"
          >
            <div class="flex h-10 w-10 items-center justify-center bg-neutral-900 text-white">
              <svg
                v-if="benefit.icon === 'impact'"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <svg
                v-else-if="benefit.icon === 'skills'"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <svg
                v-else-if="benefit.icon === 'network'"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <svg
                v-else
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="mt-4 text-base font-semibold text-neutral-900">
              {{ benefit.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-neutral-600">
              {{ benefit.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="border-t border-neutral-200/80 bg-neutral-50 py-14 sm:py-16">
      <div class="container max-w-3xl">
        <h2 class="text-xl font-semibold text-neutral-900 sm:text-2xl">
          What happens next?
        </h2>
        <ol class="mt-6 space-y-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
          <li class="flex gap-4">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center bg-neutral-900 text-xs font-bold text-white">1</span>
            <span>We review your application and match you with opportunities that fit your interests and schedule.</span>
          </li>
          <li class="flex gap-4">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center bg-neutral-900 text-xs font-bold text-white">2</span>
            <span>Our team contacts you for a short introductory call or email exchange.</span>
          </li>
          <li class="flex gap-4">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center bg-neutral-900 text-xs font-bold text-white">3</span>
            <span>You receive onboarding details and can start contributing to projects and events.</span>
          </li>
        </ol>
        <p class="mt-8 text-sm text-neutral-500">
          Questions? Email us at
          <a href="mailto:info@impect.org" class="font-medium text-neutral-900 underline-offset-4 hover:underline">info@impect.org</a>
        </p>
      </div>
    </section>
  </div>
</template>
