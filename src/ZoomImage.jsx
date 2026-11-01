import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Maximize2,X,ZoomIn,ZoomOut} from 'lucide-react';

export default function ZoomImage({src,alt,className=''}){
 const [open,setOpen]=useState(false),[zoom,setZoom]=useState(1);
 const trigger=useRef(null),dialog=useRef(null),pan=useRef(null);
 useEffect(()=>{
	if(!open)return;
	const node=dialog.current,opener=trigger.current,overflow=document.body.style.overflow;
	node.showModal();document.body.style.overflow='hidden';
	return()=>{node.close();document.body.style.overflow=overflow;if(opener?.isConnected)opener.focus({preventScroll:true});};
 },[open]);
 useLayoutEffect(()=>{
	if(!open||!pan.current)return;
	const node=pan.current;
	node.scrollLeft=(node.scrollWidth-node.clientWidth)/2;node.scrollTop=(node.scrollHeight-node.clientHeight)/2;
 },[open,zoom]);
 function close(){setOpen(false);}
 function backdrop(event){
	if(event.target!==event.currentTarget)return;
	const box=event.currentTarget.getBoundingClientRect();
	if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)close();
 }
 return <><button ref={trigger} type="button" className={'zoom-image '+className} aria-label={'Enlarge image: '+alt} onClick={()=>{setZoom(1);setOpen(true);}}><img src={src} alt={alt}/></button>{open&&createPortal(
	<dialog ref={dialog} className="image-zoom" aria-label={'Enlarged image: '+alt} onCancel={event=>{event.preventDefault();event.stopPropagation();close();}} onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();}}} onClick={backdrop}>
	 <div className="image-zoom-toolbar">
		<button type="button" className="icon-btn" aria-label="Zoom out" title="Zoom out" disabled={zoom<=1} onClick={()=>setZoom(value=>Math.max(1,value-.5))}><ZoomOut size={20}/></button>
		<output aria-label="Zoom level" aria-live="polite">{Math.round(zoom*100)}%</output>
		<button type="button" className="icon-btn" aria-label="Zoom in" title="Zoom in" disabled={zoom>=4} onClick={()=>setZoom(value=>Math.min(4,value+.5))}><ZoomIn size={20}/></button>
		<button type="button" className="icon-btn" aria-label="Fit image" title="Fit image" onClick={()=>setZoom(1)}><Maximize2 size={20}/></button>
		<button type="button" className="icon-btn image-zoom-close" aria-label="Close enlarged image" title="Close enlarged image" onClick={close} autoFocus><X size={20}/></button>
	 </div>
	 <div ref={pan} className="image-zoom-pan" tabIndex={0} aria-label="Image viewport"><div className="image-zoom-content" style={{width:zoom*100+'%',height:zoom*100+'%'}}><img className="image-zoom-media" src={src} alt={alt} draggable={false}/></div></div>
	 <p>{alt}</p>
	</dialog>,document.body)}</>;
}
