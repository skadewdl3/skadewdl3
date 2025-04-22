<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import P5Wrapper from '@/layouts/P5Wrapper.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import { roundToNthDecimal } from '@/utils/misc'

const gridHighlight = ref(false)
const radius = ref(5)

type Point = {
  x: number
  y: number
}

let points: Point[] = []
let p: any
const UNIT = 50
const U = UNIT

function drawGrid() {
  p.strokeWeight(0.2)
  p.stroke(150)

  // Calculate how many grid lines we need based on canvas dimensions
  const xLines = Math.ceil(p.width / U)
  const yLines = Math.ceil(p.height / U)

  // Circle radius
  const circleRadius = radius.value * U // radius is half the diameter (10*U/2)

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

  if (!gridHighlight.value) return

  // Highlight grid squares that intersect with the circle boundary
  p.stroke(255, 0, 0)
  p.fill(255, 0, 0, 70) // Semi-transparent yellow

  // Go through each grid square
  for (
    let x = -Math.floor(xLines / 2) * U;
    x < Math.ceil(xLines / 2) * U;
    x += U
  ) {
    for (
      let y = -Math.floor(yLines / 2) * U;
      y < Math.ceil(yLines / 2) * U;
      y += U
    ) {
      // Check if this square intersects with the circle boundary
      // We check if any corner of the square is inside the circle
      // and any corner is outside (which indicates intersection)
      const corners = [
        { x: x, y: y },
        { x: x + U, y: y },
        { x: x, y: y + U },
        { x: x + U, y: y + U },
      ]

      let anyInside = false
      let anyOutside = false

      for (const corner of corners) {
        const distSq = corner.x * corner.x + corner.y * corner.y
        if (distSq <= circleRadius * circleRadius) {
          anyInside = true
        } else {
          anyOutside = true
        }
      }

      // If we have both inside and outside corners, the square intersects the circle
      if (anyInside && anyOutside) {
        p.rect(x, y, U, U)
      }
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
  p.stroke(255, 0, 0)
  p.strokeWeight(2)

  p.fill(255, 0, 0, 0)
  p.stroke(p.darkTheme ? 100 : 156)
  p.circle(0, 0, radius.value * 2 * U)
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
          <span class="mr-2 inline">Show Intersections</span>
          <input type="checkbox" v-model="gridHighlight" />
        </div>
      </div>
    </template>
  </P5Wrapper>
  <br />
</template>
