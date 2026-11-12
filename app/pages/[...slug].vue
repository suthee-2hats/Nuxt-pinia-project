<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const pageTitle = computed(() => {
  const title = (page.value as { title?: string } | null)?.title

  if (typeof title === 'string' && title.trim()) {
    return title.trim()
  }

  const slug = Array.isArray(route.params.slug)
    ? route.params.slug[route.params.slug.length - 1]
    : route.params.slug

  return typeof slug === 'string' && slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1)
    : 'Page'
})

const pageDescription = computed(() => {
  const description = (page.value as { description?: string } | null)
    ?.description

  return typeof description === 'string' && description.trim()
    ? description.trim()
    : `${pageTitle.value} — read more on FASCO.`
})

usePageSeo(() => ({
  title: pageTitle.value,
  description: pageDescription.value,
}))
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
  />
</template>
