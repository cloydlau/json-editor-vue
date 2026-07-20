import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import JsonEditorVue from '../src/index'

const wrappers: ReturnType<typeof mount>[] = []

// 挂载组件并登记，便于 afterEach 统一卸载。
function mountEditor(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  const wrapper = mount(JsonEditorVue, {
    props,
    attrs,
  })
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  while (wrappers.length) {
    wrappers.pop()?.unmount()
  }
})

describe('expose', () => {
  it('exposes jsonEditor instance', () => {
    const wrapper = mountEditor({ modelValue: { a: 1 } })
    expect(wrapper.vm.jsonEditor).toBeTruthy()
    expect(typeof wrapper.vm.jsonEditor.get).toBe('function')
    expect(typeof wrapper.vm.jsonEditor.set).toBe('function')
    expect(typeof wrapper.vm.jsonEditor.destroy).toBe('function')
  })

  it('renders a root div', () => {
    const wrapper = mountEditor()
    expect(wrapper.element.tagName).toBe('DIV')
  })
})

describe('text mode', () => {
  it('set value', async () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: undefined,
    })

    await wrapper.setProps({ modelValue: '123' })
    await nextTick()
    expect(wrapper.vm.jsonEditor.get().text).toEqual('123')
  })

  it('string', () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: '123',
    })

    expect(wrapper.vm.jsonEditor.get().text).toEqual('123')
  })

  it('stringified JSON', () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: '{"a":1}',
    })

    expect(wrapper.vm.jsonEditor.get().text).toEqual('{"a":1}')
  })

  it('stringified JSON + disable stringified', () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: '{"a":1}',
      stringified: false,
    })

    expect(wrapper.vm.jsonEditor.get().json).toEqual('{"a":1}')
  })

  it('non-string value', () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: 123,
    })

    expect(wrapper.vm.jsonEditor.get().json).toEqual(123)
  })

  it('object value uses json content', () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: { a: 1, b: [2, 3] },
    })

    expect(wrapper.vm.jsonEditor.get().json).toEqual({ a: 1, b: [2, 3] })
  })

  it('array value uses json content', () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: [1, 2, 3],
    })

    expect(wrapper.vm.jsonEditor.get().json).toEqual([1, 2, 3])
  })

  it('boolean and null values', () => {
    const boolWrapper = mountEditor({
      mode: 'text',
      modelValue: true,
    })
    expect(boolWrapper.vm.jsonEditor.get().json).toEqual(true)

    const nullWrapper = mountEditor({
      mode: 'text',
      modelValue: null,
    })
    expect(nullWrapper.vm.jsonEditor.get().json).toEqual(null)
  })

  it('clear with undefined', async () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: 'hello',
    })

    await wrapper.setProps({ modelValue: undefined })
    await nextTick()
    expect(wrapper.vm.jsonEditor.get()).toEqual({ text: '' })
  })

  it('clear with empty string', async () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: 'hello',
    })

    await wrapper.setProps({ modelValue: '' })
    await nextTick()
    expect(wrapper.vm.jsonEditor.get()).toEqual({ text: '' })
  })

  it('update string content', async () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: 'aaa',
    })

    await wrapper.setProps({ modelValue: 'bbb' })
    await nextTick()
    expect(wrapper.vm.jsonEditor.get().text).toEqual('bbb')
  })
})

