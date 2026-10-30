import {Layers3,Plus} from 'lucide-react';

export const GIMBAL_PARTS=[
 {id:'gimbal-yaw',n:'01',name:'Yaw pivot',detail:'Upper servo pivot turns the bracket around the vertical axis.'},
 {id:'gimbal-pitch',n:'02',name:'Pitch pivot',detail:'Side pivot tilts the payload forward and back.'},
 {id:'gimbal-roll',n:'03',name:'Roll cradle',detail:'Rear cradle pivot levels the phone tray.'},
 {id:'gimbal-payload',n:'04',name:'Phone tray',detail:'Illustrative phone payload sits inside the roll cradle.'},
 {id:'arduino-connections',n:'05',name:'Arduino & wiring',detail:'Arduino Nano and three servo harness connections; wire colours are illustrative.'}
];
export const BMS_PARTS=[
 {id:'bms-cells',n:'01',name:'Cell stack',detail:'Four illustrative cells feed sense leads into the balancing and protection circuit.'},
 {id:'bms-controller',n:'02',name:'STM32 controller',detail:'Controller assembly mounted beneath the main circuitry; geometry is illustrative.'},
 {id:'bms-cutoff',n:'03',name:'Load cutoff',detail:'The low-side switching path opens the load during the illustrated temperature fault.'},
 {id:'bms-caps',n:'04',name:'Balancing capacitors',detail:'Switched capacitors move charge between one adjacent cell pair at a time.'}
];
export const ZUMO_PARTS=[
 {id:'zumo-robot',n:'01',name:'Tracked chassis',detail:'Complete tracked robot assembly; the sensor nose leads the scan.'},
 {id:'zumo-tracks',n:'02',name:'Tracks and drive',detail:'Track belts and drive rollers move the chassis around the arena.'},
 {id:'zumo-controller',n:'03',name:'Controller board',detail:'Illustrative control board mounted above the tracked chassis.'},
 {id:'zumo-sensors',n:'04',name:'Sensors and LED',detail:'Front reflectance sensors follow the boundary; the IR sensor counts detections.'}
];
export function InspectionButton({label,selected,onClick,disabled=false}){return <button disabled={disabled} className={'inspect-button '+(selected?'selected':'')} aria-pressed={selected} onClick={onClick}><Layers3 size={18}/>{selected?'Reassemble':`Inspect ${label}`}</button>;}
export default function InspectionPanel({parts,selected,onSelect,label='Assembly'}){const part=parts.find(p=>p.id===selected)||parts[0];return <aside className="inspection-panel" aria-label={label+' components'}><span className="eyebrow">EXPLODED INSPECTION</span><div className="parts-tabs">{parts.map(p=><button key={p.id} className={selected===p.id?'selected':''} aria-pressed={selected===p.id} aria-describedby={selected===p.id?'part-detail':undefined} onClick={()=>onSelect(p.id)}><span>{p.n}</span>{p.name}<Plus size={14}/></button>)}</div><p id="part-detail" className="part-detail" aria-live="polite"><strong>{part.name}</strong>{part.detail}</p></aside>;}
