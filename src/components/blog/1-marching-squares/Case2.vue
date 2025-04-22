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
const useInterpolation = ref(true)
const threshold = ref(0.5)

// Instead of just 0 and 1, we'll use actual scalar values
// These will produce the same contour but with different interpolated positions
const cornerValues = ref([
  { key: 'topLeft', value: 0.1 },
  { key: 'topRight', value: 0.3 },
  { key: 'bottomRight', value: 0.7 },
  { key: 'bottomLeft', value: 0.9 },
])

// Corners binary representation (above/below threshold)
let corners = [0, 0, 0, 0]

// Update corner values based on case number
function updateCorners() {
  // Convert case number (0-15) to binary (4 bits)
  const binary = props.caseNumber.toString(2).padStart(4, '0')

  // Map binary digits to corners
  corners = binary.split('').map((digit) => parseInt(digit))

  // Set scalar values based on the binary representation
  // If corner is 1 (above threshold), set a value > threshold
  // If corner is 0 (below threshold), set a value < threshold
  cornerValues.value[0].value = corners[0] === 1 ? 0.7 : 0.3
  cornerValues.value[1].value = corners[1] === 1 ? 0.8 : 0.2
  cornerValues.value[2].value = corners[2] === 1 ? 0.9 : 0.1
  cornerValues.value[3].value = corners[3] === 1 ? 0.6 : 0.4
}

