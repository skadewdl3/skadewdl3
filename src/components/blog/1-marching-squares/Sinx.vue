<script setup lang="ts">
import { onMounted, ref } from 'vue'
import initP5 from '../../../utils/initP5'


let points = [];

function setup(width, height) {
  this.createCanvas(width, height);
  for (let i = 0; i < width; i += 20) {
    let x = i;
    let y = (height / 2) + this.sin(x) * 20
    points.push(this.createVector(x, y));
  }
  console.log(points)
}

function draw() {
  this.background(0, 255, 0, 0)
  this.stroke(255, 0, 0)
  this.strokeWeight(3)
  for (let i = 0; i < points.length - 1; i++) {
    this.point(points[i].x, points[i].y)
  }
}

const p5Root = ref(null)

onMounted(() => {
  let sketch = initP5(p5Root.value, 3 / 16, setup, draw)
})
</script>

<template>
  <div class="p5-sketch w-full" ref="p5Root"></div>
</template>
