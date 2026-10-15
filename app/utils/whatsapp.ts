import type { ModuleSize, ProjectRequest, ThreeModuleSize } from '~/types/landing'
import { moduleAreas, threeModuleAreas } from '~/data/houses'
export function buildRequestText(
  form: ProjectRequest,
  moduleSize: ModuleSize,
  threeModuleSize: ThreeModuleSize,
): string {
  const lines = [
    'Здравствуйте! Хочу обсудить проект со «Стройинвест».',
    '',
    `Направление: ${form.interest}`,
    `Город / регион: ${form.region.trim()}`,
  ]
  if (form.interest !== 'Земля для ветерана') {
    if (form.area) lines.push(`Желаемая площадь: ${String(form.area).replace('.', ',')} м²`)
    lines.push(`Комплектация: ${form.completion}`)
    if (form.interest === 'Двухмодульный дом' && Number(form.area) === moduleAreas[moduleSize])
      lines.push(`Размер модульного дома: ${moduleSize}`)
    if (
      form.interest === 'Трехмодульный дом' &&
      Number(form.area) === threeModuleAreas[threeModuleSize]
    ) {
      lines.push(`Размер трехмодульного дома: ${threeModuleSize}`)
      lines.push('Палуба: из лиственницы, по выбранному КП')
    }
  }
  if (form.message.trim()) lines.push(`Пожелания: ${form.message.trim()}`)
  return lines.join('\n')
}
export function buildWhatsAppUrl(
  phone: string,
  form: ProjectRequest,
  moduleSize: ModuleSize,
  threeModuleSize: ThreeModuleSize,
) {
  const number = phone.replace(/\D/g, '')
  if (!/^\d{8,15}$/.test(number)) throw new Error('Некорректный номер WhatsApp в настройках сайта')
  return `https://wa.me/${number}?text=${encodeURIComponent(buildRequestText(form, moduleSize, threeModuleSize))}`
}
