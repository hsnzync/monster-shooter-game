/** Anything with axis-aligned edges: a `DOMRect` or a {@link GameObject} bounds. */
export interface Rect {
  left: number
  right: number
  top: number
  bottom: number
}

export class Collision {
  public static checkCollision(a: Rect, b: Rect) {
    return (
      a.left <= b.right &&
      b.left <= a.right &&
      a.top <= b.bottom &&
      b.top <= a.bottom
    )
  }
}
