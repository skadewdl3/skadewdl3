<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import P5Wrapper from '@/layouts/P5Wrapper.vue'
import P5Sketch from '@/components/P5Sketch.vue'

const props = defineProps<{
  caseNumber: number
}>()

let p: any
const cellSize = ref(200)
const showValues = ref(true)

// Values at the 4 corners of the cell (top-left, top-right, bottom-right, bottom-left)
// These will be determined by the case number (0-15)
let corners = [0, 0, 0, 0]

// Update corners based on case number
function updateCorners() {
  // Convert case number (0-15) to binary (4 bits)
  const binary = props.caseNumber.toString(2).padStart(4, '0')

  // Map binary digits to corners
  corners = binary.split('').map((digit) => parseInt(digit))
}

// Setup the p5.js sketch
function setup(p5: any, width: number, height: number) {
  p = p5
  p.createCanvas(width, height)
  updateCorners()
}

// Draw the marching squares case
function draw() {
  p.background(p.darkTheme ? 20 : 240)

  // Calculate the center position
  const centerX = p.width / 2
  const centerY = p.height / 2

  // Draw the cell
  const size = cellSize.value
  const x = centerX - size / 2
  const y = centerY - size / 2

  // Fill inside the contour
  fillInsideContour(x, y, size)

  // Draw the cell border
  p.stroke(100)
  p.strokeWeight(1)
  p.noFill()
  p.rect(x, y, size, size)

  // Draw corner points with appropriate colors
  const radius = 10
  p.strokeWeight(2)

  // Top-left (0)
  p.fill(corners[0] === 1 ? p.color(0, 120, 255) : p.color(200, 200, 200))
  p.circle(x, y, radius * 2)

  // Top-right (1)
  p.fill(corners[1] === 1 ? p.color(0, 120, 255) : p.color(200, 200, 200))
  p.circle(x + size, y, radius * 2)

  // Bottom-right (2)
  p.fill(corners[2] === 1 ? p.color(0, 120, 255) : p.color(200, 200, 200))
  p.circle(x + size, y + size, radius * 2)

  // Bottom-left (3)
  p.fill(corners[3] === 1 ? p.color(0, 120, 255) : p.color(200, 200, 200))
  p.circle(x, y + size, radius * 2)

  // Draw line segments based on the case number
  p.stroke(0, 120, 255)
  p.strokeWeight(3)

  const mid = size / 2

  // Calculate midpoints
  const midTop = p.createVector(x + mid, y)
  const midRight = p.createVector(x + size, y + mid)
  const midBottom = p.createVector(x + mid, y + size)
  const midLeft = p.createVector(x, y + mid)

  // Draw the appropriate line segments for the case
  switch (props.caseNumber) {
    case 1: // 0001
      p.line(midLeft.x, midLeft.y, midBottom.x, midBottom.y)
      break
    case 2: // 0010
      p.line(midBottom.x, midBottom.y, midRight.x, midRight.y)
      break
    case 3: // 0011
      p.line(midLeft.x, midLeft.y, midRight.x, midRight.y)
      break
    case 4: // 0100
      p.line(midTop.x, midTop.y, midRight.x, midRight.y)
      break
    case 5: // 0101
      p.line(midTop.x, midTop.y, midLeft.x, midLeft.y)
      p.line(midBottom.x, midBottom.y, midRight.x, midRight.y)
      break
    case 6: // 0110
      p.line(midTop.x, midTop.y, midBottom.x, midBottom.y)
      break
    case 7: // 0111
      p.line(midTop.x, midTop.y, midLeft.x, midLeft.y)
      break
    case 8: // 1000
      p.line(midTop.x, midTop.y, midLeft.x, midLeft.y)
      break
    case 9: // 1001
      p.line(midTop.x, midTop.y, midBottom.x, midBottom.y)
      break
    case 10: // 1010
      p.line(midTop.x, midTop.y, midRight.x, midRight.y)
      p.line(midBottom.x, midBottom.y, midLeft.x, midLeft.y)
      break
    case 11: // 1011
      p.line(midTop.x, midTop.y, midRight.x, midRight.y)
      break
    case 12: // 1100
      p.line(midLeft.x, midLeft.y, midRight.x, midRight.y)
      break
    case 13: // 1101
      p.line(midBottom.x, midBottom.y, midRight.x, midRight.y)
      break
    case 14: // 1110
      p.line(midBottom.x, midBottom.y, midLeft.x, midLeft.y)
      break
    case 15: // 1111
      // All corners are 1, no lines to draw
      break
    default: // 0000
      // All corners are 0, no lines to draw
      break
  }

  // Show case number and values
  if (showValues.value) {
    p.strokeWeight(0)
    p.fill(p.darkTheme ? 200 : 50)
    p.textSize(16)
    p.textAlign(p.CENTER)

    // Show case number
    p.text(
      `Case ${props.caseNumber} (${props.caseNumber.toString(2).padStart(4, '0')})`,
      centerX,
      centerY - size / 2 - 20
    )

    // Show values near each corner
    p.textSize(14)
    p.text(corners[0], x - 15, y - 15)
    p.text(corners[1], x + size + 15, y - 15)
    p.text(corners[2], x + size + 15, y + size + 15)
    p.text(corners[3], x - 15, y + size + 15)
  }
}

