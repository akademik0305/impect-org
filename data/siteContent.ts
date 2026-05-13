/** Deterministic placeholder images (picsum.photos by seed). */
export function fakeImg(seed: string, w = 1200, h = 675) {
  const s = seed.replace(/[^a-zA-Z0-9]/g, '').slice(0, 32) || 'impect'
  return `https://picsum.photos/seed/${s}/${w}/${h}`
}

export type Publication = {
  id: number
  slug: string
  title: string
  authors: string[]
  abstract: string
  body: string[]
  category: string
  date: string
  featured: boolean
  image: string
  pubType: string
  downloadUrl: string
  tags: string[]
}

export const publications: Publication[] = [
  {
    id: 1,
    slug: 'economic-reform-2025',
    title: "Iqtisodiy islohotlar: yangi bosqich",
    authors: ['Dr. Aziz Karimov', 'Dr. Gulnora Saidova'],
    abstract:
      "O'zbekistonda iqtisodiy islohotlarning yangi bosqichi va uning jamiyatga ta'siri haqida chuqur tahlil.",
    body: [
      "Ushbu nashr iqtisodiyotning strukturaviy o'zgarishlari, bozor institutlarining mustahkamlanishi va investitsiya muhitining shaffofligi o'rtasidagi bog'liqlikni ko'rib chiqadi.",
      "Tahlil uchun rasmiy statistika, so'rovnomalar va xalqaro taqqoslashlar qo'llanilgan. Xulosa qismida qisqa muddatli va o'rta muddatli siyosat tavsiyalari berilgan.",
      "Tadqiqot siyosatbarorlar, akademik hamjamiyat va biznes uchun manba sifatida foydalanilishi mumkin.",
    ],
    category: 'Iqtisodiyot',
    date: '2025-01-15',
    featured: true,
    image: fakeImg('pub-economic', 900, 560),
    pubType: 'policy_contribution',
    downloadUrl: '#',
    tags: ['Iqtisodiyot', 'Islohotlar', 'Investitsiya'],
  },
  {
    id: 2,
    slug: 'digital-transformation',
    title: 'Digital transformatsiya strategiyasi',
    authors: ['Dilnoza Rahimova', 'Bobur Alimov'],
    abstract:
      "Davlat xizmatlarining raqamlashtirilishi va fuqarolarning raqamli savodxonligini oshirish yo'llari.",
    body: [
      "Raqamli davlat xizmatlari foydalanuvchi tajribasi va orqa ofis jarayonlarining integratsiyasi alohida baholangan.",
      "Xavfsizlik, shaxsiy ma'lumotlarni himoya qilish va tizimlararo ma'lumot almashinuvi bo'yicha tavsiyalar jadvali keltirilgan.",
      "Loyiha va byudjetni rejalashtirish uchun amaliy yo'l xaritasi ilova qilingan.",
    ],
    category: 'Texnologiya',
    date: '2025-01-10',
    featured: true,
    image: fakeImg('pub-digital', 900, 560),
    pubType: 'report',
    downloadUrl: '#',
    tags: ['Raqamlashtirish', 'Davlat', 'Xavfsizlik'],
  },
  {
    id: 3,
    slug: 'sustainable-development',
    title: 'Barqaror rivojlanish maqsadlari',
    authors: ['Dr. Malika Tashmatova', 'Dr. Jamshid Bekmurodov'],
    abstract:
      "BRM ga erishish bo'yicha O'zbekistonning progressi va istiqbollari; ekologik muammolar va yechimlar.",
    body: [
      "Har bir maqsad bo'yicha indikatorlar dinamikasi va mintaqaviy taqqoslashlar aks ettirilgan.",
      "Iqlim, energetika va shaharsozlik siyosatining uyg'unligi alohida bobda muhokama qilinadi.",
      "Hamkorlar uchun monitoring va hisobotlash modeli taklif etiladi.",
    ],
    category: 'Atrof-muhit',
    date: '2025-01-05',
    featured: false,
    image: fakeImg('pub-sust', 900, 560),
    pubType: 'policy_brief',
    downloadUrl: '#',
    tags: ['BRM', 'Ekologiya', 'Monitoring'],
  },
  {
    id: 4,
    slug: 'education-reform',
    title: "Ta'lim tizimini modernizatsiya qilish",
    authors: ['Dr. Sanobar Akhmedova', 'Dr. Rustam Nazarov'],
    abstract:
      "Zamonaviy talablarga javob beradigan ta'lim tizimi va xorijiy tajribani moslashtirish.",
    body: [
      "O'qituvchilar malakasi, o'quv rejalari va baholash tizimlari bo'yicha soha tahlillari.",
      "Raqamli ta'lim infratuzilmasi va kontent standartlari bo'yicha tavsiyalar.",
      "Viloyatlar kesimida teng imkoniyatlar indeksi hisob-kitobi.",
    ],
    category: "Ta'lim",
    date: '2024-12-28',
    featured: false,
    image: fakeImg('pub-edu', 900, 560),
    pubType: 'study',
    downloadUrl: '#',
    tags: ["Ta'lim", 'Infratuzilma', 'Baholash'],
  },
  {
    id: 5,
    slug: 'healthcare-system',
    title: "Sog'liqni saqlash tizimi",
    authors: ['Dr. Kamola Umarova', 'Dr. Botir Karimov'],
    abstract:
      "Aholining sifatli tibbiy xizmatdan foydalanishi: strategik yondashuv va tibbiyot resurslari.",
    body: [
      "Birlamchi tibbiy-sanitariya yordami va ixtisoslashtirilgan yordam o'rtasidagi yuklanish taqsimoti.",
      "Telemeditsina va mobil klinikalar samaradorligi bo'yicha indikatorlar.",
      "Moliyalashtirish manbalari va jamoat salomatligi dasturlarini uyg'unlashtirish.",
    ],
    category: "Sog'liq",
    date: '2024-12-20',
    featured: false,
    image: fakeImg('pub-health', 900, 560),
    pubType: 'analysis',
    downloadUrl: '#',
    tags: ['Tibbiyot', 'Telemeditsina', 'Aholi'],
  },
  {
    id: 6,
    slug: 'agricultural-innovation',
    title: "Qishloq xo'jaligida innovatsiyalar",
    authors: ['Dr. Nodirbek Yusupov', 'Dr. Zuhra Murodova'],
    abstract:
      "Zamonaviy texnologiyalar, oziq-ovqat xavfsizligi va agrar sektor raqamlashtirishi.",
    body: [
      "Sug'orish, urug'chilik va logistika zanjirlarida innovatsion yechimlar tahlili.",
      "Fermer xo'jaliklari uchun moliyaviy vositalar va kafolat mexanizmlari.",
      "Eksport imkoniyatlari va standartlashtirish talablari.",
    ],
    category: "Qishloq xo'jaligi",
    date: '2024-12-15',
    featured: false,
    image: fakeImg('pub-agri', 900, 560),
    pubType: 'working_paper',
    downloadUrl: '#',
    tags: ['Agro', 'Logistika', 'Eksport'],
  },
  {
    id: 7,
    slug: 'social-policy',
    title: 'Ijtimoiy siyosat islohotlari',
    authors: ['Dr. Lola Karimova', 'Dr. Azizbek Toshmatov'],
    abstract:
      "Ijtimoiy himoya, kambag'allikni kamaytirish va ijtimoiy adolat bo'yicha tavsiyalar.",
    body: [
      "Ijtimoiy yordam dasturlarining maqsadli aniqligi va xarajat samaradorligi.",
      "Mehnat bozori va bandlik siyosatining uyg'unligi.",
      "Ma'lumotlar va prognoz modellari asosidagi siyosat sinovlari.",
    ],
    category: 'Ijtimoiy siyosat',
    date: '2024-12-10',
    featured: false,
    image: fakeImg('pub-social', 900, 560),
    pubType: 'policy_brief',
    downloadUrl: '#',
    tags: ['Ijtimoiy himoya', 'Bandlik', 'Prognoz'],
  },
  {
    id: 8,
    slug: 'urban-development',
    title: 'Shaharsozlik va infratuzilma',
    authors: ['Dr. Jamshid Bekmurodov', 'Dr. Kamola Umarova'],
    abstract:
      "Shaharlarni rivojlantirish, transport va aholi oqimini boshqarish bo'yicha yondashuvlar.",
    body: [
      "Transport tarmog'i yuklamasi va ekologik ta'sir baholari.",
      "Aholi punktlarida xavfsizlik va ijtimoiy infratuzilma indekslari.",
      "Public-private hamkorlik modellari va byudjet prioritetlari.",
    ],
    category: 'Shaharsozlik',
    date: '2024-12-05',
    featured: false,
    image: fakeImg('pub-urban', 900, 560),
    pubType: 'report',
    downloadUrl: '#',
    tags: ['Transport', 'PPP', 'Shahar'],
  },
]

