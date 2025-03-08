<template>
  <nav
    class="sticky top-0 z-100 mx-auto flex h-14 items-center border-b border-[var(--ui-border)] bg-[var(--ui-bg)] px-2 py-4 md:px-6"
  >
    <div class="flex items-center gap-x-2">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        class="flex items-top"
      >
        <rect
          x="0"
          y="0"
          width="10"
          height="20"
          fill="var(--ui-primary)"
        />
        <rect
          x="10"
          y="0"
          width="10"
          height="10"
          fill="var(--ui-primary-400)"
        />
      </svg>
      <span class="text-lg font-bold">
        <NuxtLink to="/">Pilot</NuxtLink>
      </span>
    </div>
    <div class="ml-auto flex items-center gap-x-2">
      <UButton
        to="/"
        icon="i-ri:terminal-box-line"
      >
        Demo
      </UButton>
      <UButton
        icon="logos:github-icon"
        color="neutral"
        variant="ghost"
        class="hidden lg:flex"
        :ui="{
          leadingIcon: 'dark:invert',
        }"
        to="https://github.com/LearnVueCo/pilot"
      />
      <USlideover
        class="flex md:hidden"
        :ui="{
          content: 'bg-[var(--ui-bg)] w-96',
        }"
        close-icon="i-ri:close-line"
      >
        <UButton
          icon="i-ri:menu-line"
          color="neutral"
          variant="ghost"
        />
        <template #body>
          <AppSidebarContent />
        </template>
      </USlideover>
    </div>
  </nav>
</template>
