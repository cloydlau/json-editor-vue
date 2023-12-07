import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import JsonEditorVue from '../src/index'

test('string value in text mode', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      mode: 'text',
      modelValue: '',
    },
  })
  await wrapper.setProps({ modelValue: 'abc' })
  expect(wrapper.vm.jsonEditor.get().json).toEqual('abc')
})

test('string value in tree mode', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      modelValue: null,
    },
  })
  await wrapper.setProps({ modelValue: JSON.stringify({ a: 1 }) })
  await nextTick()
  expect(wrapper.vm.jsonEditor.get().json).toEqual(JSON.stringify({ a: 1 }))
})
