<script setup>
import { fakeImg } from '~/data/siteContent'

// Fake team data
const teamMembers = [
  {
    id: 1,
    name: "Dr. Aziz Karimov",
    role: "Bosh Direktor",
    bio: "Iqtisodiy siyosat va rivojlanish iqtisodiyoti bo'yicha 25 yillik tajriba. O'zbekiston Respublikasi Iqtisodiyot vazirligida maslahatchi bo'lib ishlagan. Xalqaro konferensiyalarda ma'ruzalar qilgan, 50 dan ortiq ilmiy maqolalar muallifi.",
    expertise: ["Iqtisodiy siyosat", "Rivojlanish strategiyasi", "Investitsiyalar"],
    education: "O'zbekiston Milliy Universiteti, PhD",
    email: "a.karimov@impect.org",
    phone: "+998 90 123 45 67",
    image: fakeImg('about-m1', 400, 400),
    linkedin: "#",
    twitter: "#"
  },
  {
    id: 2,
    name: "Dilnoza Rahimova",
    role: "Loyihalar Direktori",
    bio: "Xalqaro loyihalarni boshqarish va monitoring bo'yicha 15 yillik tajriba. BMT, Jahon Banki va boshqa xalqaro tashkilotlar bilan hamkorlikda 30 dan ortiq loyihalarni muvaffaqiyatli amalga oshirgan.",
    expertise: ["Loyihalar boshqaruvi", "Monitoring", "Xalqaro hamkorlik"],
    education: "Toshkent Davlat Iqtisodiyot Universiteti, Magistr",
    email: "d.rahimova@impect.org",
    phone: "+998 90 234 56 78",
    image: fakeImg('about-m2', 400, 400),
    linkedin: "#",
    twitter: "#"
  },
  {
    id: 3,
    name: "Bobur Alimov",
    role: "Bosh Tadqiqotchi",
    bio: "Katta ma'lumotlar tahlili va statistik modellashtirish bo'yicha ekspert. Sun'iy intellekt va mashinani o'rganish sohasida 10 yillik tajribaga ega. O'zbekistonning raqamli transformatsiyasi loyihalarida faol ishtirok etadi.",
    expertise: ["Data tahlili", "AI va ML", "Statistika"],
    education: "Toshkent Axborot Texnologiyalari Universiteti, PhD",
    email: "b.alimov@impect.org",
    phone: "+998 90 345 67 89",
    image: fakeImg('about-m3', 400, 400),
    linkedin: "#",
    twitter: "#"
  },
  {
    id: 4,
    name: "Malika Tashmatova",
    role: "Kommunikatsiya Menejeri",
    bio: "Ommaviy aloqolar va media strategiyasi bo'yicha 12 yillik tajriba. Yirik xalqaro kompaniyalarda PR bo'yicha direktor lavozimlarida ishlagan. Impect.org ning obro'sini oshirish va media aloqalarini rivojlantirish uchun mas'ul.",
    expertise: ["Ommaviy aloqolar", "Media strategiya", "Kontent marketing"],
    education: "O'zbekiston Davlat Jahon Tillari Universiteti, Magistr",
    email: "m.tashmatova@impect.org",
    phone: "+998 90 456 78 90",
    image: fakeImg('about-m4', 400, 400),
    linkedin: "#",
    twitter: "#"
  },
  {
    id: 5,
    name: "Dr. Jamshid Bekmurodov",
    role: "Katta Tadqiqotchi",
    bio: "Atrof-muhit muhofazasi va barqaror rivojlanish bo'yicha 20 yillik tajriba. BMTning Atrof-muhit dasturida ekspert sifatida faol ishtirok etgan. O'zbekistonning ekologik muammolari bo'yicha ko'plab tadqiqotlar muallifi.",
    expertise: ["Atrof-muhit", "Barqaror rivojlanish", "Ekologiya"],
    education: "O'zbekiston Milliy Universiteti, PhD",
    email: "j.bekmurodov@impect.org",
    phone: "+998 90 567 89 01",
    image: fakeImg('about-m5', 400, 400),
    linkedin: "#",
    twitter: "#"
  },
  {
    id: 6,
    name: "Dr. Sanobar Akhmedova",
    role: "Ta'lim Bo'yicha Mutaxassis",
    bio: "Ta'lim tizimini modernizatsiya qilish va raqamli ta'limni joriy etish bo'yicha 18 yillik tajriba. O'zbekiston ta'lim tizimini isloh qilish bo'yicha Davlat komissiyasi a'zosi.",
    expertise: ["Ta'lim siyosati", "Raqamli ta'lim", "Ta'lim texnologiyalari"],
    education: "Toshkent Davlat Pedagogika Universiteti, PhD",
    email: "s.akhmedova@impect.org",
    phone: "+998 90 678 90 12",
    image: fakeImg('about-m6', 400, 400),
    linkedin: "#",
    twitter: "#"
  },
  {
    id: 7,
    name: "Nodirbek Yusupov",
    role: "Qishloq Xo'jaligi Mutaxassisi",
    bio: "Qishloq xo'jaligini modernizatsiya qilish va agrotexnologiyalarni joriy etish bo'yicha 14 yillik tajriba. Aqliq qishloq xo'jaligi va zamonaviy sug'orish tizimlari bo'yicha ekspert.",
    expertise: ["Qishloq xo'jaligi", "Agrotexnologiyalar", "Sug'orish tizimlari"],
    education: "Toshkent Qishloq Xo'jaligi Instituti, Magistr",
    email: "n.yusupov@impect.org",
    phone: "+998 90 789 01 23",
    image: fakeImg('about-m7', 400, 400),
    linkedin: "#",
    twitter: "#"
  },
  {
    id: 8,
    name: "Dr. Kamola Umarova",
    role: "Sog'liqni Saqlash Mutaxassisi",
    bio: "Sog'liqni saqlash tizimini takomillashtirish va jamoat salomatligi bo'yicha 16 yillik tajriba. Jahon Sog'liqni Saqlash Tashkiloti bilan hamkorlikda ko'plab loyihalarda ishtirok etgan.",
    expertise: ["Sog'liq siyosati", "Jamoat salomatligi", "Tibbiyot tizimlari"],
    education: "Toshkent Tibbiyot Akademiyasi, PhD",
    email: "k.umarova@impect.org",
    phone: "+998 90 890 12 34",
    image: fakeImg('about-m8', 400, 400),
    linkedin: "#",
    twitter: "#"
  }
]

