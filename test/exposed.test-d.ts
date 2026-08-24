import type { JsonEditor } from 'vanilla-jsoneditor'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type JsonEditorVue from '../src/index'
import { describe, expectTypeOf, it } from 'vitest'

import { useTemplateRef } from 'vue'

type Instance = InstanceType<typeof JsonEditorVue>

describe('expose 类型（issue #113）', () => {
  it('InstanceType 包含 expose 的 jsonEditor，且 ref 在实例上自动解包', () => {
    expectTypeOf<Instance['jsonEditor']>().toEqualTypeOf<JsonEditor>()
  })

  it('useTemplateRef<InstanceType<...>> 可直接访问 jsonEditor', () => {
    const jsonEditorVueRef = useTemplateRef<Instance>('jsonEditorVueRef')
    expectTypeOf(jsonEditorVueRef.value!.jsonEditor.focus).toBeFunction()
  })

  it('Volar 模板推导路径（ComponentExposed）同样生效', () => {
    expectTypeOf<ComponentExposed<typeof JsonEditorVue>>().toHaveProperty('jsonEditor')
  })

  it('原有实例/props 类型不受影响', () => {
    expectTypeOf<Instance['$props']>().toHaveProperty('mode')
    // @ts-expect-error 不存在的属性仍应报错
    expectTypeOf<Instance>().toHaveProperty('notExist')
  })
})
