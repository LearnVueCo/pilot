<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
})
</script>

<template>
  <div class="container mx-auto">
    <ContentRenderer v-if="page" :value="page" />
    <EditorContent />
  </div>
</template>
