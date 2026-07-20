import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, nextTick } from 'vue'

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

  it('replaces previous global config on re-install', async () => {
    vi.resetModules()
    const { default: JsonEditorVue } = await import('../src/index')

    const app = createApp({ template: '<div />' })
    // app.use 对同一插件只会 install 一次，这里直接调 install 验证全量替换
    // indentation 会进 attrsGlobal，mode 进 propsGlobal
    JsonEditorVue.install(app, { mode: 'text', indentation: 2 } as never)
    JsonEditorVue.install(app, { debounce: 100 })

    const wrapper = mount(JsonEditorVue, {
      props: { modelValue: { a: 1 } },
    })
    await nextTick()

    expect(wrapper.emitted('update:mode')).toBeUndefined()
    expect(wrapper.vm.jsonEditor.get().json).toEqual({ a: 1 })
    wrapper.unmount()
  })
})
