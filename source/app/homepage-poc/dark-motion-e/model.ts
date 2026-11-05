// Latest manually approved Motion D export, applied literally to E.
export const defaults = {
  birthDuration: 1.45, accretionDuration: 1.41, flowEntryDuration: 2.27,
  captureDuration: 3.25, arrivalStagger: .44, pullStrength: 1.7, orbitalDrift: 2.21,
};
// formation >= 0 overrides uFormation; -1 would follow the animated phase.
// Do not convert this approved override to a multiplier or reset it on fallback.
export const materialDefaults = { radius: .89, formation: .53, rotation: .3, flow: .35, intensity: 1 };
export type CaptureSettings = typeof defaults;
export type Setting = keyof CaptureSettings;
export const arrivalOrder = [0,4,1,5,2,6,3,7] as const;
const durationFactors = [.93,1.07,1,.96,1.05,.98,1.08,1.02];
export function schedule(settings: CaptureSettings) {
  const accretionStart = settings.birthDuration * .625;
  const flowStart = settings.birthDuration * .75 + .4;
  const captureStart = Math.max(accretionStart + settings.accretionDuration, flowStart + settings.flowEntryDuration) + .18;
  const captures = arrivalOrder.map((index, rank) => ({
    index, start: captureStart + rank * settings.arrivalStagger,
    duration: settings.captureDuration * durationFactors[rank],
  }));
  const end = Math.max(...captures.map(p => p.start + p.duration)) + .8;
  return { accretionStart, flowStart, captureStart, captures, end };
}
export function settingsExport(settings: CaptureSettings, material: Record<string, number>) {
  return JSON.stringify({schema:'carl-portfolio.motion-e.v1',scope:'all-eight',objects:[0,1,2,3,4,5,6,7],timing:{...settings},material:{...material}},null,2);
}
