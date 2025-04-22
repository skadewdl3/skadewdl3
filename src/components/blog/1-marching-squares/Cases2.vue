<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import P5Wrapper from '@/layouts/P5Wrapper.vue'
import P5Sketch from '@/components/P5Sketch.vue'

// Grid configuration
const resolution = ref(8)
const threshold = ref(0.5)
const showGrid = ref(true)
const showCaseNumbers = ref(true)
const showIsolines = ref(true)
const noiseScale = ref(0.1)
const animationSpeed = ref(0.005)
const fieldType = ref('noise')
const brushSize = ref(2)
const brushValue = ref(1.0)
const useInterpolation = ref(true)

// Data for marching squares
let field = []
let p: any
let t = 0
let isDrawing = false

watch([resolution], setupField)
watch([noiseScale, threshold, fieldType], updateField)

// Initialize the field based on the selected type
function setupField() {
  const cols = resolution.value
  const rows = resolution.value
  field = new Array(cols + 1)

  for (let i = 0; i <= cols; i++) {
    field[i] = new Array(rows + 1)
    for (let j = 0; j <= rows; j++) {
      field[i][j] = 0
    }
  }

  updateField()
}

// Update field values based on the selected pattern
function updateField() {
  if (fieldType.value === 'custom') return

  const cols = resolution.value
  const rows = resolution.value

  for (let i = 0; i <= cols; i++) {
    for (let j = 0; j <= rows; j++) {
      const x = i / cols
      const y = j / rows

      switch (fieldType.value) {
        case 'noise':
          field[i][j] = p.noise(
            x * 10 * noiseScale.value,
            y * 10 * noiseScale.value,
            t
          )
          break
        case 'radial':
          const dx = x - 0.5
          const dy = y - 0.5
          field[i][j] = p.sin(
            10 * noiseScale.value * p.sqrt(dx * dx + dy * dy) - t * 5
          )
          break
        case 'waves':
          field[i][j] =
            p.sin(x * 10 * noiseScale.value - t) *
            p.cos(y * 10 * noiseScale.value + t)
          break
        case 'all':
          // Display all 16 possible cases in a 4x4 grid
          const caseNum =
            Math.floor(i / (cols / 4)) + 4 * Math.floor(j / (rows / 4))
          field[i][j] = getCaseValue(
            i % (cols / 4),
            j % (rows / 4),
            caseNum,
            cols / 4,
            rows / 4
          )
          break
      }
    }
  }
}

// Helper function to create specific field values for each marching squares case
function getCaseValue(x, y, caseNum, maxX, maxY) {
  // Convert to binary representation of the case
  const binary = caseNum.toString(2).padStart(4, '0')

  // Check which corners should be above threshold based on case number
  const topLeft = binary[0] === '1' ? 1 : 0
  const topRight = binary[1] === '1' ? 1 : 0
  const bottomRight = binary[2] === '1' ? 1 : 0
  const bottomLeft = binary[3] === '1' ? 1 : 0

  // Interpolate field values to create a gradient
  const normalizedX = x / maxX
  const normalizedY = y / maxY

  // Bilinear interpolation of values at the corners
  return (
    (1 - normalizedX) * (1 - normalizedY) * topLeft +
    normalizedX * (1 - normalizedY) * topRight +
    normalizedX * normalizedY * bottomRight +
    (1 - normalizedX) * normalizedY * bottomLeft
  )
}

// Get the case number based on the corner values
function getState(a, b, c, d) {
  return a * 8 + b * 4 + c * 2 + d * 1
}

// Linear interpolation function to find exact threshold crossing point
function interpolate(x1, y1, x2, y2, val1, val2) {
  if (Math.abs(val1 - val2) < 0.00001)
    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 }

  const t = (threshold.value - val1) / (val2 - val1)
  return {
    x: x1 + t * (x2 - x1),
    y: y1 + t * (y2 - y1),
  }
}