const values = [
  {
    title: "Ishonch",
    description: "Biz o'z ishimizda to'g'rilik, shaffoflik va professionallikni asq qilamiz. Hamkorlarimiz va mijozlarimiz bilan uzoq muddatli ishonchli aloqalarni o'rnatamiz.",
    icon: "shield"
  },
  {
    title: "Innovatsiya",
    description: "Biz doimiy ravishda yangi yondashuvlar va zamonaviy usullarni qidiramiz. Ilmiy tadqiqotlar va amaliy yechimlar orqali ijobiy o'zgarishlarni amalga oshiramiz.",
    icon: "lightbulb"
  },
  {
    title: "Hamkorlik",
    description: "Biz hamkorlikni muhim deb hisoblaymiz. Davlat organlari, xalqaro tashkilotlar, biznes sektori va fuqorolik jamiyati bilan hamkorlik qilamiz.",
    icon: "users"
  },
  {
    title: "Ta'sir",
    description: "Bizning ishimizning haqiqiy ta'siriga erishishga intilamiz. Tadqiqotlarimiz va tavsiyalarimiz jamiyat hayotiga ijobiy o'zgarishlar keltirishini ta'minlaymiz.",
    icon: "target"
  }
]

const milestones = [
  {
    year: "2015",
    title: "Impekt.org tashkil etildi",
    description: "O'zbekistonda barqaror rivojlanish bo'yicha tadqiqotlar olib borish maqsadida tashkilot asos solindi."
  },
  {
    year: "2017",
    title: "Birinchi xalqaro loyiha",
    description: "BMT bilan hamkorlikda birinchi xalqaro loyiha boshlandi - iqtisodiy islohotlar bo'yicha tadqiqot."
  },
  {
    year: "2019",
    title: "Markaziy ofis ochildi",
    description: "Toshkent shahrida zamonaviy markaziy ofis va tadqiqot markazi ochildi."
  },
  {
    year: "2021",
    title: "50+ loyiha",
    description: "Turli sohalarda 50 dan ortiq loyiha muvaffaqiyatli yakunlandi."
  },
  {
    year: "2023",
    title: "Xalqaro tan olinishi",
    description: "Impekt.org xalqaro miqyosda tan olingan tahlil markaziga aylandi."
  },
  {
    year: "2025",
    title: "Yangi strategiya",
    description: "2025-2030 yillarni qamrab olgan yangi rivojlanish strategiyasi qabul qilindi."
  }
]

