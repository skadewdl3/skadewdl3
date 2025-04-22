<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from '@nanostores/vue'
import { likeDialogOpen } from '../../utils/state'
import { Icon } from '@iconify/vue'
import { type } from 'arktype'
import { actions } from 'astro:actions'

const CommentSchema = type({
  name: 'string > 1',
  email: 'string.email',
})

const error = ref(null)

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['like.dded'])

const isDialogOpen = useStore(likeDialogOpen)
const like = ref({
  name: '',
  email: '',
  createdAt: new Date().toISOString().split('T')[0],
})

const closeDialog = () => {
  likeDialogOpen.set(false)
}

const submitComment = async () => {
  console.log(like.value)
  let res = CommentSchema(like.value)

  if (Array.isArray(res)) {
    error.value = res[0]
    return
  }

  res = await actions.addLike({
    ...like.value,
    slug: props.slug,
  })

  if (res.error) {
    error.value = res.error.message
  } else {
    closeDialog()
    window.location.reload()
  }
}

const handleEsc = (e) => {
  if (e.key === 'Escape') closeDialog()
}

onMounted(() => {
  window.addEventListener('keydown', handleEsc)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc)
})

watch(like, () => (error.value = null), { deep: true })
</script>

<template>
  <Teleport to="body" v-if="isDialogOpen">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeDialog"
      @keydown.esc="closeDialog"
    >
      <div
        class="relative w-full max-w-md rounded-lg bg-[#1e1e1e] p-6 font-mono text-sm text-gray-100 shadow-lg"
      >
        <div class="flex items-center justify-between">
          <h2 class="mb-4 text-lg font-semibold text-gray-100">
            Like this post
          </h2>
          <Icon
            icon="mdi:close"
            :size="20"
            @click="closeDialog"
            class="cursor-pointer text-gray-400 hover:text-gray-200"
          />
        </div>
        <form @submit.prevent="submitComment" class="space-y-4">
          <div>
            <label for="name" class="mb-1 block text-gray-300">Name</label>
            <input
              v-model="like.name"
              type="text"
              id="name"
              class="w-full rounded border border-gray-700 bg-[#2a2a2a] p-2 text-gray-100 placeholder-gray-500 focus:border-gray-500 focus:ring-0"
            />
          </div>
          <div>
            <label for="email" class="mb-1 block text-gray-300">Email</label>
            <input
              v-model="like.email"
              type="email"
              id="email"
              class="w-full rounded border border-gray-700 bg-[#2a2a2a] p-2 text-gray-100 placeholder-gray-500 focus:border-gray-500 focus:ring-0"
            />
          </div>
          <div>
            <label for="createdAt" class="mb-1 block text-gray-300">Date</label>
            <input
              v-model="like.createdAt"
              type="date"
              id="createdAt"
              class="w-full rounded border border-gray-700 bg-[#2a2a2a] p-2 text-gray-100 placeholder-gray-500 focus:border-gray-500 focus:ring-0"
            />
          </div>
          <button
            type="submit"
            class="neutral-100 w-full rounded border border-gray-600 px-4 py-2 hover:bg-neutral-700"
          >
            Like
          </button>
          <div v-if="error" class="mt-2 text-center text-red-500">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
