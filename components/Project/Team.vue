<template>
  <div class="bg-[#F7F3EF] text-[#212121] font-sans selection:bg-[#E24C4B]/20">
    <header class="relative py-12 px-4 text-center max-w-4xl mx-auto overflow-hidden">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
        <div class="absolute top-10 left-10 w-64 h-64 bg-[#E24C4B] rounded-full blur-[120px]" />
        <div class="absolute bottom-10 right-10 w-64 h-64 bg-[#F57C00] rounded-full blur-[120px]" />
      </div>

      <h2 class="text-6xl md:text-8xl font-black tracking-tighter text-[#212121] mb-8 leading-[0.85]">
        {{ t("project_team.title_part1") }}
        <span class="text-[#E24C4B]">{{ t("project_team.title_connector") }}</span>
        <br />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#F57C00] to-[#FFC107]">
          {{ t("project_team.title_part2") }}
        </span>
      </h2>
    </header>

    <main class="pb-24">
      <div class="flex flex-wrap justify-center max-w-[1200px] mx-auto px-4 pl-[20px]">
        <div
          v-for="member in partners"
          :key="member.id"
          class="relative group cursor-pointer -ml-[20px] -mb-[15px] transition-transform duration-300 hover:scale-110 z-10 hover:z-50"
          @click="selectedMember = member"
        >
          <div class="w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] rounded-full overflow-hidden border-[5px] border-[#F7F3EF] shadow-lg transition-all duration-400 group-hover:border-[#E24C4B] group-hover:shadow-[0_15px_40px_rgba(226,76,75,0.4)] bg-white">
            <img
              :src="member.image"
              :alt="member.name"
              class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              loading="lazy"
            />
          </div>

          <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[110]">
            <div class="bg-[#212121] text-white text-[10px] font-bold py-2 px-4 rounded-full shadow-2xl whitespace-nowrap border border-white/10">
              {{ member.nnt?.substring(0, 20) }}...
            </div>
          </div>
        </div>
      </div>
    </main>

    <Transition name="modal-bounce">
      <div v-if="selectedMember" class="fixed inset-0 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
        <div class="absolute inset-0 bg-[#212121]/60 transition-opacity" @click="selectedMember = null" />

        <div class="bg-white rounded-[48px] shadow-3xl max-w-lg w-full relative z-[210] border border-[#EFEAE5] will-change-transform">
          <button
            class="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-[#E24C4B] hover:text-white text-[#212121] rounded-full transition-all duration-300 z-[220] shadow-md"
            @click="selectedMember = null"
          >✕</button>

          <div class="p-10 md:p-12 text-center pt-20">
            <div class="absolute -top-16 left-1/2 -translate-x-1/2 z-[220]">
              <div class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-[8px] border-white shadow-xl bg-white">
                <img :src="selectedMember.image" :alt="selectedMember.name" class="w-full h-full object-cover" />
              </div>
            </div>

            <h2 class="text-2xl font-black text-[#212121] mb-2 leading-tight mt-14">
              {{ selectedMember.nnt }}
            </h2>
            <p class="text-[#F57C00] font-bold uppercase tracking-[0.2em] text-[11px] mb-6 pb-6 border-b border-gray-100">
              {{ selectedMember.name }}
            </p>
            
            <p class="text-[#212121]/70 text-[14px] leading-relaxed mb-8 italic px-4">
              "{{ selectedMember.mission }}"
            </p>

            <div class="text-left bg-gray-50/50 p-6 rounded-3xl mb-8 space-y-3 text-[13px] border border-gray-100/50 shadow-inner">
              <div class="flex gap-2">
                <span class="font-bold text-[#212121] min-w-[70px]">Manzil:</span>
                <span class="text-[#212121]/80">{{ selectedMember.address }}</span>
              </div>
              <div class="flex gap-2">
                <span class="font-bold text-[#212121] min-w-[70px]">Tel:</span>
                <a :href="`tel:${selectedMember.phone}`" class="text-[#E24C4B] font-bold hover:underline">{{ selectedMember.phone }}</a>
              </div>
            </div>

            <button class="w-full py-5 rounded-3xl bg-[#E24C4B] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#F57C00] transition-all duration-300 shadow-xl shadow-[#E24C4B]/20">
              {{ t("project_team.cta_portfolio") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const { t, tm } = useI18n()

const selectedMember = ref(null)

// Ma'lumotlarni bir marta computed ichida yig'ib olish
const partners = computed(() => {
  const rawData = tm('project_team.partners')
  if (!rawData || !Array.isArray(rawData)) return []

  return rawData.map((_, index) => ({
    id: index + 1,
    nnt: t(`project_team.partners[${index}].nnt`),
    name: t(`project_team.partners[${index}].name`),
    mission: t(`project_team.partners[${index}].mission`),
    address: t(`project_team.partners[${index}].address`),
    phone: t(`project_team.partners[${index}].phones[0]`),
    image: `/partners/${index + 1}.png`
  }))
})
</script>

<style scoped>
/* Silliq "Bounce" animatsiyasi */
.modal-bounce-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-bounce-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-bounce-enter-from,
.modal-bounce-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(40px);
}

.will-change-transform {
  will-change: transform, opacity;
}
</style>