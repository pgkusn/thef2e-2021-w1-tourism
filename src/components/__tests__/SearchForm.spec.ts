import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import SearchForm from '../SearchForm.vue'
import TheSelect from '../TheSelect.vue'
import type { City } from '@/types'

// Mock data
const mockCityList: City[] = [
  { CityName: '臺北市', City: 'Taipei' },
  { CityName: '新北市', City: 'NewTaipei' },
  { CityName: '臺中市', City: 'Taichung' },
  { CityName: '高雄市', City: 'Kaohsiung' },
]

describe('SearchForm.vue', () => {
  let wrapper: VueWrapper<any>

  const createWrapper = (props = {}) => {
    return mount(SearchForm, {
      props: {
        cityList: mockCityList,
        initialValue: {},
        ...props,
      },
      global: {
        components: {
          TheSelect,
        },
      },
    })
  }

  beforeEach(() => {
    // 每次測試前清理
    if (wrapper) {
      wrapper.unmount()
    }
  })

  /**
   * Critical Tests - 核心功能測試
   */
  describe('組件渲染', () => {
    it('應該正確渲染表單元素', () => {
      wrapper = createWrapper()

      // 驗證表單存在
      const form = wrapper.find('form')
      expect(form.exists()).toBe(true)

      // 驗證 TheSelect 組件存在
      const select = wrapper.findComponent(TheSelect)
      expect(select.exists()).toBe(true)

      // 驗證關鍵字輸入框存在
      const input = wrapper.find('input[type="text"][placeholder="輸入景點名稱"]')
      expect(input.exists()).toBe(true)
      expect(input.attributes('placeholder')).toBe('輸入景點名稱')

      // 驗證提交按鈕存在
      const button = wrapper.find('button[type="submit"]')
      expect(button.exists()).toBe(true)
      expect(button.text()).toContain('搜尋')
    })

    it('應該渲染搜尋按鈕的圖示', () => {
      wrapper = createWrapper()

      const icon = wrapper.find('.i-mdi-magnify')
      expect(icon.exists()).toBe(true)
    })

    it('應該將 cityList 傳遞給 TheSelect 組件', () => {
      wrapper = createWrapper()

      const select = wrapper.findComponent(TheSelect)
      expect(select.props('options')).toEqual(mockCityList)
    })
  })

  describe('初始值同步 (watchEffect)', () => {
    it('當 initialValue.city 有效時，應該同步 city 值', async () => {
      wrapper = createWrapper({
        initialValue: {
          city: 'Taipei',
          keyword: '',
        },
      })

      await nextTick()

      const select = wrapper.findComponent(TheSelect)
      const cityValue = select.props('modelValue')

      expect(cityValue).toBeDefined()
      expect(cityValue?.City).toBe('Taipei')
      expect(cityValue?.CityName).toBe('臺北市')
    })

    it('當 initialValue.keyword 有值時，應該同步 keyword 值', async () => {
      wrapper = createWrapper({
        initialValue: {
          city: '',
          keyword: '測試景點',
        },
      })

      await nextTick()

      const input = wrapper.find('input[type="text"][placeholder="輸入景點名稱"]')
      expect((input.element as HTMLInputElement).value).toBe('測試景點')
    })

    it('當 initialValue 同時包含 city 和 keyword 時，應該都同步', async () => {
      wrapper = createWrapper({
        initialValue: {
          city: 'Taichung',
          keyword: '台中公園',
        },
      })

      await nextTick()

      const select = wrapper.findComponent(TheSelect)
      const cityValue = select.props('modelValue')
      expect(cityValue?.City).toBe('Taichung')

      const input = wrapper.find('input[type="text"][placeholder="輸入景點名稱"]')
      expect((input.element as HTMLInputElement).value).toBe('台中公園')
    })

    it('當 initialValue 改變時，組件狀態應該更新', async () => {
      wrapper = createWrapper({
        initialValue: {
          city: 'Taipei',
          keyword: '測試1',
        },
      })

      await nextTick()

      // 更新 props
      await wrapper.setProps({
        initialValue: {
          city: 'Kaohsiung',
          keyword: '測試2',
        },
      })

      await nextTick()

      const select = wrapper.findComponent(TheSelect)
      const cityValue = select.props('modelValue')
      expect(cityValue?.City).toBe('Kaohsiung')

      const input = wrapper.find('input[type="text"][placeholder="輸入景點名稱"]')
      expect((input.element as HTMLInputElement).value).toBe('測試2')
    })
  })

  describe('表單提交', () => {
    it('提交表單時應該觸發 submit 事件並傳遞正確的資料', async () => {
      wrapper = createWrapper({
        initialValue: {
          city: 'Taipei',
          keyword: '101',
        },
      })

      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      // 驗證 emit 被觸發
      expect(wrapper.emitted('submit')).toBeTruthy()
      expect(wrapper.emitted('submit')?.length).toBe(1)

      // 驗證傳遞的資料正確
      const emittedData = wrapper.emitted('submit')?.[0][0] as any
      expect(emittedData).toEqual({
        city: 'Taipei',
        keyword: '101',
      })
    })

    it('當 city 和 keyword 都為空時，應該正常提交', async () => {
      wrapper = createWrapper({
        initialValue: {},
      })

      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      expect(wrapper.emitted('submit')).toBeTruthy()

      const emittedData = wrapper.emitted('submit')?.[0][0] as any
      expect(emittedData).toEqual({
        city: undefined,
        keyword: undefined,
      })
    })

    it('點擊提交按鈕應該觸發表單提交', async () => {
      wrapper = createWrapper({
        initialValue: {
          city: 'NewTaipei',
          keyword: '淡水老街',
        },
      })

      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      expect(wrapper.emitted('submit')).toBeTruthy()

      const emittedData = wrapper.emitted('submit')?.[0][0] as any
      expect(emittedData.city).toBe('NewTaipei')
      expect(emittedData.keyword).toBe('淡水老街')
    })
  })

  /**
   * Important Tests - 邊界情況和錯誤處理
   */
  describe('邊界情況處理', () => {
    it('initialValue 為空物件時應該正常運作', async () => {
      wrapper = createWrapper({
        initialValue: {},
      })

      await nextTick()

      const select = wrapper.findComponent(TheSelect)
      expect(select.props('modelValue')).toBeNull()

      const input = wrapper.find('input[type="text"][placeholder="輸入景點名稱"]')
      expect((input.element as HTMLInputElement).value).toBe('')
    })

    it('initialValue.city 為 undefined 時應該正常運作', async () => {
      wrapper = createWrapper({
        initialValue: {
          city: undefined,
          keyword: '測試',
        },
      })

      await nextTick()

      const select = wrapper.findComponent(TheSelect)
      expect(select.props('modelValue')).toBeNull()
    })

    it('initialValue.keyword 為 undefined 時應該正常運作', async () => {
      wrapper = createWrapper({
        initialValue: {
          city: 'Taipei',
          keyword: undefined,
        },
      })

      await nextTick()

      const input = wrapper.find('input[type="text"][placeholder="輸入景點名稱"]')
      expect((input.element as HTMLInputElement).value).toBe('')
    })

    it('當 initialValue.city 不存在於 cityList 中時，city 應該為 null', async () => {
      wrapper = createWrapper({
        initialValue: {
          city: 'NonExistentCity',
          keyword: '',
        },
      })

      await nextTick()

      const select = wrapper.findComponent(TheSelect)
      expect(select.props('modelValue')).toBeNull()
    })

    it('cityList 為空陣列時應該正常渲染', () => {
      wrapper = createWrapper({
        cityList: [],
        initialValue: {},
      })

      const select = wrapper.findComponent(TheSelect)
      expect(select.exists()).toBe(true)
      expect(select.props('options')).toEqual([])
    })
  })

  describe('關鍵字輸入和修剪', () => {
    it('應該正確綁定 keyword 輸入', async () => {
      wrapper = createWrapper({
        initialValue: {},
      })

      const input = wrapper.find('input[type="text"][placeholder="輸入景點名稱"]')
      await input.setValue('台北101')

      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      const emittedData = wrapper.emitted('submit')?.[0][0] as any
      expect(emittedData.keyword).toBe('台北101')
    })

    it('v-model.trim 應該自動移除前後空白', async () => {
      wrapper = createWrapper({
        initialValue: {},
      })

      const input = wrapper.find('input[type="text"][placeholder="輸入景點名稱"]')

      // 設置包含前後空白的值
      await input.setValue('  淡水老街  ')

      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      const emittedData = wrapper.emitted('submit')?.[0][0] as any
      // trim 修飾符應該移除空白
      expect(emittedData.keyword).toBe('淡水老街')
    })

    it('當輸入只有空白時，應該變成空字串', async () => {
      wrapper = createWrapper({
        initialValue: {},
      })

      const input = wrapper.find('input[type="text"][placeholder="輸入景點名稱"]')
      await input.setValue('     ')

      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      const emittedData = wrapper.emitted('submit')?.[0][0] as any
      expect(emittedData.keyword).toBe('')
    })
  })

  describe('城市選擇變更', () => {
    it('選擇城市應該更新 city 值', async () => {
      wrapper = createWrapper({
        initialValue: {},
      })

      const select = wrapper.findComponent(TheSelect)

      // 模擬選擇城市
      await select.vm.$emit('update:modelValue', mockCityList[2]) // Taichung

      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      const emittedData = wrapper.emitted('submit')?.[0][0] as any
      expect(emittedData.city).toBe('Taichung')
    })

    it('清除城市選擇應該發送 undefined', async () => {
      wrapper = createWrapper({
        initialValue: {
          city: 'Taipei',
          keyword: '',
        },
      })

      await nextTick()

      const select = wrapper.findComponent(TheSelect)

      // 模擬清除選擇（TheSelect 使用 nullable）
      await select.vm.$emit('update:modelValue', null)

      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit')

      const emittedData = wrapper.emitted('submit')?.[0][0] as any
      expect(emittedData.city).toBeUndefined()
    })
  })

  /**
   * Nice-to-have Tests - UI 相關測試
   */
  describe('UI 樣式和屬性', () => {
    it('輸入框應該有正確的 placeholder', () => {
      wrapper = createWrapper()

      const input = wrapper.find('input[type="text"][placeholder="輸入景點名稱"]')
      expect(input.attributes('placeholder')).toBe('輸入景點名稱')
    })

    it('提交按鈕應該顯示正確的文字', () => {
      wrapper = createWrapper()

      const button = wrapper.find('button[type="submit"]')
      expect(button.text()).toContain('搜尋')
    })

    it('表單應該有正確的 CSS 類別', () => {
      wrapper = createWrapper()

      const form = wrapper.find('form')
      // 驗證 UnoCSS 類別存在
      expect(form.classes()).toContain('flex')
      expect(form.classes()).toContain('flex-col')
    })
  })

  /**
   * 整合測試 - 完整用戶流程
   */
  describe('完整用戶流程', () => {
    it('用戶選擇城市、輸入關鍵字並提交的完整流程', async () => {
      wrapper = createWrapper({
        initialValue: {},
      })

      // 步驟 1: 選擇城市
      const select = wrapper.findComponent(TheSelect)
      await select.vm.$emit('update:modelValue', mockCityList[0]) // Taipei

      await nextTick()

      // 步驟 2: 輸入關鍵字
      const input = wrapper.find('input[type="text"][placeholder="輸入景點名稱"]')
      await input.setValue('  台北101  ')

      await nextTick()

      // 步驟 3: 提交表單
      const form = wrapper.find('form')
      await form.trigger('submit')

      // 驗證結果
      expect(wrapper.emitted('submit')).toBeTruthy()
      const emittedData = wrapper.emitted('submit')?.[0][0] as any
      expect(emittedData).toEqual({
        city: 'Taipei',
        keyword: '台北101', // 應該被 trim
      })
    })

    it('用戶修改已有的搜尋條件並重新提交', async () => {
      wrapper = createWrapper({
        initialValue: {
          city: 'Taipei',
          keyword: '原始關鍵字',
        },
      })

      await nextTick()

      // 修改城市
      const select = wrapper.findComponent(TheSelect)
      await select.vm.$emit('update:modelValue', mockCityList[3]) // Kaohsiung

      // 修改關鍵字
      const input = wrapper.find('input[type="text"][placeholder="輸入景點名稱"]')
      await input.setValue('新關鍵字')

      await nextTick()

      // 提交
      const form = wrapper.find('form')
      await form.trigger('submit')

      const emittedData = wrapper.emitted('submit')?.[0][0] as any
      expect(emittedData).toEqual({
        city: 'Kaohsiung',
        keyword: '新關鍵字',
      })
    })
  })
})
