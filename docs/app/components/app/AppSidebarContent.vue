<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

const { data: navTree } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('content')
})

function formatNav(items: ContentNavigationItem[]): NavigationMenuItem[] {
  if (!items?.length) return []
  return items.map((item) => ({
    label: item.title,
    to: item.path,
    icon: typeof item.icon === 'string' ? item.icon : undefined,
    children: item.children ? formatNav(item.children) : undefined,
    defaultOpen: !!item.children?.length,
  }))
}

const formattedNav = computed(() => {
  return formatNav(navTree.value ? navTree.value?.[1].children : [])
})
</script>

<template>
  <UNavigationMenu
    :items="formattedNav"
    orientation="vertical"
    :ui="{
      link: 'font-[400] before:!bg-transparent',
    }"
  />
</template>
