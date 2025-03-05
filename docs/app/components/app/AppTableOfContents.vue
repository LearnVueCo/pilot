<script setup lang="ts">
import type { ContentCollectionItem } from '@nuxt/content'

const route = useRoute()

const { data: page } = useNuxtData<ContentCollectionItem | undefined>(
  route.path,
)
</script>

<template>
  <div>
    <p
      class="hidden text-sm font-bold text-[var(--ui-text-highlight)] lg:block"
    >
      On this page
    </p>
    <ul class="mt-2 text-sm">
      <li v-for="item in page?.body.toc?.links" :key="item.id" class="mt-2">
        <NuxtLink :to="`#${item.id}`" class="opacity-70 hover:opacity-100">
          {{ item.text }}
        </NuxtLink>
        <ul v-if="item.children" class="pl-2">
          <li v-for="child in item.children" :key="child.id" class="mt-2">
            <NuxtLink :to="`#${child.id}`" class="opacity-70 hover:opacity-100">
              {{ child.text }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
