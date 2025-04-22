// Minimal Matrix class implementation for 2D, 3D, and 4D matrices
export default class Matrix {
  // The matrix data stored as a flat array
  data: number[]
  // Dimensions of the matrix
  rows: number
  cols: number

  constructor(rows: number, cols: number, data?: number[]) {
    this.rows = rows
    this.cols = cols

    if (data && data.length === rows * cols) {
      // Use provided data if it matches dimensions
      this.data = data.slice() // Create a copy
    } else {
      // Initialize with identity matrix if possible
      this.data = new Array(rows * cols).fill(0)

      // Set diagonal to 1 for square matrices (identity)
      if (rows === cols) {
        for (let i = 0; i < rows; i++) {
          this.data[i * cols + i] = 1
        }
      }
    }
  }

  // Get element at specified position
  get(row: number, col: number): number {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error('Index out of bounds')
    }
    return this.data[row * this.cols + col]
  }

  // Set element at specified position
  set(row: number, col: number, value: number): void {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error('Index out of bounds')
    }
    this.data[row * this.cols + col] = value
  }

  // Create a copy of this matrix
  copy(): Matrix {
    return new Matrix(this.rows, this.cols, this.data)
  }

  // Multiply this matrix by another matrix
  multiply(other: Matrix): Matrix {
    if (this.cols !== other.rows) {
      throw new Error("Matrix dimensions don't match for multiplication")
    }

    const result = new Matrix(this.rows, other.cols)

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < other.cols; j++) {
        let sum = 0
        for (let k = 0; k < this.cols; k++) {
          sum += this.get(i, k) * other.get(k, j)
        }
        result.set(i, j, sum)
      }
    }

    return result
  }

  // Calculate the transpose of this matrix
  transpose(): Matrix {
    const result = new Matrix(this.cols, this.rows)

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(j, i, this.get(i, j))
      }
    }

    return result
  }

  // Calculate the inverse of a 3x3 or 4x4 matrix
  invert(): Matrix {
    if (this.rows !== this.cols) {
      throw new Error('Only square matrices can be inverted')
    }

    if (this.rows === 3) {
      return this.invert3x3()
    } else if (this.rows === 4) {
      return this.invert4x4()
    } else if (this.rows === 2) {
      return this.invert2x2()
    } else {
      throw new Error(
        'Only 2x2, 3x3, and 4x4 matrices are supported for inversion'
      )
    }
  }

  // Helper method to invert a 2x2 matrix
  private invert2x2(): Matrix {
    const a = this.get(0, 0)
    const b = this.get(0, 1)
    const c = this.get(1, 0)
    const d = this.get(1, 1)

    const det = a * d - b * c

    if (Math.abs(det) < 1e-10) {
      throw new Error('Matrix is singular and cannot be inverted')
    }

    const invDet = 1 / det

    const result = new Matrix(2, 2)
    result.set(0, 0, d * invDet)
    result.set(0, 1, -b * invDet)
    result.set(1, 0, -c * invDet)
    result.set(1, 1, a * invDet)

    return result
  }

  // Helper method to invert a 3x3 matrix
  private invert3x3(): Matrix {
    const a = this.get(0, 0),
      b = this.get(0, 1),
      c = this.get(0, 2)
    const d = this.get(1, 0),
      e = this.get(1, 1),
      f = this.get(1, 2)
    const g = this.get(2, 0),
      h = this.get(2, 1),
      i = this.get(2, 2)

    const A = e * i - f * h
    const B = f * g - d * i
    const C = d * h - e * g
    const D = c * h - b * i
    const E = a * i - c * g
    const F = b * g - a * h
    const G = b * f - c * e
    const H = c * d - a * f
    const I = a * e - b * d

    const det = a * A + b * B + c * C

    if (Math.abs(det) < 1e-10) {
      throw new Error('Matrix is singular and cannot be inverted')
    }

    const invDet = 1 / det

    const result = new Matrix(3, 3)
    result.set(0, 0, A * invDet)
    result.set(0, 1, D * invDet)
    result.set(0, 2, G * invDet)
    result.set(1, 0, B * invDet)
    result.set(1, 1, E * invDet)
    result.set(1, 2, H * invDet)
    result.set(2, 0, C * invDet)
    result.set(2, 1, F * invDet)
    result.set(2, 2, I * invDet)

    return result
  }

  // Helper method to invert a 4x4 matrix
  private invert4x4(): Matrix {
    // Implementation of 4x4 matrix inversion using cofactors
    const m = this.data
    const inv = new Array(16)

    inv[0] =
      m[5] * m[10] * m[15] -
      m[5] * m[11] * m[14] -
      m[9] * m[6] * m[15] +
      m[9] * m[7] * m[14] +
      m[13] * m[6] * m[11] -
      m[13] * m[7] * m[10]
    inv[4] =
      -m[4] * m[10] * m[15] +
      m[4] * m[11] * m[14] +
      m[8] * m[6] * m[15] -
      m[8] * m[7] * m[14] -
      m[12] * m[6] * m[11] +
      m[12] * m[7] * m[10]
    inv[8] =
      m[4] * m[9] * m[15] -
      m[4] * m[11] * m[13] -
      m[8] * m[5] * m[15] +
      m[8] * m[7] * m[13] +
      m[12] * m[5] * m[11] -
      m[12] * m[7] * m[9]
    inv[12] =
      -m[4] * m[9] * m[14] +
      m[4] * m[10] * m[13] +
      m[8] * m[5] * m[14] -
      m[8] * m[6] * m[13] -
      m[12] * m[5] * m[10] +
      m[12] * m[6] * m[9]
    inv[1] =
      -m[1] * m[10] * m[15] +
      m[1] * m[11] * m[14] +
      m[9] * m[2] * m[15] -
      m[9] * m[3] * m[14] -
      m[13] * m[2] * m[11] +
      m[13] * m[3] * m[10]
    inv[5] =
      m[0] * m[10] * m[15] -
      m[0] * m[11] * m[14] -
      m[8] * m[2] * m[15] +
      m[8] * m[3] * m[14] +
      m[12] * m[2] * m[11] -
      m[12] * m[3] * m[10]
    inv[9] =
      -m[0] * m[9] * m[15] +
      m[0] * m[11] * m[13] +
      m[8] * m[1] * m[15] -
      m[8] * m[3] * m[13] -
      m[12] * m[1] * m[11] +
      m[12] * m[3] * m[9]
    inv[13] =
      m[0] * m[9] * m[14] -
      m[0] * m[10] * m[13] -
      m[8] * m[1] * m[14] +
      m[8] * m[2] * m[13] +
      m[12] * m[1] * m[10] -
      m[12] * m[2] * m[9]
    inv[2] =
      m[1] * m[6] * m[15] -
      m[1] * m[7] * m[14] -
      m[5] * m[2] * m[15] +
      m[5] * m[3] * m[14] +
      m[13] * m[2] * m[7] -
      m[13] * m[3] * m[6]
    inv[6] =
      -m[0] * m[6] * m[15] +
      m[0] * m[7] * m[14] +
      m[4] * m[2] * m[15] -
      m[4] * m[3] * m[14] -
      m[12] * m[2] * m[7] +
      m[12] * m[3] * m[6]
    inv[10] =
      m[0] * m[5] * m[15] -
      m[0] * m[7] * m[13] -
      m[4] * m[1] * m[15] +
      m[4] * m[3] * m[13] +
      m[12] * m[1] * m[7] -
      m[12] * m[3] * m[5]
    inv[14] =
      -m[0] * m[5] * m[14] +
      m[0] * m[6] * m[13] +
      m[4] * m[1] * m[14] -
      m[4] * m[2] * m[13] -
      m[12] * m[1] * m[6] +
      m[12] * m[2] * m[5]
    inv[3] =
      -m[1] * m[6] * m[11] +
      m[1] * m[7] * m[10] +
      m[5] * m[2] * m[11] -
      m[5] * m[3] * m[10] -
      m[9] * m[2] * m[7] +
      m[9] * m[3] * m[6]
    inv[7] =
      m[0] * m[6] * m[11] -
      m[0] * m[7] * m[10] -
      m[4] * m[2] * m[11] +
      m[4] * m[3] * m[10] +
      m[8] * m[2] * m[7] -
      m[8] * m[3] * m[6]
    inv[11] =
      -m[0] * m[5] * m[11] +
      m[0] * m[7] * m[9] +
      m[4] * m[1] * m[11] -
      m[4] * m[3] * m[9] -
      m[8] * m[1] * m[7] +
      m[8] * m[3] * m[5]
    inv[15] =
      m[0] * m[5] * m[10] -
      m[0] * m[6] * m[9] -
      m[4] * m[1] * m[10] +
      m[4] * m[2] * m[9] +
      m[8] * m[1] * m[6] -
      m[8] * m[2] * m[5]

    let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12]

    if (Math.abs(det) < 1e-10) {
      throw new Error('Matrix is singular and cannot be inverted')
    }

    det = 1.0 / det

    for (let i = 0; i < 16; i++) {
      inv[i] *= det
    }

    return new Matrix(4, 4, inv)
  }

  // Extract the 3x3 rotation part from a 4x4 transformation matrix
  getRotationMatrix(): Matrix {
    if (this.rows !== 4 || this.cols !== 4) {
      throw new Error('Not a 4x4 matrix')
    }

    const rotMat = new Matrix(3, 3)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        rotMat.set(i, j, this.get(i, j))
      }
    }

    return rotMat
  }

  // Create rotation matrix for specific axes
  static rotationX(angle: number): Matrix {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return new Matrix(4, 4, [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1])
  }

  static rotationY(angle: number): Matrix {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return new Matrix(4, 4, [c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1])
  }

  static rotationZ(angle: number): Matrix {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return new Matrix(4, 4, [c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  }

  // Apply matrix to vector (assuming 4D vector for a 4x4 matrix)
  applyToVector(v: number[]): number[] {
    if (v.length !== this.cols) {
      throw new Error('Vector length must match matrix columns')
    }

    const result = new Array(this.rows).fill(0)

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result[i] += this.get(i, j) * v[j]
      }
    }

    return result
  }
}
