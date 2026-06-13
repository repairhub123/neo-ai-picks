import { chatgptVsClaude } from './chatgpt-vs-claude';
import { claudeVsGemini } from './claude-vs-gemini';
import { cursorVsWindsurf } from './cursor-vs-windsurf';
import { perplexityVsChatGPT } from './perplexity-vs-chatgpt';
import { cursorVsGithubCopilot } from './cursor-vs-github-copilot';
import { midjourneyVsFlux } from './midjourney-vs-flux';
import { runwayVsPika } from './runway-vs-pika';
import { elevenlabsVsMurf } from './elevenlabs-vs-murf';
import { jasperVsCopyAi } from './jasper-vs-copy-ai';
import { synthesiaVsHeyGen } from './synthesia-vs-heygen';
import type { PremiumComparison } from './chatgpt-vs-claude';

// Map of premium comparison slugs to their data modules
export const premiumComparisonsRegistry: Record<string, PremiumComparison> = {
  'chatgpt-vs-claude': chatgptVsClaude,
  'claude-vs-gemini': claudeVsGemini,
  'cursor-vs-windsurf': cursorVsWindsurf,
  'perplexity-vs-chatgpt': perplexityVsChatGPT,
  'cursor-vs-github-copilot': cursorVsGithubCopilot,
  'midjourney-vs-flux': midjourneyVsFlux,
  'runway-vs-pika': runwayVsPika,
  'elevenlabs-vs-murf': elevenlabsVsMurf,
  'jasper-vs-copy-ai': jasperVsCopyAi,
  'synthesia-vs-heygen': synthesiaVsHeyGen
};

export const getPremiumComparison = (id: string): PremiumComparison | undefined => {
  return premiumComparisonsRegistry[id];
};
