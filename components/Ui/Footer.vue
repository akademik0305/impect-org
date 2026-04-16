<script setup>
// const { locale } = useI18n()
// const localePath = useLocalePath()
</script>

<template>
	<footer class="bg-[#1a1410] text-white/40 py-16 border-t-4 border-red-600">
		<div class="container mx-auto px-8 text-center">
			<h2
				class="font-['Playfair_Display'] text-3xl font-black text-white italic mb-4"
			>
				Uz<span class="text-red-600">News</span>
			</h2>
			<p class="max-w-md mx-auto text-xs leading-relaxed mb-8 font-light">
				O'zbekiston va dunyodagi eng so'nggi xabarlar, tahliliy maqolalar va
				tezkor yangiliklar portali.
			</p>
			<div
				class="flex justify-center gap-8 text-[10px] uppercase tracking-widest mb-8 border-y border-white/5 py-6"
			>
				<a href="#" class="hover:text-white transition-colors">Haqimizda</a>
				<a href="#" class="hover:text-white transition-colors">Reklama</a>
				<a href="#" class="hover:text-white transition-colors">Maxfiylik</a>
				<a href="#" class="hover:text-white transition-colors">Aloqa</a>
			</div>
			<p class="text-[10px]">© 2026 UzNews. Barcha huquqlar himoyalangan.</p>
		</div>
	</footer>
</template>

<style scoped>
footer {
	/* Agar globalda bo'lmasa */
	--primary: #c5a059;
	--secondary: #1a1a1a;
}

.text-primary {
	color: var(--primary);
}

.bg-primary {
	background-color: var(--primary);
}
</style>
