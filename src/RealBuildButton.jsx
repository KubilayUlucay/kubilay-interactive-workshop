import {useEffect,useRef,useState} from 'react';
import {animate,motion,useMotionValue} from 'framer-motion';
import {Plus} from 'lucide-react';

const projectNames={motor:'Axial-flux motor',gimbal:'Three-axis camera gimbal',bms:'Battery management system',zumo:'Boundary-scanning Zumo robot'};

function ProjectMark({kind,phase,reduced}){
 const angle=useMotionValue(0);
 const hovering=phase==='hover',leaving=phase==='activating';
 useEffect(()=>{
  if(reduced){angle.jump(0);return;}
  const current=angle.get();
  let playback;
  if(kind==='motor'&&(hovering||leaving))playback=animate(angle,current+(leaving?1080:360),{duration:leaving?0.95:1.6,ease:leaving?[0.4,0,1,1]:'linear',repeat:leaving?0:Infinity});
  else if((kind==='gimbal'||kind==='zumo')&&hovering)playback=animate(angle,[current,-16,16,0],{duration:2.1,ease:'easeInOut',repeat:Infinity});
  else if(kind==='gimbal'&&leaving)playback=animate(angle,current+360,{duration:0.95,ease:[0.22,1,0.36,1]});
  else playback=animate(angle,kind==='motor'?Math.round(current/360)*360:0,{duration:0.2,ease:'easeOut'});
  return()=>playback.stop();
 },[angle,kind,hovering,leaving,reduced]);
 const rotorStyle={rotate:angle,transformOrigin:kind==='motor'?'48px 43px':'48px 45px'};
 const departure=kind==='zumo'&&leaving&&!reduced?{x:[0,5,26],y:[0,-5,-40],rotate:[0,8,22],opacity:[1,1,0]}:{x:0,y:0,rotate:0,opacity:1};
 return <motion.svg className={'project-mark mark-'+kind} viewBox="0 0 96 96" fill="none" aria-hidden="true" focusable="false" animate={departure} transition={{duration:reduced?0:0.95,ease:[0.22,1,0.36,1]}}>
  {kind==='motor'&&<>
   <path className="mark-metal" d="M30 69v13h36V69M24 83h48v6H24z"/>
   <circle className="mark-sage" cx="48" cy="43" r="34"/>
   <circle className="mark-dark" cx="48" cy="43" r="29"/>
   {Array.from({length:9},(_,index)=><g key={index} transform={'rotate('+index*40+' 48 43)'}><rect className="mark-copper" x="43" y="13" width="10" height="15" rx="3"/><path className="mark-detail" d="M45 17h6m-6 3h6m-6 3h6"/></g>)}
   <motion.g className="mark-moving motor-rotor" style={rotorStyle}>
    <circle className="mark-metal" cx="48" cy="43" r="20"/>
    {Array.from({length:6},(_,index)=><path className="mark-magnet" key={index} d="M44 26h8l-1 10h-6z" transform={'rotate('+index*60+' 48 43)'}/>)}
    <circle className="mark-dark" cx="48" cy="43" r="8"/><path className="mark-line" d="M48 39v8m-4-4h8"/>
   </motion.g>
   <circle className="mark-fastener" cx="31" cy="86" r="1.5"/><circle className="mark-fastener" cx="65" cy="86" r="1.5"/>
  </>}
  {kind==='zumo'&&<motion.g className="mark-moving zumo-search" style={rotorStyle}>
   <rect className="mark-metal" x="17" y="27" width="14" height="53" rx="6"/><rect className="mark-metal" x="65" y="27" width="14" height="53" rx="6"/>
   {[35,45,55,65,73].map(position=><path className="mark-track" key={position} d={'M20 '+position+'h8m40 0h8'}/>)}
   <rect className="mark-sage" x="29" y="32" width="38" height="41" rx="5"/><path className="mark-metal" d="M29 32V21h38v11"/>
   <path className="mark-line" d="M35 43h26m-26 6h26m-26 6h15m-15 8h26"/><rect className="mark-copper" x="53" y="53" width="8" height="8" rx="1"/>
   <circle className="mark-sensor" cx="38" cy="24" r="3"/><circle className="mark-sensor" cx="58" cy="24" r="3"/>
   <motion.path className="mark-scan" d="M33 13q15-9 30 0M38 17q10-6 20 0" initial={{opacity:0}} animate={{opacity:hovering&&!reduced?0.8:0}} transition={{duration:reduced?0:0.15}}/>
  </motion.g>}
  {kind==='bms'&&<motion.g className="cell-body" animate={{y:leaving&&!reduced?[0,0,-10,0]:0}} transition={{duration:reduced?0:0.95,times:[0,0.25,0.6,1],ease:'easeOut'}}>
   <rect className="mark-metal" x="40" y="16" width="16" height="9" rx="2"/>
   <rect className="mark-dark" x="29" y="24" width="38" height="57" rx="7"/>
   <motion.rect className="cell-charge" x="35" y="31" width="26" height="43" rx="3" initial={false} style={{originX:0.5,originY:1}} animate={{scaleY:leaving?1:hovering?0.78:0.15}} transition={{duration:reduced?0:leaving?0.24:hovering?0.8:0.2,ease:'easeOut'}}/>
   <path className="mark-line" d="M43 40h10m-5-5v10M43 66h10"/>
   <path className="mark-metal" d="M34 81v5h28v-5"/>
  </motion.g>}
  {kind==='gimbal'&&<>
   <path className="mark-metal" d="M43 65v15h10V65M32 87l11-7h10l11 7z"/>
   <motion.g className="mark-moving gimbal-yaw" style={rotorStyle}>
    <path className="mark-sage" d="M22 29h6v32q0 5 5 5h30q5 0 5-5V29h6v34q0 9-11 9H33q-11 0-11-9z"/>
    <path className="mark-line" d="M28 39h9m22 0h9M48 21v6"/>
    <rect className="mark-metal" x="34" y="24" width="28" height="36" rx="4"/>
    <rect className="mark-dark" x="39" y="29" width="18" height="25" rx="2"/>
    <circle className="mark-copper" cx="48" cy="42" r="6"/><circle className="mark-dark" cx="48" cy="42" r="3"/>
    <circle className="mark-copper" cx="25" cy="39" r="4"/><circle className="mark-copper" cx="71" cy="39" r="4"/>
    <path className="mark-axis" d="M32 17q16-9 32 0m-4-5 4 5-6 1"/>
   </motion.g>
  </>}
 </motion.svg>;
}

