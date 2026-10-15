<script setup lang="ts">
const description =
  'Стройинвест — строительство каменных, двухмодульных и трехмодульных домов по всей России. Проект, комплектация и сопровождение строительства. Оформление земельных участков для ветеранов боевых действий.'
useSeoMeta({
  title: 'Стройинвест — земля, дом, будущее',
  description,
  ogTitle: 'Стройинвест — земля, дом, будущее',
  ogDescription: description,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
const config = useRuntimeConfig()
const assetUrl = useAssetUrl()
if (config.public.siteUrl) {
  useHead({ link: [{ rel: 'canonical', href: String(config.public.siteUrl) }] })
  useSeoMeta({
    ogUrl: String(config.public.siteUrl),
    ogImage: new URL(assetUrl('assets/source-1-8-1.webp'), String(config.public.siteUrl)).href,
  })
}
</script>
<template>
  <div>
    <a class="skip" href="#main">Перейти к содержимому</a>
    <SiteHeader />
    <main id="main">
      <HeroSection />
      <ServiceStrip />
      <CompanySection />
      <HouseCatalogue />
      <StonePackages />
      <VeteransLand />
      <BuildProcess />
      <FaqSection />
      <ProjectRequest />
    </main>
    <SiteFooter />
    <PlanDialog />
  </div>
</template>