// Draw a line segment for the appropriate marching squares case
function drawIsolines(i, j, cellSize) {
  const x = i * cellSize
  const y = j * cellSize

  // Get the four corners of the cell
  const a = field[i][j] > threshold.value ? 1 : 0
  const b = field[i + 1][j] > threshold.value ? 1 : 0
  const c = field[i + 1][j + 1] > threshold.value ? 1 : 0
  const d = field[i][j + 1] > threshold.value ? 1 : 0

  // Calculate the case number (0-15)
  const state = getState(a, b, c, d)

  // Display case number in the center of each cell
  if (showCaseNumbers.value) {
    p.push()
    p.fill(255, 255, 0)
    p.noStroke()
    p.textSize(cellSize / 3)
    p.textAlign(p.CENTER, p.CENTER)
    p.text(state, x + cellSize / 2, y + cellSize / 2)
    p.pop()
  }

  if (!showIsolines.value) return

  // Only continue drawing isolines if enabled
  p.stroke(0, 200, 255)
  p.strokeWeight(2)

  // Prepare the interpolated points for each edge if interpolation is enabled
  let top, right, bottom, left

  if (useInterpolation.value) {
    // Top edge
    top = interpolate(x, y, x + cellSize, y, field[i][j], field[i + 1][j])

    // Right edge
    right = interpolate(
      x + cellSize,
      y,
      x + cellSize,
      y + cellSize,
      field[i + 1][j],
      field[i + 1][j + 1]
    )

    // Bottom edge
    bottom = interpolate(
      x + cellSize,
      y + cellSize,
      x,
      y + cellSize,
      field[i + 1][j + 1],
      field[i][j + 1]
    )

    // Left edge
    left = interpolate(x, y + cellSize, x, y, field[i][j + 1], field[i][j])
  } else {
    // Use midpoints if interpolation is disabled
    top = { x: x + cellSize / 2, y: y }
    right = { x: x + cellSize, y: y + cellSize / 2 }
    bottom = { x: x + cellSize / 2, y: y + cellSize }
    left = { x: x, y: y + cellSize / 2 }
  }

  // Draw the appropriate line segments based on the case number
  switch (state) {
    case 1: // Bottom left corner
      p.line(left.x, left.y, bottom.x, bottom.y)
      break
    case 2: // Bottom right corner
      p.line(bottom.x, bottom.y, right.x, right.y)
      break
    case 3: // Bottom edge
      p.line(left.x, left.y, right.x, right.y)
      break
    case 4: // Top right corner
      p.line(top.x, top.y, right.x, right.y)
      break
    case 5: // Diagonal case
      p.line(left.x, left.y, top.x, top.y)
      p.line(bottom.x, bottom.y, right.x, right.y)
      break
    case 6: // Right edge
      p.line(top.x, top.y, bottom.x, bottom.y)
      break
    case 7: // Three corners, not top left
      p.line(left.x, left.y, top.x, top.y)
      break
    case 8: // Top left corner
      p.line(left.x, left.y, top.x, top.y)
      break
    case 9: // Left edge
      p.line(top.x, top.y, bottom.x, bottom.y)
      break
    case 10: // Diagonal case
      p.line(left.x, left.y, bottom.x, bottom.y)
      p.line(top.x, top.y, right.x, right.y)
      break
    case 11: // Three corners, not top right
      p.line(top.x, top.y, right.x, right.y)
      break
    case 12: // Top edge
      p.line(left.x, left.y, right.x, right.y)
      break
    case 13: // Three corners, not bottom right
      p.line(bottom.x, bottom.y, right.x, right.y)
      break
    case 14: // Three corners, not bottom left
      p.line(left.x, left.y, bottom.x, bottom.y)
      break
    case 15: // All corners
      // No line to draw when all corners are the same
      break
    default: // Case 0 - no points
      // No line to draw
      break
  }
}

// Handle mouse interactions for drawing on the grid
function handleMouseInteraction() {
  if (fieldType.value !== 'custom' || !p.mouseIsPressed) return

  const cols = resolution.value
  const rows = resolution.value
  const cellSize = p.width / cols

  for (let i = 0; i <= cols; i++) {
    for (let j = 0; j <= rows; j++) {
      const x = i * cellSize
      const y = j * cellSize
      const distance = p.dist(p.mouseX, p.mouseY, x, y)

      if (distance < (brushSize.value * cellSize) / 2) {
        // Apply brush with falloff based on distance
        const value =
          brushValue.value * (1 - distance / ((brushSize.value * cellSize) / 2))
        field[i][j] = p.constrain(field[i][j] + value, 0, 1)
      }
    }
  }
}

function clearField() {
  for (let i = 0; i <= resolution.value; i++) {
    for (let j = 0; j <= resolution.value; j++) {
      field[i][j] = 0
    }
  }
}

function mousePressed() {
  isDrawing = true
  if (fieldType.value === 'custom') {
    handleMouseInteraction()
  }
}

function mouseReleased() {
  isDrawing = false
}

function setup(p5: any, width: number, height: number) {
  p = p5
  p.createCanvas(width, height)
  p.mousePressed = mousePressed
  p.mouseReleased = mouseReleased
  setupField()
}