export default function RealBuildButton({kind,reduced,onNavigate,label='See the real build'}){
 const [hovered,setHovered]=useState(false),[focused,setFocused]=useState(false),[activating,setActivating]=useState(false),[hidden,setHidden]=useState(document.hidden);
 const timer=useRef(null),pending=useRef(null);
 useEffect(()=>()=>{clearTimeout(timer.current);pending.current=null;},[]);
 useEffect(()=>{const change=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',change);return()=>document.removeEventListener('visibilitychange',change);},[]);
 useEffect(()=>{
  if(!reduced||!pending.current)return;
  clearTimeout(timer.current);
  const forward=pending.current;pending.current=null;forward();
 },[reduced]);
 function activate(){
  if(pending.current)return;
  if(reduced){onNavigate();return;}
  pending.current=onNavigate;setActivating(true);
  timer.current=setTimeout(()=>{const forward=pending.current;pending.current=null;forward?.();},1000);
 }
 const phase=activating?'activating':!hidden&&(hovered||focused)?'hover':'idle';
 return <button type="button" className="real-build-button" data-project={kind} data-phase={phase} aria-label={label==='See the real build'?label+': '+projectNames[kind]:label} aria-busy={activating||undefined} onPointerEnter={event=>{if(event.pointerType!=='touch')setHovered(true);}} onPointerLeave={()=>setHovered(false)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onClick={activate}>
  <span className="real-build-label">{label} <Plus size={16} aria-hidden="true"/></span>
  <span className="real-build-icon"><ProjectMark kind={kind} phase={phase} reduced={reduced}/></span>
 </button>;
}