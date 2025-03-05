---
title: 'Fake Highlight'
subheading: 'Provide consistent visual cues while editing text selections'
---

A common use case for an editor is to highlight text and then use tooltips to edit it (e.g. changing a link, using AI chat, etc.).

However, once the focus is on the tooltip, the highlight disappears because your no longer selecting any text. This can make it difficult for the user to see what they're editing.

For example, select some text here and then focus on the input in the bubble menu.

:editor-content{show-input}

To solve this, Pilot provides a `useFakeHighlight` composable that can be used to fake a highlight around the text as it's being edited.

:editor-content{show-input fake-highlight}

## Methods

The `useFakeHighlight` composable returns two methods: `highlight` and `unhighlight`.

### highlight

The `highlight` method can be called to highlight a range in the editor. By default, it will highlight the current selection, but you can pass a range to highlight a specific part of the editor.

```ts
const { highlight } = useFakeHighlight(editor)

// relies on the current selection by default
highlight()

// explicitly using the current selection as a range
highlight(editor.state.selection)

// highlighting a custom range
highlight({
  from: 0,
  to: 10,
})
```

### unhighlight

The `unhighlight` method can be called to remove the highlight from the text. Since only one highlight can be active at a time, calling `unhighlight` will remove the current highlight if there is one.

If you're using the `useFakeHighlight` composable in a `<BubbleMenu>`, you can use the `@close` event to automatically unhighlight when the menu is closed.

```vue
<template>
  <BubbleMenu @close="unhighlight">
    <div>...</div>
  </BubbleMenu>
</template>
```
