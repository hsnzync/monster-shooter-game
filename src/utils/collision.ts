export class Collision {
  public static checkCollision(a: ClientRect, b: ClientRect) {
    return (
      a.left <= b.right &&
      b.left <= a.right &&
      a.top <= b.bottom &&
      b.top <= a.bottom
    )
  }
}
