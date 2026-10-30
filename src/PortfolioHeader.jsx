export default function PortfolioHeader({onExhibit,onCV,current}){
 return <header className="nav">
  <button className="brand" aria-label="Kubilay Uluçay home" title="About Kubilay Uluçay" onClick={()=>onExhibit?.('about')}><img src="/favicon.svg" alt=""/>Kubilay Uluçay<span className="brand-note">ENGINEER / MAKER</span></button>
  <nav aria-label="Portfolio">
   <button aria-current={current?.startsWith('projects')?'page':undefined} onClick={()=>onExhibit?.('projects')}>Projects</button>
   <button aria-current={current==='about'?'page':undefined} onClick={()=>onExhibit?.('about')}>About &amp; Contact</button>
   <button onClick={onCV}>CV</button>
  </nav>
 </header>;
}