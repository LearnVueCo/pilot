export default defineAppConfig({
  uiPro: {
    prose: {
      pre: {
        base: 'rounded-none border-[var(--ui-border)] bg-gray-900',
        variants: {
          color: {
            primary: 'border-[var(--ui-border)]',
          }
        }
      },
      code: {
        base: 'py-0 !text-[var(--ui-primary)] dark:bg-gray-900/20 bg-gray-900 rounded-none',
      }
    }
  }
})