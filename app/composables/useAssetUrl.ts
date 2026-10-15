export function useAssetUrl() {
  const base = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
  return (path: string) => `${base}/${path.replace(/^\//, '')}`
}
