export class Collision {
  public static checkCollision(a: DOMRect, b: DOMRect) {
    return (
      a.left <= b.right &&
      b.left <= a.right &&
      a.top <= b.bottom &&
      b.top <= a.bottom
    )
  }
}
