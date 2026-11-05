// Literal snapshot of the approved E.6 configuration. Never normalize material overrides.
export const darkMotionE6Approved = {
  name: 'dark-motion-e6-approved',
  timing: {birthDuration:1.45,accretionDuration:1.41,flowEntryDuration:2.27,captureDuration:3.25,arrivalStagger:.44,pullStrength:1.7,orbitalDrift:2.21},
  material: {radius:.89,formation:.53,rotation:.3,flow:.35,intensity:1},
  tidal: {global:1,density:1,spread:1,turbulence:1,objects:[1,.6,.8,.9,.35,.45,.3,.4].map(intensity=>({intensity,enabled:true}))},
};
