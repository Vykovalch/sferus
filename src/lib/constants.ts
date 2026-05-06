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