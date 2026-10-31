import {lazy,Suspense,useEffect,useRef,useState} from 'react';
import {flushSync} from 'react-dom';
import {motion} from 'framer-motion';
import './exhibits.css';
const About=lazy(()=>import('./AboutPage')),Motor=lazy(()=>import('./App')),Gimbal=lazy(()=>import('./GimbalExhibit')),BMS=lazy(()=>import('./BMSExhibit')),Zumo=lazy(()=>import('./ZumoExhibit')),Projects=lazy(()=>import('./ProjectsPage'));
const exhibits=['motor','gimbal','bms','zumo'];
const valid=id=>exhibits.includes(id)||id==='about'||id==='projects'||/^projects\/[a-z0-9-]+$/.test(id);
const normalizeRoute=id=>id==='projects/plc-traffic'||id==='projects/plc-claw'?'projects/plc-sequences':id;
const route=()=>{const id=normalizeRoute(location.hash.slice(1).replace(/^\//,''));return valid(id)?id:'about';};
export default function WorkshopApp(){
 const currentRoute=useRef(route());
 const transitionRef=useRef(null),navigationVersion=useRef(0),photoRef=useRef(null),reducedRef=useRef(false),catalogScroll=useRef(0);
 const [selected,setSelected]=useState(route),[serial,setSerial]=useState(0),[reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [catalog,setCatalog]=useState({query:'',category:'All',scrollY:0});
 useEffect(()=>{reducedRef.current=reduced;if(reduced)transitionRef.current?.skipTransition();},[reduced]);
 useEffect(()=>{const previousScrollRestoration=history.scrollRestoration;history.scrollRestoration='manual';const m=matchMedia('(prefers-reduced-motion: reduce)'),change=event=>setReduced(event.matches);m.addEventListener('change',change);const back=()=>navigate(route(),false);window.addEventListener('popstate',back);window.addEventListener('hashchange',back);return()=>{history.scrollRestoration=previousScrollRestoration;m.removeEventListener('change',change);window.removeEventListener('popstate',back);window.removeEventListener('hashchange',back);navigationVersion.current++;transitionRef.current?.skipTransition();};},[]);
 function clearSharedPhoto(){document.querySelectorAll('[data-route-photo]').forEach(image=>{image.style.viewTransitionName='';delete image.dataset.routePhoto;});}
 function navigate(id,record){
  const previous=currentRoute.current;
  if(!valid(id)||id===previous)return;
  const version=++navigationVersion.current;
  const savedScroll=previous==='projects'?window.scrollY:null;
  transitionRef.current?.skipTransition();
  clearSharedPhoto();
  let oldPhoto=null;
  if(previous==='projects'&&id.startsWith('projects/')){
   oldPhoto=document.querySelector('.catalog-curated a[href="#/'+id+'"] img');
   if(oldPhoto)photoRef.current={project:id,src:oldPhoto.getAttribute('src')};
  }else if(id==='projects'&&photoRef.current?.project===previous){
   oldPhoto=[...document.querySelectorAll('.case-study img')].find(image=>image.getAttribute('src')===photoRef.current.src);
  }
  const source=oldPhoto?.getAttribute('src');
  const update=()=>{
   if(version!==navigationVersion.current)return;
   if(record)history.pushState({exhibit:id},'',location.pathname+location.search+'#/'+id);
   currentRoute.current=id;
   if(savedScroll!==null)catalogScroll.current=savedScroll;
   flushSync(()=>{if(savedScroll!==null)setCatalog(state=>({...state,scrollY:savedScroll}));setSelected(id);setSerial(value=>value+1);});
   if(id.startsWith('projects'))document.querySelector('.catalog-title')?.focus({preventScroll:true});
   window.scrollTo(0,id==='projects'?catalogScroll.current:0);
  };
  if(oldPhoto&&!reducedRef.current&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&document.startViewTransition){
   oldPhoto.style.viewTransitionName='project-photo';oldPhoto.dataset.routePhoto='true';
   document.documentElement.dataset.routeTransition='shared';
   const transition=document.startViewTransition(()=>{
	update();
      if(version!==navigationVersion.current)return;
      const image=[...document.querySelectorAll('.projects-page img')].find(candidate=>candidate.getAttribute('src')===source);
      if(image){image.style.viewTransitionName='project-photo';image.dataset.routePhoto='true';image.loading='eager';return image.decode().catch(()=>{});}
   });
   transitionRef.current=transition;
   transition.ready.catch(()=>{});
   transition.finished.catch(()=>{}).finally(()=>{if(transitionRef.current===transition){transitionRef.current=null;clearSharedPhoto();delete document.documentElement.dataset.routeTransition;}});
  }else{delete document.documentElement.dataset.routeTransition;update();}
 }
 function choose(requestedId){navigate(normalizeRoute(requestedId),true);}
 const Exhibit=selected==='about'?About:selected==='motor'?Motor:selected==='gimbal'?Gimbal:selected==='bms'?BMS:selected==='zumo'?Zumo:Projects;
 return <div className="portfolio-root" data-exhibit={selected} data-motion={reduced?'reduced':'full'}>{exhibits.includes(selected)&&<nav className="project-rail" aria-label="Workshop exhibits">{exhibits.map((id,i)=><button key={id} aria-current={id===selected?'page':undefined} onClick={()=>choose(id)}><span>{'0'+(i+1)}</span>{id==='bms'?'BMS':id[0].toUpperCase()+id.slice(1)}{id===selected&&<motion.span className="exhibit-marker" layoutId="exhibit-marker" initial={false} aria-hidden="true" transition={{duration:reduced?0:0.22,ease:[0.22,1,0.36,1]}}/>}</button>)}</nav>}<Suspense fallback={<div className="exhibit-loading" role="status">Preparing the {selected} exhibit…</div>}><Exhibit detail={selected.startsWith('projects/')?selected.slice(9):undefined} key={selected.startsWith('projects')?'projects':serial} onExhibit={choose} catalog={catalog} onCatalogChange={setCatalog} sharedReduced={reduced} onReducedChange={setReduced}/></Suspense></div>;
}
