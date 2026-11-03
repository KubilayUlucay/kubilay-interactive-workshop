import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,X} from 'lucide-react';
import {Dialog} from './App';
import projects from './projectCatalog.json';
import projectEvidence from './projectEvidence.json';
import ZoomImage from './ZoomImage';
import PortfolioHeader from './PortfolioHeader';
import RealBuildButton from './RealBuildButton';
const categories=['All',...new Set(projects.map(project=>project.category))];
const featuredMedia={
 bms:{src:'/projects/bms/back.png',alt:'The assembled BMS board and its capacitor-balancing components.'},
 motor:{src:'/projects/motor/overall-motor.jpeg',alt:'The hand-built axial-flux motor and its test setup on the lab bench.'},
 gimbal:{src:'/projects/gimbal/stabilizer.jpeg',alt:'The physical three-axis gimbal with printed brackets, servos and exposed electronics.'},
 zumo:{src:'/projects/zumo/zumo-on-mission.png',alt:'The Zumo robot on the original object-counting course.'}
};
function ProjectIndex({filtered,query,category,setQuery,setCategory,onExhibit}){
 const groups=[
  {id:'builds',title:'Selected builds',items:Object.keys(featuredMedia).map(id=>filtered.find(project=>project.id===id)).filter(Boolean)},
  {id:'studies',title:'Studies & software',items:filtered.filter(project=>!project.exhibit&&!project.id.endsWith('-labs')&&project.category!=='Experience')},
  {id:'labs',title:'Laboratory work',items:filtered.filter(project=>project.id.endsWith('-labs'))},
  {id:'experience',title:'R&D experience',items:filtered.filter(project=>project.category==='Experience')}
 ];
 function openProject(event,id){if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();onExhibit('projects/'+id);}
 function clearFilters(){setQuery('');setCategory('All');}
 return <section className="catalog catalog-curated">
  <span className="eyebrow">HARDWARE / CONTROL / CODE</span>
  <h1 className="catalog-title" tabIndex={-1}>Engineering<br/><span>projects.</span></h1>
  <p className="lead">Motors, battery systems and controls. Built hardware, simulation studies and recorded bench work.</p>
  <div className="catalog-search">
   <label htmlFor="project-search">Find a project<input id="project-search" type="search" placeholder="Arduino, energy, MATLAB..." value={query} onChange={event=>setQuery(event.target.value)}/></label>
   <label>Area<select aria-label="Project area" value={category} onChange={event=>setCategory(event.target.value)}>{categories.map(area=><option key={area}>{area}</option>)}</select></label>
  </div>
  <div className="catalog-results"><p className="catalog-count" role="status" aria-live="polite">{filtered.length} {filtered.length===1?'project':'projects'}{category!=='All'?' · '+category:''}</p>{(query||category!=='All')&&<button className="icon-btn" type="button" title="Clear filters" aria-label="Clear filters" onClick={clearFilters}><X size={18}/></button>}</div>
  {groups.filter(group=>group.items.length).map(group=><section className={'catalog-group catalog-group-'+group.id} key={group.id} aria-labelledby={'group-'+group.id}>
   <div className="catalog-group-heading"><h2 id={'group-'+group.id}>{group.title}</h2><span>{String(group.items.length).padStart(2,'0')}</span></div>
   {group.id==='builds'?<div className="selected-projects">{group.items.map((project,index)=><article className="selected-project" key={project.id}>
    <a className="selected-project-link" href={'#/projects/'+project.id} onClick={event=>openProject(event,project.id)}>
     <img className="selected-project-image" src={featuredMedia[project.id].src} alt={featuredMedia[project.id].alt} width="660" height="440" loading={index===0?'eager':'lazy'} decoding="async"/>
     <div className="selected-project-copy"><span className="eyebrow">{project.course}</span><h3>{project.title}<ArrowUpRight size={24} aria-hidden="true"/></h3><span className="project-kind">{project.kind}</span><p>{project.summary}</p><span className="project-topics">{project.topics.join(' / ')}</span></div>
    </a>
   </article>)}</div>:<div className="catalog-list">{group.items.map((project,index)=><a className="catalog-row" key={project.id} href={'#/projects/'+project.id} onClick={event=>openProject(event,project.id)}><span className="catalog-number">{String(index+1).padStart(2,'0')}</span><div><span className="eyebrow">{project.course} · {project.kind}</span><h3>{project.title}</h3><p>{project.summary}</p></div><ArrowUpRight className="row-arrow" size={20} aria-hidden="true"/></a>)}</div>}
  </section>)}
  {!filtered.length&&<div className="catalog-empty"><p>No matching projects.</p><button className="text-link" onClick={clearFilters}>Clear filters <X size={16}/></button></div>}
  <div className="catalog-end"><a href="mailto:kubiulucay@gmail.com">kubiulucay@gmail.com</a><span>Kubilay Uluçay</span></div>
 </section>;
}
function Illustration({project}){const [value,setValue]=useState(45);const rc=project.id==='circuit-labs'||project.id==='mechatronics-labs',software=project.category==='Software'||project.category==='Embedded';return <section className="project-diagram"><span className="eyebrow">{rc?'TRY A CONCEPT':'THE WORKFLOW'} · EXPLANATORY</span><svg viewBox="0 0 600 170" role="img" aria-label={rc?'Illustrative RC charge curve':software?'Input, processing and output workflow':'Design, observation and evaluation workflow'}>{rc?<><path d="M35 15 V140 H580" fill="none" stroke="#5f7467"/><path d={Array.from({length:80},(_,i)=>`${i?'L':'M'}${35+i*6.8},${140-110*(1-Math.exp(-i/(5+value/4)))}`).join(' ')} fill="none" stroke="#d9b289" strokeWidth="3"/><text x="48" y="30" fill="#b4c2b5">capacitor voltage</text></>:<>{(software?['INPUT','PROCESS','OBSERVE']:['DESIGN','TEST','EVALUATE']).map((s,i)=><g key={s}><rect x={15+i*200} y="45" width="170" height="75" rx="8" fill="#27372e" stroke="#6a8471"/><text x={100+i*200} y="89" fill="#d9c5ab" fontSize="15" textAnchor="middle">{s}</text>{i<2&&<path d={`M${185+i*200} 82 h30 m-9 -5 l9 5 -9 5`} fill="none" stroke="#c3a07b"/>}</g>)}</>}</svg>{rc&&<><label>Relative time constant <input aria-label="Relative time constant" type="range" min="1" max="100" value={value} onChange={e=>setValue(+e.target.value)}/></label><p>A larger RC time constant slows the rise. This dimensionless teaching curve is not a recorded oscilloscope trace.</p></>}</section>;}
function ProjectPhotos({photos,label,primary=false,exhibit,onExhibit,reduced}){
 return <>
  {exhibit&&<RealBuildButton kind={exhibit} reduced={reduced} label={'Open '+(exhibit==='bms'?'BMS':exhibit[0].toUpperCase()+exhibit.slice(1))+' exhibit'} onNavigate={()=>onExhibit(exhibit)}/>}
  <section className={'motor-photo-grid'+(primary?' case-evidence':'')} aria-label={label}>{photos.map(([src,alt,caption])=><figure key={src}><ZoomImage src={src} alt={alt}/><figcaption><strong>{caption}</strong><span>{alt}</span></figcaption></figure>)}</section>
 </>;
}
function MotorProjectDetail({onExhibit,reduced}){
 const photos=[
  ['/projects/motor/motor-inside-wiring.jpeg','Nine hand-wound copper coils seated on the stator supports.','Stator windings'],
  ['/projects/motor/overall-motor.jpeg','The motor assembly and test setup on the lab bench.','Prototype at the bench'],
  ['/projects/motor/controller-nano.jpeg','Archived Nano/perfboard photograph; this does not document the ESP32 wireless controller described here.','Archived controller photograph']
 ];
 return <article className="case-study motor-case">
  <button className="text-link" onClick={()=>onExhibit('projects')}>← All projects</button>
  <span className="eyebrow">UNIVERSITY BUILD / AXIAL-FLUX MOTOR</span>
  <h1 className="catalog-title" tabIndex={-1}>An axial-flux motor,<br/><span>built by hand.</span></h1>
  <p className="lead">A hand-wound stator, printed supports and a shared-axis rotor assembly, documented through the original build photographs and lab footage.</p>
  <p>I implemented the transmitter, receiver and Arduino code. Tuna created the motor CAD, and we shared the winding and assembly.</p>
  <p>We used a radio link to send potentiometer commands to the motor-side Arduino and ESC. The recorded bench test shows the completed motor running.</p>
  <ProjectPhotos photos={photos.slice(0,2)} label="Original motor hardware" primary exhibit="motor" onExhibit={onExhibit} reduced={reduced}/>
  <section className="motor-explanation" aria-label="Motor project details">
   <div><h2>How it is arranged</h2><p>The stationary stator carries nine hand-wound coils. Two rotor plates turn together on a common shaft, with their magnets facing the stator across an axial air gap. Printed supports hold the assembly in alignment.</p></div>
  <div><h2>Wireless ESP32 control</h2><p>A potentiometer on the handheld copper-board controller provides the speed command to its ESP32. That command travels wirelessly to a second ESP32 on the motor side, which controls the ESC. The DC source powers the motor through the ESC; the handheld controller has no wired connection to that source or motor. The exhibit represents this owner-described arrangement, not the original firmware timing or measured RPM. No motor rating or measured efficiency is claimed here.</p></div>
  </section>
  <ProjectPhotos photos={photos.slice(2)} label="Archived controller material"/>
  <section className="motor-video-section" aria-labelledby="motor-video-title"><div><span className="eyebrow">ORIGINAL PROJECT FOOTAGE</span><h2 id="motor-video-title">A look at the lab test.</h2><p>Recorded footage from the original project repository. It documents the physical motor in the lab; it does not establish a performance rating or measured efficiency.</p></div><video controls playsInline preload="metadata" poster="/projects/motor/overall-motor.jpeg"><source src="/projects/motor/motor-preview.webm" type="video/webm"/><source src="/projects/motor/motor-video.mp4" type="video/mp4"/><p>Your browser does not support embedded video. Use the browser’s media controls or try another format.</p></video></section>
  <p className="motor-attribution">Project and original media: Kubilay Uluçay. Interactive motor scene is an illustrative explanation built around the real project.</p>
 </article>;
}
function GimbalProjectDetail({onExhibit,reduced}){
 const photos=[
  ['/projects/gimbal/cad-design.png','CAD layout of nested gimbal brackets and the payload tray.','Mechanical layout · CAD'],
  ['/projects/gimbal/stabilizer.jpeg','Built three-axis gimbal prototype with printed brackets, servo motors and exposed electronics.','Three-axis prototype'],
  ['/projects/gimbal/gimball-side.jpeg','Side view of the modified printed brackets, servo joints and connecting leads.','Bracket and servo assembly'],
  ['/projects/gimbal/phone-data.jpeg','A phone mounted in the gimbal with gyroscope traces visible on screen.','Phone gyroscope workaround']
 ];
 return <article className="case-study motor-case gimbal-case">
  <button className="text-link" onClick={()=>onExhibit('projects')}>← All projects</button>
  <span className="eyebrow">MECHATRONICS / THREE-AXIS CAMERA GIMBAL</span>
  <h1 className="catalog-title" tabIndex={-1}>A three-axis gimbal,<br/><span>built around a workaround.</span></h1>
  <p className="lead">A servo-driven camera support built from modified sourced mechanics. When the inertial sensor proved unreliable, the team used a phone gyroscope to continue observing the rig’s motion.</p>
  <p>I wrote most of the Arduino code. Tuna adapted the CAD, and we assembled and integrated the three-axis mechanism together.</p>
  <p>We compared phone gyroscope readings with the onboard sensor while observing the servo response. The photographs and mounted-phone traces record that setup.</p>
  <ProjectPhotos photos={photos.slice(1,2)} label="Original gimbal prototype" primary exhibit="gimbal" onExhibit={onExhibit} reduced={reduced}/>
  <section className="motor-explanation" aria-label="Gimbal project details">
   <div><h2>How the mechanism is arranged</h2><p>Three nested servo axes carry the phone or camera payload. Each bracket supports the next moving stage, so the motors can tilt the payload around separate axes while the outer frame is held or moved. The mechanical design began from an existing model and was modified for the project build.</p></div>
   <div><h2>Sensing and the build challenge</h2><p>The planned inertial measurement unit did not provide dependable readings. The team instead used a phone’s gyroscope and recorded its data while working with the physical prototype. The available comparison was not time-synchronized, so it documents the sensing workaround rather than a measured stabilization result.</p></div>
  </section>
  <ProjectPhotos photos={[photos[0],...photos.slice(2)]} label="Original gimbal CAD, assembly and sensing evidence"/>
  <p className="motor-attribution">Original project CAD and photographs from the Gimbal build. The interactive exhibit is an explanatory model of the nested-axis mechanism.</p>
 </article>;
}
const BMS_REPORTS={
 ee401:{...projectEvidence['bms-research'],label:'Senior Project 1 · Research (EE401)',description:'Fall 2024 · Research and proposal report.',download:'Senior-Project-1-Research-EE401.pdf'},
 ee402:{label:'Senior Project 2 · Implementation (EE402)',description:'Spring 2025 · Build and implementation report.',src:'/projects/bms/SeniorYearProject2.pdf',download:'Senior-Project-2-Implementation-EE402.pdf'}
};
function BMSProjectDetail({onExhibit,reduced}){
 const [selectedReport,setSelectedReport]=useState('ee402');
 const [reportRevision,setReportRevision]=useState(0);
 const [ee401Viewer,setEe401Viewer]=useState({url:null,loading:false,error:null});
 const report=BMS_REPORTS[selectedReport];
 useEffect(()=>{
  if(selectedReport!=='ee401')return;
  let active=true,objectUrl=null;
  setEe401Viewer({url:null,loading:true,error:null});
  (async()=>{
   try{
    const buffers=await Promise.all(BMS_REPORTS.ee401.parts.map(async path=>{const response=await fetch(path);if(!response.ok)throw new Error('PDF segment request failed');return response.arrayBuffer();}));
    const size=buffers.reduce((sum,buffer)=>sum+buffer.byteLength,0);
    const prefix=new Uint8Array(buffers[0]).subarray(0,4);
    if(size!==BMS_REPORTS.ee401.size||String.fromCharCode(...prefix)!=='%PDF')throw new Error('PDF segments failed size/header verification');
    const file=new Blob(buffers,{type:'application/pdf'});
    const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer())),value=>value.toString(16).padStart(2,'0')).join('');
    if(hash!==BMS_REPORTS.ee401.sha256)throw new Error('PDF segments failed SHA-256 verification');
    objectUrl=URL.createObjectURL(file);
    if(!active){URL.revokeObjectURL(objectUrl);return;}
    setEe401Viewer({url:objectUrl,loading:false,error:null});
   }catch{if(active)setEe401Viewer({url:null,loading:false,error:'The research report could not be assembled. Please try selecting it again.'});}
  })();
  return()=>{active=false;if(objectUrl)URL.revokeObjectURL(objectUrl);};
 },[selectedReport,reportRevision]);
 const reportUrl=selectedReport==='ee401'?ee401Viewer.url:report.src;
 const photos=[
  ['/projects/bms/back.png','Assembled copper BMS circuit with the capacitor balancing and switching components.','Main circuit · assembled board'],
  ['/projects/bms/front.png','STM32F407 Discovery board mounted beneath the main BMS circuit board.','Controller underside · STM32F407'],
  ['/projects/bms/schematic.png','PCB routing layout with the STM32F407 Discovery footprint and measurement and switching connections.','PCB layout · routing'],
  ['/projects/bms/pcb.png','Electrical schematic linking the four series cells, sensing paths, balancing switches and controller.','Electrical schematic'],
  ['/projects/bms/simulink.png','MATLAB/Simulink model of cell sensing, capacitor switching, controller logic and load paths.','Balancing model · Simulink'],
  ['/projects/bms/balancing.png','Cell-voltage traces from the charging simulation as the control algorithm cycles the transfer network.','Balancing response · simulation']
 ];
 return <article className="case-study motor-case bms-case">
  <button className="text-link" onClick={()=>onExhibit('projects')}>← All projects</button>
  <span className="eyebrow">EE401 / EE402 · BATTERY MANAGEMENT</span>
  <h1 className="catalog-title" tabIndex={-1}>A battery manager,<br/><span>built around cell balance.</span></h1>
  <p className="lead">A four-cell lithium-ion BMS prototype pairs a custom circuit board with an STM32F407 Discovery controller, sensing paths, a protection switch and capacitor-based active balancing.</p>
  <p>I developed most of the BMS and ran all MATLAB/Simulink simulations. Atahan produced the PCB drawings, and we built the sensing and switched-capacitor hardware around an STM32 controller.</p>
  <p>I simulated charge transfer between neighboring cells and recorded the cell-voltage response. The board photographs and EE402 report document fabrication and controller integration; the balancing traces are simulation results.</p>
  <ProjectPhotos photos={photos.slice(0,2)} label="Original BMS circuit and controller" primary exhibit="bms" onExhibit={onExhibit} reduced={reduced}/>
  <section className="motor-explanation" aria-label="BMS project details">
   <div><h2>From cell readings to control</h2><p>The series cell taps feed voltage-divider measurement paths to the controller. An INA333 amplifier conditions the shunt signal for current measurement; temperature sensors add a thermal input. The STM32F407 reads these signals and runs the balancing logic, which selects one adjacent cell pair at a time and commands the switching network.</p></div>
   <div><h2>Moving charge and protecting the pack</h2><p>Three transfer capacitors work with the switches: a selected capacitor charges from the higher-voltage cell, then connects to its lower-voltage neighbor. Repeating those steps moves charge across the pack. A BD135 low-side switch provides the documented safety disconnect path. The physical board photos show the STM32 controller mounted underneath the main circuit.</p></div>
  </section>
  <section className="motor-explanation bms-results" aria-label="Build and simulation results">
   <div><h2>Build and implementation · EE402</h2><p>The EE402 report documents the fabricated PCB, assembled electronics and firmware adapted to the STM32 board. It records successful balancing in MATLAB/Simulink during charge and discharge scenarios. Those traces are simulation results; long-duration reliability testing of the physical setup remained future work.</p></div>
   <div><h2>Part 1 · Research &amp; proposal · EE401</h2><p>This report frames the research and proposed system direction. Its goals are proposal targets; the later EE402 report records implementation and simulation work.</p></div>
  </section>
  <ProjectPhotos photos={photos.slice(2)} label="Original BMS schematic, layout and simulation"/>
  <section className="bms-report-section" aria-labelledby="bms-report-title">
   <span className="eyebrow">ORIGINAL PROJECT REPORTS</span>
   <div className="bms-report-switcher" role="group" aria-label="Choose BMS report">{Object.entries(BMS_REPORTS).map(([id,item])=><button key={id} type="button" aria-pressed={selectedReport===id} onClick={()=>{setSelectedReport(id);setEe401Viewer({url:null,loading:id==='ee401',error:null});setReportRevision(n=>n+1);}}>{item.label}</button>)}</div>
   <div className="bms-report-heading"><div><span className="eyebrow">SELECTED REPORT</span><h2 id="bms-report-title">{report.label}</h2><p>{report.description}</p></div><div className="bms-report-links">{reportUrl?<><a className="text-link" href={reportUrl} target="_blank" rel="noreferrer">Open selected PDF ↗</a><a className="text-link" href={reportUrl} download={report.download}>Download selected PDF ↓</a></>:<span className="bms-report-loading" role={ee401Viewer.error?'alert':'status'}>{ee401Viewer.error||'Preparing report…'}</span>}</div></div>
   <div className="bms-pdf-frame">{reportUrl?<iframe key={reportUrl} src={reportUrl+'#view=FitH'} title={report.label+' PDF'} loading="lazy"/>:<div className="bms-pdf-loading" role={ee401Viewer.error?'alert':'status'}>{ee401Viewer.error||'Preparing report…'}</div>}</div>
  </section>
  <p className="motor-attribution">BMS board, schematic and simulation material from the EE402 report. Simulation traces describe modeled behavior; they are not physical test measurements.</p>
 </article>;
}
function ZumoProjectDetail({onExhibit,reduced}){
 const photos=[['/projects/zumo/zumo-on-mission.png','The Zumo robot on the competition course during an object-counting run.','On-course run · original project photo'],['/projects/zumo/zumo-on-black-surface.png','Zumo chassis positioned on the dark course surface near the white boundary.','Robot and course surface · original project photo']];
 const [code,setCode]=useState(''),[copied,setCopied]=useState(false);
 useEffect(()=>{let active=true;fetch('/projects/zumo/firmware.ino').then(r=>{if(!r.ok)throw new Error();return r.text();}).then(t=>{if(active)setCode(t);}).catch(()=>{if(active)setCode('Firmware text is unavailable.');});return()=>{active=false;};},[]);
 async function copyCode(){try{await navigator.clipboard.writeText(code);setCopied(true);setTimeout(()=>setCopied(false),1800);}catch{setCopied(false);}}
 return <article className="case-study motor-case zumo-case"><button className="text-link" onClick={()=>onExhibit('projects')}>← All projects</button><span className="eyebrow">EE321 · ZUMO OBJECT-COUNTING ROBOT</span><h1 className="catalog-title" tabIndex={-1}>A line-following robot,<br/><span>working the boundary.</span></h1><p className="lead">A Zumo robot combined reflectance sensing with an infrared object sensor to traverse a dark course, respond to its white boundary and record object detections across repeated scans.</p>
  <p>I implemented most of the navigation, counting logic and integration in our team with Yunus Emre Ozan. We calibrated the reflectance array for the white boundary and used the IR sensor for detections.</p>
  <p>We recorded detections across repeated scans and reported the largest observed count through the LED and buzzer. The course photographs, report and firmware document the runs and counting logic.</p>
  <ProjectPhotos photos={photos} label="Original Zumo project photographs" primary exhibit="zumo" onExhibit={onExhibit} reduced={reduced}/>
  <div className="bms-report-links"><a className="text-link" href="/projects/zumo/report-excerpt.pdf" target="_blank" rel="noreferrer">Report excerpt ↗</a><a className="text-link" href="https://www.youtube.com/watch?v=27th-UQyDgE" target="_blank" rel="noreferrer">Original presentation ↗</a></div>
  <section className="motor-explanation" aria-label="Zumo project details"><div><h2>Sensing and boundary response</h2><p>The six-channel reflectance array was calibrated before each run and used to distinguish the dark course surface from the white perimeter. While the infrared sensor detected an object, the firmware turned left until the sensor cleared; otherwise it advanced while the surface remained dark. At the boundary, the left or right sensor group determined the turn direction for a scan.</p></div><div><h2>Scanning and the reported count</h2><p>During each boundary scan, the infrared sensor incremented a count with a short debounce delay. The program stored one count per trial, repeated this process ten times, and reported the largest observed count. That maximum is not a map of distinct object positions. The report illustrates five successful detections and one boundary-related failure; these examples are not a statistical accuracy estimate.</p></div></section>
  <section className="motor-explanation" aria-label="Original build and interactive exhibit"><div><h2>Original hardware</h2><p>The project used a Zumo chassis, reflectance sensor array, infrared sensing, motor control, an indicator LED and buzzer. The original firmware includes calibration, boundary-group checks, object-count debounce and a final LED/buzzer indication.</p></div><div><h2>Interactive scene</h2><p>The workshop scene is a current explanatory simulation of boundary following and collision avoidance. It is separate from the original EE321 hardware run and does not change or replace the report’s trial observations.</p></div></section>
  <section className="bms-report-section" aria-labelledby="zumo-report-title"><span className="eyebrow">ORIGINAL PROJECT REPORT</span><div className="bms-report-heading"><div><span className="eyebrow">EE321 · FINAL REPORT</span><h2 id="zumo-report-title">Zumo robot project report</h2><p>Original team report · Kubilay Ulucay and Yunus Emre Ozan</p></div><div className="bms-report-links"><a className="text-link" href="/projects/zumo/zumo-report.pdf" target="_blank" rel="noreferrer">Open report ↗</a><a className="text-link" href="/projects/zumo/zumo-report.pdf" download="EE321-Zumo-Project-Report.pdf">Download report ↓</a></div></div><div className="bms-pdf-frame"><iframe src="/projects/zumo/zumo-report.pdf#view=FitH" title="EE321 Zumo project report PDF" loading="lazy"/></div></section>
  <section className="bms-report-section zumo-firmware" aria-labelledby="zumo-code-title"><span className="eyebrow">ORIGINAL TEAM FIRMWARE</span><div className="bms-report-heading"><div><h2 id="zumo-code-title">Zumo counting firmware</h2><p>Team source file · code shown in-page for inspection.</p></div><div className="bms-report-links"><button className="text-link" type="button" onClick={copyCode} disabled={!code||code.startsWith('Firmware text is unavailable')}>{copied?'Copied':'Copy code'}</button><a className="text-link" href="/projects/zumo/firmware.ino" download="EE321-Zumo-Team-Firmware.ino">Download firmware ↓</a></div></div><pre className="zumo-code-viewer"><code>{code||'Loading original firmware…'}</code></pre></section><p className="motor-attribution">Original Zumo photographs, report and firmware document the EE321 team project. Team credit: Kubilay Ulucay and Yunus Emre Ozan.</p></article>;
}
function PowerToolProjectDetail({onExhibit}){
 const [code,setCode]=useState(''),[copied,setCopied]=useState(false);
 useEffect(()=>{let active=true;fetch('/projects/coursework/dispatch-excerpt.txt').then(r=>{if(!r.ok)throw new Error();return r.text();}).then(t=>{if(active)setCode(t);}).catch(()=>{if(active)setCode('Dispatch excerpt is unavailable.');});return()=>{active=false;};},[]);
 async function copyCode(){try{await navigator.clipboard.writeText(code);setCopied(true);setTimeout(()=>setCopied(false),1800);}catch{setCopied(false);}}
 return <article className="case-study motor-case power-tool-case"><button className="text-link" onClick={()=>onExhibit('projects')}>← All projects</button><span className="eyebrow">EE303 · MATLAB APP DESIGNER</span><h1 className="catalog-title" tabIndex={-1}>Power flow &amp;<br/><span>economic dispatch.</span></h1><p className="lead">A MATLAB App Designer submission that presents a four-bus network view and a three-generator economic-dispatch model in one interface.</p>
  <p>I built the App Designer interface and implemented the three-generator dispatch calculation. The callback solves equal-marginal-cost equations with demand balance, then calculates each generator's output and quadratic cost.</p>
  <p>I connected the network inputs, demand and branch-flow fields in the same interface. The original screenshot and callback excerpt show the application and calculation.</p>
  <section className="motor-explanation" aria-label="Power model details"><div><h2>Power-flow view</h2><p>The original interface depicts buses 1–4, three generator controls, line coefficients, and a demand input at bus 4. The result fields are labeled P12, P13, P14, P23, and P24. They present the modeled line-flow outputs for the selected network settings; the screenshot is an original application capture, not a new runtime result.</p></div><div><h2>Economic-dispatch calculation</h2><p>The available callback excerpt reads each generator’s α, β, and γ cost coefficients and the bus-4 demand. It forms the equal-incremental-cost equations βᵢ + 2γᵢPᵢ = λ together with P₁ + P₂ + P₃ = demand, solves the resulting linear system, then evaluates each quadratic cost Cᵢ = αᵢ + βᵢPᵢ + γᵢPᵢ². The excerpt uses an explicit matrix inverse. It does not show generator output bounds or transmission-loss constraints.</p></div></section>
  <section className="motor-explanation" aria-label="Model scope"><div><h2>Inputs and outputs</h2><p>Generator selections and parameter fields, network coefficients, and demand are the visible inputs. The interface shows branch-flow fields in Power Flow mode; the dispatch callback computes three generator outputs, the shared λ value, and their quadratic costs.</p></div><div><h2>Model context</h2><p>This is an educational MATLAB model based on fixed network coefficients. The cached project material does not establish validation against a physical grid or an operational planning use.</p></div></section>
  <section className="motor-photo-grid" aria-label="Original MATLAB App Designer screenshot"><figure><ZoomImage src="/projects/coursework/power-tool.png" alt="Original MATLAB App Designer screenshot showing a four-bus network, generator and demand inputs, power-flow result fields, and a Calculate control."/><figcaption><strong>Original App Designer interface</strong><span>Power Flow mode · four-bus network and displayed input/result fields</span></figcaption></figure></section>
  <section className="bms-report-section power-code" aria-labelledby="power-code-title"><span className="eyebrow">AVAILABLE SOURCE EXCERPT</span><div className="bms-report-heading"><div><h2 id="power-code-title">Economic-dispatch callback excerpt</h2><p>This excerpt shows the equal-marginal-cost system and quadratic-cost calculation; it is not the full MATLAB project.</p></div><div className="bms-report-links"><button className="text-link" type="button" onClick={copyCode} disabled={!code||code.startsWith('Dispatch excerpt is unavailable')}>{copied?'Copied':'Copy excerpt'}</button><a className="text-link" href="/projects/coursework/dispatch-excerpt.txt" download="EE303-economic-dispatch-callback-excerpt.txt">Download excerpt ↓</a></div></div><pre className="project-code-viewer"><code>{code||'Loading callback excerpt…'}</code></pre></section>
  <p className="motor-attribution">The cached EE303 package contains this interface screenshot and callback excerpt. A full report, full MATLAB project bundle, and video are not present in the available project files.</p></article>;
}
function PVDesignProjectDetail({onExhibit}){
 const report='/projects/coursework/pv-excerpt.pdf';
 return <article className="case-study motor-case pv-design-case"><button className="text-link" onClick={()=>onExhibit('projects')}>← All projects</button><span className="eyebrow">EE473–573 · 2025 · PVsyst DESIGN STUDY</span><h1 className="catalog-title" tabIndex={-1}>Off-grid residential<br/><span>PV design.</span></h1><p className="lead">A 2025 academic sizing and feasibility study for a standalone home system in Kocaeli, modeled in PVsyst with battery storage.</p>
  <p>I completed most of the sizing and PVsyst work in this study with Mehmet Fatih Karaosman. We sized the system around winter demand and three days of autonomy.</p>
  <p>Using the May 2025 estimates, we calculated approximately 389,000 TL upfront against 6,240 TL in annual grid spending: about 62 years of simple payback before maintenance, battery replacement and financing. At those prices, grid electricity was the cheaper option where available.</p>
  <section className="motor-explanation" aria-label="PV design details"><div><h2>Array and load assumptions</h2><p>The report models a household load of about 250 kWh per month, or 3,044.1 kWh per year. Its proposed array uses eight CW Enerji 580 W modules: 4.64 kW total, arranged as two parallel strings of four modules, on a fixed plane tilted 40° due south.</p></div><div><h2>Storage and system path</h2><p>The standalone design targets three days of autonomy and describes 38.3 kWh of battery storage, with a 48 V battery system and one Victron SmartSolar MPPT 250/70 controller. The report’s cost table separately lists four 10.24 kWh nominal battery units; those two capacity figures are not identical, so both remain attributed to their source sections.</p></div></section>
  <section className="motor-explanation" aria-label="Simulation and feasibility results"><div><h2>PVsyst annual simulation</h2><p>Using PVsyst 8.0.9 and Meteonorm 8.2 weather data for Kocaeli, the report gives 6,539.0 kWh available from the array, 3,043.3 kWh supplied to the modeled user load, 0.8 kWh unmet, and 3,313.2 kWh unused. These are simulation outputs, not measurements from installed equipment.</p></div><div><h2>Feasibility at the study’s 2025 assumptions</h2><p>The May 2025 cost estimate is about 389,000 TL. Compared with the report’s assumed 520 TL monthly grid bill, its simple payback calculation is roughly 62 years and concludes that the standalone battery system is not financially competitive where grid access is available. The historic estimate is not a current price quote.</p></div></section>
  <section className="motor-photo-grid pv-photo-grid" aria-label="Original PV design figure"><figure><ZoomImage src="/projects/coursework/pv-hourly-load-profile.png" alt="Original PVsyst load-profile figure showing the household daily energy-use table and hourly distribution used in the design study."/><figcaption><strong>Modeled household load profile</strong><span>Original figure from the report extract · daily energy table and hourly use distribution</span></figcaption></figure></section>
  <section className="bms-report-section pv-report" aria-labelledby="pv-report-title"><span className="eyebrow">AVAILABLE PROJECT REPORT MATERIAL</span><div className="bms-report-heading"><div><h2 id="pv-report-title">PV design report extract</h2><p>Six selected pages from the 2025 study, including system design, simulation results, and feasibility estimates.</p></div><div className="bms-report-links"><a className="text-link" href={report} target="_blank" rel="noreferrer">Open report extract ↗</a><a className="text-link" href={report} download="EE473-573-PV-Design-Report-Extract.pdf">Download report extract ↓</a></div></div><div className="bms-pdf-frame"><iframe src={report+'#view=FitH'} title="EE473–573 PV design report extract PDF" loading="lazy"/></div></section>
  <p className="motor-attribution">Study authors: Seyit Kubilay Uluçay and Mehmet Fatih Karaosman. The cached project files contain this six-page report extract and its original load-profile figure; the complete report and PVsyst project file are not present.</p></article>;
}
function WindStudyProjectDetail({onExhibit}){
 const reports=[
  {id:'analysis',label:'Analysis report · 10 pages',title:'Wind-farm analysis report',description:'Original 10-page EE101 report covering the problem, configuration comparison and study conclusion.',src:'/projects/powerworld/101-analysis.pdf',download:'EE101-Wind-Farm-Analysis-Report.pdf'},
  {id:'experiments',label:'Experiments · 29 pages',title:'All experiments and explanations',description:'Original 29-page companion documenting the 27 PowerWorld configurations and their individual explanations.',src:'/projects/powerworld/101-experiments.pdf',download:'EE101-Wind-Farm-Experiments-and-Explanations.pdf'},
  {id:'excerpt',label:'Analysis excerpt · 9 pages',title:'Wind-farm analysis excerpt',description:'The previously available nine-page analysis extract, retained alongside the complete report.',src:'/projects/coursework/wind-excerpt.pdf',download:'EE101-Wind-Farm-Analysis-Excerpt.pdf'}
 ];
 const [selectedReport,setSelectedReport]=useState('analysis');
 const report=reports.find(item=>item.id===selectedReport);
 return <article className="case-study motor-case wind-study-case"><button className="text-link" onClick={()=>onExhibit('projects')}>← All projects</button><span className="eyebrow">EE101 · 2022 · POWERWORLD STUDY</span><h1 className="catalog-title" tabIndex={-1}>Wind-farm interconnection<br/><span>trade-offs.</span></h1><p className="lead">A PowerWorld study comparing ways to connect a hypothetical 200 MW wind farm to an existing network, with 27 configurations assessed for cost, losses and loading limits.</p>
  <p>I compared 27 PowerWorld configurations and recommended CONDOR links to PETE and PAI. Only two configurations were feasible in the study; Experiment 9 gave the preferred loading, loss and estimated five-year cost trade-off.</p>
  <p>The model showed both CONDOR links at about 91% loading and 20.11 MW total system losses. I used loading feasibility and estimated cost alongside losses to make the recommendation.</p>
  <section className="motor-explanation" aria-label="Wind-farm interconnection study details"><div><h2>The interconnection problem</h2><p>The wind farm is modeled as a new generation source within a wider electrical network. Its connection changes the power carried by existing branches, so the study considers conductor and substation choices alongside network loading and system losses.</p></div><div><h2>Comparing 27 configurations</h2><p>The analysis compares the feasibility and cost of 27 educational model configurations. Overload constraints narrow the available choices; a low-loss case is not automatically the preferred connection if its loading or construction cost makes it unsuitable.</p></div></section>
  <section className="motor-photo-grid" aria-label="Original PowerWorld wind-farm model"><figure><ZoomImage src="/projects/powerworld/WindTurbineExp.png" alt="Original PowerWorld network capture showing a 200 MW wind generator, bus voltages, branch-loading meters and 20.11 MW of displayed system losses."/><figcaption><strong>PowerWorld interconnection model</strong><span>Original simulated operating case · 200 MW wind injection and 20.11 MW displayed system losses</span></figcaption></figure></section>
  <section className="bms-report-section wind-report" aria-labelledby="wind-report-title"><span className="eyebrow">ORIGINAL PROJECT DOCUMENTS</span><div className="bms-report-switcher" role="group" aria-label="Choose wind-study document">{reports.map(item=><button key={item.id} type="button" aria-pressed={selectedReport===item.id} onClick={()=>setSelectedReport(item.id)}>{item.label}</button>)}</div><div className="bms-report-heading"><div><h2 id="wind-report-title">{report.title}</h2><p>{report.description}</p></div><div className="bms-report-links"><a className="text-link" href={report.src} target="_blank" rel="noreferrer">Open selected PDF ↗</a><a className="text-link" href={report.src} download={report.download}>Download selected PDF ↓</a></div></div><div className="bms-pdf-frame"><iframe key={report.id} src={report.src+'#view=FitH'} title={report.title+' PDF'} loading="lazy"/></div></section>
  <p className="motor-attribution">EE101 educational study by Kubilay Uluçay. Original PowerWorld model capture, analysis report and companion experiment document; the shorter analysis excerpt is also available.</p></article>;
}

