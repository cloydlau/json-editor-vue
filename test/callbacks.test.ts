import { mount } from '@vue/test-utils'
import { createJSONEditor } from 'vanilla-jsoneditor'
import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import JsonEditorVue from '../src/index'

type EditorProps = {
  onChange?: (content: { json?: unknown, text?: string }) => void
  onChangeMode?: (mode: string) => void
  parser?: { parse: (value: string) => unknown, stringify: typeof JSON.stringify }
}

type EditorInstance = {
  updateProps: (props: EditorProps) => void
  get: () => { json?: unknown, text?: string }
  set: (content: unknown) => void
  validate: () => unknown
  destroy: () => void
  focus: () => void
  update: (content: unknown) => void
}

const createJSONEditorMock = vi.mocked(createJSONEditor)
let capturedProps: EditorProps | undefined
let capturedEditor: EditorInstance | undefined
let wrappers: ReturnType<typeof mount>[] = []

vi.mock('vanilla-jsoneditor', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vanilla-jsoneditor')>()
  return {
    ...actual,
    createJSONEditor: vi.fn((options: Parameters<typeof actual.createJSONEditor>[0]) => {
      capturedProps = options.props as EditorProps
      capturedEditor = actual.createJSONEditor(options) as unknown as EditorInstance
      return capturedEditor
    }),
  }
})

beforeEach(() => {
  capturedProps = undefined
  capturedEditor = undefined
})

afterEach(() => {
  while (wrappers.length)
    wrappers.pop()?.unmount()
  vi.useRealTimers()
})

// 挂载组件并登记，便于 afterEach 统一卸载。
function mountEditor(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  const wrapper = mount(JsonEditorVue, { props, attrs })
  wrappers.push(wrapper)
  return wrapper
}

describe('onChange / onChangeMode', () => {
  it('emits update:mode via onChangeMode', async () => {
    const wrapper = mountEditor({ mode: 'tree', modelValue: { a: 1 } })
    capturedProps!.onChangeMode!('text')
    await nextTick()
    expect(wrapper.emitted('update:mode')?.[0]).toEqual(['text'])
  })

  it('emits update:modelValue in tree mode via onChange', async () => {
    const wrapper = mountEditor({ mode: 'tree', modelValue: { a: 1 } })
    capturedProps!.onChange!({ json: { a: 2 } })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ a: 2 }])
  })

  it('debounces update:modelValue in text mode', async () => {
    vi.useFakeTimers()
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: '{"a":1}',
      debounce: 300,
    })

    capturedProps!.onChange!({ text: '{"a":2}' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await vi.advanceTimersByTimeAsync(300)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['{"a":2}'])
  })

  it('parses text into json when stringified is false and content is valid', async () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: { a: 1 },
      stringified: false,
      debounce: 0,
    })

    vi.useFakeTimers()
    capturedProps!.onChange!({ text: '{"a":2}' })
    await vi.advanceTimersByTimeAsync(0)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ a: 2 }])
  })

  it('skips parse when stringified is false and content is invalid', async () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: { a: 1 },
      stringified: false,
      debounce: 0,
    })

    vi.useFakeTimers()
    capturedProps!.onChange!({ text: 'not-json' })
    await vi.advanceTimersByTimeAsync(0)
    await nextTick()

    // text 被清空且未解析出 json → emit undefined
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
  })

  it('ignores modelValue sync once after onChange (preventUpdatingContent)', async () => {
    const wrapper = mountEditor({ mode: 'tree', modelValue: { a: 1 } })
    const set = vi.spyOn(wrapper.vm.jsonEditor, 'set')

    capturedProps!.onChange!({ json: { a: 2 } })
    await nextTick()
    set.mockClear()

    await wrapper.setProps({ modelValue: { a: 2 } })
    await nextTick()
    expect(set).not.toHaveBeenCalled()

    await wrapper.setProps({ modelValue: { a: 3 } })
    await nextTick()
    expect(set).toHaveBeenCalled()
  })

  it('merges user onChange with internal onChange', async () => {
    const userOnChange = vi.fn()
    const wrapper = mountEditor(
      { mode: 'tree', modelValue: { a: 1 } },
      { onChange: userOnChange },
    )

    capturedProps!.onChange!({ json: { a: 2 } })
    await nextTick()

    expect(userOnChange).toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ a: 2 }])
  })
})

