<script setup>
const supabase = useSupabaseClient()

// ── STAGES (statik matn) ──────────────────────────────────
const stages = [
  {
    id: 1,
    number: '01',
    status: 'done',
    label: 'Tugallandi',
    title: 'Natija 1: Ehtiyojlar va Tarmoq',
    heading: 'Salohiyatni mustahkamlash',
    accentColor: '#6c5ce7',
    activities: [
      "Ehtiyojlarni xaritalash va diagnostik tahlil o'tkazish.",
      "Toshkent va Farg'onada 40 ta NNTdan iborat tarmoq yaratish.",
      "Salohiyatni oshirish bo'yicha strategik reja ishlab chiqish.",
      "Tarmoq davra suhbati orqali advokatsiya yo'nalishlarini belgilash.",
    ],
    date: '2025 — 2026 I bosqich',
  },
  {
    id: 2,
    number: '02',
    status: 'active',
    label: 'Aktiv',
    title: 'Natija 2: Bilim va Mentorlik',
    heading: "Bilim va ko'nikmalarni oshirish",
    accentColor: '#a29bfe',
    activities: [
      "Liderlik, Fundraising va Loyiha yozish bo'yicha treninglar.",
      'Individual va guruhli mentorlik sessiyalari.',
      "NNT va tashabbuskor guruhlar uchun maxsus o'quv dasturlari.",
      "Tashkilotlararo qo'shma hamkorlik loyihalarini yaratish.",
    ],
    date: '2026 — II bosqich (hozir)',
  },
  {
    id: 3,
    number: '★',
    status: 'event',
    label: 'Tadbir',
    title: 'II-Davra suhbati (May 2026)',
    heading: 'Natijalar taqdimoti',
    accentColor: '#ff758f',
    activities: [
      'Loyiha natijalari va erishilgan yutuqlar taqdimoti.',
      'Tarmoq faoliyati tahlili va muammolar muhokamasi.',
      "Kelgusi barqarorlik va rivojlanish yo'llarini belgilash.",
    ],
    date: 'May 2026',
  },
  {
    id: 4,
    number: '03',
    status: 'pending',
    label: 'Kutilmoqda',
    title: 'Natija 3: Barqarorlik va Faollik',
    heading: 'Barqaror hamkorlik va advokatsiya',
    accentColor: '#fab1a0',
    activities: [
      'Mahalliy darajada kichik pilot tashabbuslarni amalga oshirish.',
      "Hududiy va tarmoq doirasida qo'shma advokatsiya tadbirlari.",
      'Muntazam uchrashuvlar orqali tarmoqni kengaytirish.',
      'Yakuniy natijalar taqdimoti va istiqbolli rejalar.',
    ],
    date: '2026 — III bosqich',
  },
]

// ── SUPABASE: aktiv bosqichni yuklash ─────────────────────
// settings jadvalidagi active_stage qiymatiga qarab
// qaysi karta "HOZIRGI BOSQICH" badge ko'rsatishi aniqlanadi
const { data: stageData } = await useAsyncData('active-stage', async () => {
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'active_stage')
    .single()
  return data?.value ? Number(data.value) : 2
})

const activeStageId = computed(() => stageData.value ?? 2)

function isCurrent(stage) {
  return stage.id === activeStageId.value
}
</script>

<template>
  <section class="bg-slate-50 py-20 px-5 overflow-hidden font-sans">
    <div class="max-w-[1100px] mx-auto">

      <!-- HEADER -->
      <div class="text-center mb-16">
        <span class="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
          Loyiha yo'l xaritasi
        </span>
        <h2 class="text-4xl font-black text-slate-900 tracking-tight">
          Amalga oshirish bosqichlari
        </h2>
      </div>

      <!-- TIMELINE -->
      <div class="relative flex flex-col gap-10">

        <!-- Markaziy vertikal chiziq (desktop) -->
        <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-slate-200 z-0 md:block hidden" />
        <!-- Chiziq (mobile) -->
        <div class="absolute left-5 top-0 bottom-0 w-px border-l-2 border-dashed border-slate-200 z-0 md:hidden" />

        <div
          v-for="(step, index) in stages"
          :key="step.id"
          class="relative z-10 flex items-center w-full"
          :class="[
            index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row',
            'flex-col items-start pl-14 md:pl-0'
          ]"
        >
          <!-- Markaziy dot (desktop) -->
          <div
            class="hidden md:flex absolute left-1/2 -translate-x-1/2 w-[50px] h-[50px] rounded-full items-center justify-center font-black text-sm z-10 border-[3px] bg-white transition-all duration-300"
            :class="isCurrent(step) ? 'border-white shadow-[0_0_24px_rgba(0,0,0,0.2)]' : ''"
            :style="isCurrent(step)
              ? { background: step.accentColor, borderColor: step.accentColor }
              : { borderColor: step.accentColor, color: step.accentColor }"
          >
            <span :class="isCurrent(step) ? 'text-white' : ''">{{ step.number }}</span>
          </div>

          <!-- Dot (mobile) -->
          <div
            class="md:hidden absolute left-2 top-7 w-[34px] h-[34px] rounded-full flex items-center justify-center font-black text-xs z-10 border-[2.5px] bg-white"
            :style="isCurrent(step)
              ? { background: step.accentColor, borderColor: step.accentColor, color: '#fff' }
              : { borderColor: step.accentColor, color: step.accentColor }"
          >
            {{ step.number }}
          </div>

          <!-- Karta -->
          <div class="w-full md:w-[45%]">
            <div
              class="relative p-7 rounded-3xl border-t-[6px] border border-white/50 shadow-[10px_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform duration-300 backdrop-blur-md"
              :class="isCurrent(step) ? 'bg-[#fff5f7]' : 'bg-white/80'"
              :style="{ borderTopColor: step.accentColor }"
            >
              <!-- Hozirgi bosqich badge -->
              <div
                v-if="isCurrent(step)"
                class="absolute -top-3.5 right-5 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg"
                :style="{ background: step.accentColor }"
              >
                HOZIRGI BOSQICH
              </div>

              <span class="text-xs text-slate-400 font-semibold">{{ step.date }}</span>

              <h3
                class="text-xl font-black mt-2 mb-1"
                :style="{ color: step.accentColor }"
              >
                {{ step.title }}
              </h3>

              <p class="text-[15px] font-semibold text-slate-500 mb-5">
                {{ step.heading }}
              </p>

              <div class="flex flex-col gap-3">
                <div
                  v-for="(act, i) in step.activities"
                  :key="i"
                  class="flex gap-2.5 text-[13.5px] text-slate-500 leading-relaxed"
                >
                  <span class="font-bold flex-shrink-0" :style="{ color: step.accentColor }">✦</span>
                  <p>{{ act }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bo'sh joy (desktop zig-zag uchun) -->
          <div class="hidden md:block md:w-[45%]" />
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;900&display=swap');
.font-sans { font-family: 'DM Sans', sans-serif; }
</style>