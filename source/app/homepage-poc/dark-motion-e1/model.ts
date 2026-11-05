export type AmbientMode = 'baseline' | 'living' | 'coupled';

export const ambientDefaults = {
  driftAmplitude: 4,
  driftPeriod: 18,
  surfaceRotationSpeed: .32,
  orientationVariation: 2.4,
  gravityCoupling: 1,
};

export type AmbientSettings = typeof ambientDefaults;
export type AmbientSetting = keyof AmbientSettings;

export const ambientRanges: Record<AmbientSetting, readonly [number, number]> = {
  driftAmplitude: [0, 8],
  driftPeriod: [8, 32],
  surfaceRotationSpeed: [0, 1.2],
  orientationVariation: [0, 6],
  gravityCoupling: [0, 1.5],
};

export const representativeAmbientObjects = [0, 4] as const;

export function ambientPose(index: number, seconds: number, settings: AmbientSettings) {
  const satellite = index === 4;
  const period = settings.driftPeriod * (satellite ? .78 : 1);
  const phase = satellite ? 1.73 : .28;
  const theta = seconds / period * Math.PI * 2 + phase;
  const direction = satellite ? -1 : 1;
  const x = settings.driftAmplitude * (Math.cos(theta) * (satellite ? .74 : .92) + Math.cos(theta * 2.07 + phase) * .12);
  const y = settings.driftAmplitude * (Math.sin(theta) * (satellite ? .62 : .52) + Math.sin(theta * 1.63 - phase) * .08);
  const orientation = direction * settings.orientationVariation * (.66 * Math.sin(theta * .71) + .34 * Math.sin(theta * 1.31 + phase));
  const surface = satellite ? 0 : seconds * settings.surfaceRotationSpeed;
  return { x, y, orientation, surface, theta };
}
