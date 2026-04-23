<script setup>
const activeStage = ref(1)

const stages = [
	{
		id: 1,
		status: "done",
		label: "Tugallandi",
		title: "Natija 1",
		heading: "Salohiyatni mustahkamlash",
		desc: "Ayollar yetakchiligidagi NNTlar va tashabbuskor guruhlarning salohiyati mustahkamlandi hamda ularning ehtiyojlari asosida rivojlanish yo'nalishlari belgilandi.",
		activities: [
			"NNT va tashabbuskor guruhlarning ehtiyojlari xaritalash va tahlil orqali aniqlanadi.",
			"Farg'ona va Toshkent hududlarida 40 ta NNT va TGdan iborat tarmoq shakllantiriladi.",
			"Salohiyatni oshirish rejasi ishlab chiqiladi. Diagnostik tahlil, o'quv dasturini tayyorlash.",
			"Tarmoq davra suhbatlari orqali mustahkamlanadi. Muhokamalar, ehtiyoj va imkoniyatlarni aniqlash.",
			"Advokatsiya yo'nalishlari va dastlabki tashabbuslar ishlab chiqiladi.",
		],
		date: "2025 — 2026 I bosqich",
		color: "#22c55e",
	},
	{
		id: 2,
		status: "active",
		label: "Aktiv",
		title: "Natija 2",
		heading: "Bilim va ko'nikmalarni oshirish",
		desc: "Ishtirokchilarning bilim va ko'nikmalari oshirilib, amaliy faoliyatga yo'naltiriladi. Liderlik, fundraising va advokatsiya bo'yicha treninglar amalga oshirilmoqda.",
		activities: [
			"Trening modullari ishlab chiqiladi va o'quv dasturi joriy etiladi.",
			"Liderlik, fundraising, loyiha yozish, advokatsiya bo'yicha treninglar o'tkaziladi.",
			"Mentorlik va konsultatsiya jarayoni yo'lga qo'yiladi. Individual va guruh mentoring sessiyalari.",
			"NNT va tashabbuskor guruhlar o'rtasida hamkorlik loyihalari ishlab chiqiladi.",
		],
		date: "2026 — II bosqich (hozir)",
		color: "#1a56db",
	},
	{
		id: 3,
		status: "pending",
		label: "Kutilmoqda",
		title: "Natija 3",
		heading: "Barqaror hamkorlik va advokatsiya",
		desc: "Tarmoq orqali barqaror hamkorlik, advokatsiya va fuqarolik faolligi rivojlanadi. Mahalliy darajada pilot tashabbuslar va qo'shma advokatsiya faoliyatlari amalga oshiriladi.",
		activities: [
			"Mahalliy darajada kichik pilot tashabbuslar amalga oshiriladi.",
			"Qo'shma advokatsiya faoliyatlari tashkil etiladi.",
			"Tarmoq faoliyati muntazam uchrashuvlar orqali kengaytiriladi va mustahkamlanadi.",
			"Yakuniy davra suhbati orqali natijalar taqdim etiladi va kelgusi rejalar belgilanadi.",
		],
		date: "2026 — III bosqich",
		color: "#475569",
	},
]

const current = computed(() => stages.find(s => s.id === activeStage.value))
</script>

