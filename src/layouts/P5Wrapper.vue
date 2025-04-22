<script setup lang="ts">
import { onMounted, ref, watch, defineProps, useSlots } from 'vue'
import { useDark } from '@vueuse/core'

const root = ref<HTMLElement | null>(null)
const element = ref<HTMLElement | null>(null)
const load = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref(null)
const isDark = useDark()

watch(isDark, () => {
  console.log(isDark.value)
})

const { setup, draw, aspectRatio } = defineProps([
  'setup',
  'draw',
  'aspectRatio',
])

onMounted(async () => {
  if (!root.value || !element.value || !load.value) return
  const height = window.getComputedStyle(root.value).height
  load.value.querySelector('div').style.height = height
  load.value.style.height = height
})

let unwatch = watch(loading, () => {
  if (loading || !load.value) return

  // @ts-ignore
  load.value
    .querySelector('div')
    ?.classList.remove('loading-dark', 'loading-light')
  load.value.classList.remove('loading')
  unwatch()
})
</script>

<template>
  <div class="relative" ref="root">
    <Suspense>
      <slot
        :aspectRatio="aspectRatio"
        :setup="setup"
        :draw="draw"
        :theme="isDark"
        ref="element"
      />
      <template #fallback>
        <div
          class="grid w-full place-items-center opacity-0 transition-all group-[.loading]:opacity-100"
          :class="{
            'loading-dark text-neutral-300': isDark,
            'loading-light text-black': !isDark,
          }"
        >
          <p>Loading animation...</p>
        </div>
      </template>
    </Suspense>
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
