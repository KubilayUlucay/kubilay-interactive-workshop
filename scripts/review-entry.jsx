// Review-only entry: Vite does not include this in the production build.
import '../src/main.jsx';
import { _roots } from '@react-three/fiber';
import { advanceSimulation } from '../src/simulation.js';
window.__reviewRoots = _roots;
window.__reviewAdvanceSimulation = advanceSimulation;