<template>
	<section class="project-section">
		<div class="section-inner">

			<!-- HEADER -->
			<div class="section-header">
				<span class="eyebrow">Loyiha natijalari</span>
				<h2 class="section-title">Loyiha bosqichlari va faoliyatlar</h2>
				<p class="section-sub">
					"O'zbekistonda ayollar tashabbuslarini rivojlantirish orqali fuqarolik faolligini oshirish"
					loyihasi 3 ta asosiy natijaga yo'naltirilgan.
				</p>
			</div>

			<!-- BODY: left + right -->
			<div class="section-body">

				<!-- LEFT: content -->
				<div class="content-col">
					<Transition name="slide" mode="out-in">
						<div :key="activeStage" class="content-block">
							<!-- Stage badge -->
							<div class="stage-meta">
								<span
									class="stage-badge"
									:class="current.status"
								>
									<span class="badge-dot" :style="{ background: current.color }" />
									{{ current.label }}
								</span>
								<span class="stage-date">{{ current.date }}</span>
							</div>

							<p class="result-label">{{ current.title }}</p>
							<h3 class="result-heading">{{ current.heading }}</h3>
							<p class="result-desc">{{ current.desc }}</p>

							<!-- Activities -->
							<div class="activities">
								<p class="activities-title">Faoliyatlar:</p>
								<div
									v-for="(act, i) in current.activities"
									:key="i"
									class="activity-row"
									:style="{ animationDelay: `${i * 60}ms` }"
								>
									<span class="activity-num" :style="{ background: current.color + '20', color: current.color }">
										{{ String(i + 1).padStart(2, '0') }}
									</span>
									<p class="activity-text">{{ act }}</p>
								</div>
							</div>

							<!-- Hozirgi bosqich note -->
							<div v-if="activeStage === 2" class="current-note">
								<div class="note-dot" />
								<div>
									<p class="note-title">Hozirgi bosqich</p>
									<p class="note-text">
										2026-yil may oyida Toshkent shahrida <strong>II-Davra suhbati</strong> o'tkazilishi rejalashtirilgan bo'lib, unda loyiha natijalari taqdim etiladi, tarmoq faoliyati muhokama qilinadi va kelgusi hamkorlik yo'nalishlari belgilanadi.
									</p>
								</div>
							</div>
						</div>
					</Transition>
				</div>

				<!-- RIGHT: timeline -->
				<div class="timeline-col">
					<div class="timeline-wrap">
						<!-- Stage switch buttons -->
						<div class="stage-switcher">
							<button
								v-for="s in stages"
								:key="s.id"
								class="switcher-btn"
								:class="{ active: activeStage === s.id }"
								@click="activeStage = s.id"
							>
								<svg viewBox="0 0 16 16" fill="none">
									<circle v-if="s.status === 'done'" cx="8" cy="8" r="7" fill="#22c55e" />
									<path v-if="s.status === 'done'" d="M5 8l2 2 4-4" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
									<circle v-if="s.status === 'active'" cx="8" cy="8" r="7" fill="#1a56db" />
									<circle v-if="s.status === 'active'" cx="8" cy="8" r="3" fill="#fff" />
									<circle v-if="s.status === 'pending'" cx="8" cy="8" r="7" fill="none" stroke="#475569" stroke-width="1.5" />
									<circle v-if="s.status === 'pending'" cx="8" cy="8" r="2.5" fill="#475569" />
								</svg>
								{{ s.id }}-natija
							</button>
						</div>

						<!-- Timeline items -->
						<div class="timeline">
							<div
								v-for="(stage, i) in stages"
								:key="stage.id"
								class="timeline-item"
								:class="[stage.status, { active: activeStage === stage.id }]"
								@click="activeStage = stage.id"
							>
								<!-- Connector line -->
								<div v-if="i < stages.length - 1" class="tl-line" />

								<!-- Dot -->
								<div class="tl-dot-wrap">
									<div class="tl-dot" :class="stage.status">
										<svg viewBox="0 0 20 20" fill="none">
											<circle v-if="stage.status === 'done'" cx="10" cy="10" r="9" fill="#22c55e" />
											<path v-if="stage.status === 'done'" d="M6.5 10l2.5 2.5 5-5" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" fill="none" />
											<circle v-if="stage.status === 'active'" cx="10" cy="10" r="9" fill="#1a56db" />
											<circle v-if="stage.status === 'active'" cx="10" cy="10" r="4" fill="#fff" />
											<circle v-if="stage.status === 'pending'" cx="10" cy="10" r="9" fill="none" stroke="#334155" stroke-width="1.5" />
											<circle v-if="stage.status === 'pending'" cx="10" cy="10" r="3" fill="#475569" />
										</svg>
									</div>
								</div>

								<!-- Card -->
								<div class="tl-card">
									<div class="tl-card-top">
										<span class="tl-title">{{ stage.title }}</span>
										<span class="tl-label" :class="stage.status">{{ stage.label }}</span>
									</div>
									<p class="tl-heading">{{ stage.heading }}</p>
									<p class="tl-date">{{ stage.date }}</p>
									<div class="tl-progress">
										<div
											class="tl-progress-fill"
											:style="{
												width: stage.status === 'done' ? '100%' : stage.status === 'active' ? '55%' : '0%',
												background: stage.color
											}"
										/>
									</div>
									<p class="tl-acts">{{ stage.activities.length }} ta faoliyat</p>
								</div>
							</div>
						</div>

						<!-- Project info card -->
						<div class="info-card">
							<div class="info-row">
								<span class="info-key">Moliyalashtiruvchi</span>
								<span class="info-val">UNDEF (BMT)</span>
							</div>
							<div class="info-row">
								<span class="info-key">Hududlar</span>
								<span class="info-val">Farg'ona · Toshkent</span>
							</div>
							<div class="info-row">
								<span class="info-key">Ishtirokchilar</span>
								<span class="info-val">40+ NNT va TG</span>
							</div>
							<div class="info-row">
								<span class="info-key">Hozirgi bosqich</span>
								<span class="info-val active-val">II bosqich</span>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	</section>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;900&display=swap");

