<script setup lang="ts">
import { onMounted } from 'vue'
import initP5 from '../../../utils/initP5'


function setup(width, height) {
  console.log(width, height)
  this.createCanvas(width, height);
}

function draw() {
  this.background(0)
}

onMounted(() => {
  let root = document.querySelector('.p5-sketch')
  let sketch = initP5(root, 3 / 16, setup, draw)
})
</script>

<template>
  <div class="p5-sketch w-full"></div>
  This is from the sinx file
</template>