function draw() {
  p.background(p.darkTheme ? 20 : 240)

  // Handle drawing if in custom mode
  if (
    fieldType.value === 'custom' &&
    p.mouseIsPressed &&
    p.mouseX > 0 &&
    p.mouseX < p.width &&
    p.mouseY > 0 &&
    p.mouseY < p.height
  ) {
    handleMouseInteraction()
  }

  // Animate field for non-custom modes
  if (fieldType.value !== 'custom' && fieldType.value !== 'all') {
    t += animationSpeed.value
    updateField()
  }

  const cols = resolution.value
  const rows = resolution.value
  const cellSize = p.width / cols

  // Draw grid
  if (showGrid.value) {
    p.stroke(120)
    p.strokeWeight(0.5)
    for (let i = 0; i <= cols; i++) {
      p.line(i * cellSize, 0, i * cellSize, p.height)
    }
    for (let j = 0; j <= rows; j++) {
      p.line(0, j * cellSize, p.width, j * cellSize)
    }
  }

  // Draw field values
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Draw filled squares for values above threshold
      const val = field[i][j]
      if (val > threshold.value) {
        p.noStroke()
        p.fill(0, 255 * p.map(val, threshold.value, 1, 0.2, 1), 0, 150)
        p.rect(i * cellSize, j * cellSize, cellSize, cellSize)
      }

      // Draw values at grid points
      p.noStroke()
      if (field[i][j] > threshold.value) {
        p.fill(0, 255, 0)
      } else {
        p.fill(200)
      }
      p.circle(i * cellSize, j * cellSize, cellSize / 6)
    }
  }

  // Draw last row and column of points
  for (let i = 0; i <= cols; i++) {
    p.noStroke()
    if (field[i][rows] > threshold.value) {
      p.fill(0, 255, 0)
    } else {
      p.fill(200)
    }
    p.circle(i * cellSize, rows * cellSize, cellSize / 6)
  }

  for (let j = 0; j <= rows; j++) {
    p.noStroke()
    if (field[cols][j] > threshold.value) {
      p.fill(0, 255, 0)
    } else {
      p.fill(200)
    }
    p.circle(cols * cellSize, j * cellSize, cellSize / 6)
  }

  // Draw isolines
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      drawIsolines(i, j, cellSize)
    }
  }

  // Draw brush preview in custom mode
  if (
    fieldType.value === 'custom' &&
    p.mouseX > 0 &&
    p.mouseX < p.width &&
    p.mouseY > 0 &&
    p.mouseY < p.height
  ) {
    p.noFill()
    p.stroke(255, 255, 0)
    p.strokeWeight(1)
    p.circle(p.mouseX, p.mouseY, brushSize.value * cellSize)
  }
}

watch(fieldType, () => {
  if (fieldType.value == 'custom') {
    clearField()
  }
})
</script>

<template>
  <br />
  <P5Wrapper :aspectRatio="1" :setup="setup" :draw="draw" key="bruh">
    <template v-slot="props">
      <P5Sketch v-bind="props" />
      <br />

      <!-- Main Control Panel -->
      <div class="flex flex-col gap-4 md:flex-row">
        <!-- Left Column: Field Type Selection and Core Controls -->
        <div class="w-full rounded-lg md:w-1/2">
          <h3 class="mb-3 text-lg font-semibold">Field Settings</h3>

          <!-- Field Type Selector -->
          <div class="mb-4">
            <label class="mb-2 block font-medium">Field Type</label>
            <select v-model="fieldType" class="w-full rounded border p-2">
              <option value="noise">Perlin Noise</option>
              <option value="radial">Radial Pattern</option>
              <option value="waves">Wave Pattern</option>
              <option value="all">All 16 Cases</option>
              <option value="custom">Custom Drawing</option>
            </select>
          </div>

          <!-- Core Sliders (Always Visible) -->
          <div class="mb-4">
            <label class="mb-1 block font-medium"
              >Resolution: {{ resolution }}</label
            >
            <input
              type="range"
              min="4"
              max="32"
              step="4"
              v-model="resolution"
              class="w-full"
            />
          </div>

          <!-- Dynamic Controls Based on Field Type -->
          <div v-if="fieldType === 'custom'" class="space-y-4">
            <div>
              <label class="mb-1 block font-medium"
                >Brush Size: {{ brushSize }}</label
              >
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                v-model="brushSize"
                class="w-full"
              />
            </div>

            <button
              @click="clearField"
              class="neutral-100 w-full rounded border border-neutral-600 px-4 py-2 hover:bg-neutral-700"
            >
              Clear Canvas
            </button>
          </div>
        </div>

        <!-- Right Column: Display Options -->
        <div class="w-full rounded-lg md:w-1/2">
          <h3 class="mb-3 text-lg font-semibold">Display Options</h3>

          <div class="space-y-3">
            <div class="flex items-center">
              <input
                type="checkbox"
                id="grid-toggle"
                v-model="showGrid"
                class="mr-2 h-5 w-5"
              />
              <label for="grid-toggle" class="cursor-pointer">Show Grid</label>
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                id="case-toggle"
                v-model="showCaseNumbers"
                class="mr-2 h-5 w-5"
              />
              <label for="case-toggle" class="cursor-pointer"
                >Show Case Numbers</label
              >
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                id="isolines-toggle"
                v-model="showIsolines"
                class="mr-2 h-5 w-5"
              />
              <label for="isolines-toggle" class="cursor-pointer"
                >Show Isolines</label
              >
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                id="interpolation-toggle"
                v-model="useInterpolation"
                class="mr-2 h-5 w-5"
              />
              <label for="interpolation-toggle" class="cursor-pointer"
                >Use Linear Interpolation</label
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </P5Wrapper>
  <br />
</template>
