<script setup lang="ts">
import { ref, watch } from 'vue'
import { renderMarkdown } from '@/utils/misc'
import { watchThrottled } from '@vueuse/core'

const props = defineProps({
  input: {
    type: String,
    required: true,
  },
  block: {
    type: Boolean,
    default: false,
  },
})

const getString = (s: string) => {
  if (props.block) {
    return `$$\n${s}\n$$`
  } else {
    return `$ ${s} $`
  }
}

const output = ref<string>(await renderMarkdown(getString(props.input)))

watchThrottled(
  () => props.input,
  async (newInput) => {
    output.value = await renderMarkdown(getString(newInput as string))
  },
  { throttle: 500 }
)
</script>

<template>
  <div v-html="output"></div>
</template>
