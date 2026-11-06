import {useEffect,useRef,useState} from 'react';
import {Dialog} from './App';
import projects from './projectCatalog.json';
import projectEvidence from './projectEvidence.json';
import ZoomImage from './ZoomImage';
import PortfolioHeader from './PortfolioHeader';
import RealBuildButton from './RealBuildButton';
import TeammateText from './TeammateText';
import {ArrowLeft,ArrowUp} from 'lucide-react';
const featuredMedia={
 bms:{src:'/projects/bms/back.png',alt:'The assembled BMS board and its capacitor-balancing components.'},
 motor:{src:'/projects/motor/overall-motor.jpeg',alt:'The hand-built axial-flux motor and its test setup on the lab bench.'},
 gimbal:{src:'/projects/gimbal/stabilizer.jpeg',alt:'The physical three-axis gimbal with printed brackets, servos and exposed electronics.'},
 zumo:{src:'/projects/zumo/zumo-on-mission.png',alt:'The Zumo robot on the original object-counting course.'}
};
function ProjectIndex({onExhibit}){
 const groups=[
  {id:'experience',title:'Professional experience',items:projects.filter(project=>project.category==='Experience')},
  {id:'builds',title:'Selected builds',items:Object.keys(featuredMedia).map(id=>projects.find(project=>project.id===id)).filter(Boolean)},
  {id:'labs',title:'Laboratory work',items:projects.filter(project=>project.id.endsWith('-labs'))},
  {id:'studies',title:'Studies & software',items:projects.filter(project=>!project.exhibit&&!project.id.endsWith('-labs')&&project.category!=='Experience')}
 ];
 function openProject(event,id){if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();onExhibit('projects/'+id);}
 return <section className="catalog catalog-curated">
  <h1 className="catalog-title" tabIndex={-1}>Engineering<br/><span>projects.</span></h1>
  <p className="lead">Motors, battery systems and controls. Built hardware, simulation studies and recorded bench work.</p>
  {groups.filter(group=>group.items.length).map(group=><section className={'catalog-group catalog-group-'+group.id} key={group.id} aria-labelledby={'group-'+group.id}>
  <div className="catalog-group-heading"><h2 id={'group-'+group.id}>{group.title}</h2></div>
   {group.id==='builds'?<div className="selected-projects">{group.items.map((project,index)=><article className="selected-project" key={project.id}>
    <div className="selected-project-link" data-project={project.id}>
     <img className="selected-project-image" src={featuredMedia[project.id].src} alt={featuredMedia[project.id].alt} width="660" height="440" loading={index===0?'eager':'lazy'} decoding="async"/>
    <div className="selected-project-copy"><span className="eyebrow">{project.tools.join(' / ')}{project.year&&<> · <time>{project.year}</time></>}</span><h3><a className="project-title-link" href={'#/projects/'+project.id} onClick={event=>openProject(event,project.id)}>{project.title}</a></h3><p><TeammateText>{project.summary}</TeammateText></p></div>
    </div>
  </article>)}</div>:<div className="catalog-list">{group.items.map((project,index)=><article className="catalog-row" key={project.id}><span className="catalog-number">{String(index+1).padStart(2,'0')}</span><div><span className="eyebrow">{project.tools.join(' / ')}{project.year&&<> · <time>{project.year}</time></>}</span><h3><a className="project-title-link" href={'#/projects/'+project.id} onClick={event=>openProject(event,project.id)}>{project.title}</a></h3><p><TeammateText>{project.summary}</TeammateText></p></div></article>)}</div>}
  </section>)}
  <div className="catalog-end"><a href="mailto:kubiulucay@gmail.com">kubiulucay@gmail.com</a><span>Kubilay Uluçay</span></div>
 </section>;
}
function Illustration({project}){const [value,setValue]=useState(45);const rc=project.id==='circuit-labs'||project.id==='mechatronics-labs',software=project.category==='Software'||project.category==='Embedded';return <section className="project-diagram"><span className="eyebrow">{rc?'TRY A CONCEPT':'THE WORKFLOW'} · EXPLANATORY</span><svg viewBox="0 0 600 170" role="img" aria-label={rc?'Illustrative RC charge curve':software?'Input, processing and output workflow':'Design, observation and evaluation workflow'}>{rc?<><path d="M35 15 V140 H580" fill="none" stroke="#5f7467"/><path d={Array.from({length:80},(_,i)=>`${i?'L':'M'}${35+i*6.8},${140-110*(1-Math.exp(-i/(5+value/4)))}`).join(' ')} fill="none" stroke="#d9b289" strokeWidth="3"/><text x="48" y="30" fill="#b4c2b5">capacitor voltage</text></>:<>{(software?['INPUT','PROCESS','OBSERVE']:['DESIGN','TEST','EVALUATE']).map((s,i)=><g key={s}><rect x={15+i*200} y="45" width="170" height="75" rx="8" fill="#27372e" stroke="#6a8471"/><text x={100+i*200} y="89" fill="#d9c5ab" fontSize="15" textAnchor="middle">{s}</text>{i<2&&<path d={`M${185+i*200} 82 h30 m-9 -5 l9 5 -9 5`} fill="none" stroke="#c3a07b"/>}</g>)}</>}</svg>{rc&&<><label>Relative time constant <input aria-label="Relative time constant" type="range" min="1" max="100" value={value} onChange={e=>setValue(+e.target.value)}/></label><p>A larger RC time constant slows the rise in this dimensionless circuit model.</p></>}</section>;}
function ProjectPhotos({photos,label,primary=false,exhibit,onExhibit,reduced,embedded=false}){
 return <>
  {exhibit&&!embedded&&<RealBuildButton kind={exhibit} reduced={reduced} label={'Open '+(exhibit==='bms'?'BMS':exhibit[0].toUpperCase()+exhibit.slice(1))+' exhibit'} onNavigate={()=>onExhibit(exhibit)}/>}
  <section className={'motor-photo-grid'+(primary?' case-evidence':'')} aria-label={label}>{photos.map(([src,alt,caption])=><figure key={src}><ZoomImage src={src} alt={alt}/><figcaption><strong>{caption}</strong><span>{alt}</span></figcaption></figure>)}</section>
 </>;
}
function ProjectSection({title,children,photos,...photoProps}){
 return <section className="case-section" aria-label={title}>
  <h2>{title}</h2>
  <div className="case-section-copy">{children}</div>
  {photos&&<ProjectPhotos {...photoProps} photos={photos} label={title+' figures'}/>}
 </section>;
}
function CaseNavigation({onProjects,onInteractive}){
 return <nav className="case-navigation" aria-label="Project navigation">
  <button type="button" className="text-link" onClick={onProjects}><ArrowLeft size={16} aria-hidden="true"/>Projects</button>
  {onInteractive&&<button type="button" className="text-link case-return" onClick={onInteractive}><ArrowUp size={16} aria-hidden="true"/>Back to interactive</button>}
 </nav>;
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
function LabWalkthrough({group,items,onSelect,target}){
 function readReport(identifier){onSelect(identifier);document.getElementById(target)?.scrollIntoView({block:'start'});document.getElementById(target)?.querySelector('select,a')?.focus({preventScroll:true});}
 return <section className="lab-walkthrough" aria-label="Experiments at the bench">
  <span className="eyebrow">EXPERIMENTS AT A GLANCE</span>
  <div className="lab-walkthrough-list">{items.map(item=>{
   const evidence=projectEvidence[group][item.id],figure=evidence.figures[0];
   return <article className="lab-walkthrough-row" key={item.id}>
    <div className="lab-walkthrough-copy"><h2>{item.number?'Lab '+item.number+' · ':''}{item.title}</h2><p>{item.summary}</p><button className="text-link" onClick={()=>readReport(item.id)}>{evidence.sourcePages?'Read selected pages':'Read complete report'} <span className="lab-report-pages">{evidence.pages} pages</span></button></div>
    <figure><ZoomImage src={figure.src} alt={figure.description}/><figcaption><strong>{figure.caption}</strong><span>{figure.description}</span><small>{evidence.sourcePages?'Original report':'Report'} · p. {figure.page}</small></figcaption></figure>
   </article>;
  })}</div>
 </section>;
}
function MotorProjectDetail({onExhibit,reduced,embedded=false}){
 const Title=embedded?'h2':'h1';
 const photos=[
  ['/projects/motor/motor-inside-wiring.jpeg','Nine hand-wound copper coils seated on the stator supports.','Stator windings'],
  ['/projects/motor/overall-motor.jpeg','The completed motor assembly and test setup on the lab bench.','Completed motor at the bench'],
  ['/projects/motor/coil-winding.jpeg','Copper wire being guided around a coil former between printed end supports.','Preparing a copper winding'],
  ['/projects/motor/winding-fixture.jpeg','The winding fixture and printed supports positioned on the lab bench tooling.','Winding fixture and tooling'],
  ['/projects/motor/transmitter-wiring.jpeg','Solder side of the transmitter perfboard, showing the connecting wires and header joints.','Transmitter board · solder side'],
  ['/projects/motor/receiver-wiring.jpeg','Solder side of the receiver perfboard, showing the connecting wires and header joints.','Receiver board · solder side']
 ];
 return <article className="case-study motor-case">
  {!embedded&&<CaseNavigation onProjects={()=>onExhibit('projects')}/>}
  <span className="eyebrow">UNIVERSITY BUILD / AXIAL-FLUX MOTOR</span>
  <Title className="catalog-title" tabIndex={-1}>An axial-flux motor,<br/><span>built by hand.</span></Title>
  <p className="lead">A hand-wound stator, printed supports and a shared-axis rotor assembly, completed in two months and presented in class. Original photographs and lab footage document the build.</p>
  <p><TeammateText>Implemented the transmitter, receiver and Arduino code. Shared winding and assembly with my classmate Tuna; motor CAD by him as well.</TeammateText></p>
  <p>Used paired NRF24L01 modules to send potentiometer commands between the Arduino transmitter and motor-side Arduino receiver and ESC. The recorded bench test shows the completed motor running.</p>
  <ProjectSection title="Preparing the stator windings" photos={photos.slice(2,4)}>
   <p>Prepared the copper windings on printed formers with a bench winding setup. The close-up records the winding process; the wider view shows the fixture and tooling used during construction.</p>
  </ProjectSection>
  <ProjectSection title="Hand-wound stator and twin rotors" photos={photos.slice(0,2)} primary exhibit="motor" onExhibit={onExhibit} reduced={reduced} embedded={embedded}>
   <p>Nine stationary copper coils sit between two magnet rotor plates on a common shaft. The open assembly shows the windings; the bench photograph shows how the printed supports hold the completed motor together.</p>
  </ProjectSection>
  <ProjectSection title="Arduino and NRF24L01 speed control" photos={photos.slice(4,6)}>
   <p>The transmitter Arduino reads the potentiometer and sends the speed command through an NRF24L01 module. A second NRF24L01 receives it at the motor-side Arduino, which commands the ESC; the DC source supplies the motor through the ESC.</p>
   <p>The original transmitter and receiver photographs show the solder side of each perfboard, recording the connecting wires and header joints.</p>
  </ProjectSection>
  <section className="motor-video-section" aria-labelledby="motor-video-title"><div><span className="eyebrow">ORIGINAL PROJECT FOOTAGE</span><h2 id="motor-video-title">A look at the lab test.</h2><p>Original recorded footage of the completed motor operating on the lab bench.</p></div><video controls playsInline preload="metadata" poster="/projects/motor/overall-motor.jpeg"><source src="/projects/motor/motor-preview.webm" type="video/webm"/><source src="/projects/motor/motor-video.mp4" type="video/mp4"/><p>Your browser does not support embedded video. Use the browser’s media controls or try another format.</p></video></section>
  <p className="motor-attribution"><TeammateText>Two-person project with Tuna, who created the motor CAD. Original media: Kubilay Uluçay. The interactive scene is an illustrative explanation of the real build.</TeammateText></p>
 </article>;
}
function GimbalProjectDetail({onExhibit,reduced,embedded=false}){
 const Title=embedded?'h2':'h1';
 const photos=[
  ['/projects/gimbal/cad-design.png','CAD layout of nested gimbal brackets and the payload tray.','Mechanical layout · CAD'],
  ['/projects/gimbal/stabilizer.jpeg','Built three-axis gimbal with printed brackets, servo motors and control electronics.','Three-axis mechanism'],
  ['/projects/gimbal/gimball-side.jpeg','Side view of the modified printed brackets, servo joints and connecting leads.','Bracket and servo assembly'],
  ['/projects/gimbal/phone-data.jpeg','A phone mounted in the gimbal with gyroscope traces visible on screen.','Phone gyroscope comparison'],
  ['/projects/gimbal/controller-nano.jpeg','Arduino Nano mounted on the gimbal control perfboard with its connecting leads.','Gimbal Arduino Nano controller'],
  ['/projects/gimbal/controller-solder-side.jpeg','Rear of the gimbal control perfboard, showing solder joints and the bundled connecting wires.','Gimbal control board · solder side']
 ];
 return <article className="case-study motor-case gimbal-case">
  {!embedded&&<CaseNavigation onProjects={()=>onExhibit('projects')}/>}
  <span className="eyebrow">MECHATRONICS / THREE-AXIS CAMERA GIMBAL</span>
  <Title className="catalog-title" tabIndex={-1}>A three-axis gimbal,<br/><span>bringing mechanics and sensing together.</span></Title>
  <p className="lead">A servo-driven camera support combines adapted printed mechanics with onboard gyroscope sensing. Phone and sensor readings were compared for feedback and cross-checking during the build.</p>
  <p><TeammateText>Developed the Arduino code and assembled and integrated the three-axis mechanism with my classmate Tuna. CAD adaptation by him as well.</TeammateText></p>
  <p>Observed the servo response while cross-checking phone and onboard gyroscope readings. The photographs and traces document the assembled rig and sensing checks; the interactive counter-rotation is an idealized explanation, not a measured stabilization-accuracy result.</p>
  <ProjectSection title="Nested brackets and servo axes" photos={[photos[0],photos[2]]}>
   <p>The mechanics were adapted from a sourced design into three nested axes. The CAD view shows the bracket arrangement; the side photograph shows the printed joints, servo positions and connecting leads on the built mechanism.</p>
    <p>Adapted the originally battery-powered design for bench use with a 5 V adapter supplying the Arduino and servo-control setup.</p>
  </ProjectSection>
  <ProjectSection title="Assembling the camera support" photos={photos.slice(1,2)} primary exhibit="gimbal" onExhibit={onExhibit} reduced={reduced} embedded={embedded}>
   <p>Each servo moves one stage while supporting the next bracket and payload. The completed assembly brings the printed frame, motors and electronics together around the central phone or camera mount.</p>
  </ProjectSection>
  <ProjectSection title="Arduino sensing and servo control" photos={[photos[4],photos[5]]}>
   <p>The wired perfboard assembly carries the Arduino Nano used in the gimbal build. The front and rear views show the controller, connecting leads and soldered joints for the sensing and servo-control electronics.</p>
  </ProjectSection>
  <ProjectSection title="MPU6050 setup and servo outputs" photos={[
   ['/projects/gimbal/imu-servo-setup.png','Original Arduino IDE capture showing MPU6050 calibration offsets, DMP initialization, interrupt handling and servo attachments to pins 10, 9 and 8.','Original Arduino IMU and servo setup']
  ]}>
   <p>The original Arduino configuration applies the gyroscope offsets, initializes the MPU6050 DMP and enables interrupt-driven data handling. The captured setup also attaches the three servo outputs to digital pins 10, 9 and 8.</p>
  </ProjectSection>
  <ProjectSection title="Cross-checking gyroscope feedback" photos={[photos[3]]}>
   <p>The phone supplied an additional motion-data source for comparison with the onboard gyroscope. The mounted-phone capture shows the traces used to cross-check sensing while observing the rig's response.</p>
  </ProjectSection>
  <ProjectSection title="Recorded phone gyroscope measurements" photos={[
   ['/projects/gimbal/phone-gyro-x.png','Original phone gyroscope X-axis recording from the gimbal project.','Phone gyroscope · X'],
   ['/projects/gimbal/phone-gyro-y.png','Original phone gyroscope Y-axis recording from the gimbal project.','Phone gyroscope · Y'],
   ['/projects/gimbal/phone-gyro-z.png','Original phone gyroscope Z-axis recording from the gimbal project.','Phone gyroscope · Z']
  ]}>
   <p>Recorded the phone gyroscope along X, Y and Z during the build. These original plots show the captured signals without deriving a new stabilization-accuracy figure.</p>
   <p>The phone and Arduino data streams were started manually and had a timing offset. The figures are presented as separate recordings rather than a synchronized tracking-error comparison.</p>
  </ProjectSection>
  <p className="motor-attribution"><TeammateText>Two-person build with Tuna, who handled the CAD adaptation. Original project CAD and photographs accompany an explanatory model of the nested-axis mechanism.</TeammateText></p>
 </article>;
}
const BMS_REPORTS={
 ee401:{...projectEvidence['bms-research'],label:'Senior Project 1 · Research (EE401)',description:'Fall 2024 · Research and proposal report.',download:'Senior-Project-1-Research-EE401.pdf'},
 ee402:{label:'Senior Project 2 · Implementation (EE402)',description:'Spring 2025 · Build and implementation report.',src:'/projects/bms/SeniorYearProject2.pdf',download:'Senior-Project-2-Implementation-EE402.pdf'}
};
function BMSProjectDetail({onExhibit,reduced,embedded=false}){
 const Title=embedded?'h2':'h1';
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
  ['/projects/bms/kicad-schematic.png','KiCad electrical schematic of the four-cell BMS, AQV254R balancing switches, INA333 sensing and STM32F407 Discovery connections.','Electrical schematic'],
  ['/projects/bms/simulink.png','MATLAB/Simulink model of cell sensing, capacitor switching, controller logic and load paths.','Balancing model · Simulink'],
  ['/projects/bms/balancing.png','Cell-voltage traces from the charging simulation as the control algorithm cycles the transfer network.','Balancing response · simulation']
 ];
 return <article className="case-study motor-case bms-case">
  {!embedded&&<CaseNavigation onProjects={()=>onExhibit('projects')}/>}
  <span className="eyebrow">EE401 / EE402 · BATTERY MANAGEMENT</span>
  <Title className="catalog-title" tabIndex={-1}>A battery manager,<br/><span>built around cell balance.</span></Title>
  <p className="lead">A built four-cell lithium-ion BMS pairs a custom circuit board with an STM32F407 Discovery controller, sensing paths, a protection switch and capacitor-based active balancing.</p>
  <p>In the reported charging simulation, summed cell-voltage differences fell from <strong>302.94 mV to 2.93 mV</strong>: a <strong>99.0% reduction</strong> at approximately <strong>27,040 s of simulated time</strong>. <a className="text-link" href="/projects/bms/SeniorYearProject2.pdf#page=33" target="_blank" rel="noreferrer">Charging result · report p. 33</a></p>
  <p><TeammateText>Developed the BMS and ran all MATLAB/Simulink simulations. Built the sensing and switched-capacitor hardware around an STM32 controller, with PCB drawings by Atahan.</TeammateText></p>
  <p>Simulated charge transfer between neighboring cells and recorded the cell-voltage response. The board photographs and EE402 report document fabrication and controller integration; the balancing traces are simulation results.</p>
  <ProjectSection title="Cell sensing and STM32 control" photos={photos.slice(0,2)} primary exhibit="bms" onExhibit={onExhibit} reduced={reduced} embedded={embedded}>
   <p>The assembled board combines cell-voltage dividers, INA333 current-signal conditioning and temperature sensing. The underside photograph shows the STM32F407 Discovery controller mounted beneath the custom circuit.</p>
  </ProjectSection>
  <ProjectSection title="Capacitor transfer and protection" photos={[photos[3]]}>
   <p>The schematic connects four series cells to sensing paths and a switched-capacitor network. A selected capacitor takes charge from the higher-voltage cell and transfers it to its neighbor; the BD135 low-side switch provides the pack's disconnect path.</p>
  </ProjectSection>
  <ProjectSection title="Routing the custom board" photos={[photos[2]]}>
   <p>The PCB layout translates the sensing and switching connections into copper routes around the controller footprint. This design was used alongside component assembly and STM32 firmware integration in EE402.</p>
  </ProjectSection>
  <ProjectSection title="Active balancing in MATLAB/Simulink" photos={photos.slice(4)}>
   <p>The block model brings cell sensing, switching logic and load paths together. The plotted cell-voltage traces show the simulated balancing response as the charge-transfer network cycles.</p>
  </ProjectSection>
  <section className="case-section" aria-label="Research and implementation reports"><h2>Research through implementation</h2><p>EE401 documents the research and proposed architecture. EE402 follows with the fabricated electronics, STM32 integration and balancing simulations.</p></section>
  <section className="bms-report-section" aria-labelledby="bms-report-title">
   <span className="eyebrow">ORIGINAL PROJECT REPORTS</span>
   <div className="bms-report-switcher" role="group" aria-label="Choose BMS report">{Object.entries(BMS_REPORTS).map(([id,item])=><button key={id} type="button" aria-pressed={selectedReport===id} onClick={()=>{setSelectedReport(id);setEe401Viewer({url:null,loading:id==='ee401',error:null});setReportRevision(n=>n+1);}}>{item.label}</button>)}</div>
   <div className="bms-report-heading"><div><span className="eyebrow">SELECTED REPORT</span><h2 id="bms-report-title">{report.label}</h2><p>{report.description}</p></div><div className="bms-report-links">{reportUrl?<><a className="text-link" href={reportUrl} target="_blank" rel="noreferrer">Open selected PDF</a><a className="text-link" href={reportUrl} download={report.download}>Download selected PDF</a></>:<span className="bms-report-loading" role={ee401Viewer.error?'alert':'status'}>{ee401Viewer.error||'Preparing report…'}</span>}</div></div>
   <div className="bms-pdf-frame">{reportUrl?<iframe key={reportUrl} src={reportUrl+'#view=FitH'} title={report.label+' PDF'} loading="lazy"/>:<div className="bms-pdf-loading" role={ee401Viewer.error?'alert':'status'}>{ee401Viewer.error||'Preparing report…'}</div>}</div>
  </section>
  <p className="motor-attribution">Senior-year team project: custom BMS hardware, schematic and MATLAB/Simulink balancing results documented in the EE402 report.</p>
 </article>;
}
function ZumoProjectDetail({onExhibit,reduced,embedded=false}){
 const Title=embedded?'h2':'h1';
 const photos=[['/projects/zumo/zumo-on-mission.png','The Zumo robot on the competition course during an object-counting run.','On-course run · original project photo'],['/projects/zumo/zumo-on-black-surface.png','Zumo chassis positioned on the dark course surface near the white boundary.','Robot and course surface · original project photo']];
 const [code,setCode]=useState(''),[copied,setCopied]=useState(false);
 useEffect(()=>{let active=true;fetch('/projects/zumo/firmware.ino').then(r=>{if(!r.ok)throw new Error();return r.text();}).then(t=>{if(active)setCode(t);}).catch(()=>{if(active)setCode('Firmware text is unavailable.');});return()=>{active=false;};},[]);
 async function copyCode(){try{await navigator.clipboard.writeText(code);setCopied(true);setTimeout(()=>setCopied(false),1800);}catch{setCopied(false);}}
 return <article className="case-study motor-case zumo-case">{!embedded&&<CaseNavigation onProjects={()=>onExhibit('projects')}/>}<span className="eyebrow">EE321 · ZUMO OBJECT-COUNTING ROBOT</span><Title className="catalog-title" tabIndex={-1}>A line-following robot,<br/><span>working the boundary.</span></Title><p className="lead">A Zumo robot combined reflectance sensing with an infrared object sensor to traverse a dark course, respond to its white boundary and record object detections across repeated scans.</p>
  <p><TeammateText>Implemented the navigation, counting logic and integration in the team project with Yunus Emre Ozan. Calibrated the reflectance array for the white boundary and used the IR sensor for detections.</TeammateText></p>
  <p>Recorded detections across repeated scans and reported the largest observed count through the LED and buzzer. The course photographs, report and firmware document the runs and counting logic.</p>
  <ProjectSection title="Sensing the course boundary" photos={[photos[1]]} primary exhibit="zumo" onExhibit={onExhibit} reduced={reduced} embedded={embedded}>
   <p>The six-channel reflectance array distinguishes the dark course from its white perimeter after calibration. The robot's position near the boundary shows where left/right sensor groups trigger a turn; the IR sensor handles object detections during movement.</p>
  </ProjectSection>
  <ProjectSection title="Scanning and recording detections" photos={[photos[0]]}>
   <p>During a boundary scan, IR detections increment a count with a short debounce delay. The firmware stores counts across repeated scans and reports the largest observed count through the LED and buzzer. The course photograph documents the robot during an object-counting run.</p>
  </ProjectSection>
  <section className="bms-report-section" aria-labelledby="zumo-report-title"><span className="eyebrow">ORIGINAL PROJECT REPORT</span><div className="bms-report-heading"><div><span className="eyebrow">EE321 · FINAL REPORT</span><h2 id="zumo-report-title">Zumo robot project report</h2><p><TeammateText>Original team report · Kubilay Ulucay and Yunus Emre Ozan</TeammateText></p></div><div className="bms-report-links"><a className="text-link" href="/projects/zumo/zumo-report.pdf" target="_blank" rel="noreferrer">Open report</a><a className="text-link" href="/projects/zumo/zumo-report.pdf" download="EE321-Zumo-Project-Report.pdf">Download report</a></div></div><div className="bms-pdf-frame"><iframe src="/projects/zumo/zumo-report.pdf#view=FitH" title="EE321 Zumo project report PDF" loading="lazy"/></div></section>
  <section className="bms-report-section zumo-firmware" aria-labelledby="zumo-code-title"><span className="eyebrow">ORIGINAL TEAM FIRMWARE</span><div className="bms-report-heading"><div><h2 id="zumo-code-title">Zumo counting firmware</h2><p>Team source file · code shown in-page for inspection.</p></div><div className="bms-report-links"><button className="text-link" type="button" onClick={copyCode} disabled={!code||code.startsWith('Firmware text is unavailable')}>{copied?'Copied':'Copy code'}</button><a className="text-link" href="/projects/zumo/firmware.ino" download="EE321-Zumo-Team-Firmware.ino">Download firmware</a></div></div><pre className="zumo-code-viewer"><code>{code||'Loading original firmware…'}</code></pre></section><p className="motor-attribution"><TeammateText>Original Zumo photographs, report and firmware document the EE321 team project. Team credit: Kubilay Ulucay and Yunus Emre Ozan.</TeammateText></p></article>;
}
function PowerToolProjectDetail({onExhibit}){
 const [code,setCode]=useState(''),[copied,setCopied]=useState(false);
 useEffect(()=>{let active=true;fetch('/projects/coursework/dispatch-excerpt.txt').then(r=>{if(!r.ok)throw new Error();return r.text();}).then(t=>{if(active)setCode(t);}).catch(()=>{if(active)setCode('Dispatch excerpt is unavailable.');});return()=>{active=false;};},[]);
 async function copyCode(){try{await navigator.clipboard.writeText(code);setCopied(true);setTimeout(()=>setCopied(false),1800);}catch{setCopied(false);}}
 return <article className="case-study motor-case power-tool-case"><CaseNavigation onProjects={()=>onExhibit('projects')}/><span className="eyebrow">EE303 · MATLAB APP DESIGNER</span><h1 className="catalog-title" tabIndex={-1}>Power flow &amp;<br/><span>economic dispatch.</span></h1><p className="lead">A MATLAB App Designer submission that presents a four-bus network view and a three-generator economic-dispatch model in one interface.</p>
  <p>Built the App Designer interface and implemented the three-generator dispatch calculation. The callback solves equal-marginal-cost equations with demand balance, then calculates each generator's output and quadratic cost.</p>
  <p>Connected the network inputs, demand and branch-flow fields in the same interface. The original screenshot and callback excerpt show the application and calculation.</p>
  <ProjectSection title="Four-bus network in App Designer" photos={[
    ['/projects/coursework/power-tool.png','Original App Designer interface with four buses, generator inputs, demand and branch-flow output fields.','Complete App Designer interface']
  ]}>
   <p>The interface connects generator settings at buses 1–3 to the demand at bus 4. Network coefficients and branch-flow fields sit beside the schematic, so the model's inputs and outputs can be read together.</p>
   <ul><li><strong>Generator controls:</strong> select the sources and input parameters.</li><li><strong>Bus 4:</strong> enter the modeled demand.</li><li><code>P12</code>, <code>P13</code>, <code>P14</code>, <code>P23</code>, <code>P24</code>: branch-flow outputs.</li></ul>
  </ProjectSection>
  <section className="bms-report-section power-code" aria-labelledby="power-code-title"><span className="eyebrow">SOURCE EXCERPT</span><div className="bms-report-heading"><div><h2 id="power-code-title">Economic-dispatch calculation</h2><p>The callback uses each generator's α, β and γ cost coefficients and the bus-4 demand. It solves the equal-marginal-cost equations and demand balance, then calculates the three generator outputs and quadratic costs.</p></div><div className="bms-report-links"><button className="text-link" type="button" onClick={copyCode} disabled={!code||code.startsWith('Dispatch excerpt is unavailable')}>{copied?'Copied':'Copy excerpt'}</button><a className="text-link" href="/projects/coursework/dispatch-excerpt.txt" download="EE303-economic-dispatch-callback-excerpt.txt">Download excerpt</a></div></div><pre className="project-code-viewer"><code>{code||'Loading callback excerpt…'}</code></pre></section>
  <p className="motor-attribution">EE303 MATLAB App Designer project by Kubilay Uluçay, presented through its original interface screenshot and economic-dispatch source excerpt.</p></article>;
}
function PVDesignProjectDetail({onExhibit}){
 const report='/projects/coursework/pv-complete.pdf';
 return <article className="case-study motor-case pv-design-case"><CaseNavigation onProjects={()=>onExhibit('projects')}/><span className="eyebrow">EE473–573 · 2025 · PVsyst DESIGN STUDY</span><h1 className="catalog-title" tabIndex={-1}>Off-grid residential<br/><span>PV design.</span></h1><p className="lead">A 2025 academic sizing and feasibility study for a standalone home system in Kocaeli, modeled in PVsyst with battery storage.</p>
  <ProjectSection title="Autonomy and system cost">
    <p><TeammateText>Completed most of the sizing and PVsyst work in the study with Mehmet Fatih Karaosman. Sized the system around winter demand and three days of autonomy.</TeammateText></p>
    <p>Calculated approximately 389,000 TL upfront against 6,240 TL in annual grid spending using May 2025 estimates: about 62 years of simple payback before maintenance, battery replacement and financing. At those prices, grid electricity was the cheaper option where available.</p>
   <a className="text-link" href={report+'#page=10'} target="_blank" rel="noreferrer">Financial assessment · report p. 10</a>
  </ProjectSection>
  <ProjectSection title="Household demand and array sizing" photos={[
   ['/projects/coursework/pv-hourly-load-profile.png','The daily energy table and hourly demand profile used as PVsyst load inputs.','Household load profile']
  ]}>
   <p>The hourly demand profile provides the sizing input for the off-grid system: about 250 kWh per month. The study pairs that load with eight 580 W modules, arranged as two strings of four on a south-facing plane tilted 40°.</p>
  </ProjectSection>
  <ProjectSection title="Storage and simulated annual output" photos={[
   [projectEvidence['pv-design'].figures[0].src,'Original PVsyst annual-output and monthly-performance charts from report page '+projectEvidence['pv-design'].figures[0].page+'.','Annual simulation and monthly performance']
  ]}>
   <p>A 48 V battery system targets three days of autonomy. With Kocaeli weather data, the PVsyst model estimates 6,539.0 kWh available from the array and 3,043.3 kWh supplied to the household; the charts show how performance varies across the year.</p>
  </ProjectSection>
  <section className="bms-report-section pv-report" aria-labelledby="pv-report-title"><span className="eyebrow">COMPLETE PROJECT REPORT</span><div className="bms-report-heading"><div><h2 id="pv-report-title">PV design report</h2><p>Complete 11-page 2025 report, including system design, simulation results, financial assessment and references.</p></div><div className="bms-report-links"><a className="text-link" href={report} target="_blank" rel="noreferrer">Open complete report</a><a className="text-link" href={report} download="EE473-573-PV-Design-Complete-Report.pdf">Download complete report</a></div></div><div className="bms-pdf-frame"><iframe src={report+'#view=FitH'} title="EE473–573 complete PV design report PDF" loading="lazy"/></div></section>
  <p className="motor-attribution"><TeammateText>2025 PVsyst design study by Seyit Kubilay Uluçay and Mehmet Fatih Karaosman, presented through the complete 11-page report and its original load-profile figure.</TeammateText></p></article>;
}
function WindStudyProjectDetail({onExhibit}){
 const reports=[
  {id:'analysis',label:'Analysis report · 10 pages',title:'Wind-farm analysis report',description:'Original 10-page EE101 report covering the problem, configuration comparison and study conclusion.',src:'/projects/powerworld/101-analysis.pdf',download:'EE101-Wind-Farm-Analysis-Report.pdf'},
  {id:'experiments',label:'Experiments · 29 pages',title:'All experiments and explanations',description:'Original 29-page companion documenting the 27 PowerWorld configurations and their individual explanations.',src:'/projects/powerworld/101-experiments.pdf',download:'EE101-Wind-Farm-Experiments-and-Explanations.pdf'}
 ];
 const [selectedReport,setSelectedReport]=useState('analysis');
 const report=reports.find(item=>item.id===selectedReport);
 return <article className="case-study motor-case wind-study-case"><CaseNavigation onProjects={()=>onExhibit('projects')}/><span className="eyebrow">EE101 · 2022 · POWERWORLD STUDY</span><h1 className="catalog-title" tabIndex={-1}>Wind-farm interconnection<br/><span>trade-offs.</span></h1><p className="lead">A PowerWorld study comparing ways to connect a hypothetical 200 MW wind farm to an existing network, with 27 configurations assessed for cost, losses and loading limits.</p>
  <ProjectSection title="Selected configuration: Experiment 9">
    <p>Compared 27 PowerWorld configurations and recommended CONDOR links to PETE and PAI. Only two configurations were feasible in the study; Experiment 9 gave the preferred loading, loss and estimated five-year cost trade-off.</p>
    <p>The model showed both CONDOR links at about 91% loading and 20.11 MW total system losses. Considered loading feasibility and estimated cost alongside losses when making the recommendation.</p>
   <a className="text-link" href="/projects/powerworld/101-analysis.pdf#page=8" target="_blank" rel="noreferrer">Selection rationale · analysis report p. 8</a>
  </ProjectSection>
  <ProjectSection title="Connecting wind generation to the network" photos={[[
   '/projects/powerworld/WindTurbineExp.png','PowerWorld operating case with a 200 MW wind source, bus voltages, branch-loading meters and a 20.11 MW loss readout.','PowerWorld interconnection model'
  ]]}>
   <p>The study adds a hypothetical 200 MW wind source to an existing network. The one-line view makes its effect visible through bus voltages, branch-loading meters and the total system-loss readout.</p>
  </ProjectSection>
  <ProjectSection title="Comparing conductor and substation choices" photos={[[projectEvidence['wind-study'].figures[0].src,'Configuration capture from experiment report page '+projectEvidence['wind-study'].figures[0].page+', with branch loading and system-loss readouts.','One of the studied network configurations']]}>
   <p>Twenty-seven PowerWorld configurations compare construction cost, electrical losses and overload constraints. The experiment capture records one configuration; the complete companion document contains the individual comparisons.</p>
  </ProjectSection>
  <section className="bms-report-section wind-report" aria-labelledby="wind-report-title"><span className="eyebrow">ORIGINAL PROJECT DOCUMENTS</span><div className="bms-report-switcher" role="group" aria-label="Choose wind-study document">{reports.map(item=><button key={item.id} type="button" aria-pressed={selectedReport===item.id} onClick={()=>setSelectedReport(item.id)}>{item.label}</button>)}</div><div className="bms-report-heading"><div><h2 id="wind-report-title">{report.title}</h2><p>{report.description}</p></div><div className="bms-report-links"><a className="text-link" href={report.src} target="_blank" rel="noreferrer">Open selected PDF</a><a className="text-link" href={report.src} download={report.download}>Download selected PDF</a></div></div><div className="bms-pdf-frame"><iframe key={report.id} src={report.src+'#view=FitH'} title={report.title+' PDF'} loading="lazy"/></div></section>
  <p className="motor-attribution">EE101 educational study by Kubilay Uluçay, with the complete 10-page analysis and 29-page experiment document alongside original PowerWorld model captures.</p></article>;
}
function PLCSequencesProjectDetail({onExhibit}){
 const report={title:'EE392 team project report',description:'Original 11-page report covering both control scenarios, their HMIs and the team\'s test observations.',src:'/projects/plc/EE392.pdf',download:'EE392-Team-Project-Report.pdf'};
 const figures=projectEvidence['plc-sequences'].figures;
 return <article className="case-study motor-case plc-sequences-case"><CaseNavigation onProjects={()=>onExhibit('projects')}/><span className="eyebrow">EE392 · INDUSTRIAL AUTOMATION · TEAM PROJECT</span><h1 className="catalog-title" tabIndex={-1}>PLC sequences<br/><span>&amp; operator HMIs.</span></h1><p className="lead"><TeammateText>A shared EE392 team project with class mates Berke Çeçen, Genco Güven and Efe Can Özhan. Exploring two classroom control scenarios in Control Expert: a traffic-light sequencer with after-hours operation and a timed claw game with an operator HMI.</TeammateText></p>
  <p>Developed and checked the control logic within the team. Used explicit states and timers to connect operator inputs to the traffic-light modes and claw sequence.</p>
  <p>Inspected mode changes, HMI states and internal counters in Control Expert simulation. The report records those operating states and observations.</p>
  <ProjectSection title="Traffic-light sequencing in Control Expert" photos={[[
   '/projects/plc/plc.jpg','State diagrams connect timer conditions to the two light groups and the start, stop and after-hours transitions.','Light groups L1–L3 and L2–L4'
  ]]}>
   <p>The team modeled the light sequence in Schneider EcoStruxure Control Expert. Two light groups move through red, yellow and green states using timers; after-hours mode changes the sequence to flashing yellow.</p>
  </ProjectSection>
  <ProjectSection title="Operator controls and light states" photos={[[
   figures['traffic-hmi'].src,'The HMI shows the lamp states and system indicator beside Start, Stop and After Hours controls.','Traffic-light HMI · report p. 4'
  ]]}>
   <p>The HMI connects the PLC sequence to operator inputs. The two captures show the same junction interface in different operating states.</p>
   <ul><li><strong>Start / Stop:</strong> run or stop the sequence.</li><li><strong>After Hours:</strong> select the flashing-yellow mode.</li><li><strong>System indicator:</strong> show whether the controller is running.</li></ul>
  </ProjectSection>
  <ProjectSection title="Claw movement and gripper sequence" photos={[[
   figures['claw-sequence'].src,'The sequence diagram links positioning to the gripper opening, lowering, closing and lifting stages.','Claw-game sequence · report p. 7'
  ]]}>
   <p>The second PLC scenario uses a coin input and a 90-second positioning window. After positioning, the gripper follows a staged open, lower, close, lift and release sequence.</p>
  </ProjectSection>
  <ProjectSection title="Game inputs on the HMI" photos={[[
   figures['claw-hmi'].src,'The first screen waits for a coin; the active-game screen exposes directional controls and a countdown.','Claw-game HMI · report p. 9'
  ]]}>
   <p>Momentary inputs connect the HMI to the game sequence and directional motor commands.</p>
   <ul><li><code>S0</code>: coin accepted.</li><li><code>B0</code>: start the claw cycle.</li><li><code>X2</code> / <code>X3</code>: negative / positive X motion.</li><li><code>X4</code> / <code>X5</code>: negative / positive Y motion.</li></ul>
  </ProjectSection>
  <ProjectSection title="Tracking game-state variables" photos={[[
   figures['state-table'].src,'The animation table exposes game counters and the stored day value alongside system words.','PLC animation table · report p. 11'
  ]]}>
   <p>The Control Expert animation table was used to inspect internal state while the simulation ran. The capture shows these named values:</p>
   <ul><li><code>Total_Number_Of_Games_Played</code>: game counter.</li><li><code>Total_Number_Of_Wins</code>: win counter.</li><li><code>Day_Of_Last_Win</code>: stored day value.</li></ul>
  </ProjectSection>
  <section className="bms-report-section plc-sequences-report" aria-labelledby="plc-report-title"><span className="eyebrow">ORIGINAL TEAM REPORT</span><div className="bms-report-heading"><div><h2 id="plc-report-title">{report.title}</h2><p>{report.description}</p></div><div className="bms-report-links"><a className="text-link" href={report.src} target="_blank" rel="noreferrer">Open report</a><a className="text-link" href={report.src} download={report.download}>Download report</a></div></div><div className="bms-pdf-frame"><iframe src={report.src+'#view=FitH'} title={report.title+' PDF'} loading="lazy"/></div></section>
  <p className="motor-attribution"><TeammateText>Team project and original material: Berke Çeçen, Efe Can Özhan, Genco Güven and Kubilay Uluçay. One shared EE392 report covers both control scenarios.</TeammateText></p></article>;
}


