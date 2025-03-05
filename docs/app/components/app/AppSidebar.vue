<template>
  <div
    class="sticky top-12 mr-8 hidden h-[calc(100vh-3.5em)] w-64 border-r border-[var(--ui-border)] pt-6 lg:block"
  >
    <AppSidebarContent />
  </div>
  <UCollapsible
    class="flex flex-col border-b border-b-[var(--ui-border)] lg:hidden"
  >
    <div class="flex py-2">
      <UButton
        icon="i-ri:book-open-line"
        color="neutral"
        variant="subtle"
        label="Table of contents"
      />
    </div>
    <template #content> <AppTableOfContents class="pb-8" /> </template>
  </UCollapsible>
</template>
