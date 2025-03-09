<script setup lang="ts">

const { placeholder = 'Add a link'} = defineProps<{
  placeholder?: string
  link?: string
}>()
const emit = defineEmits<{
  'submit': [string]
}>()

const linkModel = defineModel<string>('link')

</script>

<template>
  <form @submit.prevent="emit('submit', linkModel ?? '')">
    <UButtonGroup size="lg">
      <UInput
        v-model="linkModel"
        :placeholder="placeholder"
      />
      <UButton
        type="submit"
        icon="i-ri:link"
      />
    </UButtonGroup>
  </form>
</template>