/**
 * Minimal, dependency-free GIF89a/87a decoder.
 *
 * The original game rendered animated `.gif` sprites through the DOM, which let
 * the browser play the animation for us. On a `<canvas>`, `drawImage()` only
 * paints the first frame of a GIF, so to keep every sprite animating "like now"
 * we decode the frames ourselves and play them back on a timer.
 *
 * The decoder is pure (no DOM/canvas), so it can be unit-tested in Node and the
 * frames can be turned into off-screen canvases separately (see `sprite.ts`).
 */

export interface GifFrame {
  /** Frame duration in milliseconds (already browser-clamped). */
  delayMs: number
  /** Fully composited RGBA pixels at the GIF's logical size. */
  pixels: Uint8ClampedArray
  width: number
  height: number
  index: number
}

export interface DecodedGif {
  width: number
  height: number
  /** Populated only when no `onFrame` sink is provided. */
  frames: GifFrame[]
  frameCount: number
}

type FrameSink = (frame: GifFrame) => void

/**
 * Decode a GIF from an ArrayBuffer.
 *
 * Pass `onFrame` to receive frames one at a time (e.g. to immediately downscale
 * a large animation and avoid holding every full-size frame in memory).
 */
export function decodeGif(
  buffer: ArrayBuffer,
  onFrame?: FrameSink
): DecodedGif {
  const bytes = new Uint8Array(buffer)
  let p = 0

  const readByte = (): number => bytes[p++]
  const readShort = (): number => {
    const v = bytes[p] | (bytes[p + 1] << 8)
    p += 2
    return v
  }

  // --- Header ---
  if (bytes[0] !== 0x47 || bytes[1] !== 0x49 || bytes[2] !== 0x46) {
    throw new Error('Not a GIF file')
  }
  p = 6

  // --- Logical Screen Descriptor ---
  const width = readShort()
  const height = readShort()
  const packed = readByte()
  const gctFlag = (packed & 0x80) !== 0
  const gctSize = 2 << (packed & 0x07)
  readByte() // background colour index (unused)
  readByte() // pixel aspect ratio (unused)

  let gct: Uint8Array | null = null
  if (gctFlag) {
    gct = bytes.subarray(p, p + gctSize * 3)
    p += gctSize * 3
  }

  // Composited canvas (RGBA) at the logical size, reused across frames.
  const canvas = new Uint8ClampedArray(width * height * 4)
  // Snapshot used to honour "restore to previous" (disposal method 3).
  let prevSnapshot: Uint8ClampedArray | null = null

  const frames: GifFrame[] = []
  let frameIndex = 0

  // Current Graphic Control Extension state.
  let gceDelay = 0
  let gceTransparent = -1
  let gceDisposal = 0

  // The disposal + region of the previously drawn frame, applied before the next.
  let lastDisposal = 0
  let lastRect = { x: 0, y: 0, w: 0, h: 0 }

  const skipSubBlocks = (): void => {
    let size = readByte()
    while (size !== 0) {
      p += size
      size = readByte()
    }
  }

  const readSubBlocks = (): Uint8Array => {
    // First pass: total length so we can allocate once.
    let total = 0
    let q = p
    let size = bytes[q++]
    while (size !== 0) {
      total += size
      q += size
      size = bytes[q++]
    }
    // Second pass: copy.
    const out = new Uint8Array(total)
    let o = 0
    size = bytes[p++]
    while (size !== 0) {
      out.set(bytes.subarray(p, p + size), o)
      o += size
      p += size
      size = bytes[p++]
    }
    return out
  }

  const clearRect = (rect: {
    x: number
    y: number
    w: number
    h: number
  }): void => {
    for (let r = 0; r < rect.h; r++) {
      const rowStart = ((rect.y + r) * width + rect.x) * 4
      canvas.fill(0, rowStart, rowStart + rect.w * 4)
    }
  }

  let done = false
  while (!done && p < bytes.length) {
    const block = readByte()

    if (block === 0x3b) {
      // Trailer
      done = true
    } else if (block === 0x21) {
      // Extension
      const label = readByte()
      if (label === 0xf9) {
        // Graphic Control Extension
        readByte() // block size (always 4)
        const gcePacked = readByte()
        gceDisposal = (gcePacked >> 2) & 0x07
        const hasTransparent = (gcePacked & 0x01) !== 0
        gceDelay = readShort() * 10 // 1/100s -> ms
        const transparentIndex = readByte()
        gceTransparent = hasTransparent ? transparentIndex : -1
        readByte() // block terminator
      } else {
        skipSubBlocks()
      }
    } else if (block === 0x2c) {
      // Image Descriptor
      const ix = readShort()
      const iy = readShort()
      const iw = readShort()
      const ih = readShort()
      const ipacked = readByte()
      const lctFlag = (ipacked & 0x80) !== 0
      const interlace = (ipacked & 0x40) !== 0
      const lctSize = 2 << (ipacked & 0x07)

      let colorTable = gct
      if (lctFlag) {
        colorTable = bytes.subarray(p, p + lctSize * 3)
        p += lctSize * 3
      }

      // Apply the *previous* frame's disposal before drawing this one.
      if (lastDisposal === 2) {
        clearRect(lastRect)
      } else if (lastDisposal === 3 && prevSnapshot) {
        canvas.set(prevSnapshot)
      }

      // If this frame asks to be restored afterwards, snapshot the "before" state.
      if (gceDisposal === 3) {
        prevSnapshot = canvas.slice()
      }

      // Decode the LZW-compressed indices.
      const minCodeSize = readByte()
      const lzwData = readSubBlocks()
      const indices = lzwDecode(minCodeSize, lzwData, iw * ih)

      // Composite indices onto the canvas. The index stream is consumed
      // sequentially in stored order; for interlaced frames only the *display*
      // row differs from the stored order.
      const table = colorTable as Uint8Array
      let src = 0
      if (interlace) {
        const offsets = [0, 4, 2, 1]
        const jumps = [8, 8, 4, 2]
        for (let pass = 0; pass < 4; pass++) {
          for (let row = offsets[pass]; row < ih; row += jumps[pass]) {
            src = writeRow(
              canvas,
              table,
              indices,
              src,
              iw,
              ix,
              iy + row,
              width,
              height,
              gceTransparent
            )
          }
        }
      } else {
        for (let row = 0; row < ih; row++) {
          src = writeRow(
            canvas,
            table,
            indices,
            src,
            iw,
            ix,
            iy + row,
            width,
            height,
            gceTransparent
          )
        }
      }

      const frame: GifFrame = {
        delayMs: clampDelay(gceDelay),
        pixels: canvas.slice(),
        width,
        height,
        index: frameIndex,
      }
      if (onFrame) onFrame(frame)
      else frames.push(frame)
      frameIndex++

      lastDisposal = gceDisposal
      lastRect = { x: ix, y: iy, w: iw, h: ih }

      // Reset per-frame control state.
      gceDelay = 0
      gceTransparent = -1
      gceDisposal = 0
    } else {
      // Unknown block; stop to avoid running off the rails.
      done = true
    }
  }

  return { width, height, frames, frameCount: frameIndex }
}

