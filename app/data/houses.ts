import type { HousePlan, ModuleSize, PlanKey, ThreeModuleSize } from '~/types/landing'
export const moduleAreas: Record<ModuleSize, number> = {
  '6 × 5 м': 30,
  '7 × 5 м': 35,
  '8 × 5 м': 40,
}
export const threeModuleAreas: Record<ThreeModuleSize, number> = {
  '7 × 7,5 м': 52.5,
  '8 × 7,5 м': 60,
}
export const threeModuleVariants: { size: ThreeModuleSize; area: number; price: string }[] = [
  { size: '7 × 7,5 м', area: 52.5, price: '3 137 500 ₽' },
  { size: '8 × 7,5 м', area: 60, price: '3 375 000 ₽' },
]
export const plans: Record<PlanKey, HousePlan> = {
  '80': {
    title: 'Компактный дом · 80 м²',
    image: 'source-1-5-0.webp',
    alt: 'Планировка компактного дома с двумя спальнями',
    area: 80,
  },
  '110': {
    title: 'Семейный дом · 110 м²',
    image: 'source-1-6-0.webp',
    alt: 'Планировочное решение семейного дома из презентации',
    area: 110,
  },
  '140': {
    title: 'Просторный дом · 140 м²',
    image: 'source-1-7-0.webp',
    alt: 'Планировочное решение дома с кабинетом и гостевой',
    area: 140,
  },
  module: {
    title: 'Двухмодульный дом',
    image: 'source-0-1-2.webp',
    alt: 'Планировка двухмодульного дома из коммерческого предложения',
    area: 30,
  },
  'three-module': {
    title: 'Трехмодульный дом',
    note: 'Схема из КП для предварительного выбора. Итоговые размеры, полезная площадь, конструктив и инженерия уточняются в проекте. Палуба из лиственницы указана в обоих ценовых вариантах КП.',
    image: 'three-module-plan-house.webp',
    alt: 'Планировочное решение трехмодульного дома: две спальни, кухня-гостиная и санузел',
    area: 60,
  },
  'three-module-bath': {
    title: 'Трехмодульная баня · пример планировки',
    note: 'Альтернативное планировочное решение бани из КП. Размеры и площади помещений уточняются в проекте; комплектация и стоимость бани согласуются отдельно.',
    image: 'three-module-plan-bath.webp',
    alt: 'Планировочное решение бани: парная, душ, спальня, кухня-гостиная и санузел',
    area: 52.5,
    selectable: false,
  },
}
