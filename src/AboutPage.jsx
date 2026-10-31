import {useEffect,useRef,useState} from 'react';
import {motion,useMotionValue,useSpring} from 'framer-motion';
import {ArrowUpRight,Mail} from 'lucide-react';
import {Dialog} from './App';
import PortfolioHeader from './PortfolioHeader';

const builds=[
 {id:'motor',title:'Motor',detail:'Hand-wound axial flux',image:'/projects/motor/overall-motor.jpeg',alt:'The original hand-built axial-flux motor on the lab bench.'},
 {id:'gimbal',title:'Gimbal',detail:'Three-axis servo mechanism',image:'/projects/gimbal/stabilizer.jpeg',alt:'The physical three-axis gimbal with printed brackets and servos.'},
 {id:'bms',title:'BMS',detail:'Cell sensing & balancing',image:'/projects/bms/back.png',alt:'The assembled battery-management circuit and balancing components.'},
 {id:'zumo',title:'Zumo',detail:'Boundary sensing & scans',image:'/projects/zumo/zumo-on-mission.png',alt:'The original Zumo robot on its object-counting course.'}
];

const motionEase=[0.22,1,0.36,1];
function AboutBuild({build,onOpen,reduced,index}){
 const pitch=useMotionValue(0),yaw=useMotionValue(0);
 const smoothPitch=useSpring(pitch,{stiffness:260,damping:25,mass:0.8});
 const smoothYaw=useSpring(yaw,{stiffness:260,damping:25,mass:0.8});
 const [active,setActive]=useState(false);
 function reset(){pitch.set(0);yaw.set(0);setActive(false);}
 useEffect(()=>{if(reduced){pitch.jump(0);yaw.jump(0);smoothPitch.jump(0);smoothYaw.jump(0);setActive(false);}},[reduced,pitch,yaw,smoothPitch,smoothYaw]);
 function move(event){
  if(reduced||event.pointerType==='touch')return;
  const rectangle=event.currentTarget.getBoundingClientRect();
  const horizontal=Math.max(0,Math.min(1,(event.clientX-rectangle.left)/rectangle.width));
  const vertical=Math.max(0,Math.min(1,(event.clientY-rectangle.top)/rectangle.height));
  pitch.set((0.5-vertical)*8);yaw.set((horizontal-0.5)*10);setActive(true);
 }
 return <motion.a className="home-build" href={'#/'+build.id} onClick={event=>onOpen(event,build.id)} onPointerMove={move} onPointerLeave={reset} onFocus={()=>{if(!reduced)setActive(true);}} onBlur={reset} initial={reduced?false:{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:reduced?0:0.45,delay:reduced?0:0.38+index*0.07,ease:motionEase}}>
  <div className="home-photo-stage"><motion.div className="home-photo-plane" style={{rotateX:smoothPitch,rotateY:smoothYaw}} animate={{y:active&&!reduced?-4:0,scale:active&&!reduced?1.025:1}} transition={reduced?{duration:0}:{type:'spring',stiffness:260,damping:25,mass:0.8}}><img className="home-build-image" src={build.image} alt={build.alt} width="540" height="320" decoding="async"/></motion.div></div>
  <div className="home-build-copy"><div><h3>{build.title}</h3><span>{build.detail}</span></div><ArrowUpRight size={20} aria-hidden="true"/></div>
 </motion.a>;
}

export default function AboutPage({onExhibit,sharedReduced=false}){
 const [dialog,setDialog]=useState(null);
 const headingRef=useRef(null);
 useEffect(()=>{window.scrollTo(0,0);headingRef.current?.focus({preventScroll:true});},[]);
 const enter=delay=>({initial:sharedReduced?false:{opacity:0,y:14},animate:{opacity:1,y:0},transition:{duration:sharedReduced?0:0.45,delay:sharedReduced?0:delay,ease:motionEase}});
 function openExhibit(event,id){if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();onExhibit(id);}
 return <main className="about-home">
  <PortfolioHeader onExhibit={onExhibit} onCV={()=>setDialog('cv')} current="about"/>
    <div className="home-content" key={sharedReduced?'reduced':'full'}>
   <section className="home-summary" aria-labelledby="home-title">
    <span className="eyebrow">ELECTRICAL &amp; ELECTRONICS ENGINEER</span>
    <h1 className="home-name" id="home-title" ref={headingRef} tabIndex={-1}>{['Kubilay','Uluçay.'].map((name,index)=><span className={'home-name-mask home-name-line-'+index} key={name}><motion.span initial={sharedReduced?false:{y:'110%',opacity:0}} animate={{y:'0%',opacity:1}} transition={{duration:sharedReduced?0:0.65,delay:sharedReduced?0:index*0.14,ease:motionEase}}>{name}</motion.span></span>)}</h1>
    <motion.p className="home-role" {...enter(0.24)}>Test Engineer at Accenture, working with Python and PyTAF on lab-equipment verification.</motion.p>
    <motion.p className="home-bio" {...enter(0.34)}>Özyeğin University graduate, June 2025. Drawn to R&amp;D where electronics, mechanics and code meet.</motion.p>
    <motion.div className="home-actions" {...enter(0.44)}><a className="home-contact text-link" href="mailto:kubiulucay@gmail.com"><Mail size={17}/>Get in touch</a><button className="text-link" onClick={()=>setDialog('cv')}>CV <ArrowUpRight size={17}/></button></motion.div>
    <motion.div className="home-socials" {...enter(0.5)}><a href="https://github.com/KubilayUlucay" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14}/></a><a href="https://linkedin.com/in/kubilayulucay" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14}/></a></motion.div>
   </section>
   <section className="home-work" aria-labelledby="home-work-title">
    <div className="home-work-heading"><h2 id="home-work-title">The workshop</h2><button className="text-link" onClick={()=>onExhibit('projects')}>All projects <ArrowUpRight size={16}/></button></div>
    <div className="home-builds">{builds.map((build,index)=><AboutBuild key={build.id} build={build} index={index} onOpen={openExhibit} reduced={sharedReduced}/>)}</div>
   </section>
  </div>
  {dialog&&<Dialog kind={dialog} onClose={()=>setDialog(null)} onExhibit={onExhibit}/>}
 </main>;
}