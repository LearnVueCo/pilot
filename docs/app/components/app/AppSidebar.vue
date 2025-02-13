<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

const { data: navTree } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('content')
})

function formatNav(items: ContentNavigationItem[]): NavigationMenuItem[] {
  return items.map((item) => ({
    label: item.title,
    to: item.path,
    icon: typeof item.icon === 'string' ? item.icon : undefined,
    children: item.children ? formatNav(item.children) : undefined,
    defaultOpen: !!item.children?.length,
  }))
}

const formattedNav = computed(() => {
  return formatNav(navTree.value ? navTree.value?.[0].children : [])
})
</script>

<template>
  <div class="relative w-80">
    <UNavigationMenu :items="formattedNav" orientation="vertical">
    </UNavigationMenu>
  </div>
</template>
