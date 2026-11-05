export const representatives = [0, 4] as const;
export const defaults = {
  birthDuration: .8, accretionDuration: 1.3, flowEntryDuration: 1.4,
  captureDuration: 2.2, arrivalStagger: .45, pullStrength: 1, orbitalDrift: 1.2,
};
export type CaptureSettings = typeof defaults;
export type Setting = keyof CaptureSettings;
export const ranges: Record<Setting, readonly [number, number]> = {
  birthDuration: [.3, 2], accretionDuration: [.5, 3.5], flowEntryDuration: [.6, 3.5],
  captureDuration: [1, 4.5], arrivalStagger: [.15, 1.2], pullStrength: [.4, 2], orbitalDrift: [0, 3],
};
export const smooth = (v: number) => { const x = Math.max(0, Math.min(1, v)); return x*x*x*(x*(x*6-15)+10); };

export function schedule(settings: CaptureSettings) {
  const accretionStart = settings.birthDuration * .625;
  const flowStart = settings.birthDuration * .75 + .4;
  const captureStart = Math.max(accretionStart + settings.accretionDuration, flowStart + settings.flowEntryDuration) + .18;
  const captures = representatives.map((index, rank) => ({
    index, start: captureStart + rank * settings.arrivalStagger,
    duration: settings.captureDuration * (rank === 0 ? .93 : 1.07),
  }));
  const end = Math.max(...captures.map(p => p.start + p.duration)) + .8;
  return { accretionStart, flowStart, captureStart, captures, end };
}

// Underdamped response: zero initial velocity, inward acceleration, one small
// overshoot and a C2 blend to the exact anchor. No positional keyframe shortcut.
export function captureResponse(progress: number, pull: number) {
  const u = Math.max(0, Math.min(1, progress));
  const frequency = 4.5 + .75 * pull, damping = 5 - .7 * pull;
  const response = 1 - Math.exp(-damping*u) * (Math.cos(frequency*u) + damping/frequency*Math.sin(frequency*u));
  return response + (1-response)*smooth((u-.80)/.20);
}

export function responseVelocity(progress: number, pull: number) {
  const a = Math.max(0, progress-.0001), b = Math.min(1, progress+.0001);
  return b > a ? (captureResponse(b,pull)-captureResponse(a,pull))/(b-a) : 0;
}

export function settingsExport(settings: CaptureSettings, material: Record<string, number>) {
  return JSON.stringify({schema:'carl-portfolio.motion-d.v1',scope:'representative-pair',objects:[0,4],timing:{...settings},material:{...material}},null,2);
}
