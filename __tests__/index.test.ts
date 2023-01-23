import JsonEditorVue from '../src/index'
import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'

test('string value in text mode', async () => {
	const wrapper = mount(JsonEditorVue, {
		props: {
			mode: 'text',
			modelValue: 'abc',
		},
	})
	expect(wrapper.get('.cm-activeLine').text()).toEqual('"abc"')
})

test('string value in tree mode', async () => {
	const wrapper = mount(JsonEditorVue, {
		props: {
			modelValue: 'abc',
		},
	})
	expect(wrapper.get('.jse-value').text()).toEqual('abc')
})