.project-section {
	font-family: "DM Sans", sans-serif;
	background: #f8fafc;
	padding: 6rem 1.5rem;
}

.section-inner {
	max-width: 1200px;
	margin: 0 auto;
}

/* HEADER */
.section-header {
	text-align: center;
	margin-bottom: 4rem;
}
.eyebrow {
	display: inline-block;
	font-size: 0.65rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.2em;
	color: #1a56db;
	background: rgba(26, 86, 219, 0.08);
	border: 1px solid rgba(26, 86, 219, 0.15);
	padding: 0.35rem 1rem;
	border-radius: 20px;
	margin-bottom: 1.25rem;
}
.section-title {
	font-size: clamp(1.75rem, 4vw, 2.75rem);
	font-weight: 900;
	color: #0f172a;
	letter-spacing: -0.03em;
	margin-bottom: 1rem;
	line-height: 1.1;
}
.section-sub {
	font-size: 1rem;
	color: #64748b;
	max-width: 600px;
	margin: 0 auto;
	line-height: 1.7;
}

/* BODY */
.section-body {
	display: grid;
	grid-template-columns: 1fr 380px;
	gap: 4rem;
	align-items: start;
}

/* LEFT */
.content-col {
	min-height: 520px;
}
.content-block {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.stage-meta {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}
.stage-badge {
	display: inline-flex;
	align-items: center;
	gap: 0.4rem;
	font-size: 0.68rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	padding: 0.3rem 0.75rem;
	border-radius: 20px;
}
.stage-badge.done {
	background: #f0fdf4;
	color: #16a34a;
	border: 1px solid #bbf7d0;
}
.stage-badge.active {
	background: #eff6ff;
	color: #1a56db;
	border: 1px solid #bfdbfe;
}
.stage-badge.pending {
	background: #f8fafc;
	color: #64748b;
	border: 1px solid #e2e8f0;
}
.badge-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
}
.stage-date {
	font-size: 0.72rem;
	font-weight: 600;
	color: #94a3b8;
}

.result-label {
	font-size: 0.68rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.18em;
	color: #1a56db;
}
.result-heading {
	font-size: clamp(1.4rem, 3vw, 2rem);
	font-weight: 900;
	color: #0f172a;
	letter-spacing: -0.02em;
	line-height: 1.2;
}
.result-desc {
	font-size: 0.95rem;
	color: #64748b;
	line-height: 1.7;
	max-width: 520px;
}

.activities {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
}
.activities-title {
	font-size: 0.68rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	color: #94a3b8;
	margin-bottom: 0.25rem;
}
.activity-row {
	display: flex;
	align-items: flex-start;
	gap: 0.85rem;
	animation: fadeUp 0.4s ease both;
}
@keyframes fadeUp {
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: none; }
}
.activity-num {
	flex-shrink: 0;
	width: 28px;
	height: 28px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.6rem;
	font-weight: 900;
	margin-top: 2px;
}
.activity-text {
	font-size: 0.88rem;
	color: #334155;
	line-height: 1.6;
	padding-top: 4px;
}

/* Current note */
.current-note {
	display: flex;
	gap: 1rem;
	background: #eff6ff;
	border: 1px solid #bfdbfe;
	border-radius: 16px;
	padding: 1.25rem;
	margin-top: 0.5rem;
}
.note-dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: #1a56db;
	flex-shrink: 0;
	margin-top: 4px;
	animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
	0%, 100% { box-shadow: 0 0 0 0 rgba(26, 86, 219, 0.4); }
	50% { box-shadow: 0 0 0 6px rgba(26, 86, 219, 0); }
}
.note-title {
	font-size: 0.72rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.12em;
	color: #1a56db;
	margin-bottom: 0.4rem;
}
.note-text {
	font-size: 0.85rem;
	color: #334155;
	line-height: 1.6;
}
.note-text strong {
	color: #1a56db;
	font-weight: 800;
}

/* Transition */
.slide-enter-active, .slide-leave-active {
	transition: all 0.3s ease;
}
.slide-enter-from {
	opacity: 0;
	transform: translateX(20px);
}
.slide-leave-to {
	opacity: 0;
	transform: translateX(-20px);
}