function PLCSequencesProjectDetail({onExhibit}){
 const report={title:'EE392 team project report',description:'Original 11-page report covering both control scenarios, their HMIs and the team\'s test observations.',src:'/projects/plc/EE392.pdf',download:'EE392-Team-Project-Report.pdf'};
 return <article className="case-study motor-case plc-sequences-case"><button className="text-link" onClick={()=>onExhibit('projects')}>← All projects</button><span className="eyebrow">EE392 · INDUSTRIAL AUTOMATION · TEAM PROJECT</span><h1 className="catalog-title" tabIndex={-1}>PLC sequences<br/><span>&amp; operator HMIs.</span></h1><p className="lead">A shared EE392 team project exploring two classroom control scenarios in Control Expert: a traffic-light sequencer with after-hours operation and a timed claw game with an operator HMI.</p>
  <p>I mainly developed and checked the control logic within the team. We used explicit states and timers to connect operator inputs to the traffic-light modes and claw sequence.</p>
  <p>We inspected mode changes, HMI states and internal counters in Control Expert simulation. The report records those operating states and observations.</p>
  <section className="motor-explanation" aria-label="Traffic-light controller design"><div><h2>Traffic-light sequencing</h2><p>The original state diagrams describe two light groups, L1–L3 and L2–L4. Timer conditions move each group through red, yellow, green and flashing-green states. The design includes start/stop transitions and a reset path back to an initial state with the light outputs off.</p></div><div><h2>Normal and after-hours modes</h2><p>Normal operation follows the timed light sequence. A separate After Hours input selects a mode in which the yellow lights flash at 1 Hz. The report describes these as distinct operating states, with commands and transition conditions controlling the change between them.</p></div></section>
  <section className="motor-explanation" aria-label="Traffic-light interface and testing"><div><h2>Traffic-light HMI</h2><p>The HMI presents Start, Stop and After Hours controls, eight traffic-light graphics and a system-running indicator. An animation table exposes the program variables during simulation so the team can inspect the selected states and output signals.</p></div><div><h2>Traffic-light test observations</h2><p>The traffic-light observations record failed transitions out of after-hours mode and a test where all lights came on during a 120-second green interval. A real-time clock and L1/L2 sensor-based automation were unfinished.</p></div></section>
  <section className="motor-photo-grid" aria-label="Original traffic-light state diagrams"><figure><ZoomImage src="/projects/plc/plc.jpg" alt="Original state-transition diagrams for traffic-light groups L1–L3 and L2–L4, showing timed light states, start/stop/reset paths and after-hours states."/><figcaption><strong>Traffic-light state-transition diagrams</strong><span>Original team report figure · groups L1–L3 and L2–L4, with timer and mode-change transitions</span></figcaption></figure></section>
  <section className="motor-explanation" aria-label="Toy-claw controller design"><div><h2>A timed claw-game sequence</h2><p>A coin input activates the game and reveals the HMI's directional controls. The player has 90 seconds to position the claw with press-and-hold joystick buttons. A start input then triggers the programmed gripper sequence.</p></div><div><h2>Gripper cycle and HMI</h2><p>The reported cycle opens the gripper, lowers the claw, closes the gripper, raises the claw and opens it again. The HMI shows the remaining time, motion-direction indicators and win/game-over messages; the planned sequence ends by deactivating the game controls.</p></div></section>
  <section className="motor-explanation" aria-label="Toy-claw testing and project scope"><div><h2>Claw-game test observations</h2><p>The team reported that the countdown could not be reused for another round and that the last-win value did not display as a proper date. Games and wins were tracked in internal variables rather than displayed on the HMI.</p></div><div><h2>Shared coursework scope</h2><p>Both scenarios are software/simulation work documented in the same EE392 report. They illustrate PLC sequencing, operator interfaces and debugging; a physical claw-machine build and a validated roadside controller are not established by the project material.</p></div></section>
  <section className="bms-report-section plc-sequences-report" aria-labelledby="plc-report-title"><span className="eyebrow">ORIGINAL TEAM REPORT</span><div className="bms-report-heading"><div><h2 id="plc-report-title">{report.title}</h2><p>{report.description}</p></div><div className="bms-report-links"><a className="text-link" href={report.src} target="_blank" rel="noreferrer">Open report ↗</a><a className="text-link" href={report.src} download={report.download}>Download report ↓</a></div></div><div className="bms-pdf-frame"><iframe src={report.src+'#view=FitH'} title={report.title+' PDF'} loading="lazy"/></div></section>
  <p className="motor-attribution">Team project and original material: Berke Çeçen, Efe Can Özhan, Genco Güven and Kubilay Uluçay. One shared EE392 report covers both control scenarios.</p></article>;
}


