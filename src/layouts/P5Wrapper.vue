<script setup lang="ts">
import { onMounted, ref, watch, defineProps, useSlots } from 'vue'

const root = ref(null)
const element = ref(null)
const load = ref(null)
const loading = ref(true)
const error = ref(null)
const darkTheme = ref(false)

const { setup, draw, aspectRatio } = defineProps(['setup', 'draw', 'aspectRatio'])

onMounted(async () => {
  darkTheme.value = localStorage.theme == 'light' ? false : (localStorage.theme == 'dark' || window.matchMedia("(prefers-color-scheme: dark)").matches);
  console.log(darkTheme.value)
  element.value = root.value.querySelector('.p5-sketch')

  const height = window.getComputedStyle(root.value).height

  load.value.querySelector('div').style.height = height
  load.value.style.height = height
})

let unwatch = watch(loading, () => {
  if (loading) return;

  // @ts-ignore
  load.value.querySelector('div')?.classList.remove('loading-dark', 'loading-light')
  load.value.classList.remove('loading')
  unwatch()
})

</script>

<template>
  <div class="relative" ref="root">
    <div class="absolute group opacity-0 z-[-1] w-full transition-all" ref="load"
      :class="{ 'loading': loading, 'bg-[#2c2c2c]': darkTheme, 'bg-[#ccc]': !darkTheme }">
      <div class="grid place-items-center group-[.loading]:opacity-100 opacity-0 transition-all w-full"
        :class="{ 'loading-dark text-neutral-300': darkTheme, 'loading-light text-black': !darkTheme }">
        <p>Loading animation...</p>
      </div>
    </div>
    <slot :setLoading="x => loading = x" :setError="x => error = e" :aspectRatio="aspectRatio" :setup="setup"
      :draw="draw" :loading="loading" ref="element" />
  </div>
</template>

<style scoped>
.loading-dark {
  animation: pulse 2s infinite;
  background: #2c2c2c;
  height: 96px;
}


.loading-light {
  animation: pulseLight 2s infinite;
  background: #ccc;
  height: 96px;
}

.loading {
  opacity: 1;
  z-index: 1;
}


@keyframes pulseLight {

  0%,
  100% {
    opacity: 1;
    background-color: #ddd;
  }

  50% {
    opacity: 0.5;
    background-color: #ccc;
  }
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
