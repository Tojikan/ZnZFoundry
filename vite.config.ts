import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'znzVueComponents',
      formats: ['es'], // also supports 'umd'
      fileName: () => `components.vue.js`,
    },
    rollupOptions: {
      external: [
        'vue'
      ],
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          vue: 'Vue',
        },
        // Map the external dependency to a local copy of Vue 3 esm.
        paths: {
          vue: '../module/lib/vue.esm-browser.js'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == 'style.css')
            return `styles.css`;
          return assetInfo.name;
        }
      },
    },
  },
  plugins: [
    vue()
  ]
})
