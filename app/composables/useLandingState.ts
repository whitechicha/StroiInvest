import type {
  Completion,
  Interest,
  ModuleSize,
  ThreeModuleSize,
  PlanKey,
  ProjectRequest,
} from '~/types/landing'
import { moduleAreas, plans, threeModuleAreas } from '~/data/houses'

export function useLandingState() {
  const form = useState<ProjectRequest>('project-request', () => ({
    interest: 'Каменный дом',
    region: '',
    area: '',
    completion: 'Пока не определился',
    message: '',
  }))
  const moduleSize = useState<ModuleSize>('module-size', () => '6 × 5 м')
  const threeModuleSize = useState<ThreeModuleSize>('three-module-size', () => '7 × 7,5 м')
  const activePlan = useState<PlanKey | null>('active-plan', () => null)

  function selectInterest(interest: Interest) {
    form.value.interest = interest
    if (interest === 'Двухмодульный дом') form.value.area = moduleAreas[moduleSize.value]
    if (interest === 'Трехмодульный дом') form.value.area = threeModuleAreas[threeModuleSize.value]
  }
  function selectPackage(completion: Completion) {
    form.value.interest = 'Каменный дом'
    form.value.completion = completion
  }
  function selectModule(size: ModuleSize) {
    moduleSize.value = size
    form.value.area = moduleAreas[size]
  }
  function selectThreeModule(size: ThreeModuleSize) {
    threeModuleSize.value = size
    form.value.area = threeModuleAreas[size]
  }
  function openPlan(key: PlanKey) {
    activePlan.value = key
  }
  async function choosePlan() {
    const key = activePlan.value
    if (!key || plans[key].selectable === false) return
    if (key === 'module') {
      selectModule('6 × 5 м')
      selectInterest('Двухмодульный дом')
    } else if (key === 'three-module') {
      selectInterest('Трехмодульный дом')
    } else {
      selectInterest('Каменный дом')
      form.value.area = plans[key].area
    }
    activePlan.value = null
    await nextTick()
    document.getElementById('request')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
    document.getElementById('region')?.focus({ preventScroll: true })
  }
  return {
    form,
    moduleSize,
    threeModuleSize,
    activePlan,
    selectInterest,
    selectPackage,
    selectModule,
    selectThreeModule,
    openPlan,
    choosePlan,
  }
}
