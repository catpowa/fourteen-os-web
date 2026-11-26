import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calculate, initialCalc, type CalcState } from '../src/accessories/calculator';
import { appMeta, fitRect, windowReducer, type OSWindow, type WindowState } from '../src/os/model';
import { PREFIX, readLocal, writeLocal } from '../src/os/storage';

const windowOf = (id: string, rect: Partial<OSWindow> = {}): OSWindow => ({ id, app: 'notes', x: 80, y: 60, w: 580, h: 440, maximized: false, ...rect });
const empty = (): WindowState => ({ windows: [], active: null });
const calc = (...keys: string[]): CalcState => keys.reduce(calculate, { ...initialCalc });
const inside = (w: { x: number; y: number; w: number; h: number }, width: number, height: number) => {
  for (const n of [w.x, w.y, w.w, w.h]) assert.ok(Number.isFinite(n), 'geometry remains finite');
  assert.ok(w.x >= 0 && w.y >= 0, 'origin remains visible');
  assert.ok(w.w > 0 && w.h > 0, 'window has a positive size');
  assert.ok(w.x + w.w <= width && w.y + w.h <= height, 'whole window fits the workspace');
};

test('window fitting keeps title/close controls reachable across desktop, narrow and tiny viewports', () => {
  for (const [width, height] of [[1440, 820], [768, 900], [360, 650], [200, 160]]) {
    for (const r of [{ x: 1200, y: 700, w: 1160, h: 720 }, { x: -50, y: -10, w: 100, h: 90 }, { x: 0, y: 0, w: 500, h: 400 }]) {
      inside(fitRect(r, width, height), width, height);
    }
  }
});

test('damaged persisted geometry cannot place a window at NaN or Infinity', () => {
  inside(fitRect({ x: NaN, y: Infinity, w: NaN, h: -100 }, 720, 500), 720, 500);
  inside(fitRect(null as unknown as OSWindow, 360, 650), 360, 650);
});

test('focus, reopening and closing use one stable stacking order without duplicate windows', () => {
  let s = windowReducer(empty(), { type: 'open', window: windowOf('notes') });
  s = windowReducer(s, { type: 'open', window: windowOf('calculator', { app: 'calculator', x: 200 }) });
  s = windowReducer(s, { type: 'open', window: windowOf('notes', { x: 999 }) });
  assert.deepEqual(s.windows.map(w => w.id), ['calculator', 'notes']);
  assert.equal(s.windows[1].x, 80, 'reopening does not discard existing window position');
  assert.equal(s.active, 'notes');
  s = windowReducer(s, { type: 'focus', id: 'calculator' });
  assert.deepEqual(s.windows.map(w => w.id), ['notes', 'calculator']);
  s = windowReducer(s, { type: 'close', id: 'calculator' });
  assert.equal(s.active, 'notes');
  s = windowReducer(s, { type: 'close', id: 'notes' });
  assert.equal(s.active, null);
});

test('closing a background window preserves the focused app and its document payload', () => {
  const payload = { mediaId: 'portrait', title: 'Photo' };
  const s: WindowState = { windows: [windowOf('notes'), windowOf('media', { app: 'media', payload })], active: 'media' };
  const next = windowReducer(s, { type: 'close', id: 'notes' });
  assert.equal(next.active, 'media');
  assert.deepEqual(next.windows[0].payload, payload);
  assert.equal(s.windows.length, 2, 'reducer does not mutate previous state');
});

test('maximizing and restoring preserves prior window geometry', () => {
  const original = windowOf('notes');
  let s = windowReducer({ windows: [original], active: 'notes' }, { type: 'maximize', id: 'notes' });
  assert.equal(s.windows[0].maximized, true);
  s = windowReducer(s, { type: 'maximize', id: 'notes' });
  assert.equal(s.windows[0].maximized, false);
  assert.deepEqual({ x: s.windows[0].x, y: s.windows[0].y, w: s.windows[0].w, h: s.windows[0].h }, { x: 80, y: 60, w: 580, h: 440 });
});

test('restoring after a viewport shrink keeps the window within the new viewport', () => {
  let s: WindowState = { windows: [windowOf('notes', { x: 850, y: 380, w: 580, h: 440 })], active: 'notes' };
  s = windowReducer(s, { type: 'maximize', id: 'notes' });
  s = windowReducer(s, { type: 'clamp', width: 720, height: 500 });
  s = windowReducer(s, { type: 'maximize', id: 'notes' });
  inside(s.windows[0], 720, 500);
});

test('restoring clears stale restore data so later window moves can be saved', () => {
  let s: WindowState = { windows: [windowOf('notes')], active: 'notes' };
  s = windowReducer(s, { type: 'maximize', id: 'notes' });
  s = windowReducer(s, { type: 'maximize', id: 'notes' });
  s = windowReducer(s, { type: 'rect', id: 'notes', rect: { x: 120, y: 100, w: 600, h: 470 } });
  assert.equal(s.windows[0].restore, undefined, 'normal windows must not keep stale pre-maximize geometry');
});

