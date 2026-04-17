<!-- pages/index.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const projectCore = {
  title: "O'zbekistonda ayollar tashabbuslarini rivojlantirish orqali fuqarolik faolligini oshirish",
  code: "UNDEF Project No. UDF-23-987-UZB",
  period: "2025 - 2027",
  regions: "Farg'ona va Toshkent"
}

const projectTasks = [
  { title: "Xaritalash va Tahlil", desc: "40 ta ayollar NNTlarining ehtiyojlarini chuqur o'rganish va tahlil qilish.", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" },
  { title: "Hamkorlik Tarmog'i", desc: "Tajriba almashish va hamkorlik uchun kuchli platforma yaratish.", img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=800" },
  { title: "Salohiyatni Oshirish", desc: "Liderlik va strategik rejalashtirish bo'yicha amaliy treninglar.", img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" },
  { title: "Advokatsiya", desc: "Gender tengligi va ijtimoiy tashabbuslarni milliy darajada ilgari surish.", img: "https://images.unsplash.com/photo-1573161158365-59b7033d749d?auto=format&fit=crop&q=80&w=800" },
  { title: "Amaliy Toolkit", desc: "Strategik qo'llanmalar va ma'lumotnomalar tayyorlash va tarqatish.", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800" },
  { title: "Barqaror Rivojlanish", desc: "Mahalliy tashabbuslarni milliy darajaga olib chiqish va mustahkamlash.", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" }
]

const team = [
  { name: "Azizkhon Khakimov", role: "Markaz direktori", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400", bio: "20 yillik tajribaga ega boshqaruv va rivojlanish mutaxassisi. Markaziy Osiyo mintaqasidagi fuqarolik jamiyati rivojlanishiga ulkan hissa qo'shgan." },
  { name: "Gulnora Alimova", role: "Loyiha koordinatori", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400", bio: "Gender tengligi va ayollar yetakchiligi sohasidagi mutaxassis. BMT va xalqaro tashkilotlar bilan keng hamkorlik tajribasiga ega." },
  { name: "Bekzod Umarov", role: "Bosh mutaxassis", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400", bio: "Strategik reja va monitoring bo'yicha ekspert. Ilmiy tadqiqot va amaliy loyihalarni muvaffaqiyatli boshqarish tajribasiga ega." },
  { name: "Dildora Karimova", role: "Moliyaviy maslahatchi", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400", bio: "Xalqaro moliya va grantlar menejment sohasida 15 yillik tajribaga ega. Bir nechta xalqaro loyihalarni moliyaviy jihatdan boshqargan." }
]

// --- State ---
const isScrolled = ref(false)
const scrollProgress = ref(0)
const showBackTop = ref(false)
const mobileNavOpen = ref(false)
const activeSection = ref('hero')
const counted = ref(false)
const visibleCards = ref([])
const visibleTeam = ref([])

const modal = ref({ open: false, type: null, data: null })

// contact form
const form = ref({ name: '', email: '', message: '' })
const formSent = ref(false)

// counter display values
const counters = ref([
  { value: 0, target: 40, suffix: '+', label: 'Hamkor NNTlar' },
  { value: 0, target: 6,  suffix: ' ta', label: 'Asosiy yo\'nalish' },
  { value: 0, target: 3,  suffix: '',   label: 'Yil davomida' }
])

// --- Scroll handler ---
function onScroll() {
  const scrollY = window.scrollY
  const maxScroll = document.body.scrollHeight - window.innerHeight

  isScrolled.value = scrollY > 60
  scrollProgress.value = (scrollY / maxScroll) * 100
  showBackTop.value = scrollY > 400

  // Active nav section
  const sections = ['hero', 'tasks', 'impact', 'team']
  for (const id of sections) {
    const el = document.getElementById(id)
    if (el && el.offsetTop <= scrollY + 120) activeSection.value = id
  }

  // Reveal cards
  document.querySelectorAll('.task-card').forEach((el, i) => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
      if (!visibleCards.value.includes(i)) visibleCards.value.push(i)
    }
  })

  document.querySelectorAll('.team-card').forEach((el, i) => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
      if (!visibleTeam.value.includes(i)) visibleTeam.value.push(i)
    }
  })

  // Counters
  const impactEl = document.getElementById('impact')
  if (impactEl && !counted.value && impactEl.getBoundingClientRect().top < window.innerHeight - 100) {
    counted.value = true
    animateCounters()
  }
}

function animateCounters() {
  counters.value.forEach((c, i) => {
    const step = c.target / 40
    const timer = setInterval(() => {
      counters.value[i].value = Math.min(counters.value[i].value + step, c.target)
      if (counters.value[i].value >= c.target) clearInterval(timer)
    }, 30)
  })
}

// --- Modal ---
function openModal(type, data = null) {
  modal.value = { open: true, type, data }
  document.body.style.overflow = 'hidden'
}
function closeModal() {
  modal.value = { open: false, type: null, data: null }
  document.body.style.overflow = ''
  formSent.value = false
}

function submitForm() {
  formSent.value = true
  form.value = { name: '', email: '', message: '' }
}

// --- Lifecycle ---
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="min-h-screen bg-white font-sans overflow-x-hidden">

    <!-- SCROLL PROGRESS -->
    <div
      class="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-600 to-blue-400 z-[1001] transition-all duration-100"
      :style="{ width: scrollProgress + '%' }"
    />

    <!-- HEADER -->
    <header
      class="fixed top-0 w-full z-[900] px-6 lg:px-10 py-5 flex justify-between items-center transition-all duration-300"
      :class="isScrolled ? 'bg-white/90 backdrop-blur-xl border-b border-black/8 shadow-sm' : 'bg-transparent'"
    >
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_Democracy_Fund_Logo.png" alt="UNDEF" class="object-contain w-full" />
        </div>
        <div>
          <h1
            class="font-black text-xl tracking-tight leading-none transition-colors duration-300"
            :class="isScrolled ? 'text-slate-900' : 'text-white'"
          >TARAQQIYOT</h1>
          <p class="text-[10px] uppercase tracking-[0.25em] font-bold text-blue-400">Markaziy Osiyo Rivojlanish Markazi</p>
        </div>
      </div>

      <!-- Desktop nav -->
      <nav class="hidden lg:flex items-center gap-8">
        <a
          v-for="link in [['#hero','Loyiha'],['#tasks','Faoliyat'],['#impact','Ta\'sir'],['#team','Jamoa']]"
          :key="link[0]"
          :href="link[0]"
          class="text-[11px] font-bold uppercase tracking-widest relative pb-0.5 transition-colors duration-200 group"
          :class="isScrolled ? 'text-slate-500 hover:text-slate-900' : 'text-white/90 hover:text-white'"
        >
          {{ link[1] }}
          <span
            class="absolute bottom-0 left-0 h-[1.5px] bg-blue-600 transition-all duration-300"
            :class="activeSection === link[0].replace('#','') ? 'w-full' : 'w-0 group-hover:w-full'"
          />
        </a>
        <button
          @click="openModal('contact')"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-700/40 hover:-translate-y-0.5"
        >
          Bog'lanish
        </button>
      </nav>

      <!-- Hamburger -->
      <button
        class="lg:hidden flex flex-col gap-[5px] p-1"
        @click="mobileNavOpen = !mobileNavOpen"
        aria-label="Menyu"
      >
        <span
          v-for="n in 3" :key="n"
          class="block w-6 h-0.5 transition-all duration-300 rounded"
          :class="[
            isScrolled ? 'bg-slate-900' : 'bg-white',
            mobileNavOpen && n === 1 ? 'translate-y-[7px] rotate-45' : '',
            mobileNavOpen && n === 2 ? 'opacity-0' : '',
            mobileNavOpen && n === 3 ? '-translate-y-[7px] -rotate-45' : ''
          ]"
        />
      </button>
    </header>

    <!-- MOBILE NAV -->
    <Transition name="slide-right">
      <div
        v-if="mobileNavOpen"
        class="fixed inset-y-0 right-0 w-72 bg-white z-[800] shadow-2xl pt-24 px-8"
      >
        <ul class="space-y-1">
          <li
            v-for="link in [['#hero','Loyiha'],['#tasks','Faoliyat'],['#impact','Ta\'sir'],['#team','Jamoa']]"
            :key="link[0]"
            class="border-b border-slate-100"
          >
            <a
              :href="link[0]"
              class="block py-4 text-base font-bold uppercase tracking-widest text-slate-800 hover:text-blue-600 transition-colors"
              @click="mobileNavOpen = false"
            >{{ link[1] }}</a>
          </li>
          <li class="pt-4">
            <button
              class="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold uppercase tracking-widest"
              @click="openModal('contact'); mobileNavOpen = false"
            >Bog'lanish</button>
          </li>
        </ul>
      </div>
    </Transition>
    <Transition name="fade">
      <div
        v-if="mobileNavOpen"
        class="fixed inset-0 bg-black/50 z-[700]"
        @click="mobileNavOpen = false"
      />
    </Transition>

    <!-- HERO -->
    <section id="hero" class="relative h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 z-10 bg-gradient-to-br from-black/70 via-black/50 to-blue-900/40" />
        <video autoplay muted loop playsinline class="w-full h-full object-cover scale-105">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-group-of-people-working-on-a-project-in-an-office-42713-large.mp4" type="video/mp4" />
        </video>
      </div>

      <div class="relative z-20 text-center text-white max-w-5xl px-6 mx-auto">
        <div class="inline-block bg-blue-600/25 backdrop-blur-md border border-white/20 rounded-full px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 animate-bounce">
          {{ projectCore.code }}
        </div>
        <h2 class="text-5xl md:text-7xl font-black leading-[1.05] mb-10 drop-shadow-2xl tracking-tight">
          O'zbekistonda <span class="text-blue-400">Ayollar</span> Tashabbuslarini Rivojlantirish
        </h2>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#tasks"
            class="bg-white text-blue-700 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-2xl hover:-translate-y-0.5"
          >Loyihani o'rganish</a>
          <button
            class="border-2 border-white/40 backdrop-blur-sm text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all duration-300"
            @click="openModal('video')"
          >▶ Videoni ko'rish</button>
        </div>
      </div>

      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/40 flex flex-col items-center gap-2 animate-bounce">
        <div class="w-5 h-5 border-r-2 border-b-2 border-white/40 rotate-45" />
        <span class="text-[10px] font-bold uppercase tracking-[0.2em]">Pastga</span>
      </div>
    </section>

    <!-- TICKER -->
    <div class="bg-slate-900 text-white py-3 overflow-hidden">
      <div class="ticker-track flex gap-16 whitespace-nowrap">
        <template v-for="_ in 2" :key="_">
          <span v-for="item in ['40+ Hamkor NNTlar','2 Hudud: Farg\'ona va Toshkent','2025–2027 Loyiha davri','UNDEF tomonidan moliyalashtirilgan','3-Bosqich amalga oshirilmoqda','2026 Mayda Davra Suhbati']" :key="item" class="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            {{ item }}
          </span>
        </template>
      </div>
    </div>

    <!-- TASKS -->
    <section id="tasks" class="py-28 bg-slate-50 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="mb-16">
          <p class="text-blue-600 text-[11px] font-black uppercase tracking-[0.4em] mb-3">Biz nima qilyapmiz?</p>
          <h2 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Loyihaning asosiy yo'nalishlari</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(task, i) in projectTasks"
            :key="task.title"
            class="task-card group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 hover:border-blue-100 transition-all duration-500 hover:-translate-y-2"
            :class="visibleCards.includes(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
            :style="{ transitionDelay: (i * 80) + 'ms' }"
          >
            <div class="h-52 overflow-hidden relative">
              <img :src="task.img" :alt="task.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div class="p-7">
              <h4 class="text-xl font-black text-slate-900 mb-2">{{ task.title }}</h4>
              <p class="text-slate-500 text-sm leading-relaxed">{{ task.desc }}</p>
              <button class="mt-5 flex items-center gap-2 text-blue-600 font-black text-[11px] uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                Batafsil
                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- IMPACT -->
    <section id="impact" class="py-28 bg-slate-900 text-white relative overflow-hidden px-6">
      <img
        src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000"
        class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
        alt=""
      />
      <div class="max-w-6xl mx-auto relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <p class="text-blue-400 text-[11px] font-black uppercase tracking-[0.4em] mb-4">Ta'sir ko'rsatgichlari</p>
            <h2 class="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-8">
              Ayollar yetakchiligi — <em class="text-blue-400 not-italic">jamiyat tayanchi</em>
            </h2>
            <p class="text-slate-300 text-lg leading-relaxed mb-10">
              Loyiha 3-bosqich (Milestone 3) yakuniga yetmoqda. Biz 40 ta tashkilotni birlashtirdik va ular hozirda o'z hududlarida ijtimoiy o'zgarishlar qilmoqda.
            </p>
            <div class="flex gap-10 flex-wrap">
              <div v-for="c in counters" :key="c.label" class="border-l-4 border-blue-600 pl-5">
                <div class="text-5xl font-black tracking-tight">{{ Math.floor(c.value) }}{{ c.suffix }}</div>
                <div class="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 mt-1">{{ c.label }}</div>
              </div>
            </div>
          </div>

          <div class="bg-white/8 backdrop-blur-md border border-white/12 rounded-[2.5rem] p-8 hover:bg-white/12 transition-all duration-500">
            <div class="aspect-video rounded-2xl overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
                class="w-full h-full object-cover"
                alt="Jamoa"
              />
            </div>
            <blockquote class="text-lg italic text-slate-200 leading-relaxed mb-4">
              "Ushbu loyiha bizga nafaqat bilim, balki bir-birimizni qo'llab-quvvatlash uchun katta tarmoq berdi."
            </blockquote>
            <cite class="text-[11px] font-black uppercase tracking-widest text-blue-400 not-italic">
              — Hamkor NNT rahbari, Farg'ona
            </cite>
          </div>
        </div>
      </div>
    </section>

    <!-- TEAM -->
    <section id="team" class="py-28 bg-white px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <p class="text-blue-600 text-[11px] font-black uppercase tracking-[0.4em] mb-3">Jamoamiz</p>
          <h2 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Loyihani boshqarayotgan ekspertlar</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div
            v-for="(member, i) in team"
            :key="member.name"
            class="team-card transition-all duration-500"
            :class="visibleTeam.includes(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
            :style="{ transitionDelay: (i * 100) + 'ms' }"
          >
            <div
              class="aspect-[3/4] rounded-[2rem] overflow-hidden mb-5 relative group cursor-pointer shadow-xl"
              @click="openModal('team', member)"
            >
              <img
                :src="member.img"
                :alt="member.name"
                class="w-full h-full object-cover grayscale-[60%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-blue-700/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <span class="text-white text-[11px] font-black uppercase tracking-widest">Batafsil →</span>
              </div>
            </div>
            <h4 class="text-lg font-black text-slate-900 mb-1 tracking-tight">{{ member.name }}</h4>
            <p class="text-blue-600 font-black uppercase tracking-widest text-[10px]">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PARTNERS -->
    <section class="py-12 bg-slate-50 border-y border-slate-100 px-6">
      <div class="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-80 transition-all duration-500">
        <img src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_Democracy_Fund_Logo.png" class="h-14 object-contain" alt="UNDEF" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg" class="h-8 object-contain" alt="EU" />
        <span class="font-serif italic font-black text-2xl text-slate-400">USAID</span>
        <span class="font-serif italic font-black text-2xl text-slate-400">JICA</span>
        <span class="font-serif italic font-black text-2xl text-slate-400">EBRD</span>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-slate-950 text-white py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16">
          <div>
            <h2 class="font-black text-4xl tracking-tight text-blue-500 mb-4">TARAQQIYOT.</h2>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-widest leading-loose mb-8">
              BMT Demokratik Jamg'armasi (UNDEF) ko'magida<br>O'zbekistonda fuqarolik jamiyatini rivojlantirish.
            </p>
            <div class="flex gap-3">
              <a
                v-for="icon in ['T','F','I']"
                :key="icon"
                href="#"
                class="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-xs font-black hover:bg-blue-600 hover:border-blue-600 transition-all duration-200 hover:-translate-y-0.5"
              >{{ icon }}</a>
            </div>
          </div>

          <div>
            <h4 class="text-xs font-black uppercase tracking-[0.3em] text-slate-600 mb-6 italic">Aloqa ma'lumotlari</h4>
            <ul class="space-y-4">
              <li v-for="item in [['📞','+998 (73) 244-11-22'],['✉️','info@taraqqiyotngo.uz'],['📍','Farg\'ona, Mustaqillik ko\'chasi, 12-uy']]" :key="item[0]" class="flex gap-3 text-sm text-slate-400 border-b border-white/6 pb-4">
                <span>{{ item[0] }}</span>
                <span>{{ item[1] }}</span>
              </li>
            </ul>
          </div>

          <div class="bg-blue-600 rounded-3xl p-8">
            <h4 class="text-white font-black text-xl mb-3 leading-tight">Hamkor bo'lishni xohlaysizmi?</h4>
            <p class="text-blue-100 text-sm mb-6 leading-relaxed">Loyihamizga qo'shiling va o'zgarishlarning bir qismi bo'ling.</p>
            <button
              class="w-full bg-white text-blue-600 font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] hover:shadow-xl transition-all duration-200"
              @click="openModal('contact')"
            >Ariza yuborish</button>
          </div>
        </div>
        <div class="border-t border-white/8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
          <span>© 2026 TARAQQIYOT MARKAZI. Barcha huquqlar himoyalangan.</span>
          <span>UNDEF mulki</span>
        </div>
      </div>
    </footer>

    <!-- BACK TO TOP -->
    <Transition name="fade">
      <button
        v-if="showBackTop"
        class="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center z-[500] shadow-xl shadow-blue-600/30 hover:-translate-y-1 transition-all duration-200"
        @click="window.scrollTo({ top: 0, behavior: 'smooth' })"
        aria-label="Yuqoriga"
      >
        <svg class="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
      </button>
    </Transition>

    <!-- MODAL -->
    <Transition name="fade">
      <div
        v-if="modal.open"
        class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <Transition name="scale">
          <div v-if="modal.open" class="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl">
            <button
              class="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white flex items-center justify-center text-sm font-bold transition-all"
              @click="closeModal"
            >✕</button>

            <!-- Contact modal -->
            <template v-if="modal.type === 'contact'">
              <h3 class="text-2xl font-black mb-1">Bog'lanish</h3>
              <p class="text-[11px] font-black uppercase tracking-widest text-blue-600 mb-6">Bizga xabar yuboring</p>
              <div v-if="!formSent" class="flex flex-col gap-3">
                <input v-model="form.name" type="text" placeholder="Ismingiz" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 transition-colors" />
                <input v-model="form.email" type="email" placeholder="Email manzilingiz" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 transition-colors" />
                <textarea v-model="form.message" rows="3" placeholder="Xabaringiz..." class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 transition-colors resize-none" />
                <button
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-600/30"
                  @click="submitForm"
                >Yuborish</button>
              </div>
              <div v-else class="text-center py-8">
                <div class="text-5xl mb-4">✅</div>
                <h4 class="text-xl font-black mb-2">Xabar yuborildi!</h4>
                <p class="text-slate-500 text-sm">Tez orada siz bilan bog'lanamiz.</p>
              </div>
            </template>

            <!-- Video modal -->
            <template v-else-if="modal.type === 'video'">
              <h3 class="text-xl font-black mb-4">Loyiha haqida video</h3>
              <div class="aspect-video rounded-2xl overflow-hidden bg-slate-900">
                <video controls autoplay class="w-full h-full rounded-2xl">
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-group-of-people-working-on-a-project-in-an-office-42713-large.mp4" type="video/mp4">
                </video>
              </div>
            </template>

            <!-- Team modal -->
            <template v-else-if="modal.type === 'team' && modal.data">
              <img :src="modal.data.img" :alt="modal.data.name" class="w-20 h-20 rounded-full object-cover mb-4 border-4 border-blue-100" />
              <h3 class="text-2xl font-black mb-1">{{ modal.data.name }}</h3>
              <p class="text-[11px] font-black uppercase tracking-widest text-blue-600 mb-4">{{ modal.data.role }}</p>
              <p class="text-slate-500 text-sm leading-relaxed">{{ modal.data.bio }}</p>
            </template>
          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap');

body { font-family: 'DM Sans', sans-serif; }

.ticker-track {
  animation: ticker 30s linear infinite;
}
@keyframes ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
.slide-right-enter-from, .slide-right-leave-to       { transform: translateX(100%); }

.scale-enter-active, .scale-leave-active { transition: transform 0.3s, opacity 0.3s; }
.scale-enter-from, .scale-leave-to       { transform: scale(0.92); opacity: 0; }
</style>