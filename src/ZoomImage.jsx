import {useEffect,useRef,useState} from 'react';
export default function ZoomImage({src,alt,className=''}){
 const[open,setOpen]=useState(false),trigger=useRef(null);
 useEffect(()=>{if(!open)return;const key=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();setOpen(false);}};document.addEventListener('keydown',key,true);return()=>{document.removeEventListener('keydown',key,true);trigger.current?.focus();};},[open]);
 return <><button ref={trigger} type="button" className={'zoom-image '+className} aria-label={'Enlarge image: '+alt} onClick={()=>setOpen(true)}><img src={src} alt={alt}/></button>{open&&<div className="image-zoom" role="dialog" aria-modal="true" aria-label={'Enlarged image: '+alt}><button autoFocus className="icon-btn" aria-label="Close enlarged image" onClick={()=>setOpen(false)}>×</button><div className="image-zoom-pan"><img src={src} alt={alt}/></div><p>{alt} · Scroll or swipe to pan</p></div>}</>;
}
