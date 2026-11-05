const teammates=[
 {name:'Mehmet Fatih Karaosman',labels:['Mehmet Fatih Karaosman'],href:'https://www.linkedin.com/in/fatih-karaosman-a03802223/'},
 {name:'Tuna Çelebi',labels:['Tuna Çelebi','Tuna'],href:'https://www.linkedin.com/in/tuna-celebi/'},
 {name:'Atahan Dikeç',labels:['Atahan Dikeç','Atahan'],href:'https://www.linkedin.com/in/atahandikec/'},
 {name:'Berke Çeçen',labels:['Berke Çeçen'],href:'https://www.linkedin.com/in/berke-%C3%A7e%C3%A7en-146633301/'},
 {name:'Ahmet Genco Güven',labels:['Ahmet Genco Güven','Genco Güven'],href:'https://www.linkedin.com/in/ahmet-genco-g%C3%BCven-a1a842232/'}
];
const profiles=new Map(teammates.flatMap(teammate=>teammate.labels.map(label=>[label,teammate])));
const names=[...profiles.keys()].sort((first,second)=>second.length-first.length).join('|');
const namePattern=new RegExp('(?<![\\p{L}\\p{N}_])('+names+')(?![\\p{L}\\p{N}_])','gu');

export default function TeammateText({children}){
 if(typeof children!=='string')return children;
 return children.split(namePattern).map((text,index)=>{
  const teammate=profiles.get(text);
  return teammate?<a className="teammate-link" href={teammate.href} target="_blank" rel="noopener noreferrer" title={teammate.name+' on LinkedIn'} key={index}>{text}</a>:text;
 });
}