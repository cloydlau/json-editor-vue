import { mount } from '@vue/test-utils'
import { createApp, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('global install config', () => {
  afterEach(() => {
    vi.resetModules()
  })

  it('emits update:mode when global mode is set and local mode is omitted', async () => {
    vi.resetModules()
    const { default: JsonEditorVue } = await import('../src/index')

    const app = createApp({ template: '<div />' })
    app.use(JsonEditorVue, { mode: 'text' })

    const wrapper = mount(JsonEditorVue, {
      props: { modelValue: '{"a":1}' },
    })
    await nextTick()

    expect(wrapper.emitted('update:mode')?.[0]).toEqual(['text'])
    expect(wrapper.vm.jsonEditor.get().text).toEqual('{"a":1}')
    wrapper.unmount()
  })

  it('applies global attrs from install options', async () => {
    vi.resetModules()
    const { default: JsonEditorVue } = await import('../src/index')

    const app = createApp({ template: '<div />' })
    app.use(JsonEditorVue, {
      readOnly: true,
    } as never)

    const wrapper = mount(JsonEditorVue, {
      props: { modelValue: { a: 1 } },
    })
    await nextTick()

    expect(wrapper.vm.jsonEditor.get().json).toEqual({ a: 1 })
    wrapper.unmount()
  })
})
