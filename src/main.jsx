import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const qa = import.meta.env.DEV && new URLSearchParams(location.search).get('qa');
if (qa === 'mobile') {
  createRoot(document.getElementById('root')).render(<div style={{display:'flex',gap:28,padding:24,alignItems:'flex-start',background:'#353a36'}}>{[390,600].map(width=><iframe key={width} title={`Responsive review ${width}px`} src="/" style={{width,height:844,border:'1px solid #677',flexShrink:0}}/>)}</div>);
} else {
  createRoot(document.getElementById('root')).render(<App />);
}