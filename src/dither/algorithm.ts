export type Algorithm = 'floyd' | 'atkinson' | 'bayer' | 'threshold';
export type DitherOptions = {
  algorithm: Algorithm; brightness: number; contrast: number; threshold: number;
  invert: boolean; ink: string; paper: string; transparent: boolean;
};
export const DEFAULT_DITHER: DitherOptions = { algorithm: 'floyd', brightness: 0, contrast: 0, threshold: 128, invert: false, ink: '#0E1D24', paper: '#FFFFFF', transparent: false };
const bounded = (n: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(n) ? n : a));
export function parseColor(hex: string): [number, number, number] {
  if (!/^#[\da-f]{6}$/i.test(hex)) throw new Error('Invalid color');
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
/** Pure, deterministic two-color conversion. It never mutates source pixels. */
export function ditherPixels(source: Uint8ClampedArray, width: number, height: number, options: DitherOptions): Uint8ClampedArray {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width * height > 16777216 || source.length !== width * height * 4) throw new Error('Invalid dimensions');
  if (!['floyd', 'atkinson', 'bayer', 'threshold'].includes(options.algorithm)) throw new Error('Invalid algorithm');
  const dark = parseColor(options.ink), light = parseColor(options.paper);
  const brightness = bounded(options.brightness, -100, 100) * 2.55;
  const contrast = bounded(options.contrast, -100, 100) * 2.55;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  const threshold = bounded(options.threshold, 0, 255);
  const values = new Float32Array(width * height), result = new Uint8ClampedArray(source.length);
  for (let i = 0; i < values.length; i++) {
    const p = i * 4, alpha = source[p + 3] / 255;
    const luminance = (source[p] * .2126 + source[p + 1] * .7152 + source[p + 2] * .0722) * alpha + 255 * (1 - alpha);
    values[i] = bounded(factor * (luminance - 128) + 128 + brightness, 0, 255);
  }
  const diffuse = (x: number, y: number, error: number) => {
    if (x >= 0 && x < width && y >= 0 && y < height && source[(y * width + x) * 4 + 3] !== 0) values[y * width + x] += error;
  };
  for (let y = 0; y < height; y++) {
    const direction = y % 2 === 0 ? 1 : -1;
    for (let xi = 0; xi < width; xi++) {
      const x = direction === 1 ? xi : width - 1 - xi, index = y * width + x, p = index * 4;
      if (source[p + 3] === 0) continue;
      const offset = options.algorithm === 'bayer' ? ((BAYER[(y % 4) * 4 + x % 4] + .5) / 16 - .5) * 255 : 0;
      const isLight = values[index] >= threshold + offset;
      const useLight = options.invert ? !isLight : isLight;
      const color = useLight ? light : dark;
      result[p] = color[0]; result[p + 1] = color[1]; result[p + 2] = color[2];
      result[p + 3] = options.transparent && useLight ? 0 : source[p + 3];
      const error = values[index] - (isLight ? 255 : 0);
      if (options.algorithm === 'floyd') {
        diffuse(x + direction, y, error * 7 / 16); diffuse(x - direction, y + 1, error * 3 / 16);
        diffuse(x, y + 1, error * 5 / 16); diffuse(x + direction, y + 1, error / 16);
      } else if (options.algorithm === 'atkinson') {
        for (const [dx, dy] of [[direction, 0], [direction * 2, 0], [-direction, 1], [0, 1], [direction, 1], [0, 2]]) diffuse(x + dx, y + dy, error / 8);
      }
    }
  }
  return result;
}
export function outputSize(sourceWidth: number, sourceHeight: number, longestEdge: number) {
  if (!(sourceWidth > 0 && sourceHeight > 0 && Number.isFinite(sourceWidth + sourceHeight))) throw new Error('Invalid dimensions');
  const scale = Math.min(1, bounded(longestEdge, 1, 2400) / Math.max(sourceWidth, sourceHeight));
  return { width: Math.max(1, Math.round(sourceWidth * scale)), height: Math.max(1, Math.round(sourceHeight * scale)) };
}