describe('tree mode', () => {
  it('set value', async () => {
    const wrapper = mountEditor({
      modelValue: undefined,
    })

    await wrapper.setProps({ modelValue: 123 })
    await nextTick()
    expect(wrapper.vm.jsonEditor.get().json).toEqual(123)
  })

  it('string', () => {
    const wrapper = mountEditor({
      modelValue: '123',
    })

    expect(wrapper.vm.jsonEditor.get().json).toEqual('123')
  })

  it('stringified JSON stays as string', () => {
    const wrapper = mountEditor({
      modelValue: '{"a":1}',
    })

    expect(wrapper.vm.jsonEditor.get().json).toEqual('{"a":1}')
  })

  it('non-string value', () => {
    const wrapper = mountEditor({
      modelValue: 123,
    })

    expect(wrapper.vm.jsonEditor.get().json).toEqual(123)
  })

  it('object value', () => {
    const value = { user: { name: 'alice', age: 18 }, tags: ['a', 'b'] }
    const wrapper = mountEditor({ modelValue: value })
    expect(wrapper.vm.jsonEditor.get().json).toEqual(value)
  })

  it('array value', () => {
    const value = [{ id: 1 }, { id: 2 }]
    const wrapper = mountEditor({ modelValue: value })
    expect(wrapper.vm.jsonEditor.get().json).toEqual(value)
  })

  it('deep object update', async () => {
    const wrapper = mountEditor({
      modelValue: { a: 1 },
    })

    await wrapper.setProps({ modelValue: { a: 1, b: 2 } })
    await nextTick()
    expect(wrapper.vm.jsonEditor.get().json).toEqual({ a: 1, b: 2 })
  })

  it('clear with undefined', async () => {
    const wrapper = mountEditor({
      modelValue: { a: 1 },
    })

    await wrapper.setProps({ modelValue: undefined })
    await nextTick()
    expect(wrapper.vm.jsonEditor.get()).toEqual({ text: '' })
  })

  it('clear with empty string', async () => {
    const wrapper = mountEditor({
      modelValue: { a: 1 },
    })

    await wrapper.setProps({ modelValue: '' })
    await nextTick()
    expect(wrapper.vm.jsonEditor.get()).toEqual({ text: '' })
  })

  it('replace object with number', async () => {
    const wrapper = mountEditor({
      modelValue: { a: 1 },
    })

    await wrapper.setProps({ modelValue: 42 })
    await nextTick()
    expect(wrapper.vm.jsonEditor.get().json).toEqual(42)
  })
})

describe('table mode', () => {
  it('accepts table mode with array of objects', () => {
    const value = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]
    const wrapper = mountEditor({
      mode: 'table',
      modelValue: value,
    })

    expect(wrapper.vm.jsonEditor.get().json).toEqual(value)
  })
})

describe('mode prop', () => {
  it('switches mode via prop', async () => {
    const wrapper = mountEditor({
      mode: 'tree',
      modelValue: { a: 1 },
    })

    const updateProps = vi.spyOn(wrapper.vm.jsonEditor, 'updateProps')
    await wrapper.setProps({ mode: 'text' })
    await nextTick()
    expect(updateProps).toHaveBeenCalledWith(expect.objectContaining({ mode: 'text' }))
  })

  it('defaults to tree when mode is omitted', () => {
    const wrapper = mountEditor({
      modelValue: { a: 1 },
    })
    // tree mode stores object as json
    expect(wrapper.vm.jsonEditor.get().json).toEqual({ a: 1 })
  })
})

describe('boolean attrs', () => {
  it('applies readOnly on mount', () => {
    const wrapper = mountEditor({
      modelValue: { a: 1 },
      readOnly: true,
    })
    expect(wrapper.vm.jsonEditor).toBeTruthy()
    // readOnly should not throw and editor remains usable via API
    expect(wrapper.vm.jsonEditor.get().json).toEqual({ a: 1 })
  })

  it('updates readOnly via prop', async () => {
    const wrapper = mountEditor({
      modelValue: { a: 1 },
      readOnly: false,
    })

    const updateProps = vi.spyOn(wrapper.vm.jsonEditor, 'updateProps')
    await wrapper.setProps({ readOnly: true })
    await nextTick()
    expect(updateProps).toHaveBeenCalledWith(expect.objectContaining({ readOnly: true }))
  })

  it('updates mainMenuBar and statusBar', async () => {
    const wrapper = mountEditor({
      modelValue: { a: 1 },
      mainMenuBar: true,
      statusBar: true,
    })

    const updateProps = vi.spyOn(wrapper.vm.jsonEditor, 'updateProps')
    await wrapper.setProps({ mainMenuBar: false, statusBar: false })
    await nextTick()
    expect(updateProps).toHaveBeenCalledWith(
      expect.objectContaining({ mainMenuBar: false, statusBar: false }),
    )
  })

  it('updates navigationBar', async () => {
    const wrapper = mountEditor({
      modelValue: { a: 1 },
      navigationBar: true,
    })

    const updateProps = vi.spyOn(wrapper.vm.jsonEditor, 'updateProps')
    await wrapper.setProps({ navigationBar: false })
    await nextTick()
    expect(updateProps).toHaveBeenCalledWith(expect.objectContaining({ navigationBar: false }))
  })
})

