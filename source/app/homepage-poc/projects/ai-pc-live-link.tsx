import { aiPcLiveUrl } from './ai-pc-content';
import styles from './ai-pc-live-link.module.css';

export function AiPcLiveLink({ compact = false }: { compact?: boolean }) {
  return <a className={compact ? styles.compact : styles.primary} href={aiPcLiveUrl} target="_blank" rel="noopener noreferrer" aria-label="Try live AIPC app (opens in a new tab)">Try live app <span aria-hidden="true">↗</span></a>;
}
