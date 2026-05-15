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
    title: 'Economic reforms: a new phase',
    authors: ['Dr. Aziz Karimov', 'Dr. Gulnora Saidova'],
    abstract:
      'An in-depth analysis of the new phase of economic reforms in Uzbekistan and their impact on society.',
    body: [
      'This publication examines the links between structural economic change, stronger market institutions, and a more transparent investment climate.',
      'Official statistics, surveys, and international comparisons inform the analysis. The conclusions offer short- and medium-term policy recommendations.',
      'The study can serve policymakers, academia, and business as a reference.',
    ],
    category: 'Economy',
    date: '2025-01-15',
    featured: true,
    image: fakeImg('pub-economic', 900, 560),
    pubType: 'policy_contribution',
    downloadUrl: '#',
    tags: ['Economy', 'Reforms', 'Investment'],
  },
  {
    id: 2,
    slug: 'digital-transformation',
    title: 'Digital transformation strategy',
    authors: ['Dilnoza Rahimova', 'Bobur Alimov'],
    abstract:
      'Pathways to digitize public services and raise citizens’ digital literacy.',
    body: [
      'Digital government services are assessed through integrated user experience and back-office processes.',
      'Recommendations cover security, personal data protection, and cross-system data exchange.',
      'A practical roadmap for project and budget planning is included.',
    ],
    category: 'Technology',
    date: '2025-01-10',
    featured: true,
    image: fakeImg('pub-digital', 900, 560),
    pubType: 'report',
    downloadUrl: '#',
    tags: ['Digitization', 'Government', 'Security'],
  },
  {
    id: 3,
    slug: 'sustainable-development',
    title: 'Sustainable Development Goals',
    authors: ['Dr. Malika Tashmatova', 'Dr. Jamshid Bekmurodov'],
    abstract:
      'Uzbekistan’s progress and prospects toward the SDGs; environmental challenges and solutions.',
    body: [
      'Indicator trends and regional comparisons are presented for each goal.',
      'The alignment of climate, energy, and urban policy is discussed in a dedicated chapter.',
      'A monitoring and reporting model is proposed for partners.',
    ],
    category: 'Environment',
    date: '2025-01-05',
    featured: false,
    image: fakeImg('pub-sust', 900, 560),
    pubType: 'policy_brief',
    downloadUrl: '#',
    tags: ['SDGs', 'Ecology', 'Monitoring'],
  },
  {
    id: 4,
    slug: 'education-reform',
    title: 'Modernizing the education system',
    authors: ['Dr. Sanobar Akhmedova', 'Dr. Rustam Nazarov'],
    abstract:
      'Building an education system that meets modern demands and adapts international experience.',
    body: [
      'Sector analysis of teacher qualifications, curricula, and assessment systems.',
      'Recommendations on digital education infrastructure and content standards.',
      'An equality-of-opportunity index calculated by region.',
    ],
    category: 'Education',
    date: '2024-12-28',
    featured: false,
    image: fakeImg('pub-edu', 900, 560),
    pubType: 'study',
    downloadUrl: '#',
    tags: ['Education', 'Infrastructure', 'Assessment'],
  },
  {
    id: 5,
    slug: 'healthcare-system',
    title: 'Healthcare system',
    authors: ['Dr. Kamola Umarova', 'Dr. Botir Karimov'],
    abstract:
      'Quality medical care for the population: a strategic approach and health resources.',
    body: [
      'Distribution of workload between primary care and specialized services.',
      'Indicators on telemedicine and mobile clinic effectiveness.',
      'Aligning financing sources with public health programmes.',
    ],
    category: 'Health',
    date: '2024-12-20',
    featured: false,
    image: fakeImg('pub-health', 900, 560),
    pubType: 'analysis',
    downloadUrl: '#',
    tags: ['Healthcare', 'Telemedicine', 'Population'],
  },
  {
    id: 6,
    slug: 'agricultural-innovation',
    title: 'Innovation in agriculture',
    authors: ['Dr. Nodirbek Yusupov', 'Dr. Zuhra Murodova'],
    abstract:
      'Modern technologies, food security, and digitalization of the agricultural sector.',
    body: [
      'Analysis of innovative solutions in irrigation, seed production, and logistics chains.',
      'Financial instruments and guarantee mechanisms for farms.',
      'Export opportunities and standardization requirements.',
    ],
    category: 'Agriculture',
    date: '2024-12-15',
    featured: false,
    image: fakeImg('pub-agri', 900, 560),
    pubType: 'working_paper',
    downloadUrl: '#',
    tags: ['Agriculture', 'Logistics', 'Export'],
  },
  {
    id: 7,
    slug: 'social-policy',
    title: 'Social policy reforms',
    authors: ['Dr. Lola Karimova', 'Dr. Azizbek Toshmatov'],
    abstract:
      'Recommendations on social protection, poverty reduction, and social justice.',
    body: [
      'Targeting and cost-effectiveness of social assistance programmes.',
      'Alignment of labour market and employment policy.',
      'Policy trials based on data and forecasting models.',
    ],
    category: 'Social policy',
    date: '2024-12-10',
    featured: false,
    image: fakeImg('pub-social', 900, 560),
    pubType: 'policy_brief',
    downloadUrl: '#',
    tags: ['Social protection', 'Employment', 'Forecasting'],
  },
  {
    id: 8,
    slug: 'urban-development',
    title: 'Urban planning and infrastructure',
    authors: ['Dr. Jamshid Bekmurodov', 'Dr. Kamola Umarova'],
    abstract:
      'Approaches to urban development, transport, and managing population flows.',
    body: [
      'Assessments of transport network load and environmental impact.',
      'Safety and social infrastructure indices in settlements.',
      'Public-private partnership models and budget priorities.',
    ],
    category: 'Urban planning',
    date: '2024-12-05',
    featured: false,
    image: fakeImg('pub-urban', 900, 560),
    pubType: 'report',
    downloadUrl: '#',
    tags: ['Transport', 'PPP', 'Cities'],
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
    title: 'Expanding economic empowerment',
    description:
      'A three-year project on women’s economic participation and small business development.',
    body: [
      'Training, micro-guarantees, and mentoring programmes are being implemented.',
      'KPIs and a community engagement plan support results monitoring.',
    ],
    highlights: ['500+ participants', '8 regions', 'Micro-guarantee window'],
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    region: 'Fergana, Tashkent',
    partner: 'UNDEF',
    budget: '$500,000',
    image: fakeImg('proj-empower', 900, 560),
    category: 'Economic development',
    progress: 65,
  },
  {
    id: 2,
    slug: 'digital-literacy',
    title: 'Digital literacy',
    description:
      'Raising digital literacy in rural areas and teaching practical use of technology.',
    body: [
      'Delivered through learning modules, an online platform, and a network of local trainers.',
      'Quarterly progress reports and participant surveys are conducted.',
    ],
    highlights: ['Modules', 'Online platform', 'Local trainers'],
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2025-12-31',
    region: 'All regions',
    partner: 'IT Park',
    budget: '$250,000',
    image: fakeImg('proj-diglit', 900, 560),
    category: 'Education',
    progress: 45,
  },
  {
    id: 3,
    slug: 'environmental-protection',
    title: 'Environmental protection',
    description:
      'A comprehensive project on environmental quality and waste recycling.',
    body: [
      'Tree-planting campaigns, waste sorting, and community sessions are planned.',
    ],
    highlights: ['Eco-trails', 'Campaigns', 'Monitoring'],
    status: 'planning',
    startDate: '2025-03-01',
    endDate: '2027-02-28',
    region: 'Sirdarya, Jizzakh',
    partner: 'Greenpeace',
    budget: '$750,000',
    image: fakeImg('proj-env', 900, 560),
    category: 'Environment',
    progress: 10,
  },
  {
    id: 4,
    slug: 'healthcare-access',
    title: 'Access to healthcare',
    description:
      'Quality medical care in remote areas: mobile clinics and telemedicine.',
    body: [
      'Mobile brigade routes and teleconsultation coverage are configured by region.',
    ],
    highlights: ['Mobile clinics', 'Telemedicine', 'Staff plan'],
    status: 'active',
    startDate: '2023-09-01',
    endDate: '2025-08-31',
    region: 'Karakalpakstan, Khorezm',
    partner: 'WHO',
    budget: '$1,200,000',
    image: fakeImg('proj-health', 900, 560),
    category: 'Healthcare',
    progress: 80,
  },
  {
    id: 5,
    slug: 'agricultural-innovation',
    title: 'Agricultural innovation',
    description:
      'Modernizing irrigation and supporting farmers.',
    body: [
      'Pilot farms and a technical assistance package have been introduced.',
    ],
    highlights: ['Pilot sites', 'Technical assistance', 'Export focus'],
    status: 'completed',
    startDate: '2022-01-01',
    endDate: '2024-12-31',
    region: 'Samarkand, Bukhara',
    partner: 'FAO',
    budget: '$2,000,000',
    image: fakeImg('proj-agri', 900, 560),
    category: 'Agriculture',
    progress: 100,
  },
  {
    id: 6,
    slug: 'youth-employment',
    title: 'Youth employment',
    description:
      'Vocational training, internships, and job placement support.',
    body: [
      'Internship placements and certification with partner companies.',
    ],
    highlights: ['Internships', 'Certification', 'HR partnerships'],
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2026-02-28',
    region: 'Tashkent city',
    partner: 'ILO',
    budget: '$800,000',
    image: fakeImg('proj-youth', 900, 560),
    category: 'Employment',
    progress: 35,
  },
  {
    id: 7,
    slug: 'cultural-heritage',
    title: 'Preserving cultural heritage',
    description:
      'Developing museums, historic sites, and cultural tourism.',
    body: [
      'Restoration projects and digital cataloguing phases.',
    ],
    highlights: ['Restoration', 'Digital archive', 'Tourism'],
    status: 'planning',
    startDate: '2025-06-01',
    endDate: '2028-05-31',
    region: 'Khiva, Bukhara, Samarkand',
    partner: 'UNESCO',
    budget: '$3,500,000',
    image: fakeImg('proj-culture', 900, 560),
    category: 'Culture',
    progress: 5,
  },
  {
    id: 8,
    slug: 'renewable-energy',
    title: 'Renewable energy',
    description:
      'Expanding solar and wind power and clean energy sources.',
    body: [
      'Technical-economic justification and grid integration analyses.',
    ],
    highlights: ['Solar', 'Grid', 'Economic case'],
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2027-01-14',
    region: 'Navoi, Kashkadarya',
    partner: 'ADB',
    budget: '$5,000,000',
    image: fakeImg('proj-energy', 900, 560),
    category: 'Energy',
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
    title: 'Economic Forum 2025',
    description:
      'Discussion of Uzbekistan’s current economy, strategies, and investment opportunities.',
    body: [
      'The forum includes a plenary, sector sessions, and a networking area.',
      'Materials and recordings will be shared on the website afterwards.',
    ],
    date: '2026-06-15',
    time: '09:00',
    location: 'Tashkent, Intercontinental Hotel',
    type: 'Conference',
    category: 'Economy',
    speakers: ['Dr. Aziz Karimov', 'Dilnoza Rahimova', 'Guest experts'],
    agenda: [
      { time: '09:00', title: 'Registration and opening' },
      { time: '10:30', title: 'Plenary session' },
      { time: '14:00', title: 'Sector panel' },
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
    title: 'Digital transformation seminar',
    description:
      'A practical seminar on digitizing public services and using AI.',
    body: [
      'Workshop format with sample integrations and security checklists.',
    ],
    date: '2026-06-22',
    time: '14:00',
    location: 'Online (Zoom)',
    type: 'Seminar',
    category: 'Technology',
    speakers: ['Bobur Alimov'],
    agenda: [
      { time: '14:00', title: 'Introduction and objectives' },
      { time: '15:00', title: 'Practical session' },
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
    title: 'Young researchers meeting',
    description:
      'Funding research projects and international collaboration opportunities.',
    body: [
      'Short talks and a mentoring session for early-career researchers.',
    ],
    date: '2026-07-08',
    time: '10:00',
    location: 'Samarkand, university campus',
    type: 'Meeting',
    category: 'Education',
    speakers: ['Dr. Malika Tashmatova'],
    agenda: [
      { time: '10:00', title: 'Opening' },
      { time: '11:30', title: 'Mentoring' },
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
    title: 'Sustainable development conference',
    description: 'SDGs, environmental challenges, and international experience.',
    body: [
      'Plenary and thematic sessions plus a poster session are planned.',
    ],
    date: '2026-08-10',
    time: '09:30',
    location: 'Bukhara, Ark conference hall',
    type: 'Conference',
    category: 'Environment',
    speakers: ['Dr. Jamshid Bekmurodov'],
    agenda: [
      { time: '09:30', title: 'Plenary' },
      { time: '13:00', title: 'Posters' },
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
    title: 'Healthcare innovation',
    description: 'Telemedicine and medical technology workshop.',
    body: [
      'Hands-on exercises and tool demonstrations.',
    ],
    date: '2026-09-05',
    time: '11:00',
    location: 'Tashkent, medical innovation centre',
    type: 'Workshop',
    category: 'Health',
    speakers: ['Dr. Kamola Umarova'],
    agenda: [
      { time: '11:00', title: 'Introduction' },
      { time: '12:30', title: 'Practical session' },
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
    title: 'Agricultural technology summit',
    description: 'Smart agriculture and food security.',
    body: [
      'Exhibitors and a showcase of technology solutions.',
    ],
    date: '2026-09-18',
    time: '08:00',
    location: 'Fergana, agricultural centre',
    type: 'Summit',
    category: 'Agriculture',
    speakers: ['Dr. Nodirbek Yusupov'],
    agenda: [
      { time: '08:00', title: 'Opening' },
      { time: '10:00', title: 'Technology session' },
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
    title: 'Education reform panel',
    description: 'Expert panel on modernizing the education system.',
    body: [
      'Q&A and online live stream.',
    ],
    date: '2026-04-12',
    time: '15:00',
    location: 'Online (Microsoft Teams)',
    type: 'Panel discussion',
    category: 'Education',
    speakers: ['Dr. Sanobar Akhmedova'],
    agenda: [
      { time: '15:00', title: 'Panel' },
      { time: '16:30', title: 'Q&A' },
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
    title: 'Social policy roundtable',
    description: 'Social protection and poverty reduction.',
    body: [
      'Limited-participant roundtable format.',
    ],
    date: '2026-04-28',
    time: '10:30',
    location: 'Tashkent, social policy centre',
    type: 'Roundtable',
    category: 'Social policy',
    speakers: ['Dr. Lola Karimova'],
    agenda: [
      { time: '10:30', title: 'Roundtable' },
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