export function getPublicationBySlug(slug: string) {
  return publications.find((p) => p.slug === slug)
}

export type Project = {
  id: number
  slug: string
  title: string
  description: string
  body: string[]
  highlights: string[]
  status: 'active' | 'completed' | 'planning'
  startDate: string
  endDate: string
  region: string
  partner: string
  budget: string
  image: string
  category: string
  progress: number
}

export const projects: Project[] = [
  {
    id: 1,
    slug: 'economic-empowerment',
    title: 'Iqtisodiy mustaqillikni kengaytirish',
    description:
      "Ayollarning iqtisodiy faolligi va kichik biznesni rivojlantirish bo'yicha uch yillik loyiha.",
    body: [
      "Loyiha doirasida treninglar, mikrogarantiyalar va mentorlik dasturlari joriy etilgan.",
      "Natijalar monitoringi uchun KPIlar va jamoatchilik bilan ishlash rejasi mavjud.",
    ],
    highlights: ['500+ ishtirokchi', '8 viloyat', 'Mikrogarantiya oynasi'],
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    region: "Farg'ona, Toshkent",
    partner: 'UNDEF',
    budget: '$500,000',
    image: fakeImg('proj-empower', 900, 560),
    category: 'Iqtisodiy rivojlanish',
    progress: 65,
  },
  {
    id: 2,
    slug: 'digital-literacy',
    title: 'Raqamli savodxonlik',
    description:
      "Qishloq joylarida raqamli savodxonlikni oshirish va texnologiyalardan foydalanishni o'rgatish.",
    body: [
      "O'quv modullari, onlayn platforma va mahalliy o'qituvchilar tarmog'i bilan amalga oshiriladi.",
      "Har chorakda progress hisoboti va ishtirokchilar so'rovi o'tkaziladi.",
    ],
    highlights: ['Modullar', 'Onlayn platforma', "Mahalliy o'qituvchilar"],
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2025-12-31',
    region: 'Barcha viloyatlar',
    partner: 'IT Park',
    budget: '$250,000',
    image: fakeImg('proj-diglit', 900, 560),
    category: "Ta'lim",
    progress: 45,
  },
  {
    id: 3,
    slug: 'environmental-protection',
    title: 'Atrof-muhitni himoya qilish',
    description:
      "Ekologik muhit va chiqindilarni qayta ishlash: kompleks loyiha.",
    body: [
      "Daraxt ekish kampaniyalari, chiqindi ajratish va jamoatchilik sessiyalari rejalashtirilgan.",
    ],
    highlights: ['Ekotropa', 'Kampaniyalar', 'Monitoring'],
    status: 'planning',
    startDate: '2025-03-01',
    endDate: '2027-02-28',
    region: 'Sirdaryo, Jizzax',
    partner: 'Greenpeace',
    budget: '$750,000',
    image: fakeImg('proj-env', 900, 560),
    category: 'Atrof-muhit',
    progress: 10,
  },
  {
    id: 4,
    slug: 'healthcare-access',
    title: 'Tibbiy xizmatlarga kirish',
    description:
      "Chekka hududlarda sifatli tibbiy yordam: mobil klinikalar va telemeditsina.",
    body: [
      "Mobil brigadalar marshruti va telekonsultatsiya qamrovi viloyat bo'yicha sozlangan.",
    ],
    highlights: ['Mobil klinikalar', 'Telemeditsina', 'Kadr reja'],
    status: 'active',
    startDate: '2023-09-01',
    endDate: '2025-08-31',
    region: "Qoraqalpog'iston, Xorazm",
    partner: 'WHO',
    budget: '$1,200,000',
    image: fakeImg('proj-health', 900, 560),
    category: "Sog'liqni saqlash",
    progress: 80,
  },
  {
    id: 5,
    slug: 'agricultural-innovation',
    title: "Qishloq xo'jaligida innovatsiyalar",
    description:
      "Sug'orishni modernizatsiya qilish va fermerlarni qo'llab-quvvatlash.",
    body: [
      "Namuna pilot xo'jaliklar va texnik yordam paketi joriy etilgan.",
    ],
    highlights: ['Pilot maydonlar', 'Texnik yordam', "Eksport yo'nalishi"],
    status: 'completed',
    startDate: '2022-01-01',
    endDate: '2024-12-31',
    region: 'Samarqand, Buxoro',
    partner: 'FAO',
    budget: '$2,000,000',
    image: fakeImg('proj-agri', 900, 560),
    category: "Qishloq xo'jaligi",
    progress: 100,
  },
  {
    id: 6,
    slug: 'youth-employment',
    title: 'Yoshlarni bandlik',
    description:
      "Kasb-hunar, stajirovka va ishga joylashishga ko'maklashish dasturi.",
    body: [
      "Hamkor korxonalar bilan staj o'rinlari va sertifikatlash dasturi.",
    ],
    highlights: ['Staj', 'Sertifikat', 'HR hamkorlik'],
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2026-02-28',
    region: 'Toshkent shahri',
    partner: 'ILO',
    budget: '$800,000',
    image: fakeImg('proj-youth', 900, 560),
    category: 'Bandlik',
    progress: 35,
  },
  {
    id: 7,
    slug: 'cultural-heritage',
    title: 'Madaniy merosni asrash',
    description:
      "Muzeylar, tarixiy obidalar va madaniy turizmni rivojlantirish.",
    body: [
      "Restavratsiya loyihalari va raqamli kataloglashtirish bosqichlari.",
    ],
    highlights: ['Restavratsiya', 'Raqamli arxiv', 'Turizm'],
    status: 'planning',
    startDate: '2025-06-01',
    endDate: '2028-05-31',
    region: 'Xiva, Buxoro, Samarqand',
    partner: 'UNESCO',
    budget: '$3,500,000',
    image: fakeImg('proj-culture', 900, 560),
    category: 'Madaniyat',
    progress: 5,
  },
  {
    id: 8,
    slug: 'renewable-energy',
    title: 'Qayta tiklanuvchi energiya',
    description:
      "Quyosh va shamol energetikasini kengaytirish, toza energiya manbalari.",
    body: [
      "Texnik-iqtisodiy asoslash va tarmoq integratsiyasi bo'yicha tahlil hujjatlari.",
    ],
    highlights: ['Quyosh', 'Tarmoq', 'Iqtisodiy asoslash'],
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2027-01-14',
    region: 'Navoiy, Qashqadaryo',
    partner: 'ADB',
    budget: '$5,000,000',
    image: fakeImg('proj-energy', 900, 560),
    category: 'Energetika',
    progress: 25,
  },
]

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export type EventItem = {
  id: number
  slug: string
  title: string
  description: string
  body: string[]
  date: string
  time: string
  location: string
  type: string
  category: string
  speakers: string[]
  agenda: { time: string; title: string }[]
  registrationUrl: string
  image: string
  featured: boolean
  capacity: number
  registered: number
}

