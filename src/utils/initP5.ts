export default async (element: HTMLElement, aspectRatio: number, setup: (p: any, width: number, height: number) => void, draw: () => void) => {
  // @ts-ignore
  const p5 = await import('p5')
  const width = parseInt(window.getComputedStyle(element).width)
  const height = aspectRatio * width
  let sketch = new p5.default((sketch: any) => {
    let p5Setup = () => setup(sketch, width, height)
    let p5Draw = draw
    sketch.setup = p5Setup
    sketch.draw = p5Draw
  }, element)
  return sketch
}
