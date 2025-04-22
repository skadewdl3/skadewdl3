<script setup lang="ts">
import { onMounted, ref, watch, defineProps } from 'vue'
import isDarkTheme from '@/utils/isDarkTheme'
import { useDark } from '@vueuse/core'
import P5Matrix from '@/utils/p5Matrix.ts'

const root = ref(null)
const element = ref<HTMLElement | null>(null)
const load = ref(null)
const props = defineProps(['setup', 'draw', 'aspectRatio', 'theme', 'preload'])
const sketchInitialized = ref(false) // Added this since you were using it

const { setup, draw, aspectRatio, theme, preload } = props

const p5 = await import('p5')

onMounted(() => {
  if (!element.value) {
    return
  }

  const width = parseInt(window.getComputedStyle(element.value).width)
  const height = aspectRatio * width
  element.value.style.height = `${height}px`
  if (element.value) element.value.innerHTML = ''

  let sketch = new p5.default((sketch: any) => {
    sketch.Text = (...args: any[]) => {
      sketch.scale(1, -1)
      sketch.text(...args)
      sketch.scale(1, -1)
    }

    sketch.Matrix = P5Matrix
    sketch.darkTheme = theme

    preload && preload(sketch)

    let p5Setup = () => setup(sketch, width, height)
    let p5Draw = draw
    sketch.setup = p5Setup
    sketch.draw = p5Draw
  }, element.value)

  sketch.setup()
  sketch.loop()
  sketchInitialized.value = true
})
</script>

<template>
  <div
    class="p5-sketch grid w-full place-items-center text-black"
    ref="element"
  ></div>
</template>

<style scoped>
.loading-dark {
  animation: pulse 2s infinite;
  background: #2c2c2c;
  height: 96px;
  color: #fff;
}

.loading {
  opacity: 1;
  z-index: 1;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    background-color: #333;
  }

  50% {
    opacity: 0.5;
    background-color: #2c2c2c;
  }
}
</style>
