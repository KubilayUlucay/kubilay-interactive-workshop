import {useEffect,useRef,useState} from 'react';
import {motion,useMotionValue,useSpring} from 'framer-motion';
import {Github,Linkedin,Mail,Pause,Play,Sparkle} from 'lucide-react';
import {Dialog} from './App';
import PortfolioHeader from './PortfolioHeader';

const builds=[
 {id:'motor',title:'Motor',detail:'Hand-wound axial flux',word:'BUILD',context:'Hand-wound motor, completed in two months and presented in class.',image:'/projects/motor/overall-motor.jpeg',alt:'The original hand-built axial-flux motor on the lab bench.'},
 {id:'gimbal',title:'Gimbal',detail:'Three-axis servo mechanism',word:'ADAPT',context:'Phone and gyroscope readings were compared for feedback and cross-checking.',image:'/projects/gimbal/stabilizer.jpeg',alt:'The physical three-axis gimbal with printed brackets and servos.'},
 {id:'bms',title:'BMS',detail:'Cell sensing & balancing',word:'BALANCE',context:'Custom BMS hardware for cell sensing and capacitor-based active balancing.',image:'/projects/bms/back.png',alt:'The assembled battery-management circuit and balancing components.'},
 {id:'zumo',title:'Zumo',detail:'Boundary sensing & scans',word:'SCAN',context:'Boundary scans using reflectance sensing and IR object detection.',image:'/projects/zumo/zumo-on-mission.png',alt:'The original Zumo robot on its object-counting course.'}
];

const employerSparkles=[
 {left:'2%',top:'16%',size:5,duration:'3.4s',delay:'-1.1s'},
 {left:'14%',top:'1%',size:3.5,duration:'2.9s',delay:'-.6s'},
 {left:'29%',top:'9%',size:4.25,duration:'4.1s',delay:'-2.7s'},
 {left:'44%',top:'0%',size:5,duration:'3.7s',delay:'-1.9s'},
 {left:'66%',top:'7%',size:3.5,duration:'3.2s',delay:'-2.3s'},
 {left:'87%',top:'5%',size:4.25,duration:'4.3s',delay:'-1.5s'},
 {left:'8%',top:'86%',size:3.5,duration:'3.9s',delay:'-2.8s'},
 {left:'24%',top:'94%',size:5,duration:'3.1s',delay:'-.8s'},
 {left:'42%',top:'88%',size:4.25,duration:'4.4s',delay:'-2.1s'},
 {left:'61%',top:'94%',size:3.5,duration:'3.6s',delay:'-1.4s'},
 {left:'79%',top:'87%',size:5,duration:'4s',delay:'-3.1s'},
 {left:'96%',top:'77%',size:4.25,duration:'3.3s',delay:'-.4s'},
 {left:'7%',top:'48%',size:3.5,duration:'2.7s',delay:'-1.6s'},
 {left:'20%',top:'8%',size:4.25,duration:'3.6s',delay:'-3s'},
 {left:'35%',top:'0%',size:3.5,duration:'2.8s',delay:'-1.1s'},
 {left:'55%',top:'4%',size:4.25,duration:'3.3s',delay:'-2.6s'},
 {left:'76%',top:'0%',size:3.5,duration:'3.8s',delay:'-1.8s'},
 {left:'95%',top:'31%',size:4.25,duration:'2.9s',delay:'-2.2s'},
 {left:'1%',top:'69%',size:4.25,duration:'3.5s',delay:'-2.4s'},
 {left:'17%',top:'91%',size:3.5,duration:'2.6s',delay:'-.8s'},
 {left:'34%',top:'78%',size:4.25,duration:'3.7s',delay:'-3.1s'},
 {left:'52%',top:'90%',size:3.5,duration:'3.2s',delay:'-1.4s'},
 {left:'70%',top:'91%',size:4.25,duration:'2.8s',delay:'-1.9s'},
 {left:'88%',top:'91%',size:3.5,duration:'3.4s',delay:'-.5s'}
];

const motionEase=[0.22,1,0.36,1];
function AllProjectsButton({onOpen,reduced}){
 const [hovered,setHovered]=useState(false),[focused,setFocused]=useState(false);
 const active=hovered||focused;
 const expanded=active||reduced;
 return <button type="button" className="home-all-projects" data-preview={expanded?'grid':'stack'} onClick={onOpen} onPointerEnter={event=>{if(event.pointerType!=='touch')setHovered(true);}} onPointerLeave={()=>setHovered(false)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}>
  <span className="home-catalog-mark" aria-hidden="true">{builds.map((build,index)=>{
   const grid={x:(index%2)*36,y:Math.floor(index/2)*22,rotate:0,opacity:1};
   const stack={x:index*12,y:[9,7,9,11][index],rotate:[-18,-7,7,18][index],opacity:0.72+index*0.08};
   return <motion.span className="home-catalog-tile" key={build.id} initial={false} animate={expanded?grid:stack} transition={reduced?{duration:0}:{type:'spring',stiffness:280,damping:24,mass:0.7,delay:active?index*0.035:0}} style={{zIndex:index+1}}><img src={build.image} alt="" width="30" height="18" decoding="async"/></motion.span>;
  })}</span>
  <span className="home-catalog-label">All projects</span>
 </button>;
}

