import { aiPcPreview } from '../projects/ai-pc-content';
import {projectPlanets,skillSpacecraft} from '../space-system.data';
import {skillObjects} from '../skill-objects';
export const projectFacts: Record<string, { what: string; role: string; deliverable: string }> = {
  "ai-pc-build-advisor": {
    what: aiPcPreview.summary,
    role: aiPcPreview.role,
    deliverable: aiPcPreview.deliverable,
  },
  "dog-behavior-camera": {
    what: "A camera-to-actuation concept calibrated through real-dog trials.",
    role: "Product design Â· computer-vision prototyping",
    deliverable: "Detection overlays and live calibration evidence",
  },
  "ai-travel-assistant": {
    what: "Trip-aware packing decisions across weight limits and item rules.",
    role: "AI product Â· mobile experience design",
    deliverable: "Interactive packing and luggage flow",
  },
  "build-hope-content-operations": {
    what: "A repeatable system for turning event media into learning.",
    role: "Product strategy consultant",
    deliverable: "Platform evaluation, operating model, and 30-day roadmap",
  },
};

export const tags=[...projectPlanets,...skillSpacecraft.map((s,i)=>({...s,title:skillObjects[i].name}))];
// Measured branch anchors in the original 1448 × 1086 artwork.
export const attachments=[{x:238,y:158,length:94},{x:338,y:125,length:167},{x:418,y:248,length:79},{x:516,y:215,length:84},{x:1008,y:248,length:90},{x:1108,y:249,length:165},{x:1202,y:176,length:156},{x:1280,y:207,length:176}];
