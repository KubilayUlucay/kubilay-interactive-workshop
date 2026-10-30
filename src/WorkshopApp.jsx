import {lazy,Suspense,useEffect,useRef,useState} from 'react';
import './exhibits.css';
const Motor=lazy(()=>import('./App')),Gimbal=lazy(()=>import('./GimbalExhibit')),BMS=lazy(()=>import('./BMSExhibit')),Zumo=lazy(()=>import('./ZumoExhibit')),Projects=lazy(()=>import('./ProjectsPage'));
const exhibits=['motor','gimbal','bms','zumo'];
const valid=id=>exhibits.includes(id)||id==='projects'||/^projects\/[a-z0-9-]+$/.test(id);
const normalizeRoute=id=>id==='projects/plc-traffic'||id==='projects/plc-claw'?'projects/plc-sequences':id;
const route=()=>{const id=normalizeRoute(location.hash.slice(1).replace(/^\//,''));return valid(id)?id:'motor';};
export default function WorkshopApp(){
 const currentRoute=useRef(route());
 const [selected,setSelected]=useState(route),[serial,setSerial]=useState(0),[reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [catalog,setCatalog]=useState({query:'',category:'All',scrollY:0});
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)'),change=e=>setReduced(e.matches);m.addEventListener('change',change);const back=()=>{const next=route();if(next===currentRoute.current)return;if(currentRoute.current==='projects')setCatalog(state=>({...state,scrollY:window.scrollY}));currentRoute.current=next;setSelected(next);setSerial(n=>n+1);};window.addEventListener('popstate',back);window.addEventListener('hashchange',back);return()=>{m.removeEventListener('change',change);window.removeEventListener('popstate',back);window.removeEventListener('hashchange',back);};},[]);
 function choose(requestedId){const id=normalizeRoute(requestedId);if(!valid(id)||id===selected)return;if(selected==='projects')setCatalog(state=>({...state,scrollY:window.scrollY}));history.pushState({exhibit:id},'',location.pathname+location.search+'#/'+id);currentRoute.current=id;setSelected(id);setSerial(n=>n+1);}
 const Exhibit=selected==='motor'?Motor:selected==='gimbal'?Gimbal:selected==='bms'?BMS:selected==='zumo'?Zumo:Projects;
 return <div className="portfolio-root" data-exhibit={selected}>{exhibits.includes(selected)&&<nav className="project-rail" aria-label="Workshop exhibits">{exhibits.map((id,i)=><button key={id} aria-current={id===selected?'page':undefined} onClick={()=>choose(id)}><span>{'0'+(i+1)}</span>{id==='bms'?'BMS':id[0].toUpperCase()+id.slice(1)}</button>)}</nav>}<Suspense fallback={<div className="exhibit-loading" role="status">Preparing the {selected} exhibit…</div>}><Exhibit detail={selected.startsWith('projects/')?selected.slice(9):undefined} key={selected.startsWith('projects')?'projects':serial} onExhibit={choose} catalog={catalog} onCatalogChange={setCatalog} sharedReduced={reduced} onReducedChange={setReduced}/></Suspense></div>;
}