// Linear interpolation function
function interpolate(v1, v2, t1, t2) {
  if (Math.abs(v1 - v2) < 0.00001) return 0.5 // Avoid division by zero
  return (threshold.value - v1) / (v2 - v1)
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

  // Get corner values
  const topLeft = cornerValues.value[0].value
  const topRight = cornerValues.value[1].value
  const bottomRight = cornerValues.value[2].value
  const bottomLeft = cornerValues.value[3].value

  // Update corners based on threshold
  corners[0] = topLeft >= threshold.value ? 1 : 0
  corners[1] = topRight >= threshold.value ? 1 : 0
  corners[2] = bottomRight >= threshold.value ? 1 : 0
  corners[3] = bottomLeft >= threshold.value ? 1 : 0

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

  // Calculate interpolation points or midpoints
  let midTop, midRight, midBottom, midLeft

  if (useInterpolation.value) {
    // Calculate interpolated positions based on scalar values
    const topT = interpolate(topLeft, topRight, 0, 1)
    const rightT = interpolate(topRight, bottomRight, 0, 1)
    const bottomT = interpolate(bottomRight, bottomLeft, 0, 1)
    const leftT = interpolate(bottomLeft, topLeft, 0, 1)

    midTop = p.createVector(x + topT * size, y)
    midRight = p.createVector(x + size, y + rightT * size)
    midBottom = p.createVector(x + (1 - bottomT) * size, y + size)
    midLeft = p.createVector(x, y + (1 - leftT) * size)
  } else {
    // Use regular midpoints
    midTop = p.createVector(x + size / 2, y)
    midRight = p.createVector(x + size, y + size / 2)
    midBottom = p.createVector(x + size / 2, y + size)
    midLeft = p.createVector(x, y + size / 2)
  }

  // Calculate case number from corners
  const caseNumber =
    corners[0] * 8 + corners[1] * 4 + corners[2] * 2 + corners[3]

  // Draw the appropriate line segments for the case
  p.stroke(0, 120, 255)
  p.strokeWeight(3)

  switch (caseNumber) {
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

  // Show values
  if (showValues.value) {
    p.strokeWeight(0)
    p.fill(p.darkTheme ? 200 : 50)
    p.textSize(16)
    p.textAlign(p.CENTER)

    // Show scalar values near each corner
    p.textSize(14)
    p.text(cornerValues.value[0].value.toFixed(1), x - 20, y - 15)
    p.text(cornerValues.value[1].value.toFixed(1), x + size + 20, y - 15)
    p.text(cornerValues.value[2].value.toFixed(1), x + size + 20, y + size + 15)
    p.text(cornerValues.value[3].value.toFixed(1), x - 20, y + size + 15)

    // Visualize the interpolation calculations for all edges
    if (useInterpolation.value) {
      p.push()
      p.strokeWeight(1)
      p.stroke(255, 140, 0)
      p.fill(255, 140, 0, 100)

      // Top edge
      const topT = interpolate(topLeft, topRight, 0, 1)
      if (
        (corners[0] === 0 && corners[1] === 1) ||
        (corners[0] === 1 && corners[1] === 0)
      ) {
        p.rect(x, y - 30, topT * size, 10)
        p.text(`t = ${topT.toFixed(2)}`, x + (topT * size) / 2, y - 40)
      }

      // Right edge
      const rightT = interpolate(topRight, bottomRight, 0, 1)
      if (
        (corners[1] === 0 && corners[2] === 1) ||
        (corners[1] === 1 && corners[2] === 0)
      ) {
        p.rect(x + size + 5, y, 10, rightT * size)
        p.text(
          `t = ${rightT.toFixed(2)}`,
          x + size + 25,
          y + (rightT * size) / 2
        )
      }

      // Bottom edge
      const bottomT = interpolate(bottomRight, bottomLeft, 0, 1)
      if (
        (corners[2] === 0 && corners[3] === 1) ||
        (corners[2] === 1 && corners[3] === 0)
      ) {
        p.rect(x + (1 - bottomT) * size, y + size + 20, bottomT * size, 10)
        p.text(
          `t = ${bottomT.toFixed(2)}`,
          x + size - (bottomT * size) / 2,
          y + size + 40
        )
      }

      // Left edge
      const leftT = interpolate(bottomLeft, topLeft, 0, 1)
      if (
        (corners[3] === 0 && corners[0] === 1) ||
        (corners[3] === 1 && corners[0] === 0)
      ) {
        p.rect(x - 15, y + (1 - leftT) * size, 10, leftT * size)
        p.text(`t = ${leftT.toFixed(2)}`, x - 35, y + size - (leftT * size) / 2)
      }

      p.pop()
    }
  }

  // Draw dots at interpolation points
  p.stroke(255, 140, 0)
  p.strokeWeight(2)
  p.fill(255, 140, 0)
  p.circle(midTop.x, midTop.y, 8)
  p.circle(midRight.x, midRight.y, 8)
  p.circle(midBottom.x, midBottom.y, 8)
  p.circle(midLeft.x, midLeft.y, 8)
}

// Fill inside the contour with a lighter shade of blue
function fillInsideContour(x, y, size) {
  const topLeft = cornerValues.value[0].value
  const topRight = cornerValues.value[1].value
  const bottomRight = cornerValues.value[2].value
  const bottomLeft = cornerValues.value[3].value

  // Update corners based on threshold
  const binaryCorners = [
    topLeft >= threshold.value ? 1 : 0,
    topRight >= threshold.value ? 1 : 0,
    bottomRight >= threshold.value ? 1 : 0,
    bottomLeft >= threshold.value ? 1 : 0,
  ]

  let midTop, midRight, midBottom, midLeft

  if (useInterpolation.value) {
    // Calculate interpolated positions
    const topT = interpolate(topLeft, topRight, 0, 1)
    const rightT = interpolate(topRight, bottomRight, 0, 1)
    const bottomT = interpolate(bottomRight, bottomLeft, 0, 1)
    const leftT = interpolate(bottomLeft, topLeft, 0, 1)

    midTop = p.createVector(x + topT * size, y)
    midRight = p.createVector(x + size, y + rightT * size)
    midBottom = p.createVector(x + (1 - bottomT) * size, y + size)
    midLeft = p.createVector(x, y + (1 - leftT) * size)
  } else {
    // Use regular midpoints
    midTop = p.createVector(x + size / 2, y)
    midRight = p.createVector(x + size, y + size / 2)
    midBottom = p.createVector(x + size / 2, y + size)
    midLeft = p.createVector(x, y + size / 2)
  }

  // Calculate case number from corners
  const caseNumber =
    binaryCorners[0] * 8 +
    binaryCorners[1] * 4 +
    binaryCorners[2] * 2 +
    binaryCorners[3]

  p.fill(102, 178, 255, 150) // Lighter version of #0078ff with transparency
  p.noStroke()

  // Begin shape to fill the area inside the contour
  p.beginShape()

  switch (caseNumber) {
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

function adjustThreshold(delta) {
  threshold.value = Math.max(0.1, Math.min(0.9, threshold.value + delta))
}

// Set individual corner value
function setCornerValue(index, value) {
  cornerValues.value[index].value = value
}

// Toggle interpolation
function toggleInterpolation() {
  useInterpolation.value = !useInterpolation.value
}
</script>

<template>
  <P5Wrapper :aspectRatio="1 / 1" :setup="setup" :draw="draw">
    <template v-slot="props">
      <P5Sketch v-bind="props" />

      <div class="mb-6 mt-4 flex flex-col items-center space-y-4">
        <div class="flex items-center space-x-4">
          <button
            class="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
            @click="adjustThreshold(-0.1)"
          >
            -
          </button>

          <div>Threshold: {{ threshold.toFixed(1) }}</div>

          <button
            class="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
            @click="adjustThreshold(0.1)"
          >
            +
          </button>
        </div>

        <!-- Four corner sliders -->
        <div class="grid w-full grid-cols-2 gap-8">
          <div>
            <div class="flex justify-between">
              <label>Top Left</label>
              <span>{{ cornerValues[0].value.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              class="w-full"
              v-model="cornerValues[0].value"
            />
          </div>

          <div>
            <div class="flex justify-between">
              <label>Top Right</label>
              <span>{{ cornerValues[1].value.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              class="w-full"
              v-model="cornerValues[1].value"
            />
          </div>

          <div>
            <div class="flex justify-between">
              <label>Bottom Left</label>
              <span>{{ cornerValues[3].value.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              class="w-full"
              v-model="cornerValues[3].value"
            />
          </div>

          <div>
            <div class="flex justify-between">
              <label>Bottom Right</label>
              <span>{{ cornerValues[2].value.toFixed(1) }}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              class="w-full"
              v-model="cornerValues[2].value"
            />
          </div>
        </div>
      </div>
    </template>
  </P5Wrapper>
  <br />
</template>