// Fill inside the contour with a lighter shade of blue
function fillInsideContour(x, y, size) {
  const mid = size / 2

  // Calculate midpoints
  const midTop = p.createVector(x + mid, y)
  const midRight = p.createVector(x + size, y + mid)
  const midBottom = p.createVector(x + mid, y + size)
  const midLeft = p.createVector(x, y + mid)

  p.fill(102, 178, 255, 150) // Lighter version of #0078ff with transparency
  p.noStroke()

  // Begin shape to fill the area inside the contour
  p.beginShape()

  switch (props.caseNumber) {
    case 1: // 0001
      p.vertex(x, y + size)
      p.vertex(midLeft.x, midLeft.y)
      p.vertex(midBottom.x, midBottom.y)
      break
    case 2: // 0010
      p.vertex(x + size, y + size)
      p.vertex(midRight.x, midRight.y)
      p.vertex(midBottom.x, midBottom.y)
      break
    case 3: // 0011
      p.vertex(x, y + size)
      p.vertex(midLeft.x, midLeft.y)
      p.vertex(midRight.x, midRight.y)
      p.vertex(x + size, y + size)
      break
    case 4: // 0100
      p.vertex(x + size, y)
      p.vertex(midTop.x, midTop.y)
      p.vertex(midRight.x, midRight.y)
      break
    case 5: // 0101
      p.vertex(x, y)
      p.vertex(midTop.x, midTop.y)
      p.vertex(midLeft.x, midLeft.y)
      p.vertex(x, y + size)
      p.endShape(p.CLOSE)

      p.beginShape()
      p.vertex(x + size, y)
      p.vertex(x + size, y + size)
      p.vertex(midBottom.x, midBottom.y)
      p.vertex(midRight.x, midRight.y)
      break
    case 6: // 0110
      p.vertex(x + size, y)
      p.vertex(midTop.x, midTop.y)
      p.vertex(midBottom.x, midBottom.y)
      p.vertex(x + size, y + size)
      break
    case 7: // 0111
      p.vertex(x, y)
      p.vertex(midTop.x, midTop.y)
      p.vertex(midLeft.x, midLeft.y)
      p.vertex(x, y + size)
      p.vertex(x + size, y + size)
      p.vertex(x + size, y)
      break
    case 8: // 1000
      p.vertex(x, y)
      p.vertex(midTop.x, midTop.y)
      p.vertex(midLeft.x, midLeft.y)
      break
    case 9: // 1001
      p.vertex(x, y)
      p.vertex(midTop.x, midTop.y)
      p.vertex(midBottom.x, midBottom.y)
      p.vertex(x, y + size)
      break
    case 10: // 1010
      p.vertex(x, y)
      p.vertex(x + size, y)
      p.vertex(midRight.x, midRight.y)
      p.vertex(midTop.x, midTop.y)
      p.endShape(p.CLOSE)

      p.beginShape()
      p.vertex(x, y + size)
      p.vertex(midLeft.x, midLeft.y)
      p.vertex(midBottom.x, midBottom.y)
      p.vertex(x + size, y + size)
      break
    case 11: // 1011
      p.vertex(x, y)
      p.vertex(x + size, y)
      p.vertex(midRight.x, midRight.y)
      p.vertex(midTop.x, midTop.y)
      p.vertex(x, y + size)
      p.vertex(x + size, y + size)
      break
    case 12: // 1100
      p.vertex(x, y)
      p.vertex(x + size, y)
      p.vertex(midRight.x, midRight.y)
      p.vertex(midLeft.x, midLeft.y)
      break
    case 13: // 1101
      p.vertex(x, y)
      p.vertex(x + size, y)
      p.vertex(x + size, y + size)
      p.vertex(midBottom.x, midBottom.y)
      p.vertex(midRight.x, midRight.y)
      break
    case 14: // 1110
      p.vertex(x, y)
      p.vertex(x + size, y)
      p.vertex(x + size, y + size)
      p.vertex(midBottom.x, midBottom.y)
      p.vertex(midLeft.x, midLeft.y)
      break
    case 15: // 1111
      // Fill entire square
      p.vertex(x, y)
      p.vertex(x + size, y)
      p.vertex(x + size, y + size)
      p.vertex(x, y + size)
      break
    default: // case 0: 0000
      // No area to fill
      p.endShape()
      return
  }
  p.endShape(p.CLOSE)
}

// Update corners when case number changes
watch(() => props.caseNumber, updateCorners)
</script>

<template>
  <P5Wrapper :aspectRatio="1 / 1" :setup="setup" :draw="draw">
    <template v-slot="props">
      <P5Sketch v-bind="props" />
    </template>
  </P5Wrapper>
  <br />
</template>
