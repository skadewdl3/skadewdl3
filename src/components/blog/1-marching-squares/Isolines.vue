<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import P5Wrapper from '@/layouts/P5Wrapper.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import MathRenderer from '@/components/site/Math.vue'
import { renderMarkdown, roundToNthDecimal } from '@/utils/misc'

// Control parameters with reactive refs
const radius = ref(100)
const elevation = ref(0)
const rotationSpeed = ref(0.5)
const showAxes = ref(true)

let p: any
let angle = 0
let font: any

const markdown = ref(`
Here is some math: $E = mc^2$
And a block equation:

$$
\\int_{a}^{b} f(x)dx = F(b) - F(a)
$$
`)
const equation = ref(await renderMarkdown(markdown.value))

watch(markdown, async () => {
  equation.value = await renderMarkdown(markdown.value)
})

function setup(p5: any, width: number, height: number) {
  p = p5
  p.createCanvas(width, height, p.WEBGL)
  p.textFont(font)
}

function preload(p: any) {
  font = p.loadFont('/mathfont.otf')
}

function draw() {
  // Set background color based on theme
  p.background(p.darkTheme ? 20 : 240)

  // Control camera - enables panning and rotating
  p.orbitControl()

  // Update rotation angle
  angle += p.radians(rotationSpeed.value)

  // Set lighting
  p.ambientLight(60, 60, 60)
  p.pointLight(255, 255, 255, 0, 0, 300)

  // Grid for reference
  drawGrid()

  // Coordinate axes
  if (showAxes.value) {
    drawAxes()
  }

  // Push matrix for the circle
  p.push()

  // Move the circle to the specified elevation
  p.translate(0, 0, elevation.value)

  // Draw the circle - no rotation needed, x-y plane is already facing the user
  p.noFill()
  p.stroke(255, 0, 128)
  p.strokeWeight(3)
  p.circle(0, 0, radius.value * 2)

  // Draw points around the circle
  drawCirclePoints()

  p.pop()
}

function drawGrid() {
  // Draw a reference grid on the XY plane
  p.push()
  p.stroke(150, 150, 150, 100)
  p.strokeWeight(1)

  const gridSize = 400
  const gridStep = 50

  // Draw grid lines along X axis
  for (let x = -gridSize; x <= gridSize; x += gridStep) {
    p.line(x, -gridSize, 0, x, gridSize, 0)
  }

  // Draw grid lines along Y axis
  for (let y = -gridSize; y <= gridSize; y += gridStep) {
    p.line(-gridSize, y, 0, gridSize, y, 0)
  }

  p.pop()
}

function drawAxes() {
  const axisLength = 300

  // X axis - red (extended in both directions)
  p.push()
  p.stroke(255, 0, 0)
  p.strokeWeight(2)
  p.line(-axisLength, 0, 0, axisLength, 0, 0)

  // X axis arrows
  // Positive direction
  p.push()
  p.translate(axisLength, 0, 0)
  p.rotateZ(-p.HALF_PI)
  p.cone(5, 12)
  p.pop()

  // Negative direction
  p.push()
  p.translate(-axisLength, 0, 0)
  p.rotateZ(p.HALF_PI)
  p.cone(5, 12)
  p.pop()

  p.pop()

  // Y axis - green (extended in both directions)
  p.push()
  p.stroke(0, 255, 0)
  p.strokeWeight(2)
  p.line(0, -axisLength, 0, 0, axisLength, 0)

  // Y axis arrows
  // Positive direction
  p.push()
  p.translate(0, axisLength, 0)
  p.cone(5, 12)
  p.pop()

  // Negative direction
  p.push()
  p.translate(0, -axisLength, 0)
  p.rotateX(p.PI)
  p.cone(5, 12)
  p.pop()

  p.pop()

  // Z axis - blue (extended in both directions)
  p.push()
  p.stroke(0, 0, 255)
  p.strokeWeight(2)
  p.line(0, 0, -axisLength, 0, 0, axisLength)

  // Z axis arrows
  // Positive direction
  p.push()
  p.translate(0, 0, axisLength)
  p.rotateX(p.HALF_PI)
  p.cone(5, 12)
  p.pop()

  // Negative direction
  p.push()
  p.translate(0, 0, -axisLength)
  p.rotateX(-p.HALF_PI)
  p.cone(5, 12)
  p.pop()

  p.pop()
}

function drawCirclePoints() {
  const segments = 16
  const angleStep = p.TWO_PI / segments

  for (let i = 0; i < segments; i++) {
    const a = i * angleStep
    const x = radius.value * Math.cos(a)
    const y = radius.value * Math.sin(a)

    p.push()
    p.translate(x, y, 0)
    p.fill(255, 0, 255)
    p.noStroke()
    p.sphere(5)
    p.pop()
  }
}
</script>

<template>
  <br />
  <P5Wrapper :aspectRatio="1" :setup="setup" :draw="draw" :preload="preload">
    <template v-slot="props">
      <P5Sketch v-bind="props" />
      <br />
      <br />
      <div class="grid grid-cols-2 place-items-center gap-4">
        <div class="flex w-full flex-col items-center justify-center gap-4">
          <MathRenderer
            :input="`x^2 + y^2 - (${roundToNthDecimal(radius / 50, 2)})^2 = ${roundToNthDecimal(elevation / 50, 2)}`"
            :block="true"
          />

          <div class="mb-2 flex justify-center space-x-4">
            <div class="flex items-center">
              <div class="mr-1 h-4 w-4 bg-red-500"></div>
              <span>X-axis</span>
            </div>
            <div class="flex items-center">
              <div class="mr-1 h-4 w-4 bg-green-500"></div>
              <span>Y-axis</span>
            </div>
            <div class="flex items-center">
              <div class="mr-1 h-4 w-4 bg-blue-500"></div>
              <span>Z-axis</span>
            </div>
          </div>
        </div>

        <div class="w-full">
          <div class="w-full text-center">
            <p>Circle Radius = {{ radius / 50 }}</p>
            <input
              type="range"
              min="20"
              max="200"
              step="1"
              v-model="radius"
              class="w-full"
            />
          </div>

          <div class="w-full text-center">
            <p>Elevation = {{ elevation / 50 }}</p>
            <input
              type="range"
              min="-200"
              max="200"
              step="1"
              v-model="elevation"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </template>
  </P5Wrapper>
  <br />
</template>
