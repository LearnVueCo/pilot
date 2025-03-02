# Bubble Menu

We've built a custom BubbleMenu component, inspired by [tiptap](https://tiptap.dev/api/components/bubble-menu), that uses Floating UI for positioning.

## Usage

To use the BubbleMenu component, you can pass it as a child to the `Editor` component.

```vue
<Editor>
  <BubbleMenu>
    <div>
      <button @click="editor.chain().focus().toggleBold().run()">
        Bold
      </button>
    </div>
  </BubbleMenu>
</Editor>
```

## Transitions

If you want to add enter/leave transitions to your bubble menu, you can instead use the `menu` slots. While the `menu-content` handles all conditional rendering for you, the `menu` content instead has a `visible` property that you can use for more transitional control.

```vue
<Editor>
  <BubbleMenu>
    <template #menu="{ editor, visible }"">
      <Transition name="fade">
        <div v-if="visible">
          <button @click="editor.chain().focus().toggleBold().run()">
            Bold
          </button>
          </div>
        </Transition>
      </template>
  </BubbleMenu>
</Editor>
```
