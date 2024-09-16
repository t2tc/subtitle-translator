import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import uno from 'unocss/vite'
// @ts-ignore
import reactCompiler from 'babel-plugin-react-compiler'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(
    {
      babel: {
        plugins: [reactCompiler, {}],
      },
    }
  ), uno()],
})
