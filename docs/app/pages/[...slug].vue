<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
})

const slug = computed(() => {
  if (!route.params.slug) return 'Home'
  switch (route.params.slug[1]) {
    case 'intro':
      return 'Getting Started'
    case 'features':
      return 'Features'
    case 'components':
      return 'Components'
    case 'composables':
      return 'Composables'
    default:
      return route.params.slug[1]
  }
})
</script>

<template>
  <div
    v-if="page"
    class="flex-1 pt-6 pb-32"
  >
    <main class="mx-auto max-w-3xl px-4">
      <h2 class="text-sm font-bold text-[var(--ui-primary)] capitalize">
        {{ slug }}
      </h2>
      <h1
        class="mt-2 text-4xl font-extrabold text-[var(--ui-text-highlight)] capitalize"
      >
        {{ page.title }}
      </h1>
      <p class="mt-2 text-lg font-semibold text-[var(--ui-text)] opacity-70">
        {{ page.subheading }}
      </p>
      <ContentRenderer
        :value="page"
        class="prose dark:prose-invert max-w-none mt-8 w-full "
      />
    </main>
  </div>
  <AppTableOfContents class="hidden h-[calc(100vh-3.5em)] sticky top-12  w-60 pt-6 lg:block" />
</template>
