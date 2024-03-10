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
        light: '#6E6E6E',
      },
    },
  },
  variants: [
    //@ts-ignore
    matcher => {
      // The prefix cannot start with "-" or "hover", you can customize the prefix.
      if (!matcher.startsWith('&hover:')) return matcher
      return {
        // slice `hover:` prefix and passed to the next variants and rules
        matcher: matcher.slice(7), // The 7 here represents the number of characters in the prefix.
        parent: [`@media (hover: hover) and (pointer: fine)`],
        selector: s => `${s}:hover`,
      }
    },
  ],
})
