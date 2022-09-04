import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import JsonEditorVue from '../src/index'

test('set value', async () => {
  const wrapper = mount(JsonEditorVue, {
    props: {
      mode: 'text',
      modelValue: 'initialValue',
    },
  })
  expect(wrapper.get('.cm-activeLine').text()).toEqual('initialValue')
})