const partners = [
  {
    name: "BMT Demokratik Jamg'armasi (UNDEF)",
    type: "Xalqaro tashkilot",
    logo: fakeImg('partner-undef', 280, 120),
  },
  {
    name: "Jahon Banki",
    type: "Xalqaro tashkilot",
    logo: fakeImg('partner-wb', 280, 120),
  },
  {
    name: "O'zbekiston Respublikasi Iqtisodiyot vazirligi",
    type: "Davlat organi",
    logo: fakeImg('partner-moe', 280, 120),
  },
  {
    name: "O'zbekiston Milliy Universiteti",
    type: "Ta'lim muassasi",
    logo: fakeImg('partner-nuu', 280, 120),
  },
  {
    name: "IT Park",
    type: "Texnologiya markazi",
    logo: fakeImg('partner-itpark', 280, 120),
  },
  {
    name: "Asian Development Bank",
    type: "Xalqaro tashkilot",
    logo: fakeImg('partner-adb', 280, 120),
  }
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="border-b border-neutral-200/90 bg-white py-16 sm:py-20">
      <div class="container">
        <div class="max-w-2xl">
          <h1 class="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            {{ $t('about.title') }}
          </h1>
          <p class="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
            {{ $t('about.paragraph1') }}
          </p>
          <p class="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
            {{ $t('about.paragraph2') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-20">
      <div class="container">
        <div class="grid md:grid-cols-2 gap-12">
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-brand-dark-gray">Missiyamiz</h2>
            <p class="text-gray-600 leading-relaxed">
              O'zbekistonda barqaror rivojlanishga erishish uchun dalilga asoslangan tadqiqotlar, chuqur tahlillar va amaliy siyosat tavsiyalarini ishlab chiqarish orqali ijobiy o'zgarishlarni amalga oshirish.
            </p>
          </div>
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-brand-dark-gray">Viziyamiz</h2>
            <p class="text-gray-600 leading-relaxed">
              Markaziy Osiyoda yetakchi tahlil markaziga aylanish, O'zbekistonning rivojlanishiga ilmiy asoslangan yechimlar taklif etish va jamiyat hayotiga haqiqiy ta'sir ko'rsatish.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-20 bg-brand-light-gray">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-brand-dark-gray mb-4">
            Bizning Qadriyatlarimiz
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Bizning ishimiz asosida yotgan asosiy qadriyatlar va tamoyillar.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="value in values" 
            :key="value.title"
            class="text-center space-y-4"
          >
            <div class="w-16 h-16 bg-brand-navy text-white rounded-full flex items-center justify-center mx-auto">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="value.icon === 'shield'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                <path v-else-if="value.icon === 'lightbulb'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                <path v-else-if="value.icon === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                <path v-else-if="value.icon === 'target'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-brand-dark-gray">{{ value.title }}</h3>
            <p class="text-gray-600">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="py-20">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-brand-dark-gray mb-4">
            Bizning Jamoa
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Bizning jamoamiz turli sohalarda tajribaga ega bo'lgan professionallardan iborat.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div 
            v-for="member in teamMembers" 
            :key="member.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img 
              :src="member.image" 
              :alt="member.name"
              class="w-full h-64 object-cover"
            />
            <div class="p-6">
              <h3 class="text-xl font-semibold text-brand-dark-gray mb-2">{{ member.name }}</h3>
              <p class="text-brand-navy font-medium mb-3">{{ member.role }}</p>
              <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ member.bio }}</p>
              
              <div class="mb-4">
                <div class="text-sm text-gray-500 mb-2">Mutaxassislik:</div>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="skill in member.expertise" 
                    :key="skill"
                    class="text-xs bg-brand-light-gray text-brand-navy px-2 py-1 rounded"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>

              <div class="text-sm text-gray-600 space-y-1">
                <div>{{ member.education }}</div>
                <div>{{ member.email }}</div>
                <div>{{ member.phone }}</div>
              </div>

              <div class="flex gap-3 mt-4">
                <a 
                  v-if="member.linkedin"
                  :href="member.linkedin"
                  class="text-brand-navy hover:text-brand-blue transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a 
                  v-if="member.twitter"
                  :href="member.twitter"
                  class="text-brand-navy hover:text-brand-blue transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a9.867 9.867 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Milestones -->
    <section class="py-20 bg-brand-light-gray">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-brand-dark-gray mb-4">
            Tariximiz
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Impakt.org rivojlanish yo'lidagi muhim bosqichlar.
          </p>
        </div>

        <div class="relative">
          <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-brand-navy"></div>
          <div class="space-y-12">
            <div 
              v-for="(milestone, index) in milestones" 
              :key="milestone.year"
              class="flex items-center"
              :class="index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'"
            >
              <div class="flex-1" :class="index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'">
                <div class="bg-white p-6 rounded-xl shadow-lg">
                  <div class="text-2xl font-bold text-brand-navy mb-2">{{ milestone.year }}</div>
                  <h3 class="text-xl font-semibold text-brand-dark-gray mb-3">{{ milestone.title }}</h3>
                  <p class="text-gray-600">{{ milestone.description }}</p>
                </div>
              </div>
              <div class="w-12 h-12 bg-brand-navy text-white rounded-full flex items-center justify-center z-10">
                <span class="text-sm font-bold">{{ milestone.year.slice(-2) }}</span>
              </div>
              <div class="flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partners -->
    <section class="py-20">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-brand-dark-gray mb-4">
            Hamkorlarimiz
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Biz bilan ishonchli hamkorlik qilayotgan tashkilotlar va muassasalar.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="partner in partners" 
            :key="partner.name"
            class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow text-center"
          >
            <img 
              :src="partner.logo" 
              :alt="partner.name"
              class="h-16 mx-auto mb-4 object-contain"
            />
            <h3 class="text-lg font-semibold text-brand-dark-gray mb-2">{{ partner.name }}</h3>
            <p class="text-gray-600 text-sm">{{ partner.type }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-brand-navy text-white">
      <div class="container text-center">
        <h2 class="text-3xl lg:text-4xl font-bold mb-4">
          Bizga Qo'shiling
        </h2>
        <p class="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Impakt.org jamoasiga qo'shiling va O'zbekiston rivojlanishiga o'z hissangizni qo'shing.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/about"
            class="px-8 py-3 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors inline-block text-center"
          >
            {{ $t('about.contact') }}
          </NuxtLink>
          <NuxtLink 
            to="/about"
            class="px-8 py-3 border border-neutral-300 text-neutral-900 font-medium hover:border-neutral-900 transition-colors inline-block text-center"
          >
            Ish o'rni
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
