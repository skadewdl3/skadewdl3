<script setup lang="ts">
import { onMounted, ref, watch, defineProps } from 'vue'

const root = ref(null)
const element = ref(null)
const load = ref(null)
const props = defineProps(['setup', 'draw', 'aspectRatio', 'setLoading'])
console.log(props)
const { setup, draw, setLoading, aspectRatio } = props
let p
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
onMounted(async () => {
  try {
    const width = parseInt(window.getComputedStyle(element.value).width)
    const height = aspectRatio * width
    element.value.style.height = `${height}px`

    const p5 = await import('p5')
    element.innerHTML = ''
    let sketch = new p5.default((sketch: any) => {
      let p5Setup = () => setup(sketch, width, height)
      let p5Draw = draw
      sketch.setup = p5Setup
      sketch.draw = p5Draw
    }, element.value)

    await sleep(3000)

    setLoading && setLoading(false)
  } catch (e) {
    setError && setError(e)
  }
})
</script>

<template>
  <div class="w-full text-black grid place-items-center p5-sketch" ref="element"></div>
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