describe('editor API & sync', () => {
  it('keeps editor content in sync after programmatic update', async () => {
    const wrapper = mountEditor({
      mode: 'tree',
      modelValue: { a: 1 },
    })

    wrapper.vm.jsonEditor.update({ json: { a: 2 } })
    await nextTick()
    expect(wrapper.vm.jsonEditor.get().json).toEqual({ a: 2 })
  })

  it('applies nested mutation when modelValue object changes deeply', async () => {
    const wrapper = mountEditor({ modelValue: { a: 1 } })

    await wrapper.setProps({ modelValue: { a: 1, nested: { b: 2 } } })
    await nextTick()
    expect(wrapper.vm.jsonEditor.get().json).toEqual({ a: 1, nested: { b: 2 } })
  })

  it('validate returns no errors for valid content', () => {
    const wrapper = mountEditor({
      modelValue: { a: 1 },
    })
    expect(wrapper.vm.jsonEditor.validate()).toBeUndefined()
  })

  it('focus does not throw', () => {
    const wrapper = mountEditor({
      modelValue: { a: 1 },
    })
    expect(() => wrapper.vm.jsonEditor.focus()).not.toThrow()
  })

  it('updates escapeControlCharacters and flattenColumns', async () => {
    const wrapper = mountEditor({
      modelValue: { a: 1 },
      escapeControlCharacters: false,
      flattenColumns: false,
    })

    const updateProps = vi.spyOn(wrapper.vm.jsonEditor, 'updateProps')
    await wrapper.setProps({
      escapeControlCharacters: true,
      flattenColumns: true,
    })
    await nextTick()
    expect(updateProps).toHaveBeenCalledWith(
      expect.objectContaining({
        escapeControlCharacters: true,
        flattenColumns: true,
      }),
    )
  })
})

describe('lifecycle', () => {
  it('unmount destroys editor without error', async () => {
    const wrapper = mount(JsonEditorVue, {
      props: { modelValue: { a: 1 } },
    })
    const destroy = vi.spyOn(wrapper.vm.jsonEditor, 'destroy')
    wrapper.unmount()
    expect(destroy).toHaveBeenCalled()
  })

  it('install registers component on app', () => {
    const app = createApp({ template: '<div />' })
    app.use(JsonEditorVue)
    expect(app._context.components.JsonEditorVue).toBeTruthy()
  })

  it('accepts debounce prop', () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: '1',
      debounce: 0,
    })
    expect(wrapper.vm.jsonEditor.get().text).toEqual('1')
  })

  it('skips set when jsonEditor ref was cleared', async () => {
    const wrapper = mountEditor({
      mode: 'tree',
      modelValue: { a: 1 },
    })
    const set = vi.spyOn(wrapper.vm.jsonEditor, 'set')
    // Clear the exposed editor instance so the modelValue watcher hits the empty branch
    ;(wrapper.vm as any).jsonEditor = null
    await wrapper.setProps({ modelValue: { a: 2 } })
    await nextTick()
    expect(set).not.toHaveBeenCalled()
  })
})

describe('stringified', () => {
  it('tree mode ignores stringified for object values', () => {
    const wrapper = mountEditor({
      modelValue: { a: 1 },
      stringified: true,
    })
    expect(wrapper.vm.jsonEditor.get().json).toEqual({ a: 1 })
  })

  it('text mode with stringified false keeps object as json', () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: { a: 1 },
      stringified: false,
    })
    expect(wrapper.vm.jsonEditor.get().json).toEqual({ a: 1 })
  })

  it('text mode with stringified true keeps plain string as text', () => {
    const wrapper = mountEditor({
      mode: 'text',
      modelValue: 'not-json',
      stringified: true,
    })
    expect(wrapper.vm.jsonEditor.get().text).toEqual('not-json')
  })
})
