<script setup lang="ts">
import { onMounted, ref, watch, defineProps } from 'vue'

const root = ref(null)
const element = ref(null)
const load = ref(null)
const { setup, draw, aspectRatio } = defineProps(['setup', 'draw', 'aspectRatio'])

let p
onMounted(async () => {
  const rootHeight = parseInt(window.getComputedStyle(root.value).height)
  const width = parseInt(window.getComputedStyle(element.value).width)
  const height = aspectRatio * width

  root.value.style.height = `${rootHeight + height}px`
  load.value.querySelector('div').style.height = `${rootHeight + height}px`
  load.value.style.height = `${rootHeight + height}px`

  const p5 = await import('p5')
  element.innerHTML = ''
  let sketch = new p5.default((sketch: any) => {
    let p5Setup = () => setup(sketch, width, height)
    let p5Draw = draw
    sketch.setup = p5Setup
    sketch.draw = p5Draw
  }, element.value)

  // @ts-ignore
  load.value.querySelector('div')?.classList.remove('loading-dark', 'loading-light')
  load.value.classList.remove('loading')

})
</script>

<template>
  <div class="relative" ref="root">

    <div class="absolute group loading bg-[#2c2c2c] opacity-0 z-[-1] w-full transition-all" ref="load">
      <div class="loading-dark group-[.loading]:opacity-100 opacity-0 transition-all w-full h-full loading-dark">
        <p>Loading animation...</p>
      </div>
    </div>
    <div class="w-full text-black grid place-items-center" ref="element"></div>
    <br />
    <slot />
  </div>
  <br />
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
