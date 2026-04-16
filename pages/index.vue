<script setup>
// Ma'lumotlar bazasi
const newsStore = [
	{
		id: 1,
		cat: "Iqtisodiyot",
		title:
			"O'zbekiston 2025-yilga mo'ljallangan yirik iqtisodiy islohot dasturini taqdim etdi",
		excerpt:
			"Hukumat yangi besh yillik iqtisodiy rivojlanish strategiyasini e'lon qildi. Dastur investitsiyalarni jalb qilishga qaratilgan.",
		date: "14 aprel 2025",
		read: "5 daqiqa",
		isFeatured: true,
	},
	{
		id: 2,
		cat: "Siyosat",
		title: "Parlament yangi qonunchilik paketini ko'rib chiqmoqda",
		excerpt:
			"Deputatlar ovoz berish natijasida bir nechta yangi qonun loyihalarini ma'qulladi.",
		date: "13 aprel",
		read: "3 daqiqa",
	},
	{
		id: 3,
		cat: "Sport",
		title: "O'zbek kurashchilari jahon chempionatida 7 medal qozondi",
		excerpt:
			"Milliy jamoamiz vakillariga 3 oltin, 2 kumush va 2 bronza nasib etdi.",
		date: "13 aprel",
		read: "2 daqiqa",
	},
	{
		id: 4,
		cat: "Texnologiya",
		title: "Toshkentda sun'iy intellekt markazi ochilishi rejalashtirilgan",
		excerpt: "Yangi markazda 200 dan ortiq mutaxassis faoliyat olib boradi.",
		date: "12 aprel",
		read: "4 daqiqa",
	},
	// ... ko'proq ma'lumotlar
]

const currentPage = ref(1)
const featuredNews = newsStore.find(n => n.isFeatured)
const regularNews = newsStore.filter(n => !n.isFeatured)
 

</script>