test('show-desktop state preserves every open document', () => {
  const s: WindowState = { windows: [windowOf('notes'), windowOf('lab', { app: 'lab' })], active: 'lab' };
  const next = windowReducer(s, { type: 'showDesktop' });
  assert.equal(next.active, null);
  assert.deepEqual(next.windows, s.windows);
});

test('calculator handles four operations and floating-point rounding', () => {
  assert.equal(calc('7', '+', '5', '=').display, '12');
  assert.equal(calc('7', '−', '9', '=').display, '-2');
  assert.equal(calc('6', '×', '7', '=').display, '42');
  assert.equal(calc('8', '÷', '4', '=').display, '2');
  assert.equal(calc('0', '.', '1', '+', '0', '.', '2', '=').display, '0.3');
});

test('calculator chains operations and replaces a pending operator', () => {
  assert.equal(calc('2', '+', '3', '×', '4', '=').display, '20');
  assert.equal(calc('8', '+', '×', '2', '=').display, '16');
});

test('calculator repeated equals repeats the last completed operation', () => {
  assert.equal(calc('2', '+', '3', '=', '=', '=').display, '11');
  assert.equal(calc('8', '÷', '2', '=', '=').display, '2');
});

test('typing a new operand after a completed result starts a new calculation', () => {
  assert.equal(calc('2', '+', '3', '=', '7', '=').display, '7');
  assert.equal(calc('2', '+', '3', '=', '.', '5', '=').display, '0.5');
});

test('calculator prevents duplicate decimal points and supports sign/percentage', () => {
  assert.equal(calc('.', '5', '.', '2').display, '0.52');
  assert.equal(calc('5', '±', '×', '2', '=').display, '-10');
  assert.equal(calc('2', '5', '%').display, '0.25');
});

test('deleting the final digit of a negative number leaves a valid zero', () => {
  const s = calc('5', '±', 'Backspace');
  assert.equal(s.display, '0');
  assert.equal(calculate(s, '±').display, '0');
  assert.equal(calculate(s, '3').display, '3');
});

test('editing a formatted exponential result cannot create an invalid numeric literal', () => {
  const s = { ...initialCalc, display: '1e+20' };
  assert.equal(calculate(s, 'Backspace').display, '0');
  assert.equal(calculate(s, '.').display, '0.');
  assert.equal(calculate(s, '4').display, '4');
});

test('division by zero is explicit and typing or clearing recovers the calculator', () => {
  const error = calc('9', '÷', '0', '=');
  assert.equal(error.error, true);
  assert.equal(error.display, 'Error');
  assert.equal(calculate(error, '4').display, '4');
  assert.deepEqual(calculate(error, 'C'), initialCalc);
  assert.deepEqual(calculate(error, 'Escape'), initialCalc);
});

test('overflow cannot emit Infinity as a normal result', () => {
  const s: CalcState = { ...initialCalc, display: '1e308', stored: 1e308, operator: '×', fresh: false };
  assert.equal(calculate(s, '=').error, true);
});

test('calculator bounds typed digits and keeps clear independent of operation history', () => {
  const s = calc(...'12345678901234567890');
  assert.ok(s.display.length <= 14);
  assert.deepEqual(calc('8', '+', '2', '=', 'C'), initialCalc);
  assert.equal(calc('1', '2', 'Backspace').display, '1');
  assert.equal(calc('Backspace').display, '0');
});

test('local storage rejects unreadable data gracefully and reports quota failures', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  try {
    let value = '{bad json';
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
      getItem: (key: string) => { assert.equal(key, PREFIX + 'notes'); return value; },
      setItem: () => { throw new Error('quota exceeded'); },
    } });
    assert.deepEqual(readLocal('notes', []), []);
    assert.equal(writeLocal('notes', [{ text: 'Keep me' }]), false);
    for (const invalid of ['null', '{}', '"unexpected text"']) {
      value = invalid;
      assert.deepEqual(readLocal('notes', []), [], `unexpected root shape ${invalid}`);
    }
    value = '[{"text":"Keep me"}]';
    assert.deepEqual(readLocal('notes', []), [{ text: 'Keep me' }]);
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get: () => { throw new Error('blocked'); } });
    assert.deepEqual(readLocal('notes', []), []);
    assert.equal(writeLocal('notes', []), false);
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});

test('null or primitive settings fall back to a safe settings object', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const fallback = { lang: 'es', sound: false };
  try {
    for (const invalid of ['null', 'false', '[]', '"es"']) {
      Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => invalid } });
      assert.deepEqual(readLocal('settings', fallback), fallback);
    }
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});

test('all registered OS apps and sound states resolve to original bitmap assets', () => {
  const sprite = readFileSync(new URL('../public/icons/sprite.svg', import.meta.url), 'utf8');
  for (const icon of new Set([...Object.values(appMeta).map(a => a.icon), 'sound', 'mute'])) {
    assert.ok(sprite.includes(`id="${icon}"`), `Missing sprite symbol: ${icon}`);
    assert.ok(readFileSync(new URL(`../public/icons/${icon}.svg`, import.meta.url), 'utf8').includes('viewBox="0 0 32 32"'));
  }
});