describe('attrs watcher', () => {
  it('merges onChange / onChangeMode when attrs gain handlers', async () => {
    const userOnChange = vi.fn()
    const userOnChangeMode = vi.fn()

    const Parent = defineComponent({
      components: { JsonEditorVue },
      setup() {
        const extra = ref<Record<string, unknown>>({})
        return {
          extra,
          enableHandlers() {
            extra.value = {
              onChange: userOnChange,
              onChangeMode: userOnChangeMode,
            }
          },
        }
      },
      template: '<JsonEditorVue :model-value="{ a: 1 }" mode="tree" v-bind="extra" />',
    })

    const parent = mount(Parent)
    wrappers.push(parent as never)
    await nextTick()

    const updateProps = vi.spyOn(capturedEditor!, 'updateProps')
    parent.vm.enableHandlers()
    await nextTick()

    expect(updateProps).toHaveBeenCalled()
    const lastCall = updateProps.mock.calls.at(-1)?.[0] as EditorProps
    expect(typeof lastCall.onChange).toBe('function')
    expect(typeof lastCall.onChangeMode).toBe('function')

    lastCall.onChange!({ json: { a: 9 } })
    lastCall.onChangeMode!('table')
    await nextTick()

    expect(userOnChange).toHaveBeenCalled()
    expect(userOnChangeMode).toHaveBeenCalledWith('table')

    const editorWrapper = parent.findComponent(JsonEditorVue)
    expect(editorWrapper.emitted('update:modelValue')?.[0]).toEqual([{ a: 9 }])
    expect(editorWrapper.emitted('update:mode')?.[0]).toEqual(['table'])
  })

  it('merges kebab-case on-change / on-change-mode attrs', async () => {
    const userOnChange = vi.fn()
    const userOnChangeMode = vi.fn()

    const Parent = defineComponent({
      components: { JsonEditorVue },
      setup() {
        const extra = ref<Record<string, unknown>>({})
        return {
          extra,
          enableHandlers() {
            extra.value = {
              'on-change': userOnChange,
              'on-change-mode': userOnChangeMode,
            }
          },
        }
      },
      template: '<JsonEditorVue :model-value="{ a: 1 }" mode="tree" v-bind="extra" />',
    })

    const parent = mount(Parent)
    wrappers.push(parent as never)
    await nextTick()

    const updateProps = vi.spyOn(capturedEditor!, 'updateProps')
    parent.vm.enableHandlers()
    await nextTick()

    const lastCall = updateProps.mock.calls.at(-1)?.[0] as EditorProps
    lastCall.onChange!({ json: { b: 1 } })
    lastCall.onChangeMode!('text')
    await nextTick()

    expect(userOnChange).toHaveBeenCalled()
    expect(userOnChangeMode).toHaveBeenCalledWith('text')
  })

  it('forwards plain attrs and custom parser without function merge', async () => {
    const customParse = vi.fn((value: string) => JSON.parse(value))

    const Parent = defineComponent({
      components: { JsonEditorVue },
      setup() {
        const extra = ref<Record<string, unknown>>({})
        return {
          extra,
          setParser() {
            extra.value = {
              parser: { parse: customParse, stringify: JSON.stringify },
            }
          },
        }
      },
      template: '<JsonEditorVue :model-value="{ a: 1 }" mode="tree" v-bind="extra" />',
    })

    const parent = mount(Parent)
    wrappers.push(parent as never)
    await nextTick()

    const updateProps = vi.spyOn(capturedEditor!, 'updateProps')
    parent.vm.setParser()
    await nextTick()

    expect(updateProps).toHaveBeenCalledWith(
      expect.objectContaining({
        parser: expect.objectContaining({ parse: customParse }),
      }),
    )
  })
})

describe('createJSONEditor mock', () => {
  it('is used for mounts in this file', () => {
    mountEditor({ modelValue: { a: 1 } })
    expect(createJSONEditorMock).toHaveBeenCalled()
  })
})
