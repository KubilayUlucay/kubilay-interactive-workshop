import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw, Move, X, Plus, Radio, Power } from 'lucide-react';
const MotorScene=React.lazy(()=>import('./MotorScene')); 
import CVPreview from './CVPreview';
import ZoomImage from './ZoomImage';
import PortfolioHeader from './PortfolioHeader';
import InspectionPanel,{InspectionButton} from './InspectionTemplate';
import { createSimulation } from './simulation';

const PARTS = [
 {id:'stator',n:'01',name:'Copper windings',detail:'Nine coils stay fixed in the stator. Current through the windings creates the magnetic field that drives the rotor.'},
 {id:'rotor',n:'02',name:'Magnet rotors',detail:'The rotor plates turn around the same shaft. Permanent magnets face the stator across a small air gap.'},
 {id:'housing',n:'03',name:'Bearing supports',detail:'Separate bearing carriers sit outside the rotor plates and keep the shaft aligned. This model follows the visible layout of the project CAD.'},
 {id:'shaft',n:'04',name:'Output shaft',detail:'The shared shaft transfers rotor motion to a load. The motor is powered through the ESC, commanded by the receiving Arduino.'},
];
class SceneBoundary extends React.Component {
 constructor(p){super(p);this.state={failed:false};}static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<div className="scene-fallback"><img src="/projects/motor/motor_3d.jpg" alt="Original CAD rendering of the axial-flux motor"/><p>Explore the original hardware photographs and technical case study below.</p></div>:this.props.children;}
}
export function Dialog({kind,onClose,onExhibit}) {
 const ref=useRef(),opener=useRef(document.activeElement);
 useEffect(()=>{const node=ref.current,target=opener.current;node.showModal();return()=>{node.close();queueMicrotask(()=>{if(target?.isConnected)target.focus();});};},[]);
 return <dialog ref={ref} className={'dialog '+(kind==='cv'?'cv-dialog':'')} onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose();}}>
  <div className="dialog-head"><span className="eyebrow">{kind==='motor'?'PROJECT 01 · AXIAL FLUX':kind==='projects'?'SELECTED WORK':kind==='cv'?'CURRICULUM VITAE':'ABOUT & CONTACT'}</span><button className="icon-btn" aria-label="Close panel" onClick={onClose} autoFocus><X size={22}/></button></div>
  {kind==='motor'?<>
  <h2>From CAD to copper.</h2><p className="lead">Built a hand-wound axial-flux motor with Arduino control as a shared university project.</p>
  <div className="evidence-grid"><figure><ZoomImage src="/projects/motor/motor-inside-wiring.jpeg" alt="Nine hand-wound copper coils on turquoise stator supports"/><figcaption>Hand-wound stator</figcaption></figure><figure><ZoomImage src="/projects/motor/overall-motor.jpeg" alt="Assembled axial-flux motor on a university lab bench"/><figcaption>The assembled hardware</figcaption></figure></div>
  <div className="video-row"><video controls playsInline preload="metadata" poster="/projects/motor/overall-motor.jpeg"><source src="/projects/motor/motor-preview.webm" type="video/webm"/><source src="/projects/motor/motor-video.mp4" type="video/mp4"/></video><div><h3>The lab test.</h3><p>Original footage documents the completed hand-wound motor at the bench. The interactive model explains the Arduino potentiometer controller, paired NRF24L01 modules, ESC and DC supply path.</p><a className="text-link" href="https://github.com/KubilayUlucay/website2/tree/main/public/projects/motor" target="_blank" rel="noreferrer">View project material</a></div></div>
  </>:kind==='projects'?<>
  <h2>Selected builds.</h2><p className="lead">Hardware, controls, and the software between them.</p>
   <div className="project-list">
    {[['01','Axial-flux motor','Copper windings, printed mechanics, and a working lab build.','motor/motor-inside-wiring.jpeg','motor'],['02','Battery management','PCB design, simulation, and battery balancing.','bms/kicad-schematic.png','bms'],['03','Camera gimbal','A physical stabilization prototype and its control electronics.','gimbal/stabilizer.jpeg','gimbal']].map(([n,title,desc,img,id])=><button className="project-entry" key={id} onClick={()=>{onClose();onExhibit?.(id);}}><img src={'/projects/'+img} alt={title}/><span><small>{n}</small><h3>{title}</h3><p>{desc}</p><span className="text-link">Enter the exhibit <Plus size={14}/></span></span></button>)}
  </div><a className="plain-link" href="https://kubilay-engineering.kubiulucay.chatgpt.site/" target="_blank" rel="noreferrer">Visit current portfolio</a>
  </>:kind==='cv'?<CVPreview/>:<>
  <h2>Kubilay Uluçay.</h2><p className="lead">Electrical &amp; Electronics Engineer working where mechanics, electronics and code meet.</p><p>Graduated from Özyeğin University in June 2025, with additional coursework in Computer Science. Built projects connecting hardware, sensing, controls and software.</p><p>Quality Assurance Engineer at Accenture, working on lab-equipment verification with Python and a PyTAF-based framework. Focused on R&amp;D, engineering test work and complete systems.</p><div className="about-links"><a href="mailto:kubiulucay@gmail.com">kubiulucay@gmail.com</a><a href="https://github.com/KubilayUlucay" target="_blank" rel="noreferrer">GitHub</a><a href="https://linkedin.com/in/kubilayulucay" target="_blank" rel="noreferrer">LinkedIn</a></div>
  </>}
 </dialog>;
}
export default function App({onExhibit,sharedReduced,onReducedChange}){
 const [inspection,setInspection]=useState(false),[orbit,setOrbit]=useState(false),[part,setPart]=useState('stator'),[dialog,setDialog]=useState(null),[telemetry,setTelemetry]=useState({power:0,running:false}),[resetKey,setResetKey]=useState(0),[powered,setPowered]=useState(false),[command,setCommand]=useState(55);
 const [localReduced,setLocalReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const reduced=sharedReduced??localReduced;
 const setReduced=useCallback(value=>{const next=typeof value==='function'?value(sharedReduced??localReduced):value;setLocalReduced(next);onReducedChange?.(next);},[sharedReduced,localReduced,onReducedChange]);
 const [webgl]=useState(()=>{try{const c=document.createElement('canvas');const gl=c.getContext('webgl2');if(!gl)return false;gl.getExtension('WEBGL_lose_context')?.loseContext();return true;}catch{return false;}});
 const sim=useRef(createSimulation());
 const updateTelemetry=useCallback(value=>setTelemetry(old=>old.power===value.power&&old.running===value.running?old:value),[]);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const change=e=>setReduced(e.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[setReduced]);
 const powerOff=useCallback(()=>{sim.current.powered=false;setPowered(false);},[]);
 const toggleInspection=useCallback((value)=>{if(!webgl)return;setInspection(value);sim.current.inspect=value;powerOff();setOrbit(false);},[webgl,powerOff]);
 const reset=useCallback(()=>{Object.assign(sim.current,createSimulation());setTelemetry({power:0,running:false});setPowered(false);setCommand(55);setInspection(false);setOrbit(false);setPart('stator');setResetKey(k=>k+1);},[]);
 const togglePower=useCallback(()=>{if(webgl&&!sim.current.inspect){const next=!sim.current.powered;sim.current.powered=next;setPowered(next);}},[webgl]);
 const setDriveCommand=useCallback(value=>{if(!Number.isFinite(value))return;const next=Math.max(0,Math.min(100,Math.round(value)));sim.current.command=next/100;setCommand(next);},[]);
 useEffect(()=>{
  const key=e=>{const el=e.target; if(dialog||el.isContentEditable||/INPUT|TEXTAREA|BUTTON|A|SELECT/.test(el.tagName))return;if(!e.repeat&&e.code==='Space'){e.preventDefault();togglePower();}else if(!e.repeat&&e.code==='KeyI')toggleInspection(!sim.current.inspect);else if(!e.repeat&&e.code==='KeyR')reset();};
  const hidden=()=>{if(document.hidden)powerOff();};
  window.addEventListener('keydown',key);window.addEventListener('blur',powerOff);document.addEventListener('visibilitychange',hidden);
  return()=>{window.removeEventListener('keydown',key);window.removeEventListener('blur',powerOff);document.removeEventListener('visibilitychange',hidden);};
 },[dialog,powerOff,togglePower,reset,toggleInspection]);
 useEffect(()=>{if(dialog)powerOff();},[dialog,powerOff]);
 useEffect(()=>{
  const context=document.modelContext;if(!webgl||!context?.registerTool)return;const lifecycle=new AbortController();
  Promise.resolve(context.registerTool({name:'set_motor_inspection',title:'Inspect motor',description:'Open or close the exploded motor inspection in the visible scene.',inputSchema:{type:'object',properties:{open:{type:'boolean'}},required:['open'],additionalProperties:false},annotations:{readOnlyHint:false},execute:async input=>{if(typeof input?.open!=='boolean'||Object.keys(input).some(k=>k!=='open'))throw new Error('open must be a boolean');toggleInspection(input.open);return {inspection:input.open};}},{signal:lifecycle.signal})).catch(()=>{});return()=>lifecycle.abort();
 },[toggleInspection,webgl]);
 const selected=PARTS.find(p=>p.id===part);
 return <section className={"workshop "+(reduced?"reduced":"")} aria-label="Interactive axial-flux motor">
  <a className="skip-link" href="#scene-controls" onClick={event=>{event.preventDefault();const controls=document.getElementById('scene-controls');controls?.scrollIntoView();controls?.querySelector('button')?.focus();}}>Skip to controls</a>
  <PortfolioHeader onExhibit={onExhibit} onCV={()=>setDialog('cv')} current="motor"/>
  <div className="scene" aria-label="Arduino transmitter and receiver with paired NRF24L01 modules, ESC and DC-powered motor"><SceneBoundary>{webgl?<React.Suspense fallback={<div className="scene-loading">Preparing the motor…</div>}><MotorScene sim={sim} inspection={inspection} part={part} onPart={setPart} orbit={orbit} reduced={reduced} powered={powered} command={command} suspended={Boolean(dialog)} onTelemetry={updateTelemetry} onCommand={setDriveCommand} onPower={togglePower} resetKey={resetKey}/></React.Suspense>:<div className="scene-fallback"><img src="/projects/motor/motor_3d.jpg" alt="Original CAD rendering of the axial-flux motor"/></div>}</SceneBoundary></div>
    <div className="intro exhibit-heading motor-introduction"><span className="eyebrow">{inspection?'THE WORKSHOP / 01':'01 · HAND-BUILT MOTOR'}</span><h1>{inspection?<>Motion,<br/><span>from inside.</span></>:<>Axial-flux<br/><span>motor.</span></>}</h1><p>{inspection?'Explore the copper windings, shared-axis rotors and bearing supports.':'Nine hand-wound coils, printed supports and twin magnet rotors. Arduino and NRF24L01 modules link the potentiometer to the ESC.'}</p></div>
  <div className="scene-caption"><span>AXIAL-FLUX MOTOR</span></div>
  {inspection&&<InspectionPanel parts={PARTS} selected={part} onSelect={setPart} label="Motor"/>}
  {webgl&&<div className="scene-tools"><button className={'icon-btn '+(orbit?'active':'')} aria-label={orbit?'Lock camera':'Orbit camera'} title="Orbit camera" aria-pressed={orbit} onClick={()=>setOrbit(v=>!v)}><Move size={19}/></button><button className="icon-btn" aria-label="Reset scene" title="Reset scene (R)" onClick={reset}><RotateCcw size={19}/></button><button className="motion-toggle" aria-pressed={reduced} onClick={()=>setReduced(v=>!v)}>{reduced?'Less motion':'Motion on'}</button></div>}
  <section id="scene-controls" className="control-dock" aria-label="Scene controls">
  {webgl?<div className="power"><div className="power-heading"><span className="eyebrow">DRIVE</span><strong>{String(telemetry.power).padStart(2,'0')}<small>%</small></strong></div><div className="power-track"><div style={{transform:`scaleX(${telemetry.power/100})`}}/></div><span className="power-status">{inspection?'Paused for inspection':!powered?telemetry.running?'Rotor coasting':'Supply off':telemetry.running?'Motor energized':command?'Controller starting':'Zero drive command'}</span></div>:<div className="fallback-description"><span className="eyebrow">PROJECT 01</span><span>Axial-flux motor</span></div>}
  <div className="main-controls">{!webgl?<><button className="turn-button" onClick={()=>onExhibit?.('projects/motor')}>View motor project</button><button className="inspect-button" onClick={()=>onExhibit?.('projects')}>Other projects</button></>:<><button className={'turn-button '+(powered?'turning':'')} disabled={inspection} aria-pressed={powered} onClick={togglePower}><Power size={18}/><span>{powered?'Power off':'Power on'}</span></button><InspectionButton label="motor" disabled={!webgl} selected={inspection} onClick={()=>toggleInspection(!inspection)}/></>}</div>
  {webgl&&<label className="motor-command"><span>Potentiometer command <output>{command}%</output></span><input aria-label="Motor drive command" type="range" min="0" max="100" step="1" value={command} disabled={inspection} onChange={event=>setDriveCommand(Number(event.target.value))}/></label>}
  <div className="instructions"><Radio size={15}/><span>{inspection?'Drive disconnected':powered?'NRF24L01 link active':'Receiver supply off'}<small>DC source / ESC / motor</small></span></div>
  </section>
  <footer><span>AXIAL-FLUX MOTOR</span><span className="model-note">Arduino / NRF24L01 / ESC drive / hand-wound stator</span>{webgl&&<div className="chapter-nav"><button onClick={()=>toggleInspection(false)} aria-current={!inspection?'step':undefined}>01 <span>Motion</span></button><i/><button disabled={!webgl} onClick={()=>toggleInspection(true)} aria-current={inspection?'step':undefined}>02 <span>Inside</span></button></div>}</footer>
  {dialog&&<Dialog kind={dialog} onClose={()=>setDialog(null)} onExhibit={onExhibit}/>}
 </section>;
}
