import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import JsonEditorVue from '../src/index'

it('text mode', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      mode: 'text',
      modelValue: '',
    },
  })

  await wrapper.setProps({ modelValue: '123' })
  await nextTick()
  expect(wrapper.vm.jsonEditor.get().text).toEqual('123')

  await wrapper.setProps({ modelValue: JSON.stringify({ a: 1 }) })
  await nextTick()
  expect(wrapper.vm.jsonEditor.get().text).toEqual(JSON.stringify({ a: 1 }))

  await wrapper.setProps({ modelValue: { a: 1 } })
  await nextTick()
  expect(wrapper.vm.jsonEditor.get().json).toEqual({ a: 1 })
})

it('tree mode', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      modelValue: null,
    },
  })

  await wrapper.setProps({ modelValue: '123' })
  await nextTick()
  expect(wrapper.vm.jsonEditor.get().text).toEqual('123')

  await wrapper.setProps({ modelValue: JSON.stringify({ a: 1 }) })
  await nextTick()
  expect(wrapper.vm.jsonEditor.get().text).toEqual(JSON.stringify({ a: 1 }))

  await wrapper.setProps({ modelValue: { a: 1 } })
  await nextTick()
  expect(wrapper.vm.jsonEditor.get().json).toEqual({ a: 1 })
})
