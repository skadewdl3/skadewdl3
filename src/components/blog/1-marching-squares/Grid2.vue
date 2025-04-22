<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import P5Wrapper from '@/layouts/P5Wrapper.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import { roundToNthDecimal } from '@/utils/misc'

const gridHighlight = ref(false)
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

  // Highlight grid squares that intersect with the circle boundary
  p.stroke(255, 0, 0)
  p.fill(255, 0, 0, 50) // Semi-transparent red

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

        if (!discrete.value) continue

        // Find intersection points of the circle with the square's edges
        const intersections = findCircleSquareIntersections(
          { x: 0, y: 0 }, // Circle center
          circleRadius,
          { x, y }, // Square top-left
          U // Square size
        )

        if (intersections.length >= 2) {
          // Draw a line connecting the first two intersection points
          p.strokeWeight(2)
          p.stroke(0, 0, 255) // Blue line for intersections
          p.line(
            intersections[0].x,
            intersections[0].y,
            intersections[1].x,
            intersections[1].y
          )
          p.strokeWeight(0.2)
          p.stroke(255, 0, 0)
        }
      }
    }
  }
}

// Helper function to find intersections between a circle and a square
function findCircleSquareIntersections(
  circleCenter: Point,
  radius: number,
  squareTopLeft: Point,
  squareSize: number
): Point[] {
  const intersections: Point[] = []

  // Check each edge of the square for intersections with the circle

  // Bottom edge: y = squareTopLeft.y, x from squareTopLeft.x to squareTopLeft.x + squareSize
  findCircleLineIntersections(
    circleCenter,
    radius,
    { x: squareTopLeft.x, y: squareTopLeft.y },
    { x: squareTopLeft.x + squareSize, y: squareTopLeft.y },
    intersections
  )

  // Right edge: x = squareTopLeft.x + squareSize, y from squareTopLeft.y to squareTopLeft.y + squareSize
  findCircleLineIntersections(
    circleCenter,
    radius,
    { x: squareTopLeft.x + squareSize, y: squareTopLeft.y },
    { x: squareTopLeft.x + squareSize, y: squareTopLeft.y + squareSize },
    intersections
  )

  // Top edge: y = squareTopLeft.y + squareSize, x from squareTopLeft.x to squareTopLeft.x + squareSize
  findCircleLineIntersections(
    circleCenter,
    radius,
    { x: squareTopLeft.x, y: squareTopLeft.y + squareSize },
    { x: squareTopLeft.x + squareSize, y: squareTopLeft.y + squareSize },
    intersections
  )

  // Left edge: x = squareTopLeft.x, y from squareTopLeft.y to squareTopLeft.y + squareSize
  findCircleLineIntersections(
    circleCenter,
    radius,
    { x: squareTopLeft.x, y: squareTopLeft.y },
    { x: squareTopLeft.x, y: squareTopLeft.y + squareSize },
    intersections
  )

  return intersections
}

// Find intersections between a circle and a line segment
function findCircleLineIntersections(
  circleCenter: Point,
  radius: number,
  lineStart: Point,
  lineEnd: Point,
  intersections: Point[]
): void {
  // Convert line to parametric form: point = start + t * (end - start)
  const dx = lineEnd.x - lineStart.x
  const dy = lineEnd.y - lineStart.y

  // Solve quadratic equation for t at intersection points
  const a = dx * dx + dy * dy
  const b =
    2 *
    (dx * (lineStart.x - circleCenter.x) + dy * (lineStart.y - circleCenter.y))
  const c =
    (lineStart.x - circleCenter.x) * (lineStart.x - circleCenter.x) +
    (lineStart.y - circleCenter.y) * (lineStart.y - circleCenter.y) -
    radius * radius

  const discriminant = b * b - 4 * a * c

  if (discriminant < 0) {
    // No intersections
    return
  }

  // We have intersection(s)
  const t1 = (-b + Math.sqrt(discriminant)) / (2 * a)
  const t2 = (-b - Math.sqrt(discriminant)) / (2 * a)

  // Check if intersection point is on the line segment (t in [0, 1])
  if (t1 >= 0 && t1 <= 1) {
    intersections.push({
      x: lineStart.x + t1 * dx,
      y: lineStart.y + t1 * dy,
    })
  }

  if (t2 >= 0 && t2 <= 1) {
    intersections.push({
      x: lineStart.x + t2 * dx,
      y: lineStart.y + t2 * dy,
    })
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
  if (!discrete.value) p.circle(0, 0, radius.value * 2 * U)
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
