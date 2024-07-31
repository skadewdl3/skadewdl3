<script setup lang="ts">
import { onMounted, ref } from 'vue'
import initP5 from '../../../utils/initP5'

const p5Root = ref(null)

onMounted(() => {
  let sketch = initP5(p5Root.value, 3 / 16, setup, draw)
})

let points = []
let resolution
let origin
let frequency

function updatePoints() {
  points = []
  let n = resolution.value()
  for (let i = 0; i < n + 1; i += 1) {
    let x = this.width * (i / resolution.value());
    let y = this.height / 2 * Math.sin(2 * frequency.value() * Math.PI * (i / n));
    points.push(this.createVector(x, y))
  }
}

function setup(width, height) {
  this.createCanvas(width, height);
  resolution = this.createSlider(2, 100, 5, 1)
  resolution.input(updatePoints.bind(this))

  frequency = this.createSlider(0.5, 4, 1, 0.1)
  frequency.input(updatePoints.bind(this))


  origin = this.createVector(0, height / 2);
  updatePoints.bind(this)()
}

function draw() {
  this.background(0)
  this.stroke(255, 0, 0)
  this.strokeWeight(5)

  this.translate(origin);
  for (let point of points) {
    this.point(point.x, point.y)
  }
}

</script>

<template>
  <div class="p5-sketch w-full" ref="p5Root"></div>
</template>
