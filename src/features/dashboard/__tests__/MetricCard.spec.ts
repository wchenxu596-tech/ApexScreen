/**
 * MetricCard 组件测试
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MetricCard from '../components/MetricCard.vue'

describe('MetricCard', () => {
  it('应该正确渲染标签和数值', () => {
    const wrapper = mount(MetricCard, {
      props: {
        label: '总用户数',
        value: 123456,
      },
    })

    expect(wrapper.text()).toContain('总用户数')
    expect(wrapper.text()).toContain('123,456')
  })

  it('当 trend > 0 时显示上升箭头', () => {
    const wrapper = mount(MetricCard, {
      props: {
        label: '营收',
        value: 1000,
        trend: 5.2,
        trendLabel: '环比',
      },
    })

    expect(wrapper.text()).toContain('▲')
    expect(wrapper.text()).toContain('5.2%')
    expect(wrapper.text()).toContain('环比')
  })

  it('当 trend < 0 时显示下降箭头', () => {
    const wrapper = mount(MetricCard, {
      props: {
        label: '营收',
        value: 1000,
        trend: -3.1,
      },
    })

    expect(wrapper.text()).toContain('▼')
    expect(wrapper.text()).toContain('3.1%')
  })

  it('当 trend === 0 时不显示趋势', () => {
    const wrapper = mount(MetricCard, {
      props: {
        label: '测试',
        value: 100,
        trend: 0,
      },
    })

    expect(wrapper.text()).not.toContain('%')
  })

  it('支持 prefix 和 unit', () => {
    const wrapper = mount(MetricCard, {
      props: {
        label: '营收',
        value: 888.5,
        prefix: '¥',
        unit: '万',
      },
    })

    expect(wrapper.text()).toContain('¥')
    expect(wrapper.text()).toContain('万')
  })
})
