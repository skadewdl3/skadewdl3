<script setup lang="ts">
import { onMounted } from 'vue'


onMounted(async () => {
  const p5 = await import('p5')
  console.log("Hello World")
  console.log(window)

  function setup() {
    this.createCanvas(400, 400);
  }

  function draw() {
    this.background(0)
  }

  console.log(p5.default)



  const sketch = new p5.default((sketch) => {
    sketch.setup = () => setup.call(sketch)
    sketch.draw = () => draw.call(sketch)
  }, document.querySelector('.p5-sketch'))

  console.log("Hello World")
  console.log(window)
})
</script>

<template>
  <div class="p5-sketch"></div>
  This is from the sinx file
</template>
