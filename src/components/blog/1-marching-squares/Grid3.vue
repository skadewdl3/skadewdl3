<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import P5Wrapper from '@/layouts/P5Wrapper.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import { roundToNthDecimal } from '@/utils/math'

const radius = ref(5.1)
const discrete = ref(false)

type Point = {
  x: number
  y: number
}

let points: Point[] = []
let p: any
const UNIT = 50
const U = UNIT

// Check if a point is inside the circle
function isPointInsideCircle(
  point: Point,
  circleCenter: Point,
  circleRadius: number
): boolean {
  const distSq =
    (point.x - circleCenter.x) * (point.x - circleCenter.x) +
    (point.y - circleCenter.y) * (point.y - circleCenter.y)
  return distSq <= circleRadius * circleRadius
}

function drawGrid() {
  p.strokeWeight(0.2)
  p.stroke(150)

  // Calculate how many grid lines we need based on canvas dimensions
  const xLines = Math.ceil(p.width / U)
  const yLines = Math.ceil(p.height / U)

  // Circle radius
  const circleRadius = radius.value * U // radius is half the diameter (10*U/2)
  const circleCenter = { x: 0, y: 0 }

  // Draw vertical grid lines
  // Start from a multiple of U closest to the left edge
  for (
    let x = -Math.floor(xLines / 2) * U;
    x <= Math.ceil(xLines / 2) * U;
    x += U
  ) {
    p.line(x, -p.height / 2, x, p.height / 2)
  }

  // Draw horizontal grid lines
  // Start from a multiple of U closest to the bottom edge
  for (
    let y = -Math.floor(yLines / 2) * U;
    y <= Math.ceil(yLines / 2) * U;
    y += U
  ) {
    p.line(-p.width / 2, y, p.width / 2, y)
  }

  // Draw grid points with 0/1 labels
  p.strokeWeight(1)
  const pointRadius = 15 // Size of the circles at grid points

  // Go through each grid point
  for (
    let x = -Math.floor(xLines / 2) * U;
    x <= Math.ceil(xLines / 2) * U;
    x += U
  ) {
    for (
      let y = -Math.floor(yLines / 2) * U;
      y <= Math.ceil(yLines / 2) * U;
      y += U
    ) {
      const point = { x, y }
      const insideCircle = isPointInsideCircle(
        point,
        circleCenter,
        circleRadius
      )

      // Draw circle at grid point
      if (insideCircle) {
        // Purple fill for points inside the circle
        p.stroke(100, 0, 128)
        p.fill(128, 0, 255, 127)
      } else {
        // Transparent white for points outside the circle
        p.stroke(150)
        p.fill(255, 255, 255, 127)
      }
      p.circle(x, y, pointRadius)

      // Add 0/1 label with contrasting colors
      p.fill(insideCircle ? 255 : 0)
      p.strokeWeight(0)
      p.push()
      p.scale(1, -1) // Flip text to be readable
      p.textAlign(p.CENTER, p.CENTER)
      p.textSize(12)
      p.text(insideCircle ? '1' : '0', x, -y)
      p.pop()
      p.strokeWeight(1)
    }
  }
}

function setup(p5: any, width: number, height: number) {
  p = p5
  p.createCanvas(width, height)
}

function draw() {
  p.translate(p.width / 2, p.height / 2)
  p.scale(1, -1)
  p.background(p.darkTheme ? 20 : 233)

  drawGrid()

  // Draw the circle outline
  if (!discrete.value) {
    p.stroke(p.darkTheme ? 100 : 156)
    p.strokeWeight(2)
    p.fill(255, 0, 0, 0)
    p.circle(0, 0, radius.value * 2 * U)
  }
}
</script>

<template>
  <br />
  <P5Wrapper :aspectRatio="1" :setup="setup" :draw="draw">
    <template v-slot="props">
      <P5Sketch v-bind="props" />
      <br />
      <div class="grid grid-cols-2 place-items-center">
        <div class="text-center">
          <p>Radius = {{ roundToNthDecimal(radius, 2) }}</p>
          <input type="range" min="1" max="7" step="0.01" v-model="radius" />
        </div>

        <div class="flex items-center justify-between text-center">
          <span class="mr-2 inline">Discretize</span>
          <input type="checkbox" v-model="discrete" />
        </div>
      </div>
    </template>
  </P5Wrapper>
  <br />
</template>