function AboutBuild({build,onOpen,onSelect,selected,reduced,index}){
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
 return <motion.a className="home-build" data-selected={selected?'true':undefined} href={'#/'+build.id} onClick={event=>onOpen(event,build.id)} onPointerEnter={()=>onSelect(build.id)} onPointerMove={move} onPointerLeave={reset} onFocus={()=>{onSelect(build.id);if(!reduced)setActive(true);}} onBlur={reset} initial={reduced?false:{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:reduced?0:0.45,delay:reduced?0:0.38+index*0.07,ease:motionEase}}>
  <div className="home-photo-stage"><motion.div className="home-photo-plane" style={{rotateX:smoothPitch,rotateY:smoothYaw}} animate={{y:active&&!reduced?-4:0,scale:active&&!reduced?1.025:1}} transition={reduced?{duration:0}:{type:'spring',stiffness:260,damping:25,mass:0.8}}><img className="home-build-image" src={build.image} alt={build.alt} width="540" height="320" decoding="async"/></motion.div></div>
  <div className="home-build-copy"><div><h3>{build.title}</h3><span>{build.detail}</span></div></div>
 </motion.a>;
}

export default function AboutPage({onExhibit,sharedReduced=false}){
 const [dialog,setDialog]=useState(null);
 const [sparklesPaused,setSparklesPaused]=useState(false);
 const [selected,setSelected]=useState('motor');
 const selectedBuild=builds.find(build=>build.id===selected);
 const headingRef=useRef(null);
 useEffect(()=>{window.scrollTo(0,0);headingRef.current?.focus({preventScroll:true});},[]);
 const enter=delay=>({initial:sharedReduced?false:{opacity:0,y:14},animate:{opacity:1,y:0},transition:{duration:sharedReduced?0:0.45,delay:sharedReduced?0:delay,ease:motionEase}});
 function openExhibit(event,id){if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();onExhibit(id);}
 return <main className="about-home home-with-kinetics">
  <PortfolioHeader onExhibit={onExhibit} onCV={()=>setDialog('cv')} current="about"/>
    <div className="home-content" key={sharedReduced?'reduced':'full'}>
   <section className="home-summary" aria-labelledby="home-title">
    <span className="eyebrow">ELECTRICAL &amp; ELECTRONICS ENGINEER</span>
    <h1 className="home-name" id="home-title" ref={headingRef} tabIndex={-1}>{['Kubilay','Uluçay.'].map((name,index)=><span className={'home-name-mask home-name-line-'+index} key={name}><motion.span initial={sharedReduced?false:{y:'110%',opacity:0}} animate={{y:'0%',opacity:1}} transition={{duration:sharedReduced?0:0.65,delay:sharedReduced?0:index*0.14,ease:motionEase}}>{name}</motion.span></span>)}</h1>
    <motion.p className="home-role" {...enter(0.24)}>Quality Assurance Engineer @ <span className="home-employer" data-sparkles={sparklesPaused?'paused':'running'}>Accenture<span className="home-employer-sparkles" aria-hidden="true">{employerSparkles.map((sparkle,index)=><Sparkle className="home-employer-sparkle" key={index} size={sparkle.size} style={{'--sparkle-left':sparkle.left,'--sparkle-top':sparkle.top,'--sparkle-duration':sparkle.duration,'--sparkle-delay':sparkle.delay}}/>)}</span></span>.</motion.p>
    <motion.p className="home-bio home-verification" {...enter(0.29)}>Develop Python/Gherkin verification tests for clinical-laboratory automation, run existing pipelines and investigate test and product issues.</motion.p>
    <motion.p className="home-bio" {...enter(0.34)}>Özyeğin University graduate, June 2025. Love to work where electronics, mechanics and code meet.</motion.p>
    <motion.div className="home-actions" {...enter(0.44)}><a className="home-contact text-link" href="mailto:kubiulucay@gmail.com"><Mail size={17}/>Get in touch</a><button className="text-link" onClick={()=>setDialog('cv')}>CV</button></motion.div>
    <motion.div className="home-socials" {...enter(0.5)}><a href="https://github.com/KubilayUlucay" target="_blank" rel="noreferrer"><Github size={17} aria-hidden="true"/>GitHub</a><a href="https://linkedin.com/in/kubilayulucay" target="_blank" rel="noreferrer"><Linkedin size={17} aria-hidden="true"/>LinkedIn</a>{!sharedReduced&&<button type="button" className="home-sparkle-toggle" aria-label={sparklesPaused?'Resume Accenture sparkles':'Pause Accenture sparkles'} title={sparklesPaused?'Resume Accenture sparkles':'Pause Accenture sparkles'} aria-pressed={sparklesPaused} onClick={()=>setSparklesPaused(value=>!value)}>{sparklesPaused?<Play size={13} aria-hidden="true"/>:<Pause size={13} aria-hidden="true"/>}</button>}</motion.div>
   </section>
   <section className="home-work" aria-labelledby="home-work-title">
    <div className="home-work-heading home-kinetic-heading"><AllProjectsButton onOpen={()=>onExhibit('projects')} reduced={sharedReduced}/></div>
    <h2 className="home-keyword" id="home-work-title"><motion.span key={selectedBuild.word+'-'+sharedReduced} initial={sharedReduced?false:{y:'105%',opacity:0}} animate={{y:'0%',opacity:1}} transition={{duration:sharedReduced?0:0.32,ease:motionEase}}>{selectedBuild.word}</motion.span></h2>
    <p className="home-keyword-context">{selectedBuild.context}</p>
    <div className="home-builds">{builds.map((build,index)=><AboutBuild key={build.id} build={build} index={index} onOpen={openExhibit} onSelect={setSelected} selected={selected===build.id} reduced={sharedReduced}/>)}</div>
   </section>
  </div>
  {dialog&&<Dialog kind={dialog} onClose={()=>setDialog(null)} onExhibit={onExhibit}/>}
 </main>;
}