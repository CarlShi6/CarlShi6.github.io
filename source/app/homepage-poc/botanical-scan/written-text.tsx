import type {CSSProperties} from 'react';
import styles from './written-text.module.css';

/** Stable word wrapping; visual ink reveal never changes the accessible text. */
export function WrittenText({text,offset,step,animate}:{text:string;offset:number;step:number;animate:boolean}){
 if(!animate)return <>{text}</>;
 return <span data-written-text><span className={styles.srOnly}>{text}</span><span aria-hidden="true">{Array.from(text.matchAll(/\S+|\s+/g)).map((match,i)=>{
  const word=match[0];
  if(/^\s+$/.test(word))return word;
  return <span className={styles.word} key={i}>{Array.from(word).map((char,j)=><span className={styles.ink} key={j} style={{'--ink-delay':`${.08+(offset+match.index+j)*step}s`} as CSSProperties}>{char}</span>)}</span>;
 })}</span></span>;
}
