<script setup>
import { ref, computed } from 'vue'

const activeStage = ref(2) // Hozirgi bosqich Natija 2 da

const stages = [
  {
    id: 1,
    number: "01",
    status: "done",
    label: "Tugallandi",
    title: "Natija 1: Ehtiyojlar va Tarmoq",
    heading: "Salohiyatni mustahkamlash",
    accentColor: "#6c5ce7",
    activities: [
      "Ehtiyojlarni xaritalash va diagnostik tahlil o'tkazish.",
      "Toshkent va Farg'onada 40 ta NNTdan iborat tarmoq yaratish.",
      "Salohiyatni oshirish bo'yicha strategik reja ishlab chiqish.",
      "Tarmoq davra suhbati orqali advokatsiya yo'nalishlarini belgilash."
    ],
    date: "2025 — 2026 I bosqich"
  },
  {
    id: 2,
    number: "02",
    status: "active",
    label: "Aktiv",
    isCurrent: true,
    title: "Natija 2: Bilim va Mentorlik",
    heading: "Bilim va ko'nikmalarni oshirish",
    accentColor: "#a29bfe",
    activities: [
      "Liderlik, Fundraising va Loyiha yozish bo'yicha treninglar.",
      "Individual va guruhli mentorlik sessiyalari.",
      "NNT va tashabbuskor guruhlar uchun maxsus o'quv dasturlari.",
      "Tashkilotlararo qo'shma hamkorlik loyihalarini yaratish."
    ],
    date: "2026 — II bosqich (hozir)"
  },
  {
    id: 3,
    number: "★",
    status: "pending",
    label: "Kutilmoqda",
    title: "II-Davra suhbati (May 2026)",
    heading: "Natijalar taqdimoti",
    accentColor: "#ff758f",
    activities: [
      "Loyiha natijalari va erishilgan yutuqlar taqdimoti.",
      "Tarmoq faoliyati tahlili va muammolar muhokamasi.",
      "Kelgusi barqarorlik va rivojlanish yo'llarini belgilash."
    ],
    date: "May 2026"
  },
  {
    id: 4,
    number: "03",
    status: "pending",
    label: "Kutilmoqda",
    title: "Natija 3: Barqarorlik va Faollik",
    heading: "Barqaror hamkorlik va advokatsiya",
    accentColor: "#fab1a0",
    activities: [
      "Mahalliy darajada kichik pilot tashabbuslarni amalga oshirish.",
      "Hududiy va tarmoq doirasida qo'shma advokatsiya tadbirlari.",
      "Muntazam uchrashuvlar orqali tarmoqni kengaytirish.",
      "Yakuniy natijalar taqdimoti va istiqbolli rejalar."
    ],
    date: "2026 — III bosqich"
  }
]
</script>

<template>
  <section class="timeline-section">
    <div class="container">
      
      <div class="header-content">
        <span class="eyebrow">Loyiha yo'l xaritasi</span>
        <h2 class="main-title">Amalga oshirish bosqichlari</h2>
      </div>

      <div class="timeline-container">
        <div class="central-line"></div>

        <div 
          v-for="(step, index) in stages" 
          :key="step.id"
          class="node-wrapper"
          :class="{ 'flex-reverse': index % 2 !== 0 }"
        >
          <div 
            class="node-dot"
            :class="{ 'is-active': step.status === 'active' }"
            :style="step.status !== 'active' ? { borderColor: step.accentColor, color: step.accentColor } : {}"
          >
            {{ step.number }}
          </div>

          <div class="card-side">
            <div 
              class="step-card"
              :class="{ 'current-highlight': step.status === 'active' }"
              :style="{ borderTopColor: step.accentColor }"
            >
              <div v-if="step.status === 'active'" class="current-badge">
                HOZIRGI BOSQICH
              </div>

              <span class="step-date">{{ step.date }}</span>
              <h3 class="step-title" :style="{ color: step.accentColor }">
                {{ step.title }}
              </h3>
              <p class="step-heading">{{ step.heading }}</p>

              <div class="activity-list">
                <div v-for="(act, i) in step.activities" :key="i" class="activity-item">
                  <span class="bullet" :style="{ color: step.accentColor }">✦</span>
                  <p>{{ act }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="spacer-side"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline-section {
  padding: 80px 20px;
  background: #f8fafc;
  overflow: hidden;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

.header-content {
  text-align: center;
  margin-bottom: 60px;
}

.eyebrow {
  background: #eff6ff;
  color: #1a56db;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.main-title {
  font-size: 36px;
  font-weight: 900;
  color: #0f172a;
  margin-top: 15px;
}

.timeline-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.central-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  bottom: 0;
  width: 2px;
  border-left: 2px dashed #cbd5e1;
  z-index: 0;
}

.node-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 1;
}

.flex-reverse {
  flex-direction: row-reverse;
}

/* Central Dot */
.node-dot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background: white;
  border: 3px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  z-index: 10;
  transition: all 0.3s ease;
}

.node-dot.is-active {
  background: #ff758f;
  border-color: white;
  color: white;
  box-shadow: 0 0 20px rgba(255, 117, 143, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.1); }
  100% { transform: translateX(-50%) scale(1); }
}

/* Card Styling */
.card-side {
  width: 45%;
}

.spacer-side {
  width: 45%;
}

.step-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.05);
  border-top: 6px solid;
  position: relative;
  transition: transform 0.3s ease;
}

.step-card:hover {
  transform: translateY(-5px);
}

.current-highlight {
  background: #fff5f7;
  border-top-color: #ff758f !important;
}

.current-badge {
  position: absolute;
  top: -15px;
  right: 20px;
  background: #ff758f;
  color: white;
  font-size: 10px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 10px;
}

.step-date {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}

.step-title {
  font-size: 20px;
  font-weight: 800;
  margin: 10px 0;
}

.step-heading {
  font-size: 15px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 20px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  gap: 10px;
  font-size: 13.5px;
  color: #64748b;
  line-height: 1.5;
}

.bullet {
  font-weight: bold;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .central-line {
    left: 20px;
  }
  
  .node-wrapper, .node-wrapper.flex-reverse {
    flex-direction: column;
    align-items: flex-start;
    padding-left: 50px;
  }

  .node-dot {
    left: 20px;
    width: 35px;
    height: 35px;
    font-size: 14px;
  }

  .card-side, .spacer-side {
    width: 100%;
  }

  .spacer-side {
    display: none;
  }
}
</style>