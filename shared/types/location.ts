export interface LocationSuggestion {
  id: string
  name: string
  value: string
  context: string
  kind: string
}

export interface LocationResponse {
  suggestions: LocationSuggestion[]
}
