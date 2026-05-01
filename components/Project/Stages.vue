<script setup>
const { t } = useI18n()
const supabase = useSupabaseClient()

// ── STAGES ────────────────────────────────────────────────
const stages = computed(() => [
  {
    id: 1,
    number: '01',
    status: 'done',
    title: t('stages.items[0].title'),
    heading: t('stages.items[0].heading'),
    accentColor: '#6c5ce7',
    activities: [
      t('stages.items[0].activities[0]'),
      t('stages.items[0].activities[1]'),
      t('stages.items[0].activities[2]'),
      t('stages.items[0].activities[3]'),
    ],
    date: t('stages.items[0].date'),
  },
  {
    id: 2,
    number: '02',
    status: 'active',
    title: t('stages.items[1].title'),
    heading: t('stages.items[1].heading'),
    accentColor: '#a29bfe',
    activities: [
      t('stages.items[1].activities[0]'),
      t('stages.items[1].activities[1]'),
      t('stages.items[1].activities[2]'),
      t('stages.items[1].activities[3]'),
    ],
    date: t('stages.items[1].date'),
  },
  {
    id: 3,
    number: '★',
    status: 'event',
    title: t('stages.items[2].title'),
    heading: t('stages.items[2].heading'),
    accentColor: '#ff758f',
    activities: [
      t('stages.items[2].activities[0]'),
      t('stages.items[2].activities[1]'),
      t('stages.items[2].activities[2]'),
    ],
    date: t('stages.items[2].date'),
  },
  {
    id: 4,
    number: '03',
    status: 'pending',
    title: t('stages.items[3].title'),
    heading: t('stages.items[3].heading'),
    accentColor: '#fab1a0',
    activities: [
      t('stages.items[3].activities[0]'),
      t('stages.items[3].activities[1]'),
      t('stages.items[3].activities[2]'),
      t('stages.items[3].activities[3]'),
    ],
    date: t('stages.items[3].date'),
  },
])

// ── SUPABASE: aktiv bosqich ───────────────────────────────
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
  <section class="bg-slate-50 py-20 px-5 overflow-hidden">
    <div class="max-w-[1100px] mx-auto">

      <!-- HEADER -->
      <div class="text-center mb-16">
        <span class="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
          {{ t('stages.eyebrow') }}
        </span>
        <h2 class="text-4xl font-black text-slate-900 tracking-tight">
          {{ t('stages.title') }}
        </h2>
      </div>

      <!-- TIMELINE -->
      <div class="relative flex flex-col gap-10">

        <!-- Vertikal chiziq desktop -->
        <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-slate-200 z-0 hidden md:block" />
        <!-- Vertikal chiziq mobile -->
        <div class="absolute left-5 top-0 bottom-0 w-px border-l-2 border-dashed border-slate-200 z-0 md:hidden" />

        <div
          v-for="(step, index) in stages"
          :key="step.id"
          class="relative z-10 flex items-center w-full pl-14 md:pl-0"
          :class="index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'"
        >
          <!-- Dot desktop -->
          <div
            class="hidden md:flex absolute left-1/2 -translate-x-1/2 w-[50px] h-[50px] rounded-full items-center justify-center font-black text-sm z-10 border-[3px] bg-white transition-all duration-300"
            :class="isCurrent(step) ? 'shadow-[0_0_24px_rgba(0,0,0,0.2)]' : ''"
            :style="isCurrent(step)
              ? { background: step.accentColor, borderColor: step.accentColor, color: '#fff' }
              : { borderColor: step.accentColor, color: step.accentColor }"
          >
            {{ step.number }}
          </div>

          <!-- Dot mobile -->
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
              <!-- HOZIRGI BOSQICH badge -->
              <div
                v-if="isCurrent(step)"
                class="absolute -top-3.5 right-5 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg"
                :style="{ background: step.accentColor }"
              >
                {{ t('stages.currentBadge') }}
              </div>

              <span class="text-xs text-slate-400 font-semibold">{{ step.date }}</span>

              <h3 class="text-xl font-black mt-2 mb-1" :style="{ color: step.accentColor }">
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

          <!-- Bo'sh joy (zig-zag uchun) -->
          <div class="hidden md:block md:w-[45%]" />
        </div>

      </div>
    </div>
  </section>
</template>