<template>
	<div
		class="bg-[#faf9f6] min-h-screen font-['IBM_Plex_Sans',sans-serif] text-[#1a1410]"
	>
	
		<div class="bg-red-600 text-white py-2 flex items-center overflow-hidden">
			<div
				class="bg-black/20 px-4 py-1 text-[10px] font-bold uppercase tracking-widest shrink-0 ml-8 z-10 rounded-sm"
			>
				Tezkor
			</div>
			<div class="animate-marquee whitespace-nowrap pl-8 text-sm font-medium">
				<span v-for="i in 5" :key="i">
					O'zbekiston YaIM 2026-yilda 6.5% o'sdi • Toshkentda yangi metro
					liniyasi ochildi • Xalqaro tennis turnirida o'zbek sportchisi g'alaba
					qozondi • &nbsp;
				</span>
			</div>
		</div>

		<section
			class="relative bg-[#0d1824] h-[550px] overflow-hidden group cursor-pointer"
		>
			<div
				class="absolute inset-0 bg-gradient-to-r from-[#1a2535] to-[#0d1824] opacity-90 transition-opacity group-hover:opacity-100"
			/>
			<div
				class="absolute top-0 right-0 w-[500px] h-[500px] border-[60px] border-red-600/10 rounded-full -mr-48 -mt-24"
			/>

			<div
				class="container mx-auto px-8 h-full flex items-center relative z-10"
			>
				<div class="max-w-3xl">
					<span
						class="inline-block bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 mb-6 rounded-sm"
						>Asosiy yangilik</span
					>
					<h2
						class="font-['Playfair_Display'] text-4xl md:text-6xl text-white font-bold leading-tight mb-6 transition-transform duration-500 group-hover:-translate-y-2"
					>
						{{ featuredNews.title }}
					</h2>
					<p
						class="text-white/60 text-lg mb-8 font-light max-w-2xl leading-relaxed"
					>
						{{ featuredNews.excerpt }}
					</p>
					<div
						class="flex items-center gap-6 text-white/40 text-xs uppercase tracking-widest"
					>
						<span class="flex items-center gap-2 text-red-500 font-bold"
							><span class="w-2 h-2 bg-red-600 rounded-full"/>
							{{ featuredNews.cat }}</span
						>
						<span class="border-l border-white/20 pl-6">{{
							featuredNews.date
						}}</span>
						<span class="border-l border-white/20 pl-6"
							>{{ featuredNews.read }} o'qish</span
						>
					</div>
				</div>
			</div>
		</section>

		<section class="container mx-auto px-8 -mt-12 relative z-20">
			<div
				class="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#d4cfc5] border border-[#d4cfc5] shadow-2xl"
			>
				<div
					v-for="news in regularNews.slice(0, 3)"
					:key="news.id"
					class="bg-white p-6 hover:bg-[#f2f0eb] transition-colors cursor-pointer group"
				>
					<span
						class="text-red-600 text-[10px] font-bold uppercase tracking-widest"
						>{{ news.cat }}</span
					>
					<h4
						class="font-['Playfair_Display'] text-[17px] font-bold mt-2 leading-snug group-hover:text-red-800 transition-colors"
					>
						{{ news.title }}
					</h4>
					<p class="text-[11px] text-gray-400 mt-3 uppercase">
						{{ news.date }} · {{ news.read }}
					</p>
				</div>
			</div>
		</section>

		<main
			class="container mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12"
		>
			<div class="lg:col-span-8">
				<div
					class="flex justify-between items-baseline border-b-2 border-[#1a1410] mb-8 pb-2"
				>
					<h3 class="font-['Playfair_Display'] text-2xl font-bold italic">
						So'nggi yangiliklar
					</h3>
					<a
						href="#"
						class="text-red-600 text-[11px] font-bold uppercase tracking-widest hover:underline"
						>Barchasi →</a
					>
				</div>

				<div class="space-y-0">
					<article
						v-for="news in regularNews"
						:key="news.id"
						class="grid grid-cols-1 md:grid-cols-4 gap-6 py-8 border-b border-[#d4cfc5] group cursor-pointer"
					>
						<div
							class="md:col-span-1 aspect-[4/3] bg-[#e8e4dc] flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase tracking-widest overflow-hidden rounded-sm relative"
						>
							RASM
							<div
								class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"
							/>
						</div>
						<div class="md:col-span-3">
							<span
								class="text-red-600 text-[10px] font-bold uppercase tracking-widest"
								>{{ news.cat }}</span
							>
							<h3
								class="font-['Playfair_Display'] text-2xl font-bold mt-1 group-hover:text-red-800 transition-colors leading-tight"
							>
								{{ news.title }}
							</h3>
							<p
								class="text-[#6b6560] text-sm mt-3 line-clamp-2 leading-relaxed font-light"
							>
								{{ news.excerpt }}
							</p>
							<div
								class="flex items-center gap-4 text-[11px] text-[#9e9890] mt-4 font-medium uppercase"
							>
								<span>{{ news.date }}</span>
								<span class="w-1 h-1 bg-[#9e9890] rounded-full"/>
								<span>{{ news.read }} o'qish</span>
							</div>
						</div>
					</article>
				</div>

				<div
					class="mt-12 pt-8 border-t border-[#d4cfc5] flex justify-center gap-1"
				>
					<button
						v-for="p in 3"
						:key="p"
						:class="[
							'w-10 h-10 text-xs border border-[#d4cfc5] transition-all hover:border-black',
							p === 1 ? 'bg-[#1a1410] text-white border-[#1a1410]' : 'bg-white',
						]"
					>
						{{ p }}
					</button>
				</div>
			</div>

			<aside class="lg:col-span-4 space-y-12">
				<section>
					<h4
						class="font-['Playfair_Display'] text-lg font-bold border-b-2 border-black pb-2 mb-6 tracking-tight"
					>
						Kategoriyalar
					</h4>
					<ul class="space-y-0">
						<li
							v-for="c in [
								'Iqtisodiyot',
								'Siyosat',
								'Jamiyat',
								'Sport',
								'Texnologiya',
							]"
							:key="c"
							class="flex justify-between items-center py-3 border-b border-[#d4cfc5] text-sm hover:text-red-600 cursor-pointer group"
						>
							<span
								class="transition-transform group-hover:translate-x-1 font-medium"
								>{{ c }}</span
							>
							<span
								class="bg-[#f2f0eb] text-[10px] px-2 py-1 rounded-full text-gray-400 font-bold tracking-tighter"
								>142</span
							>
						</li>
					</ul>
				</section>

				<section>
					<h4
						class="font-['Playfair_Display'] text-lg font-bold border-b-2 border-black pb-2 mb-6 tracking-tight"
					>
						Eng ko'p o'qilgan
					</h4>
					<div class="space-y-6">
						<div
							v-for="i in 3"
							:key="i"
							class="flex gap-4 group cursor-pointer"
						>
							<div
								class="w-20 h-14 bg-[#e8e4dc] shrink-0 text-[8px] flex items-center justify-center font-bold text-gray-400 uppercase"
							>
								RASM
							</div>
							<div>
								<h5
									class="font-['Source_Serif_4',serif] text-sm font-semibold leading-snug group-hover:text-red-700"
								>
									Toshkentda yangi ko'prik qurilishi boshlanadi — loyiha muddati
									2 yil
								</h5>
								<p class="text-[10px] text-gray-400 mt-1 uppercase">
									12 Aprel 2025
								</p>
							</div>
						</div>
					</div>
				</section>

				<div
					class="bg-[#f2f0eb] border border-dashed border-[#d4cfc5] py-16 text-center rounded-sm"
				>
					<span
						class="text-[10px] uppercase tracking-[0.2em] text-[#9e9890] font-bold"
						>Reklama maydoni</span
					>
				</div>
			</aside>
		</main>

		
	</div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=IBM+Plex+Sans:wght@300;400;500;600&family=Source+Serif+4:wght@400;600&display=swap");

.no-scrollbar::-webkit-scrollbar {
	display: none;
}
.no-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

@keyframes marquee {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(-50%);
	}
}
.animate-marquee {
	display: inline-block;
	animation: marquee 40s linear infinite;
}
.animate-marquee:hover {
	animation-play-state: paused;
}
</style>