const ELECTRONICS_LABS=[
 {id:'lab01',title:'Bench measurements & diode curves',summary:'Used a DC supply, breadboard and multimeter to measure node and resistor voltages, calculate current from resistance and record diode I–V curves.'}
];
function ElectronicsLabsProjectDetail({onExhibit}){
 const [selectedLabId,setSelectedLabId]=useState('lab01');
 const report=ELECTRONICS_LABS.find(item=>item.id===selectedLabId);
 const fullReport=projectEvidence['electronics-labs'][selectedLabId];
 return <article className="case-study motor-case electronics-labs-case"><CaseNavigation onProjects={()=>onExhibit('projects')}/><span className="eyebrow">EE301 · SELECTED BENCH WORK · FALL 2023</span><h1 className="catalog-title" tabIndex={-1}>Bench measurements<br/><span>&amp; diode curves.</span></h1><p className="lead">Selected bench records show breadboard connections, DC measurements with a multimeter and diode current–voltage observations.</p>
  <p>Wired the circuits and used the DC supply and multimeter to record node and resistor voltages. Calculated current from the voltage across a known resistor and compared the recorded curves for different diode types.</p>
  <LabWalkthrough group="electronics-labs" items={ELECTRONICS_LABS} onSelect={setSelectedLabId} target="electronics-reports"/>
  <section id="electronics-reports" className="bms-report-section electronics-reports" aria-labelledby="electronics-report-title"><CompleteReport report={fullReport} title={report.title} summary={report.summary} id="electronics-report-title"/></section>
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
 return <article className="case-study motor-case mechatronics-labs-case"><CaseNavigation onProjects={()=>onExhibit('projects')}/><span className="eyebrow">ME417 · SELECTED LAB WORK · 2024</span><h1 className="catalog-title" tabIndex={-1}>Sensors, timing<br/><span>&amp; motor response.</span></h1><p className="lead">Four selected studies connect analog sensing, timing waveforms, two-board communication and observed motor-position response.</p>
  <p>Wired and documented the sensing and timing setups, then adapted the course examples for communication between two Arduino boards. Recorded the sensor response, oscillator waveform and I²C behavior, and compared the motor-position readings at different proportional gains.</p>
  <LabWalkthrough group="mechatronics-labs" items={MECHATRONICS_LABS} onSelect={setSelectedLabId} target="mechatronics-reports"/>
  <section id="mechatronics-reports" className="bms-report-section mechatronics-reports" aria-labelledby="mechatronics-report-title"><span className="eyebrow">SELECTED ORIGINAL LAB PAGES</span><div className="catalog-search"><label htmlFor="mechatronics-lab-select">Experiment<select id="mechatronics-lab-select" aria-label="Choose mechatronics experiment" value={selectedLabId} onChange={event=>setSelectedLabId(event.target.value)}>{MECHATRONICS_GROUPS.map((group,index)=><optgroup key={group} label={group}>{MECHATRONICS_LABS.filter(item=>item.group===index).map(item=><option key={item.id} value={item.id}>{item.title}</option>)}</optgroup>)}</select></label></div><CompleteReport report={fullReport} title={report.title} summary={report.summary} id="mechatronics-report-title"/></section>
  <p className="motor-attribution">Selected original ME417 records by Seyit Kubilay Uluçay, March–May 2024. Course examples retain their authorship; the excerpts do not represent new tests or a validated full-PID controller.</p></article>;
}


