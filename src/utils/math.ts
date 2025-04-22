export function roundToNthDecimal(number: number, n: number) {
  const factor = Math.pow(10, n)
  return Math.round(number * factor) / factor
}
