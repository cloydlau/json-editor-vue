import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { nextTick } from 'vue'
import JsonEditorVue from '../src/index'

it('text mode + set value', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      mode: 'text',
      modelValue: undefined,
    },
  })

  await wrapper.setProps({ modelValue: '123' })
  await nextTick()
  expect(wrapper.vm.jsonEditor.get().text).toEqual('123')
})

it('text mode + string', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      mode: 'text',
      modelValue: '123',
    },
  })

  expect(wrapper.vm.jsonEditor.get().text).toEqual('123')
})

it('text mode + stringified JSON', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      mode: 'text',
      modelValue: '{"a":1}',
    },
  })

  expect(wrapper.vm.jsonEditor.get().text).toEqual('{"a":1}')
})

it('text mode + stringified JSON + disable stringified', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      mode: 'text',
      modelValue: '{"a":1}',
      stringified: false,
    },
  })

  expect(wrapper.vm.jsonEditor.get().json).toEqual('{"a":1}')
})

it('text mode + non-string value', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      mode: 'text',
      modelValue: 123,
    },
  })

  expect(wrapper.vm.jsonEditor.get().json).toEqual(123)
})

/* it('text mode + input', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      mode: 'text',
      modelValue: 123,
    },
  })

  expect(wrapper.find('.cm-activeLine>span').innerText = '1234')
  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
  expect(wrapper.vm.jsonEditor.get().text).toEqual('1234')
}) */

it('tree mode + set value', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      modelValue: undefined,
    },
  })

  await wrapper.setProps({ modelValue: 123 })
  await nextTick()
  expect(wrapper.vm.jsonEditor.get().json).toEqual(123)
})

it('tree mode + string', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      modelValue: '123',
    },
  })

  expect(wrapper.vm.jsonEditor.get().json).toEqual('123')
})

it('tree mode + stringified JSON', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      modelValue: '{"a":1}',
    },
  })

  expect(wrapper.vm.jsonEditor.get().json).toEqual('{"a":1}')
})

it('tree mode + non-string value', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      modelValue: 123,
    },
  })

  expect(wrapper.vm.jsonEditor.get().json).toEqual(123)
})
