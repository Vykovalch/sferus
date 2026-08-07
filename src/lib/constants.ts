export const CITIES = [
  'Тирасполь',
  'Бендеры',
  'Рыбница',
  'Дубоссары',
  'Слободзея',
  'Григориополь',
  'Каменка',
] as const

export type City = (typeof CITIES)[number]

export const CATEGORIES = [
  { id: 'repair',     name: 'Ремонт',      icon: 'Wrench'     },
  { id: 'electrical', name: 'Электрика',   icon: 'Zap'        },
  { id: 'plumbing',   name: 'Сантехника',  icon: 'Home'       },
  { id: 'painting',   name: 'Покраска',    icon: 'Paintbrush' },
  { id: 'it',         name: 'IT услуги',   icon: 'Monitor'    },
  { id: 'cleaning',   name: 'Уборка',      icon: 'Sparkles'   },
  { id: 'auto',       name: 'Ремонт авто', icon: 'Car'        },
  { id: 'landscape',  name: 'Ландшафт',    icon: 'Leaf'       },
  { id: 'education',  name: 'Обучение',    icon: 'BookOpen'   },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export const TASK_STATUSES = {
  open:        'Открыто',
  in_progress: 'В работе',
  completed:   'Завершено',
  cancelled:   'Отменено',
} as const

export const USER_ROLES = {
  CLIENT:   'Клиент',
  EXECUTOR: 'Исполнитель',
  BOTH:     'Клиент и исполнитель',
} as const

// Категории услуг/заданий — единый источник для форм создания и админки.
// Раньше дублировались отдельными массивами в CreateServiceForm и CreateTaskForm.
export const SERVICE_CATEGORIES = [
  'Строительство и ремонт',
  'Ремонт техники и оборудования',
  'Дом, быт и уход',
  'Автоуслуги',
  'IT и Digital',
  'Юридические услуги и документы',
  'Бизнес и финансы',
  'Фото и видео',
  'Мероприятия и праздники',
  'Еда и кейтеринг',
  'Медицина',
  'Красота, здоровье и фитнес',
  'Образование и обучение',
  'Домашние животные',
  'Недвижимость и риелторы',
  'Транспорт и доставка',
  'Охрана и безопасность',
  'Производство и изготовление',
  'Агро и благоустройство',
  'Ритуальные услуги',
] as const