export const events: EventItem[] = [
  {
    id: 1,
    slug: 'economic-forum-2025',
    title: 'Iqtisodiy forum 2025',
    description:
      "O'zbekiston iqtisodiyotining joriy holati, strategiyalar va investitsiya imkoniyatlari muhokamasi.",
    body: [
      "Forum plenar yig'ilish, sektor bo'yicha sessiyalar va networking maydonchasidan iborat.",
      "Tashkilotchilar tomonidan materiallar va yozuvlar keyinchalik sayt orqali tarqatiladi.",
    ],
    date: '2026-06-15',
    time: '09:00',
    location: 'Toshkent, Intercontinental Hotel',
    type: 'Konferensiya',
    category: 'Iqtisodiyot',
    speakers: ['Dr. Aziz Karimov', 'Dilnoza Rahimova', 'Mehmon ekspertlar'],
    agenda: [
      { time: '09:00', title: "Ro'yxatdan o'tish va ochilish" },
      { time: '10:30', title: 'Plenar sessiya' },
      { time: '14:00', title: 'Sektor bo\'yicha panel' },
    ],
    registrationUrl: '#',
    image: fakeImg('evt-forum', 900, 560),
    featured: true,
    capacity: 200,
    registered: 156,
  },
  {
    id: 2,
    slug: 'digital-transformation-seminar',
    title: 'Digital transformatsiya seminar',
    description:
      "Davlat xizmatlarining raqamlashtirilishi va AI dan foydalanish bo'yicha amaliy seminar.",
    body: [
      "Ustalar sinfi formatida: namuna integratsiyalar va xavfsizlik checklistlari.",
    ],
    date: '2026-06-22',
    time: '14:00',
    location: 'Online (Zoom)',
    type: 'Seminar',
    category: 'Texnologiya',
    speakers: ['Bobur Alimov'],
    agenda: [
      { time: '14:00', title: 'Kirish va maqsadlar' },
      { time: '15:00', title: 'Amaliy sessiya' },
    ],
    registrationUrl: '#',
    image: fakeImg('evt-digsem', 900, 560),
    featured: true,
    capacity: 500,
    registered: 342,
  },
  {
    id: 3,
    slug: 'young-researchers-meeting',
    title: 'Yosh tadqiqotchilar uchrashuvi',
    description:
      "Ilmiy loyihalar moliyalashuvi va xalqaro hamkorlik imkoniyatlari.",
    body: [
      "Yosh olimlar uchun qisqa ma'ruzalar va mentorlik sessiyasi.",
    ],
    date: '2026-07-08',
    time: '10:00',
    location: 'Samarqand, universitet majmuasi',
    type: 'Uchrashuv',
    category: "Ta'lim",
    speakers: ['Dr. Malika Tashmatova'],
    agenda: [
      { time: '10:00', title: 'Ochilish' },
      { time: '11:30', title: 'Mentorlik' },
    ],
    registrationUrl: '#',
    image: fakeImg('evt-young', 900, 560),
    featured: false,
    capacity: 100,
    registered: 78,
  },
  {
    id: 4,
    slug: 'sustainable-development-conference',
    title: 'Barqaror rivojlanish konferensiyasi',
    description: 'BRM, ekologik muammolar va xalqaro tajriba muhokamasi.',
    body: [
      "Plenar va tematik seksiyalar, poster sessiyasi rejalangan.",
    ],
    date: '2026-08-10',
    time: '09:30',
    location: 'Buxoro, Ark konferentsiya zali',
    type: 'Konferensiya',
    category: 'Atrof-muhit',
    speakers: ['Dr. Jamshid Bekmurodov'],
    agenda: [
      { time: '09:30', title: 'Plenar' },
      { time: '13:00', title: 'Posterlar' },
    ],
    registrationUrl: '#',
    image: fakeImg('evt-sust', 900, 560),
    featured: false,
    capacity: 300,
    registered: 145,
  },
  {
    id: 5,
    slug: 'healthcare-innovation-workshop',
    title: "Sog'liqni saqlash innovatsiyalari",
    description: 'Telemeditsina va tibbiyot texnologiyalari ustalar sinfi.',
    body: [
      "Amaliy mashqlar va vositalar namoyishi.",
    ],
    date: '2026-09-05',
    time: '11:00',
    location: 'Toshkent, tibbiyot innovatsiya markazi',
    type: 'Ustalar sinfi',
    category: "Sog'liq",
    speakers: ['Dr. Kamola Umarova'],
    agenda: [
      { time: '11:00', title: 'Kirish' },
      { time: '12:30', title: 'Amaliy qism' },
    ],
    registrationUrl: '#',
    image: fakeImg('evt-healthw', 900, 560),
    featured: false,
    capacity: 50,
    registered: 32,
  },
  {
    id: 6,
    slug: 'agricultural-tech-summit',
    title: "Qishloq xo'jaligi texnologiyalari sammiti",
    description: 'Aqlli qishloq xo\'jaligi va oziq-ovqat xavfsizligi.',
    body: [
      "Eksponentlar va texnologik yechimlar ko'rgazmasi.",
    ],
    date: '2026-09-18',
    time: '08:00',
    location: "Farg'ona, qishloq xo'jaligi markazi",
    type: 'Sammit',
    category: "Qishloq xo'jaligi",
    speakers: ['Dr. Nodirbek Yusupov'],
    agenda: [
      { time: '08:00', title: 'Ochilish' },
      { time: '10:00', title: 'Texnologik sessiya' },
    ],
    registrationUrl: '#',
    image: fakeImg('evt-agri', 900, 560),
    featured: false,
    capacity: 150,
    registered: 89,
  },
  {
    id: 7,
    slug: 'education-reform-panel',
    title: "Ta'lim islohotlari paneli",
    description: "Ta'lim tizimini modernizatsiya qilish bo'yicha ekspertlar paneli.",
    body: [
      "Savol-javob va onlayn translyatsiya.",
    ],
    date: '2026-04-12',
    time: '15:00',
    location: 'Online (Microsoft Teams)',
    type: 'Panel muhokamasi',
    category: "Ta'lim",
    speakers: ['Dr. Sanobar Akhmedova'],
    agenda: [
      { time: '15:00', title: 'Panel' },
      { time: '16:30', title: 'Savol-javob' },
    ],
    registrationUrl: '#',
    image: fakeImg('evt-edu', 900, 560),
    featured: false,
    capacity: 200,
    registered: 167,
  },
  {
    id: 8,
    slug: 'social-policy-roundtable',
    title: 'Ijtimoiy siyosat davra suhbati',
    description: 'Ijtimoiy himoya va kambag\'allikni kamaytirish.',
    body: [
      "Cheklangan ishtirokchi davra suhbati formati.",
    ],
    date: '2026-04-28',
    time: '10:30',
    location: 'Toshkent, ijtimoiy siyosat markazi',
    type: 'Davra suhbati',
    category: 'Ijtimoiy siyosat',
    speakers: ['Dr. Lola Karimova'],
    agenda: [
      { time: '10:30', title: 'Davra suhbati' },
    ],
    registrationUrl: '#',
    image: fakeImg('evt-social', 900, 560),
    featured: false,
    capacity: 80,
    registered: 54,
  },
]

export function getEventBySlug(slug: string) {
  return events.find((e) => e.slug === slug)
}
