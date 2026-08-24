/**
 * Runtime play-field dimensions used by {@link GameObject} for its movement
 * bounds. It intentionally defaults to zero: the DOM version derived these from
 * `<game>`/`<wall>` element sizes, which are `0` under jsdom, so leaving the
 * defaults at zero keeps the existing unit tests behaving exactly as before.
 * The engine calls {@link configureField} with the real 800x600 dimensions
 * before gameplay starts.
 */
export const Field = {
  width: 0,
  height: 0,
  /** Height of the (invisible) top "wall" band that bounds enemy spawns. */
  wallHeight: 0,
}

export function configureField(
  width: number,
  height: number,
  wallHeight: number
): void {
  Field.width = width
  Field.height = height
  Field.wallHeight = wallHeight
}
