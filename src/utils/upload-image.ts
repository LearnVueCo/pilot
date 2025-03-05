// modified from https://github.com/steven-tey/novel/blob/main/packages/headless/src/plugins/upload-images.tsx
import {
  type EditorState,
  Plugin,
  PluginKey,
  Transaction,
} from '@tiptap/pm/state'
import { Decoration, DecorationSet, type EditorView } from '@tiptap/pm/view'

const uploadKey = new PluginKey('upload-image')

export type UploadFn = (file: File) => Promise<string | false>

export const UploadImagesPlugin = ({
  loadingClass,
  imageUploadFn,
}: {
  loadingClass: string
  imageUploadFn?: UploadFn
}) =>
  new Plugin({
    key: uploadKey,
    state: {
      init() {
        return DecorationSet.empty
      },
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc) // set of all decorations

        const action = tr.getMeta(this as unknown as Plugin)
        if (action?.add) {
          const { id, pos, src } = action.add
          const placeholder = document.createElement('div')
          placeholder.setAttribute('class', 'img-placeholder')
          const image = document.createElement('img')
          image.setAttribute('class', loadingClass)
          image.src = src
          placeholder.appendChild(image)
          const deco = Decoration.widget(pos, placeholder, {
            id,
          })
          set = set.add(tr.doc, [deco])
        } else if (action?.remove) {
          set = set.remove(
            set.find(
              undefined,
              undefined,
              (spec) => spec.id == action.remove.id,
            ),
          )
        }
        return set
      },
    },
    props: {
      decorations(state) {
        return this.getState(state)
      },
      handlePaste(view, event) {
        return handleImagePaste(view, event, imageUploadFn)
      },
      handleDrop(view, event) {
        return handleImageDrop(view, event, false, imageUploadFn)
      },
    },
  })

export const handleImagePaste = (
  view: EditorView,
  event: ClipboardEvent,
  uploadFn?: UploadFn,
) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault()
    const [file] = Array.from(event.clipboardData.files)
    if (!file) {
      return true
    }
    const pos =
      view.state.selection.$from.parent.content.size === 0
        ? view.state.selection.from - 1
        : view.state.selection.from

    if (uploadFn) {
      loadAndInsertRemoteImage(file, view, pos, uploadFn)
    } else {
      loadAndInsertLocalImage(file, view, pos)
    }
    return true
  }
  return false
}

export const handleImageDrop = (
  view: EditorView,
  event: DragEvent,
  moved: boolean,
  uploadFn?: UploadFn,
) => {
  if (!moved && event.dataTransfer?.files.length) {
    event.preventDefault()
    const [file] = Array.from(event.dataTransfer.files)
    const coordinates = view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    })
    if (!file) {
      return true
    }
    let pos = coordinates?.pos ? coordinates.pos - 1 : 0

    if (uploadFn) {
      loadAndInsertRemoteImage(file, view, pos, uploadFn)
    } else {
      loadAndInsertLocalImage(file, view, pos)
    }

    return true
  }
  return false
}

export function findPlaceholder(
  state: EditorState,
  id: Record<string, unknown>,
) {
  const decos = uploadKey.getState(state) as DecorationSet
  const found = decos.find(undefined, undefined, (spec) => spec.id == id)
  return found.length ? found[0]?.from : null
}

export interface ImageUploadOptions {
  validateFn?: (file: File) => void
  onUpload: (file: File) => Promise<unknown>
}

function loadImage(file: File): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to load image'))
      }
    }
    reader.onerror = () => {
      reject(reader.error)
    }
  })
}

function insertImageNode(
  view: EditorView,
  currentPos: number,
  pos: number,
  imageSrc: string | ArrayBuffer | null,
  id: object,
) {
  const { schema, tr } = view.state

  const node = schema.nodes.image?.create({ src: imageSrc })
  if (!node) return

  const transaction = tr
    .replaceWith(currentPos, pos, node)
    .setMeta(uploadKey, { remove: { id } })

  view.dispatch(transaction)
}

const loadAndInsertLocalImage = async (
  file: File,
  view: EditorView,
  pos: number,
) => {
  const id = {}
  const tr = view.state.tr
  if (!tr.selection.empty) {
    tr.deleteSelection()
  }
  const src = await loadImage(file)
  if (!src) {
    return
  }
  insertImageNode(view, pos, pos, src, id)
}

const loadAndInsertRemoteImage = async (
  file: File,
  view: EditorView,
  pos: number,
  uploadFn: UploadFn,
) => {
  const id = {}
  const tr = view.state.tr
  if (!tr.selection.empty) {
    tr.deleteSelection()
  }

  const placeholderSrc = await loadImage(file)
  if (!placeholderSrc) {
    console.error('Failed to load image')
    return
  }
  // insert placeholder
  insertPlaceholder(view, tr, pos, placeholderSrc, id)

  try {
    // upload the image
    const src = await uploadFn(file)

    if (src === false) {
      const transaction = view.state.tr
        .delete(pos, pos)
        .setMeta(uploadKey, { remove: { id } })
      view.dispatch(transaction)
      return
    }
    // replace the placeholder with the image node
    const currentPos = findPlaceholder(view.state, id)
    if (currentPos === null) {
      const transaction = view.state.tr
        .delete(pos, pos)
        .setMeta(uploadKey, { remove: { id } })
      view.dispatch(transaction)
      return
    }

    insertImageNode(view, currentPos, currentPos, src, id)
  } catch (error) {
    const transaction = view.state.tr
      .delete(pos, pos)
      .setMeta(uploadKey, { remove: { id } })
    view.dispatch(transaction)
  }
}

async function insertPlaceholder(
  view: EditorView,
  tr: Transaction,
  pos: number,
  src: string | ArrayBuffer,
  id: Record<string, unknown>,
) {
  tr.setMeta(uploadKey, {
    add: {
      id,
      pos,
      src,
    },
  })

  view.dispatch(tr)
}
