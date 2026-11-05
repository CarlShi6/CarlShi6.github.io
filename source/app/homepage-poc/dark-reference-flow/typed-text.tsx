import type {CSSProperties} from 'react';
import styles from './typed-text.module.css';

/** Discrete terminal-style output; retain full text for assistive technology. */
export function TypedText({text,offset,step,animate}:{text:string;offset:number;step:number;animate:boolean}){
 if(!animate)return <>{text}</>;
 return <span data-typed-text><span className={styles.srOnly}>{text}</span><span aria-hidden="true">{Array.from(text.matchAll(/\S+|\s+/g)).map((match,i)=>{
  if(/^\s+$/.test(match[0]))return match[0];
  return <span className={styles.word} key={i}>{Array.from(match[0]).map((char,j)=><span className={styles.glyph} key={j} style={{'--type-delay':`${.06+(offset+match.index+j)*step}s`,'--type-step':`${step}s`} as CSSProperties}>{char}</span>)}</span>;
 })}</span></span>;
}