/* RIGHT */
.timeline-col {
	position: sticky;
	top: 100px;
}
.timeline-wrap {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

/* Stage switcher pills */
.stage-switcher {
	display: flex;
	gap: 0.4rem;
	background: #fff;
	border: 1px solid #f1f5f9;
	border-radius: 14px;
	padding: 0.4rem;
}
.switcher-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.4rem;
	padding: 0.5rem 0.5rem;
	border-radius: 10px;
	border: none;
	background: transparent;
	cursor: pointer;
	font-size: 0.7rem;
	font-weight: 700;
	font-family: inherit;
	color: #94a3b8;
	transition: all 0.2s;
	white-space: nowrap;
}
.switcher-btn svg {
	width: 14px;
	height: 14px;
	flex-shrink: 0;
}
.switcher-btn.active {
	background: #05080f;
	color: #fff;
}
.switcher-btn:not(.active):hover {
	background: #f8fafc;
	color: #334155;
}

/* Timeline */
.timeline {
	background: #fff;
	border: 1px solid #f1f5f9;
	border-radius: 24px;
	overflow: hidden;
}
.timeline-item {
	position: relative;
	display: flex;
	gap: 1rem;
	padding: 1.25rem 1.25rem;
	cursor: pointer;
	transition: background 0.2s;
	border-bottom: 1px solid #f8fafc;
}
.timeline-item:last-child {
	border-bottom: none;
}
.timeline-item:hover {
	background: #f8fafc;
}
.timeline-item.active {
	background: #f8fafc;
}

/* Vertical connector */
.tl-line {
	position: absolute;
	left: calc(1.25rem + 10px);
	top: calc(1.25rem + 20px);
	width: 2px;
	height: calc(100% - 1.25rem);
	background: #f1f5f9;
	z-index: 0;
}
.timeline-item.done .tl-line {
	background: linear-gradient(to bottom, #22c55e40, #1a56db40);
}
.timeline-item.active .tl-line {
	background: linear-gradient(to bottom, #1a56db40, #f1f5f9);
}

.tl-dot-wrap {
	flex-shrink: 0;
	position: relative;
	z-index: 1;
}
.tl-dot {
	width: 22px;
	height: 22px;
}
.tl-dot svg {
	width: 22px;
	height: 22px;
}
.tl-dot.active svg circle:first-child {
	animation: ring-pulse 2s ease-in-out infinite;
}
@keyframes ring-pulse {
	0%, 100% { r: 9; opacity: 1; }
	50% { r: 9; opacity: 0.8; }
}

/* Card */
.tl-card {
	flex: 1;
	min-width: 0;
}
.tl-card-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 0.35rem;
}
.tl-title {
	font-size: 0.65rem;
	font-weight: 900;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	color: #94a3b8;
}
.tl-label {
	font-size: 0.58rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	padding: 0.2rem 0.55rem;
	border-radius: 20px;
}
.tl-label.done {
	background: #f0fdf4;
	color: #16a34a;
}
.tl-label.active {
	background: #eff6ff;
	color: #1a56db;
}
.tl-label.pending {
	background: #f8fafc;
	color: #64748b;
}
.tl-heading {
	font-size: 0.85rem;
	font-weight: 800;
	color: #0f172a;
	margin-bottom: 0.25rem;
	line-height: 1.3;
}
.timeline-item.pending .tl-heading {
	color: #94a3b8;
}
.tl-date {
	font-size: 0.68rem;
	color: #94a3b8;
	font-weight: 600;
	margin-bottom: 0.6rem;
}
.tl-progress {
	height: 3px;
	background: #f1f5f9;
	border-radius: 2px;
	overflow: hidden;
	margin-bottom: 0.4rem;
}
.tl-progress-fill {
	height: 100%;
	border-radius: 2px;
	transition: width 0.8s ease;
}
.tl-acts {
	font-size: 0.65rem;
	font-weight: 700;
	color: #94a3b8;
	text-transform: uppercase;
	letter-spacing: 0.08em;
}

/* Info card */
.info-card {
	background: #05080f;
	border-radius: 18px;
	padding: 1.25rem;
}
.info-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.55rem 0;
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.info-row:last-child {
	border-bottom: none;
}
.info-key {
	font-size: 0.68rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	color: #475569;
}
.info-val {
	font-size: 0.78rem;
	font-weight: 700;
	color: #94a3b8;
}
.info-val.active-val {
	color: #60a5fa;
	font-weight: 800;
}

/* Responsive */
@media (max-width: 900px) {
	.section-body {
		grid-template-columns: 1fr;
		gap: 2.5rem;
	}
	.timeline-col {
		position: static;
	}
}
</style>