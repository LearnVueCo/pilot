import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*',
      schema: z.object({
        title: z.string(),
        subheading: z.string(),
      }),
    }),
  },
})