function AccentureExperienceDetail({onExhibit}){
 return <article className="case-study motor-case accenture-experience-case"><CaseNavigation onProjects={()=>onExhibit('projects')}/><span className="eyebrow">ACCENTURE · INDUSTRY X · JANUARY 2026–PRESENT</span><h1 className="catalog-title" tabIndex={-1}>Engineering verification<br/><span>at Accenture.</span></h1><p className="lead">Quality Assurance Engineer working on requirements-based verification for clinical-laboratory automation at a global pharmaceutical company.</p>
  <ProjectSection title="Requirements, tests and implementation">
   <p>Develop Python/Gherkin black-box tests from technical requirements and expected system behavior. Refactor test functions and state-change checks, with implementation changes reviewed through GitLab merge requests.</p>
  </ProjectSection>
  <ProjectSection title="Execution and failure investigation">
   <p>Run automated test suites locally and in existing GitLab/AWS pipelines. Read execution reports, investigate failures and distinguish test defects from suspected product issues.</p>
  </ProjectSection>
  <ProjectSection title="Traceability and issue reporting">
  <p>Maintain links between requirements, test records and defects in Codebeamer. Submitted 40 log-backed issue reports over five months, supporting triage of test defects and suspected product issues.</p>
  </ProjectSection>
  <p className="motor-attribution">Professional experience: Accenture Industry X, January 2026–present. Client-specific requirements, source code and internal test results remain confidential.</p>
 </article>;
}
function BekoSensingProjectDetail({onExhibit}){
 return <article className="case-study motor-case beko-sensing-case"><CaseNavigation onProjects={()=>onExhibit('projects')}/><span className="eyebrow">BEKO · R&D ADVANCED SENSOR TECHNOLOGIES · INTERNSHIP</span><h1 className="catalog-title" tabIndex={-1}>Floor sensing<br/><span>in an R&amp;D team.</span></h1><p className="lead">An R&D internship in Beko's Advanced Sensor Technologies team, developing sensor-based floor detection for robot-vacuum applications. The work connected a motorized test rig, measurement processing, statistical modelling and embedded trials.</p>
  <ProjectSection title="Motorized test rig and data acquisition">
   <p>Built a motorized test rig to exercise the sensing setup across various environments and configurations. Adapted acquisition code to collect sensor measurements, connecting the physical test setup with the data used for analysis.</p>
  </ProjectSection>
  <ProjectSection title="Measurement processing in Python and Excel">
   <p>Preprocessed approximately <strong>650,000 logged data points</strong> using Python and Excel. Applied filtering and summary statistics, then organized the measurements for comparison and modelling.</p>
  </ProjectSection>
  <ProjectSection title="Regression modelling in Minitab">
   <p>Developed regression models in Minitab from the prepared measurements to support floor-type prediction. Connected the statistical analysis with the sensing investigation and the subsequent embedded implementation.</p>
  </ProjectSection>
  <ProjectSection title="Embedded integration and project trials">
   <p>Integrated the model into embedded firmware and evaluated floor-type prediction in project trials, achieving <strong>83.5% prediction success in those trials</strong>.</p>
   <p>Used test observations to guide iterations and documented analysis and integration findings for internal team review. The reported outcome describes the project trials.</p>
  </ProjectSection>
  <p className="motor-attribution">R&D internship contribution: Seyit Kubilay Uluçay, Beko Advanced Sensor Technologies, July–August 2024. Internal reports, images, source code, device identifiers, model parameters and proprietary results are not shared here.</p></article>;
}
export default function ProjectsPage({detail,onExhibit,catalog,onCatalogChange,sharedReduced,embedded=false,focusCase=false}){
 const [dialog,setDialog]=useState(null);
 const pageRef=useRef(null);
 const project=projects.find(item=>item.id===detail);
 useEffect(()=>{if(embedded&&!focusCase)return;const frame=requestAnimationFrame(()=>{pageRef.current?.querySelector('.catalog-title')?.focus({preventScroll:true});if(embedded)pageRef.current?.scrollIntoView({block:'start'});else window.scrollTo(0,detail?0:catalog.scrollY);});return()=>cancelAnimationFrame(frame);},[detail,embedded,focusCase]);
 useEffect(()=>{
  const content=pageRef.current?.querySelector(':scope > .catalog, :scope > .case-study');
  if(embedded||!content?.animate||sharedReduced||matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.routeTransition==='shared')return;
  const animation=content.animate([
   {opacity:0,transform:'translateY(8px)'},
   {opacity:1,transform:'translateY(0)'}
  ],{duration:220,easing:'cubic-bezier(0.22, 1, 0.36, 1)'});
  return()=>animation.cancel();
 },[detail,sharedReduced,embedded]);
function link(href){if(href.startsWith('exhibit:')){onExhibit(href.slice(8));}}
if(embedded){
 const Detail={motor:MotorProjectDetail,gimbal:GimbalProjectDetail,bms:BMSProjectDetail,zumo:ZumoProjectDetail}[detail];
 function returnToExhibit(){onExhibit(detail);const page=document.querySelector('.exhibit-page');page?.scrollIntoView({block:'start'});page?.querySelector('#scene-controls button,#exhibit-controls button,.zumo-controls button')?.focus({preventScroll:true});}
 return <section ref={pageRef} className="projects-page exhibit-case-study" aria-label={project?.title+' technical case study'}><CaseNavigation onProjects={()=>onExhibit('projects')} onInteractive={returnToExhibit}/>{Detail&&<Detail onExhibit={onExhibit} reduced={sharedReduced} embedded/>}</section>;
}
return <main ref={pageRef} className="projects-page"><PortfolioHeader onExhibit={onExhibit} onCV={()=>setDialog('cv')} current={detail?'projects/'+detail:'projects'}/>{detail?project?project.id==='motor'?<MotorProjectDetail onExhibit={onExhibit} reduced={sharedReduced}/>:project.id==='gimbal'?<GimbalProjectDetail onExhibit={onExhibit} reduced={sharedReduced}/>:project.id==='bms'?<BMSProjectDetail onExhibit={onExhibit} reduced={sharedReduced}/>:project.id==='zumo'?<ZumoProjectDetail onExhibit={onExhibit} reduced={sharedReduced}/>:project.id==='power-tool'?<PowerToolProjectDetail onExhibit={onExhibit}/>:project.id==='pv-design'?<PVDesignProjectDetail onExhibit={onExhibit}/>:project.id==='wind-study'?<WindStudyProjectDetail onExhibit={onExhibit}/>:
project.id==='plc-sequences'?<PLCSequencesProjectDetail onExhibit={onExhibit}/>:

project.id==='electronics-labs'?<ElectronicsLabsProjectDetail onExhibit={onExhibit}/>:
project.id==='mechatronics-labs'?<MechatronicsLabsProjectDetail onExhibit={onExhibit}/>:

project.id==='accenture-experience'?<AccentureExperienceDetail onExhibit={onExhibit}/>:
project.id==='beko-sensing'?<BekoSensingProjectDetail onExhibit={onExhibit}/>:
<article className="case-study"><button className="text-link" onClick={()=>onExhibit('projects')}>All projects</button><span className="eyebrow">{project.course} / {project.kind}</span><h1 className="catalog-title" tabIndex={-1}>{project.title}</h1><p className="lead">{project.summary}</p>{project.exhibit&&<button className="enter-exhibit" onClick={()=>onExhibit(project.exhibit)}>Enter the interactive exhibit</button>}{project.image&&<figure className="case-image"><img src={project.image} alt={'Original '+project.title+' project material'}/><figcaption>Original project material</figcaption></figure>}<div className="case-body"><section><h2>The work</h2>{project.work.map(p=><p key={p}>{p}</p>)}<h2>Design context</h2><p>{project.limits}</p><h2>Attribution</h2><p>{project.credit}</p></section><aside><span className="eyebrow">EVIDENCE &amp; MATERIAL</span>{project.evidence.length?project.evidence.map(([label,href])=>href.startsWith('exhibit:')?<button className="text-link" key={href} onClick={()=>link(href)}>{label}</button>:<a className="text-link" key={href} href={href} target="_blank" rel="noreferrer">{label}</a>):<p>Project overview and engineering contributions.</p>}<p className="case-tags">{project.topics.join(' / ')}</p></aside></div><Illustration key={project.id} project={project}/></article>:<section className="catalog"><h1 className="catalog-title" tabIndex={-1}>Project not found.</h1><button className="text-link" onClick={()=>onExhibit('projects')}>All projects</button></section>:<ProjectIndex onExhibit={onExhibit}/ >}{dialog&&<Dialog kind={dialog} onClose={()=>setDialog(null)} onExhibit={onExhibit}/>}</main>;}