/**
 * Write a single decoded row of palette indices into the RGBA canvas.
 * Consumes `iw` indices from the running `src` pointer and returns the advanced
 * pointer. `y` is the destination display row.
 */
function writeRow(
  canvas: Uint8ClampedArray,
  table: Uint8Array,
  indices: Uint8Array,
  src: number,
  iw: number,
  ix: number,
  y: number,
  width: number,
  height: number,
  transparent: number
): number {
  if (y < 0 || y >= height) return src + iw
  for (let col = 0; col < iw; col++) {
    const idx = indices[src++]
    if (idx === transparent) continue
    const x = ix + col
    if (x < 0 || x >= width) continue
    const ci = idx * 3
    const dst = (y * width + x) * 4
    canvas[dst] = table[ci]
    canvas[dst + 1] = table[ci + 1]
    canvas[dst + 2] = table[ci + 2]
    canvas[dst + 3] = 255
  }
  return src
}

/**
 * Match the browser's minimum-delay behaviour: GIF delays under 20ms (and 0)
 * are treated as ~100ms. This keeps canvas playback speed identical to how the
 * same GIFs animated in the DOM.
 */
function clampDelay(delayMs: number): number {
  return delayMs < 20 ? 100 : delayMs
}

/**
 * Classic LZW decoder (Kevin Weiner style) used by most GIF libraries.
 */
function lzwDecode(
  minCodeSize: number,
  data: Uint8Array,
  npix: number
): Uint8Array {
  const NULL_CODE = -1
  const MAX_STACK_SIZE = 4096

  const pixels = new Uint8Array(npix)
  const prefix = new Int16Array(MAX_STACK_SIZE)
  const suffix = new Uint8Array(MAX_STACK_SIZE)
  const pixelStack = new Uint8Array(MAX_STACK_SIZE + 1)

  const clear = 1 << minCodeSize
  const endOfInformation = clear + 1
  let available = clear + 2
  let oldCode = NULL_CODE
  let codeSize = minCodeSize + 1
  let codeMask = (1 << codeSize) - 1

  for (let code = 0; code < clear; code++) {
    prefix[code] = 0
    suffix[code] = code
  }

  let datum = 0
  let bits = 0
  let first = 0
  let top = 0
  let pi = 0
  let bi = 0

  for (let i = 0; i < npix; ) {
    if (top === 0) {
      if (bits < codeSize) {
        if (bi >= data.length) break
        datum += (data[bi] & 0xff) << bits
        bits += 8
        bi++
        continue
      }

      let code = datum & codeMask
      datum >>= codeSize
      bits -= codeSize

      if (code > available || code === endOfInformation) break
      if (code === clear) {
        codeSize = minCodeSize + 1
        codeMask = (1 << codeSize) - 1
        available = clear + 2
        oldCode = NULL_CODE
        continue
      }
      if (oldCode === NULL_CODE) {
        pixelStack[top++] = suffix[code]
        oldCode = code
        first = code
        continue
      }

      const inCode = code
      if (code === available) {
        pixelStack[top++] = first
        code = oldCode
      }
      while (code > clear) {
        pixelStack[top++] = suffix[code]
        code = prefix[code]
      }
      first = suffix[code] & 0xff
      pixelStack[top++] = first

      if (available < MAX_STACK_SIZE) {
        prefix[available] = oldCode
        suffix[available] = first
        available++
        if ((available & codeMask) === 0 && available < MAX_STACK_SIZE) {
          codeSize++
          codeMask += available
        }
      }
      oldCode = inCode
    }

    top--
    pixels[pi++] = pixelStack[top]
    i++
  }

  for (let i = pi; i < npix; i++) pixels[i] = 0
  return pixels
}
