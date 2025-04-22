<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import P5Wrapper from '@/layouts/P5Wrapper.vue'
import P5Sketch from '@/components/P5Sketch.vue'

const resolution = ref(51)
const frequency = ref(1)
const showLines = ref(true)
const showAxes = ref(false)

watch([resolution, frequency], updatePoints)

type Point = {
  x: number
  y: number
}

let points: Point[] = []
let origin
let p: any

function updatePoints() {
  points = []
  let n = resolution.value
  for (let i = 0; i < n + 1; i += 1) {
    let x = p.width * (i / resolution.value)
    let y =
      (p.height / 2 - 5) * Math.sin(2 * frequency.value * Math.PI * (i / n))
    points.push(p.createVector(x, y))
  }
}

function drawAxes() {
  p.strokeWeight(0.5)
  p.stroke(255)
  // x axis
  p.line(0, 0, p.width, 0)
  // y axis
  p.line(2, -p.height / 2, 2, p.height / 2)

  for (let i = 0; i < points.length; i++) {
    p.line(points[i].x, -5, points[i].x, 5)
  }

  p.fill(255, 255, 0)
  p.textSize(20)
  p.Text('x', p.width - 10, 20)
  p.Text('y', 10, -p.height / 2 + 20)
}

function setup(p5: any, width: number, height: number) {
  console.log('this ran')
  p = p5
  p.createCanvas(width, height)
  updatePoints()
}

function draw() {
  p.translate(0, p.height / 2)
  p.scale(1, -1)
  p.background(p.darkTheme ? 0 : 233)

  if (showAxes.value) {
    drawAxes()
  }
  p.stroke(255, 0, 0)
  p.strokeWeight(2)
  for (let i = 0; i < points.length - 1; i++) {
    if (showLines.value) {
      p.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
    } else {
      p.point(points[i].x, points[i].y)
    }
  }
}
</script>

<template>
  <br />
  <P5Wrapper :aspectRatio="3 / 16" :setup="setup" :draw="draw">
    <template v-slot="props">
      <P5Sketch v-bind="props" />
      <br />
      <div
        class="sinx-controls grid grid-cols-2 place-items-center md:grid-cols-3"
      >
        <div class="text-center">
          <p>Resolution</p>
          <input type="range" min="3" max="99" step="1" v-model="resolution" />
        </div>
        <div class="text-center">
          <p>Frequency</p>
          <input
            type="range"
            min="0.5"
            max="4"
            step="0.1"
            v-model="frequency"
          />
        </div>
        <div class="hidden w-1/2 flex-col md:flex">
          <div class="flex items-center justify-between text-center">
            <span class="inline">Show Lines</span>
            <input type="checkbox" v-model="showLines" />
          </div>
          <div class="flex items-center justify-between text-center">
            <span>Show Axes</span>
            <input type="checkbox" v-model="showAxes" />
          </div>
        </div>
      </div>

      <div class="grid w-full grid-cols-2 place-items-center md:hidden">
        <div class="flex items-center justify-between text-center">
          <span class="mr-2 inline">Show Lines</span>
          <input type="checkbox" v-model="showLines" />
        </div>
        <div class="flex items-center justify-between text-center">
          <span class="mr-2 inline">Show Axes</span>
          <input type="checkbox" v-model="showAxes" />
        </div>
      </div>
    </template>
  </P5Wrapper>
  <br />
</template>
