export type Interest =
  'Каменный дом' | 'Двухмодульный дом' | 'Трехмодульный дом' | 'Земля для ветерана'
export type Completion = 'Пока не определился' | 'Теплый контур' | 'Под отделку' | 'Под ключ'
export type ModuleSize = '6 × 5 м' | '7 × 5 м' | '8 × 5 м'
export type ThreeModuleSize = '7 × 7,5 м' | '8 × 7,5 м'
export type PlanKey = '80' | '110' | '140' | 'module' | 'three-module' | 'three-module-bath'
export interface ProjectRequest {
  interest: Interest
  region: string
  area: number | ''
  completion: Completion
  message: string
}
export interface HousePlan {
  selectable?: boolean
  note?: string
  title: string
  image: string
  alt: string
  area: number
}
