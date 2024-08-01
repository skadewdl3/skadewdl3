<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import P5Wrapper from '@/layouts/P5Wrapper.vue'
import P5Sketch from '@/components/P5Sketch.vue'

const resolution = ref(51)
const frequency = ref(1)


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

function setup(p5, width, height) {
  p = p5
  p.createCanvas(width, height);
  updatePoints()
}

function draw() {
  p.background(0)
  p.stroke(255, 0, 0)
  p.strokeWeight(2)

  p.translate(0, p.height / 2);
  for (let i = 0; i < points.length - 1; i++) {
    p.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
  }
}
</script>

<template>
  <br />
  <P5Wrapper :aspectRatio="3 / 16" :setup="setup" :draw="draw">
    <template v-slot="props">

      <P5Sketch v-bind="props" />
      <br />
      <div class="sinx-controls grid grid-cols-2 place-items-center">
        <div class="text-center">
          <p>Resolution</p>
          <input type="range" min="3" max="99" step="1" v-model="resolution" />
        </div>
        <div class="text-center">
          <p>Frequency</p>
          <input type="range" min="0.5" max="4" step="0.1" v-model="frequency" />
        </div>
      </div>

    </template>
  </P5Wrapper>
  <br />
</template>

<style scoped>
.loading-dark {
  animation: pulse 2s infinite;
  background: #2c2c2c;
  height: 96px;
  color: #fff;
}

.loading {
  opacity: 1
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
