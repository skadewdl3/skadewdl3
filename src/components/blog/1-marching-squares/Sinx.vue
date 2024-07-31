<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import initP5 from '../../../utils/initP5'

const p5Root = ref(null)
const resolution = ref(51)
const frequency = ref(1)

onMounted(() => {
  let sketch = initP5(p5Root.value, 3 / 16, setup, draw)
})

watch([resolution, frequency], updatePoints)

let points = []
let origin
let p

function updatePoints() {
  points = []
  let n = resolution.value
  for (let i = 0; i < n + 1; i += 1) {
    let x = p.width * (i / resolution.value);
    let y = ((p.height / 2) - 5) * Math.sin(2 * frequency.value * Math.PI * (i / n));
    points.push(p.createVector(x, y))
  }
}

function setup(width, height) {
  p = this
  p.createCanvas(width, height);

  origin = p.createVector(0, height / 2);
  updatePoints()
}

function draw() {
  p.background(0)
  p.stroke(255, 0, 0)
  p.strokeWeight(2)

  p.translate(origin);
  for (let i = 0; i < points.length - 1; i++) {
    p.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
  }
}

</script>

<template>
  <div class="p5-sketch w-full" ref="p5Root"></div>
  <br />
  <div class="grid grid-cols-2 place-items-center">
    <div class="sinx-control text-center">
      <p>Resolution</p>
      <input type="range" min="3" max="99" step="1" v-model="resolution" />
    </div>
    <div class="sinx-control text-center">
      <p>Frequency</p>
      <input type="range" min="0.5" max="4" step="0.1" v-model="frequency" />
    </div>
  </div>
  <br />
</template>
