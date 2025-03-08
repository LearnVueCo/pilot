<script setup lang="ts">
import type { ContentCollectionItem } from '@nuxt/content'

const route = useRoute()

const { data: page } = useNuxtData<ContentCollectionItem | undefined>(
  route.path,
)

const targets = ref<Element[]>([])
const visibleTargetIds = ref<string[]>([])
const shouldRemove = ref<string>() // there should always be at least one visible target (long sections)
let io: IntersectionObserver | null = null
onMounted(() => {
  targets.value = [...document.querySelectorAll('main h2, main h3, main h4')]
  if (!targets.value.length) {
    return
  }
  io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry?.isIntersecting) {
        if (shouldRemove.value) {
          visibleTargetIds.value = visibleTargetIds.value.filter(id => id !== shouldRemove.value)
          shouldRemove.value = undefined
        }
        visibleTargetIds.value.push(entry?.target.id)
      }
      else if (visibleTargetIds.value.length > 1) {
        visibleTargetIds.value = visibleTargetIds.value.filter(id => id !== entry?.target.id)
      }
      else {
        shouldRemove.value = entry?.target.id
      }
    })
  })

  targets.value.forEach((el) => {
    io!.observe(el)
  })
})

onUnmounted(() => {
  if (io) {
    io.disconnect()
  }
})
</script>

<template>
  <div>
    <p
      class="hidden text-sm font-bold text-[var(--ui-text-highlight)] lg:block"
    >
      On this page
    </p>
    <ul class="mt-2 text-sm">
      <li
        v-for="item in page?.body.toc?.links"
        :key="item.id"
        class="mt-2"
      >
        <NuxtLink
          :to="`#${item.id}`"
          :class="{
            'text-[var(--ui-primary)] opacity-100': visibleTargetIds.includes(item.id),
            'opacity-70 hover:opacity-100': !visibleTargetIds.includes(item.id),
          }"
        >
          {{ item.text }}
        </NuxtLink>
        <ul
          v-if="item.children"
          class="pl-2"
        >
          <li
            v-for="child in item.children"
            :key="child.id"
            class="mt-2"
          >
            <NuxtLink
              :to="`#${child.id}`"
              class="opacity-70 hover:opacity-100"
              :class="{
                'text-[var(--ui-primary)] opacity-100': visibleTargetIds.includes(item.id),
                'opacity-70 hover:opacity-100': !visibleTargetIds.includes(item.id),
              }"
            >
              {{ child.text }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
