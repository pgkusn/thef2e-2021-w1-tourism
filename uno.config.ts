import { defineConfig, presetUno, presetIcons } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  theme: {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '20px',
        xl: 0,
      },
    },
    colors: {
      red: {
        primary: '#B72323',
      },
      blue: {
        primary: '#2A48FF',
      },
      gray: {
        dark: '#2C2C2C',
        light: '#959595',
      },
    },
  },
})
