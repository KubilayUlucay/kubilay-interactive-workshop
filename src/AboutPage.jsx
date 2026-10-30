import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,Mail} from 'lucide-react';
import {Dialog} from './App';
import PortfolioHeader from './PortfolioHeader';

const builds=[
 {id:'motor',title:'Motor',detail:'Hand-wound axial flux',image:'/projects/motor/overall-motor.jpeg',alt:'The original hand-built axial-flux motor on the lab bench.'},
 {id:'gimbal',title:'Gimbal',detail:'Three-axis servo mechanism',image:'/projects/gimbal/stabilizer.jpeg',alt:'The physical three-axis gimbal with printed brackets and servos.'},
 {id:'bms',title:'BMS',detail:'Cell sensing & balancing',image:'/projects/bms/back.png',alt:'The assembled battery-management circuit and balancing components.'},
 {id:'zumo',title:'Zumo',detail:'Boundary sensing & scans',image:'/projects/zumo/zumo-on-mission.png',alt:'The original Zumo robot on its object-counting course.'}
];

export default function AboutPage({onExhibit}){
 const [dialog,setDialog]=useState(null);
 const headingRef=useRef(null);
 useEffect(()=>{window.scrollTo(0,0);headingRef.current?.focus({preventScroll:true});},[]);
 function openExhibit(event,id){if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();onExhibit(id);}
 return <main className="about-home">
  <PortfolioHeader onExhibit={onExhibit} onCV={()=>setDialog('cv')} current="about"/>
  <div className="home-content">
   <section className="home-summary" aria-labelledby="home-title">
    <span className="eyebrow">ELECTRICAL &amp; ELECTRONICS ENGINEER</span>
    <h1 id="home-title" ref={headingRef} tabIndex={-1}>Kubilay<br/><span>Uluçay.</span></h1>
    <p className="home-role">Test Engineer at Accenture, working with Python and PyTAF on lab-equipment verification.</p>
    <p className="home-bio">Özyeğin University graduate, June 2025. Drawn to R&amp;D where electronics, mechanics and code meet.</p>
    <div className="home-actions"><a className="home-contact text-link" href="mailto:kubiulucay@gmail.com"><Mail size={17}/>Get in touch</a><button className="text-link" onClick={()=>setDialog('cv')}>CV <ArrowUpRight size={17}/></button></div>
    <div className="home-socials"><a href="https://github.com/KubilayUlucay" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14}/></a><a href="https://linkedin.com/in/kubilayulucay" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14}/></a></div>
   </section>
   <section className="home-work" aria-labelledby="home-work-title">
    <div className="home-work-heading"><h2 id="home-work-title">The workshop</h2><button className="text-link" onClick={()=>onExhibit('projects')}>All projects <ArrowUpRight size={16}/></button></div>
    <div className="home-builds">{builds.map(build=><a className="home-build" key={build.id} href={'#/'+build.id} onClick={event=>openExhibit(event,build.id)}><img className="home-build-image" src={build.image} alt={build.alt} width="540" height="320" decoding="async"/><div className="home-build-copy"><div><h3>{build.title}</h3><span>{build.detail}</span></div><ArrowUpRight size={20} aria-hidden="true"/></div></a>)}</div>
   </section>
  </div>
  {dialog&&<Dialog kind={dialog} onClose={()=>setDialog(null)} onExhibit={onExhibit}/>}
 </main>;
}