function CompleteReport({report,title,summary,id}){
 const [loaded,setLoaded]=useState({report:null,url:null,error:null});
 const [revision,setRevision]=useState(0);
 useEffect(()=>{
  if(report.src)return;
  const controller=new AbortController();
  let active=true,objectUrl=null;
  setLoaded({report,url:null,error:null});
  (async()=>{
   try{
    const buffers=await Promise.all(report.parts.map(async path=>{const response=await fetch(path,{signal:controller.signal});if(!response.ok)throw new Error();return response.arrayBuffer();}));
    const size=buffers.reduce((total,buffer)=>total+buffer.byteLength,0);
    if(size!==report.size)throw new Error();
    const bytes=new Uint8Array(size);let offset=0;
    for(const buffer of buffers){bytes.set(new Uint8Array(buffer),offset);offset+=buffer.byteLength;}
    const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),value=>value.toString(16).padStart(2,'0')).join('');
    if(hash!==report.sha256||String.fromCharCode(...bytes.subarray(0,4))!=='%PDF')throw new Error();
    objectUrl=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
    if(!active){URL.revokeObjectURL(objectUrl);return;}
    setLoaded({report,url:objectUrl,error:null});
   }catch{if(active)setLoaded({report,url:null,error:'The report could not be loaded. Please try again.'});}
  })();
  return()=>{active=false;controller.abort();if(objectUrl)URL.revokeObjectURL(objectUrl);};
 },[report,revision]);
 const url=report.src||(loaded.report===report?loaded.url:null);
 const error=loaded.report===report?loaded.error:null;
 const selectedPages=Array.isArray(report.sourcePages);
 const documentLabel=selectedPages?'Selected report pages':'Complete report';
 return <div className="complete-report" data-report-pages={report.pages}>
  <div className="bms-report-heading"><div><h2 id={id}>{title}</h2><p className="selected-report-summary">{summary}</p><p>{documentLabel} · {report.pages} pages{selectedPages&&<> · Original pp. {report.sourcePages.join(', ')}</>}</p></div><div className="bms-report-links">{url?<><a className="text-link" href={url} target="_blank" rel="noreferrer">{selectedPages?'Open selected pages':'Open complete report'}</a><a className="text-link" href={url} download={id+'.pdf'}>{selectedPages?'Download selected pages':'Download complete report'}</a></>:error?<button className="text-link" onClick={()=>setRevision(value=>value+1)}>Retry report</button>:<span role="status">Preparing report…</span>}</div></div>
  <div className="bms-pdf-frame">{url?<iframe key={url} src={url+'#view=FitH'} title={title+' '+documentLabel.toLowerCase()+' PDF'} loading="lazy"/>:<div className="bms-pdf-loading" role={error?'alert':'status'}>{error||'Preparing report…'}</div>}</div>
 </div>;
}
const ELECTRONICS_LABS=[
 {id:'lab01',title:'Bench measurements & diode curves',summary:'I used a DC supply, breadboard and multimeter to measure node and resistor voltages, calculate current from resistance and record diode I–V curves.'}
];
function ElectronicsLabsProjectDetail({onExhibit}){
 const [selectedLabId,setSelectedLabId]=useState('lab01');
 const report=ELECTRONICS_LABS.find(item=>item.id===selectedLabId);
 const fullReport=projectEvidence['electronics-labs'][selectedLabId];
 return <article className="case-study motor-case electronics-labs-case"><button className="text-link" onClick={()=>onExhibit('projects')}>All projects</button><span className="eyebrow">EE301 · SELECTED BENCH WORK · FALL 2023</span><h1 className="catalog-title" tabIndex={-1}>Bench measurements<br/><span>&amp; diode curves.</span></h1><p className="lead">Selected bench records show breadboard connections, DC measurements with a multimeter and diode current–voltage observations.</p>
  <p>I wired the circuits and used the DC supply and multimeter to record node and resistor voltages. I calculated current from the voltage across a known resistor and compared the recorded curves for different diode types.</p>

  <section className="motor-photo-grid" aria-label="Selected original lab figures">{ELECTRONICS_LABS.map(item=>{const figure=projectEvidence['electronics-labs'][item.id].figures[0];return <figure key={item.id}><ZoomImage src={figure.src} alt={figure.description}/><figcaption><strong>{figure.caption}</strong><span>{figure.description}</span><small>Original report · p. {figure.page}</small></figcaption></figure>;})}</section>
  <section id="electronics-reports" className="bms-report-section electronics-reports" aria-labelledby="electronics-report-title"><span className="eyebrow">SELECTED ORIGINAL LAB PAGES</span><div className="catalog-search"><label htmlFor="electronics-lab-select">Experiment<select id="electronics-lab-select" aria-label="Choose electronics experiment" value={selectedLabId} onChange={event=>setSelectedLabId(event.target.value)}>{ELECTRONICS_LABS.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label></div><CompleteReport report={fullReport} title={report.title} summary={report.summary} id="electronics-report-title"/></section>
  <p className="motor-attribution">Selected original EE301 bench records by Seyit Kubilay Uluçay, Fall 2023. Source-page references identify the original submission; these excerpts are not new measurements.</p></article>;
}
const MECHATRONICS_GROUPS=['Sensing & timing','Microcontroller communication','Motor response'];
const MECHATRONICS_LABS=[
 {id:'lab02',group:0,title:'Analog inputs & reflectance sensing',summary:'Selected voltage-readout and CNY70 pages show Arduino analog inputs, the sensor wiring and the observed LED response to a nearby surface.'},
 {id:'lab03',group:0,title:'Timing circuit & oscilloscope waveform',summary:'The NE555 bench setup is paired with an original oscilloscope capture, connecting the wired oscillator with its recorded timing signal.'},
 {id:'lab06',group:1,title:'Arduino I²C link & LED control',summary:'Two Arduino boards send a button state over I²C to control an LED. The original pages show the addressing, physical link and edited course examples.'},
 {id:'lab09',group:2,title:'Proportional motor-position response',summary:'Recorded responses compare proportional gains of 10, 20 and 40. The selected pages distinguish these observations from the later full-PID extension, which the report says was not tested.'}
];
function MechatronicsLabsProjectDetail({onExhibit}){
 const [selectedLabId,setSelectedLabId]=useState('lab02');
 const report=MECHATRONICS_LABS.find(item=>item.id===selectedLabId);
 const fullReport=projectEvidence['mechatronics-labs'][selectedLabId];
 return <article className="case-study motor-case mechatronics-labs-case"><button className="text-link" onClick={()=>onExhibit('projects')}>All projects</button><span className="eyebrow">ME417 · SELECTED LAB WORK · 2024</span><h1 className="catalog-title" tabIndex={-1}>Sensors, timing<br/><span>&amp; motor response.</span></h1><p className="lead">Four selected studies connect analog sensing, timing waveforms, two-board communication and observed motor-position response.</p>
  <p>I wired and documented the sensing and timing setups, then adapted the course examples for communication between two Arduino boards. I recorded the sensor response, oscillator waveform and I²C behavior, and compared the motor-position readings at different proportional gains.</p>

  <section className="motor-photo-grid" aria-label="Selected original lab figures">{MECHATRONICS_LABS.map(item=>{const figure=projectEvidence['mechatronics-labs'][item.id].figures[0];return <figure key={item.id}><ZoomImage src={figure.src} alt={figure.description}/><figcaption><strong>{figure.caption}</strong><span>{figure.description}</span><small>Original report · p. {figure.page}</small></figcaption></figure>;})}</section>
  <section id="mechatronics-reports" className="bms-report-section mechatronics-reports" aria-labelledby="mechatronics-report-title"><span className="eyebrow">SELECTED ORIGINAL LAB PAGES</span><div className="catalog-search"><label htmlFor="mechatronics-lab-select">Experiment<select id="mechatronics-lab-select" aria-label="Choose mechatronics experiment" value={selectedLabId} onChange={event=>setSelectedLabId(event.target.value)}>{MECHATRONICS_GROUPS.map((group,index)=><optgroup key={group} label={group}>{MECHATRONICS_LABS.filter(item=>item.group===index).map(item=><option key={item.id} value={item.id}>{item.title}</option>)}</optgroup>)}</select></label></div><CompleteReport report={fullReport} title={report.title} summary={report.summary} id="mechatronics-report-title"/></section>
  <p className="motor-attribution">Selected original ME417 records by Seyit Kubilay Uluçay, March–May 2024. Course examples retain their authorship; the excerpts do not represent new tests or a validated full-PID controller.</p></article>;
}


function BekoSensingProjectDetail({onExhibit}){
 return <article className="case-study motor-case beko-sensing-case"><button className="text-link" onClick={()=>onExhibit('projects')}>← All projects</button><span className="eyebrow">BEKO · R&D ADVANCED SENSOR TECHNOLOGIES · INTERNSHIP</span><h1 className="catalog-title" tabIndex={-1}>Floor sensing<br/><span>in an R&amp;D team.</span></h1><p className="lead">An R&D internship contributing to sensor-based floor detection for robot-vacuum applications. The work connected test setup, measurement data, analysis and embedded integration within Beko's Advanced Sensor Technologies team.</p>
  <p>I worked on the sensing rig, collected and preprocessed measurement data, analyzed it in Minitab and supported embedded integration within the Advanced Sensor Technologies team.</p>
  <p>We used the rig measurements and embedded tests to guide iterations. I documented the test observations and integration findings for internal review.</p>
  <section className="motor-explanation" aria-label="Floor-sensing internship contributions"><div><h2>Test setup &amp; data acquisition</h2><p>Supported the test-rig and sensing setup used to evaluate floor-detection behavior. The work brought sensor integration and data acquisition together so observations from the setup could feed the team's analysis and testing.</p></div><div><h2>Preprocessing the measurements</h2><p>Prepared sensor measurements for analysis and organized the collected data for comparison. This preprocessing connected the experimental readings with the modeling and evaluation work.</p></div><div><h2>Analysis and modeling in Minitab</h2><p>Used Minitab for data analysis and statistical modeling as part of the sensing investigation. The analysis supported interpretation of the measurements and discussion of the next development steps with the R&D team.</p></div><div><h2>Embedded sensor integration</h2><p>Contributed to integrating and testing the sensing path in an embedded setup. This connected the analysis work with implementation and provided feedback for subsequent testing and iteration.</p></div><div><h2>Testing and iteration</h2><p>Combined test observations with data analysis to support evaluation and refinement. The contribution was part of an R&D process, where measurement, implementation and testing informed one another.</p></div><div><h2>Documentation and team collaboration</h2><p>Recorded test observations, analysis work and integration findings for team review. The internship provided experience working within a wider sensor-development team rather than presenting the complete system as an individual project.</p></div></section>
  <p className="motor-attribution">R&D internship contribution: Seyit Kubilay Uluçay, Beko Advanced Sensor Technologies, July–August 2024. Internal reports, images, source code, device identifiers, model parameters and proprietary results are not shared here.</p></article>;
}
export default function ProjectsPage({detail,onExhibit,catalog,onCatalogChange,sharedReduced}){
 const {query,category}=catalog;
 const [dialog,setDialog]=useState(null);
 const pageRef=useRef(null);
 const setQuery=value=>onCatalogChange(state=>({...state,query:value,scrollY:0}));
 const setCategory=value=>onCatalogChange(state=>({...state,category:value,scrollY:0}));
 const project=projects.find(item=>item.id===detail);
 useEffect(()=>{const frame=requestAnimationFrame(()=>{document.querySelector('.catalog-title')?.focus({preventScroll:true});window.scrollTo(0,detail?0:catalog.scrollY);});return()=>cancelAnimationFrame(frame);},[detail]);
 useEffect(()=>{
  const content=pageRef.current?.querySelector(':scope > .catalog, :scope > .case-study');
  if(!content?.animate||sharedReduced||matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.routeTransition==='shared')return;
  const animation=content.animate([
   {opacity:0,transform:'translateY(8px)'},
   {opacity:1,transform:'translateY(0)'}
  ],{duration:220,easing:'cubic-bezier(0.22, 1, 0.36, 1)'});
  return()=>animation.cancel();
 },[detail,sharedReduced]);
 const filtered=projects.filter(item=>(category==='All'||item.category===category)&&[item.title,item.course,item.summary,...item.topics].join(' ').toLowerCase().includes(query.toLowerCase()));
function link(href){if(href.startsWith('exhibit:')){onExhibit(href.slice(8));}}
return <main ref={pageRef} className="projects-page"><PortfolioHeader onExhibit={onExhibit} onCV={()=>setDialog('cv')} current={detail?'projects/'+detail:'projects'}/>{detail?project?project.id==='motor'?<MotorProjectDetail onExhibit={onExhibit} reduced={sharedReduced}/>:project.id==='gimbal'?<GimbalProjectDetail onExhibit={onExhibit} reduced={sharedReduced}/>:project.id==='bms'?<BMSProjectDetail onExhibit={onExhibit} reduced={sharedReduced}/>:project.id==='zumo'?<ZumoProjectDetail onExhibit={onExhibit} reduced={sharedReduced}/>:project.id==='power-tool'?<PowerToolProjectDetail onExhibit={onExhibit}/>:project.id==='pv-design'?<PVDesignProjectDetail onExhibit={onExhibit}/>:project.id==='wind-study'?<WindStudyProjectDetail onExhibit={onExhibit}/>:

project.id==='plc-sequences'?<PLCSequencesProjectDetail onExhibit={onExhibit}/>:

project.id==='electronics-labs'?<ElectronicsLabsProjectDetail onExhibit={onExhibit}/>:
project.id==='mechatronics-labs'?<MechatronicsLabsProjectDetail onExhibit={onExhibit}/>:

project.id==='beko-sensing'?<BekoSensingProjectDetail onExhibit={onExhibit}/>:
<article className="case-study"><button className="text-link" onClick={()=>onExhibit('projects')}>← All projects</button><span className="eyebrow">{project.course} / {project.kind}</span><h1 className="catalog-title" tabIndex={-1}>{project.title}</h1><p className="lead">{project.summary}</p>{project.exhibit&&<button className="enter-exhibit" onClick={()=>onExhibit(project.exhibit)}>Enter the interactive exhibit →</button>}{project.image&&<figure className="case-image"><img src={project.image} alt={'Original '+project.title+' project material'}/><figcaption>Original project material</figcaption></figure>}<div className="case-body"><section><h2>The work</h2>{project.work.map(p=><p key={p}>{p}</p>)}<h2>Scope &amp; limitations</h2><p>{project.limits}</p><h2>Attribution</h2><p>{project.credit}</p></section><aside><span className="eyebrow">EVIDENCE &amp; MATERIAL</span>{project.evidence.length?project.evidence.map(([label,href])=>href.startsWith('exhibit:')?<button className="text-link" key={href} onClick={()=>link(href)}>{label} →</button>:<a className="text-link" key={href} href={href} target="_blank" rel="noreferrer">{label} ↗</a>):<p>Coursework summary. Raw course archives, supplied solutions and personal submission details are not reproduced.</p>}<p className="case-tags">{project.topics.join(' / ')}</p></aside></div><Illustration key={project.id} project={project}/></article>:<section className="catalog"><h1 className="catalog-title" tabIndex={-1}>Project not found.</h1><button className="text-link" onClick={()=>onExhibit('projects')}>← All projects</button></section>:<ProjectIndex filtered={filtered} query={query} category={category} setQuery={setQuery} setCategory={setCategory} onExhibit={onExhibit}/ >}{dialog&&<Dialog kind={dialog} onClose={()=>setDialog(null)} onExhibit={onExhibit}/>}</main>;}
