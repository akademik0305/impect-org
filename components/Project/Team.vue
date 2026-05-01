<template>
	<div
		class="min-h-screen bg-[#F7F3EF] text-[#212121] font-sans selection:bg-[#E24C4B]/20"
	>
		<header
			class="relative py-12 px-4 text-center max-w-4xl mx-auto overflow-hidden"
		>
			<div
				class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none"
			>
				<div
					class="absolute top-10 left-10 w-64 h-64 bg-[#E24C4B] rounded-full blur-[120px]"
				/>
				<div
					class="absolute bottom-10 right-10 w-64 h-64 bg-[#F57C00] rounded-full blur-[120px]"
				/>
			</div>

			<div
				class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-xl shadow-sm border border-[#EFEAE5] text-[#E24C4B] text-xs font-bold mb-8 uppercase tracking-[0.3em]"
			>
				<span class="w-2 h-2 rounded-full bg-[#E24C4B] animate-pulse" />
				<span>{{ t("project_team.badge") }}</span>
			</div>

			<h1
				class="text-6xl md:text-8xl font-black tracking-tighter text-[#212121] mb-8 leading-[0.85]"
			>
				{{ t("project_team.title_part1") }}
				<span class="text-[#E24C4B]">{{
					t("project_team.title_connector")
				}}</span>
				<br />
				<span
					class="text-transparent bg-clip-text bg-gradient-to-r from-[#F57C00] to-[#FFC107]"
				>
					{{ t("project_team.title_part2") }}
				</span>
			</h1>

			<p
				class="text-lg md:text-xl text-[#212121]/70 max-w-2xl mx-auto leading-relaxed"
			>
				{{ t("project_team.description") }}
			</p>
		</header>

		<main class="pb-48">
			<div
				class="flex flex-wrap justify-center max-w-[900px] mx-auto px-4 pl-[15px]"
			>
				<div
					v-for="member in members"
					:key="member.id"
					class="relative group cursor-pointer -ml-[15px] -mb-[10px] transition-all duration-300 hover:scale-125 z-10 hover:z-50"
					@click="selectedMember = member"
				>
					<div
						class="w-[85px] h-[85px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden border-[4px] border-[#F7F3EF] shadow-md transition-all duration-400 group-hover:border-[#E24C4B] group-hover:shadow-[0_10px_30px_rgba(226,76,75,0.3)]"
					>
						<img
							:src="member.image"
							:alt="member.name"
							class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
						/>
					</div>

					<div
						class="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[110]"
					>
						<div
							class="bg-[#212121] text-white text-[10px] font-bold py-1.5 px-3 rounded-full shadow-xl whitespace-nowrap border border-white/10"
						>
							{{ member.name }}
						</div>
					</div>
				</div>
			</div>
		</main>

		<Transition name="modal-fade">
			<div
				v-if="selectedMember"
				class="fixed inset-0 flex items-center justify-center z-[200] p-4"
			>
				<div
					class="absolute inset-0 bg-[#212121]/80 backdrop-blur-md"
					@click="selectedMember = null"
				/>

				<div
					class="bg-white rounded-[40px] overflow-hidden shadow-2xl max-w-md w-full relative z-10 border border-[#EFEAE5]"
				>
					<div class="relative h-72 sm:h-96">
						<img
							:src="selectedMember.image"
							:alt="selectedMember.name"
							class="w-full h-full object-cover"
						/>
						<button
							class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-[#E24C4B] hover:text-white text-[#212121] rounded-full transition-all duration-300 shadow-lg"
							@click="selectedMember = null"
						>
							✕
						</button>
						<div
							class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"
						/>
					</div>

					<div
						class="p-10 text-center -mt-8 relative bg-white rounded-t-[40px]"
					>
						<h2 class="text-3xl font-black text-[#212121] mb-2">
							{{ selectedMember.name }}
						</h2>
						<p
							class="text-[#F57C00] font-bold uppercase tracking-[0.2em] text-xs mb-6"
						>
							{{ selectedMember.role }}
						</p>
						<p class="text-[#212121]/60 leading-relaxed mb-8">
							{{ t("project_team.member_quote") }}
						</p>

						<button
							class="w-full py-4 rounded-2xl bg-[#E24C4B] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#F57C00] transition-all duration-300 shadow-lg shadow-[#E24C4B]/20"
						>
							{{ t("project_team.cta_portfolio") }}
						</button>
					</div>
				</div>
			</div>
		</Transition>

		<footer
			class="py-12 border-t border-[#EFEAE5] text-center text-[#212121]/40 text-[10px] font-bold tracking-[0.4em] uppercase"
		>
			<p>{{ t("project_team.footer_text", { year: 2026 }) }}</p>
		</footer>
	</div>
</template>

<script setup>
import { ref } from "vue"

// i18n hooki (Nuxt i18n ishlatayotgan bo'lsangiz)
const { t } = useI18n()

const selectedMember = ref(null)

// Ismlar va Rollarni tarjima faylidan massiv ko'rinishida olish
// JSON faylingizda: "project_team": { "names": ["Alijon", "Zuhra"...], "roles": ["Direktor", ...] }
const members = Array.from({ length: 40 }, (_, i) => {
	const names = t("project_team.names", { returnObjects: true }) || []
	const roles = t("project_team.roles", { returnObjects: true }) || []

	return {
		id: i + 1,
		name: names[i % names.length] || `Member ${i + 1}`,
		role: roles[i % roles.length] || `Role ${i + 1}`,
		image: `https://picsum.photos/seed/we-empower-${i}/400/400`,
	}
})
</script>
