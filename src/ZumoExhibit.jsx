import {lazy,Suspense,useEffect,useRef,useState} from 'react';
import {Dialog} from './App';
import PortfolioHeader from './PortfolioHeader';
import {Move,Plus,RotateCcw} from 'lucide-react';
import InspectionPanel,{InspectionButton,ZUMO_PARTS} from './InspectionTemplate';
import {advanceZumo,newZumo,presets,placementReason} from './zumoSimulation';
const Scene=lazy(()=>import('./ZumoScene'));
const labels={ready:'Arrange, then calibrate.',avoid:'Obstacle ahead · stop and turn left',obstructed:'No clear exit · move a cylinder, then restart',calibrate:'Calibrating reflectance sensors',approach:'Approach · avoid IR detections',scan:'Boundary reached · counting IR pulses',return:'Return to the starting heading',retreat:'Back away from the white boundary',reposition:'Adjust for another viewpoint',done:'Ten trials complete'};
export default function ZumoExhibit({onExhibit,sharedReduced:reduced,onReducedChange}){const sim=useRef(newZumo()),[state,setState]=useState({...sim.current}),[objects,setObjects]=useState(presets.three.map(p=>[...p])),[selected,setSelected]=useState(0),[inspect,setInspect]=useState(false),[dialog,setDialog]=useState(null),[feedback,setFeedback]=useState(''),[selectedPart,setSelectedPart]=useState('zumo-robot'),[cameraOrbit,setCameraOrbit]=useState(false),[code,setCode]=useState(''),[webgl]=useState(()=>{try{const g=document.createElement('canvas').getContext('webgl2');g?.getExtension('WEBGL_lose_context')?.loseContext();return !!g;}catch{return false;}});
 const objectsRef=useRef(objects);useEffect(()=>{objectsRef.current=objects;},[objects]);
 useEffect(()=>{let frame,last=0,report=0;const tick=time=>{const dt=last?Math.min((time-last)/1000,.1):0;last=time;if(!reduced&&!dialog&&!inspect&&!document.hidden){advanceZumo(sim.current,dt,objectsRef.current);report+=dt;if(report>.1){setState({...sim.current});report=0;}}frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[reduced,dialog,inspect]);
 useEffect(()=>{if(dialog==='code'){const controller=new AbortController();fetch('/projects/zumo/firmware.ino',{signal:controller.signal}).then(r=>r.text()).then(setCode).catch(()=>{});return()=>controller.abort();}},[dialog]);
 function toggleInspection(){const next=!inspect;setInspect(next);setCameraOrbit(false);sim.current.cameraOrbit=false;sim.current.selectedPart=selectedPart;if(next)sim.current.running=false;setState({...sim.current});}
 function reset(points=objects){setCameraOrbit(false);setFeedback('');sim.current=newZumo();setState({...sim.current});setObjects(points.map(p=>[...p]));setInspect(false);setSelected(i=>Math.min(i,points.length-1));}
 function move(i,x,z){const r=Math.hypot(x,z),k=Math.min(1,2.72/r);x=+(x*k).toFixed(2);z=+(z*k).toFixed(2);sim.current.running=false;const reason=placementReason(objects,i,x,z,sim.current);setFeedback(reason||'Arrangement updated · scan reset.');if(reason){setState({...sim.current});return;}sim.current=newZumo();setState({...sim.current});setObjects(old=>old.map((p,j)=>j===i?[x,z]:p));}
 function start(){if(sim.current.phase==='obstructed'){sim.current.phase='avoid';sim.current.avoidStart=sim.current.angle;sim.current.t=0;}sim.current.running=!sim.current.running;setState({...sim.current});}
 function step(){if(sim.current.phase==='obstructed'){sim.current.phase='avoid';sim.current.avoidStart=sim.current.angle;sim.current.t=0;}sim.current.running=true;advanceZumo(sim.current,.5,objects);sim.current.running=false;setState({...sim.current});}
 return <main className={'exhibit-workshop zumo'+(inspect?' inspection-open':'')}>
  <PortfolioHeader onExhibit={onExhibit} onCV={()=>setDialog('cv')} current="zumo"/>
  <section className="exhibit-heading">
   <span className="eyebrow">04 · EE321 / EMBEDDED SYSTEMS</span>
   <h1>Find the edge.<br/><span>Count what passes.</span></h1>
   <p>A tracked robot reads a white boundary and scans with an IR object sensor. Ten viewpoints, one maximum observed count.</p>
   <button className="text-link" onClick={()=>onExhibit('projects/zumo')}>See the real build <Plus size={16}/></button>
  </section>
  <section className="zumo-theater">
   <div className="zumo-stage" tabIndex={0} aria-label="Zumo arena; drag cylinders to arrange objects. In inspection, arrow keys orbit and plus/minus zoom." onKeyDown={event=>{if(inspect&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','Home'].includes(event.key)){event.preventDefault();window.dispatchEvent(new CustomEvent('inspection-key',{detail:event.key}));}}}>
	{webgl?<Suspense fallback={<p>Preparing the arena…</p>}><Scene revision={state.total+':'+state.running} selectedPart={selectedPart} sim={sim} objects={objects} onMove={move} selected={selected} onSelect={setSelected} inspect={inspect}/></Suspense>:<img src="/projects/zumo/zumo-on-mission.png" alt="Original Zumo robot in its arena"/>}
   </div>
   {inspect&&<>
	<div className="scene-tools inspection-tools"><button className={'icon-btn '+(cameraOrbit?'active':'')} aria-label={cameraOrbit?'Disable camera orbit':'Enable camera orbit'} aria-pressed={cameraOrbit} onClick={()=>{const next=!cameraOrbit;setCameraOrbit(next);sim.current.cameraOrbit=next;setState({...sim.current});}}><Move size={18}/></button><button className="icon-btn" aria-label="Reset inspection view" onClick={()=>window.dispatchEvent(new CustomEvent('inspection-key',{detail:'Home'}))}><RotateCcw size={18}/></button></div>
	<InspectionPanel parts={ZUMO_PARTS} selected={selectedPart} onSelect={id=>setSelectedPart(id)} label="Zumo"/>
   </>}
   <aside className="zumo-status" aria-live="polite">
	<span className="eyebrow">ILLUSTRATIVE SCAN · ACCELERATED TIME</span>
	<h2>{labels[state.phase]}</h2>
	<div className="zumo-readouts"><p><strong>{state.trial}<small>/10</small></strong>completed trials</p><p><strong>{state.count}</strong>current pulses</p><p><strong>{Math.max(0,...state.counts)}</strong>maximum observed</p></div>
	<p className="sensor-state">Reflectance L / R: {state.white.map(value=>value?'WHITE':'BLACK').join(' / ')}<br/>IR: {state.ir?'object detected':'clear'}</p>
	<div className="trial-bars" aria-label={'Trial counts '+state.counts.join(', ')}>{Array.from({length:10},(_,index)=><span key={index} style={{height:12+(state.counts[index]||0)*5}} title={'Trial '+(index+1)}>{state.counts[index]??'·'}</span>)}</div>
   </aside>
  </section>
  {inspect&&<div className="exhibit-actions"><InspectionButton label="Zumo" selected onClick={toggleInspection}/></div>}
  <section className="zumo-controls" aria-label="Robot and arena controls">
   <div className="primary-controls"><button onClick={reduced?step:start} disabled={state.phase==='done'||inspect}>{reduced?'Advance scan ½ second':state.running?'Pause scan':'Calibrate / run'}</button><button onClick={()=>reset()}>Reset scan</button><InspectionButton label="Zumo" selected={inspect} onClick={toggleInspection}/><button onClick={()=>onReducedChange(!reduced)}>{reduced?'Less motion':'Motion on'}</button></div>
   <div className="arena-presets"><span className="eyebrow">ARRANGEMENTS</span>{Object.keys(presets).map(id=><button key={id} onClick={()=>reset(presets[id])}>{id==='three'?'Three objects':id==='domino'?'Six / domino':'Boundary case'}</button>)}<button className="text-link" onClick={()=>setDialog('code')}>Firmware</button></div>
   <div className="object-controls"><label>Move object<select aria-label="Selected object" value={selected} onChange={event=>setSelected(+event.target.value)}>{objects.map((object,index)=><option key={index} value={index}>Cylinder {index+1}</option>)}</select></label>{[0,1].map(axis=><label key={axis}>{axis?'Depth':'Left / right'}<input aria-label={'Object '+(axis?'depth':'horizontal position')} type="range" min="-2.72" max="2.72" step=".01" value={objects[selected]?.[axis]||0} onChange={event=>{const position=[...objects[selected]];position[axis]=+event.target.value;move(selected,...position);}}/></label>)}</div>
   <p className="placement-feedback" role="status">{feedback}</p>
  </section>
  <footer className="exhibit-footer"><span>Illustrative geometry · IR pulses are not unique-object identities</span><span>EE321 · Yunus Emre Ozan &amp; Seyit Kubilay Uluçay</span></footer>
  {dialog&&(dialog==='code'?<Code code={code} onClose={()=>setDialog(null)}/>:<Dialog kind={dialog} onClose={()=>setDialog(null)} onExhibit={onExhibit}/>)}
 </main>;
}
function Code({code,onClose}){const ref=useRef();useEffect(()=>{const el=ref.current;el.showModal();return()=>el.close();},[]);return <dialog className="dialog" ref={ref} onCancel={onClose}><div className="dialog-head"><span className="eyebrow">ORIGINAL TEAM FIRMWARE · EE321</span><button autoFocus className="icon-btn" aria-label="Close firmware" onClick={onClose}>×</button></div><h2>Boundary, scan, repeat.</h2><p>Original .ino from the final-project archive. Library implementations are not included.</p><div className="firmware-actions"><button className="text-link" onClick={()=>navigator.clipboard?.writeText(code)}>Copy firmware</button><a className="text-link" href="/projects/zumo/firmware.ino" download>Download original .ino ↓</a></div><pre className="source-code"><code>{code||'Loading firmware…'}</code></pre></dialog>;}
