<template>
  <div class="dropped">
    <UAlert
      v-bind="$attrs"
      variant="outline"
      class="rounded-none bg-[var(--ui-bg)] text-[var(--ui-text)]"
      :ui="{
        title: 'text-lg font-bold text-[var(--ui-text)]',
        icon: 'size-7 text-[var(--ui-primary)]',
        description:
          'pb-1 text-[var(--ui-text)]' + (!$attrs.title ? ' pt-1' : ''),
      }"
    >
      <template #description>
        <MDCSlot
          :use="$slots.default"
          unwrap="p"
        />
      </template>
    </UAlert>
  </div>
</template>
